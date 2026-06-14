import type { Receipt } from './types';

const BASE_URL = '/api';

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as T;
}

export const receiptsApi = {
  list: () => getJson<Receipt[]>('/receipts'),
};