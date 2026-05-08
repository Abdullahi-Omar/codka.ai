import { GoogleGenAI, Modality } from "@google/genai";

let genAI: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  if (!genAI) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured. Please set VITE_GEMINI_API_KEY in your environment.");
    }
    genAI = new GoogleGenAI({ apiKey: apiKey as string });
  }
  return genAI;
}

/**
 * Adds a WAV header to raw PCM data.
 * Assumes 16-bit Mono PCM at 24000Hz (default for Gemini TTS).
 */
function pcmToWav(pcmBase64: string, sampleRate: number = 24000): Blob {
  const binaryString = atob(pcmBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);

  // RIFF identifier
  view.setUint32(0, 0x52494646, false); // "RIFF"
  // file length
  view.setUint32(4, 36 + len, true);
  // RIFF type
  view.setUint32(8, 0x57415645, false); // "WAVE"
  // format chunk identifier
  view.setUint32(12, 0x666d7420, false); // "fmt "
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (1 is PCM)
  view.setUint16(20, 1, true);
  // channel count
  view.setUint16(22, 1, true); // Mono
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sampleRate * numChannels * bitsPerSample/8)
  view.setUint32(28, sampleRate * 1 * 2, true);
  // block align (numChannels * bitsPerSample/8)
  view.setUint16(32, 1 * 2, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  view.setUint32(36, 0x64617461, false); // "data"
  // data chunk length
  view.setUint32(40, len, true);

  return new Blob([wavHeader, bytes], { type: 'audio/wav' });
}

export async function generateSomaliAudio(text: string, voiceName: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr' = 'Kore'): Promise<Blob> {
  const styles: Record<string, string> = {
    'Zephyr': 'ADU waa Hani (Dumar). Style: Commercial Voiceover. Cod smooth ah, premium ah, oo xayeysiis sare ku habboon.',
    'Fenrir': 'ADU waa Cumar (Rag). Style: Corporate Trainer. Cod cad, authoritative ah, oo muujinaya kalsooni iyo aqoon.',
    'Kore': 'ADU waa Laylo (Dumar). Style: Natural Podcast/Storyteller. Cod saaxiibtinimo leh oo dabiici ah.',
    'Charon': 'ADU waa Mustafe (Rag). Style: News/Documentary. Cod culus, xog-ogaal ah, oo deggan.',
  };

  const modelInstructions = `
    DIIWAANKA AKHRISKA (MANDATORY):
    1. BOQOLAYDA: Haddii aad aragto "%", u akhri "boqolkiiba". Tusaale: 25% = "boqolkiiba labaatan iyo shan".
    2. JAJABKA: Haddii aad aragto dhibic (.) u dhaxaysa lambaro, u akhri "dhibic". Tusaale: 15.5 = "toban iyo shan dhibic shan".
    3. NAMBARADA: Dhammaan nambarada u akhri af-Soomaali sax ah oo buuxa.
    4. ENGLISH WORDS: Haddii script-ga ay ku jiraan ereyo Ingiriis ah (sida "Innovation", "Marketing", "Content"), ereyadaas u akhri sidii qof u dhashay afka Ingiriisiga (Native English pronunciation). Ha u akhrin sidii Soomaali.
  `;

  const prompt = styles[voiceName] || 'U akhri qoraalkan Af-Soomaali si cad:';

  try {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `${prompt}\n\n${modelInstructions}\n\nSCRIPT-KA: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return pcmToWav(base64Audio);
    }
    throw new Error("Ma jiro cod la soo saaray.");
  } catch (error) {
    console.error("Cillad ka dhacday soo saarista codka:", error);
    throw error;
  }
}
