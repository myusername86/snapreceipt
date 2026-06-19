import type { Receipt } from '../../../api/types';
import { formatSEK, formatDate } from '../../../lib/format';

type ReceiptRowProps = { receipt: Receipt };

export function ReceiptRow({ receipt }: ReceiptRowProps) {
  const initial = receipt.merchant.charAt(0).toUpperCase();

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-sm font-semibold text-muted">
          {initial}
        </div>
        <div>
          <p className="text-sm font-medium">{receipt.merchant}</p>
          <p className="text-xs text-muted">{formatDate(receipt.purchasedOn)}</p>
        </div>
      </div>
      <p className="text-sm font-semibold">{formatSEK(receipt.total)}</p>
    </div>
  );
}