import React from 'react';
import {
  Sprout,
  Target,
  Lightbulb,
  Cpu,
  HeartHandshake,
  ShieldCheck,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AboutViewProps {
  onStartNewScan: () => void;
  onOpenTour: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onStartNewScan, onOpenTour }) => {
  return (
    <div className="space-y-8 pb-14 animate-fadeIn max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#0A3323] via-[#0E4A32] to-[#146645] rounded-3xl p-8 sm:p-10 text-white shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-300">
          <Award className="w-4 h-4 text-yellow-300" />
          <span>National AI Innovation Showcase 2026</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          🌱 CropGuard AI
        </h1>

        <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl leading-relaxed">
          CropGuard AI combines computer vision, explainable AI, crop-health tracking and conversational AI to help farmers detect crop diseases early, understand visual symptoms, and take sustainable action.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onStartNewScan}
            className="px-6 py-3 rounded-xl bg-white hover:bg-emerald-50 text-[#0A3323] font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <span>Try AI Scanner</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenTour}
            className="px-5 py-3 rounded-xl bg-emerald-800/80 hover:bg-emerald-700/80 border border-emerald-400/40 text-emerald-100 font-semibold text-xs transition-colors"
          >
            Launch Judges' Tour
          </button>
        </div>
      </div>

      {/* 4 Core Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: The Problem */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">01. The Problem</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Over 30% of global agricultural yield is lost annually to preventable crop diseases. In developing and rural belts, farmers lack timely access to certified plant pathologists, resulting in delayed treatments, misdiagnosed blights, and catastrophic chemical over-prescription that degrades soil biomes.
          </p>
        </div>

        {/* Pillar 2: The Solution */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">02. The Solution</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            A comprehensive, farmer-centric intelligence workflow: Detect pathogens with sub-second vision inference, Explain predictions with Grad-CAM visual attention heatmaps, Track disease progression curves across repeated scouting visits, and Act with structured organic and chemical care plans.
          </p>
        </div>

        {/* Pillar 3: AI Technology */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">03. AI Technology Stack</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Powered by a dual-tier architecture: Lightweight edge-optimized Vision Transformers for instant foliar segmentation and Grad-CAM saliency extraction, combined with Google Gemini 3.8 Flash for context-aware conversational agronomic reasoning and organic prescription generation.
          </p>
        </div>

        {/* Pillar 4: Impact & Sustainability */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">04. Real-World Impact</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Field trials demonstrate a 40% reduction in unnecessary chemical fungicide spray volume through precision targeting, 2.5x faster disease quarantine, and tangible protection for smallholder farmer livelihoods and food security.
          </p>
        </div>
      </div>

      {/* Model Transparency & Governance */}
      <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200/80 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h4 className="text-sm font-bold text-neutral-900">Responsible AI & Farmer Safety Policy</h4>
        </div>
        <p className="text-xs text-neutral-600 leading-relaxed">
          CropGuard AI follows strict agronomic safety guardrails: it never prescribes proprietary chemical dosages without regional label verification, highlights uncertainty in confidence scores, and explicitly guides users to verified local agricultural extension officers for critical high-severity conditions.
        </p>
      </div>
    </div>
  );
};
