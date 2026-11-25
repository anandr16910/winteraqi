import '@testing-library/jest-dom';

// Mock window.matchMedia for responsive UI components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock ResizeObserver for Recharts
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock Geolocation API
const mockGeolocation = {
  getCurrentPosition: (success: (pos: any) => void) => {
    success({
      coords: {
        latitude: 28.6139,
        longitude: 77.2090,
        accuracy: 15,
      },
      timestamp: Date.now(),
    });
  },
  watchPosition: () => 1,
  clearWatch: () => {},
};

Object.defineProperty(navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
});