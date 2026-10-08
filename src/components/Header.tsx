import React from 'react';
import {
  Bell,
  Sun,
  Droplets,
  HeartPulse,
  Sparkles,
  Camera,
  Activity,
  ChevronRight,
  Menu
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface HeaderProps {
  activeTab: NavTab;
  onNewScan: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  demoTourStep: number | null;
  onAdvanceDemoTour: () => void;
  onCloseDemoTour: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onNewScan,
  onOpenNotifications,
  unreadCount,
  demoTourStep,
  onAdvanceDemoTour,
  onCloseDemoTour,
  onToggleMobileSidebar,
}) => {
  const getTabTitle = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard':
        return { title: 'Dashboard', sub: 'Executive Farm Overview' };
      case 'scan':
        return { title: 'Scan Crop', sub: 'Neural Computer Vision Diagnosis' };
      case 'health':
        return { title: 'Crop Health', sub: 'Foliar Vitality & Risk Metrics' };
      case 'ask':
        return { title: 'Ask My Crop', sub: 'Context-Aware Agricultural Intelligence' };
      case 'history':
        return { title: 'Scan History', sub: 'Past Diagnoses & Disease Logs' };
      case 'progression':
        return { title: 'Disease Progression', sub: 'Temporal Growth Curves & Comparison' };
      case 'field':
        return { title: 'Field Monitor', sub: 'Geospatial Parcel Health & Zones' };
      case 'about':
        return { title: 'About CropGuard AI', sub: 'Explainable AI Architecture' };
      default:
        return { title: 'CropGuard AI', sub: 'Agricultural Intelligence' };
    }
  };

  const currentTabInfo = getTabTitle(activeTab);

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-6 py-3">
      {/* Competition Presentation Mode Floating Guide Bar */}
      {demoTourStep !== null && (
        <div className="mb-2 py-1.5 px-3 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-lg text-white flex items-center justify-between text-xs shadow-md animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-yellow-300">Competition Demo Mode:</span>
            <span className="text-emerald-100">
              Step {demoTourStep} of 14 —{' '}
              {demoTourStep === 1 && 'Dashboard Overview & Health Stats'}
              {demoTourStep === 2 && 'Image Upload & Leaf Selection'}
              {demoTourStep === 3 && 'AI Neural Vision Scanning'}
              {demoTourStep === 4 && 'Disease Identification & Confidence'}
              {demoTourStep === 5 && 'Explainable Attention Map (Grad-CAM)'}
              {demoTourStep === 6 && 'Severity Estimation & Affected Area'}
              {demoTourStep === 7 && 'Immediate Action Checklist'}
              {demoTourStep === 8 && 'Organic vs Chemical Guidance'}
              {demoTourStep === 9 && 'Ask My Crop Conversational Assistant'}
              {demoTourStep === 10 && 'Saving to Persistent History'}
              {demoTourStep === 11 && 'Historical Scouting Logs'}
              {demoTourStep === 12 && 'Disease Progression Timeline'}
              {demoTourStep === 13 && 'Dual-Scan Visual Comparison'}
              {demoTourStep === 14 && 'Geospatial Field Parcel Monitor'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onAdvanceDemoTour}
              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold rounded text-[11px] flex items-center gap-1 transition-colors"
            >
              <span>{demoTourStep === 14 ? 'Finish Tour' : 'Next Step'}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            <button
              onClick={onCloseDemoTour}
              className="px-2 py-0.5 text-emerald-300 hover:text-white text-[11px]"
            >
              Exit
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        {/* Left: Breadcrumbs & Context Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-1.5 -ml-1.5 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-xs font-mono font-medium text-emerald-800/80 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
            {currentTabInfo.sub}
          </span>
        </div>

        {/* Center: Live Agro-Weather Sensor Strip */}
        <div className="hidden lg:flex items-center gap-5 px-3.5 py-1.5 rounded-full bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-600">
          <div className="flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold text-neutral-800">28°C</span>
            <span className="text-neutral-400 text-[11px]">Sunny</span>
          </div>
          <span className="text-neutral-300">|</span>
          <div className="flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-sky-500" />
            <span>Humidity: <strong className="text-neutral-800">62%</strong></span>
          </div>
          <span className="text-neutral-300">|</span>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>Soil Moisture: <strong className="text-neutral-800">68%</strong></span>
          </div>
          <span className="text-neutral-300">|</span>
          <div className="flex items-center gap-1.5">
            <HeartPulse className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-emerald-700 font-semibold">Crop Health: Good</span>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">(Demo Sensor)</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* New Scan Quick CTA */}
          {activeTab !== 'scan' && (
            <button
              onClick={onNewScan}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition-all hover:shadow active:scale-95"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>New Scan</span>
            </button>
          )}

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
