
import React, { useState } from 'react';
import { WoodworkingPlan } from '../types';
import { Ruler, Hammer, ClipboardList, FileDown, X, Mail, CheckCircle, Clock, DollarSign, TrendingUp, Save } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';
import SocialShare from './SocialShare';

interface PlanDisplayProps {
  plan: WoodworkingPlan;
  originalImage: string | null;
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, originalImage }) => {
  const [activeTab, setActiveTab] = useState<'cuts' | 'steps'>('cuts');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [modalType, setModalType] = useState<'download' | 'save'>('download');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleActionClick = (type: 'download' | 'save') => {
    console.log('🖱️ handleActionClick invoked, type=', type);
    setModalType(type);
    setShowEmailModal(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
        setEmailError('Please enter a valid email address.');
        return;
    }
    
    console.log(`Captured email for ${modalType}:`, email);

    // Debug: detect accidental auto-submit or automatic modal actions
    console.log('📢 handleEmailSubmit called; modalType=', modalType, 'isGeneratingPdf=', isGeneratingPdf);
    
    if (modalType === 'download') {
        setIsGeneratingPdf(true);
        try {
            await generatePDF(plan, originalImage);
        } catch (error) {
            console.error("PDF Generation failed", error);
        } finally {
            setIsGeneratingPdf(false);
        }
    } else {
        // Simulate saving
        alert("Project saved! (Simulation: Check console for email capture)");
    }
    
    setShowEmailModal(false);
    setEmailError('');
  };

  return (
    <>
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* 1. THE VIRAL SAVINGS CARD (Hero) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden relative">
         <div className="absolute top-0 right-0 p-32 bg-amber-500/10 blur-3xl rounded-full pointer-events-none"></div>
         
         <div className="p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex-1 text-center md:text-left">
                <div className="inline-block bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-green-500/30">
                    💰 MONEY SAVER DETECTED
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
                    Build it for <span className="text-green-400">{plan.estimatedCost}</span>
                </h2>
                <p className="text-slate-400 text-lg">
                    Instead of paying <span className="line-through decoration-red-500/50 decoration-2">{plan.estimatedRetailPrice}</span> at the store.
                </p>
                <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                    <button 
                        onClick={() => handleActionClick('download')}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-amber-500/20 flex items-center gap-2"
                    >
                        <FileDown className="w-5 h-5" /> Download Plans
                    </button>
                    <button 
                         onClick={() => handleActionClick('save')}
                         className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-bold transition-all border border-slate-600 flex items-center gap-2"
                    >
                        <Save className="w-5 h-5" /> Save Project
                    </button>
                </div>
            </div>
            
            {/* Visual Comparison Circle */}
            <div className="flex-shrink-0 w-48 h-48 rounded-full border-4 border-slate-700 flex flex-col items-center justify-center bg-slate-800 relative">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">You Save</p>
                <p className="text-4xl font-black text-white">90%</p>
                <TrendingUp className="w-8 h-8 text-green-500 mt-2" />
                <div className="absolute -bottom-4 bg-slate-900 px-4 py-1 rounded-full border border-slate-700 text-xs text-slate-300 font-mono">
                    Sweat Equity
                </div>
            </div>
         </div>
      </div>

      {/* 2. Detailed Plan Card */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="p-6 md:p-8 border-b border-slate-100">
             <div className="flex items-center gap-3 mb-2">
               <h2 className="text-2xl font-bold text-slate-900">{plan.title}</h2>
            </div>
            <p className="text-slate-600 max-w-2xl">{plan.description}</p>
            
             {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-1">Time</div>
                    <div className="font-mono font-bold text-slate-800">{plan.estimatedTime}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-1">Dimensions</div>
                    <div className="font-mono font-bold text-slate-800 text-xs sm:text-sm">
                        {plan.overallDimensions.height} x {plan.overallDimensions.width} x {plan.overallDimensions.depth}
                    </div>
                </div>
                 <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-1">Parts</div>
                    <div className="font-mono font-bold text-slate-800">{plan.cutList.length} items</div>
                </div>
                 <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-1">Steps</div>
                    <div className="font-mono font-bold text-slate-800">{plan.assemblySteps.length} steps</div>
                </div>
            </div>
        </div>

        {/* Main Content Tabs */}
        <div className="border-b border-slate-200">
            <nav className="flex -mb-px">
            <button
                onClick={() => setActiveTab('cuts')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'cuts'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
            >
                Cut List & Materials
            </button>
            <button
                onClick={() => setActiveTab('steps')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'steps'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
            >
                Instructions
            </button>
            </nav>
        </div>

        <div className="p-6 md:p-8 bg-slate-50/50 min-h-[400px]">
            {activeTab === 'cuts' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-amber-500"/> Shopping List
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {plan.shoppingList.map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 bg-white p-3 rounded border border-slate-200 shadow-sm">
                                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                    <span className="text-slate-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Ruler className="w-5 h-5 text-amber-500"/> Cut List
                        </h3>
                        <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
                            <table className="min-w-full divide-y divide-slate-200 bg-white">
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Part</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Qty</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Dimensions</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Material</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {plan.cutList.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.partName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono font-bold bg-slate-100 w-16 text-center">{item.quantity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">{item.thickness} x {item.width} x {item.length}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.material}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'steps' && (
                <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
                    {plan.assemblySteps.map((step) => (
                        <div key={step.stepNumber} className="flex gap-4 group">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 border-slate-200 group-hover:border-amber-500 group-hover:text-amber-600 text-slate-400 flex items-center justify-center font-bold text-lg transition-colors">
                                {step.stepNumber}
                            </div>
                            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex-grow group-hover:shadow-md transition-shadow">
                                <p className="text-slate-800 leading-relaxed">{step.instruction}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
    
    <SocialShare />

    {/* Email Capture Modal */}
    {showEmailModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                     <div className="flex justify-between items-start relative z-10">
                        <h3 className="text-xl font-bold">
                            {modalType === 'download' ? 'Send Plan to Email' : 'Save to My Projects'}
                        </h3>
                        <button onClick={() => setShowEmailModal(false)} className="text-white/60 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                     </div>
                     <p className="text-slate-400 mt-2 text-sm relative z-10">
                         {modalType === 'download' 
                            ? "We'll send the PDF, Cut List, and Shopping List directly to your inbox."
                            : "Create a free account to save this plan and access it from any device."}
                     </p>
                </div>
                
                <form onSubmit={handleEmailSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-bold text-slate-700">Email Address</label>
                        <div className="relative">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Mail className="w-5 h-5" />
                             </div>
                            <input 
                                type="email" 
                                id="email"
                                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow outline-none"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setEmailError('');
                                }}
                                autoFocus
                            />
                        </div>
                        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                    </div>
                    
                    <button 
                        type="submit"
                        disabled={isGeneratingPdf}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGeneratingPdf ? 'Generating PDF...' : (modalType === 'download' ? 'Send My PDF' : 'Create Free Account')}
                    </button>
                    
                     <p className="text-xs text-center text-slate-400">
                        Join 15,000+ makers. Unsubscribe anytime.
                    </p>
                </form>
            </div>
        </div>
    )}
    </>
  );
};

export default PlanDisplay;
