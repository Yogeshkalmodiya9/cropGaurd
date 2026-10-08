import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Camera,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  Info,
  ChevronRight,
  RefreshCw,
  Sliders,
  BookmarkCheck,
  Eye,
  Layers,
  ArrowRight,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { ScanResult, AttentionPoint } from '../types';
import { SAMPLE_IMAGES, getCurrentDateStr } from '../data/mockData';
import { HeatmapCanvas } from './HeatmapCanvas';
import { analyze_crop, save_scan } from '../services/api';

interface NewScanViewProps {
  currentScan: ScanResult | null;
  onScanComplete: (result: ScanResult) => void;
  onNavigateTab: (tab: any) => void;
}

export const NewScanView: React.FC<NewScanViewProps> = ({
  currentScan,
  onScanComplete,
  onNavigateTab,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(
    currentScan ? currentScan.imageUrl : SAMPLE_IMAGES.soybean
  );
  const [selectedCropHint, setSelectedCropHint] = useState<string>(
    currentScan ? currentScan.crop : 'Soybean'
  );
  const [fileName, setFileName] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [activeResult, setActiveResult] = useState<ScanResult | null>(currentScan);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Visualization controls
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [showMarkers, setShowMarkers] = useState<boolean>(false);
  const [heatmapIntensity, setHeatmapIntensity] = useState<number>(0.75);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sample items with Soybean prominently supported
  const samples = [
    { name: 'Soybean', icon: '🌱', image: SAMPLE_IMAGES.soybean, hint: 'Soybean Frogeye Leaf Spot' },
    { name: 'Tomato', icon: '🍅', image: SAMPLE_IMAGES.tomato, hint: 'Tomato Early Blight' },
    { name: 'Potato', icon: '🥔', image: SAMPLE_IMAGES.potato, hint: 'Potato Late Blight' },
    { name: 'Chilli', icon: '🌶️', image: SAMPLE_IMAGES.chilli, hint: 'Chilli Healthy' },
  ];

  const handleSelectSample = (sample: typeof samples[0]) => {
    setSelectedImage(sample.image);
    setSelectedCropHint(sample.name);
    setFileName(`${sample.name.toLowerCase()}_sample.jpg`);
  };

  const processUploadedFile = (file: File) => {
    setFileName(file.name);
    const fLower = file.name.toLowerCase();
    
    // Automatically detect crop hint from file name if present
    if (fLower.includes('soybean') || fLower.includes('soy') || fLower.includes('glycine')) {
      setSelectedCropHint('Soybean');
    } else if (fLower.includes('potato') || fLower.includes('aaloo')) {
      setSelectedCropHint('Potato');
    } else if (fLower.includes('chilli') || fLower.includes('chili') || fLower.includes('mirch')) {
      setSelectedCropHint('Chilli');
    } else if (fLower.includes('tomato') || fLower.includes('tamatar')) {
      setSelectedCropHint('Tomato');
    } else if (fLower.includes('cotton') || fLower.includes('kapas')) {
      setSelectedCropHint('Cotton');
    } else if (fLower.includes('maize') || fLower.includes('corn') || fLower.includes('makka')) {
      setSelectedCropHint('Maize');
    } else if (fLower.includes('wheat') || fLower.includes('gehun')) {
      setSelectedCropHint('Wheat');
    } else if (fLower.includes('rice') || fLower.includes('dhaan') || fLower.includes('paddy')) {
      setSelectedCropHint('Rice');
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisStep('Step 1: Crop Identification (Fasal ki pehchan)...');

    const timer1 = setTimeout(() => {
      setAnalysisStep('Step 2: Crop Validation (Morphology & venation verification)...');
    }, 450);

    const timer2 = setTimeout(() => {
      setAnalysisStep('Step 3: Crop-Specific Disease Classification...');
    }, 900);

    const timer3 = setTimeout(() => {
      setAnalysisStep('Step 4: AI Attention heatmap (Grad-CAM) generate ho raha hai...');
    }, 1300);

    try {
      const result = await analyze_crop(selectedImage, selectedCropHint, fileName);
      setTimeout(() => {
        setActiveResult(result);
        onScanComplete(result);
        setIsAnalyzing(false);
        setAnalysisStep('');
      }, 1600);
    } catch (err) {
      setIsAnalyzing(false);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    }
  };

  const handleSaveToHistory = () => {
    if (activeResult && activeResult.isValidCrop !== false) {
      save_scan(activeResult);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2800);
    }
  };

  return (
    <div className="space-y-8 pb-14 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
          Upload Crop Image
        </h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          Apni fasal ki patti ki saaf photo upload karein taaki AI sahi fasal aur rog pehchan sake.
        </p>
      </div>

      {/* Upload Zone & Samples */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Dropzone */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs flex flex-col justify-between">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-emerald-300/80 hover:border-emerald-500 rounded-xl p-8 text-center bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors cursor-pointer group flex flex-col items-center justify-center min-h-[220px]"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-105 transition-transform">
              <UploadCloud className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-neutral-800">
              Drag & drop your crop leaf image here or{' '}
              <span className="text-emerald-700 underline font-bold">Browse Files</span>
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              JPG, JPEG, PNG (Max 10MB) • Supports phone camera photos
            </p>
            <p className="text-[11px] text-emerald-800/80 font-medium mt-2 bg-emerald-50 px-2.5 py-1 rounded-full">
              Supported: Soybean, Tomato, Potato, Chilli, Cotton, Maize, Wheat, Rice
            </p>
          </div>

          {/* Target Crop Selector (Supports Auto-Detect or Explicit Farmer Crop Selection) */}
          <div className="mt-4 pt-3 border-t border-neutral-100 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                <span>🌱 Target Crop:</span>
                <span className="text-[11px] font-normal text-neutral-400">(Auto-Detect or Select Your Crop)</span>
              </label>
              {fileName && (
                <span className="text-[11px] font-mono text-neutral-400 truncate max-w-[200px]">
                  File: {fileName}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'auto', label: '⚡ Auto-Detect by AI', icon: '' },
                { id: 'Soybean', label: 'Soybean', icon: '🌱' },
                { id: 'Tomato', label: 'Tomato', icon: '🍅' },
                { id: 'Potato', label: 'Potato', icon: '🥔' },
                { id: 'Chilli', label: 'Chilli', icon: '🌶️' },
                { id: 'Cotton', label: 'Cotton', icon: '🌾' },
                { id: 'Maize', label: 'Maize', icon: '🌽' },
                { id: 'Wheat', label: 'Wheat', icon: '🌾' },
                { id: 'Rice', label: 'Rice', icon: '🌾' },
              ].map((opt) => {
                const isSelected =
                  (opt.id === 'auto' && (!selectedCropHint || selectedCropHint === 'auto')) ||
                  selectedCropHint?.toLowerCase() === opt.id.toLowerCase();
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedCropHint(opt.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {opt.icon ? `${opt.icon} ` : ''}{opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-neutral-100">
            <div className="flex items-center gap-2 text-xs text-neutral-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>
                Selected Crop Mode:{' '}
                <strong>
                  {selectedCropHint === 'auto' || !selectedCropHint
                    ? '⚡ AI Auto-Detect'
                    : selectedCropHint}
                </strong>
              </span>
            </div>
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#157347] hover:bg-[#12643e] disabled:bg-neutral-300 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Crop...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span>Analyze Crop</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Try a Sample Image Section (Includes Soybean, Tomato, Potato, Chilli) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Try a sample image</span>
              </h3>
              <span className="text-[11px] text-neutral-400">1-click test</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {samples.map((sample) => {
                const isSelected = selectedImage === sample.image;
                return (
                  <button
                    key={sample.name}
                    onClick={() => handleSelectSample(sample)}
                    className={`p-2 rounded-xl border text-center transition-all group ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                        : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="w-full aspect-square rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 mb-1.5">
                      <img
                        src={sample.image}
                        alt={sample.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="text-xs font-semibold text-neutral-800 flex items-center justify-center gap-1">
                      <span>{sample.icon}</span>
                      <span>{sample.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 text-[11px] text-neutral-400">
            Soybean, Tomato, Potato aur Chilli ke sample leaves click karke AI test karein.
          </div>
        </div>
      </div>

      {/* Analyzing Banner State */}
      {isAnalyzing && (
        <div className="bg-white rounded-2xl p-8 border border-emerald-200 shadow-md text-center space-y-4 animate-pulse">
          <div className="relative w-24 h-24 mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-lg">
            <img
              src={selectedImage}
              alt="Scanning leaf"
              className="w-full h-full object-cover"
            />
            {/* Laser scanning line */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-yellow-300 to-emerald-400 shadow-[0_0_12px_#10B981] animate-scanline" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900">
              AI Fasal aur Rog ki pehchan kar raha hai...
            </h3>
            <p className="text-xs text-emerald-700 font-mono mt-1 font-medium">
              {analysisStep}
            </p>
          </div>
          <div className="w-64 max-w-full h-1.5 bg-neutral-100 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full animate-indeterminate" />
          </div>
        </div>
      )}

      {/* CROP VALIDATION ERROR CARD (When uploaded image is unclear or unsupported) */}
      {activeResult && activeResult.isValidCrop === false && !isAnalyzing && (
        <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-4 shadow-sm animate-scaleUp">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-amber-900">
                {activeResult.validationMessage ||
                  (activeResult.validationStatus === 'unsupported'
                    ? 'Ye crop abhi CropGuard AI ke supported crops mein available nahi hai.'
                    : 'Crop clearly identify nahi ho pa rahi hai.')}
              </h3>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                {activeResult.validationStatus === 'unsupported'
                  ? 'Ye crop abhi CropGuard AI ke supported crops mein available nahi hai. Supported crops: Soybean, Tomato, Potato, Chilli, Cotton, Maize, Wheat, Rice.'
                  : 'Please upload a clear photo of a single leaf.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              Upload Clear Photo
            </button>
            <button
              onClick={() => handleSelectSample(samples[0])}
              className="px-4 py-2 bg-white border border-amber-300 text-amber-900 hover:bg-amber-100/60 rounded-xl text-xs font-semibold transition-colors"
            >
              Try Soybean Sample
            </button>
          </div>
        </div>
      )}

      {/* AI Analysis Result Section (Matching Section 8 Structure) */}
      {activeResult && activeResult.isValidCrop !== false && !isAnalyzing && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                <span>AI Analysis Result</span>
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {activeResult.source || 'Vision Edge v2.4'}
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Scan time: {activeResult.timestamp || `${activeResult.date}`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveToHistory}
                className="px-3.5 py-1.5 rounded-lg border border-neutral-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <BookmarkCheck className={`w-3.5 h-3.5 ${savedSuccess ? 'text-emerald-600' : ''}`} />
                <span>{savedSuccess ? 'Saved to History!' : 'Save Scan'}</span>
              </button>

              <button
                onClick={() => onNavigateTab('ask')}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <span>Ask My Crop ({activeResult.crop})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Core Prediction Grid: Image Comparison & Diagnostics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT: Uploaded Leaf Image */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-700">
                <span>Original Uploaded Leaf</span>
                <span className="text-[11px] font-normal text-neutral-400">Input Photo</span>
              </div>
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-inner group">
                <img
                  src={activeResult.imageUrl}
                  alt={activeResult.crop}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 backdrop-blur-xs text-[10px] text-white font-mono">
                  {activeResult.crop} Leaf
                </div>
              </div>
            </div>

            {/* MIDDLE: Diagnostic Card formatted in Simple Farmer Language (Section 8) */}
            <div className="lg:col-span-4 bg-neutral-50/80 rounded-2xl p-5 border border-neutral-200/80 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Fasal aur Rog ki Jankari
              </h3>

              {/* Crop Detected */}
              <div>
                <span className="text-xs text-neutral-500 font-medium">🌱 Fasal:</span>
                <div className="text-lg font-bold text-neutral-900 flex items-center gap-2 mt-0.5">
                  <span className="text-2xl">{activeResult.cropIcon}</span>
                  <span>{activeResult.crop}</span>
                </div>
              </div>

              {/* Condition / Disease */}
              <div>
                <span className="text-xs text-neutral-500 font-medium">🔍 Fasal ki sthiti:</span>
                <div className="flex items-center gap-2 mt-0.5">
                  {activeResult.status === 'Healthy' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  )}
                  <span
                    className={`text-base font-bold ${
                      activeResult.status === 'Healthy' ? 'text-emerald-700' : 'text-neutral-900'
                    }`}
                  >
                    {activeResult.farmerConditionName || activeResult.disease}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  (Technical Classification: {activeResult.disease})
                </div>
              </div>

              {/* Confidence Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-neutral-600 font-medium">📊 AI ka bharosa (Confidence):</span>
                  <span className="font-mono font-bold text-neutral-900">
                    {activeResult.confidence}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                    style={{ width: `${activeResult.confidence}%` }}
                  />
                </div>
              </div>

              {/* Severity & Affected Area */}
              <div className="pt-2 border-t border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-600 font-medium">🟡 Severity:</span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      activeResult.severity === 'High'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : activeResult.severity === 'Medium'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {activeResult.severity}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">
                  {activeResult.severityExplanation ||
                    (activeResult.severity === 'High'
                      ? 'Patte ka bada hissa affected dikh raha hai.'
                      : activeResult.severity === 'Medium'
                      ? 'Patte ka noticeable hissa affected dikh raha hai.'
                      : 'Patte ka chhota hissa affected dikh raha hai.')}
                </div>
                <div className="text-[11px] text-neutral-600 mt-1 font-mono">
                  🍃 Patte ka affected area: <strong>{activeResult.affectedArea}%</strong> (Estimated)
                </div>
              </div>
            </div>

            {/* RIGHT: Explainable AI Highlighted Map (Section 11) */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-700">
                <span>AI Explanation (Highlighted Area)</span>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Grad-CAM
                </span>
              </div>

              <div className="relative aspect-square rounded-2xl overflow-hidden border border-neutral-200 shadow-md">
                <HeatmapCanvas
                  imageUrl={activeResult.imageUrl}
                  attentionPoints={activeResult.attentionPoints}
                  showHeatmap={showHeatmap}
                  showPoints={showMarkers}
                  opacity={heatmapIntensity}
                  className="w-full h-full"
                />

                <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-white text-[11px]">
                  <Layers className="w-3.5 h-3.5 text-yellow-300" />
                  <span>AI Attention Map</span>
                </div>
              </div>

              {/* Heatmap Controls */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-neutral-600 flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-neutral-500" />
                    <span>Heatmap Intensity:</span>
                  </label>
                  <span className="font-mono text-[11px] text-neutral-500">
                    {(heatmapIntensity * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1"
                  step="0.05"
                  value={heatmapIntensity}
                  onChange={(e) => setHeatmapIntensity(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 h-1.5 bg-neutral-200 rounded-lg cursor-pointer"
                />

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setShowMarkers(!showMarkers)}
                    className={`text-[11px] px-2 py-1 rounded font-medium transition-colors ${
                      showMarkers
                        ? 'bg-red-100 text-red-700 border border-red-300'
                        : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {showMarkers ? 'Hide Markers' : 'Show Markers'}
                  </button>

                  <button
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className="text-[11px] px-2 py-1 rounded bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100 font-medium"
                  >
                    {showHeatmap ? 'Turn Off Heatmap' : 'Turn On Heatmap'}
                  </button>
                </div>
              </div>

              {/* Label strictly complying with Section 11 */}
              <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200 text-[11px] text-emerald-900 leading-snug">
                <strong>AI Explanation:</strong> AI ne image ke in highlighted areas ko prediction ke liye important maana hai.
              </div>
            </div>
          </div>

          {/* Simple Hinglish Explanation Sections (Section 8 & 13) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Kya ho raha hai? */}
            <div className="p-4 rounded-xl bg-white border border-neutral-200 space-y-1.5 shadow-2xs">
              <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>Kya ho raha hai?</span>
              </h4>
              <p className="text-xs text-neutral-700 leading-relaxed">
                {activeResult.kyaHoRahaHai ||
                  `AI ke analysis ke according is ${activeResult.crop} ke patte par rog ke lakshan dikh rahe hain jo samay par na sambhale to fail sakte hain.`}
              </p>
            </div>

            {/* Patte mein kya dikh raha hai? */}
            <div className="p-4 rounded-xl bg-white border border-neutral-200 space-y-1.5 shadow-2xs">
              <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>Patte mein kya dikh raha hai?</span>
              </h4>
              <p className="text-xs text-neutral-700 leading-relaxed">
                {activeResult.patteMeinKyaDikhRahaHai || activeResult.symptomExplanation}
              </p>
            </div>

            {/* Abhi kya karein? */}
            <div className="p-4 rounded-xl bg-white border border-neutral-200 space-y-2 shadow-2xs">
              <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Abhi kya karein?</span>
              </h4>
              <ul className="space-y-1 text-xs text-neutral-700">
                {(activeResult.abhiKyaKarein || activeResult.immediateActions).slice(0, 3).map((act, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kaise failne se rokein? */}
            <div className="p-4 rounded-xl bg-white border border-neutral-200 space-y-2 shadow-2xs">
              <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kaise failne se rokein?</span>
              </h4>
              <ul className="space-y-1 text-xs text-neutral-700">
                {(activeResult.kaiseFailneSeRokein || activeResult.preventionTips).slice(0, 3).map((prev, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{prev}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Navigation Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-100">
            <button
              onClick={() => {
                setActiveResult(null);
                setSelectedCropHint('Soybean');
              }}
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Scan Another Leaf</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigateTab('progression')}
                className="px-4 py-2 rounded-xl border border-neutral-200 hover:border-emerald-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Track Progression Curve
              </button>
              <button
                onClick={() => onNavigateTab('treatment')}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
              >
                <span>View Treatment Plan ({activeResult.crop})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
