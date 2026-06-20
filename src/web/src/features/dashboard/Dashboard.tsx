import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { DashboardHeader } from './components/DashboardHeader';
import { Greeting } from './components/Greeting';
import { SummaryCards } from './components/SummaryCards';
import { Toast } from '../receipts/components/Toast';
import { RecentReceipts } from '../receipts/components/RecentReceipts';
import { ReceiptForm } from '../receipts/components/ReceiptForm';
import { useReceipts } from '../receipts/useReceipts';
import { useDeleteWithUndo } from '../receipts/useDeleteWithUndo';
import { deriveStats } from '../../lib/stats';
import type { Receipt } from '../../api/types';

export function Dashboard() {
  const { data: receipts, isLoading, isError } = useReceipts();
  const stats = useMemo(() => deriveStats(receipts ?? []), [receipts]);
  const { pending, requestDelete, undo } = useDeleteWithUndo();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState<Receipt | undefined>(undefined);

  function openAdd() {
    setEditingReceipt(undefined);
    setIsFormOpen(true);
  }
  function openEdit(receipt: Receipt) {
    setEditingReceipt(receipt);
    setIsFormOpen(true);
  }
  function closeForm() {
    setIsFormOpen(false);
    setEditingReceipt(undefined);
  }
  function handleDelete(id: string) {
    const receipt = (receipts ?? []).find((r) => r.id === id);
    if (receipt) requestDelete(receipt);
  }

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
              onClick={openAdd}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              Add receipt
            </button>
            <RecentReceipts
              receipts={receipts ?? []}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          </>
        )}
      </div>
      {isFormOpen && <ReceiptForm receipt={editingReceipt} onClose={closeForm} />}
      {pending && (
        <Toast
          message={`Deleted "${pending.merchant}"`}
          actionLabel="Undo"
          onAction={undo}
        />
      )}
    </div>
  );
}