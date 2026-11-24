export enum AqiCategory {
  GOOD = 'Good',
  MODERATE = 'Moderate',
  UNHEALTHY_SENSITIVE = 'Unhealthy for Sensitive Groups',
  UNHEALTHY = 'Unhealthy',
  VERY_UNHEALTHY = 'Very Unhealthy',
  HAZARDOUS = 'Hazardous',
  SEVERE = 'Severe Emergency'
}

export type MicroLocationCategory = 
  | 'garden_park' 
  | 'filtered_building' 
  | 'high_rise_elevation' 
  | 'residential_pocket' 
  | 'street_canyon' 
  | 'transit_hub';

export interface MicroLocationAQI {
  id: string;
  name: string;
  category: MicroLocationCategory;
  categoryLabel: string;
  estimatedAqi: number;
  estimatedPm25: number;
  deltaPercent: number; // e.g. -38% (cleaner) or +25% (dirtier)
  isSanctuary: boolean;
  cleanAirRating: 'Excellent Sanctuary' | 'Moderate Refuge' | 'Average Ambient' | 'High Exposure Risk' | 'Severe Smog Trap';
  microClimateReason: string;
  recommendedBestTime: string;
}

export interface CustomSpotEvaluation {
  spotName: string;
  estimatedAqi: number;
  estimatedPm25: number;
  deltaVsCityPercent: number;
  verdict: 'Clean Air Sanctuary' | 'Moderate Buffer' | 'Elevated Smog Trap';
  atmosphericExplanation: string;
  actionAdvice: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
}

export interface CityAirData {
  city: string;
  district?: string;
  country: string;
  coordinates?: Coordinates;
  locationSource?: 'gps' | 'search' | 'preset';
  monitoringStation?: string;
  aqi: number;
  category: AqiCategory;
  pm25: number;
  pm10: number;
  temperatureC: number;
  humidity: number;
  inversionRisk: 'Low' | 'Moderate' | 'Severe' | 'Critical Inversion';
  dominantSources: string[];
  summary: string;
  sources?: GroundingSource[];
  lastUpdated: string;
}

export interface HouseholdProfile {
  membersCount: number;
  hasInfantsOrToddlers: boolean;
  hasElderly: boolean;
  hasAsthmaOrRespiratory: boolean;
  hasPets: boolean;
  homeType: 'apartment' | 'independent_house' | 'old_construction';
  commuteMode: 'public_transit' | 'motorcycle' | 'personal_car' | 'walk_cycle' | 'remote';
  heatingType: 'electric_heatpump' | 'gas_boiler' | 'radiators' | 'biomass_wood_fire';
}

export interface DailyScheduleSlot {
  timeSlot: string;
  ambientSmogLevel: 'Lowest' | 'Moderate' | 'Severe Peak';
  recommendedActivity: string;
  ventilationStatus: 'Keep Sealed' | 'Filtered Venting Safe' | 'Absolute Lockdown';
  lowEmissionTip: string;
  reasoning: string;
}

export interface IaqHackItem {
  id: string;
  title: string;
  category: 'filtration' | 'sealing' | 'cleaning' | 'cooking';
  cost: 'Free' | '$ (Under $25)' | '$$ ($25-$60)';
  difficulty: 'Quick (5m)' | 'Moderate (30m)' | 'Weekend Project';
  efficiencyRating: number; // 1-10
  description: string;
  stepByStep: string[];
  mythBuster?: string;
}

export interface ImpactEstimation {
  dailyInhaledPm25AvoidedUg: number;
  dailyCo2AvoidedKg: number;
  healthRiskReductionPercent: number;
  communityCleanAirMultiplier: number; // e.g. 1.8x
  actionSummary: string;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  groundingSources?: GroundingSource[];
}

export type RoomType = 'bedroom' | 'nursery' | 'living' | 'office' | 'kitchen';

export interface RoomPreset {
  id: RoomType;
  name: string;
  defaultLengthFt: number;
  defaultWidthFt: number;
  defaultCeilingFt: number;
  targetAch: number; // Air changes per hour recommended
  priorityNote: string;
}

export type PurifierCategory = 'diy_box_fan' | 'commercial_hepa' | 'custom';

export interface PurifierOption {
  id: string;
  name: string;
  category: PurifierCategory;
  cadrCfm: number; // Clean Air Delivery Rate in Cubic Feet per Minute
  noiseDba: string;
  costEstimate: string;
  powerWatts: number;
  description: string;
}

export interface ScrubbingDataPoint {
  minute: number;
  pm25: number;
  safeLimit: number;
}

export interface CadrCalculationResult {
  roomVolumeCuFt: number;
  roomVolumeCuM: number;
  achDelivered: number;
  achTarget: number;
  isAdequate: boolean;
  cleanAirDeficitCfm: number;
  minutesToSafeLevel: number; // Time to drop PM2.5 below WHO threshold (15 ug/m3)
  minutesTo90PercentClearance: number;
  decayTimeline: ScrubbingDataPoint[];
  verdict: 'Optimal Clean Sanctuary' | 'Adequate Defense' | 'Underpowered for Smog';
  actionableRecommendation: string;
}
