import {
  PublicClientApplication,
  LogLevel,
  type Configuration,
} from '@azure/msal-browser';

// Your external tenant + app registration values
const CLIENT_ID = '89a707f8-048f-4d18-911b-4cb5863b7a4c';
const TENANT_SUBDOMAIN = 'snapreceip'; // from snapreceip.onmicrosoft.com

// External tenant authority uses ciamlogin.com
const TENANT_ID = '5f82d64e-2034-476c-bffe-0bb9be852eaa';
const AUTHORITY = `https://${TENANT_SUBDOMAIN}.ciamlogin.com/${TENANT_ID}`;
export const msalConfig: Configuration = {
  auth: {
    clientId: CLIENT_ID,
    authority: AUTHORITY,
    knownAuthorities: [`${TENANT_SUBDOMAIN}.ciamlogin.com`],
    redirectUri: window.location.origin, // matches your registered SPA URIs
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message) => {
        if (level === LogLevel.Error) console.error(message);
      },
      logLevel: LogLevel.Warning,
    },
  },
};

// The API scope you exposed — asks for an access token your .NET API will accept
export const apiScopes = [
  'api://89a707f8-048f-4d18-911b-4cb5863b7a4c/access_as_user',
];

// Scopes requested at login (identity + the API scope)
export const loginRequest = {
  scopes: ['openid', 'profile', ...apiScopes],
};

// One MSAL instance for the whole app
export const msalInstance = new PublicClientApplication(msalConfig);