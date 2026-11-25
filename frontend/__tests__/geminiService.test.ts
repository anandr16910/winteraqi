import { describe, it, expect } from 'vitest';
import { getFallbackCityAir, PRESET_CITIES } from '../services/geminiService';
import { AqiCategory } from '../types';

describe('Gemini Service & Air Data Resilience Tests', () => {
  it('includes standard global winter smog preset hotspots', () => {
    expect(PRESET_CITIES.length).toBeGreaterThanOrEqual(8);
    const delhi = PRESET_CITIES.find(c => c.city === 'New Delhi');
    const beijing = PRESET_CITIES.find(c => c.city === 'Beijing');
    expect(delhi).toBeDefined();
    expect(beijing).toBeDefined();
  });

  it('returns valid hazardous fallback data for known high-smog city', () => {
    const data = getFallbackCityAir('Lahore');
    expect(data.city).toBe('Lahore');
    expect(data.aqi).toBeGreaterThan(300);
    expect(data.category).toBe(AqiCategory.HAZARDOUS);
    expect(data.inversionRisk).toBe('Critical Inversion');
    expect(data.dominantSources.length).toBeGreaterThan(0);
    expect(data.pm25).toBeGreaterThan(150);
  });

  it('returns moderate/unhealthy fallback data for standard cities', () => {
    const data = getFallbackCityAir('Denver');
    expect(data.city).toBe('Denver');
    expect(data.category).toBe(AqiCategory.UNHEALTHY);
    expect(data.pm25).toBeLessThan(100);
  });

  it('guarantees formatted timestamps and structured fallback metadata', () => {
    const data = getFallbackCityAir('Milan');
    expect(data.lastUpdated).toBeDefined();
    expect(typeof data.temperatureC).toBe('number');
    expect(typeof data.humidity).toBe('number');
  });
});