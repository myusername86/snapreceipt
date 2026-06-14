import { useQuery } from '@tanstack/react-query';
import { receiptsApi } from './api/client';

export function App() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['receipts'],
    queryFn: receiptsApi.list,
  });

  return (
    <main>
      <h1>SnapReceipt</h1>
      {isPending && <p>Loading receipts…</p>}
      {isError && <p>Couldn’t load receipts. Is the API running?</p>}
      <ul>
        {data?.map((r) => (
          <li key={r.id}>
            {r.merchant} — {r.total} {r.currency}
          </li>
        ))}
      </ul>
    </main>
  );
}