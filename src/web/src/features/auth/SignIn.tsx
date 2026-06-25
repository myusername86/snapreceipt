import { useMsal } from '@azure/msal-react';
import { ReceiptText } from 'lucide-react';
import { loginRequest } from '../../authConfig';

export function SignIn() {
  const { instance } = useMsal();

  function handleSignIn() {
    instance.loginRedirect(loginRequest).catch((e) => console.error(e));
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-6 text-ink">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand">
          <ReceiptText className="h-7 w-7 text-white" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold">SnapReceipt</h1>
        <p className="mt-2 text-sm text-muted">
          Scan receipts, track spending, all in one place.
        </p>

        <button
          onClick={handleSignIn}
          className="mt-8 w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white"
        >
          Sign in
        </button>

        <p className="mt-4 text-xs text-muted">
          Sign in or create an account with your email or Google.
        </p>
      </div>
    </div>
  );
}