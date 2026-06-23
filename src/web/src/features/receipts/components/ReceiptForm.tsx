import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import type { Receipt } from '../../../api/types';
import { useAddReceipt } from '../useAddReceipt';
import { useUpdateReceipt } from '../useUpdateReceipt';

type InitialValues = {
  merchant?: string;
  total?: number;
  currency?: string;
  purchasedOn?: string;
};

type ReceiptFormProps = {
  receipt?: Receipt;
  initialValues?: InitialValues;
  onClose: () => void;
};

const today = () => new Date().toISOString().slice(0, 10);

export function ReceiptForm({ receipt, initialValues, onClose }: ReceiptFormProps) {
  const { t } = useTranslation();
  const isEdit = receipt !== undefined;
  const isScanned = !isEdit && initialValues !== undefined;

  const [merchant, setMerchant] = useState(receipt?.merchant ?? initialValues?.merchant ?? '');
  const [total, setTotal] = useState(
    receipt
      ? String(receipt.total)
      : initialValues?.total != null
        ? String(initialValues.total)
        : '',
  );
  const [currency, setCurrency] = useState(receipt?.currency ?? initialValues?.currency ?? 'SEK');
  const [purchasedOn, setPurchasedOn] = useState(receipt?.purchasedOn ?? initialValues?.purchasedOn ?? today());

  const addReceipt = useAddReceipt();
  const updateReceipt = useUpdateReceipt();
  const mutation = isEdit ? updateReceipt : addReceipt;

  const canSubmit = merchant.trim() !== '' && Number(total) > 0;
  const title = isEdit ? t('edit_receipt') : isScanned ? t('review_receipt') : t('add_receipt');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    const values = { merchant: merchant.trim(), total: Number(total), currency, purchasedOn };
    if (receipt) {
      updateReceipt.mutate({ id: receipt.id, ...values }, { onSuccess: onClose });
    } else {
      addReceipt.mutate(values, { onSuccess: onClose });
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
      onClick={onClose}
    >
      <div className="w-full max-w-md rounded-2xl bg-surface p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isScanned && <p className="mt-2 text-xs text-muted">{t('scan_hint')}</p>}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-xs text-muted">{t('merchant')}</label>
            <input
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="ICA Maxi"
              className="mt-1 w-full rounded-xl bg-surface-2 px-3 py-2 text-sm outline-none placeholder:text-muted focus:ring-2 focus:ring-brand"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-muted">{t('total')}</label>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                placeholder="0.00"
                className="mt-1 w-full rounded-xl bg-surface-2 px-3 py-2 text-sm outline-none placeholder:text-muted focus:ring-2 focus:ring-brand"
              />
            </div>
            <div className="w-24">
              <label className="text-xs text-muted">{t('currency')}</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="mt-1 w-full rounded-xl bg-surface-2 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="SEK">SEK</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
                <option value="NOK">NOK</option>
                <option value="DKK">DKK</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted">{t('date')}</label>
            <input
              type="date"
              value={purchasedOn}
              onChange={(e) => setPurchasedOn(e.target.value)}
              className="mt-1 w-full rounded-xl bg-surface-2 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          {mutation.isError && <p className="text-sm text-red-400">{t('save_error')}</p>}

          <button
            type="submit"
            disabled={!canSubmit || mutation.isPending}
            className="mt-2 w-full rounded-xl bg-brand py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {mutation.isPending ? t('saving') : isEdit ? t('update_receipt') : t('save_receipt')}
          </button>
        </form>
      </div>
    </div>
  );
}