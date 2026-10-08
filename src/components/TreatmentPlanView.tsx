import React, { useState } from 'react';
import {
  AlertCircle,
  Leaf,
  FlaskConical,
  Lightbulb,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  Printer,
  Share2,
  CheckCircle2,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { ScanResult } from '../types';

interface TreatmentPlanViewProps {
  currentScan: ScanResult;
  onNavigateTab: (tab: any) => void;
  onOpenExpertModal: () => void;
}

export const TreatmentPlanView: React.FC<TreatmentPlanViewProps> = ({
  currentScan,
  onNavigateTab,
  onOpenExpertModal,
}) => {
  const [completedSteps, setCompletedSteps] = useState<{ [key: string]: boolean }>({});

  const toggleStep = (key: string) => {
    setCompletedSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 pb-14 animate-fadeIn">
      {/* Top Header & Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
            Treatment & Care Plan
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Personalized recommendations based on the detected crop condition.
          </p>
        </div>

        {/* Current Scan Badge */}
        <div className="flex items-center gap-3 bg-white p-2.5 px-4 rounded-xl border border-neutral-200/80 shadow-xs">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
            <img
              src={currentScan.imageUrl}
              alt={currentScan.crop}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
              <span>{currentScan.cropIcon}</span>
              <span>{currentScan.crop}</span>
              <span className="text-neutral-400">·</span>
              <span className="text-red-600">{currentScan.disease}</span>
            </div>
            <div className="text-[11px] text-neutral-500">
              Severity: <strong>{currentScan.severity}</strong> ({currentScan.affectedArea}%)
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('scan')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 ml-2 underline"
          >
            Change
          </button>
        </div>
      </div>

      {/* 4 Core Cards in 2x2 Grid (Matching Reference Screen 5) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: Immediate Action (Red/Coral theme) */}
        <div className="bg-white rounded-2xl p-6 border border-red-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">Immediate Action</h3>
                <p className="text-xs text-neutral-400">First 24–48 hours priority</p>
              </div>
            </div>

            <div className="space-y-3">
              {currentScan.immediateActions.map((action, idx) => {
                const key = `imm-${idx}`;
                const isDone = !!completedSteps[key];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(key)}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      isDone
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                        : 'bg-neutral-50/60 border-neutral-200/80 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <div className="mt-0.5">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] transition-colors ${
                          isDone
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-neutral-400 bg-white'
                        }`}
                      >
                        {isDone && '✓'}
                      </div>
                    </div>
                    <span className={`text-xs leading-relaxed ${isDone ? 'line-through text-neutral-400' : ''}`}>
                      {action}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 text-[11px] text-neutral-400">
            Click any task above to track your farm sanitization checklist.
          </div>
        </div>

        {/* CARD 2: Organic / Low-risk Options (Green theme) */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Organic / Low-risk Options
                </h3>
                <p className="text-xs text-neutral-400">Biological & eco-friendly sprays</p>
              </div>
            </div>

            <div className="space-y-3">
              {currentScan.organicOptions.map((option, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/30 border border-emerald-100 text-neutral-700 text-xs leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>{option}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-100 text-[11px] text-emerald-700 font-medium">
            Certified safe for pollinators and organic market compliance.
          </div>
        </div>

        {/* CARD 3: Chemical Treatment Category (Blue theme) */}
        <div className="bg-white rounded-2xl p-6 border border-sky-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Chemical Treatment (Category)
                </h3>
                <p className="text-xs text-neutral-400">Scientific agrochemical category</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-100 text-xs text-neutral-700 space-y-2">
                <div className="font-semibold text-sky-950">
                  {currentScan.chemicalCategory.category}
                </div>
                <div className="text-neutral-600">
                  Examples: <em>{currentScan.chemicalCategory.examples}</em>
                </div>
                <p className="text-[11px] text-sky-900/80 leading-relaxed font-medium">
                  {currentScan.chemicalCategory.instructions}
                </p>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-600 text-[11px]">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Do NOT self-prescribe dosage. Always observe label pre-harvest intervals.</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 text-[11px] text-neutral-400">
            Category classification based on FRAC (Fungicide Resistance Action Committee).
          </div>
        </div>

        {/* CARD 4: Prevention Tips (Amber theme) */}
        <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">Prevention Tips</h3>
                <p className="text-xs text-neutral-400">Long-term crop health strategies</p>
              </div>
            </div>

            <div className="space-y-3">
              {currentScan.preventionTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/30 border border-amber-100 text-neutral-700 text-xs leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-100 text-[11px] text-amber-800 font-medium">
            Prevents spore recurrence in subsequent planting seasons.
          </div>
        </div>
      </div>

      {/* When to Seek Expert Help (Purple/Blue Banner Card) */}
      <div className="rounded-2xl bg-gradient-to-r from-[#202744] via-[#283259] to-[#344074] text-white p-6 sm:p-7 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-purple-200">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">When to Seek Expert Help</h3>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-purple-100/90">
              {currentScan.expertHelpTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-purple-300 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onOpenExpertModal}
            className="px-5 py-3 rounded-xl bg-white hover:bg-purple-50 text-[#202744] font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0 self-start lg:self-center"
          >
            <span>Find Agricultural Expert</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Safety Legal Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-900 text-xs leading-relaxed flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">Agricultural Safety Disclaimer:</strong>{' '}
          CropGuard AI provides AI-assisted general guidance and does not replace professional
          in-person agricultural diagnostics. Always verify diagnosis and chemical treatment with a
          certified local agricultural extension specialist and follow registered regional product
          labels.
        </div>
      </div>

      {/* Bottom Navigation Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => onNavigateTab('scan')}
          className="text-xs font-semibold text-neutral-500 hover:text-neutral-900"
        >
          ← Back to Scan Result
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('progression')}
            className="px-4 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700"
          >
            Track Progression Curve
          </button>
          <button
            onClick={() => onNavigateTab('ask')}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
          >
            <span>Ask Questions About This Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
