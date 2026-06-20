import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { useAddReceipt } from '../useAddReceipt';

type AddReceiptFormProps = { onClose: () => void };

const today = () => new Date().toISOString().slice(0, 10);

export function AddReceiptForm({ onClose }: AddReceiptFormProps) {
  const [merchant, setMerchant] = useState('');
  const [total, setTotal] = useState('');
  const [currency, setCurrency] = useState('SEK');
  const [purchasedOn, setPurchasedOn] = useState(today());

  const addReceipt = useAddReceipt();
  const canSubmit = merchant.trim() !== '' && Number(total) > 0;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    addReceipt.mutate(
      { merchant: merchant.trim(), total: Number(total), currency, purchasedOn },
      { onSuccess: onClose },
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-surface p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add receipt</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-xs text-muted">Merchant</label>
            <input
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="ICA Maxi"
              className="mt-1 w-full rounded-xl bg-surface-2 px-3 py-2 text-sm outline-none placeholder:text-muted focus:ring-2 focus:ring-brand"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-muted">Total</label>
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
              <label className="text-xs text-muted">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="mt-1 w-full rounded-xl bg-surface-2 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="SEK">SEK</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted">Date</label>
            <input
              type="date"
              value={purchasedOn}
              onChange={(e) => setPurchasedOn(e.target.value)}
              className="mt-1 w-full rounded-xl bg-surface-2 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          {addReceipt.isError && (
            <p className="text-sm text-red-400">Couldn’t save. Try again.</p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || addReceipt.isPending}
            className="mt-2 w-full rounded-xl bg-brand py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {addReceipt.isPending ? 'Saving…' : 'Save receipt'}
          </button>
        </form>
      </div>
    </div>
  );
}