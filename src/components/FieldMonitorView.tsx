import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Droplets,
  Thermometer,
  Camera,
  Info,
  Maximize2,
  Navigation
} from 'lucide-react';
import { FARM_PLOTS } from '../data/mockData';
import { FarmPlot } from '../types';

interface FieldMonitorViewProps {
  onStartNewScan: () => void;
  onNavigateTab: (tab: any) => void;
}

export const FieldMonitorView: React.FC<FieldMonitorViewProps> = ({
  onStartNewScan,
  onNavigateTab,
}) => {
  const [selectedPlot, setSelectedPlot] = useState<FarmPlot>(FARM_PLOTS[0]);
  const [viewType, setViewType] = useState<'grid' | 'satellite'>('grid');

  // 4x4 Farm sub-grid simulation
  const subGrid = [
    ['healthy', 'healthy', 'monitor', 'monitor'],
    ['healthy', 'critical', 'critical', 'monitor'],
    ['healthy', 'critical', 'risk', 'monitor'],
    ['healthy', 'healthy', 'healthy', 'healthy'],
  ];

  const getColorClass = (type: string) => {
    switch (type) {
      case 'healthy':
        return 'bg-emerald-500 hover:bg-emerald-600 border-emerald-600';
      case 'monitor':
        return 'bg-amber-400 hover:bg-amber-500 border-amber-500';
      case 'risk':
        return 'bg-orange-500 hover:bg-orange-600 border-orange-600';
      case 'critical':
        return 'bg-red-500 hover:bg-red-600 border-red-600 animate-pulse';
      default:
        return 'bg-neutral-300';
    }
  };

  return (
    <div className="space-y-6 pb-14 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
            Field Monitor
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Geospatial farm parcel health, drone survey simulations, and foliar risk zones.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-white border border-neutral-200 rounded-xl shadow-2xs self-start sm:self-center">
          <button
            onClick={() => setViewType('grid')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              viewType === 'grid'
                ? 'bg-emerald-700 text-white'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Parcel Grid
          </button>
          <button
            onClick={() => setViewType('satellite')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              viewType === 'satellite'
                ? 'bg-emerald-700 text-white'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Drone / Satellite
          </button>
        </div>
      </div>

      {/* High-risk Zone Callout */}
      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <AlertOctagon className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <strong className="text-xs font-bold text-red-900">
              High-Risk Zone Detected: West Acre (Plot B)
            </strong>
            <p className="text-[11px] text-red-800">
              Late Blight hotspot expanding in sectors B-2 and B-3. Immediate quarantine advised.
            </p>
          </div>
        </div>

        <button
          onClick={onStartNewScan}
          className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 shrink-0 self-start sm:self-center"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Rescan Sector B</span>
        </button>
      </div>

      {/* Main Field Map & Parcel Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Farm Map / Grid Area */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-neutral-900">Farm Layout (45 Total Acres)</h3>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">
              GPS: 19.9975° N, 73.7898° E (Demo Coordinates)
            </span>
          </div>

          {/* Interactive Farm Map Canvas Simulation */}
          <div className="relative rounded-2xl bg-neutral-900 p-6 overflow-hidden min-h-[340px] flex flex-col items-center justify-center border border-neutral-800">
            {/* Background texture */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Stylized 4x4 Grid Matrix */}
            <div className="relative z-10 grid grid-cols-4 gap-3 p-4 bg-neutral-950/70 backdrop-blur-md rounded-2xl border border-neutral-800 shadow-2xl">
              {subGrid.map((row, rIdx) =>
                row.map((status, cIdx) => {
                  const plotMatch =
                    rIdx === 0 && cIdx === 0
                      ? FARM_PLOTS[0]
                      : rIdx === 0 && cIdx === 1
                      ? FARM_PLOTS[1]
                      : rIdx === 1 && cIdx === 0
                      ? FARM_PLOTS[2]
                      : FARM_PLOTS[3];

                  const isCurrent = selectedPlot.id === plotMatch.id;

                  return (
                    <button
                      key={`${rIdx}-${cIdx}`}
                      onClick={() => setSelectedPlot(plotMatch)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 flex flex-col items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 shadow-md ${getColorClass(
                        status
                      )} ${isCurrent ? 'ring-4 ring-white' : ''}`}
                      title={`${plotMatch.name} - ${status.toUpperCase()}`}
                    >
                      <span className="text-[10px] font-bold font-mono">
                        {String.fromCharCode(65 + rIdx)}
                        {cIdx + 1}
                      </span>
                      <span className="text-[9px] opacity-90 capitalize font-medium">{status}</span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Drone simulation overlay tag */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[11px] font-mono flex items-center gap-1.5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Drone NDVI Layer Active</span>
            </div>

            <div className="absolute bottom-3 right-3 text-[10px] text-neutral-400 font-mono">
              Click any sector to inspect microclimate & crop data
            </div>
          </div>

          {/* Map Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-neutral-600">
            <span className="font-semibold text-neutral-800">Legend:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Healthy (0–5%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span>Monitor (5–20%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-orange-500" />
              <span>At Risk (20–35%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span>Critical (35%+)</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Parcel Detail Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-900">Parcel Inspector</h3>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  selectedPlot.status === 'Critical'
                    ? 'bg-red-50 text-red-700'
                    : selectedPlot.status === 'Monitor'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {selectedPlot.status}
              </span>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-base font-bold text-neutral-900">{selectedPlot.name}</h4>
                <p className="text-xs text-neutral-500">
                  {selectedPlot.crop} · {selectedPlot.areaAcres} Acres
                </p>
              </div>

              {/* Foliar Damage */}
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500 font-medium">Foliar Damage Level</span>
                  <strong className="font-mono text-neutral-900">
                    {selectedPlot.affectedPercentage}%
                  </strong>
                </div>
                <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      selectedPlot.affectedPercentage > 30
                        ? 'bg-red-500'
                        : selectedPlot.affectedPercentage > 10
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.max(selectedPlot.affectedPercentage, 4)}%` }}
                  />
                </div>
              </div>

              {/* Sensor Readings */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                    <Droplets className="w-3.5 h-3.5 text-sky-500" />
                    <span>Soil Moisture</span>
                  </div>
                  <div className="text-base font-bold font-mono text-neutral-800">
                    {selectedPlot.soilMoisture}%
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                    <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                    <span>Canopy Temp</span>
                  </div>
                  <div className="text-base font-bold font-mono text-neutral-800">
                    {selectedPlot.canopyTemp}°C
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-neutral-400">
                Last Scouted: <strong className="text-neutral-700">{selectedPlot.lastScanDate}</strong>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-neutral-100">
            <button
              onClick={onStartNewScan}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Scan This Parcel Now</span>
            </button>

            <button
              onClick={() => onNavigateTab('health')}
              className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold text-xs rounded-xl transition-colors"
            >
              View Care Plan
            </button>
          </div>
        </div>
      </div>

      {/* Prototype notice */}
      <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-500 text-xs flex items-center gap-2">
        <Info className="w-4 h-4 text-neutral-400 shrink-0" />
        <span>
          <strong>Field Monitor Prototype:</strong> Demonstrates multi-zone crop risk mapping based on scouting logs. In commercial production, connects to real-time satellite Sentinel-2 NDVI feeds and drone orthomosaics.
        </span>
      </div>
    </div>
  );
};
