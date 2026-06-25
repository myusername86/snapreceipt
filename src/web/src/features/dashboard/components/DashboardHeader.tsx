import { ReceiptText } from 'lucide-react';
import type { ReactNode } from 'react';
import { SignOutButton } from '../../auth/SignOutButton';

type DashboardHeaderProps = { actions?: ReactNode };

export function DashboardHeader({ actions }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between pt-6">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand">
          <ReceiptText className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-semibold">SnapReceipt</span>
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <SignOutButton />
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-sm font-medium">
          U
        </div>
      </div>
    </header>
  );
}
