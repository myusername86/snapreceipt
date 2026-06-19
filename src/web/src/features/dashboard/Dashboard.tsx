import { useMemo } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { Greeting } from './components/Greeting';
import { SummaryCards } from './components/SummaryCards';
import { RecentReceipts } from '../receipts/components/RecentReceipts';
import { useReceipts } from '../receipts/useReceipts';
import { deriveStats } from '../../lib/stats';

export function Dashboard() {
  const { data: receipts, isLoading, isError } = useReceipts();
  const stats = useMemo(() => deriveStats(receipts ?? []), [receipts]);

  return (
    <div className="min-h-screen bg-base text-ink">
      <div className="mx-auto max-w-md px-5 pb-10">
        <DashboardHeader />
        <Greeting name="Uvarani" />
        {isLoading && <p className="mt-6 text-sm text-muted">Loading…</p>}
        {isError && <p className="mt-6 text-sm text-red-400">Couldn’t load receipts.</p>}
        {!isLoading && !isError && (
          <>
            <SummaryCards stats={stats} />
            <RecentReceipts receipts={receipts ?? []} />
          </>
        )}
      </div>
    </div>
  );
}