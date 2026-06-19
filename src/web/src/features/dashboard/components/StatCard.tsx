import type { ReactNode } from 'react';

type StatCardProps = {
  label: string;
  value: string;
  icon: ReactNode;
};

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-surface p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-muted">
        {icon}
      </div>
      <p className="mt-3 text-xs text-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}