type ToastProps = {
  message: string;
  actionLabel: string;
  onAction: () => void;
};

export function Toast({ message, actionLabel, onAction }: ToastProps) {
  return (
    <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <div className="flex w-full max-w-md items-center justify-between gap-4 rounded-xl bg-surface-2 px-4 py-3 shadow-lg">
        <span className="text-sm text-ink">{message}</span>
        <button onClick={onAction} className="text-sm font-semibold text-brand">
          {actionLabel}
        </button>
      </div>
    </div>
  );
}