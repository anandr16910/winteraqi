// backend/vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // Ensure we use the Node environment for APIs
    env: {
      GOOGLE_CLOUD_PROJECT: 'aisemicon2026',
      GOOGLE_CLOUD_LOCATION: 'us-central1',
      PROXY_HEADER: 'mock-proxy-header',
    },
  },
});
