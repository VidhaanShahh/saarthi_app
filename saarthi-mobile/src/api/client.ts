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
  const res = await fetch(`${API_BASE_URL}/api/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, language }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function explainDocument(imageBase64?: string, textContent?: string, language: string = 'Marathi') {
  const res = await fetch(`${API_BASE_URL}/api/explain-document`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, textContent, language }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function healthCheck() {
  const res = await fetch(`${API_BASE_URL}/api/health`);
  return res.json();
}
