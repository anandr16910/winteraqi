# AuraGuard: Winter Smog & Clean Air Navigator

AuraGuard is an atmospheric intelligence and clean-air navigation Single Page Application (SPA) designed to protect families, infants, and vulnerable groups from severe winter smog, PM2.5 particulates, and thermal boundary-layer inversions.

Powered by Google's **Gemini 2.5 Flash** on **Vertex AI** with real-time **Google Search Grounding** and browser **Geolocation Radar**.

---

## 🚀 Key Capabilities

1. **Exact GPS & Station Radar**: One-click device geolocation resolves nearest official ambient monitoring sensors (CPCB, US Embassy, EPA, etc.).
2. **Room-by-Room CADR & ACH Sizer**: ASHRAE/EPA-aligned calculator sizing DIY Corsi-Rosenthal boxes vs commercial HEPA purifiers, forecasting minutes to WHO safe air (`<15 µg/m³`).
3. **Hyper-Local Micro-AQI & Sanctuaries**: Identifies botanical gardens, urban canopies, and HVAC-filtered public libraries that are 30%–85% cleaner than street canyons.
4. **Custom Spot Aerodynamic Checker**: Evaluates air exchange rates and particle infiltration for any user-inputted building, balcony, or school.
5. **Personalized Family Profiling**: Tailors protective thresholds for infants, asthmatics, the elderly, and pets based on dwelling architecture and heating types.
6. **24-Hour Diurnal Schedule**: Maps activity around solar mixing troughs and nocturnal temperature inversion caps.
7. **IAQ DIY Lab**: Step-by-step verified blueprints for $60 Corsi-Rosenthal boxes, wet-mopping soot traps, and doorway gasket weatherstripping.
8. **Exposure Simulator**: Interactive Recharts visualization quantifying inhaled PM2.5 avoided (µg/day) and local CO2 emissions prevented.
9. **AI Smog Doctor & Chat**: Multi-turn conversational assistant providing cited health and mitigation advice.

---

## 🛠️ Tech Stack & AI Architecture

* **Frontend**: React 19, TypeScript, Tailwind CSS, Recharts, Lucide Icons, Framer Motion
* **AI Engine**: `@google/genai` (v2.27.0) with model `gemini-2.5-flash` on Vertex AI (`vertexai: true`)
* **Real-Time Data**: Google Search Grounding (`tools: [{ googleSearch: {} }]`)
* **Structured Schemas**: Strict OpenAPI JSON schema validation for typed numbers and micro-location models
* **Test Suite**: Vitest, `@testing-library/react`, `jsdom`, GitHub Actions CI

---

## 🧪 Testing & Validation Setup

All mathematical decay kinetics, ACH formulas, and fallback services are decoupled into pure testable modules.

### Prerequisites
* Node.js v18+ or v20+
* npm or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Unit & Regression Tests
```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage reporting
npm run test:coverage
```

### 3. Type Checking
```bash
npm run typecheck
```

### 4. Build for Production
```bash
npm run build
```

---

## 📂 Project Structure

```text
├── __tests__/                   # Vitest unit test suites
│   ├── cadrCalculations.test.ts # Math & decay kinetics tests
│   └── geminiService.test.ts    # Service resilience & fallback tests
├── components/                  # UI React Components
│   ├── AqiStatusCard.tsx        # Real-time AQI hero badge & diagnostics
│   ├── CadrSizingCalculator.tsx # Room CADR & ACH clearance calculator
│   ├── DailyRoutinePlan.tsx     # 24-hr diurnal schedule
│   ├── FeaturesModal.tsx        # Features catalog modal
│   ├── HouseholdProfileModal.tsx# Family sensitivity & home settings
│   ├── IaqHacksSection.tsx      # DIY Corsi-Rosenthal & IAQ blueprints
│   ├── ImpactSimulator.tsx      # Recharts exposure curves & avoided PM2.5
│   ├── LocationSelector.tsx     # GPS Radar & search bar
│   ├── MicroLocationNavigator.tsx # Hyper-local park/building variance
│   ├── Navbar.tsx               # Header with AI Stack & Features modals
│   └── SmogAssistantChat.tsx    # Multi-turn Gemini Smog Doctor
├── services/
│   └── geminiService.ts         # Gemini API calls, Search Grounding & models
├── utils/
│   └── cadrCalculations.ts      # Pure mathematical engine for air scrubbing
├── .github/workflows/
│   └── ci.yml                   # Automated GitHub CI pipeline
├── App.tsx                      # Main application orchestrator
├── types.ts                     # TypeScript interfaces & enums
├── vitest.config.ts             # Vitest test configuration
├── vitest.setup.ts              # Browser API mocks for jsdom
├── index.html                   # HTML entry point with importmap & Tailwind
├── index.tsx                    # React 19 root mount
└── package.json                 # Scripts and dependencies
```

---

## 🔑 Environment Variables

The application expects the Vertex AI Gemini API key to be available via:
```bash
process.env.API_KEY
```
When running in Vertex AI Studio / App Builder, this environment variable is pre-configured and accessible to `@google/genai`.

---

## 📜 License
MIT License. Built for community health and clean air resilience.
