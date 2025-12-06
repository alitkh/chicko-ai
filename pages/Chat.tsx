import React, { useState, useRef, useEffect } from 'react';
import { Glass } from '../components/ui/Glass';
import { Send, Mic, Sparkles, AlertTriangle } from 'lucide-react';
import { createChatStream } from '../services/geminiService';
import { Message, PersonalityId } from '../types';
import { PERSONALITIES } from '../constants';
import ReactMarkdown from 'react-markdown';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', content: "Woy Bro! Gue **Chiko**. Mau tanya apaan atau curhat apa hari ini? Santuy aja gausah panik.", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPersonality, setSelectedPersonality] = useState<PersonalityId>(PersonalityId.FRIENDLY);
  const [apiKeyError, setApiKeyError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // Check key on mount using the service helper logic (indirectly via trying to access it or just basic check)
    // Note: process.env.API_KEY is replaced by Vite at build time.
    if (!process.env.API_KEY) {
      // If it's empty string or undefined
      setApiKeyError(true);
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = createChatStream(messages, input, selectedPersonality);
      let fullResponse = '';
      
      const modelMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: modelMessageId,
        role: 'model',
        content: '',
        timestamp: Date.now()
      }]);

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === modelMessageId ? { ...msg, content: fullResponse } : msg
        ));
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      let errorMessage = "Waduh, sinyalnya agak lemot Bro. Coba ulangi lagi.";
      
      if (error.message.includes("API Key") || error.message.includes("403") || error.message.includes("key")) {
         errorMessage = "API Key Error! Pastikan API Key sudah diset di Vercel atau .env.";
         setApiKeyError(true);
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        content: errorMessage,
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    // Use 100dvh for better mobile browser support (accounts for address bar)
    <div className="flex flex-col h-[100dvh] w-full max-w-2xl mx-auto relative overflow-hidden bg-[#030305]">
      
      {/* API Key Alert - Fixed position ensures visibility */}
      {apiKeyError && (
        <div className="fixed top-24 left-4 right-4 z-50 animate-bounce">
          <div className="bg-red-500/90 text-white px-4 py-3 rounded-xl shadow-lg border border-white/20 flex items-center gap-3 backdrop-blur-md">
             <AlertTriangle size={20} className="text-yellow-300 shrink-0" />
             <div className="text-xs">
               <p className="font-bold">API KEY HILANG!</p>
               <p>Cek environment variable di Vercel atau file .env.</p>
             </div>
          </div>
        </div>
      )}

      {/* Personality Chips - Fixed Header with Gradient Background */}
      <div className="fixed top-0 left-0 right-0 z-30 pt-4 pb-6 bg-gradient-to-b from-[#030305] via-[#030305]/95 to-transparent">
        <div className="max-w-2xl mx-auto px-4">
          <Glass className="rounded-full p-1.5 flex justify-between items-center overflow-x-auto scrollbar-hide gap-1 border-white/5" intensity="medium" variant="flat">
            {Object.values(PERSONALITIES).map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPersonality(p.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedPersonality === p.id 
                    ? 'bg-white text-black shadow-lg shadow-white/10 scale-105' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{p.icon}</span>
                {p.name}
              </button>
            ))}
          </Glass>
        </div>
      </div>

      {/* Messages Area - Scrollable with padding for header/footer */}
      <div className="flex-1 overflow-y-auto px-4 pt-28 pb-40 space-y-6 scrollbar-hide">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
             {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#1e2336] border border-white/5 mt-1 shadow-glow-purple/20">
                     <Sparkles size={14} className="text-neon-purple" />
                </div>
             )}
            
            <div className={`relative max-w-[85%] rounded-[24px] px-5 py-3.5 shadow-sm border border-white/5 ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-neon-blue to-[#0077b6] text-white rounded-tr-sm shadow-glow-blue/20' 
                : 'bg-[#1a1f2e] text-gray-100 rounded-tl-sm'
            }`}>
              <div className="text-[15px] leading-relaxed prose prose-invert prose-p:my-1 prose-pre:bg-black/30 prose-pre:rounded-xl break-words">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
            <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#1e2336] border border-white/5">
                     <Sparkles size={14} className="text-neon-purple" />
                </div>
                <div className="bg-[#1a1f2e] border border-white/5 rounded-[24px] rounded-tl-sm px-5 py-4 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed Bottom Dock above Navbar */}
      <div className="fixed bottom-[88px] left-0 right-0 z-30 px-4 bg-gradient-to-t from-[#030305] via-[#030305]/90 to-transparent pt-6 pb-1 pointer-events-none">
        <div className="max-w-2xl mx-auto pointer-events-auto">
          <Glass className="rounded-[32px] p-2 flex items-end gap-2 shadow-2xl shadow-black/80 ring-1 ring-white/10 bg-[#0a0a0c]" intensity="ultra" border={false} variant="flat">
            <button className="p-3 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10 active:scale-95 touch-manipulation">
              <Mic size={22} />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik aja bro..."
              className="flex-1 bg-transparent border-0 focus:ring-0 text-white placeholder-gray-500 resize-none py-3.5 max-h-32 scrollbar-hide text-base"
              rows={1}
              style={{ height: '52px' }}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center touch-manipulation ${
                input.trim() 
                  ? 'bg-white text-black hover:scale-105 shadow-glow-blue' 
                  : 'bg-white/5 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send size={20} fill={input.trim() ? "currentColor" : "none"} />
            </button>
          </Glass>
        </div>
      </div>
    </div>
  );
};

export default Chat;