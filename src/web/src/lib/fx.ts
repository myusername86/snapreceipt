// Converts a foreign amount to SEK using the European Central Bank rate on a
// given date (free Frankfurter API, no key). Past rates are fixed, so the same
// date always yields the same result.
type FrankfurterResponse = {
  base: string;
  date: string;
  rates: Record<string, number>;
};

export async function fetchSekRate(currency: string, date: string): Promise<number> {
  if (currency === 'SEK') return 1;

  const res = await fetch(`https://api.frankfurter.dev/v1/${date}`);
  if (!res.ok) throw new Error(`FX lookup failed (${res.status})`);

  const data = (await res.json()) as FrankfurterResponse;
  const sekPerEur = data.rates?.SEK;
  const currencyPerEur = data.rates?.[currency];

  if (typeof sekPerEur !== 'number' || typeof currencyPerEur !== 'number') {
    throw new Error(`No rate for ${currency} on ${date}`);
  }

  // rates are EUR-based; cross-convert to SEK per 1 unit of `currency`
  return sekPerEur / currencyPerEur;
}