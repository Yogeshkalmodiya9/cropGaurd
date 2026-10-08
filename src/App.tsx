/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { NewScanView } from './components/NewScanView';
import { TreatmentPlanView } from './components/TreatmentPlanView';
import { AskMyCropView } from './components/AskMyCropView';
import { CropHealthView } from './components/CropHealthView';
import { HistoryView } from './components/HistoryView';
import { ProgressionView } from './components/ProgressionView';
import { FieldMonitorView } from './components/FieldMonitorView';
import { AboutView } from './components/AboutView';
import { NotificationsModal } from './components/NotificationsModal';
import { FarmerProfileModal } from './components/FarmerProfileModal';
import { ExpertHelpModal } from './components/ExpertHelpModal';

import { ScanResult, FarmerProfile, NotificationItem } from './types';
import {
  INITIAL_SCANS,
  DEFAULT_FARMER_PROFILE,
  INITIAL_NOTIFICATIONS,
  SAMPLE_IMAGES,
  sanitizeAndSortScans
} from './data/mockData';
import { get_scan_history, delete_scan, clear_scan_history } from './services/api';
import { Sprout, FileText } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [healthSubTab, setHealthSubTab] = useState<'overview' | 'treatment'>('overview');
  const [scans, setScans] = useState<ScanResult[]>(sanitizeAndSortScans(INITIAL_SCANS));
  const [currentScan, setCurrentScan] = useState<ScanResult>(INITIAL_SCANS[0]);
  const [farmer, setFarmer] = useState<FarmerProfile>(DEFAULT_FARMER_PROFILE);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Mobile sidebar drawer
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Modals
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isExpertHelpOpen, setIsExpertHelpOpen] = useState<boolean>(false);

  // Competition Presentation Mode (Guided Tour for Judges)
  const [demoTourStep, setDemoTourStep] = useState<number | null>(null);

  // Load persistent history on mount
  useEffect(() => {
    const loadedScans = get_scan_history();
    if (loadedScans.length > 0) {
      setScans(loadedScans);
      setCurrentScan(loadedScans[0]);
    }
  }, []);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const handleStartNewScan = () => {
    setActiveTab('scan');
  };

  const handleScanComplete = (result: ScanResult) => {
    setCurrentScan(result);
    if (result.isValidCrop !== false) {
      setScans((prev) => {
        const exists = prev.some((s) => s.id === result.id);
        if (exists) return prev;
        return sanitizeAndSortScans([result, ...prev]);
      });
    }
  };

  const handleSelectScanFromHistory = (scan: ScanResult) => {
    setCurrentScan(scan);
    setActiveTab('scan');
  };

  const handleDeleteScan = (id: string) => {
    const updated = delete_scan(id);
    setScans(updated);
  };

  const handleClearHistory = () => {
    const updated = clear_scan_history();
    setScans(updated);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSelectNotification = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    if (item.scanId) {
      const match = scans.find((s) => s.id === item.scanId);
      if (match) {
        setCurrentScan(match);
        setActiveTab('scan');
      }
    }
    setIsNotificationsOpen(false);
  };

  const handleNavigate = (tab: NavTab | 'treatment' | 'health-overview') => {
    if (tab === 'treatment') {
      setActiveTab('health');
      setHealthSubTab('treatment');
    } else if (tab === 'health-overview') {
      setActiveTab('health');
      setHealthSubTab('overview');
    } else {
      setActiveTab(tab as NavTab);
    }
  };

  // Competition Tour Stepper
  const handleStartDemoTour = () => {
    setDemoTourStep(1);
    setActiveTab('dashboard');
  };

  const handleAdvanceDemoTour = () => {
    if (demoTourStep === null) return;
    const next = demoTourStep + 1;
    if (next > 14) {
      setDemoTourStep(null);
      return;
    }
    setDemoTourStep(next);

    // Map tour steps to views
    switch (next) {
      case 1:
        setActiveTab('dashboard');
        break;
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        setActiveTab('scan');
        break;
      case 7:
        setActiveTab('health');
        setHealthSubTab('treatment');
        break;
      case 8:
        setActiveTab('health');
        setHealthSubTab('overview');
        break;
      case 9:
        setActiveTab('ask');
        break;
      case 10:
      case 11:
        setActiveTab('history');
        break;
      case 12:
      case 13:
        setActiveTab('progression');
        break;
      case 14:
        setActiveTab('field');
        break;
      default:
        break;
    }
  };

  const handleCloseDemoTour = () => {
    setDemoTourStep(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex font-sans antialiased text-[#1E2923]">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'health') setHealthSubTab('overview');
        }}
        farmer={farmer}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenDemoTour={handleStartDemoTour}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header
          activeTab={activeTab}
          onNewScan={handleStartNewScan}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          unreadCount={unreadNotificationsCount}
          demoTourStep={demoTourStep}
          onAdvanceDemoTour={handleAdvanceDemoTour}
          onCloseDemoTour={handleCloseDemoTour}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              scans={scans}
              onStartNewScan={handleStartNewScan}
              onSelectScan={(scan) => {
                setCurrentScan(scan);
                setActiveTab('scan');
              }}
              onNavigateTab={handleNavigate}
            />
          )}

          {activeTab === 'scan' && (
            <NewScanView
              currentScan={currentScan}
              onScanComplete={handleScanComplete}
              onNavigateTab={handleNavigate}
            />
          )}

          {activeTab === 'health' && (
            <div className="space-y-6">
              {/* Sub-navigation Switcher between Foliar Overview and Treatment Plan */}
              <div className="flex items-center gap-2 p-1.5 bg-neutral-200/60 rounded-2xl w-fit">
                <button
                  onClick={() => setHealthSubTab('overview')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    healthSubTab === 'overview'
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <span>Crop Health Overview (78%)</span>
                </button>
                <button
                  onClick={() => setHealthSubTab('treatment')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    healthSubTab === 'treatment'
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Treatment & Care Plan</span>
                </button>
              </div>

              {healthSubTab === 'overview' ? (
                <CropHealthView
                  onStartNewScan={handleStartNewScan}
                  onNavigateTab={handleNavigate}
                />
              ) : (
                <TreatmentPlanView
                  currentScan={currentScan}
                  onNavigateTab={handleNavigate}
                  onOpenExpertModal={() => setIsExpertHelpOpen(true)}
                />
              )}
            </div>
          )}

          {activeTab === 'ask' && (
            <AskMyCropView
              currentScan={currentScan}
              onNavigateTab={handleNavigate}
              onSelectAnotherScan={() => setActiveTab('scan')}
            />
          )}

          {activeTab === 'history' && (
            <HistoryView
              scans={scans}
              onSelectScan={handleSelectScanFromHistory}
              onNavigateTab={handleNavigate}
              onDeleteScan={handleDeleteScan}
              onClearHistory={handleClearHistory}
            />
          )}

          {activeTab === 'progression' && (
            <ProgressionView
              currentScan={currentScan}
              onNavigateTab={handleNavigate}
            />
          )}

          {activeTab === 'field' && (
            <FieldMonitorView
              onStartNewScan={handleStartNewScan}
              onNavigateTab={handleNavigate}
            />
          )}

          {activeTab === 'about' && (
            <AboutView
              onStartNewScan={handleStartNewScan}
              onOpenTour={handleStartDemoTour}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onSelectNotification={handleSelectNotification}
      />

      <FarmerProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={farmer}
        onSaveProfile={(updated) => setFarmer(updated)}
      />

      <ExpertHelpModal
        isOpen={isExpertHelpOpen}
        onClose={() => setIsExpertHelpOpen(false)}
      />
    </div>
  );
}
