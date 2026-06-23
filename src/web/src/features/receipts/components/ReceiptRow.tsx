import { Trash2 } from 'lucide-react';
import type { Receipt } from '../../../api/types';
import { formatSEK, formatMoney, formatDate } from '../../../lib/format';

type ReceiptRowProps = {
  receipt: Receipt;
  onEdit: (receipt: Receipt) => void;
  onDelete: (id: string) => void;
};

export function ReceiptRow({ receipt, onEdit, onDelete }: ReceiptRowProps) {
  const initial = receipt.merchant.charAt(0).toUpperCase();
  const sekValue = receipt.totalSek ?? receipt.total;
  const isForeign = receipt.currency !== 'SEK';

  return (
    <div className="flex items-center gap-2 py-3">
      <button
        onClick={() => onEdit(receipt)}
        className="flex flex-1 items-center gap-3 text-left"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-sm font-semibold text-muted">
          {initial}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{receipt.merchant}</p>
          <p className="text-xs text-muted">{formatDate(receipt.purchasedOn)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">{formatSEK(sekValue)}</p>
          {isForeign && (
            <p className="text-xs text-muted">
              {formatMoney(receipt.total, receipt.currency)}
            </p>
          )}
        </div>
      </button>
      <button
        onClick={() => onDelete(receipt.id)}
        aria-label={`Delete ${receipt.merchant}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-red-400"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}