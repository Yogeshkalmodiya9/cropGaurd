import React, { useState } from 'react';
import {
  Sprout,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Camera,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  History,
  Activity,
  ArrowUpRight,
  Calendar
} from 'lucide-react';
import { ScanResult } from '../types';
import { SAMPLE_IMAGES, getCurrentDateStr, sanitizeAndSortScans } from '../data/mockData';

interface DashboardViewProps {
  scans: ScanResult[];
  onStartNewScan: () => void;
  onSelectScan: (scan: ScanResult) => void;
  onNavigateTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  scans: rawScans,
  onStartNewScan,
  onSelectScan,
  onNavigateTab,
}) => {
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // Guarantee no future dates and newest first
  const scans = sanitizeAndSortScans(rawScans);

  // Dynamic metrics from actual state (Section 17)
  const totalScans = scans.length;
  const healthyCount = scans.filter((s) => s.status === 'Healthy').length;
  const diseasedCount = scans.filter((s) => s.status === 'Diseased').length;
  const highSeverityCount = scans.filter((s) => s.severity === 'High').length;

  // Dynamic distribution calculation from actual scan list
  const diseaseCounts: { [key: string]: number } = {};
  scans.forEach((s) => {
    const key = s.status === 'Healthy' ? 'Healthy' : s.disease;
    diseaseCounts[key] = (diseaseCounts[key] || 0) + 1;
  });

  const colors = ['#EF4444', '#F59E0B', '#10B981', '#8B5CF6', '#06B6D4', '#EC4899'];
  const distributionData = Object.entries(diseaseCounts).map(([name, count], idx) => ({
    name,
    count,
    color: name === 'Healthy' ? '#10B981' : colors[idx % colors.length],
    percent: totalScans > 0 ? Math.round((count / totalScans) * 100) : 0,
  }));

  // SVG Donut calculation
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
            Hello Farmer! <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Keep your crops healthy with AI-powered insights.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-600 bg-white px-3.5 py-1.5 rounded-xl border border-neutral-200/80 shadow-2xs self-start md:self-center font-mono">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span>Date: <strong>{getCurrentDateStr()}</strong></span>
        </div>
      </div>

      {/* 4 Summary Stat Cards (Section 17 - Live Database Driven) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Scans */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            {totalScans > 0 ? (
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Live records
              </span>
            ) : (
              <span className="text-[11px] text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                No scans
              </span>
            )}
          </div>
          <div className="text-3xl font-bold text-neutral-900 font-mono tracking-tight">
            {totalScans}
          </div>
          <div className="text-xs font-semibold text-neutral-600 mt-1">Total Scans</div>
          <p className="text-[11px] text-neutral-400 mt-0.5">Scouting records logged</p>
        </div>

        {/* Healthy Crops */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {totalScans > 0 ? `${Math.round((healthyCount / totalScans) * 100)}% of field` : '0%'}
            </span>
          </div>
          <div className="text-3xl font-bold font-mono tracking-tight text-emerald-700">
            {healthyCount}
          </div>
          <div className="text-xs font-semibold text-neutral-600 mt-1">Healthy Crops</div>
          <p className="text-[11px] text-neutral-400 mt-0.5">Optimal foliar condition</p>
        </div>

        {/* Diseases Detected */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Active care
            </span>
          </div>
          <div className="text-3xl font-bold font-mono tracking-tight text-amber-600">
            {diseasedCount}
          </div>
          <div className="text-xs font-semibold text-neutral-600 mt-1">Diseases Detected</div>
          <p className="text-[11px] text-neutral-400 mt-0.5">Under treatment guidance</p>
        </div>

        {/* High Severity */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
              Urgent
            </span>
          </div>
          <div className="text-3xl font-bold font-mono tracking-tight text-red-600">
            {highSeverityCount}
          </div>
          <div className="text-xs font-semibold text-neutral-600 mt-1">High Severity Cases</div>
          <p className="text-[11px] text-neutral-400 mt-0.5">Requires immediate quarantine</p>
        </div>
      </div>

      {/* Large Scan CTA Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0C4E33] via-[#106B45] to-[#168557] text-white p-7 shadow-lg shadow-emerald-950/15">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url(${SAMPLE_IMAGES.farmBackdrop})` }}
        />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shrink-0 shadow-inner">
              <Camera className="w-7 h-7 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Scan a Crop Now
              </h2>
              <p className="text-emerald-100/90 text-sm mt-1 max-w-xl">
                Soybean, Tomato, Potato ya Chilli ke patte ki photo upload karein. AI fasal pehchankar sahi upaay batayega.
              </p>
            </div>
          </div>
          <button
            onClick={onStartNewScan}
            className="group px-6 py-3 rounded-xl bg-white hover:bg-emerald-50 text-[#0C4E33] font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0 active:scale-95"
          >
            <span>Analyze My Crop →</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Two-Column Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Disease Distribution Donut Chart */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-neutral-900">Disease Distribution</h3>
              <span className="text-xs text-neutral-400 font-mono">{totalScans} Scans Total</span>
            </div>

            {totalScans === 0 ? (
              <div className="py-12 text-center text-neutral-400 text-xs">
                Abhi tak koi scan record nahi hua hai. Naya scan karne par chart yahan dikhega.
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2 pb-4">
                {/* Donut Chart SVG */}
                <div className="relative flex items-center justify-center">
                  <svg width={size} height={size} className="transform -rotate-90">
                    <circle
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      fill="transparent"
                      stroke="#F3F4F6"
                      strokeWidth={strokeWidth}
                    />

                    {distributionData.map((slice) => {
                      const strokeDasharray = `${(slice.percent / 100) * circumference} ${circumference}`;
                      const strokeDashoffset = -accumulatedOffset;
                      accumulatedOffset += (slice.percent / 100) * circumference;
                      const isHovered = hoveredSlice === slice.name;

                      return (
                        <circle
                          key={slice.name}
                          cx={size / 2}
                          cy={size / 2}
                          r={radius}
                          fill="transparent"
                          stroke={slice.color}
                          strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-300 cursor-pointer"
                          onMouseEnter={() => setHoveredSlice(slice.name)}
                          onMouseLeave={() => setHoveredSlice(null)}
                        />
                      );
                    })}
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <span className="text-2xl font-bold font-mono text-neutral-900">{totalScans}</span>
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                      {hoveredSlice || 'Scans'}
                    </span>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-2.5 w-full sm:w-auto">
                  {distributionData.map((item) => (
                    <div
                      key={item.name}
                      onMouseEnter={() => setHoveredSlice(item.name)}
                      onMouseLeave={() => setHoveredSlice(null)}
                      className={`flex items-center justify-between gap-4 text-xs px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                        hoveredSlice === item.name ? 'bg-neutral-100 font-semibold' : 'hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-neutral-700">{item.name}</span>
                      </div>
                      <span className="font-mono text-neutral-500 font-semibold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
            <span>Dynamic Agricultural Model</span>
            <button
              onClick={() => onNavigateTab('progression')}
              className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
            >
              <span>View Progression</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* RIGHT: Recent Scans Section (Section 18 - Real Uploaded Scans, No Future Dates) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-neutral-900">Recent Scans</h3>
              <button
                onClick={() => onNavigateTab('history')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {scans.length === 0 ? (
                <div className="py-8 text-center text-neutral-400 text-xs">
                  No crop scans yet.
                </div>
              ) : (
                scans.slice(0, 3).map((scan) => {
                  const severityBadge =
                    scan.severity === 'High'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : scan.severity === 'Medium'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200';

                  return (
                    <div
                      key={scan.id}
                      onClick={() => onSelectScan(scan)}
                      className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 hover:border-emerald-200 hover:bg-neutral-50/70 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                          <img
                            src={scan.imageUrl}
                            alt={scan.crop}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-neutral-900">
                              {scan.crop}
                            </span>
                            <span className="text-neutral-400">·</span>
                            <span className="text-xs font-medium text-neutral-700">
                              {scan.farmerConditionName || scan.disease}
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-400 mt-0.5 font-mono">
                            {scan.date}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${severityBadge}`}
                        >
                          {scan.severity}
                        </span>
                        <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>Today: <strong>{getCurrentDateStr()}</strong></span>
            <span className="text-emerald-700 font-medium">Automatic scouting sync</span>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigateTab('scan')}
            className="p-4 bg-white hover:bg-emerald-50/50 rounded-xl border border-neutral-200/80 hover:border-emerald-300 transition-all text-left group shadow-xs"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Camera className="w-4 h-4" />
            </div>
            <div className="text-sm font-semibold text-neutral-900">New Scan</div>
            <p className="text-[11px] text-neutral-400 mt-0.5">Upload leaf photo</p>
          </button>

          <button
            onClick={() => onNavigateTab('ask')}
            className="p-4 bg-white hover:bg-emerald-50/50 rounded-xl border border-neutral-200/80 hover:border-emerald-300 transition-all text-left group shadow-xs"
          >
            <div className="w-9 h-9 rounded-lg bg-teal-100/70 text-teal-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="text-sm font-semibold text-neutral-900">Ask My Crop</div>
            <p className="text-[11px] text-neutral-400 mt-0.5">AI chat advisor</p>
          </button>

          <button
            onClick={() => onNavigateTab('history')}
            className="p-4 bg-white hover:bg-emerald-50/50 rounded-xl border border-neutral-200/80 hover:border-emerald-300 transition-all text-left group shadow-xs"
          >
            <div className="w-9 h-9 rounded-lg bg-sky-100/70 text-sky-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <History className="w-4 h-4" />
            </div>
            <div className="text-sm font-semibold text-neutral-900">View History</div>
            <p className="text-[11px] text-neutral-400 mt-0.5">Full disease logs</p>
          </button>

          <button
            onClick={() => onNavigateTab('health')}
            className="p-4 bg-white hover:bg-emerald-50/50 rounded-xl border border-neutral-200/80 hover:border-emerald-300 transition-all text-left group shadow-xs"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
            <div className="text-sm font-semibold text-neutral-900">Crop Health</div>
            <p className="text-[11px] text-neutral-400 mt-0.5">Foliar score & risks</p>
          </button>
        </div>
      </div>
    </div>
  );
};
