import React, { useState } from 'react';
import { 
  Trees, 
  Building2, 
  Compass, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowDownRight, 
  ArrowUpRight, 
  Clock, 
  Sparkles, 
  Building, 
  Layers, 
  CheckCircle,
  TrendingDown
} from 'lucide-react';
import { MicroLocationAQI, CustomSpotEvaluation, CityAirData } from '../types';
import { evaluateCustomMicroSpot } from '../services/geminiService';

interface MicroLocationNavigatorProps {
  locations: MicroLocationAQI[];
  cityAir: CityAirData;
  isLoading: boolean;
}

export const MicroLocationNavigator: React.FC<MicroLocationNavigatorProps> = ({
  locations,
  cityAir,
  isLoading
}) => {
  const [filter, setFilter] = useState<'all' | 'sanctuaries' | 'traps'>('all');
  const [customInput, setCustomInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [customEvaluation, setCustomEvaluation] = useState<CustomSpotEvaluation | null>(null);

  const filteredLocations = locations.filter((loc) => {
    if (filter === 'sanctuaries') return loc.deltaPercent < 0;
    if (filter === 'traps') return loc.deltaPercent >= 0;
    return true;
  });

  const handleCustomCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim() || isEvaluating) return;
    setIsEvaluating(true);
    try {
      const result = await evaluateCustomMicroSpot(customInput.trim(), cityAir);
      setCustomEvaluation(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'garden_park':
        return <Trees className="w-4 h-4 text-emerald-400" />;
      case 'filtered_building':
        return <Building2 className="w-4 h-4 text-cyan-400" />;
      case 'high_rise_elevation':
        return <Building className="w-4 h-4 text-sky-400" />;
      case 'street_canyon':
      case 'transit_hub':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      default:
        return <Compass className="w-4 h-4 text-teal-400" />;
    }
  };

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'Excellent Sanctuary':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Moderate Refuge':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
      case 'Average Ambient':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'High Exposure Risk':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Severe Smog Trap':
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/80">
              <Trees className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-slate-100">
              Hyper-Local Micro-AQI & Clean Air Sanctuaries
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Smog is not uniform. Dense botanical gardens, city parks with tree canopies, and air-conditioned/filtered buildings provide significant micro-climate relief from ground-level thermal inversions.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {[
            { id: 'all', label: 'All Micro-Spots' },
            { id: 'sanctuaries', label: '🌿 Clean Sanctuaries' },
            { id: 'traps', label: '⚠️ Smog Traps' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === tab.id
                  ? 'bg-emerald-600 text-slate-950 shadow-md shadow-emerald-950'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Micro Location Grid */}
      {isLoading ? (
        <div className="py-12 text-center">
          <Compass className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-300">
            Mapping micro-climates, vegetation buffers & building HVAC in {cityAir.city}...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLocations.map((loc) => {
            const isCleaner = loc.deltaPercent < 0;
            return (
              <div
                key={loc.id}
                className={`relative rounded-2xl p-4 sm:p-5 border flex flex-col justify-between transition-all ${
                  isCleaner
                    ? 'bg-slate-950/80 border-emerald-900/40 hover:border-emerald-500/60 shadow-sm'
                    : 'bg-slate-950/80 border-rose-950/40 hover:border-rose-800/60 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
                      {getCategoryIcon(loc.category)}
                      {loc.categoryLabel}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getRatingBadge(loc.cleanAirRating)}`}>
                      {loc.cleanAirRating}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-slate-100 line-clamp-1">
                    {loc.name}
                  </h4>

                  {/* Micro AQI comparison */}
                  <div className="flex items-baseline gap-3 my-3 pb-3 border-b border-slate-900">
                    <div>
                      <span className="text-2xl sm:text-3xl font-black text-slate-100">
                        {loc.estimatedAqi}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400 ml-1">AQI</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold">
                      {isCleaner ? (
                        <span className="text-emerald-400 flex items-center">
                          <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
                          {Math.abs(loc.deltaPercent)}% Cleaner
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center">
                          <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                          +{loc.deltaPercent}% Dirtier
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 font-normal">vs city avg ({cityAir.aqi})</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {loc.microClimateReason}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {loc.recommendedBestTime}
                  </span>
                  <span className="font-medium text-slate-300">
                    PM2.5: ~{loc.estimatedPm25} µg
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Custom Spot Checker */}
      <div className="mt-8 pt-6 border-t border-slate-800">
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Custom Spot Micro-AQI Checker
              </span>
              <h4 className="text-sm sm:text-base font-bold text-slate-100 mt-0.5">
                Test any building, school courtyard, local garden, or floor level in {cityAir.city}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Gemini uses building aerodynamics, tree coverage density, and inversion stratification to estimate local air quality.
              </p>
            </div>
          </div>

          <form onSubmit={handleCustomCheck} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="e.g. 'City Botanical Greenhouse', '18th floor balcony', 'Subway underground station', 'St. Mary School campus'..."
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isEvaluating || !customInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-950 flex items-center gap-1.5 whitespace-nowrap"
            >
              {isEvaluating ? (
                <span>Evaluating...</span>
              ) : (
                <>
                  <Compass className="w-4 h-4 stroke-[2.5]" />
                  <span>Check Spot</span>
                </>
              )}
            </button>
          </form>

          {/* Custom Evaluation Result Card */}
          {customEvaluation && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/60 text-slate-200 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-900/40">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                    Micro-Climate Assessment
                  </span>
                  <h5 className="text-base font-bold text-slate-100">
                    {customEvaluation.spotName}
                  </h5>
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-2xl font-black text-slate-100">
                      {customEvaluation.estimatedAqi}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold ml-1">Est. AQI</span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    customEvaluation.deltaVsCityPercent < 0 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}>
                    {customEvaluation.deltaVsCityPercent < 0 ? `${customEvaluation.deltaVsCityPercent}% vs Town Avg` : `+${customEvaluation.deltaVsCityPercent}% vs Town Avg`}
                  </span>
                </div>
              </div>

              <div className="mt-3 space-y-2 text-xs sm:text-sm">
                <p className="text-slate-300 leading-relaxed">
                  <span className="font-semibold text-emerald-300 mr-1.5">Atmospheric Factor:</span>
                  {customEvaluation.atmosphericExplanation}
                </p>
                <p className="text-slate-300 leading-relaxed">
                  <span className="font-semibold text-teal-300 mr-1.5">Family Recommendation:</span>
                  {customEvaluation.actionAdvice}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
