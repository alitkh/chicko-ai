import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, PersonalityId, ImageGenerationParams } from "../types";
import { PERSONALITIES } from "../constants";

// --- RATE LIMIT TRACKER SYSTEM ---
const QUOTA_KEY = 'chiko_quota_tracker';
const LIMITS = {
  RPM: 15,   // Requests Per Minute (Free Tier limit estimation)
  RPD: 1500  // Requests Per Day
};

export const trackRequest = () => {
  try {
    const now = Date.now();
    const rawData = localStorage.getItem(QUOTA_KEY);
    let timestamps: number[] = rawData ? JSON.parse(rawData) : [];
    
    // Filter timestamps older than 24 hours to keep storage clean
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    timestamps = timestamps.filter(t => t > oneDayAgo);
    
    // Add new request
    timestamps.push(now);
    localStorage.setItem(QUOTA_KEY, JSON.stringify(timestamps));
  } catch (e) {
    console.error("Quota tracking error", e);
  }
};

export const getQuotaStats = () => {
  try {
    const now = Date.now();
    const rawData = localStorage.getItem(QUOTA_KEY);
    const timestamps: number[] = rawData ? JSON.parse(rawData) : [];
    
    // Calculate RPM (Last 60 seconds)
    const oneMinuteAgo = now - 60 * 1000;
    const requestsLastMinute = timestamps.filter(t => t > oneMinuteAgo).length;
    
    // Calculate RPD (Last 24 hours)
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const requestsLastDay = timestamps.filter(t => t > oneDayAgo).length;

    return {
      rpmUsed: requestsLastMinute,
      rpmLimit: LIMITS.RPM,
      rpmRemaining: Math.max(0, LIMITS.RPM - requestsLastMinute),
      percentUsed: Math.min(100, (requestsLastMinute / LIMITS.RPM) * 100),
      isLow: requestsLastMinute >= (LIMITS.RPM - 3) // Warning if less than 3 requests left
    };
  } catch (e) {
    return { rpmUsed: 0, rpmLimit: 15, rpmRemaining: 15, percentUsed: 0, isLow: false };
  }
};

// --- END TRACKER SYSTEM ---

// Helper to get AI Client
const getAIClient = () => {
  // Strictly follow @google/genai guidelines:
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === '""' || apiKey.length === 0) {
     console.error("API Key check failed. Value:", apiKey);
     throw new Error("API Key Hilang! Pastikan sudah set API_KEY di .env atau Settings Vercel (Perlu Redeploy jika baru diset).");
  }
  return new GoogleGenAI({ apiKey: apiKey });
};

export const createChatStream = async function* (
  history: Message[],
  newMessage: string,
  personalityId: PersonalityId
) {
  // Track Usage
  trackRequest();

  const ai = getAIClient();
  const personality = PERSONALITIES[personalityId];
  
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: personality.systemInstruction,
    },
    history: history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }))
  });

  const result = await chat.sendMessageStream({ message: newMessage });

  for await (const chunk of result) {
    const responseChunk = chunk as GenerateContentResponse;
    if (responseChunk.text) {
      yield responseChunk.text;
    }
  }
};

export const generateImage = async (params: ImageGenerationParams): Promise<string> => {
  // Track Usage
  trackRequest();

  const ai = getAIClient();
  const { prompt, style, aspectRatio } = params;
  
  const enhancedPrompt = `Generate a ${style} style image. ${prompt}. Aspect ratio ${aspectRatio}. High quality, detailed.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: enhancedPrompt }
      ]
    },
    config: {
       imageConfig: {
          aspectRatio: aspectRatio === '1:1' ? '1:1' : 
                       aspectRatio === '9:16' ? '9:16' : 
                       aspectRatio === '16:9' ? '16:9' : 
                       aspectRatio === '4:5' ? '4:5' : '1:1',
       }
    }
  });

  if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("No image data found in response");
};

export const editImage = async (base64Image: string, prompt: string): Promise<string> => {
  // Track Usage
  trackRequest();

  try {
    const ai = getAIClient();
    
    // Clean the base64 string to get raw data
    const base64Data = base64Image.split(',')[1];
    const mimeType = base64Image.substring(base64Image.indexOf(':') + 1, base64Image.indexOf(';'));

    // CORRECT ORDER: Image First, then Text Prompt
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          { 
            text: prompt 
          }
        ]
      }
    });

    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      // 1. Check for Image
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
      
      // 2. Check for Text (Refusal/Error message from AI)
      const textPart = response.candidates[0].content.parts.find(p => p.text);
      if (textPart && textPart.text) {
        throw new Error(textPart.text); // Throw the AI's explanation
      }
    }

    throw new Error("AI tidak memberikan gambar balik. Coba prompt yang beda.");
  } catch (error: any) {
    console.error("Detail Error Gemini:", error);
    throw new Error(error.message || "Gagal koneksi ke server AI.");
  }
};