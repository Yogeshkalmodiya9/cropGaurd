import React from 'react';
import {
  HeartPulse,
  Sprout,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Activity,
  Droplets,
  Thermometer,
  ShieldCheck,
  Camera
} from 'lucide-react';
import { FARM_PLOTS, formatPastDate } from '../data/mockData';

interface CropHealthViewProps {
  onStartNewScan: () => void;
  onNavigateTab: (tab: any) => void;
}

export const CropHealthView: React.FC<CropHealthViewProps> = ({
  onStartNewScan,
  onNavigateTab,
}) => {
  const cropList = [
    {
      name: 'Soybean',
      icon: '🌱',
      health: 82,
      status: 'Monitoring',
      variety: 'JS 335 Certified',
      acreage: '16 Acres',
      statusColor: 'text-amber-700 bg-amber-50 border-amber-200',
      barColor: 'bg-amber-500',
      disease: 'Frogeye Leaf Spot (18%)',
      lastScan: formatPastDate(0), // Today (<= 8 Oct 2026)
    },
    {
      name: 'Tomato',
      icon: '🍅',
      health: 78,
      status: 'Monitoring',
      variety: 'Roma VF Hybrid',
      acreage: '12 Acres',
      statusColor: 'text-amber-700 bg-amber-50 border-amber-200',
      barColor: 'bg-amber-500',
      disease: 'Early Blight (16%)',
      lastScan: formatPastDate(2), // 2 days ago
    },
    {
      name: 'Potato',
      icon: '🥔',
      health: 61,
      status: 'At Risk',
      variety: 'Kufri Jyoti Seedling',
      acreage: '15 Acres',
      statusColor: 'text-red-700 bg-red-50 border-red-200',
      barColor: 'bg-red-500',
      disease: 'Late Blight (38%)',
      lastScan: formatPastDate(7), // 7 days ago
    },
    {
      name: 'Chilli',
      icon: '🌶️',
      health: 95,
      status: 'Healthy',
      variety: 'Guntur Sannam',
      acreage: '8 Acres',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      barColor: 'bg-emerald-500',
      disease: 'Nominal Foliage (0%)',
      lastScan: formatPastDate(4), // 4 days ago
    },
  ];

  return (
    <div className="space-y-6 pb-14 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Crop Health Overview</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Holistic farm foliar score, stress indicators, and crop risk distribution.
          </p>
        </div>

        <button
          onClick={onStartNewScan}
          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center gap-2 self-start sm:self-center"
        >
          <Camera className="w-4 h-4" />
          <span>New Scouting Scan</span>
        </button>
      </div>

      {/* Top 4 Health Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Health Card */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-500">Overall Crop Health</span>
            <div className="text-3xl font-bold font-mono text-emerald-800 mt-1">78%</div>
            <p className="text-[11px] text-neutral-400 mt-0.5">Average vegetative index</p>
          </div>
          <div className="w-14 h-14 rounded-full border-4 border-emerald-500 border-t-emerald-200 flex items-center justify-center font-bold text-emerald-800 text-sm font-mono">
            78%
          </div>
        </div>

        {/* Healthy Plants */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500">Healthy Plants</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="text-3xl font-bold font-mono text-neutral-900">72%</div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">Optimal chlorophyll density</p>
        </div>

        {/* At Risk */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500">At Risk</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <div className="text-3xl font-bold font-mono text-neutral-900">18%</div>
          <p className="text-[11px] text-amber-700 font-medium mt-1">Early Blight scouting in progress</p>
        </div>

        {/* Critical */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500">Critical</span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          </div>
          <div className="text-3xl font-bold font-mono text-neutral-900 text-red-600">10%</div>
          <p className="text-[11px] text-red-700 font-medium mt-1">Late Blight quarantine zone</p>
        </div>
      </div>

      {/* Main Crop Health Progressions List */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Field Crop Status</h3>
            <p className="text-xs text-neutral-400">Scouted parcel health across farm acreage</p>
          </div>
          <span className="text-xs font-mono text-neutral-500">4 Active Crops</span>
        </div>

        <div className="space-y-4">
          {cropList.map((crop) => (
            <div
              key={crop.name}
              className="p-4 rounded-xl border border-neutral-200/80 hover:border-emerald-300 hover:bg-neutral-50/60 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-1 bg-neutral-100 rounded-lg">{crop.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-neutral-900">{crop.name}</h4>
                      <span className="text-xs text-neutral-400">· {crop.variety}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      {crop.acreage} · Last Scouted: {crop.lastScan}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-neutral-900">
                      Health: {crop.health}%
                    </span>
                    <div className="text-[11px] text-neutral-400">{crop.disease}</div>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${crop.statusColor}`}
                  >
                    {crop.status}
                  </span>
                </div>
              </div>

              {/* Health Progress Bar */}
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${crop.barColor} rounded-full transition-all duration-700`}
                  style={{ width: `${crop.health}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sensor telemetry banner */}
      <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            <span>Smart Microclimate Integration</span>
          </div>
          <h3 className="text-lg font-bold">Field Sensors Synchronized</h3>
          <p className="text-xs text-emerald-100/80 max-w-xl leading-relaxed">
            CropGuard combines foliar imagery with relative canopy humidity (62%) and leaf surface wetness to model spore germination windows in real time.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('field')}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs shadow-sm flex items-center gap-2 shrink-0 self-start md:self-center"
        >
          <span>Open Field Monitor</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
