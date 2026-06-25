import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { Dashboard } from './features/dashboard/Dashboard';
import { SignIn } from './features/auth/SignIn';

export function App() {
  return (
    <>
      <AuthenticatedTemplate>
        <Dashboard />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <SignIn />
      </UnauthenticatedTemplate>
    </>
  );
}