import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  HelpCircle, 
  Wrench, 
  Filter, 
  Wind, 
  Flame, 
  Layers, 
  Droplet,
  ChevronRight
} from 'lucide-react';
import { IaqHackItem } from '../types';

export const IAQ_HACKS: IaqHackItem[] = [
  {
    id: 'corsi-rosenthal',
    title: 'DIY Corsi-Rosenthal Box HEPA Alternative',
    category: 'filtration',
    cost: '$$ ($25-$60)',
    difficulty: 'Weekend Project',
    efficiencyRating: 9.8,
    description: 'A scientifically validated air purifier built using a 20-inch box fan and 4x MERV 13 furnace filters. Yields a Clean Air Delivery Rate (CADR) equal to $600 commercial HEPA units.',
    stepByStep: [
      'Tape 4 MERV-13 filters (20x20x2 or 20x20x1) into a cube with arrows pointing inward toward the center.',
      'Tape the bottom cardboard square as a solid sealed floor.',
      'Place the 20" box fan on top blowing air UPWARDS out of the cube.',
      'Cut a round cardboard shroud with a 14" center hole and tape it to the fan face to eliminate corner air backflow.',
      'Seal all seams thoroughly with duct tape to prevent dirty air bypass.'
    ],
    mythBuster: 'Myth: Commercial $800 purifiers have secret technology. Reality: Particle removal is purely a function of filter surface area and CFM fan airflow!'
  },
  {
    id: 'wet-mopping-barrier',
    title: 'Electrostatic Wet-Mopping Protocol',
    category: 'cleaning',
    cost: 'Free',
    difficulty: 'Quick (5m)',
    efficiencyRating: 8.5,
    description: 'Dry vacuuming or broom sweeping aerosolizes settled PM2.5 and toxic heavy metals back into breathing height. Wet-wiping traps soot permanently in microfiber water channels.',
    stepByStep: [
      'Never dry sweep during winter smog spells.',
      'Use a microfiber flat mop dampened with lukewarm water and a drop of Castile soap or vinegar.',
      'Wipe down windowsill frames and entryway floors twice daily where heavy soot enters through window drafts.',
      'Wring out into a bucket rather than dusting off.'
    ],
    mythBuster: 'Myth: Standard vacuum cleaners with paper bags clean your air. Reality: Non-sealed vacuum exhausts spray millions of PM0.3 particles straight into your throat!'
  },
  {
    id: 'kitchen-cooking-inversion',
    title: 'Thermal Lidded Cooking & Moisture Traps',
    category: 'cooking',
    cost: 'Free',
    difficulty: 'Quick (5m)',
    efficiencyRating: 8.9,
    description: 'Indoor oil frying and gas flame combustion easily generate PM2.5 spikes exceeding 500 µg/m³ inside closed winter homes.',
    stepByStep: [
      'Keep heavy lids tightly on pots to trap moisture and oil aerosols.',
      'Run kitchen exhaust only on high when cooking, but crack an isolated downwind window slightly to prevent negative pressure sucking smog in from outside crevices.',
      'Shift from high-smoke oil searing to boiling, steaming, slow braising, or electric instant pots.',
      'Ensure kitchen door is latched to stop fumes drifting into bedrooms.'
    ],
    mythBuster: 'Myth: Cooking fumes smell good so they must be harmless. Reality: Ultrafine cooking aerosols cause direct pulmonary inflammation comparable to diesel exhaust.'
  },
  {
    id: 'door-window-draft-gaskets',
    title: 'Compression Weatherstrip & Towel Gaskets',
    category: 'sealing',
    cost: '$ (Under $25)',
    difficulty: 'Moderate (30m)',
    efficiencyRating: 9.1,
    description: 'Older window frames and front door thresholds account for up to 60% of outdoor smog infiltration during winter temperature inversions.',
    stepByStep: [
      'Perform the candle/flame test on cold windy nights to identify air leaks along window jambs.',
      'Apply self-adhesive V-strip or rubber foam weatherstripping along door perimeters.',
      'Roll a damp towel or weighted draft snake along the bottom gap of front doors facing the street corridor.',
      'Tape plastic shrink wrap or masking film over loose decorative glass panes for the winter season.'
    ]
  }
];

export const IaqHacksSection: React.FC = () => {
  const [selectedHack, setSelectedHack] = useState<IaqHackItem>(IAQ_HACKS[0]);

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-950 text-teal-400 border border-teal-800/80">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-slate-100">
              Indoor Air Quality (IAQ) Lab & Hacks
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Affordable, peer-reviewed hacks to cut indoor PM2.5 by 80-95% without buying expensive appliances.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hack selector list */}
        <div className="lg:col-span-5 space-y-2.5">
          {IAQ_HACKS.map((hack) => {
            const isSelected = selectedHack.id === hack.id;
            return (
              <button
                key={hack.id}
                onClick={() => setSelectedHack(hack)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-850 border-emerald-500 bg-emerald-950/20 text-slate-100 shadow-md ring-1 ring-emerald-500/50'
                    : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-teal-300 border border-slate-800">
                      {hack.category.toUpperCase()}
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold">
                      {hack.efficiencyRating}/10 Efficiency
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200 mt-1.5">
                    {hack.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>{hack.cost}</span>
                    <span>•</span>
                    <span>{hack.difficulty}</span>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isSelected ? 'rotate-90 text-emerald-400' : ''}`} />
              </button>
            );
          })}
        </div>

        {/* Detailed view of active hack */}
        <div className="lg:col-span-7 bg-slate-950/90 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800/80">
              <div>
                <span className="text-xs uppercase font-semibold text-emerald-400 tracking-wider">
                  Verified Blueprint
                </span>
                <h4 className="text-lg font-bold text-slate-100 mt-0.5">
                  {selectedHack.title}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-400">
                  {selectedHack.efficiencyRating}
                </span>
                <span className="text-xs text-slate-400 block font-medium">Particle Score</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed my-4">
              {selectedHack.description}
            </p>

            {/* Step-by-step instructions */}
            <div className="space-y-2 mb-4">
              <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider block">
                Execution Steps:
              </span>
              {selectedHack.stepByStep.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-normal">
                  <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* Myth buster callout */}
            {selectedHack.mythBuster && (
              <div className="bg-amber-950/20 border border-amber-900/50 rounded-xl p-3 text-xs text-amber-200/90 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">{selectedHack.mythBuster}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
