import { useQuery } from '@tanstack/react-query';
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

  const ratesQuery = useQuery({
    queryKey: ['fx-rates', [...pairs].sort().join(',')],
    enabled: pairs.length > 0,
    staleTime: Infinity, // historical rates never change
    retry: 1,
    queryFn: async () => {
      const entries = await Promise.all(
        pairs.map(async (pair) => {
          const [currency, date] = pair.split('|');
          try {
            const rate = await fetchSekRate(currency, date);
            return [pair, rate] as const;
          } catch {
            return [pair, null] as const; // one failure won't block the rest
          }
        }),
      );
      return new Map(entries);
    },
  });

  const rates = ratesQuery.data;

  const converted: Receipt[] = receipts.map((r) => {
    if (r.currency === 'SEK') return { ...r, totalSek: r.total };
    const rate = rates?.get(`${r.currency}|${r.purchasedOn}`);
    return { ...r, totalSek: rate != null ? r.total * rate : undefined };
  });

  return {
    receipts: converted,
    isConverting: ratesQuery.isLoading && pairs.length > 0,
  };
}