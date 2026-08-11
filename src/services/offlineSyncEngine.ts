// Offline Local Storage & Auto-Sync Engine for Janani Hospital Software
// Handles offline queuing when Admin PC is OFF, and auto-syncing when Admin PC turns ON

import { apiFetch } from './apiClient';

export interface OfflineQueueItem {
  id: string;
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE';
  payload: any;
  timestamp: string;
}

export type NetworkStatus = 'ONLINE' | 'OFFLINE' | 'SYNCING';

export interface SyncEngineStatus {
  status: NetworkStatus;
  pendingCount: number;
  lastSyncTime?: string;
  lastError?: string;
}

const QUEUE_STORAGE_KEY = 'sjh_offline_queue';
const LISTENERS: Array<(status: SyncEngineStatus) => void> = [];

let currentStatus: NetworkStatus = 'OFFLINE';
let isSyncing = false;
let pingIntervalTimer: any = null;

// --- Queue Management ---
export function getOfflineQueue(): OfflineQueueItem[] {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading offline queue from localStorage:', err);
    return [];
  }
}

function saveOfflineQueue(queue: OfflineQueueItem[]): void {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    notifyListeners();
  } catch (err) {
    console.error('Error saving offline queue to localStorage:', err);
  }
}

export function queueMutation(endpoint: string, method: 'POST' | 'PUT' | 'DELETE', payload: any): OfflineQueueItem {
  const item: OfflineQueueItem = {
    id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    endpoint,
    method,
    payload,
    timestamp: new Date().toISOString()
  };

  const queue = getOfflineQueue();
  queue.push(item);
  saveOfflineQueue(queue);
  console.log(`📌 Saved offline mutation (${method} ${endpoint}). Total pending: ${queue.length}`);
  return item;
}

export function clearOfflineQueue(): void {
  saveOfflineQueue([]);
}

// --- Health Checking & Auto-Sync ---
export async function checkServerHealth(): Promise<boolean> {
  const result = await apiFetch('/api/health', { timeoutMs: 2000 });
  const isOnline = result.ok && !result.offline;

  const previousStatus = currentStatus;
  currentStatus = isOnline ? (isSyncing ? 'SYNCING' : 'ONLINE') : 'OFFLINE';

  if (previousStatus !== currentStatus) {
    notifyListeners();
  }

  // If server just came back online and queue has items, trigger auto-sync!
  if (isOnline && getOfflineQueue().length > 0 && !isSyncing) {
    syncOfflineData();
  }

  return isOnline;
}

export async function syncOfflineData(): Promise<{ success: boolean; syncedCount: number; error?: string }> {
  const queue = getOfflineQueue();
  if (queue.length === 0) {
    return { success: true, syncedCount: 0 };
  }

  isSyncing = true;
  currentStatus = 'SYNCING';
  notifyListeners();

  try {
    const result = await apiFetch('/api/sync/batch', {
      method: 'POST',
      body: JSON.stringify({ items: queue }),
      timeoutMs: 15000
    });

    if (result.ok && result.data && result.data.success) {
      const syncedCount = result.data.syncedCount || queue.length;
      saveOfflineQueue([]); // Clear queue upon successful batch sync
      isSyncing = false;
      currentStatus = 'ONLINE';
      
      const syncTime = new Date().toLocaleTimeString();
      localStorage.setItem('sjh_last_sync_time', syncTime);
      notifyListeners();

      // Dispatch event to refresh active React contexts with fresh database data
      window.dispatchEvent(new CustomEvent('sjh_data_synced', { detail: { syncedCount } }));
      
      console.log(`🎉 Auto-Sync Success: Pushed ${syncedCount} offline records to MySQL Server.`);
      return { success: true, syncedCount };
    } else {
      isSyncing = false;
      currentStatus = 'ONLINE';
      notifyListeners();
      return { success: false, syncedCount: 0, error: result.error || 'Sync endpoint rejected batch' };
    }
  } catch (err: any) {
    isSyncing = false;
    currentStatus = 'OFFLINE';
    notifyListeners();
    return { success: false, syncedCount: 0, error: err.message };
  }
}

// --- Subscription Engine ---
export function getSyncEngineStatus(): SyncEngineStatus {
  return {
    status: currentStatus,
    pendingCount: getOfflineQueue().length,
    lastSyncTime: localStorage.getItem('sjh_last_sync_time') || undefined
  };
}

export function subscribeSyncStatus(listener: (status: SyncEngineStatus) => void): () => void {
  LISTENERS.push(listener);
  listener(getSyncEngineStatus());
  return () => {
    const idx = LISTENERS.indexOf(listener);
    if (idx >= 0) LISTENERS.splice(idx, 1);
  };
}

function notifyListeners(): void {
  const state = getSyncEngineStatus();
  LISTENERS.forEach((fn) => fn(state));
}

// --- Initialization ---
export function startOfflineSyncEngine(): void {
  if (pingIntervalTimer) return;
  
  // Initial health check
  checkServerHealth();

  // Periodic health check every 5 seconds
  pingIntervalTimer = setInterval(() => {
    checkServerHealth();
  }, 5000);
}
