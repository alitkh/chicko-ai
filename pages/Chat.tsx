import React, { useState, useRef, useEffect } from 'react';
import { Glass } from '../components/ui/Glass';
import { Send, Mic, RefreshCw, Copy, Bot, User, Sparkles } from 'lucide-react';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
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
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        content: "Waduh, sinyalnya agak lemot Bro. Coba ulangi lagi.",
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
    <div className="flex flex-col h-screen max-w-2xl mx-auto pt-4 relative">
      {/* Personality Chips - Floating Header */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-4 pb-2 bg-gradient-to-b from-[#030305] to-transparent">
        <Glass className="rounded-full p-1.5 flex justify-between items-center overflow-x-auto scrollbar-hide gap-1 border-white/5" intensity="high">
          {Object.values(PERSONALITIES).map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPersonality(p.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                selectedPersonality === p.id 
                  ? 'bg-white text-black shadow-lg shadow-white/10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{p.icon}</span>
              {p.name}
            </button>
          ))}
        </Glass>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 pt-24 pb-32 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
             {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-glass-200 border border-white/10 mt-1 shadow-glow-purple">
                     <Sparkles size={14} className="text-neon-purple" />
                </div>
             )}
            
            <div className={`relative max-w-[85%] rounded-[24px] px-5 py-3.5 shadow-md ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-neon-blue to-[#0077b6] text-white rounded-tr-sm' 
                : 'bg-glass-200 border border-white/5 text-gray-100 rounded-tl-sm backdrop-blur-2xl'
            }`}>
              <div className="text-[15px] leading-relaxed prose prose-invert prose-p:my-1 prose-pre:bg-black/30 prose-pre:backdrop-blur-md prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
            <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-glass-200 border border-white/10 shadow-glow-purple">
                     <Sparkles size={14} className="text-neon-purple" />
                </div>
                <div className="bg-glass-200 border border-white/5 rounded-[24px] rounded-tl-sm px-5 py-4 flex items-center gap-1.5 backdrop-blur-2xl">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Floating Dock */}
      <div className="absolute bottom-24 left-0 right-0 px-4 z-20">
        <Glass className="rounded-[32px] p-2 flex items-end gap-2 shadow-2xl shadow-black/50 ring-1 ring-white/10" intensity="ultra" border={false}>
          <button className="p-3 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10 active:scale-95">
            <Mic size={22} />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik aja bro, gausah sungkan..."
            className="flex-1 bg-transparent border-0 focus:ring-0 text-white placeholder-gray-500 resize-none py-3.5 max-h-32 scrollbar-hide text-base"
            rows={1}
            style={{ height: '52px' }}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center ${
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
  );
};

export default Chat;