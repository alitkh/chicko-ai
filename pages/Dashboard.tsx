import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Glass } from '../components/ui/Glass';
import { Sparkles, ArrowRight, Image as ImageIcon, MessageSquare, Camera, UserX, Shirt, Palette, Wand2, Bot, Battery, Zap } from 'lucide-react';
import { getQuotaStats } from '../services/geminiService';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 11 ? 'Pagi Bro' : hour < 15 ? 'Siang Guys' : hour < 18 ? 'Sore Bray' : 'Malem Sob';

  const [quota, setQuota] = useState(getQuotaStats());

  // Auto-refresh quota display every second to show "cooling down" effect
  useEffect(() => {
    const interval = setInterval(() => {
      setQuota(getQuotaStats());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6 animate-fade-in pt-8">
      
      {/* App Branding / Logo */}
      <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: '0ms' }}>
         <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-neon-blue to-neon-purple p-[1px] shadow-glow-blue relative group">
                <div className="absolute inset-0 bg-white/20 blur-lg rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="w-full h-full bg-[#0a0a0c] rounded-[15px] flex items-center justify-center relative z-10 backdrop-blur-sm">
                   <Bot size={24} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                </div>
            </div>
            <div>
                <h2 className="text-xl font-bold tracking-wider text-white leading-none">CHIKO <span className="font-light text-neon-blue">AI</span></h2>
                <p className="text-[10px] text-gray-400 tracking-widest uppercase mt-0.5">Personal Assistant</p>
            </div>
         </div>

         {/* QUOTA INDICATOR (Energi Chiko) */}
         <Glass className="px-3 py-1.5 rounded-xl flex items-center gap-2" intensity="low" variant="flat">
            <div className={`p-1 rounded-full ${quota.isLow ? 'bg-red-500/20 text-red-400' : 'bg-neon-blue/20 text-neon-blue'}`}>
               <Zap size={14} fill="currentColor" />
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Energi</span>
               <div className="flex items-center gap-1.5">
                   {/* Progress Bar */}
                   <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${quota.isLow ? 'bg-red-500' : 'bg-gradient-to-r from-neon-blue to-neon-cyan'}`} 
                        style={{ width: `${100 - quota.percentUsed}%` }}
                      />
                   </div>
                   {/* <span className="text-xs font-mono text-white">{quota.rpmRemaining}</span> */}
               </div>
            </div>
         </Glass>
      </div>

      {/* Header Date & Greeting */}
      <header className="flex justify-between items-center pt-2">
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <p className="text-gray-400 text-sm font-medium tracking-wide mb-1 uppercase opacity-80">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="text-4xl font-light text-white">
            {greeting}, <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple">Bosque</span>
          </h1>
        </div>
        
        <div className="w-12 h-12 rounded-full border border-white/20 p-1 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
            alt="Profile" 
            className="w-full h-full rounded-full bg-white/5"
          />
        </div>
      </header>

      {/* Main Action Grid */}
      <div className="grid grid-cols-1 gap-5">
        
        {/* Chat Action */}
        <div 
            onClick={() => navigate('/chat')}
            className="group relative h-40 rounded-[32px] overflow-hidden cursor-pointer animate-slide-up transition-transform duration-300 hover:scale-[1.02] bg-[#1a1f3c]" 
            style={{ animationDelay: '300ms' }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f3c] to-[#0f111a] z-0" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-10 mix-blend-overlay" />
            
            {/* Animated Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/20 blur-[60px] rounded-full group-hover:bg-neon-blue/30 transition-colors duration-500" />
            
            <div className="relative z-20 p-6 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                        <MessageSquare className="text-neon-blue" size={24} />
                    </div>
                    <ArrowRight className="text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Ngobrol Asik</h3>
                    <p className="text-gray-400 text-sm">Curhat tipis-tipis sini</p>
                </div>
            </div>
        </div>

        {/* Create Action */}
        <div 
            onClick={() => navigate('/image')}
            className="group relative h-40 rounded-[32px] overflow-hidden cursor-pointer animate-slide-up transition-transform duration-300 hover:scale-[1.02] bg-[#2d1b36]" 
            style={{ animationDelay: '400ms' }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[#2d1b36] to-[#120b14] z-0" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-10 mix-blend-overlay" />
            
             {/* Animated Glow */}
             <div className="absolute bottom-0 left-0 w-40 h-40 bg-neon-pink/20 blur-[60px] rounded-full group-hover:bg-neon-pink/30 transition-colors duration-500" />

            <div className="relative z-20 p-6 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                        <ImageIcon className="text-neon-pink" size={24} />
                    </div>
                    <ArrowRight className="text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Bikin Gambar</h3>
                    <p className="text-gray-400 text-sm">Visualisasiin haluan lo Bro!</p>
                </div>
            </div>
        </div>
      </div>

      {/* Photography Features Section */}
      <div className="animate-slide-up pb-20" style={{ animationDelay: '500ms' }}>
         <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-lg font-semibold tracking-wide flex items-center gap-2">
              <Camera size={18} className="text-neon-cyan" />
              Oprek Foto
            </h3>
         </div>
         
         <div className="grid grid-cols-2 gap-3">
            {/* Tone Feature */}
            <Glass 
              onClick={() => navigate('/photo-studio?tool=tone')}
              interactive 
              variant="flat"
              className="rounded-[24px] p-4 flex flex-col gap-3 relative overflow-hidden group" 
              intensity="medium"
            >
               <div className="absolute top-0 right-0 w-16 h-16 bg-neon-cyan/10 blur-[30px] rounded-full group-hover:bg-neon-cyan/20 transition-all" />
               <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-transparent flex items-center justify-center text-neon-cyan border border-white/5">
                  <Palette size={20} />
               </div>
               <div>
                   <h4 className="font-bold text-white">Ubah Vibe</h4>
                   <p className="text-xs text-gray-400 mt-0.5">Atur tone & filter</p>
               </div>
            </Glass>

            {/* Remove Object Feature */}
            <Glass 
               onClick={() => navigate('/photo-studio?tool=remove')}
               interactive 
               variant="flat"
               className="rounded-[24px] p-4 flex flex-col gap-3 relative overflow-hidden group" 
               intensity="medium"
            >
               <div className="absolute bottom-0 left-0 w-16 h-16 bg-red-500/10 blur-[30px] rounded-full group-hover:bg-red-500/20 transition-all" />
               <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500/20 to-transparent flex items-center justify-center text-red-400 border border-white/5">
                  <UserX size={20} />
               </div>
               <div>
                   <h4 className="font-bold text-white">Ghosting Mode</h4>
                   <p className="text-xs text-gray-400 mt-0.5">Ilangin orang/objek</p>
               </div>
            </Glass>

            {/* Change Clothes Feature */}
            <Glass 
               onClick={() => navigate('/photo-studio?tool=outfit')}
               interactive 
               variant="flat"
               className="rounded-[24px] p-4 flex flex-col gap-3 relative overflow-hidden group" 
               intensity="medium"
            >
               <div className="absolute top-0 left-0 w-16 h-16 bg-purple-500/10 blur-[30px] rounded-full group-hover:bg-purple-500/20 transition-all" />
               <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500/20 to-transparent flex items-center justify-center text-purple-400 border border-white/5">
                  <Shirt size={20} />
               </div>
               <div>
                   <h4 className="font-bold text-white">Fit Check</h4>
                   <p className="text-xs text-gray-400 mt-0.5">Ganti baju otomatis</p>
               </div>
            </Glass>

            {/* Enhance Feature */}
            <Glass 
               onClick={() => navigate('/photo-studio?tool=enhance')}
               interactive 
               variant="flat"
               className="rounded-[24px] p-4 flex flex-col gap-3 relative overflow-hidden group" 
               intensity="medium"
            >
               <div className="absolute bottom-0 right-0 w-16 h-16 bg-yellow-500/10 blur-[30px] rounded-full group-hover:bg-yellow-500/20 transition-all" />
               <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-transparent flex items-center justify-center text-yellow-400 border border-white/5">
                  <Wand2 size={20} />
               </div>
               <div>
                   <h4 className="font-bold text-white">Glow Up</h4>
                   <p className="text-xs text-gray-400 mt-0.5">HD-in foto burik</p>
               </div>
            </Glass>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;