# AI Tools & Capabilities Used in AuraGuard

AuraGuard is built using Google's **Gemini Generative AI Platform** via the official `@google/genai` SDK on Vertex AI. Below is the complete breakdown of every AI tool, model, mechanism, and capability implemented in this application:

---

### 1. Foundation Model
* **Model ID**: `gemini-2.5-flash`
* **Role**: Primary intelligence engine used for real-time retrieval, structured synthesis, micro-climate reasoning, and conversational health advisory.
* **Why this model**: Provides high-speed inference, reasoning capabilities for physical fluid dynamics and atmospheric meteorology, and support for search grounding and strict JSON schemas.

---

### 2. Google GenAI SDK (`@google/genai`)
* **Package**: `@google/genai` (v2.27.0 ESM module loaded via Google's Vertex AI agent platform)
* **Configuration**:
  ```ts
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });
  ```
* **Runtime**: Vertex AI integration enabled (`vertexai: true`), authenticating securely through the platform environment.

---

### 3. Google Search Grounding Tool (`tools: [{ googleSearch: {} }]`)
Used to break out of static model knowledge cutoffs and access real-time web atmospheric data:
* **Live City Air Quality Search**: In `fetchLocationAirIntelligence()`, searches live real-time AQI, PM2.5 concentrations, temperature, humidity, and winter inversion traps.
* **GPS Coordinate Resolution**: In `fetchAirIntelligenceByCoordinates()`, takes exact device latitude and longitude (e.g. `28.6139°N, 77.2090°E`) and queries Google Search to discover the exact neighborhood, district, and the nearest continuous government ambient air monitoring station (CPCB, EPA, US Embassy, etc.).
* **Live Source Grounding Attribution**: In `askSmogAdvisor()`, queries live search to find current smog alerts and citations, extracting `groundingMetadata.groundingChunks` (URL links and page titles) to display verifiable citations to users.

---

### 4. Structured JSON Response Schema (`responseSchema` & `Type`)
Used to enforce typed JSON contracts from unstructured atmospheric data:
* **Metrics Extraction**: Translates free-form search results into typed numbers (`aqi: Type.NUMBER`, `pm25: Type.NUMBER`, `category: Type.STRING`, `inversionRisk: Type.STRING`).
* **Micro-Location & Sanctuary Generator** (`fetchMicroLocationsForCity`): Emits a strongly typed array of 6 distinct micro-climatic zones (botanical gardens, filtered HVAC libraries, high-rises, residential cul-de-sacs, street canyons, freight depots) with calculated deltas and ratings.
* **Custom Spot Aerodynamic Evaluator** (`evaluateCustomMicroSpot`): Evaluates user-specified locations (e.g., "18th floor balcony", "greenhouse", "metro station") returning typed delta percentages, physical explanations, and family safety advice.
* **Personalized 24h Diurnal Scheduler** (`generatePersonalizedRoutines`): Generates structured schedule slots mapped to atmospheric boundary layer inversion cycles.
* **Impact Quantification** (`calculateImpactScore`): Returns numerical estimates of inhaled PM2.5 avoided (µg/day) and local CO2 saved (kg).

---

### 5. System Instructions & Persona Conditioning (`systemInstruction`)
* **Role**: Atmospheric scientist, indoor air quality (IAQ) engineer, and preventive environmental health advisor ("AuraGuard AI").
* **Context Injection**: Each prompt dynamically injects the live town context, baseline AQI, nearest monitoring station, household profile (infants, elderly, asthmatics), home architecture, and heating systems.

---

### 6. Multi-Turn Conversational Memory
* **Implementation**: Formats previous conversation history into alternating `{ role: 'user' | 'model', parts: [{ text }] }` objects passed to `ai.models.generateContent`, allowing conversational follow-ups and progressive problem-solving.

---

### Summary Matrix

| AI Tool / Feature | Implementation | Purpose in AuraGuard |
|---|---|---|
| **`gemini-2.5-flash`** | Google Vertex AI | Core reasoning, planning, and evaluation model |
| **`@google/genai`** | SDK Client | Official interface for Vertex AI generative calls |
| **`googleSearch` Tool** | Search Grounding | Live AQI, PM2.5, winter inversion, and GPS station lookups |
| **`groundingChunks`** | Metadata Attribution | Live source links and web citations displayed in the UI |
| **`responseSchema`** | OpenAPI Type Enforcement | Reliable structured JSON parsing for graphs and cards |
| **`systemInstruction`** | Prompt Engineering | Domain expertise in meteorology, IAQ, and health guidelines |
| **Multi-Turn Chat** | Session State | Interactive Smog Doctor answering hyper-local questions |
