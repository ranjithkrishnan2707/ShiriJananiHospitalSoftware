import React, { useState, useEffect, useRef } from 'react';
import { WifiOff, CheckCircle, RefreshCw, X, AlertTriangle } from 'lucide-react';
import { subscribeSyncStatus, getSyncEngineStatus } from '../services/offlineSyncEngine';
import type { NetworkStatus } from '../services/offlineSyncEngine';
import './NetworkToast.css';

interface ToastAlert {
  id: string;
  type: 'disconnect' | 'reconnect' | 'synced';
  title: string;
  message: string;
}

export const NetworkToast: React.FC = () => {
  const [toast, setToast] = useState<ToastAlert | null>(null);
  const previousStatusRef = useRef<NetworkStatus | null>(null);
  const timerRef = useRef<any>(null);

  const showToast = (alert: ToastAlert, durationMs = 7000) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(alert);
    timerRef.current = setTimeout(() => {
      setToast(null);
    }, durationMs);
  };

  useEffect(() => {
    const initial = getSyncEngineStatus();
    previousStatusRef.current = initial.status;

    // If app starts in offline mode, show alert immediately
    if (initial.status === 'OFFLINE') {
      showToast({
        id: `toast_${Date.now()}`,
        type: 'disconnect',
        title: '⚠️ SERVER DISCONNECTED',
        message: 'Admin PC Server is OFF or unreachable over LAN. Running in Offline Mode — changes will be saved locally.'
      }, 9000);
    }

    const unsubscribe = subscribeSyncStatus((statusState) => {
      const prev = previousStatusRef.current;
      const curr = statusState.status;

      if (prev && prev !== curr) {
        if (curr === 'OFFLINE') {
          showToast({
            id: `toast_${Date.now()}`,
            type: 'disconnect',
            title: '🔴 ALERT: SERVER DISCONNECTED!',
            message: 'Connection to Admin PC Server lost. Data will be saved safely in Local Storage.'
          }, 10000);
        } else if (curr === 'ONLINE' || curr === 'SYNCING') {
          showToast({
            id: `toast_${Date.now()}`,
            type: 'reconnect',
            title: '🟢 ALERT: SERVER RECONNECTED!',
            message: 'Admin PC Server is back online. Synchronizing local offline queue into MySQL database...'
          }, 8000);
        }
      }
      previousStatusRef.current = curr;
    });

    const handleSynced = (e: any) => {
      const count = e.detail?.syncedCount || 0;
      showToast({
        id: `toast_${Date.now()}`,
        type: 'synced',
        title: '⚡ OFFLINE SYNC COMPLETE',
        message: `Successfully moved ${count} offline record(s) into MySQL Database!`
      }, 7000);
    };

    window.addEventListener('sjh_data_synced', handleSynced);

    return () => {
      unsubscribe();
      window.removeEventListener('sjh_data_synced', handleSynced);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!toast) return null;

  return (
    <div className={`network-toast-banner ${toast.type}`}>
      <div className="toast-icon-wrap">
        {toast.type === 'disconnect' && <WifiOff size={22} className="toast-icon disconnect" />}
        {toast.type === 'reconnect' && <CheckCircle size={22} className="toast-icon reconnect" />}
        {toast.type === 'synced' && <RefreshCw size={22} className="toast-icon synced spin" />}
      </div>

      <div className="toast-content">
        <strong className="toast-title">{toast.title}</strong>
        <p className="toast-message">{toast.message}</p>
      </div>

      <button className="toast-close-btn" onClick={() => setToast(null)} aria-label="Close Alert">
        <X size={18} />
      </button>
    </div>
  );
};
