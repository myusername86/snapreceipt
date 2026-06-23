// Converts a foreign amount to SEK using the European Central Bank rate
// (free Frankfurter API, no key). Dates on/after today use the latest
// published rate, since today's rate may not be out yet (~16:00 CET).
type FrankfurterResponse = {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
};

export async function fetchSekRate(currency: string, date: string): Promise<number> {
  if (currency === 'SEK') return 1;

  const today = new Date().toISOString().slice(0, 10);
  const when = date >= today ? 'latest' : date;

  const res = await fetch(
    `https://api.frankfurter.dev/v1/${when}?base=${currency}&symbols=SEK`,
  );
  if (!res.ok) throw new Error(`FX lookup failed (${res.status})`);

  const data = (await res.json()) as FrankfurterResponse;
  const rate = data.rates?.SEK;
  if (typeof rate !== 'number') throw new Error(`No SEK rate for ${currency}`);

  return rate; // SEK per 1 unit of `currency`
}