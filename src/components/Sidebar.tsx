import React from 'react';
import {
  LayoutDashboard,
  Camera,
  Sprout,
  MessageSquare,
  History,
  TrendingUp,
  MapPin,
  Info,
  User,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { FarmerProfile } from '../types';

export type NavTab =
  | 'dashboard'
  | 'scan'
  | 'health'
  | 'ask'
  | 'history'
  | 'progression'
  | 'field'
  | 'about';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  farmer: FarmerProfile;
  onOpenProfile: () => void;
  onOpenDemoTour: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  farmer,
  onOpenProfile,
  onOpenDemoTour,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'scan', label: 'New Scan', icon: <Camera className="w-5 h-5" /> },
    { id: 'health', label: 'Crop Health', icon: <Sprout className="w-5 h-5" /> },
    { id: 'ask', label: 'Ask My Crop', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'history', label: 'History', icon: <History className="w-5 h-5" /> },
    { id: 'progression', label: 'Progression', icon: <TrendingUp className="w-5 h-5" />, badge: '4 Scans' },
    { id: 'field', label: 'Field Monitor', icon: <MapPin className="w-5 h-5" /> },
    { id: 'about', label: 'About', icon: <Info className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 w-64 bg-[#0A3323] text-white flex flex-col justify-between shrink-0 h-screen border-r border-[#134934] select-none z-50 transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
      {/* Brand Header */}
      <div className="p-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-950/40">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white">CropGuard</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">AI</span>
            </div>
            <p className="text-[11px] text-emerald-300/70 font-medium tracking-wide">
              Detect • Explain • Track • Act
            </p>
          </div>
        </div>

        {/* Competition Tour Shortcut */}
        <button
          onClick={onOpenDemoTour}
          className="mt-4 w-full flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-500/30 text-emerald-200 text-xs font-medium transition-all group shadow-inner"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            <span>Judge Presentation Tour</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-300 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                onCloseMobile?.();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-[#157347] text-white shadow-md shadow-emerald-950/30 font-semibold'
                  : 'text-emerald-100/75 hover:text-white hover:bg-[#114b34]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-emerald-300/80'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-emerald-900/80 text-emerald-200 border border-emerald-600/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Farmer Profile */}
      <div className="p-3 border-t border-[#134934] bg-[#07271b]/80">
        <button
          onClick={onOpenProfile}
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[#114b34] transition-colors text-left group"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-emerald-700/80 flex items-center justify-center text-white border border-emerald-400/40">
              <User className="w-4 h-4" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#07271b]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-white truncate">{farmer.name}</p>
              <span className="text-[10px] text-emerald-400 font-medium">● Online</span>
            </div>
            <p className="text-[11px] text-emerald-300/60 truncate">{farmer.farmName}</p>
          </div>
        </button>

        <div className="mt-2 pt-2 border-t border-emerald-900/40 flex items-center justify-between text-[11px] text-emerald-400/60 px-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Edge Vision v2.4
          </span>
          <span className="font-mono text-[10px]">45 Acres</span>
        </div>
      </div>
    </aside>
    </>
  );
};
