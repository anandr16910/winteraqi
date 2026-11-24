import React, { useState } from 'react';
import { Wind, ShieldCheck, SlidersHorizontal, CloudFog, Cpu, Sparkles, X, CheckCircle, ExternalLink, Search, Database, Bot, BookOpen } from 'lucide-react';
import { FeaturesModal } from './FeaturesModal';

interface NavbarProps {
  onOpenProfile: () => void;
  cityName: string;
  aqiValue: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenProfile, cityName, aqiValue }) => {
  const [showAiModal, setShowAiModal] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);

  const getBadgeColor = (aqi: number) => {
    if (aqi <= 50) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    if (aqi <= 100) return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    if (aqi <= 200) return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
    if (aqi <= 300) return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
    return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30">
              <Wind className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 bg-clip-text text-transparent">
                  AuraGuard
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                  Winter Defense
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <CloudFog className="w-3 h-3 text-slate-500" />
                Smog Navigator & Urban Clean Air
              </p>
            </div>
          </div>

          {/* Right action group */}
          <div className="flex items-center gap-2.5">
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${getBadgeColor(aqiValue)}`}>
              <span className="w-2 h-2 rounded-full animate-pulse bg-current"></span>
              <span>{cityName}: AQI {aqiValue}</span>
            </div>

            {/* Features Guide Button */}
            <button
              onClick={() => setShowFeaturesModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-slate-100 border border-slate-700 hover:border-slate-600 transition-all text-xs font-semibold shadow-sm"
              title="Explore all 8 Core Features of AuraGuard"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span className="hidden lg:inline">Features</span>
            </button>

            {/* AI Tools Inspector Button */}
            <button
              onClick={() => setShowAiModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 hover:border-emerald-500 transition-all text-xs font-semibold shadow-sm"
              title="View AI Models, SDKs & Grounding Tools used in this app"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">AI Stack</span>
            </button>

            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all text-xs sm:text-sm font-medium shadow-sm hover:shadow"
              title="Configure Family & Lifestyle Profile"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Family & Home Profile</span>
              <span className="sm:hidden">Profile</span>
            </button>
          </div>
        </div>
      </header>

      {/* Interactive Features Guide Modal */}
      <FeaturesModal
        isOpen={showFeaturesModal}
        onClose={() => setShowFeaturesModal(false)}
      />

      {/* AI Stack Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    AI Tools & Technologies in AuraGuard
                  </h3>
                  <p className="text-xs text-slate-400">
                    Engineered using Google's Gemini Generative AI Platform & Vertex AI
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <Bot className="w-4 h-4" />
                  <span>1. Foundation Model: gemini-2.5-flash</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Powers real-time atmospheric reasoning, micro-climate simulation, diurnal routine scheduling, and natural conversational health guidance.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-teal-400 font-semibold">
                  <Search className="w-4 h-4" />
                  <span>2. Google Search Grounding (tools: [&#123; googleSearch: &#123;&#125; &#125;])</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Overcomes static knowledge cutoffs by performing live web searches for current city AQI, PM2.5 readings, winter inversion alerts, and resolving exact GPS coordinates to nearest official continuous monitoring sensors.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                  <Database className="w-4 h-4" />
                  <span>3. Structured Output Engine (responseSchema & OpenAPI Types)</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Enforces strict JSON schema validation for typed numbers, categories, 6-zone micro-location models, custom spot evaluations, and 24-hour schedules.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-purple-400 font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>4. Domain Persona & System Instructions (systemInstruction)</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Conditions the model as an atmospheric scientist and IAQ engineer specialized in aerosol deposition physics, temperature inversion caps, and family respiratory protection.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  <span>5. Official SDK: @google/genai (Vertex AI Client)</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Configured with <code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded">new GoogleGenAI(&#123; apiKey, vertexai: true &#125;)</code> for secure, high-performance streaming and enterprise-grade inference.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
