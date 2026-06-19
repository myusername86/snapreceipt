import type { Receipt } from '../../../api/types';
import { ReceiptRow } from './ReceiptRow';

type RecentReceiptsProps = { receipts: Receipt[] };

export function RecentReceipts({ receipts }: RecentReceiptsProps) {
  const sorted = [...receipts].sort((a, b) =>
    b.purchasedOn.localeCompare(a.purchasedOn),
  );

  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold text-muted">Recent receipts</h2>
      <div className="mt-2 divide-y divide-white/5 rounded-2xl bg-surface px-4">
        {sorted.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">No receipts yet.</p>
        ) : (
          sorted.map((receipt) => <ReceiptRow key={receipt.id} receipt={receipt} />)
        )}
      </div>
    </section>
  );
}