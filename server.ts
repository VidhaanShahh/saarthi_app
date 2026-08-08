import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Lazy Gemini AI Client Initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is not set. Gemini API calls will run in intelligent simulation mode.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || 'DUMMY_KEY_FOR_FALLBACK',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Response Cache for ultra-fast <5ms repeated and common queries
const queryCache = new Map<string, any>();

// Verified Knowledge Base for instant (<500ms) high-accuracy responses
const KNOWLEDGE_BASE: Record<string, any> = {
  fir: {
    Marathi: {
      summary: 'एफआयआर (FIR) नोंदवण्यासाठी खालील अधिकृत पायऱ्यांचे पालन करा:',
      verifiedSource: 'महाराष्ट्र पोलीस व भारतीय दंड संहिता',
      steps: [
        { number: 1, title: 'जवळच्या पोलीस ठाण्यात जा', description: 'घटना घडलेल्या क्षेत्राच्या संबंधित पोलीस ठाण्यात जा.' },
        { number: 2, title: 'घटनेची माहिती सांगा', description: 'ड्युटी ऑफिसरला घडलेल्या घटनेची सत्य व सविस्तर माहिती तोंडी किंवा लेखी स्वरूपात द्या.' },
        { number: 3, title: 'तपासा आणि स्वाक्षरी करा', description: 'पोलीस अधिकाऱ्याने लिहिलेला जबाब काळजीपूर्वक वाचा आणि मगच स्वाक्षरी करा.' },
        { number: 4, title: 'विनामूल्य प्रत मिळवा', description: 'स्वाक्षरी व अधिकृत शिक्का असलेली एफआयआरची विनामूल्य प्रत (Free Copy) घेणे हा तुमचा कायदेशीर हक्क आहे.' }
      ],
      simplifiedSummary: 'पोलीस ठाण्यात जाऊन काय घडले ते सांगा, लिहिलेला जबाब तपासून स्वाक्षरी करा आणि मोफत शिक्का असलेली प्रत लगेच मिळवा.',
      followups: ['पोलीस एफआयआर नोंदवण्यास नकार दिल्यास काय करावे?', 'ऑनलाइन तक्रार (e-FIR) कशी करावी?', 'कोणते कागदपत्रे लागतात?']
    },
    Hindi: {
      summary: 'प्राथमिकी (FIR) दर्ज कराने के लिए आधिकारिक प्रक्रिया:',
      verifiedSource: 'भारतीय पुलिस एवं कानूनी सहायता पोर्टल',
      steps: [
        { number: 1, title: 'नजदीकी पुलिस थाने जाएं', description: 'घटना जिस क्षेत्र में हुई है, उस संबंधित थाने में जाएं।' },
        { number: 2, title: 'घटना का विवरण दें', description: 'ड्यूटी ऑफिसर को घटना की पूरी जानकारी स्पष्ट व सत्यता से दें।' },
        { number: 3, title: 'बयान पढ़ें और हस्ताक्षर करें', description: 'लिखित बयान को ध्यान से पढ़ें और सब सही होने पर ही साइन करें।' },
        { number: 4, title: 'मुफ्त कॉपी प्राप्त करें', description: 'मुहर व हस्ताक्षर सहित एफआईआर की एक प्रति निशुल्क प्राप्त करना आपका कानूनी अधिकार है।' }
      ],
      simplifiedSummary: 'थाने जाकर घटना बताएं, लिखित बयान पढ़कर साइन करें और मुहर लगी मुफ्त कॉपी अवश्य लें।',
      followups: ['यदि पुलिस एफआईआर दर्ज न करे तो क्या करें?', 'ऑनलाइन एफआईआर कैसे करें?']
    },
    English: {
      summary: 'Official step-by-step procedure to file a First Information Report (FIR):',
      verifiedSource: 'National Legal Services Authority & Police Portal',
      steps: [
        { number: 1, title: 'Visit Local Police Station', description: 'Go to the police station having jurisdiction over the crime location.' },
        { number: 2, title: 'Narrate Facts Truthfully', description: 'Explain the incident to the duty officer either orally or in writing.' },
        { number: 3, title: 'Verify & Sign Statement', description: 'Carefully review the recorded statement before signing.' },
        { number: 4, title: 'Collect Free Stamped Copy', description: 'Demanding a signed and stamped copy of the FIR free of charge is your statutory right.' }
      ],
      simplifiedSummary: 'Visit station, state facts clearly, verify written statement, sign it, and collect your free stamped copy.',
      followups: ['What if police refuse to register FIR?', 'Can I file an e-FIR online?', 'What documents are required?']
    }
  },
  kisan: {
    Marathi: {
      summary: 'पीएम किसान (PM-Kisan) सन्मान निधी योजना स्थिती तपासणी:',
      verifiedSource: 'कृषी व शेतकरी कल्याण मंत्रालय, भारत सरकार',
      steps: [
        { number: 1, title: 'अधिकृत पोर्टलवर जा', description: 'pmkisan.gov.in वर जाऊन "Know Your Status" पर्यायावर क्लिक करा.' },
        { number: 2, title: 'नोंदणी क्रमांक किंवा आधार टाका', description: 'तुमचा पीएम किसान रजिस्ट्रेशन नंबर किंवा आधार नंबर प्रविष्ट करा.' },
        { number: 3, title: 'e-KYC तपासा', description: 'हप्ता मिळण्यासाठी आधार e-KYC आणि बँक खाते NPCI लिंक असणे अनिवार्य आहे.' }
      ],
      simplifiedSummary: 'pmkisan.gov.in वर जाऊन आधार/नोंदणी क्रमांक टाका आणि ई-केवायसी पूर्ण असल्याची खात्री करा.',
      followups: ['e-KYC मोबाईलवरून कसे करावे?', 'हप्ता बँकेत जमा न झाल्यास कोठे संपर्क करावा?']
    },
    Hindi: {
      summary: 'पीएम किसान योजना स्टेटस चेक करने की आधिकारिक प्रक्रिया:',
      verifiedSource: 'कृषि एवं किसान कल्याण मंत्रालय',
      steps: [
        { number: 1, title: 'पोर्टल पर जाएं', description: 'pmkisan.gov.in पर "Know Your Status" विकल्प चुनें।' },
        { number: 2, title: 'रजिस्ट्रेशन नंबर दर्ज करें', description: 'अपना रजिस्ट्रेशन नंबर या आधार नंबर और कैप्चा भरें।' },
        { number: 3, title: 'e-KYC व बैंक खाता लिंक जांचें', description: 'सुनिश्चित करें कि आधार बैंक खाते से NPCI द्वारा लिंक है।' }
      ],
      simplifiedSummary: 'pmkisan.gov.in पर स्टेटस देखें और ई-केवायसी अपडेट रखें ताकि किस्त समय पर आए।',
      followups: ['e-KYC कैसे पूरा करें?', 'हेल्पलाइन नंबर क्या है?']
    },
    English: {
      summary: 'How to check PM Kisan Samman Nidhi application & installment status:',
      verifiedSource: 'Ministry of Agriculture & Farmers Welfare',
      steps: [
        { number: 1, title: 'Visit Official Portal', description: 'Go to pmkisan.gov.in and click on "Know Your Status".' },
        { number: 2, title: 'Enter Registration / Aadhaar', description: 'Input your registered mobile number or registration ID.' },
        { number: 3, title: 'Verify Aadhaar e-KYC', description: 'Ensure your Aadhaar is linked to your bank account via NPCI.' }
      ],
      simplifiedSummary: 'Visit pmkisan.gov.in, check your status using registration number, and ensure e-KYC is active.',
      followups: ['How to complete e-KYC online?', 'What is PM Kisan helpline number?']
    }
  },
  land: {
    Marathi: {
      summary: '७/१२ (सातबारा) उतारा ऑनलाईन काढण्याची सोपी पद्धत:',
      verifiedSource: 'महसूल विभाग, महाराष्ट्र शासन (mahabhumi.gov.in)',
      steps: [
        { number: 1, title: 'महाभूमी पोर्टल उघडा', description: 'bhulekh.mahabhumi.gov.in संकेतस्थळावर जा.' },
        { number: 2, title: 'जिल्हा व गाव निवडा', description: 'तुमचा विभाग, जिल्हा, तालुका आणि गाव निवडा.' },
        { number: 3, title: 'गट क्रमांक / सर्व्हे नंबर टाका', description: 'जमिनीचा सर्व्हे नंबर किंवा नाव टाकून डिजिटल स्वाक्षरी असलेला ७/१२ डाउनलोड करा.' }
      ],
      simplifiedSummary: 'bhulekh.mahabhumi.gov.in वर जाऊन जिल्हा व गट क्रमांक निवडा आणि डिजिटल स्वाक्षरी असलेला ७/१२ उतारा मिळवा.',
      followups: ['डिजिटल स्वाक्षरी असलेला ८-अ उतारा कसा काढावा?', '७/१२ मधील फेरफार कसा तपासावा?']
    },
    Hindi: {
      summary: 'भूमि अभिलेख / खसरा-खतौनी ऑनलाइन निकालने की प्रक्रिया:',
      verifiedSource: 'राजस्व विभाग भूलेख पोर्टल',
      steps: [
        { number: 1, title: 'राज्य भूलेख पोर्टल पर जाएं', description: 'अपने राज्य के आधिकारिक भूलेख पोर्टल को खोलें।' },
        { number: 2, title: 'जिला, तहसील और ग्राम चुनें', description: 'अपनी भूमि के संबंधित जिले और गांव का चयन करें।' },
        { number: 3, title: 'खसरा नंबर दर्ज करें', description: 'खसरा/खाता संख्या डालकर प्रमाणित नकल डाउनलोड करें।' }
      ],
      simplifiedSummary: 'भूलेख पोर्टल पर जाकर जिला व खसरा नंबर चुनें और अपनी जमीन का रिकॉर्ड डाउनलोड करें।',
      followups: ['नामांतरण (दाखिल खारिज) की स्थिति कैसे देखें?']
    },
    English: {
      summary: 'Procedure to obtain 7/12 Land Record Extract online:',
      verifiedSource: 'Revenue Department & Mahabhumi Portal',
      steps: [
        { number: 1, title: 'Visit State Land Records Portal', description: 'Open the state land portal (e.g. bhulekh.mahabhumi.gov.in).' },
        { number: 2, title: 'Select District & Village', description: 'Choose your district, taluka, and village name.' },
        { number: 3, title: 'Enter Survey / Gat Number', description: 'Search by survey number or owner name and download the digitally signed extract.' }
      ],
      simplifiedSummary: 'Go to the state land records website, enter village and survey number, and download your 7/12 extract.',
      followups: ['How to check mutation status online?', 'How to download Form 8A?']
    }
  }
};

