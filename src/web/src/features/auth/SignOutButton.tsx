import { useMsal } from '@azure/msal-react';
import { LogOut } from 'lucide-react';

export function SignOutButton() {
  const { instance } = useMsal();

  function handleSignOut() {
    instance.logoutRedirect().catch((e) => console.error(e));
  }

  return (
    <button
      onClick={handleSignOut}
      aria-label="Sign out"
      className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-muted hover:text-ink"
    >
      <LogOut className="h-4 w-4" />
    </button>
  );
}