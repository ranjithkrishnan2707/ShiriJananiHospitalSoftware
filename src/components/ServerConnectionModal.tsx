import React, { useState, useEffect } from 'react';
import { X, Server, RefreshCw, CheckCircle, AlertTriangle, Wifi, Database } from 'lucide-react';
import { getServerIp, setServerIp } from '../services/apiClient';
import { 
  getSyncEngineStatus, 
  subscribeSyncStatus, 
  checkServerHealth, 
  syncOfflineData
} from '../services/offlineSyncEngine';
import type { SyncEngineStatus } from '../services/offlineSyncEngine';
import './ServerConnectionModal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ServerConnectionModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [ipInput, setIpInput] = useState(getServerIp());
  const [statusState, setStatusState] = useState<SyncEngineStatus>(getSyncEngineStatus());
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setIpInput(getServerIp());
    const unsubscribe = subscribeSyncStatus(setStatusState);
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setNotice(null);
    setServerIp(ipInput);
    const isOnline = await checkServerHealth();
    setTesting(false);
    if (isOnline) {
      setNotice('✅ Connected to Admin Server PC successfully over LAN!');
    } else {
      setNotice('⚠️ Unable to reach Admin Server at this IP. Please check if Admin PC is turned ON and connected via LAN.');
    }
  };

  const handleManualSync = async () => {
    setSyncing(true);
    setNotice(null);
    const result = await syncOfflineData();
    setSyncing(false);
    if (result.success) {
      setNotice(`🎉 Successfully synced ${result.syncedCount} offline records into MySQL Database!`);
    } else {
      setNotice(`⚠️ Sync issue: ${result.error || 'Check server status'}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="server-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="server-modal-header">
          <div className="header-title">
            <Server size={20} className="server-icon" />
            <h3>LAN Server & MySQL Connection Settings</h3>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="server-modal-body">
          {/* Connection Status Card */}
          <div className={`status-badge-card ${statusState.status.toLowerCase()}`}>
            <div className="status-main">
              {statusState.status === 'ONLINE' && <CheckCircle size={24} className="icon online" />}
              {statusState.status === 'OFFLINE' && <AlertTriangle size={24} className="icon offline" />}
              {statusState.status === 'SYNCING' && <RefreshCw size={24} className="icon syncing spin" />}

              <div>
                <div className="status-label">
                  Status: <strong>{statusState.status === 'ONLINE' ? '🟢 Server Online (MySQL Connected)' : statusState.status === 'SYNCING' ? '⚡ Syncing Offline Queue...' : '🔴 Offline Mode (Admin Server OFF)'}</strong>
                </div>
                <div className="status-sub">
                  {statusState.pendingCount > 0 
                    ? `⚠️ ${statusState.pendingCount} record(s) queued in local storage waiting to sync`
                    : statusState.status === 'ONLINE' 
                    ? 'All local data is synchronized with MySQL Database' 
                    : 'Changes will save locally and auto-sync when Admin PC turns ON'}
                </div>
              </div>
            </div>
          </div>

          {/* Form IP Config */}
          <div className="form-group-lan">
            <label><Wifi size={16} /> Admin Server PC IP Address (LAN)</label>
            <div className="ip-input-row">
              <input
                type="text"
                className="ip-input"
                placeholder="e.g. 192.168.1.100 or localhost"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
              />
              <button 
                type="button" 
                className="btn-test" 
                onClick={handleTestConnection}
                disabled={testing}
              >
                {testing ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
            <small className="help-text">
              Enter the LAN IP of the Admin PC hosting the MySQL database (default: localhost on Admin PC, or 192.168.x.x on client devices).
            </small>
          </div>

          {notice && (
            <div className="notice-box">
              {notice}
            </div>
          )}

          {/* Offline Sync Action Card */}
          <div className="sync-info-box">
            <div className="sync-box-header">
              <Database size={18} />
              <span>Offline Local Storage Queue</span>
            </div>
            <p>
              Pending offline mutations: <strong>{statusState.pendingCount} item(s)</strong>
            </p>
            {statusState.lastSyncTime && (
              <small className="last-sync">Last successful sync: {statusState.lastSyncTime}</small>
            )}
            <button 
              type="button" 
              className="btn-sync-now" 
              onClick={handleManualSync}
              disabled={syncing || statusState.pendingCount === 0 || statusState.status === 'OFFLINE'}
            >
              <RefreshCw size={16} className={syncing ? 'spin' : ''} />
              {syncing ? 'Syncing to MySQL...' : 'Sync Offline Data Now'}
            </button>
          </div>
        </div>

        <div className="server-modal-footer">
          <button className="btn-close-modal" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
