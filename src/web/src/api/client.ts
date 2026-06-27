import type { Receipt } from './types';
import { getAccessToken } from './getToken';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL ?? ''}/api`;

/** fetch wrapper that attaches the Entra access token to every API call. */
async function authedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken();
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  return fetch(`${BASE_URL}${path}`, { ...init, headers });
}

async function getJson<T>(path: string): Promise<T> {
  const response = await authedFetch(path);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as T;
}

export const receiptsApi = {
  list: () => getJson<Receipt[]>('/receipts'),

  create: async (body: {
    merchant: string;
    total: number;
    currency: string;
    purchasedOn: string;
  }): Promise<Receipt> => {
    const response = await authedFetch('/receipts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Create failed: ${response.status}`);
    return (await response.json()) as Receipt;
  },

  update: async (
    id: string,
    body: { merchant: string; total: number; currency: string; purchasedOn: string },
  ): Promise<Receipt> => {
    const response = await authedFetch(`/receipts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Update failed: ${response.status}`);
    return (await response.json()) as Receipt;
  },

  remove: async (id: string): Promise<void> => {
    const response = await authedFetch(`/receipts/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Delete failed: ${response.status}`);
  },

  claimOrphans: async (): Promise<{ claimed: number }> => {
    const response = await authedFetch('/receipts/claim-orphans', { method: 'POST' });
    if (!response.ok) throw new Error(`Claim failed: ${response.status}`);
    return (await response.json()) as { claimed: number };
  },
};