import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'sprite' | 'sprite-sheet';
  spriteUrl?: string;
  metadata?: any;
  timestamp: Date;
}

interface ChatState {
  messages: ChatMessage[];
  isGenerating: boolean;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setGenerating: (generating: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isGenerating: false,
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    }],
  })),
  setGenerating: (generating) => set({ isGenerating: generating }),
  clearMessages: () => set({ messages: [] }),
}));







