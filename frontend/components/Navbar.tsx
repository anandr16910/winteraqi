import React from 'react';
import { Wind, ShieldCheck, SlidersHorizontal, CloudFog } from 'lucide-react';

interface NavbarProps {
  onOpenProfile: () => void;
  cityName: string;
  aqiValue: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenProfile, cityName, aqiValue }) => {
  const getBadgeColor = (aqi: number) => {
    if (aqi <= 50) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    if (aqi <= 100) return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    if (aqi <= 200) return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
    if (aqi <= 300) return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
    return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
  };

  return (
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
        <div className="flex items-center gap-3">
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${getBadgeColor(aqiValue)}`}>
            <span className="w-2 h-2 rounded-full animate-pulse bg-current"></span>
            <span>{cityName}: AQI {aqiValue}</span>
          </div>

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
  );
};
