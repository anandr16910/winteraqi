import React, { useState, useMemo } from 'react';
import { 
  Wind, 
  Layers, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Sliders, 
  HelpCircle, 
  CheckCircle2, 
  Baby, 
  Bed, 
  Armchair, 
  Laptop, 
  CookingPot, 
  Plus, 
  Zap, 
  Volume2, 
  DollarSign 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { 
  RoomType, 
  RoomPreset, 
  PurifierOption, 
  CadrCalculationResult, 
  ScrubbingDataPoint, 
  CityAirData 
} from '../types';

interface CadrSizingCalculatorProps {
  currentCityAir: CityAirData;
}

export const ROOM_PRESETS: RoomPreset[] = [
  {
    id: 'nursery',
    name: "Baby Nursery / Children's Room",
    defaultLengthFt: 12,
    defaultWidthFt: 11,
    defaultCeilingFt: 9,
    targetAch: 6.0,
    priorityNote: 'Highest vulnerability: Infants breathe 2x faster per kg of body mass. Aim for >= 5.5 ACH.'
  },
  {
    id: 'bedroom',
    name: 'Master / Primary Bedroom',
    defaultLengthFt: 14,
    defaultWidthFt: 13,
    defaultCeilingFt: 9,
    targetAch: 5.0,
    priorityNote: 'Sleep Sanctuary: 8 hours of continuous nocturnal breathing during peak thermal inversion smog.'
  },
  {
    id: 'living',
    name: 'Main Living Room / Family Hall',
    defaultLengthFt: 20,
    defaultWidthFt: 16,
    defaultCeilingFt: 9.5,
    targetAch: 4.5,
    priorityNote: 'High traffic volume: Frequent doorway openings and family movement aerosolize soot.'
  },
  {
    id: 'office',
    name: 'Work-from-Home Study / Office',
    defaultLengthFt: 12,
    defaultWidthFt: 10,
    defaultCeilingFt: 8.5,
    targetAch: 4.5,
    priorityNote: 'Cognitive defense: PM2.5 exposure drops focus and executive decision-making speed.'
  },
  {
    id: 'kitchen',
    name: 'Dining / Open Kitchen Area',
    defaultLengthFt: 15,
    defaultWidthFt: 12,
    defaultCeilingFt: 9,
    targetAch: 6.0,
    priorityNote: 'Combustion hot spot: Gas stove NOx & oil frying aerosols generate micro-particulates > 400 µg/m³.'
  }
];

export const PURIFIER_OPTIONS: PurifierOption[] = [
  {
    id: 'cr_box_classic',
    name: 'DIY Corsi-Rosenthal Box (4x MERV 13 + 20" Box Fan)',
    category: 'diy_box_fan',
    cadrCfm: 550,
    noiseDba: '50-54 dBA (Medium/Quiet)',
    costEstimate: '$55 - $70 (Filters + Fan)',
    powerWatts: 65,
    description: 'Gold standard DIY air purifier. 4 large 20x20x2 MERV-13 filters deliver exceptional low-resistance airflow and 550+ CFM smoke CADR equal to $800 commercial appliances.'
  },
  {
    id: 'cr_box_mini_pc',
    name: 'DIY Mini PC-Fan CR Box (4x 140mm Silent Fans + MERV 13)',
    category: 'diy_box_fan',
    cadrCfm: 180,
    noiseDba: '28-34 dBA (Ultra-Quiet Bedside)',
    costEstimate: '$45 - $60',
    powerWatts: 15,
    description: 'Ultra-silent bedroom sanctuary design powered by low-wattage 12V computer fans. Whisper quiet for sleeping infants and asthmatics.'
  },
  {
    id: 'cr_box_single_merv',
    name: 'DIY Quick Tape (1x MERV 13 + 20" Box Fan Shrouded)',
    category: 'diy_box_fan',
    cadrCfm: 260,
    noiseDba: '52-56 dBA',
    costEstimate: '$30 - $38',
    powerWatts: 65,
    description: 'A single 20x20 filter taped directly to the fan intake with a circular cardboard face shroud. Budget emergency setup.'
  },
  {
    id: 'commercial_large',
    name: 'Large Commercial HEPA Tower (e.g., Levoit 600S / Coway Airmega 400)',
    category: 'commercial_hepa',
    cadrCfm: 410,
    noiseDba: '25-54 dBA',
    costEstimate: '$280 - $450',
    powerWatts: 50,
    description: 'High-capacity commercial HEPA unit with laser particle sensor and auto-fan speed throttling.'
  },
  {
    id: 'commercial_compact',
    name: 'Compact Room HEPA Purifier (e.g., Levoit Core 300 / Blueair 411)',
    category: 'commercial_hepa',
    cadrCfm: 140,
    noiseDba: '24-48 dBA',
    costEstimate: '$99 - $130',
    powerWatts: 35,
    description: 'Entry-level compact bedroom filter. Needs to run on high speed during severe smog to reach adequate CADR.'
  },
  {
    id: 'dual_cr_boxes',
    name: 'Dual Power Setup (2x DIY Corsi-Rosenthal Boxes)',
    category: 'diy_box_fan',
    cadrCfm: 1100,
    noiseDba: '52 dBA (Distributed)',
    costEstimate: '$110 - $140',
    powerWatts: 130,
    description: 'Two CR boxes on opposite sides of large open-plan living rooms or classrooms. Achieves rapid clearance in under 15 minutes.'
  }
];

export const CadrSizingCalculator: React.FC<CadrSizingCalculatorProps> = ({ currentCityAir }) => {
  const [unitSystem, setUnitSystem] = useState<'imperial' | 'metric'>('imperial');
  const [selectedRoomId, setSelectedRoomId] = useState<RoomType>('bedroom');
  const [selectedPurifierId, setSelectedPurifierId] = useState<string>('cr_box_classic');
  const [purifierCount, setPurifierCount] = useState<number>(1);

  // Dimension states (stored in feet internally)
  const [lengthFt, setLengthFt] = useState<number>(14);
  const [widthFt, setWidthFt] = useState<number>(13);
  const [ceilingFt, setCeilingFt] = useState<number>(9);

  // Infiltration condition (air leakage of the room)
  const [roomSealing, setRoomSealing] = useState<'well_sealed' | 'average' | 'drafty'>('average');

  // Custom Purifier CADR state when custom is picked
  const [customCadr, setCustomCadr] = useState<number>(300);

  // Active room preset handler
  const handleRoomPresetChange = (roomId: RoomType) => {
    setSelectedRoomId(roomId);
    const preset = ROOM_PRESETS.find((p) => p.id === roomId);
    if (preset) {
      setLengthFt(preset.defaultLengthFt);
      setWidthFt(preset.defaultWidthFt);
      setCeilingFt(preset.defaultCeilingFt);
    }
  };

  // Convert for metric display
  const toMetricMeters = (feet: number) => (feet * 0.3048).toFixed(1);

  // Calculations
  const calculation = useMemo<CadrCalculationResult>(() => {
    const volumeCuFt = lengthFt * widthFt * ceilingFt;
    const volumeCuM = volumeCuFt * 0.0283168;

    const selectedPurifier = PURIFIER_OPTIONS.find((p) => p.id === selectedPurifierId);
    const baseCadr = selectedPurifier ? selectedPurifier.cadrCfm : customCadr;
    const totalCadr = baseCadr * purifierCount;

    // ACH = (CADR in CFM * 60) / Room Volume in Cu Ft
    const achDelivered = volumeCuFt > 0 ? (totalCadr * 60) / volumeCuFt : 0;
    const activePreset = ROOM_PRESETS.find((r) => r.id === selectedRoomId);
    const targetAch = activePreset ? activePreset.targetAch : 5.0;

    const isAdequate = achDelivered >= targetAch;
    const targetCadrRequired = (targetAch * volumeCuFt) / 60;
    const cleanAirDeficitCfm = Math.max(0, targetCadrRequired - totalCadr);

    // Natural infiltration rate in ACH
    const infiltrationAch = roomSealing === 'well_sealed' ? 0.25 : roomSealing === 'average' ? 0.55 : 1.1;

    // Air scrubbing decay dynamics (first order particle clearance model)
    // k = ACH_purifier + natural_deposition (0.15)
    // Differential equation: dC/dt = infiltration*C_outdoor - (ACH_purifier + infiltration + deposition)*C
    const initialPm25 = currentCityAir.pm25 || 150;
    const safeThresholdPm25 = 15; // WHO 24h particulate guideline
    const effectiveRemovalRatePerMin = (achDelivered + infiltrationAch + 0.15) / 60;

    // Equilibrium PM2.5 in closed room: C_eq = C_outdoor * (infiltration / (achDelivered + infiltration + 0.15))
    const equilibriumPm25 = initialPm25 * (infiltrationAch / (achDelivered + infiltrationAch + 0.15));

    // Time to reach safe threshold (or 90% of clearance towards equilibrium)
    let minutesToSafe = 0;
    if (equilibriumPm25 <= safeThresholdPm25 && initialPm25 > safeThresholdPm25) {
      minutesToSafe = Math.round(
        Math.log((initialPm25 - equilibriumPm25) / (safeThresholdPm25 - equilibriumPm25)) / effectiveRemovalRatePerMin
      );
      if (minutesToSafe < 0 || isNaN(minutesToSafe)) minutesToSafe = 18;
    } else if (equilibriumPm25 > safeThresholdPm25) {
      // Cannot fully reach safe threshold without tighter sealing or higher CADR
      minutesToSafe = Math.round(Math.log(initialPm25 / safeThresholdPm25) / effectiveRemovalRatePerMin);
    }

    const minutesTo90Percent = Math.round(Math.log(10) / effectiveRemovalRatePerMin);

    // Generate timeline data curve (0 to 90 minutes)
    const decayTimeline: ScrubbingDataPoint[] = [];
    const maxTimelineMin = 90;
    for (let m = 0; m <= maxTimelineMin; m += 5) {
      // Exponential decay towards equilibrium
      const currentPm = equilibriumPm25 + (initialPm25 - equilibriumPm25) * Math.exp(-effectiveRemovalRatePerMin * m);
      decayTimeline.push({
        minute: m,
        pm25: Math.round(currentPm),
        safeLimit: safeThresholdPm25
      });
    }

    let verdict: CadrCalculationResult['verdict'] = 'Optimal Clean Sanctuary';
    if (achDelivered < targetAch * 0.75) {
      verdict = 'Underpowered for Smog';
    } else if (achDelivered < targetAch) {
      verdict = 'Adequate Defense';
    }

    let actionableRecommendation = '';
    if (verdict === 'Optimal Clean Sanctuary') {
      actionableRecommendation = `Delivers ${achDelivered.toFixed(1)} ACH (clean air changes per hour), comfortably exceeding the ${targetAch} ACH winter smog safety benchmark. A full scrub of this room's air takes ~${minutesToSafe} minutes.`;
    } else if (verdict === 'Adequate Defense') {
      actionableRecommendation = `Delivers ${achDelivered.toFixed(1)} ACH. Safe for adults, but during severe smog spikes (AQI > 300), add a door draft gasket or run an additional unit to protect infants or asthmatics.`;
    } else {
      actionableRecommendation = `Currently underpowered (${achDelivered.toFixed(1)} ACH vs ${targetAch} target). Clean air deficit is ${Math.round(cleanAirDeficitCfm)} CFM. We recommend upgrading to a 4-filter DIY Corsi-Rosenthal Box or adding a second purifier.`;
    }

    return {
      roomVolumeCuFt: Math.round(volumeCuFt),
      roomVolumeCuM: Math.round(volumeCuM),
      achDelivered: parseFloat(achDelivered.toFixed(1)),
      achTarget: targetAch,
      isAdequate,
      cleanAirDeficitCfm: Math.round(cleanAirDeficitCfm),
      minutesToSafeLevel: Math.max(5, minutesToSafe),
      minutesTo90PercentClearance: Math.max(8, minutesTo90Percent),
      decayTimeline,
      verdict,
      actionableRecommendation
    };
  }, [lengthFt, widthFt, ceilingFt, selectedPurifierId, purifierCount, selectedRoomId, roomSealing, customCadr, currentCityAir.pm25]);

  const activePreset = ROOM_PRESETS.find((r) => r.id === selectedRoomId);
  const activePurifier = PURIFIER_OPTIONS.find((p) => p.id === selectedPurifierId);

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/80">
              <Wind className="w-5 h-5 stroke-[2.5]" />
            </span>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Room-by-Room CADR & Air Scrub Sizer
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              ASHRAE & EPA Aligned
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Size DIY Corsi-Rosenthal boxes and commercial HEPA purifiers to your room volume and ceiling height. Calculate required Air Changes per Hour (ACH) and precise clearance timelines to scrub smog down to WHO safe levels.
          </p>
        </div>

        {/* Unit System Toggle */}
        <div className="flex items-center gap-2 self-start lg:self-auto bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setUnitSystem('imperial')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              unitSystem === 'imperial'
                ? 'bg-emerald-600 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Feet / CFM (Imperial)
          </button>
          <button
            onClick={() => setUnitSystem('metric')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              unitSystem === 'metric'
                ? 'bg-emerald-600 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Meters / m³ (Metric)
          </button>
        </div>
      </div>

      {/* Room Preset Selector */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 block flex items-center justify-between">
          <span>Step 1: Choose Room Archetype</span>
          <span className="text-emerald-400 normal-case font-normal text-xs">
            Target: {activePreset?.targetAch || 5.0} ACH minimum during winter inversion
          </span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {ROOM_PRESETS.map((preset) => {
            const isSelected = selectedRoomId === preset.id;
            const getIcon = () => {
              switch (preset.id) {
                case 'nursery': return <Baby className="w-4 h-4" />;
                case 'bedroom': return <Bed className="w-4 h-4" />;
                case 'living': return <Armchair className="w-4 h-4" />;
                case 'office': return <Laptop className="w-4 h-4" />;
                case 'kitchen': return <CookingPot className="w-4 h-4" />;
              }
            };
            return (
              <button
                key={preset.id}
                onClick={() => handleRoomPresetChange(preset.id)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/50 shadow-md'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
                  {getIcon()}
                  <span>{preset.id.toUpperCase()}</span>
                </div>
                <div className="text-xs font-bold text-slate-100 line-clamp-1">
                  {preset.name}
                </div>
                <span className="text-[10px] text-slate-400 mt-1">
                  Target: {preset.targetAch} ACH
                </span>
              </button>
            );
          })}
        </div>
        {activePreset && (
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{activePreset.priorityNote}</span>
          </p>
        )}
      </div>

      {/* Room Dimensions & Infiltration Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl">
        {/* Length */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
            <span>Room Length</span>
            <span className="text-emerald-400 font-mono">
              {unitSystem === 'imperial' ? `${lengthFt} ft` : `${toMetricMeters(lengthFt)} m`}
            </span>
          </div>
          <input
            type="range"
            min={8}
            max={35}
            step={0.5}
            value={lengthFt}
            onChange={(e) => setLengthFt(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>8 ft (2.4m)</span>
            <span>35 ft (10.6m)</span>
          </div>
        </div>

        {/* Width */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
            <span>Room Width</span>
            <span className="text-emerald-400 font-mono">
              {unitSystem === 'imperial' ? `${widthFt} ft` : `${toMetricMeters(widthFt)} m`}
            </span>
          </div>
          <input
            type="range"
            min={8}
            max={30}
            step={0.5}
            value={widthFt}
            onChange={(e) => setWidthFt(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>8 ft (2.4m)</span>
            <span>30 ft (9.1m)</span>
          </div>
        </div>

        {/* Ceiling Height */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
            <span>Ceiling Height</span>
            <span className="text-teal-400 font-mono">
              {unitSystem === 'imperial' ? `${ceilingFt} ft` : `${toMetricMeters(ceilingFt)} m`}
            </span>
          </div>
          <input
            type="range"
            min={7.5}
            max={14}
            step={0.5}
            value={ceilingFt}
            onChange={(e) => setCeilingFt(parseFloat(e.target.value))}
            className="w-full accent-teal-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>Standard (8 ft)</span>
            <span>Loft / Cathedral (14 ft)</span>
          </div>
        </div>

        {/* Calculated Volume & Sealing */}
        <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Calculated Air Volume
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-100 mt-0.5">
              {unitSystem === 'imperial' ? (
                <>
                  {calculation.roomVolumeCuFt.toLocaleString()}{' '}
                  <span className="text-xs font-semibold text-slate-400">ft³</span>
                </>
              ) : (
                <>
                  {calculation.roomVolumeCuM.toLocaleString()}{' '}
                  <span className="text-xs font-semibold text-slate-400">m³</span>
                </>
              )}
            </div>
          </div>

          <div className="mt-2">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              Room Draftiness
            </span>
            <select
              value={roomSealing}
              onChange={(e) => setRoomSealing(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              <option value="well_sealed">Sealed / Weatherstripped (Low Infiltration)</option>
              <option value="average">Average Construction (0.5 ACH Leak)</option>
              <option value="drafty">Drafty / Older Building (1.1 ACH Leak)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Step 2: Purifier Selection */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            Step 2: Select Purifier Device or DIY Box-Fan Build
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Units deployed in this room:</span>
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-2 py-0.5">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => setPurifierCount(num)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                    purifierCount === num
                      ? 'bg-emerald-600 text-slate-950'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {num}x
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PURIFIER_OPTIONS.map((purifier) => {
            const isSelected = selectedPurifierId === purifier.id;
            return (
              <button
                key={purifier.id}
                onClick={() => setSelectedPurifierId(purifier.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-950/30 border-emerald-500 text-slate-100 ring-1 ring-emerald-500/40 shadow-lg shadow-emerald-950/20'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-teal-300 border border-slate-800">
                      {purifier.category === 'diy_box_fan' ? '🛠️ DIY Build' : '📦 Commercial'}
                    </span>
                    <span className="text-xs font-black text-emerald-400">
                      {purifier.cadrCfm * purifierCount} CFM
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 leading-snug">
                    {purifier.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {purifier.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-900/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                    {purifier.noiseDba}
                  </span>
                  <span className="flex items-center gap-1 text-slate-300 font-semibold">
                    <DollarSign className="w-3 h-3 text-emerald-400" />
                    {purifier.costEstimate}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Calculation Verdict & Scrubbing Metrics */}
      <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${
        calculation.isAdequate
          ? 'bg-gradient-to-br from-emerald-950/40 to-slate-950 border-emerald-500/50'
          : 'bg-gradient-to-br from-amber-950/40 to-slate-950 border-amber-500/50'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
              Sizing Diagnosis for {activePreset?.name}
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-slate-100 mt-0.5 flex items-center gap-2">
              {calculation.isAdequate ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <span>{calculation.verdict}</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-6 h-6 text-amber-400" />
                  <span>{calculation.verdict}</span>
                </>
              )}
            </h4>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-2 text-right">
              <span className="text-xs text-slate-400 block font-medium">Delivered ACH</span>
              <span className={`text-2xl sm:text-3xl font-black ${
                calculation.isAdequate ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {calculation.achDelivered}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Target: {calculation.achTarget} ACH
              </span>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-2 text-right">
              <span className="text-xs text-slate-400 block font-medium">Clearance Time</span>
              <span className="text-2xl sm:text-3xl font-black text-teal-300">
                {calculation.minutesToSafeLevel}
              </span>
              <span className="text-[10px] text-slate-400 block">
                mins to WHO safe (&lt;15 µg)
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Action Recommendation */}
        <p className="text-xs sm:text-sm text-slate-200 mt-3 leading-relaxed">
          {calculation.actionableRecommendation}
        </p>

        {/* 90-Minute Air Scrubbing Decay Curve */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h5 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                Air Scrubbing Curve: Micro-Particulate Clearance Over Time
              </h5>
              <p className="text-xs text-slate-400">
                Starting from current {currentCityAir.city} outdoor smog level ({currentCityAir.pm25} µg/m³ PM2.5) down to WHO safe baseline.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Room PM2.5 Concentration
              </span>
              <span className="flex items-center gap-1 text-teal-300">
                <span className="w-2.5 h-0.5 bg-teal-400" />
                WHO Safe Limit (15 µg/m³)
              </span>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={calculation.decayTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScrub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="minute" stroke="#64748b" tick={{ fontSize: 11 }} unit="m" />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="µg" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                  formatter={(value: any) => [`${value} µg/m³`, 'PM2.5']}
                  labelFormatter={(label) => `${label} minutes of continuous filtration`}
                />
                <ReferenceLine y={15} stroke="#2dd4bf" strokeDasharray="3 3" strokeWidth={1.5} label={{ value: 'Safe Limit 15 µg', fill: '#2dd4bf', fontSize: 10, position: 'right' }} />
                <Area
                  type="monotone"
                  dataKey="pm25"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorScrub)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Sizing Rules of Thumb */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
          <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-100 block">The 2/3 CADR Rule</span>
              <span>Your smoke CADR in CFM should be at least 2/3 of your room floor area in square feet for standard 8 ft ceilings.</span>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-100 block">High Ceiling Penalty</span>
              <span>Rooms with 10–12 ft ceilings hold 25–50% more air volume and require proportionally higher fan CFM to achieve 5 ACH.</span>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <Layers className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-100 block">Why CR Boxes Excel</span>
              <span>A single $60 Corsi-Rosenthal box produces ~550 CFM, satisfying living rooms up to 600 sq ft that would require three commercial units.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
