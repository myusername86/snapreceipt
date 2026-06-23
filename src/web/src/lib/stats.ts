import type { Receipt } from '../api/types';

export type ReceiptStats = {
  total: number;
  count: number;
  average: number;
  largest: number;
};

function sek(r: Receipt): number {
  return r.totalSek ?? r.total;
}

export function deriveStats(receipts: Receipt[]): ReceiptStats {
  const count = receipts.length;
  const total = receipts.reduce((sum, r) => sum + sek(r), 0);
  const average = count === 0 ? 0 : total / count;
  const largest = count === 0 ? 0 : Math.max(...receipts.map(sek));
  return { total, count, average, largest };
}

export type MerchantSpend = { name: string; value: number };

export function spendingByMerchant(receipts: Receipt[]): MerchantSpend[] {
  const map = new Map<string, number>();
  for (const r of receipts) {
    map.set(r.merchant, (map.get(r.merchant) ?? 0) + sek(r));
  }
  return Array.from(map, ([name, value]) => ({ name, value })).sort(
    (a, b) => b.value - a.value,
  );
}