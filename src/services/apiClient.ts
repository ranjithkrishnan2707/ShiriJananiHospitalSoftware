// Dynamic LAN API Client for Janani Hospital Software
// Connects client devices (Doctor, Scan, Lab, Medical, Admin) to Admin PC Server

const SERVER_IP_KEY = 'sjh_server_ip';
const SERVER_PORT = 5000;

export function getServerIp(): string {
  const saved = localStorage.getItem(SERVER_IP_KEY);
  if (saved && saved.trim() !== '') {
    return saved.trim();
  }
  // Default to current hostname (or localhost)
  return window.location.hostname || 'localhost';
}

export function setServerIp(ip: string): void {
  localStorage.setItem(SERVER_IP_KEY, ip.trim());
}

export function getBaseUrl(): string {
  const ip = getServerIp();
  return `http://${ip}:${SERVER_PORT}`;
}

export interface ApiFetchOptions extends RequestInit {
  timeoutMs?: number;
}

export async function apiFetch<T = any>(endpoint: string, options: ApiFetchOptions = {}): Promise<{ data?: T; ok: boolean; offline?: boolean; error?: string }> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  const timeoutMs = options.timeoutMs || 3000;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    clearTimeout(timer);

    if (response.ok) {
      const data = await response.json();
      return { ok: true, data };
    } else {
      const errText = await response.text();
      return { ok: false, error: errText || `HTTP ${response.status}` };
    }
  } catch (err: any) {
    clearTimeout(timer);
    console.warn(`[API Client] Server unreachable at ${url} (${err.message}). Entering offline fallback.`);
    return { ok: false, offline: true, error: err.message };
  }
}
