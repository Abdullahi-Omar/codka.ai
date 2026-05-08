# Codhaye AI - Somali Voiceover

Halkan waa tillaabooyinka aad ku shaqaysiin karto website-kan adigoo isticmaalaya GitHub iyo Vercel.

## 1. GitHub ku shub (Manual Upload)
1. Tag [GitHub.com](https://github.com) oo sameyso Repository cusub.
2. Ha ku darin README ama .gitignore markaad bilaabayso.
3. Guji xiriirka ah **"uploading an existing file"**.
4. Jiid (Drag & Drop) dhammaan faylasha ku jira galka aad ka soo bixisay ZIP-ka (KA REEB `node_modules`).
5. Guji **Commit changes**.

## 2. Vercel ku xidh (Deployment)
1. Tag [Vercel.com](https://vercel.com) oo ku gal akoonkaaga GitHub.
2. Guji **Add New** -> **Project**.
3. Dooro repository-ga aad hadda GitHub ka sameysay.
4. Inta aadan gujin **Deploy**, tag qaybta **Environment Variables**:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** Geli API Key-gaaga aad ka soo qaadatay AI Studio.
5. Guji **Deploy**.

## 3. Qaabaynta Muhiimka ah
Faylka `vercel.json` ayaa horay loogu daray koodhka si uu u maareeyo "Routing-ka" website-ka.

---
Mahadsanid!