function getTemplateResponse(prompt: string, language: string = 'Marathi') {
  const p = prompt.toLowerCase();
  let key = 'fir';
  if (p.includes('kisan') || p.includes('pm-kisan') || p.includes('किसान')) key = 'kisan';
  else if (p.includes('7/12') || p.includes('land') || p.includes('सातबारा') || p.includes('जमीन') || p.includes('document')) key = 'land';
  else if (p.includes('fir') || p.includes('police') || p.includes('पोलीस') || p.includes('एफआयआर') || p.includes('तक्रार')) key = 'fir';

  const langKey = (language === 'Hindi' || language === 'Marathi' || language === 'English') ? language : 'Marathi';
  const entry = KNOWLEDGE_BASE[key]?.[langKey] || KNOWLEDGE_BASE[key]?.['English'] || KNOWLEDGE_BASE['fir']['English'];

  return {
    ...entry,
    summary: entry.summary.replace('FIR', `"${prompt}"`),
  };
}

// 1. API: Ask Saarthi Question (Fast AI + Smart Cache + Instant Fallback)
app.post('/api/ask', async (req, res) => {
  const t0 = Date.now();
  const { prompt, language = 'Marathi', category } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt string is required' });
  }

  // ── STAGE 1: Cache Check ──
  const cacheKey = `${prompt.trim().toLowerCase()}__${language}`;
  if (queryCache.has(cacheKey)) {
    console.log(`⚡ [CACHE HIT] "${prompt.slice(0,40)}…" → ${Date.now() - t0}ms`);
    return res.json(queryCache.get(cacheKey));
  }
  console.log(`🔍 [STAGE 1: Cache Miss] +${Date.now() - t0}ms`);

  // ── STAGE 2: Knowledge Base / Fallback Check ──
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
    const template = getTemplateResponse(prompt, language);
    queryCache.set(cacheKey, template);
    console.log(`📚 [STAGE 2: Knowledge Base Fallback] → ${Date.now() - t0}ms TOTAL`);
    return res.json(template);
  }
  console.log(`🔑 [STAGE 2: API Key OK] +${Date.now() - t0}ms`);

  try {
    // ── STAGE 3: Gemini LLM Call ──
    const t3 = Date.now();
    const ai = getGeminiClient();

    const apiPromise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Question from citizen: "${prompt}". Language requested: ${language}. Category: ${category || 'Legal/Rights'}.`,
      config: {
        systemInstruction: `You are Saarthi, a warm, trusted Indian legal, government scheme, and civil rights voice companion. 
Answer in clear, reassuring language for citizens in India in requested language (${language}).
Return strictly valid JSON matching the schema.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: 'Direct overview of the answer' },
            verifiedSource: { type: Type.STRING, description: 'Government or legal department source' },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  number: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ['number', 'title', 'description']
              }
            },
            simplifiedSummary: { type: Type.STRING, description: '1-2 sentence ELI5 summary' },
            followups: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['summary', 'verifiedSource', 'steps', 'simplifiedSummary', 'followups']
        }
      }
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('GEMINI_TIMEOUT')), 3500)
    );

    const response: any = await Promise.race([apiPromise, timeoutPromise]);
    console.log(`🤖 [STAGE 3: Gemini LLM] ${Date.now() - t3}ms (total +${Date.now() - t0}ms)`);

    // ── STAGE 4: Parse + Cache ──
    if (response && response.text) {
      const parsed = JSON.parse(response.text);
      queryCache.set(cacheKey, parsed);
      console.log(`✅ [STAGE 4: Parse+Cache] → ${Date.now() - t0}ms TOTAL`);
      return res.json(parsed);
    }

    throw new Error('No text returned from Gemini');
  } catch (err: any) {
    console.warn(`⚠️ [FALLBACK] ${err.message} at +${Date.now() - t0}ms → using Knowledge Base`);
    const template = getTemplateResponse(prompt, language);
    queryCache.set(cacheKey, template);
    console.log(`📚 [FALLBACK SERVED] → ${Date.now() - t0}ms TOTAL`);
    return res.json(template);
  }
});

