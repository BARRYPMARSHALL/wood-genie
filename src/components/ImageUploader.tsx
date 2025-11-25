import React, { useRef, useState } from 'react';
import { Camera, Upload, ImagePlus, Table, FileText, CheckCircle2, Settings2, X, RefreshCw, Ruler } from 'lucide-react';
import { UnitSystem, Difficulty, WoodType } from '../types';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  isLoading: boolean;
  unitSystem: UnitSystem;
  setUnitSystem: (units: UnitSystem) => void;
  difficulty: Difficulty;
  setDifficulty: (diff: Difficulty) => void;
  woodType: WoodType;
  setWoodType: (wood: WoodType) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
    onImageSelected, 
    isLoading, 
    unitSystem, 
    setUnitSystem,
    difficulty,
    setDifficulty,
    woodType,
    setWoodType
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  
  // Webcam State
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageSelected(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // --- Webcam Logic for Desktop Testing ---
  const startWebcam = async () => {
    setCameraError(null);
    setIsWebcamOpen(true);
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    } catch (err) {
        console.error("Camera Error:", err);
        setCameraError("Could not access camera. Please allow permissions or upload a file.");
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
    }
    setIsWebcamOpen(false);
  };

  const captureWebcam = () => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw
        if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg');
            stopWebcam();
            onImageSelected(dataUrl);
        }
    }
  };

  const handleCameraClick = () => {
      // Check if mobile device (simple check)
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
          // Use native input on mobile
          cameraInputRef.current?.click();
      } else {
          // Use webcam modal on desktop
          startWebcam();
      }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      
      {/* Configuration Bar */}
      <div className="bg-white rounded-2xl shadow-xl p-4 mb-8 border border-slate-200">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Units */}
            <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Settings2 className="w-3 h-3" /> Measurement System
                </label>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setUnitSystem('imperial')}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${unitSystem === 'imperial' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        🇺🇸 Imperial
                    </button>
                    <button 
                        onClick={() => setUnitSystem('metric')}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${unitSystem === 'metric' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        🌍 Metric
                    </button>
                </div>
            </div>

            {/* Difficulty */}
            <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <RefreshCw className="w-3 h-3" /> Skill Level
                </label>
                <select 
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    className="w-full bg-slate-100 border-none rounded-lg py-2.5 px-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 cursor-pointer hover:bg-slate-200 transition-colors"
                >
                    <option value="Beginner">Beginner (Basic Tools)</option>
                    <option value="Intermediate">Intermediate (Pocket Holes)</option>
                    <option value="Advanced">Advanced (Joinery)</option>
                </select>
            </div>

            {/* Wood Type */}
             <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Settings2 className="w-3 h-3" /> Material Preference
                </label>
                <select 
                    value={woodType}
                    onChange={(e) => setWoodType(e.target.value as WoodType)}
                    className="w-full bg-slate-100 border-none rounded-lg py-2.5 px-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 cursor-pointer hover:bg-slate-200 transition-colors"
                >
                    <option value="Pine/Construction Lumber">🌲 Pine / Construction (Cheapest)</option>
                    <option value="Plywood/MDF">🟫 Plywood / MDF (Modern)</option>
                    <option value="Reclaimed Wood">♻️ Reclaimed / Pallet Wood</option>
                    <option value="Oak/Hardwood">🌳 Oak / Hardwood (Premium)</option>
                </select>
            </div>

         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT: Drag & Drop Area */}
          <div 
            className={`relative border-[3px] border-dashed rounded-3xl p-8 md:p-12 transition-all text-center flex flex-col justify-center min-h-[500px]
              ${dragActive ? 'border-amber-500 bg-amber-50/50' : 'border-slate-300/80 bg-white/60 hover:border-amber-400 hover:bg-white shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1'}
              ${isLoading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden"
              onChange={(e) => e.target.files && handleFile(e.target.files[0])} 
            />
            
            {/* Hidden Input for Mobile Camera */}
            <input 
              ref={cameraInputRef}
              type="file" 
              accept="image/*" 
              capture="environment"
              className="hidden"
              onChange={(e) => e.target.files && handleFile(e.target.files[0])} 
            />
            
            <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center text-amber-600 shadow-inner ring-4 ring-white">
                 <ImagePlus className="w-12 h-12" />
              </div>
              
              <div>
                  <h3 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    {isLoading ? 'Analyzing...' : 'Upload Photo'}
                  </h3>
                  <p className="text-slate-500 max-w-xs mx-auto text-lg leading-relaxed font-medium">
                    Drag & drop a photo of furniture to get your <b>{difficulty}</b> plan for <b>{woodType.split('/')[0]}</b>.
                  </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full max-w-md justify-center px-4">
                <button className="flex-1 py-4 bg-slate-900 text-white rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 transform active:scale-95">
                   <Upload className="w-5 h-5" /> Select File
                </button>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleCameraClick();
                    }}
                    className="flex-1 py-4 bg-white text-slate-900 border-2 border-slate-100 rounded-xl flex items-center justify-center gap-2 font-bold hover:border-amber-200 hover:bg-amber-50 transition-all shadow-lg transform active:scale-95 group"
                >
                   <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" /> Camera
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Sample PDF Preview (The Output) */}
          <div className="flex flex-col items-center justify-center relative lg:pl-10">
             
             <div className="absolute -top-10 -right-10 bg-amber-400 text-amber-900 font-black text-sm px-4 py-2 rounded-full rotate-12 shadow-lg z-20 animate-bounce">
                THIS IS WHAT YOU GET!
             </div>

             {/* Paper Stack Effect */}
             <div className="relative w-full max-w-md group perspective-1000">
                
                {/* Background Paper 2 */}
                <div className="absolute inset-0 bg-slate-200 rounded-sm shadow-md rotate-6 transform translate-y-2 z-0"></div>
                {/* Background Paper 1 */}
                <div className="absolute inset-0 bg-slate-100 rounded-sm shadow-md rotate-3 transform translate-y-1 z-10"></div>
                
                {/* Main Paper */}
                <div className="relative bg-white w-full aspect-[1/1.414] shadow-2xl rounded-sm p-6 md:p-8 z-20 transform transition-transform duration-500 hover:rotate-0 hover:scale-105 border border-slate-100">
                    
                    {/* PDF Header */}
                    <div className="border-b-2 border-slate-800 pb-4 mb-6 flex justify-between items-start">
                        <div>
                            <h2 className="font-serif text-2xl font-bold text-slate-900">Rustic Coffee Table</h2>
                            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-1">Project Plan #4092</p>
                        </div>
                        <div className="text-right">
                            <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 inline-block mb-1">AI GENERATED</div>
                            <div className="text-[10px] text-slate-500 font-mono">Date: {new Date().toLocaleDateString()}</div>
                        </div>
                    </div>

                    {/* Technical Specs Area (Replaced Isometric View) */}
                    <div className="mb-6 relative">
                        <div className="w-full h-40 bg-slate-50 border border-slate-200 rounded flex flex-col items-center justify-center p-4 gap-2">
                             <Ruler className="w-12 h-12 text-slate-300" />
                             <div className="text-xs font-mono text-slate-400">Technical Cut Data Ready</div>
                        </div>
                        
                        {/* Measurements Overlay */}
                        <div className="absolute -right-2 top-10 bg-white shadow-md border border-slate-200 px-2 py-1 text-[10px] font-mono text-slate-600 rounded">
                            Length: 48"
                        </div>
                        <div className="absolute -left-2 bottom-10 bg-white shadow-md border border-slate-200 px-2 py-1 text-[10px] font-mono text-slate-600 rounded">
                            Height: 18"
                        </div>
                    </div>

                    {/* Cut List Preview */}
                    <div className="mb-6">
                        <h3 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2 flex items-center gap-2">
                            <Table className="w-3 h-3" /> Cut List
                        </h3>
                        <div className="space-y-1.5">
                            {[1,2,3].map(i => (
                                <div key={i} className="flex justify-between text-[10px] font-mono text-slate-600 border-b border-slate-50 pb-1">
                                    <span>{i === 1 ? 'Table Top' : i === 2 ? 'Legs (x4)' : 'Support Beam'}</span>
                                    <span className="text-slate-900 font-bold">{i === 1 ? '1x6 Pine' : '2x4 Fir'}</span>
                                    <span>{i === 1 ? '48.0"' : '17.5"'}</span>
                                </div>
                            ))}
                            <div className="text-[9px] text-slate-400 italic pt-1">+ 8 more items...</div>
                        </div>
                    </div>

                    {/* Instructions Preview */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2 flex items-center gap-2">
                            <FileText className="w-3 h-3" /> Instructions
                        </h3>
                        <div className="text-[10px] text-slate-500 leading-relaxed">
                            <p className="mb-2"><span className="font-bold text-slate-900">Step 1:</span> Cut all lumber to size according to the cut list above.</p>
                            <p className="blur-[2px]">Step 2: Assemble the leg frames using pocket hole screws and glue. Ensure square.</p>
                            <p className="blur-[2px] mt-1">Step 3: Attach the top boards...</p>
                        </div>
                    </div>

                    {/* Stamp */}
                    <div className="absolute bottom-8 right-8 rotate-[-15deg] border-4 border-emerald-600 rounded px-3 py-1 opacity-80">
                        <div className="text-emerald-700 font-black text-sm uppercase tracking-widest">Verified</div>
                        <div className="text-[8px] text-emerald-600 text-center font-mono">WOOD GENIE</div>
                    </div>

                </div>
             </div>

             <div className="mt-8 flex items-center gap-4 text-sm text-slate-500 font-medium">
                 <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Material Cost
                 </div>
                 <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Cut List
                 </div>
                 <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Instructions
                 </div>
             </div>

          </div>
      </div>
      
      {/* Desktop Webcam Modal */}
      {isWebcamOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold flex items-center gap-2">
                        <Camera className="w-5 h-5 text-amber-500" /> Take Photo
                    </h3>
                    <button onClick={stopWebcam} className="text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="relative bg-black aspect-video flex items-center justify-center">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <canvas ref={canvasRef} className="hidden" />
                    {cameraError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white p-6 text-center">
                            <p>{cameraError}</p>
                        </div>
                    )}
                </div>
                <div className="p-6 flex justify-center bg-slate-50">
                    <button 
                        onClick={captureWebcam}
                        className="w-16 h-16 rounded-full bg-white border-4 border-amber-500 flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                    >
                        <div className="w-12 h-12 rounded-full bg-amber-500"></div>
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;