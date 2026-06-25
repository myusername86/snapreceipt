import { useMsal } from '@azure/msal-react';

export function useCurrentUser() {
  const { accounts } = useMsal();
  const account = accounts[0];

  // MSAL puts the display name in `name`; fall back to the email/username
  const name = account?.name ?? account?.username ?? 'User';
  const initial = name.charAt(0).toUpperCase();

  return { name, initial };
}