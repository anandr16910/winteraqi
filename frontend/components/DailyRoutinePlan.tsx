import React from 'react';
import { Clock, ShieldAlert, Sparkles, Wind, Leaf, ArrowRight } from 'lucide-react';
import { DailyScheduleSlot } from '../types';

interface DailyRoutinePlanProps {
  slots: DailyScheduleSlot[];
  isLoading: boolean;
}

export const DailyRoutinePlan: React.FC<DailyRoutinePlanProps> = ({ slots, isLoading }) => {
  const getSmogLevelBadge = (level: string) => {
    switch (level) {
      case 'Lowest':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Moderate':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Severe Peak':
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
  };

  const getVentilationBadge = (status: string) => {
    switch (status) {
      case 'Filtered Venting Safe':
        return 'bg-teal-950 text-teal-300 border-teal-800';
      case 'Keep Sealed':
        return 'bg-orange-950 text-orange-300 border-orange-800';
      case 'Absolute Lockdown':
      default:
        return 'bg-red-950 text-red-300 border-red-800';
    }
  };

  return (
    <section aria-labelledby="daily-routine-heading" className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/80" aria-hidden="true">
              <Clock className="w-4 h-4" />
            </span>
            <h2 id="daily-routine-heading" className="text-lg font-bold text-slate-100">
              24-Hour Diurnal Smog Navigation Routine
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Synchronized with winter temperature inversion cycles to minimize inhalation and prevent neighborhood emissions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" aria-hidden="true" />
            Inversion Peak
          </span>
          <span className="flex items-center gap-1.5 ml-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Solar Mixing Trough
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center" role="status" aria-live="polite">
          <Wind className="w-8 h-8 text-emerald-400 animate-spin motion-reduce:animate-none mx-auto mb-3" aria-hidden="true" />
          <p className="text-sm font-medium text-slate-300">
            Synthesizing 24-hour diurnal atmospheric model with Gemini...
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Analyzing boundary layer physics, traffic curves, and household exposure thresholds.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {slots.map((slot, index) => (
            <div
              key={index}
              className="group relative bg-slate-950/80 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition-all shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-900">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-semibold text-sm sm:text-base text-slate-200">
                    {slot.timeSlot}
                  </h3>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${getSmogLevelBadge(slot.ambientSmogLevel)}`}>
                    Smog: {slot.ambientSmogLevel}
                  </span>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${getVentilationBadge(slot.ventilationStatus)}`}>
                    {slot.ventilationStatus}
                  </span>
                </div>
              </div>

              {/* Action content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-1">
                {/* Protective activity */}
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
                    Family Protection Guideline
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {slot.recommendedActivity}
                  </p>
                </div>

                {/* Low emission contribution */}
                <div className="space-y-1 bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-3">
                  <span className="text-xs font-semibold text-teal-300 flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5" aria-hidden="true" />
                    Low-Emission Community Choice
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {slot.lowEmissionTip}
                  </p>
                </div>
              </div>

              {/* Underlying atmospheric physics */}
              <div className="mt-3 pt-2 text-[11px] text-slate-400 flex items-baseline gap-1.5">
                <span className="font-semibold text-slate-300">Why this works:</span>
                <span>{slot.reasoning}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
