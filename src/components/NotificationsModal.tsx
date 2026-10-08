import React from 'react';
import { Bell, Check, AlertOctagon, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectNotification: (item: NotificationItem) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'danger':
        return <AlertOctagon className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <Info className="w-4 h-4 text-sky-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-end p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-neutral-200 overflow-hidden mt-12 animate-scaleUp">
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-neutral-900">Farm Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center font-bold text-xs"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-4 divide-y divide-neutral-100 max-h-[420px] overflow-y-auto space-y-1">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectNotification(item)}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                item.read ? 'opacity-70 hover:bg-neutral-50' : 'bg-emerald-50/40 hover:bg-emerald-50 font-medium'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getIcon(item.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-neutral-900 truncate">{item.title}</h4>
                    <span className="text-[10px] text-neutral-400 font-mono">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">{item.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-neutral-100 bg-neutral-50/80 text-center text-[11px] text-neutral-400">
          Alerts generated automatically based on scouting logs and sensor forecasts.
        </div>
      </div>
    </div>
  );
};
