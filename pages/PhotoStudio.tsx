import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Glass } from '../components/ui/Glass';
import { Palette, UserX, Shirt, Wand2, Upload, X, Check, Sparkles, Sliders, Eraser, Download } from 'lucide-react';
import { editImage } from '../services/geminiService';

const PhotoStudio: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTool = searchParams.get('tool') || 'tone';
  
  const [selectedTool, setSelectedTool] = useState(initialTool);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Inputs
  const [editInput, setEditInput] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Cinematic');

  // Tools Configuration
  const tools = [
    { id: 'tone', name: 'Ubah Vibe', icon: Palette, color: 'text-neon-cyan' },
    { id: 'remove', name: 'Ghosting', icon: UserX, color: 'text-red-400' },
    { id: 'outfit', name: 'Fit Check', icon: Shirt, color: 'text-purple-400' },
    { id: 'enhance', name: 'Glow Up', icon: Wand2, color: 'text-yellow-400' },
  ];

  // Reset input when tool changes
  useEffect(() => {
    setEditInput('');
  }, [selectedTool]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!selectedImage || isProcessing) return;
    
    // Validation
    if ((selectedTool === 'remove' || selectedTool === 'outfit') && !editInput.trim()) {
      alert("Isi dulu deskripsinya Bro!");
      return;
    }

    setIsProcessing(true);

    // Construct Prompt based on Tool
    let prompt = "";
    switch (selectedTool) {
      case 'tone':
        prompt = `Apply a ${selectedFilter} color grading/filter to this image. Keep the content exactly the same, just change the tone/mood. High quality.`;
        break;
      case 'remove':
        prompt = `Remove the ${editInput} from this image. Fill in the background naturally to match the surroundings. High quality.`;
        break;
      case 'outfit':
        prompt = `Change the person's clothing in this image to: ${editInput}. Keep the face, pose, and background exactly the same. Photorealistic result.`;
        break;
      case 'enhance':
        prompt = "Enhance the quality of this image. Increase sharpness, improve lighting, and reduce noise. make it look like 4K resolution.";
        break;
      default:
        prompt = "Enhance this image.";
    }

    try {
      const newImage = await editImage(selectedImage, prompt);
      setSelectedImage(newImage);
      // Optional: Clear input after success
      if (selectedTool !== 'tone') setEditInput('');
    } catch (error: any) {
      console.error("Edit failed:", error);
      // Tampilkan pesan error bersih yang sudah diproses service
      alert(`Gagal Bro: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pt-4 pb-32 flex flex-col animate-fade-in relative">
      
      {/* Header */}
      <div className="px-6 mb-6 flex justify-between items-center z-10">
        <button onClick={() => navigate('/')} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
          <X size={20} />
        </button>
        <h1 className="text-xl font-bold">Studio Foto</h1>
        <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-neon-blue">
          <Sparkles size={20} />
        </button>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 px-4 flex flex-col gap-6">
        
        {/* Image Preview / Upload Area */}
        <div className="flex-1 relative min-h-[400px] rounded-[32px] overflow-hidden bg-[#0a0a0c] border border-white/10 shadow-2xl flex items-center justify-center group">
          {selectedImage ? (
            <>
              <img 
                src={selectedImage} 
                alt="Upload" 
                className={`w-full h-full object-contain transition-all duration-700 ${isProcessing ? 'blur-lg scale-105 opacity-50' : ''}`} 
              />
              {/* Image Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                 {/* Remove Button */}
                 <button 
                  onClick={() => setSelectedImage(null)}
                  className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white/70 hover:text-white border border-white/10"
                >
                  <X size={18} />
                </button>
              </div>
             
              {/* Download Button (Only if not processing) */}
              {!isProcessing && (
                  <div className="absolute bottom-4 right-4">
                     <a href={selectedImage} download="chiko-edit.png" className="flex items-center justify-center p-3 bg-neon-blue/20 backdrop-blur-md rounded-full text-neon-blue hover:bg-neon-blue/30 border border-neon-blue/30 transition-all">
                        <Download size={20} />
                     </a>
                  </div>
              )}
            </>
          ) : (
            <label className="flex flex-col items-center justify-center gap-4 cursor-pointer p-8 text-center w-full h-full hover:bg-white/5 transition-colors z-10">
              <div className="w-20 h-20 rounded-full bg-glass-100 flex items-center justify-center border border-dashed border-white/30 group-hover:border-neon-blue group-hover:scale-110 transition-all">
                <Upload size={32} className="text-gray-400 group-hover:text-neon-blue" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Upload Foto Dulu Bro</p>
                <p className="text-sm text-gray-500 mt-1">Format JPG, PNG aman.</p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          )}

          {/* Processing Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div className="flex flex-col items-center gap-3">
                 <div className="relative w-16 h-16">
                     <div className="absolute inset-0 border-4 border-neon-blue/30 rounded-full"></div>
                     <div className="absolute inset-0 border-4 border-t-neon-blue rounded-full animate-spin"></div>
                 </div>
                 <p className="text-sm font-medium animate-pulse text-neon-blue">Lagi Dioprek Chiko...</p>
              </div>
            </div>
          )}
        </div>

        {/* Tools Section */}
        <div className="space-y-4">
          
          {/* Tool Selector Tab */}
          <Glass className="p-1.5 rounded-2xl flex justify-between overflow-x-auto scrollbar-hide" intensity="medium">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isActive = selectedTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  disabled={isProcessing}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl min-w-[80px] transition-all duration-300 ${
                    isActive ? 'bg-white/10 text-white shadow-inner' : 'text-gray-500 hover:text-gray-300'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Icon size={20} className={isActive ? tool.color : 'text-current'} />
                  <span className="text-[10px] font-medium uppercase tracking-wider">{tool.name}</span>
                </button>
              );
            })}
          </Glass>

          {/* Contextual Controls based on Selected Tool */}
          <Glass className="p-5 rounded-[24px]" intensity="low">
             {selectedTool === 'tone' && (
                <div className="space-y-3">
                    <label className="text-xs text-gray-400 uppercase font-bold flex items-center gap-2">
                        <Sliders size={14} /> Pilih Mood
                    </label>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {['Cinematic', 'Warm', 'Cool', 'B&W', 'Cyberpunk', 'Vintage'].map(filter => (
                            <button 
                                key={filter} 
                                onClick={() => setSelectedFilter(filter)}
                                className={`px-4 py-2 rounded-lg text-sm border transition-colors whitespace-nowrap ${
                                    selectedFilter === filter 
                                    ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan' 
                                    : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/30'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
             )}

             {selectedTool === 'remove' && (
                 <div className="space-y-3">
                    <label className="text-xs text-gray-400 uppercase font-bold flex items-center gap-2">
                        <Eraser size={14} /> Deskripsi Objek
                    </label>
                    <input 
                      type="text" 
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      placeholder="Contoh: Orang di belakang, tiang listrik..." 
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 transition-colors text-white"
                    />
                 </div>
             )}

             {selectedTool === 'outfit' && (
                 <div className="space-y-3">
                    <label className="text-xs text-gray-400 uppercase font-bold flex items-center gap-2">
                        <Shirt size={14} /> Mau Pake Baju Apa?
                    </label>
                    <textarea 
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      placeholder="Contoh: Ganti jadi Hoodie hitam oversized logo api..." 
                      rows={2}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition-colors resize-none text-white"
                    />
                 </div>
             )}
             
             {selectedTool === 'enhance' && (
                 <div className="flex items-center justify-between">
                     <div className="text-sm">
                         <span className="block text-white font-medium">Auto Glow Up</span>
                         <span className="text-gray-500 text-xs">Bikin tajem & jernih 4K</span>
                     </div>
                     <div className="w-12 h-6 bg-neon-blue/20 rounded-full relative border border-neon-blue/50">
                         <div className="absolute right-1 top-1 w-4 h-4 bg-neon-blue rounded-full shadow-glow-blue" />
                     </div>
                 </div>
             )}

             {/* Action Button */}
             <button 
                onClick={handleProcess}
                disabled={!selectedImage || isProcessing}
                className={`w-full mt-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    selectedImage && !isProcessing
                     ? 'bg-white text-black hover:scale-[1.02] shadow-glow-blue'
                     : 'bg-white/5 text-gray-500 cursor-not-allowed'
                }`}
             >
                {isProcessing ? 'Lagi Proses...' : 'Gass Oprek!'}
                {!isProcessing && <Sparkles size={16} />}
             </button>
          </Glass>

        </div>
      </div>
    </div>
  );
};

export default PhotoStudio;