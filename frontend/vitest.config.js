// frontend/vitest.config.js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'; // If using React

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom', // Use browser emulation
    setupFiles: './src/__tests__/setup.js', // Optional setups
  },
});