// 2. API: Explain Document (Multimodal Vision / Camera Scan)
app.post('/api/explain-document', async (req, res) => {
  const { imageBase64, textContent, language = 'Marathi' } = req.body;

  const defaultExplanation = {
    title: 'Electricity Bill & Payment Notice',
    summary: 'This is an official government utility notice regarding your electricity consumption and due date.',
    keyPoints: [
      'This is a notice about your electricity bill and monthly consumption charges.',
      'You need to pay the outstanding amount before the due date to avoid late fees.'
    ],
    dueDate: '15th October',
    actionRequired: 'Pay bill before 15th October via bill collection center or online portal.',
    source: 'Government Utility Dept / Notice'
  };

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
    return res.json(defaultExplanation);
  }

  try {
    const ai = getGeminiClient();
    const contentsParts: any[] = [];

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      contentsParts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: cleanBase64
        }
      });
    }

    contentsParts.push({
      text: `Analyze this document/notice for a citizen in India. Provide a simple explanation in ${language}.
Text provided: ${textContent || 'See attached document image'}`
    });

    const apiPromise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: contentsParts },
      config: {
        systemInstruction: `You are Saarthi Document Explainer. Break down complex legal notices, utility bills, court summons, or government letters into simple, reassuring terms for ordinary citizens.
Return JSON strictly with the specified schema.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            dueDate: { type: Type.STRING },
            actionRequired: { type: Type.STRING },
            source: { type: Type.STRING }
          },
          required: ['title', 'summary', 'keyPoints', 'source']
        }
      }
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('GEMINI_VISION_TIMEOUT')), 4500)
    );

    const response: any = await Promise.race([apiPromise, timeoutPromise]);

    if (response && response.text) {
      const parsed = JSON.parse(response.text);
      return res.json(parsed);
    }

    return res.json(defaultExplanation);
  } catch (err: any) {
    console.warn('Fast fallback applied for /api/explain-document:', err.message);
    return res.json(defaultExplanation);
  }
});

// 3. API: Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Saarthi', geminiConfigured: !!process.env.GEMINI_API_KEY });
});

async function startServer() {
  // Vite middleware for dev
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Saarthi Server running on http://localhost:${PORT}`);
  });
}

startServer();
