import type { Receipt } from '../api/types';

export type ReceiptStats = {
  total: number;
  count: number;
  average: number;
  largest: number;
};

export function deriveStats(receipts: Receipt[]): ReceiptStats {
  const count = receipts.length;
  const total = receipts.reduce((sum, r) => sum + r.total, 0);
  const average = count === 0 ? 0 : total / count;
  const largest = count === 0 ? 0 : Math.max(...receipts.map((r) => r.total));
  return { total, count, average, largest };
}