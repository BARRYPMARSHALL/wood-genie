
import React, { useState } from 'react';
import { Hammer, AlertCircle } from 'lucide-react';
import { generatePlanFromImage } from './services/geminiService';
import type { WoodworkingPlan, UnitSystem, Difficulty, WoodType } from './types';

// Lazy load components to avoid import errors
const ImageUploader = React.lazy(() => import('./components/ImageUploader'));
const PlanDisplay = React.lazy(() => import('./components/PlanDisplay'));
const LoadingAnalyzer = React.lazy(() => import('./components/LoadingAnalyzer'));

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [plan, setPlan] = useState<WoodworkingPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');
  const [difficulty, setDifficulty] = useState<Difficulty>('Beginner');
  const [woodType, setWoodType] = useState<WoodType>('Pine/Construction Lumber');

  const processImage = async (base64: string) => {
    const startTime = performance.now();
    console.log('\n========== NEW IMAGE PROCESSING STARTED ==========');
    console.log('🖼️  Processing image at', new Date().toISOString(), { unitSystem, difficulty, woodType });
    
    // Force state reset
    console.log('⏱️  T+0ms - Setting image state');
    setImage(null);
    setImage(base64);
    console.log('⏱️  T+0ms - Clearing plan and error, setting loading=true');
    setPlan(null);
    setError(null);
    setLoading(true);

    try {
      console.log('⏱️  T+' + (performance.now() - startTime).toFixed(0) + 'ms - Calling generatePlanFromImage...');
      const result = await generatePlanFromImage(base64, unitSystem, difficulty, woodType);
      console.log('⏱️  T+' + (performance.now() - startTime).toFixed(0) + 'ms - Plan generated:', result.title);
      console.log('⏱️  T+' + (performance.now() - startTime).toFixed(0) + 'ms - Setting plan state');
      setPlan(result);
      console.log('⏱️  T+' + (performance.now() - startTime).toFixed(0) + 'ms - Plan state set');
    } catch (err: any) {
      console.error('⏱️  T+' + (performance.now() - startTime).toFixed(0) + 'ms - ❌ Error generating plan:', err);
      setError("Failed to analyze the image. API Error: " + err.message);
    } finally {
      console.log('⏱️  T+' + (performance.now() - startTime).toFixed(0) + 'ms - Setting loading=false');
      setLoading(false);
      console.log('========== IMAGE PROCESSING COMPLETED ==========\n');
    }
  };

  const resetApp = () => {
    console.log('🔄 Resetting app state...');
    setImage(null);
    setPlan(null);
    setError(null);
    // Clear any cached data
    sessionStorage.clear();
    localStorage.removeItem('woodgenie_last_plan');
  };

  return (
    <div className="min-h-screen flex flex-col bg-grid-pattern">
      {/* Navigation Bar */}
      <nav className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white py-4 px-6 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center gap-2 font-bold text-xl tracking-tight cursor-pointer hover:opacity-80 transition"
            onClick={resetApp}
          >
            <div className="bg-amber-500 p-1.5 rounded text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                <Hammer className="w-5 h-5" />
            </div>
            <span className="text-slate-100">Wood <span className="text-amber-500">Genie</span></span>
          </div>
          <div className="text-xs text-slate-400 font-mono hidden md:block">
            v1.0.0 • POWERED BY GEMINI 2.5
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 relative">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero / Intro */}
          {!image && (
            <div className="text-center mb-16 mt-10 animate-in slide-in-from-bottom-5 duration-500">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-xs font-bold px-4 py-1.5 rounded-full mb-6 border border-amber-200 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                100% FREE AI TOOL
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tighter leading-[1.1]">
                Build furniture <br className="hidden md:block"/>
                from a <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">single photo.</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                Upload a picture of any shelf, table, or chair. Our AI engineer creates the <span className="font-semibold text-slate-800">blueprints, cut list, and instructions</span> instantly.
              </p>
            </div>
          )}

          {/* Uploader Section */}
          {!plan && !loading && (
            <div className={`transition-all duration-500 ${image ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
                <React.Suspense fallback={<div className="text-center py-10">Loading uploader...</div>}>
                  <ImageUploader 
                    onImageSelected={processImage} 
                    isLoading={loading} 
                    unitSystem={unitSystem}
                    setUnitSystem={setUnitSystem}
                    difficulty={difficulty}
                    setDifficulty={setDifficulty}
                    woodType={woodType}
                    setWoodType={setWoodType}
                  />
                </React.Suspense>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="py-10">
               <React.Suspense fallback={<div className="text-center py-10">Analyzing...</div>}>
                 <LoadingAnalyzer imageSrc={image} />
               </React.Suspense>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="max-w-xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-center animate-in shake">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-red-900 mb-2">Analysis Failed</h3>
              <p className="text-red-700 mb-6">{error}</p>
              <button 
                onClick={resetApp}
                className="bg-white border border-red-300 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 font-medium transition"
              >
                Try Another Photo
              </button>
            </div>
          )}

          {/* Results View */}
          {plan && !loading && (
            <div className="animate-in slide-in-from-bottom-10 duration-700" key={`plan-${Date.now()}`}>
               <button 
                onClick={resetApp} 
                className="mb-6 text-slate-500 hover:text-slate-800 flex items-center gap-2 font-medium group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Start New Project
              </button>
              <React.Suspense fallback={<div className="text-center py-10">Loading plan...</div>}>
                <PlanDisplay plan={plan} originalImage={image} key={`display-${plan.title}-${Date.now()}`} />
              </React.Suspense>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-10 mt-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Wood Genie. Designed for Makers.</p>
          <div className="flex gap-6">
             <a href="#" className="hover:text-slate-600 transition">Privacy</a>
             <a href="#" className="hover:text-slate-600 transition">Terms</a>
             <a href="#" className="hover:text-slate-600 transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;