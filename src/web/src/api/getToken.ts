import { msalInstance, apiScopes } from '../authConfig';

/**
 * Gets an access token for the SnapReceipt API, silently if possible.
 * Falls back to an interactive popup if silent acquisition fails.
 */
export async function getAccessToken(): Promise<string> {
  const account = msalInstance.getActiveAccount() ?? msalInstance.getAllAccounts()[0];
  if (!account) {
    throw new Error('No signed-in account');
  }

  try {
    const result = await msalInstance.acquireTokenSilent({
      scopes: apiScopes,
      account,
    });
    return result.accessToken;
  } catch {
    // Silent failed (e.g. consent/expiry) — fall back to interactive.
    const result = await msalInstance.acquireTokenPopup({ scopes: apiScopes });
    return result.accessToken;
  }
}