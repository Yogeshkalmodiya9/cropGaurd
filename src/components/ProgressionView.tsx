import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { ScanResult } from '../types';
import { PROGRESSION_TIMELINE, SAMPLE_IMAGES, formatPastDate } from '../data/mockData';

interface ProgressionViewProps {
  currentScan: ScanResult;
  onNavigateTab: (tab: any) => void;
}

export const ProgressionView: React.FC<ProgressionViewProps> = ({
  currentScan,
  onNavigateTab,
}) => {
  const [activePointIndex, setActivePointIndex] = useState<number>(3);
  const [showComparisonModal, setShowComparisonModal] = useState<boolean>(false);

  const timeline = PROGRESSION_TIMELINE;

  // Chart dimensions
  const width = 640;
  const height = 260;
  const paddingLeft = 45;
  const paddingRight = 35;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  // Map data to coordinates
  const points = timeline.map((item, idx) => {
    const x = paddingLeft + (idx / (timeline.length - 1)) * chartW;
    const y = paddingTop + chartH - (item.affectedArea / 100) * chartH;
    return { ...item, x, y };
  });

  // Build SVG path
  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  // Build gradient fill area
  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartH} L ${points[0].x} ${paddingTop + chartH} Z`;

  const selectedPoint = points[activePointIndex];

  return (
    <div className="space-y-6 pb-14 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Disease Progression Over Time
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Track how disease severity changes across repeated scouting scans.
          </p>
        </div>

        <button
          onClick={() => setShowComparisonModal(true)}
          className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200 text-xs font-semibold text-neutral-800 shadow-xs flex items-center gap-2 transition-all self-start sm:self-center"
        >
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Compare Two Scans</span>
        </button>
      </div>

      {/* Main Progression Analytics Card (Matching Reference Screen 6) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <h3 className="text-sm font-bold text-neutral-900">Disease Severity Progression</h3>
            <span className="text-xs text-neutral-400 font-mono">(Tomato - Plot A)</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-neutral-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Affected Area (%)</span>
            </span>
          </div>
        </div>

        {/* Progression Line Chart SVG */}
        <div className="relative overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-64 overflow-visible"
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 20, 40, 60, 80, 100].map((val) => {
              const y = paddingTop + chartH - (val / 100) * chartH;
              return (
                <g key={val}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="#E5E7EB"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingLeft - 10}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="#9CA3AF"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Area under curve */}
            <path d={areaD} fill="url(#areaGradient)" />

            {/* Line Path */}
            <path
              d={pathD}
              fill="none"
              stroke="#EF4444"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points */}
            {points.map((pt, idx) => {
              const isSelected = activePointIndex === idx;
              return (
                <g
                  key={pt.date}
                  className="cursor-pointer"
                  onClick={() => setActivePointIndex(idx)}
                >
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 7 : 5}
                    fill="#EF4444"
                    stroke="#FFFFFF"
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all"
                  />
                  {/* Percentage label above point */}
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="bold"
                    fill="#1F2937"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {pt.affectedArea}%
                  </text>

                  {/* X Axis Label */}
                  <text
                    x={pt.x}
                    y={paddingTop + chartH + 20}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    fill={isSelected ? '#111827' : '#6B7280'}
                  >
                    {pt.date}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Date Callout */}
        <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-400" />
            <span>Selected Scan: <strong>{selectedPoint.label}</strong></span>
            <span className="text-neutral-400">·</span>
            <span>Foliar Area: <strong className="text-red-600">{selectedPoint.affectedArea}%</strong></span>
          </div>
          <span className="text-neutral-500 italic">{selectedPoint.note}</span>
        </div>

        {/* Status Notification Cards (Matching Reference Screen 6) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Progression Alert Card */}
          <div className="p-5 rounded-2xl bg-red-50/70 border border-red-200 text-red-950 space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <h4 className="text-sm font-bold text-red-900">Disease progression detected</h4>
            </div>
            <p className="text-xs text-red-800 leading-relaxed">
              The affected area has increased from <strong>5% to 38%</strong> over the last 6 days.
              Recommended: Take immediate sanitation action to prevent further spread.
            </p>
          </div>

          {/* Suggested Action Card */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <h4 className="text-sm font-bold text-emerald-900">Suggested Action</h4>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed mt-1">
                Apply the recommended treatment plan, remove heavily infected lower foliage, and monitor again after 5–7 days.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('health')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 pt-1"
            >
              <span>View Treatment Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Dual Scan Comparison Modal / Drawer */}
      {showComparisonModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  <span>Dual Scan Visual Comparison</span>
                </h3>
                <p className="text-xs text-neutral-500">
                  Direct pathology progression comparison between initial scouting and latest state.
                </p>
              </div>
              <button
                onClick={() => setShowComparisonModal(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Earlier Scan */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-700">Earlier Scan</span>
                  <span className="font-mono text-neutral-500">{formatPastDate(6)}</span>
                </div>
                <div className="aspect-square rounded-xl overflow-hidden bg-neutral-200 border border-neutral-300">
                  <img
                    src={SAMPLE_IMAGES.tomato}
                    alt="Earlier Scan"
                    className="w-full h-full object-cover filter brightness-105"
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Severity:</span>
                    <strong className="text-emerald-700">Low (5%)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Condition:</span>
                    <span className="text-neutral-800">Initial leaf margin spots</span>
                  </div>
                </div>
              </div>

              {/* Latest Scan */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-700">Latest Scan</span>
                  <span className="font-mono text-neutral-500">{formatPastDate(0)}</span>
                </div>
                <div className="aspect-square rounded-xl overflow-hidden bg-neutral-200 border border-red-300 ring-2 ring-red-400/30">
                  <img
                    src={SAMPLE_IMAGES.tomato}
                    alt="Latest Scan"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Severity:</span>
                    <strong className="text-red-700">High (38%)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Condition:</span>
                    <span className="text-neutral-800">Concentric lesions expanded</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Differential Summary */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold">Progression Delta: +36% Foliar Increase over 10 days</div>
              <p>
                The disease transitioned from localized leaf spots to multi-lobe necrosis. Immediate canopy thinning and treatment application are crucial.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowComparisonModal(false)}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowComparisonModal(false);
                  onNavigateTab('health');
                }}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs"
              >
                Open Treatment Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
