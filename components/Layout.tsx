import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Image as ImageIcon, History } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { icon: Home, path: '/', label: 'Markas' },
    { icon: MessageSquare, path: '/chat', label: 'Curhat' },
    { icon: ImageIcon, path: '/image', label: 'Bikin' },
    { icon: History, path: '/history', label: 'Jejak' },
  ];

  return (
    <div className="relative min-h-screen w-full text-white font-sans overflow-hidden bg-[#030305]">
      {/* Global Noise Texture (Optimized in CSS) */}
      <div className="bg-noise" />

      {/* Ambient Background Lights - Optimized with GPU Acceleration */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden gpu-accelerated">
        {/* Top Left - Blue */}
        <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] bg-neon-blue/10 rounded-full blur-[80px] animate-blob will-change-transform opacity-50" />
        {/* Bottom Right - Purple */}
        <div className="absolute bottom-[-10%] right-[-20%] w-[600px] h-[600px] bg-neon-purple/10 rounded-full blur-[80px] animate-blob delay-2000 will-change-transform opacity-50" />
        {/* Center - Pink (subtle) */}
        <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-neon-pink/5 rounded-full blur-[100px] animate-pulse-slow will-change-opacity" />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 pb-28 min-h-screen">
        {children}
      </main>

      {/* Floating Bottom Navigation Island */}
      <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div className="pointer-events-auto bg-glass-200 backdrop-blur-xl border border-white/10 rounded-full px-6 py-4 flex items-center gap-8 shadow-glass shadow-black/40 gpu-accelerated">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="relative group flex items-center justify-center"
              >
                <div className={`
                  absolute -inset-3 bg-white/20 rounded-full blur-lg opacity-0 transition-opacity duration-300
                  ${isActive ? 'opacity-40' : 'group-hover:opacity-20'}
                `} />
                
                <Icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className={`relative z-10 transition-all duration-300 ${
                    isActive 
                      ? 'text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' 
                      : 'text-gray-400 group-hover:text-white'
                  }`} 
                />
                
                {/* Active Indicator Dot */}
                {isActive && (
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white]" />
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Layout;