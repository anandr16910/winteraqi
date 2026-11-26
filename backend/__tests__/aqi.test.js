// backend/__tests__/aqi.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';

// 1. Mock 'node-fetch' completely to intercept upstream calls to Google APIs
vi.mock('node-fetch', () => {
  return {
    default: vi.fn((url, options) => {
      // Safely stringify body to search for FailCity
      let bodyStr = '';
      if (options && options.body) {
        if (typeof options.body === 'string') {
          bodyStr = options.body;
        } else {
          bodyStr = JSON.stringify(options.body);
        }
      }

      if (url.includes('FailCity') || bodyStr.includes('FailCity')) {
        return Promise.resolve({
          status: 500,
          json: () => Promise.resolve({ error: 'Downstream API error' }),
        });
      }

      // Simulate a valid response from the Vertex AI model
      return Promise.resolve({
        status: 200,
        json: () => Promise.resolve({
          candidates: [
            {
              content: {
                parts: [{ text: '{\n  "city": "Los Angeles",\n  "aqi": 42,\n  "status": "Good"\n}' }]
              }
            }
          ]
        }),
      });
    }),
  };
});

// Mock the GoogleAuth class so 'new GoogleAuth(...)' works correctly in tests
vi.mock('google-auth-library', () => {
  return {
    GoogleAuth: class {
      constructor() {}
      async getClient() {
        return {
          getAccessToken: async () => ({ token: 'mock-token' }),
        };
      }
    }
  };
});

describe('AQI API Proxy Integration & Unit Tests', () => {
  const PROXY_HEADER_VAL = 'mock-proxy-header';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api-proxy', () => {
    // 1. Test Valid AQI Queries
    it('should successfully proxy a valid query and return response', async () => {
      const response = await request(app)
        .post('/api-proxy')
        .set('x-app-proxy', PROXY_HEADER_VAL) // Custom validation header required by server.js
        .send({
          originalUrl: 'https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-1.5-flash:generateContent',
          headers: { 'content-type': 'application/json' },
          body: {
            contents: [
              {
                parts: [{ text: 'What is the AQI for Los Angeles?' }]
              }
            ]
          }
        })
        .expect(200);

      expect(response.body).toHaveProperty('candidates');
    });

    // 2. Test Invalid Inputs (Missing Custom Auth Headers / Bad Proxy Key)
    it('should return 403 Forbidden if the custom proxy header is missing', async () => {
      await request(app)
        .post('/api-proxy')
        .send({
          originalUrl: 'https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-1.5-flash:generateContent',
          body: {}
        })
        .expect(403);
    });

    it('should return 400 Bad Request if originalUrl is missing', async () => {
      await request(app)
        .post('/api-proxy')
        .set('x-app-proxy', PROXY_HEADER_VAL)
        .send({
          body: {}
        })
        .expect(400);
    });

    // 3. Test API Error Handling (Downstream Server Error simulation)
    it('should handle downstream errors and pass along non-200 statuses', async () => {
      const response = await request(app)
        .post('/api-proxy')
        .set('x-app-proxy', PROXY_HEADER_VAL)
        .send({
          originalUrl: 'https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-1.5-flash:generateContent',
          headers: { 'content-type': 'application/json' },
          body: {
            contents: [
              {
                parts: [{ text: 'FailCity' }]
              }
            ]
          }
        })
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });
});
