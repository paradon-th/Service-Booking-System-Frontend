"use client";

import { useState } from "react";
import { toast } from "sonner";

type SamlProviderConfig = {
  [key: string]: {
    apiBaseUrl: string;
    relayState?: string;
  };
};

const samlProviders: SamlProviderConfig = {
  microsoft: {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE || "",
    relayState: "serviceMainId=2",
  },
};

export function useSamlLogin() {
  const [isSAML2Authloading, setIsSAML2Authloading] = useState(false);

  const SAML2Login = (provider: keyof typeof samlProviders) => {
    const config = samlProviders[provider];
    if (!config) {
      const errorMessage = `SAML provider "${provider}" not configured.`;
      console.error(errorMessage);
      toast.error(errorMessage);
      return;
    }

    setIsSAML2Authloading(true);
    console.log(`Sign in with ${provider}`);

    const queryString = new URLSearchParams();
    if (config.relayState) {
      queryString.append("relayState", config.relayState);
    }

    const redirectUrl = `${config.apiBaseUrl}/api/auth/sso/saml2/v1/login?${queryString.toString()}`;
    
    window.location.href = redirectUrl;
  };

  return { SAML2Login, isSAML2Authloading };
}
