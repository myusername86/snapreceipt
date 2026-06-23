import { useQueries } from '@tanstack/react-query';
import type { Receipt } from '../../api/types';
import { fetchSekRate } from '../../lib/fx';

export function useReceiptsInSek(receipts: Receipt[]) {
  const pairs = Array.from(
    new Set(
      receipts
        .filter((r) => r.currency !== 'SEK')
        .map((r) => `${r.currency}|${r.purchasedOn}`),
    ),
  );

  // One query per pair so adding a new receipt only fetches that pair's rate;
  // a single combined key would invalidate all cached rates on every change.
  const results = useQueries({
    queries: pairs.map((pair) => {
      const [currency, date] = pair.split('|');
      return {
        queryKey: ['fx-rate', pair],
        staleTime: Infinity,
        retry: 2,
        queryFn: () => fetchSekRate(currency, date),
      };
    }),
  });

  const rates = new Map(pairs.map((pair, i) => [pair, results[i]?.data ?? null]));

  const converted: Receipt[] = receipts.map((r) => {
    if (r.currency === 'SEK') return { ...r, totalSek: r.total };
    const rate = rates.get(`${r.currency}|${r.purchasedOn}`);
    return { ...r, totalSek: rate != null ? r.total * rate : undefined };
  });

  return {
    receipts: converted,
    isConverting: pairs.length > 0 && results.some((r) => r.isLoading),
  };
}