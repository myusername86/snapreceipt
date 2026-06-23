import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Plus } from 'lucide-react';
import { DashboardHeader } from './components/DashboardHeader';
import { Greeting } from './components/Greeting';
import { SummaryCards } from './components/SummaryCards';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { Toast } from '../receipts/components/Toast';
import { RecentReceipts } from '../receipts/components/RecentReceipts';
import { ReceiptForm } from '../receipts/components/ReceiptForm';
import { useReceipts } from '../receipts/useReceipts';
import { useReceiptsInSek } from '../receipts/useReceiptsInSek';
import { useDeleteWithUndo } from '../receipts/useDeleteWithUndo';
import { useScanReceipt, type ScannedReceipt } from '../receipts/useScanReceipt';
import { deriveStats } from '../../lib/stats';
import type { Receipt } from '../../api/types';

export function Dashboard() {
  const { t } = useTranslation();
  const { data: receipts, isLoading, isError } = useReceipts();
  const { receipts: receiptsSek, isConverting } = useReceiptsInSek(receipts ?? []);
  const stats = useMemo(() => deriveStats(receiptsSek), [receiptsSek]);

  const { pending, requestDelete, undo } = useDeleteWithUndo();
  const { scan, isScanning, error: scanError } = useScanReceipt();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState<Receipt | undefined>(undefined);
  const [scannedValues, setScannedValues] = useState<ScannedReceipt | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function openAdd() {
    setEditingReceipt(undefined);
    setScannedValues(undefined);
    setIsFormOpen(true);
  }
  function openEdit(receipt: Receipt) {
    setEditingReceipt(receipt);
    setScannedValues(undefined);
    setIsFormOpen(true);
  }
  function closeForm() {
    setIsFormOpen(false);
    setEditingReceipt(undefined);
    setScannedValues(undefined);
  }
  function handleDelete(id: string) {
    const receipt = receiptsSek.find((r) => r.id === id);
    if (receipt) requestDelete(receipt);
  }
  function handleScanClick() {
    fileInputRef.current?.click();
  }
  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const result = await scan(file);
    if (result) {
      setEditingReceipt(undefined);
      setScannedValues(result);
      setIsFormOpen(true);
    }
  }

  return (
    <div className="min-h-screen bg-base text-ink">
      <div className="mx-auto max-w-md px-5 pb-10">
        <div className="flex items-center justify-between pt-4">
          <DashboardHeader />
          <LanguageSwitcher />
        </div>
        <Greeting name="Uvarani" />
        {isLoading && <p className="mt-6 text-sm text-muted">{t('loading')}</p>}
        {isError && <p className="mt-6 text-sm text-red-400">{t('load_error')}</p>}
        {!isLoading && !isError && (
          <>
            <SummaryCards stats={stats} />
            {isConverting && (
              <p className="mt-2 text-xs text-muted">{t('converting')}</p>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleScanClick}
                disabled={isScanning}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                <Camera className="h-4 w-4" />
                {isScanning ? t('reading') : t('scan_receipt')}
              </button>
              <button
                onClick={openAdd}
                className="flex items-center justify-center gap-2 rounded-xl bg-surface-2 px-4 py-2.5 text-sm font-semibold text-ink"
              >
                <Plus className="h-4 w-4" />
                {t('add')}
              </button>
            </div>

            {scanError && <p className="mt-2 text-sm text-red-400">{t('scan_error')}</p>}

            <RecentReceipts
              receipts={receiptsSek}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          </>
        )}
      </div>
      {isFormOpen && (
        <ReceiptForm
          receipt={editingReceipt}
          initialValues={scannedValues}
          onClose={closeForm}
        />
      )}
      {pending && (
        <Toast
          message={t('deleted', { merchant: pending.merchant })}
          actionLabel={t('undo')}
          onAction={undo}
        />
      )}
    </div>
  );
}