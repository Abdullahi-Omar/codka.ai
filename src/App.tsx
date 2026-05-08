/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import './index.css';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic2, 
  Play, 
  Pause, 
  Download, 
  Volume2, 
  Layers, 
  Zap, 
  CheckCircle2, 
  ChevronRight,
  Menu,
  X,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import { generateSomaliAudio } from './services/ttsService';

// Types
type Voice = {
  id: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
  name: string;
  category: string;
  description: string;
  gender: 'Dumar' | 'Rag';
};

const VOICES: Voice[] = [
  { 
    id: 'Zephyr', 
    name: 'Hani', 
    category: 'Xayeysiis (Ads)',
    description: 'Cod smooth ah, premium, oo ku habboon commercial-ka.', 
    gender: 'Dumar' 
  },
  { 
    id: 'Fenrir', 
    name: 'Cumar', 
    category: 'Tababar (Training)',
    description: 'Cod cad, authoritative ah, oo loogu talagalay corporate trainer.', 
    gender: 'Rag' 
  },
  { 
    id: 'Kore', 
    name: 'Laylo', 
    category: 'Podcast & Content',
    description: 'Cod dabiici ah oo ku habboon podcast iyo sheekooyinka.', 
    gender: 'Dumar' 
  },
  { 
    id: 'Charon', 
    name: 'Mustafe', 
    category: 'Wararka (News)',
    description: 'Cod culus oo deggan, ku fiican documentaries-ka.', 
    gender: 'Rag' 
  },
];

