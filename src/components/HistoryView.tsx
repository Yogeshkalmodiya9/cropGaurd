import React, { useState } from 'react';
import {
  Calendar,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageSquare,
  TrendingUp,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { ScanResult } from '../types';
import { formatPastDate, getCurrentDateStr, sanitizeAndSortScans } from '../data/mockData';

interface HistoryViewProps {
  scans: ScanResult[];
  onSelectScan: (scan: ScanResult) => void;
  onNavigateTab: (tab: any) => void;
  onDeleteScan?: (id: string) => void;
  onClearHistory?: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  scans,
  onSelectScan,
  onNavigateTab,
  onDeleteScan,
  onClearHistory,
}) => {
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('All');
  const [customDate, setCustomDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Today's date in YYYY-MM-DD format for input max constraint
  const todayISO = new Date().toISOString().split('T')[0];

  // Strictly filter out ANY future dates and guarantee newest first
  const validScans = sanitizeAndSortScans(scans);

  // Filter scans
  const filteredScans = validScans.filter((scan) => {
    const matchesCrop =
      selectedCropFilter === 'All' || scan.crop.toLowerCase() === selectedCropFilter.toLowerCase();
    const matchesStatus =
      selectedStatusFilter === 'All' ||
      (selectedStatusFilter === 'Healthy' && scan.status === 'Healthy') ||
      (selectedStatusFilter === 'Diseased' && scan.status === 'Diseased') ||
      scan.severity.toLowerCase() === selectedStatusFilter.toLowerCase();
    
    // Date filter logic (strictly <= today)
    let matchesDate = true;
    const scanTime = Date.parse(scan.date) || 0;
    const nowTime = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    if (selectedDateFilter === 'Today') {
      matchesDate = scan.date === getCurrentDateStr() || (nowTime - scanTime < oneDayMs);
    } else if (selectedDateFilter === '7days') {
      matchesDate = (nowTime - scanTime) <= (7 * oneDayMs);
    } else if (selectedDateFilter === '14days') {
      matchesDate = (nowTime - scanTime) <= (14 * oneDayMs);
    } else if (selectedDateFilter === '30days') {
      matchesDate = (nowTime - scanTime) <= (30 * oneDayMs);
    } else if (selectedDateFilter === 'Custom' && customDate) {
      // Format custom date to locale string or compare
      const targetDate = new Date(customDate);
      const targetStr = targetDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      matchesDate = scan.date === targetStr;
    }

    const matchesQuery =
      scan.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.disease.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (scan.farmerConditionName && scan.farmerConditionName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      scan.date.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCrop && matchesStatus && matchesDate && matchesQuery;
  });

  const totalPages = Math.ceil(filteredScans.length / itemsPerPage) || 1;
  const paginatedScans = filteredScans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 pb-14 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Crop Health History</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Pehle kiye gaye sabhi scouting scans aur rog ki jaanch yahan dekhein.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-medium text-neutral-500 bg-white px-3 py-1.5 rounded-lg border border-neutral-200">
            {filteredScans.length} Scans Record
          </span>
          {onClearHistory && scans.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Kya aap scan history clear karna chahte hain?')) {
                  onClearHistory();
                }
              }}
              className="text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Crop Filter including Soybean */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-neutral-500 font-medium">Crop:</label>
            <select
              value={selectedCropFilter}
              onChange={(e) => {
                setSelectedCropFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-neutral-800 font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Crops</option>
              <option value="Soybean">Soybean (सोयाबीन)</option>
              <option value="Tomato">Tomato (टमाटर)</option>
              <option value="Potato">Potato (आलू)</option>
              <option value="Chilli">Chilli (मिर्च)</option>
              <option value="Cotton">Cotton (कपास)</option>
              <option value="Maize">Maize (मक्का)</option>
              <option value="Wheat">Wheat (गेहूं)</option>
              <option value="Rice">Rice (धान)</option>
            </select>
          </div>

          {/* Status / Severity Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-neutral-500 font-medium">Status:</label>
            <select
              value={selectedStatusFilter}
              onChange={(e) => {
                setSelectedStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-neutral-800 font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Status</option>
              <option value="Healthy">Healthy (Swasth)</option>
              <option value="Low">Low Severity</option>
              <option value="Medium">Medium Severity</option>
              <option value="High">High Severity</option>
            </select>
          </div>

          {/* Date Filter (Strictly Enforces <= Current Date) */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-neutral-500 font-medium">Date:</label>
            <select
              value={selectedDateFilter}
              onChange={(e) => {
                setSelectedDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-neutral-800 font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Dates (≤ {getCurrentDateStr()})</option>
              <option value="Today">Today ({getCurrentDateStr()})</option>
              <option value="7days">Past 7 Days</option>
              <option value="14days">Past 14 Days</option>
              <option value="30days">Past 30 Days</option>
              <option value="Custom">Custom Date (Past only)</option>
            </select>
          </div>

          {/* Custom Date Input strictly bounded by max={todayISO} */}
          {selectedDateFilter === 'Custom' && (
            <div className="flex items-center gap-1.5 animate-fadeIn">
              <input
                type="date"
                max={todayISO}
                value={customDate}
                onChange={(e) => {
                  const val = e.target.value;
                  // Guard against any future date
                  if (val > todayISO) {
                    setCustomDate(todayISO);
                  } else {
                    setCustomDate(val);
                  }
                  setCurrentPage(1);
                }}
                className="text-xs bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-1 text-neutral-800 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search crop or disease..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/75 border-b border-neutral-200 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Crop</th>
                <th className="py-3 px-4">Disease / Condition</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {paginatedScans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    <p className="text-sm font-semibold text-neutral-600">No crop scans yet.</p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Naya scan karne ke liye 'New Scan' button par click karein.
                    </p>
                    <button
                      onClick={() => onNavigateTab('scan')}
                      className="mt-3 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold"
                    >
                      Scan a Crop Now
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedScans.map((scan) => {
                  const severityBadge =
                    scan.severity === 'High'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : scan.severity === 'Medium'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200';

                  return (
                    <tr
                      key={scan.id}
                      onClick={() => onSelectScan(scan)}
                      className="hover:bg-neutral-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-5 font-mono text-neutral-600 whitespace-nowrap">
                        <div>{scan.date}</div>
                        {scan.timestamp && (
                          <div className="text-[10px] text-neutral-400 font-normal">
                            {scan.timestamp.split(',')[1]?.trim() || ''}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                          <img
                            src={scan.imageUrl}
                            alt={scan.crop}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-neutral-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{scan.cropIcon}</span>
                          <span>{scan.crop}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-neutral-900">
                          {scan.farmerConditionName || scan.disease}
                        </div>
                        <div className="text-[11px] text-neutral-400">{scan.disease}</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${severityBadge}`}
                        >
                          {scan.severity}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-neutral-800 whitespace-nowrap">
                        {scan.confidence}%
                      </td>

                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectScan(scan);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-emerald-100 text-neutral-700 hover:text-emerald-800 text-[11px] font-semibold transition-colors"
                          >
                            View Details
                          </button>
                          {onDeleteScan && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteScan(scan.id);
                              }}
                              className="p-1 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete Scan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {filteredScans.length > 0 && (
          <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between text-xs text-neutral-500">
            <span>
              Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                      currentPage === pageNum
                        ? 'bg-emerald-700 text-white'
                        : 'bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
