export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  personality: PersonalityId;
  lastUpdated: number;
}

export enum PersonalityId {
  FRIENDLY = 'friendly',
  PROFESSIONAL = 'professional',
  FUNNY = 'funny',
  EXPERT = 'expert',
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  base64: string;
  style: string;
  aspectRatio: string;
  timestamp: number;
}

export interface ImageGenerationParams {
  prompt: string;
  style: string;
  aspectRatio: string;
  cameraAngle?: string;
}

export enum ImageStyle {
  REALISTIC = 'Realistic',
  CINEMATIC = 'Cinematic',
  ANIME = 'Anime',
  CYBERPUNK = 'Cyberpunk',
  WATERCOLOR = 'Watercolor',
  PIXEL_ART = 'Pixel Art',
  THREE_D = '3D Render'
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '4:5',
  STORY = '9:16',
  LANDSCAPE = '16:9'
}