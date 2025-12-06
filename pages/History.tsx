import React from 'react';
import { Glass } from '../components/ui/Glass';
import { MOCK_HISTORY_IMAGES } from '../constants';
import { Search } from 'lucide-react';

const History: React.FC = () => {
  return (
    <div className="p-6 max-w-2xl mx-auto pb-32 animate-[fadeIn_0.5s_ease-out]">
      <h2 className="text-2xl font-bold mb-6">Jejak Digital</h2>
      
      {/* Search Bar */}
      <Glass className="rounded-xl px-4 py-3 flex items-center gap-3 mb-8" intensity="low">
        <Search size={20} className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Cari apaan Bro..." 
          className="bg-transparent border-none outline-none text-white placeholder-gray-500 flex-1"
        />
      </Glass>

      <div className="grid grid-cols-2 gap-4">
        {MOCK_HISTORY_IMAGES.map((src, i) => (
          <div key={i} className="aspect-[4/5] rounded-2xl overflow-hidden relative group cursor-pointer">
            <img src={src} alt={`History ${i}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <span className="text-white text-sm font-medium">Karya Kece</span>
              <span className="text-gray-400 text-xs">2 jam yang lalu</span>
            </div>
          </div>
        ))}
         {/* More Placeholders to fill grid */}
         {[1,2,3].map((_, i) => (
          <div key={`p-${i}`} className="aspect-[4/5] rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
             <span className="text-gray-600 text-sm">Kosong Bro</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;