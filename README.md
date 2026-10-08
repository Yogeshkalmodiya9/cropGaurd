# 🌱 CropGuard AI

> **"Detect • Explain • Track • Act"**  
> AI-powered Crop Disease Identification, Visual Attention Maps, Treatment Guidance & Longitudinal Health Tracking.

---

## 🌟 Overview & Key Features

CropGuard AI is an agricultural intelligence web application designed to help farmers identify crop diseases early, understand diagnosis through visual explainability, and take immediate, sustainable action.

### 🔬 Core Workflow & Modules

1. **🏠 Executive Dashboard**
   - Live agro-sensor weather strip (Temperature, Humidity, Soil Moisture, Foliar Vitality).
   - High-level KPI cards: Total Scans, Healthy Crops, Active Diseases, High Severity Alerts.
   - Interactive SVG Disease Distribution donut chart with slice inspection.
   - Recent Scans feed with one-click pathology detail routing.
   - Quick action shortcuts.

2. **📷 New Scan & AI Neural Vision**
   - High-resolution drag-and-drop foliar image uploader (JPG, JPEG, PNG).
   - 1-click sample leaf cards (🍅 Tomato Early Blight, 🥔 Potato Late Blight, 🌶️ Chilli Healthy Foliage).
   - Multi-phase scanning laser animation simulating deep neural feature extraction.
   - Disease classification, confidence percentage, and foliar severity scoring.

3. **🗺️ Explainable AI Attention Map (Grad-CAM)**
   - Dynamic HTML5 Canvas rendering of Grad-CAM attention heatmaps over the leaf surface.
   - Gaussian radial heat dispersion highlighting lesions contributing to model predictions.
   - Interactive intensity slider, toggleable lesion bounding markers, and transparent overlay modes.
   - Explicit scientific disclosure avoiding over-claim of surgical disease boundaries.

4. **🌡️ Disease Severity Meter**
   - 3-stage calibrated visual severity gauge: **LOW (0–15%) ──── MEDIUM (15–30%) ──── HIGH (30%+)**.
   - Specific risk level assessment and containment advisories.

5. **🌿 Treatment & Care Plan**
   - **🚨 Immediate Action**: First 24–48 hours foliar hygiene and spore containment checklist.
   - **🌿 Organic / Low-Risk Options**: Diluted cold-pressed neem sprays, biological antagonists (*Bacillus subtilis*), canopy airflow pruning.
   - **🧪 Chemical Treatment (Category)**: General fungicide/bactericide classes (e.g., protectant mancozeb/chlorothalonil category) without dangerous self-prescribed dosages; explicit product label compliance.
   - **💡 Prevention Tips**: Certified seeds, drip irrigation, crop rotation.
   - **👨‍🌾 When to Seek Expert Help**: Emergency thresholds, hotline integration, and nearby verified agricultural extension officer directory.

6. **💬 Ask My Crop (Conversational AI Assistant)**
   - Context-aware chatbot with persistent scan context (current crop, disease, severity, symptoms).
   - Clickable prompt chips (*What happened?*, *Is it serious?*, *Organic solution?*, *How to prevent it?*, *Is it getting worse?*).
   - Real Gemini 3.8 Flash server integration via `@google/genai` with fallback agronomic engine.

7. **📊 Crop Health History**
   - Searchable, filterable disease scouting logbook (filter by Crop, Severity, Date Range).
   - Tabular layout with image thumbnails, disease names, confidence ratings, and pagination.

8. **📈 Disease Progression Over Time**
   - Interactive SVG progression curve plotting foliar damage (%) over repeated temporal scouting visits.
   - Progression detection alerts (*e.g., 5% → 41% expansion over 10 days*).
   - Side-by-side Dual Scan Visual Comparison tool (Earlier Scan vs. Latest Scan).

9. **🗺️ Geospatial Field Monitor**
   - Stylized 4x4 parcel grid simulating a 45-acre farm.
   - Color-coded risk status (🟢 Healthy, 🟡 Monitor, 🟠 At Risk, 🔴 Critical).
   - Parcel Inspector displaying soil moisture, canopy temperature, and parcel-specific rescan triggers.

10. **🏆 Judges' Competition Mode**
    - Built-in 14-step guided presentation stepper tailored for national AI and hackathon demonstrations.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide React.
- **Explainability**: HTML5 Canvas Grad-CAM heatmap synthesizer with radial falloff.
- **Backend**: Express server (`server.ts`) with Vite dev middleware.
- **AI Inference**: `@google/genai` TypeScript SDK (`gemini-3.8-flash`) with fallback botanical rule engine.

---

## 🚀 Setup & Execution

### Prerequisites
- Node.js 18+
- npm or pnpm

### Development
```bash
# Install dependencies
npm install

# Start the full-stack server
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### Production Build
```bash
# Build the client bundle
npm run build

# Start production server
npm start
```
