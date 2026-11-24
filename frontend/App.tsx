import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { LocationSelector } from './components/LocationSelector';
import { AqiStatusCard } from './components/AqiStatusCard';
import { HouseholdProfileModal } from './components/HouseholdProfileModal';
import { DailyRoutinePlan } from './components/DailyRoutinePlan';
import { IaqHacksSection } from './components/IaqHacksSection';
import { ImpactSimulator } from './components/ImpactSimulator';
import { SmogAssistantChat } from './components/SmogAssistantChat';
import { MicroLocationNavigator } from './components/MicroLocationNavigator';
import { CadrSizingCalculator } from './components/CadrSizingCalculator';
import { 
  CityAirData, 
  HouseholdProfile, 
  DailyScheduleSlot, 
  ImpactEstimation, 
  MicroLocationAQI,
  Coordinates
} from './types';
import { 
  fetchLocationAirIntelligence, 
  fetchAirIntelligenceByCoordinates,
  generatePersonalizedRoutines, 
  calculateImpactScore,
  fetchMicroLocationsForCity,
  getFallbackCityAir
} from './services/geminiService';
import { Users, Crosshair } from 'lucide-react';

export const App: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('New Delhi');
  const [currentCoords, setCurrentCoords] = useState<Coordinates | undefined>(undefined);
  const [airData, setAirData] = useState<CityAirData>(() => getFallbackCityAir('New Delhi'));
  const [isLoadingAir, setIsLoadingAir] = useState<boolean>(true);

  // Household Profile state
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [profile, setProfile] = useState<HouseholdProfile>({
    membersCount: 4,
    hasInfantsOrToddlers: true,
    hasElderly: true,
    hasAsthmaOrRespiratory: true,
    hasPets: false,
    homeType: 'apartment',
    commuteMode: 'public_transit',
    heatingType: 'electric_heatpump'
  });

  // Generated Plan, Impact & Micro-Location State
  const [dailyRoutines, setDailyRoutines] = useState<DailyScheduleSlot[]>([]);
  const [isLoadingRoutines, setIsLoadingRoutines] = useState<boolean>(true);
  const [microLocations, setMicroLocations] = useState<MicroLocationAQI[]>([]);
  const [isLoadingMicro, setIsLoadingMicro] = useState<boolean>(true);
  const [impactData, setImpactData] = useState<ImpactEstimation>({
    dailyInhaledPm25AvoidedUg: 520,
    dailyCo2AvoidedKg: 6.4,
    healthRiskReductionPercent: 76,
    communityCleanAirMultiplier: 2.5,
    actionSummary: 'Following clean-air window routines, visiting sanctuary parks, and damp mopping prevents roughly 520 µg of toxic particulate penetration per person every 24 hours.'
  });

  // Active Tab state for navigation
  const [activeTab, setActiveTab] = useState<'microlocations' | 'cadr' | 'schedule' | 'iaq' | 'impact' | 'assistant'>('cadr');

  // Load air intelligence by city name
  const loadCityData = useCallback(async (cityName: string) => {
    setIsLoadingAir(true);
    setIsLoadingRoutines(true);
    setIsLoadingMicro(true);
    try {
      const data = await fetchLocationAirIntelligence(cityName);
      setAirData(data);

      const [routines, impact, micro] = await Promise.all([
        generatePersonalizedRoutines(data, profile),
        calculateImpactScore(data, profile),
        fetchMicroLocationsForCity(cityName, data)
      ]);
      setDailyRoutines(routines);
      setImpactData(impact);
      setMicroLocations(micro);
    } catch (err) {
      console.error('Failed to load air data', err);
      const fallback = getFallbackCityAir(cityName);
      setAirData(fallback);
    } finally {
      setIsLoadingAir(false);
      setIsLoadingRoutines(false);
      setIsLoadingMicro(false);
    }
  }, [profile]);

  // Load air intelligence by exact GPS Coordinates
  const loadCoordinateData = useCallback(async (coords: Coordinates) => {
    setIsLoadingAir(true);
    setIsLoadingRoutines(true);
    setIsLoadingMicro(true);
    setCurrentCoords(coords);
    try {
      const data = await fetchAirIntelligenceByCoordinates(coords);
      setAirData(data);
      setSelectedCity(data.city);

      const [routines, impact, micro] = await Promise.all([
        generatePersonalizedRoutines(data, profile),
        calculateImpactScore(data, profile),
        fetchMicroLocationsForCity(data.city, data)
      ]);
      setDailyRoutines(routines);
      setImpactData(impact);
      setMicroLocations(micro);
    } catch (err) {
      console.error('Failed to load air data by GPS coordinates', err);
    } finally {
      setIsLoadingAir(false);
      setIsLoadingRoutines(false);
      setIsLoadingMicro(false);
    }
  }, [profile]);

  // Initial load
  useEffect(() => {
    loadCityData(selectedCity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectCity = (newCity: string) => {
    setCurrentCoords(undefined);
    setSelectedCity(newCity);
    loadCityData(newCity);
  };

  const handleSelectCoordinates = (coords: Coordinates) => {
    loadCoordinateData(coords);
  };

  const handleProfileApplied = () => {
    setIsLoadingRoutines(true);
    Promise.all([
      generatePersonalizedRoutines(airData, profile),
      calculateImpactScore(airData, profile)
    ])
      .then(([routines, impact]) => {
        setDailyRoutines(routines);
        setImpactData(impact);
      })
      .finally(() => setIsLoadingRoutines(false));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navbar */}
      <Navbar
        cityName={airData.district ? `${airData.district}, ${airData.city}` : airData.city}
        aqiValue={airData.aqi}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Location Selector & GPS Radar */}
        <LocationSelector
          currentCity={selectedCity}
          onSelectCity={handleSelectCity}
          onSelectCoordinates={handleSelectCoordinates}
          currentCoords={currentCoords}
          isLoading={isLoadingAir}
          locationSource={airData.locationSource}
        />

        {/* Hero AQI & Smog Meter Card */}
        <AqiStatusCard
          airData={airData}
          isLoading={isLoadingAir}
          onRefresh={() => currentCoords ? loadCoordinateData(currentCoords) : loadCityData(selectedCity)}
        />

        {/* Household Profile Bar / Notification */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-200">
                Active Household Profile:
              </span>
              <span className="text-slate-400 ml-1.5">
                {profile.membersCount} residents • {profile.homeType.replace('_', ' ')} • {profile.commuteMode.replace('_', ' ')}
                {profile.hasInfantsOrToddlers ? ' • Infants' : ''}
                {profile.hasAsthmaOrRespiratory ? ' • Asthma Sensitive' : ''}
                {profile.hasElderly ? ' • Elderly' : ''}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsProfileOpen(true)}
            className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4 whitespace-nowrap self-start sm:self-auto"
          >
            Adjust Family Lifestyle
          </button>
        </div>

        {/* Tab Navigation for Deep Exploration */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: 'cadr', label: '💨 CADR & Room Air Sizer' },
            { id: 'microlocations', label: '🌿 Micro-AQI & Sanctuaries' },
            { id: 'schedule', label: '24h Smog Routine' },
            { id: 'iaq', label: 'Indoor Air Quality Hacks' },
            { id: 'impact', label: 'Impact & Exposure Calculator' },
            { id: 'assistant', label: 'AI Smog Doctor & Chat' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-slate-950 shadow-md shadow-emerald-950'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Views */}
        {activeTab === 'cadr' && (
          <CadrSizingCalculator currentCityAir={airData} />
        )}

        {activeTab === 'microlocations' && (
          <MicroLocationNavigator
            locations={microLocations}
            cityAir={airData}
            isLoading={isLoadingMicro}
          />
        )}

        {activeTab === 'schedule' && (
          <DailyRoutinePlan slots={dailyRoutines} isLoading={isLoadingRoutines} />
        )}

        {activeTab === 'iaq' && (
          <IaqHacksSection />
        )}

        {activeTab === 'impact' && (
          <ImpactSimulator impact={impactData} airData={airData} />
        )}

        {activeTab === 'assistant' && (
          <SmogAssistantChat airData={airData} profile={profile} />
        )}
      </main>

      {/* Household Profile Configuration Modal */}
      <HouseholdProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onChangeProfile={setProfile}
        onApply={handleProfileApplied}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">AuraGuard</span>
            <span>•</span>
            <span>Accurate GPS Micro-Climate, Room CADR Sizer & Urban Smog Navigator</span>
          </div>
          <p className="text-center sm:text-right text-[11px] text-slate-400">
            Powered by Gemini with Search Grounding & Geolocation • Educational & Preventive Protection.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
