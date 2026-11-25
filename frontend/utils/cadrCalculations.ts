import { ScrubbingDataPoint } from '../types';

export interface CadrInput {
  lengthFt: number;
  widthFt: number;
  ceilingFt: number;
  cadrCfmPerUnit: number;
  unitCount: number;
  targetAch: number;
  roomSealing: 'well_sealed' | 'average' | 'drafty';
  initialPm25: number;
}

export interface CadrMetrics {
  roomVolumeCuFt: number;
  roomVolumeCuM: number;
  totalCadrCfm: number;
  achDelivered: number;
  achTarget: number;
  isAdequate: boolean;
  cleanAirDeficitCfm: number;
  equilibriumPm25: number;
  minutesToSafeLevel: number;
  minutesTo90PercentClearance: number;
  decayTimeline: ScrubbingDataPoint[];
  verdict: 'Optimal Clean Sanctuary' | 'Adequate Defense' | 'Underpowered for Smog';
}

/**
 * Calculates room volume in cubic feet and cubic meters.
 */
export function calculateRoomVolume(lengthFt: number, widthFt: number, ceilingFt: number) {
  const volumeCuFt = Math.max(0, lengthFt * widthFt * ceilingFt);
  const volumeCuM = volumeCuFt * 0.0283168;
  return { volumeCuFt, volumeCuM };
}

/**
 * Derives delivered Air Changes per Hour (ACH) from total CADR and room volume.
 * Formula: ACH = (CADR_cfm * 60) / Volume_cuft
 */
export function calculateAchDelivered(totalCadrCfm: number, volumeCuFt: number): number {
  if (volumeCuFt <= 0) return 0;
  return parseFloat(((totalCadrCfm * 60) / volumeCuFt).toFixed(1));
}

/**
 * Infiltration rate in ACH based on room weatherstripping/envelope quality.
 */
export function getInfiltrationRate(sealing: 'well_sealed' | 'average' | 'drafty'): number {
  switch (sealing) {
    case 'well_sealed':
      return 0.25;
    case 'average':
      return 0.55;
    case 'drafty':
    default:
      return 1.1;
  }
}

/**
 * Core mathematical engine solving particle decay kinetics in a room:
 * dC/dt = (Infiltration * C_ambient) - (ACH_purifier + Infiltration + NaturalDeposition) * C
 */
export function computeCadrPerformance(input: CadrInput): CadrMetrics {
  const { volumeCuFt, volumeCuM } = calculateRoomVolume(
    input.lengthFt,
    input.widthFt,
    input.ceilingFt
  );

  const totalCadrCfm = input.cadrCfmPerUnit * Math.max(1, input.unitCount);
  const achDelivered = calculateAchDelivered(totalCadrCfm, volumeCuFt);
  const isAdequate = achDelivered >= input.targetAch;

  const targetCadrRequired = (input.targetAch * volumeCuFt) / 60;
  const cleanAirDeficitCfm = Math.max(0, Math.round(targetCadrRequired - totalCadrCfm));

  const infiltrationAch = getInfiltrationRate(input.roomSealing);
  const naturalDepositionAch = 0.15;
  const totalClearanceRateAch = achDelivered + infiltrationAch + naturalDepositionAch;
  const effectiveRemovalRatePerMin = totalClearanceRateAch / 60;

  const safeThresholdPm25 = 15; // WHO 24-hr guideline
  const ambientPm25 = Math.max(0, input.initialPm25);

  // Equilibrium PM2.5 inside room when purifier runs continuously
  const equilibriumPm25 = ambientPm25 * (infiltrationAch / totalClearanceRateAch);

  // Minutes to reach safe baseline (15 ug/m3)
  let minutesToSafe = 0;
  if (equilibriumPm25 <= safeThresholdPm25 && ambientPm25 > safeThresholdPm25) {
    minutesToSafe = Math.round(
      Math.log((ambientPm25 - equilibriumPm25) / (safeThresholdPm25 - equilibriumPm25)) /
        effectiveRemovalRatePerMin
    );
    if (minutesToSafe < 0 || isNaN(minutesToSafe)) minutesToSafe = 15;
  } else if (equilibriumPm25 > safeThresholdPm25) {
    minutesToSafe = Math.round(Math.log(ambientPm25 / safeThresholdPm25) / effectiveRemovalRatePerMin);
  }

  const minutesTo90Percent = Math.max(
    5,
    Math.round(Math.log(10) / effectiveRemovalRatePerMin)
  );

  // Generate 90-minute time-series points
  const decayTimeline: ScrubbingDataPoint[] = [];
  for (let m = 0; m <= 90; m += 5) {
    const currentPm =
      equilibriumPm25 + (ambientPm25 - equilibriumPm25) * Math.exp(-effectiveRemovalRatePerMin * m);
    decayTimeline.push({
      minute: m,
      pm25: Math.round(currentPm),
      safeLimit: safeThresholdPm25,
    });
  }

  let verdict: CadrMetrics['verdict'] = 'Optimal Clean Sanctuary';
  if (achDelivered < input.targetAch * 0.75) {
    verdict = 'Underpowered for Smog';
  } else if (achDelivered < input.targetAch) {
    verdict = 'Adequate Defense';
  }

  return {
    roomVolumeCuFt: Math.round(volumeCuFt),
    roomVolumeCuM: Math.round(volumeCuM),
    totalCadrCfm,
    achDelivered,
    achTarget: input.targetAch,
    isAdequate,
    cleanAirDeficitCfm,
    equilibriumPm25: parseFloat(equilibriumPm25.toFixed(1)),
    minutesToSafeLevel: Math.max(5, minutesToSafe),
    minutesTo90PercentClearance: minutesTo90Percent,
    decayTimeline,
    verdict,
  };
}