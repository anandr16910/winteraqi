import React, { useEffect } from 'react';
import { 
  X, 
  Crosshair, 
  Trees, 
  Clock, 
  Sparkles, 
  TrendingDown, 
  Bot, 
  ShieldCheck, 
  Layers, 
  Compass, 
  Users, 
  Search, 
  Wrench,
  CheckCircle2,
  Wind
} from 'lucide-react';

interface FeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeaturesModal: React.FC<FeaturesModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const features = [
    {
      icon: Wind,
      color: 'text-emerald-400 bg-emerald-950/80 border-emerald-800',
      badge: 'NEW Sizing Tool',
      title: 'Room-by-Room CADR & ACH Sizer',
      description: 'Calculates required Air Changes per Hour (ACH) for DIY Corsi-Rosenthal boxes vs commercial HEPA purifiers based on exact room dimensions and ceiling heights, plotting clearance curves to WHO safe levels (<15 µg/m³).'
    },
    {
      icon: Crosshair,
      color: 'text-emerald-400 bg-emerald-950/80 border-emerald-800',
      badge: 'Location Services',
      title: 'Real-Time GPS & Station Mapping',
      description: 'One-click exact browser geolocation detects your device coordinates, resolves local municipality boundaries, and connects to the nearest continuous government ambient monitoring station.'
    },
    {
      icon: Trees,
      color: 'text-teal-400 bg-teal-950/80 border-teal-800',
      badge: 'Micro-Climate Engine',
      title: 'Hyper-Local Micro-AQI & Sanctuaries',
      description: 'Reveals how air quality varies across town. Pinpoints botanical gardens, urban parks, and HVAC-filtered public libraries with 30% to 85% cleaner air than surrounding street canyons.'
    },
    {
      icon: Sparkles,
      color: 'text-cyan-400 bg-cyan-950/80 border-cyan-800',
      badge: 'Interactive Tool',
      title: 'Custom Spot Aerodynamic Checker',
      description: 'Test any building, school courtyard, residential floor level, or subway station to receive an immediate aerodynamic air exchange rate and particulate forecast.'
    },
    {
      icon: Users,
      color: 'text-purple-400 bg-purple-950/80 border-purple-800',
      badge: 'Personalized',
      title: 'Family & Vulnerability Profiling',
      description: 'Adapts guidance specifically for households with infants, elderly family members, asthmatics, and pets, tailored to your dwelling type and commute routine.'
    },
    {
      icon: Clock,
      color: 'text-amber-400 bg-amber-950/80 border-amber-800',
      badge: 'Atmospheric Physics',
      title: '24-Hour Diurnal Routine Navigator',
      description: 'Synchronizes your schedule with diurnal boundary-layer inversion physics: avoids nocturnal peak smog, leverages afternoon solar mixing troughs, and secures night sleep sanctuaries.'
    },
    {
      icon: Wrench,
      color: 'text-emerald-400 bg-emerald-950/80 border-emerald-800',
      badge: 'DIY Lab',
      title: 'Indoor Air Quality (IAQ) Blueprints',
      description: 'Tested instructions for DIY Corsi-Rosenthal boxes, electrostatic wet-mopping protocols, lidded cooking moisture traps, and compression draft weatherstripping.'
    },
    {
      icon: TrendingDown,
      color: 'text-rose-400 bg-rose-950/80 border-rose-800',
      badge: 'Quantified Impact',
      title: 'Exposure & Health Impact Simulator',
      description: 'Interactive Recharts visualization calculating daily inhaled PM2.5 avoided (µg/day), local CO2 prevented (kg), and percentage reduction in acute respiratory risks.'
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="features-modal-title"
    >
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400" aria-hidden="true">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="features-modal-title" className="text-lg font-bold text-slate-100 flex items-center gap-2">
                AuraGuard Core Features & Guide
              </h2>
              <p className="text-xs text-slate-400">
                GenAI atmospheric intelligence designed for severe winter smog and urban clean air resilience
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close features guide dialog"
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 py-5">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div 
                key={index}
                className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-900 text-emerald-300 border border-slate-800">
                      {feat.badge}
                    </span>
                    <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${feat.color}`} aria-hidden="true">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 mb-1">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout */}
        <div className="bg-emerald-950/30 border border-emerald-800/60 rounded-2xl p-4 text-xs text-emerald-200/90 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" aria-hidden="true" />
            <span>
              All data is continuously updated through <strong>Gemini 2.5 Flash</strong> with real-time <strong>Google Search Grounding</strong>.
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-950 whitespace-nowrap transition-all"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
