import React, { useState } from 'react';
import { Glass } from '../components/ui/Glass';
import { generateImage } from '../services/geminiService';
import { ImageStyle, AspectRatio } from '../types';
import { IMAGE_STYLES, ASPECT_RATIOS } from '../constants';
import { Wand2, Download, Share2, Loader2, Sparkles, Layers, RefreshCcw } from 'lucide-react';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(ImageStyle.REALISTIC);
  const [selectedRatio, setSelectedRatio] = useState(AspectRatio.SQUARE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    // Scroll to top/result
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const base64Image = await generateImage({
        prompt,
        style: selectedStyle,
        aspectRatio: selectedRatio
      });
      setGeneratedImage(base64Image);
    } catch (error) {
      console.error("Failed to generate image", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto pb-32 pt-12 animate-fade-in">
      
      {/* Result Display / Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-light text-center mb-6 text-white">
          Bikin Karya <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-purple">Kece</span>
        </h2>

        {(generatedImage || isGenerating) && (
             <div className="animate-slide-up relative z-10">
                 <Glass className="rounded-[32px] p-2 min-h-[350px] flex items-center justify-center relative overflow-hidden group shadow-2xl shadow-black/50" intensity="high">
                     {isGenerating ? (
                         <div className="flex flex-col items-center gap-6 z-10">
                             <div className="relative w-24 h-24">
                                 <div className="absolute inset-0 rounded-full border-t-2 border-neon-pink animate-spin" />
                                 <div className="absolute inset-2 rounded-full border-r-2 border-neon-purple animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />
                                 <div className="absolute inset-0 flex items-center justify-center">
                                     <Sparkles className="text-white animate-pulse" size={32} />
                                 </div>
                             </div>
                             <div className="text-center">
                                 <p className="text-lg font-medium text-white">Bentar Bro...</p>
                                 <p className="text-sm text-gray-400">Lagi dimasak gambarnya</p>
                             </div>
                         </div>
                     ) : (
                         generatedImage && (
                             <>
                                 <img src={generatedImage} alt="Generated" className="w-full h-auto rounded-[24px] shadow-lg" />
                                 <div className="absolute bottom-4 right-4 flex gap-3">
                                     <button className="p-3 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white border border-white/10 transition-all hover:scale-105 active:scale-95">
                                         <Download size={20} />
                                     </button>
                                     <button className="p-3 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white border border-white/10 transition-all hover:scale-105 active:scale-95">
                                         <Share2 size={20} />
                                     </button>
                                 </div>
                             </>
                         )
                     )}
                     {/* Background Glow inside card */}
                     {isGenerating && <div className="absolute inset-0 bg-neon-purple/5 animate-pulse" />}
                 </Glass>
             </div>
        )}
      </div>

      {/* Input Form */}
      <div className="space-y-6">
        
        {/* Prompt Input */}
        <div className="group">
          <label className="text-xs font-medium text-gray-400 ml-4 mb-2 block uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={12} className="text-neon-blue" />
            Konsep (Prompt)
          </label>
          <Glass className="rounded-3xl p-1 focus-within:ring-2 ring-neon-blue/50 transition-all duration-300" intensity="medium">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Tulis haluan lo di sini yang detail biar hasilnya mantep..."
              className="w-full bg-transparent border-none rounded-[20px] p-5 text-lg text-white placeholder-gray-500 focus:outline-none focus:ring-0 resize-none h-32 leading-relaxed"
            />
          </Glass>
        </div>

        {/* Style Selector */}
        <div>
           <label className="text-xs font-medium text-gray-400 ml-4 mb-2 block uppercase tracking-wider flex items-center gap-2">
            <Wand2 size={12} className="text-neon-purple" />
            Gaya (Style)
          </label>
           <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 snap-x">
              {IMAGE_STYLES.map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`snap-start flex-shrink-0 px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 border ${
                    selectedStyle === style
                      ? 'bg-white text-black border-white shadow-glow-purple scale-105'
                      : 'bg-glass-100 border-white/10 text-gray-400 hover:bg-white/5 hover:border-white/20'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
        </div>

        {/* Aspect Ratio */}
        <div>
          <label className="text-xs font-medium text-gray-400 ml-4 mb-2 block uppercase tracking-wider flex items-center gap-2">
            <Layers size={12} className="text-neon-pink" />
            Ukuran (Ratio)
          </label>
          <Glass className="rounded-2xl p-1.5 grid grid-cols-4 gap-1" intensity="low">
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio}
                onClick={() => setSelectedRatio(ratio)}
                className={`py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedRatio === ratio
                    ? 'bg-white/10 text-white shadow-inner'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {ratio}
              </button>
            ))}
          </Glass>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className={`w-full py-5 rounded-[24px] font-bold text-lg flex items-center justify-center gap-3 transition-all duration-500 relative overflow-hidden group mt-4 ${
            prompt.trim() && !isGenerating
              ? 'text-white shadow-glow-purple hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-white/5 text-gray-500 cursor-not-allowed'
          }`}
        >
            {prompt.trim() && !isGenerating && (
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink opacity-80 group-hover:opacity-100 transition-opacity" />
            )}
            
            <span className="relative z-10 flex items-center gap-2">
                {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={20} className="text-yellow-200" />}
                {isGenerating ? 'Otw Bikin...' : 'Gass Bikin!'}
            </span>
        </button>
      </div>
    </div>
  );
};

export default ImageGenerator;