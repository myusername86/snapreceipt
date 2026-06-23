import { Receipt, TrendingUp, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ReceiptStats } from '../../../lib/stats';
import { formatSEK } from '../../../lib/format';
import { StatCard } from './StatCard';

type SummaryCardsProps = { stats: ReceiptStats };

export function SummaryCards({ stats }: SummaryCardsProps) {
  const { t } = useTranslation();
  return (
    <div className="mt-6">
      <div className="rounded-2xl bg-brand p-5">
        <p className="text-sm text-white/80">{t('total_spent')}</p>
        <p className="mt-1 text-3xl font-semibold text-white">{formatSEK(stats.total)}</p>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <StatCard label={t('receipts')} value={String(stats.count)} icon={<Receipt className="h-5 w-5" />} />
        <StatCard label={t('average')} value={formatSEK(stats.average)} icon={<Wallet className="h-5 w-5" />} />
        <StatCard label={t('largest')} value={formatSEK(stats.largest)} icon={<TrendingUp className="h-5 w-5" />} />
      </div>
    </div>
  );
}