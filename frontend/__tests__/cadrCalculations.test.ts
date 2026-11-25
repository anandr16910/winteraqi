import { describe, it, expect } from 'vitest';
import {
  calculateRoomVolume,
  calculateAchDelivered,
  getInfiltrationRate,
  computeCadrPerformance
} from '../utils/cadrCalculations';

describe('CADR & Room Air Physics Unit Tests', () => {
  it('correctly calculates room volume for standard imperial dimensions', () => {
    // 14ft length * 13ft width * 9ft ceiling = 1638 cu ft
    const { volumeCuFt, volumeCuM } = calculateRoomVolume(14, 13, 9);
    expect(volumeCuFt).toBe(1638);
    expect(volumeCuM).toBeCloseTo(46.38, 1);
  });

  it('handles zero or negative volume gracefully', () => {
    const { volumeCuFt, volumeCuM } = calculateRoomVolume(0, 10, 9);
    expect(volumeCuFt).toBe(0);
    expect(volumeCuM).toBe(0);
  });

  it('calculates ACH delivered based on CADR and room volume', () => {
    // A 550 CFM Corsi-Rosenthal Box in a 1638 cu ft bedroom
    // ACH = (550 * 60) / 1638 = 20.14 ACH
    const ach = calculateAchDelivered(550, 1638);
    expect(ach).toBe(20.1);
  });

  it('detects an underpowered commercial purifier in a large living room', () => {
    // 140 CFM compact filter in a 20x16x10 (3200 cu ft) living room
    // Delivered ACH = (140 * 60) / 3200 = 2.6 ACH (Target is 4.5 ACH)
    const ach = calculateAchDelivered(140, 3200);
    expect(ach).toBe(2.6);

    const result = computeCadrPerformance({
      lengthFt: 20,
      widthFt: 16,
      ceilingFt: 10,
      cadrCfmPerUnit: 140,
      unitCount: 1,
      targetAch: 4.5,
      roomSealing: 'drafty',
      initialPm25: 250,
    });

    expect(result.isAdequate).toBe(false);
    expect(result.verdict).toBe('Underpowered for Smog');
    expect(result.cleanAirDeficitCfm).toBeGreaterThan(0);
  });

  it('verifies Corsi-Rosenthal Box reaches optimal sanctuary status and cleans smog within safe window', () => {
    const result = computeCadrPerformance({
      lengthFt: 14,
      widthFt: 13,
      ceilingFt: 9,
      cadrCfmPerUnit: 550,
      unitCount: 1,
      targetAch: 5.0,
      roomSealing: 'well_sealed',
      initialPm25: 180,
    });

    expect(result.isAdequate).toBe(true);
    expect(result.verdict).toBe('Optimal Clean Sanctuary');
    expect(result.achDelivered).toBeGreaterThan(15);
    expect(result.cleanAirDeficitCfm).toBe(0);
    expect(result.minutesToSafeLevel).toBeLessThan(25);
    expect(result.equilibriumPm25).toBeLessThan(10);
  });

  it('evaluates infiltration envelope impact on equilibrium PM2.5', () => {
    const sealedInfiltration = getInfiltrationRate('well_sealed');
    const draftyInfiltration = getInfiltrationRate('drafty');

    expect(sealedInfiltration).toBeLessThan(draftyInfiltration);

    const sealedResult = computeCadrPerformance({
      lengthFt: 14,
      widthFt: 13,
      ceilingFt: 9,
      cadrCfmPerUnit: 300,
      unitCount: 1,
      targetAch: 5.0,
      roomSealing: 'well_sealed',
      initialPm25: 200,
    });

    const draftyResult = computeCadrPerformance({
      lengthFt: 14,
      widthFt: 13,
      ceilingFt: 9,
      cadrCfmPerUnit: 300,
      unitCount: 1,
      targetAch: 5.0,
      roomSealing: 'drafty',
      initialPm25: 200,
    });

    expect(sealedResult.equilibriumPm25).toBeLessThan(draftyResult.equilibriumPm25);
  });

  it('generates an exponential decay timeline with 19 distinct checkpoints up to 90 minutes', () => {
    const result = computeCadrPerformance({
      lengthFt: 12,
      widthFt: 11,
      ceilingFt: 9,
      cadrCfmPerUnit: 400,
      unitCount: 1,
      targetAch: 6.0,
      roomSealing: 'average',
      initialPm25: 220,
    });

    expect(result.decayTimeline.length).toBe(19); // 0, 5, 10, ... 90
    expect(result.decayTimeline[0].pm25).toBe(220);
    expect(result.decayTimeline[result.decayTimeline.length - 1].pm25).toBeLessThan(15);
  });
});