import { useTranslation } from 'react-i18next';
import type { Receipt } from '../../../api/types';
import { ReceiptRow } from './ReceiptRow';

type RecentReceiptsProps = {
  receipts: Receipt[];
  onEdit: (receipt: Receipt) => void;
  onDelete: (id: string) => void;
};

export function RecentReceipts({ receipts, onEdit, onDelete }: RecentReceiptsProps) {
  const { t } = useTranslation();
  const sorted = [...receipts].sort((a, b) =>
    b.purchasedOn.localeCompare(a.purchasedOn),
  );

  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold text-muted">{t('recent_receipts')}</h2>
      <div className="mt-2 divide-y divide-white/5 rounded-2xl bg-surface px-4">
        {sorted.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">{t('no_receipts')}</p>
        ) : (
          sorted.map((receipt) => (
            <ReceiptRow key={receipt.id} receipt={receipt} onEdit={onEdit} onDelete={onDelete} />
          ))
        )}
      </div>
    </section>
  );
}