// frontend/__tests__/AqiStatusCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { AqiStatusCard } from '../components/AqiStatusCard';

describe('AqiStatusCard Component Unit Tests', () => {
  const mockOnRefresh = vi.fn();

  // Helper to construct test data safely bypassing strict type checks
  const createMockAirData = (overrides = {}) => ({
    city: 'Los Angeles',
    country: 'United States',
    lastUpdated: '10:00 AM',
    aqi: 42,
    pm25: 9.8,
    inversionRisk: 'Low',
    temperatureC: 18,
    humidity: 50,
    summary: 'Air quality is safe and clean.',
    dominantSources: ['Traffic'],
    category: 'Good',
    ...overrides,
  } as any);

  // 1. Test rendering with a valid AQI query response
  it('should render the AQI value, category details, and city name correctly for a valid query', () => {
    const airData = createMockAirData();

    render(
      <AqiStatusCard 
        airData={airData} 
        isLoading={false} 
        onRefresh={mockOnRefresh} 
      />
    );

    // Verify the city name, AQI score, and summary are correctly rendered in the DOM
    expect(screen.getByText('Los Angeles')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText(/Air quality is safe and clean/i)).toBeInTheDocument();
    expect(screen.getByText(/Good Air/i)).toBeInTheDocument();
  });

  // 2. Test rendering unhealthy smog states
  it('should display the correct advice and label for high AQI / Unhealthy levels', () => {
    const airData = createMockAirData({
      city: 'Delhi',
      aqi: 180,
      category: 'Unhealthy',
      summary: 'High density smog cover detected.',
    });

    render(
      <AqiStatusCard 
        airData={airData} 
        isLoading={false} 
        onRefresh={mockOnRefresh} 
      />
    );

    expect(screen.getByText('Delhi')).toBeInTheDocument();
    expect(screen.getByText('180')).toBeInTheDocument();
    expect(screen.getByText(/Unhealthy Smog/i)).toBeInTheDocument();
  });

  // 3. Test loading button states
  it('should render loading state on the refresh button when isLoading is true', () => {
    const airData = createMockAirData();

    render(
      <AqiStatusCard 
        airData={airData} 
        isLoading={true} 
        onRefresh={mockOnRefresh} 
      />
    );

    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    expect(refreshButton).toBeDisabled();
  });
});
