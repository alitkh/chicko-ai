import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, PersonalityId, ImageGenerationParams } from "../types";
import { PERSONALITIES } from "../constants";

// Initialize the API client
// Note: In a real production app, ensure API_KEY is set in environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const createChatStream = async function* (
  history: Message[],
  newMessage: string,
  personalityId: PersonalityId
) {
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
  // Clean the base64 string to get raw data
  const base64Data = base64Image.split(',')[1];
  const mimeType = base64Image.substring(base64Image.indexOf(':') + 1, base64Image.indexOf(';'));

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { 
          text: prompt 
        },
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        }
      ]
    }
  });

  if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("Gagal mengedit gambar. Coba lagi Bro.");
};