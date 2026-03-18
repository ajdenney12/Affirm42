import { GoogleGenerativeAI } from "@google/generative-ai";
import { HANDBOOK_DATA } from "../constants";

// Helper for decoding base64
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function* getAnswerStream(question: string, announcements: string[]): AsyncGenerator<{ text?: string }> {
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  const announcementsText = announcements.length > 0 
    ? "CURRENT DAILY ANNOUNCEMENTS: " + announcements.join(". ")
    : "No new daily announcements posted.";

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: { temperature: 0.1 }
  });

  const prompt = `
    TODAY'S DATE: ${dateString}

    RESIDENT FAQ DATA:
    ${HANDBOOK_DATA.substring(0, 35000)}
    
    ${announcementsText}
    
    USER QUESTION: ${question}
    
    Tone Guidelines:
    - Be concise, patient, and clear.
    - Refer to residents as "neighbors" or "friends".
    - Use a polite, professional customer service tone.
  `;

  try {
    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text().replace(/\*/g, '');
      if (chunkText) {
        yield { text: chunkText };
      }
    }
  } catch (error) {
    console.error("Gemini Stream Error:", error);
    yield { text: "I'm sorry I don't have that information, please contact the Resident Experience Manager at 757-253-9689" };
  }
}

function speakWithBrowser(text: string) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.85; 
  utterance.pitch = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const femaleVoice = voices.find(v => (v.name.includes('Female') || v.name.includes('Google US English') || v.name.includes('Samantha')) && v.lang.startsWith('en'));
  if (femaleVoice) utterance.voice = femaleVoice;
  window.speechSynthesis.speak(utterance);
}

export async function generateSpeech(text: string): Promise<Uint8Array | null> {
  try {
    let cleanText = text
      .replace(/[*#_\[\]()]/g, '')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .trim();
    
    if (!cleanText) return null;
    speakWithBrowser(cleanText);
    return null; 
  } catch (error) {
    console.error("Speech Generation Error:", error);
    return null;
  }
}
export function decodeAudioBuffer(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}