import React, { useEffect, useState } from 'react';
import { Scan, Cpu, Ruler, Zap } from 'lucide-react';

interface Props {
  imageSrc: string | null;
}

const LoadingAnalyzer: React.FC<Props> = ({ imageSrc }) => {
  const [logs, setLogs] = useState<string[]>([]);

  const logMessages = [
    "INITIALIZING_NEURAL_NET...",
    "DETECTING_OBJECT_BOUNDARIES...",
    "ANALYZING_WOOD_GRAIN...",
    "IDENTIFYING_JOINERY_TYPE...",
    "CALCULATING_LOAD_BEARING_CAPACITY...",
    "ESTIMATING_LUMBER_DIMENSIONS...",
    "CROSS_REFERENCING_RETAIL_PRICES...",
    "OPTIMIZING_CUT_PATTERNS...",
    "GENERATING_VECTOR_BLUEPRINTS...",
    "FINALIZING_INSTRUCTIONS..."
  ];

  useEffect(() => {
    let currentIndex = 0;
    // Add initial log immediately
    setLogs([logMessages[0]]);
    currentIndex = 1;

    const interval = setInterval(() => {
      if (currentIndex < logMessages.length) {
        setLogs(prev => [...prev.slice(-4), logMessages[currentIndex]]);
        currentIndex++;
      } else {
        // Loop randomly through technical jargon if it takes longer than the list
        const extraLogs = ["RE-VERIFYING_STRUCTURAL_INTEGRITY...", "RENDERING_ISOMETRIC_VIEW...", "COMPILING_DATA_PACKETS..."];
        const randomLog = extraLogs[Math.floor(Math.random() * extraLogs.length)];
        setLogs(prev => [...prev.slice(-4), randomLog]);
      }
    }, 600); // Speed up from 1500ms to 600ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 flex flex-col items-center animate-in fade-in duration-500">
      <div className="relative w-full aspect-square md:aspect-video bg-black rounded-xl overflow-hidden border-2 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
        {/* Background Image (Darkened) */}
        {imageSrc && (
          <img 
            src={imageSrc} 
            alt="Analyzing" 
            className="w-full h-full object-cover opacity-40 grayscale contrast-125"
          />
        )}

        {/* HUD Overlay */}
        <div className="absolute inset-0 pointer-events-none">
            {/* Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            
            {/* Corner Brackets */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-emerald-400"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-400"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-emerald-400"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-emerald-400"></div>

            {/* Scanning Laser */}
            <div className="absolute left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)] animate-scan"></div>

            {/* Center Target */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Scan className="w-16 h-16 text-emerald-500/40 animate-pulse" />
            </div>

            {/* Top Stats */}
            <div className="absolute top-4 left-16 right-16 flex justify-between text-[10px] font-mono text-emerald-400">
                <span>CPU_USAGE: 98%</span>
                <span>MEM: 8024MB</span>
                <span>MODE: TURBO_ANALYSIS</span>
            </div>

             {/* Side Stats */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 text-emerald-500/60">
                <Cpu className="w-4 h-4 animate-pulse" />
                <Ruler className="w-4 h-4" />
                <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-bounce" />
            </div>
        </div>

        {/* Terminal Log */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/80 p-3 rounded font-mono text-xs border-l-2 border-emerald-500">
            {logs.map((log, i) => (
                <div key={i} className="text-emerald-400 truncate">
                    <span className="text-emerald-700 mr-2">{`>`}</span>
                    {log}
                </div>
            ))}
            <div className="text-emerald-500 animate-pulse">_</div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
          <h3 className="text-2xl font-bold font-mono text-slate-800 tracking-tight flex items-center justify-center gap-2">
            ANALYZING STRUCTURE <span className="inline-block w-2 h-5 bg-amber-500 animate-pulse"></span>
          </h3>
          <p className="text-slate-500 mt-2 font-mono text-sm">Please wait while AI engineers the blueprint...</p>
      </div>
    </div>
  );
};

export default LoadingAnalyzer;
