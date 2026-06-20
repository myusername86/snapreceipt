import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { DashboardHeader } from './components/DashboardHeader';
import { Greeting } from './components/Greeting';
import { SummaryCards } from './components/SummaryCards';
import { RecentReceipts } from '../receipts/components/RecentReceipts';
import { AddReceiptForm } from '../receipts/components/AddReceiptForm';
import { useReceipts } from '../receipts/useReceipts';
import { deriveStats } from '../../lib/stats';

export function Dashboard() {
  const { data: receipts, isLoading, isError } = useReceipts();
  const stats = useMemo(() => deriveStats(receipts ?? []), [receipts]);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
            <button
              onClick={() => setIsFormOpen(true)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              Add receipt
            </button>
            <RecentReceipts receipts={receipts ?? []} />
          </>
        )}
      </div>
      {isFormOpen && <AddReceiptForm onClose={() => setIsFormOpen(false)} />}
    </div>
  );
}