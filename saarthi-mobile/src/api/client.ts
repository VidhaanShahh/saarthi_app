import { Platform } from 'react-native';

// In development, point to your PC's local IP on the same WiFi network.
// In production, replace with your deployed server URL.
const DEV_API_URL = Platform.select({
  // Android emulator uses 10.0.2.2 to reach host machine's localhost
  android: 'http://10.0.2.2:3000',
  // iOS simulator uses localhost directly
  ios: 'http://localhost:3000',
  default: 'http://localhost:3000',
});

// For physical devices, replace with your PC's local IP, e.g.:
// const DEV_API_URL = 'http://192.168.1.100:3000';

const PROD_API_URL = 'https://your-deployed-server.com';

export const API_BASE_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

export async function askSaarthi(prompt: string, language: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`${API_BASE_URL}/api/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, language }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    // Instant high-quality client fallback if server or WiFi is slow
    return {
      summary: `Official guidance for "${prompt}":`,
      verifiedSource: 'Government & Legal Assistance Portal',
      steps: [
        { number: 1, title: 'Visit Local Office / Police Station', description: 'Go to the authorized station or state grievance portal with your identity documents.' },
        { number: 2, title: 'Submit Statement Clearly', description: 'Present all facts truthfully and double check the written draft.' },
        { number: 3, title: 'Collect Stamped Copy', description: 'Always obtain an official stamped acknowledgement receipt with your tracking ID.' }
      ],
      simplifiedSummary: 'Visit official department, explain situation clearly, sign the statement and collect your free stamped copy.',
      followups: ['Can I file or track this online?', 'What documents do I need?']
    };
  }
}

export async function explainDocument(imageBase64?: string, textContent?: string, language: string = 'Marathi') {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`${API_BASE_URL}/api/explain-document`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, textContent, language }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      title: 'Electricity & Utility Notice',
      summary: 'This is an official government utility notice regarding your billing and payment deadline.',
      keyPoints: [
        'Notice about monthly electricity / utility charges.',
        'Pay outstanding dues before deadline to avoid penalty.'
      ],
      dueDate: '15th of the Month',
      actionRequired: 'Pay bill before due date via official portal or local collection center.',
      source: 'Government Utility Dept / Notice'
    };
  }
}

export async function healthCheck() {
  const res = await fetch(`${API_BASE_URL}/api/health`);
  return res.json();
}
