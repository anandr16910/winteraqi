import React from 'react';
import { X, Users, Baby, HeartPulse, Dog, Home, Car, Flame, Check } from 'lucide-react';
import { HouseholdProfile } from '../types';

interface HouseholdProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: HouseholdProfile;
  onChangeProfile: (updated: HouseholdProfile) => void;
  onApply: () => void;
}

export const HouseholdProfileModal: React.FC<HouseholdProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onChangeProfile,
  onApply
}) => {
  if (!isOpen) return null;

  const update = (patch: Partial<HouseholdProfile>) => {
    onChangeProfile({ ...profile, ...patch });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              Household & Lifestyle Profile
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Gemini tunes indoor protection and emission-cutting actions directly to your living conditions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 py-5">
          {/* Family members count */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
              Number of Household Residents
            </label>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5, '6+'].map((num, i) => {
                const val = typeof num === 'number' ? num : 6;
                const active = profile.membersCount === val;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => update({ membersCount: val })}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      active
                        ? 'bg-emerald-600 text-slate-950 border-emerald-500 shadow-md shadow-emerald-950'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vulnerabilities checkboxes */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
              Vulnerable Family Members (High Priority Protection)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label 
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  profile.hasInfantsOrToddlers
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={profile.hasInfantsOrToddlers}
                  onChange={(e) => update({ hasInfantsOrToddlers: e.target.checked })}
                  className="mt-0.5 accent-emerald-500"
                />
                <div>
                  <div className="text-sm font-medium flex items-center gap-1.5">
                    <Baby className="w-4 h-4 text-emerald-400" />
                    Infants or Young Children
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Breathing rate 2x higher per kg of body weight; needs floor-level filtration.
                  </p>
                </div>
              </label>

              <label 
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  profile.hasAsthmaOrRespiratory
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={profile.hasAsthmaOrRespiratory}
                  onChange={(e) => update({ hasAsthmaOrRespiratory: e.target.checked })}
                  className="mt-0.5 accent-emerald-500"
                />
                <div>
                  <div className="text-sm font-medium flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4 text-rose-400" />
                    Asthma or Bronchitis
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Triggered by ozone, NO2 & PM2.5. Requires early warnings & strict bedroom seals.
                  </p>
                </div>
              </label>

              <label 
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  profile.hasElderly
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={profile.hasElderly}
                  onChange={(e) => update({ hasElderly: e.target.checked })}
                  className="mt-0.5 accent-emerald-500"
                />
                <div>
                  <div className="text-sm font-medium flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-cyan-400" />
                    Elderly Members (65+)
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Cardiovascular stress from micro-particles entering the bloodstream.
                  </p>
                </div>
              </label>

              <label 
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  profile.hasPets
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={profile.hasPets}
                  onChange={(e) => update({ hasPets: e.target.checked })}
                  className="mt-0.5 accent-emerald-500"
                />
                <div>
                  <div className="text-sm font-medium flex items-center gap-1.5">
                    <Dog className="w-4 h-4 text-amber-400" />
                    Indoor Dogs or Cats
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Needs timed short walks during diurnal troughs to prevent canine tracheitis.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Housing type */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
              Dwelling Architecture
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: 'apartment', label: 'Apartment / Condo', desc: 'Higher floor stacks have lower ground soot' },
                { key: 'independent_house', label: 'Detached House', desc: 'Direct street exposure; more boundary perimeter' },
                { key: 'old_construction', label: 'Older / Drafty Home', desc: 'High air infiltration rate (>1.5 ACH)' }
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => update({ homeType: item.key as any })}
                  className={`p-3 text-left rounded-2xl border transition-all ${
                    profile.homeType === item.key
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-sm font-semibold flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-emerald-400" />
                    {item.label}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Commute */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
              Primary Commute Routine
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { key: 'public_transit', label: 'Metro / Bus' },
                { key: 'motorcycle', label: '2-Wheeler / Bike' },
                { key: 'personal_car', label: 'Personal Car' },
                { key: 'remote', label: 'Work from Home' }
              ].map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => update({ commuteMode: c.key as any })}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                    profile.commuteMode === c.key
                      ? 'bg-emerald-600 text-slate-950 font-bold border-emerald-500'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onApply();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            Save Profile & Regenerate Plan
          </button>
        </div>
      </div>
    </div>
  );
};
