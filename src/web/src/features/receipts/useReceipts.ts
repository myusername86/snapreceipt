import { useQuery } from '@tanstack/react-query';
import type { Receipt } from '../../api/types';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL ?? ''}/api`;

async function fetchReceipts(): Promise<Receipt[]> {
  const response = await fetch(`${BASE_URL}/receipts`);
  if (!response.ok) {
    throw new Error('Failed to load receipts');
  }
  return response.json();
}

export function useReceipts() {
  return useQuery({ queryKey: ['receipts'], queryFn: fetchReceipts });
}