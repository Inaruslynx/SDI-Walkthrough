"use client";

import * as msal from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

export default function MyMsalProvider({ children }: React.PropsWithChildren) {
  const msalConfig: msal.Configuration = {
    auth: {
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID!,
      authority: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID!}`,
      redirectUri: "/",
    },
  };

  const msalInstance = new msal.PublicClientApplication(msalConfig);
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