export default function App() {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<Voice>(VOICES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioVersion, setAudioVersion] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const TEMPLATES = [
    { 
      label: "Podcast", 
      text: "Ku soo dhawaada podcast-ka maanta. Waxaan kaga hadli doonaa horumarka tignoolajiyada iyo 10.5% kororka ku yimid isticmaalka AI ee dunida." 
    },
    { 
      label: "Ads", 
      text: "Hadda ka faa'iidayso 50% discount ah. Product-ka cusub waa mid aad u Innovation ah. Ha moogaan fursaddan premium-ka ah." 
    },
    { 
      label: "Training", 
      text: "Ku soo dhawaada tababarka maanta. Waxaan baran doonaa System-ka cusub. Fadlan raac 15.5 xeer ee muhiimka ah." 
    }
  ];

  // Cleanup audio URL to prevent memory leaks
  React.useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    try {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      
      const blob = await generateSomaliAudio(text, selectedVoice.id);
      const url = URL.createObjectURL(blob);
      
      setAudioUrl(url);
      setAudioVersion(prev => prev + 1);
      setIsPlaying(false);
    } catch (error) {
      console.error(error);
      alert("Waan ka xunnahay, waxaa dhacday cillad markii la soo saarayay codka.");
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `codhaye-somali-ai-${Date.now()}.wav`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1a1a1a] font-sans selection:bg-orange-200">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#F5F5F4]/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white rotate-3">
              <Mic2 size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">Codka.ai</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide uppercase">
            <a href="#hero" className="hover:text-orange-600 transition-colors">Hoyga</a>
            <a href="#adeegyada" className="hover:text-orange-600 transition-colors">Adeegyada</a>
            <a href="#qiimaha" className="hover:text-orange-600 transition-colors">Qiimaha</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="text-sm font-bold hover:text-orange-600 transition-colors">
              Gali (Login)
            </button>
            <button className="bg-black text-white px-7 py-3 rounded-xl hover:bg-orange-600 shadow-xl shadow-black/5 hover:shadow-orange-600/20 transition-all duration-300 font-bold text-sm">
              Bilow Hadda
            </button>
          </div>

          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl lg:text-8xl font-bold tracking-tighter leading-[0.85] mb-8 font-display">
              U beddel <span className="text-orange-600">Qoraalka</span> cod Soomaali ah.
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-md leading-relaxed">
              Tiknoolajiyad horumarsan oo loo adeegsaday AI si loo soo saaro codad dabiici ah oo tayadoodu sarreyso.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-orange-600 text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-700 shadow-2xl shadow-orange-600/20 transition-all text-lg">
                Bilow Hadda <ChevronRight size={22} />
              </button>
              <button className="px-10 py-5 rounded-2xl font-bold border-2 border-black/5 hover:bg-white transition-all text-lg flex items-center gap-2">
                Daawo Demo
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-10 rounded-[48px] shadow-[0_32px_64px_-15px_rgba(234,88,12,0.15)] border border-orange-100 relative group"
          >
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -tralsate-y-12 translate-x-12 w-64 h-64 bg-orange-200/20 blur-[100px] rounded-full -z-10 group-hover:bg-orange-300/30 transition-colors" />
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600/80">
                  Script-kaaga Af-Soomaaliga
                </label>
                <div className="flex gap-2">
                  {TEMPLATES.map((t, i) => (
                    <button 
                      key={i}
                      onClick={() => setText(t.text)}
                      className="text-[9px] font-bold bg-gray-100 hover:bg-orange-100 px-3 py-1 rounded-full transition-colors"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ku qor halkan... Tusaale: 25.5% dadka waxay jecelyihin Innovation-ka cusub."
                className="w-full h-56 p-8 bg-gray-50/50 rounded-3xl border-2 border-transparent focus:border-orange-500/20 focus:bg-white focus:ring-0 transition-all resize-none text-xl leading-relaxed placeholder:text-gray-300 shadow-inner"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {VOICES.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => setSelectedVoice(voice)}
                  className={`p-6 rounded-[28px] border-2 text-left transition-all duration-300 relative overflow-hidden group/voice ${
                    selectedVoice.id === voice.id 
                    ? 'border-orange-600 bg-orange-50/50 shadow-lg shadow-orange-600/5' 
                    : 'border-gray-100 hover:border-orange-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className={`font-bold text-xl transition-colors ${selectedVoice.id === voice.id ? 'text-orange-600' : 'text-gray-900'}`}>
                      {voice.name}
                    </p>
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${
                      voice.gender === 'Rag' ? 'bg-blue-500/10 text-blue-600' : 'bg-pink-500/10 text-pink-600'
                    }`}>
                      {voice.gender}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-orange-600/70 uppercase mb-2 tracking-wide">{voice.category}</p>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">{voice.description}</p>
                  
                  {selectedVoice.id === voice.id && (
                    <motion.div layoutId="activeVoice" className="absolute bottom-2 right-2 w-2 h-2 bg-orange-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !text.trim()}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-bold text-white transition-all ${
                  isGenerating || !text.trim() ? 'bg-gray-300' : 'bg-orange-600 hover:bg-orange-700 active:scale-95'
                }`}
              >
                {isGenerating ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Soo saar Codka <Volume2 size={20} /></>
                )}
              </button>

              {audioUrl && (
                <div className="flex gap-2">
                  <button 
                    onClick={togglePlay}
                    className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all"
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                  <button 
                    onClick={handleDownload}
                    className="w-14 h-14 border border-black/10 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all"
                  >
                    <Download size={24} />
                  </button>
                </div>
              )}
            </div>
            
            {audioUrl && (
              <audio 
                key={audioVersion}
                ref={audioRef} 
                src={audioUrl} 
                className="hidden" 
                onEnded={() => setIsPlaying(false)}
                onCanPlayThrough={() => console.log("Audio ready")}
                onError={(e) => {
                  const target = e.target as HTMLAudioElement;
                  console.error("Audio error:", target.error);
                }}
              />
            )}
          </motion.div>
        </div>
      </section>

      {/* Features section */}
      <section id="adeegyada" className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 font-display">Maxaad u dooranaysaa Codka.ai?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Waxaan bixinaa tignoolajiyada ugu tayada badan ee lagu farsameeyo codadka Af-Soomaaliga.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: <Zap className="text-orange-600" />, title: "Degdeg Dabiici ah", desc: "Soo saar codad dhowr ilbiriqsi gudahood." },
              { icon: <Layers className="text-orange-600" />, title: "Codad kala duwan", desc: "Ka dooro codad rag iyo dumarba leh oo leh heerar kala duwan." },
              { icon: <CheckCircle2 className="text-orange-600" />, title: "Tayo Sare", desc: "Cod cad oo ku habboon tayada istuudiyaha leeyahay." }
            ].map((feature, i) => (
              <div key={i} className="text-center p-8 rounded-3xl hover:bg-gray-50 transition-all group">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="qiimaha" className="py-24 px-6 bg-[#F5F5F4]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-display">Qiimaha Adeegyada</h2>
            <p className="text-gray-500">Dooro qorshaha kugu habboon.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: "Bilaash", 
                price: "$0", 
                features: ["500 xaraf bishii", "2 Cod oo dabiici ah", "Tayada caadiga ah"],
                button: "Ku Bilow Bilaash",
                popular: false
              },
              { 
                name: "Bilowga", 
                price: "$19", 
                features: ["10,000 xaraf bishii", "Dhammaan codadka", "Tayada HD", "Download aan xad lahayn"],
                button: "Soo Iibso Hadda",
                popular: true
              },
              { 
                name: "Ganacsiga", 
                price: "$49", 
                features: ["Xarfo aan xad lahayn", "Codad gaar ah", "API Access", "Taageero 24/7"],
                button: "Nagala soo xiriir",
                popular: false
              }
            ].map((plan, i) => (
              <div 
                key={i} 
                className={`p-8 rounded-[32px] border transition-all ${
                  plan.popular 
                  ? 'border-orange-600 bg-white scale-105 shadow-xl relative' 
                  : 'border-black/5 bg-white/50 hover:bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    Loogu Jecelyahay
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 text-sm">/bishii</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-gray-600">
                      <CheckCircle2 size={16} className="text-orange-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 rounded-full font-bold transition-all ${
                  plan.popular 
                  ? 'bg-orange-600 text-white hover:bg-orange-700' 
                  : 'bg-black text-white hover:bg-gray-800'
                }`}>
                  {plan.button}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white">
                <Mic2 size={18} />
              </div>
              <span className="text-xl font-bold tracking-tight">Codka.ai</span>
            </div>
            <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
              Codka.ai waa madasha koowaad ee Soomaalida ee u adeegsata AI soo saarista codadka tayada leh ee heer caalami.
            </p>
            <div className="flex gap-4">
              <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all">
                <MessageSquare size={18} />
              </button>
              <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all">
                <CreditCard size={18} />
              </button>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-orange-600 uppercase text-[10px] tracking-[0.2em]">Adeegyada</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-orange-600 transition-colors">Text to Speech</a></li>
              <li><a href="#" className="hover:text-orange-600 transition-colors">Enterprise Solution</a></li>
              <li><a href="#" className="hover:text-orange-600 transition-colors">Voice Cloning</a></li>
              <li><a href="#" className="hover:text-orange-600 transition-colors">API Access</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Shirkadda</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Nagu Saabsan</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Xirfado</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-white/10 text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} Codka.ai. Xuquuqda way dhowrantahay.
        </div>
      </footer>
    </div>
  );
}

