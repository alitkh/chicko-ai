import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, PersonalityId, ImageGenerationParams } from "../types";
import { PERSONALITIES } from "../constants";

// Helper to get API Key securely
const getApiKey = (): string => {
  // 1. Try Environment Variable (Build time)
  if (process.env.API_KEY) return process.env.API_KEY;
  
  // 2. Try LocalStorage (Runtime Manual Override)
  // Cara pakai: Buka Console Browser -> ketik: localStorage.setItem('gemini_api_key', 'YOUR_KEY')
  const localKey = localStorage.getItem('gemini_api_key');
  if (localKey) return localKey;

  return '';
};

const getAIClient = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key Hilang! Pastikan sudah set API_KEY di .env atau Vercel.");
  }
  return new GoogleGenAI({ apiKey });
};

export const createChatStream = async function* (
  history: Message[],
  newMessage: string,
  personalityId: PersonalityId
) {
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