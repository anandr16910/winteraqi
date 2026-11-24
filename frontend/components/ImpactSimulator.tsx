import React from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingDown, ShieldCheck, Leaf, Users, Award, Sparkles } from 'lucide-react';
import { ImpactEstimation, CityAirData } from '../types';

interface ImpactSimulatorProps {
  impact: ImpactEstimation;
  airData: CityAirData;
}

export const ImpactSimulator: React.FC<ImpactSimulatorProps> = ({ impact, airData }) => {
  // 24-hour diurnal curve comparing outdoor smog vs sealed + filtered indoors
  const diurnalData = [
    { time: '04 AM', outdoorSmog: airData.pm25 * 1.1, indoorUnprotected: airData.pm25 * 0.85, auraGuardHome: 18 },
    { time: '07 AM', outdoorSmog: airData.pm25 * 1.35, indoorUnprotected: airData.pm25 * 1.05, auraGuardHome: 22 },
    { time: '10 AM', outdoorSmog: airData.pm25 * 0.95, indoorUnprotected: airData.pm25 * 0.8, auraGuardHome: 15 },
    { time: '01 PM', outdoorSmog: airData.pm25 * 0.65, indoorUnprotected: airData.pm25 * 0.55, auraGuardHome: 12 },
    { time: '04 PM', outdoorSmog: airData.pm25 * 0.75, indoorUnprotected: airData.pm25 * 0.65, auraGuardHome: 14 },
    { time: '07 PM', outdoorSmog: airData.pm25 * 1.4, indoorUnprotected: airData.pm25 * 1.1, auraGuardHome: 20 },
    { time: '10 PM', outdoorSmog: airData.pm25 * 1.25, indoorUnprotected: airData.pm25 * 0.95, auraGuardHome: 16 }
  ];

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/80">
              <TrendingDown className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-slate-100">
              Direct Health & Community Emission Impact
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Quantifiable biological exposure prevention and carbon/particulate reductions achieved by your household.
          </p>
        </div>
      </div>

      {/* Top metric tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Inhaled PM2.5 Avoided
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-emerald-300">
              {impact.dailyInhaledPm25AvoidedUg}
            </span>
            <span className="text-xs text-slate-400">µg / day</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Saves lungs from toxic alveolar soot penetration
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-teal-400" />
            Local CO2 Prevented
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-teal-300">
              {impact.dailyCo2AvoidedKg}
            </span>
            <span className="text-xs text-slate-400">kg CO2e</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Through anti-idling, carpooling & clean heating
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            Respiratory Risk Cut
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-cyan-300">
              {impact.healthRiskReductionPercent}%
            </span>
            <span className="text-xs text-slate-400">Reduction</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Reduced acute coughing, asthma and eye burn
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            Community Multiplier
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-purple-300">
              {impact.communityCleanAirMultiplier}x
            </span>
            <span className="text-xs text-slate-400">Catalyst</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            When shared with 3 neighbors or school parents
          </p>
        </div>
      </div>

      {/* Visual Chart: 24h Diurnal curve */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-200">
              24-Hour Micro-Particulate (PM2.5) Exposure Curve
            </h4>
            <p className="text-xs text-slate-400">
              Comparing ambient street smog vs unsealed home vs AuraGuard protected sanctuary.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Outdoor Street
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Unsealed Home
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              AuraGuard Home
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={diurnalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOutdoor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorUnsealed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorProtected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="µg" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Area 
                type="monotone" 
                dataKey="outdoorSmog" 
                name="Outdoor Smog" 
                stroke="#f43f5e" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorOutdoor)" 
              />
              <Area 
                type="monotone" 
                dataKey="indoorUnprotected" 
                name="Unprotected Home" 
                stroke="#f59e0b" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorUnsealed)" 
              />
              <Area 
                type="monotone" 
                dataKey="auraGuardHome" 
                name="AuraGuard Protected" 
                stroke="#10b981" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorProtected)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-2xl p-4 text-xs sm:text-sm text-emerald-200/90 leading-relaxed flex items-start gap-2.5">
        <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <p>{impact.actionSummary}</p>
      </div>
    </div>
  );
};
