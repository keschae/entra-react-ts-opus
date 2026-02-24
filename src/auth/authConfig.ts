/**
 * authConfig.ts - Microsoft Entra ID (Azure AD) Configuration
 *
 * This file contains all the configuration needed to connect your React app
 * to Microsoft Entra ID for authentication. You'll need to register your app
 * in the Azure Portal (https://portal.azure.com) under "App registrations"
 * to obtain the values below.
 *
 * SETUP STEPS:
 * 1. Go to Azure Portal → Microsoft Entra ID → App registrations → New registration
 * 2. Name your app, set "Single-page application (SPA)" as the redirect URI type
 * 3. Set the redirect URI to http://localhost:5173 (Vite's default dev port)
 * 4. Copy the "Application (client) ID" and "Directory (tenant) ID" from the Overview page
 * 5. Replace the placeholder values below with your actual IDs
 */

import { type Configuration, LogLevel } from "@azure/msal-browser";

/**
 * MSAL Configuration Object
 *
 * This is the main configuration that tells MSAL (Microsoft Authentication Library)
 * how to connect to your Entra ID tenant and handle authentication.
 *
 * Key concepts:
 * - clientId: Your app's unique identifier in Entra ID (also called "Application ID")
 * - authority: The Entra ID endpoint that handles authentication for your tenant
 * - redirectUri: Where Entra ID sends the user back after login
 */
export const msalConfig: Configuration = {
  auth: {
    // Replace with your app's Application (client) ID from Azure Portal
    clientId: "YOUR_CLIENT_ID_HERE",

    /**
     * Authority URL format: https://login.microsoftonline.com/{tenantId}
     *
     * Common authority options:
     * - "https://login.microsoftonline.com/{your-tenant-id}" → Single tenant (your org only)
     * - "https://login.microsoftonline.com/common"           → Multi-tenant + personal accounts
     * - "https://login.microsoftonline.com/organizations"    → Any Entra ID tenant (work/school)
     * - "https://login.microsoftonline.com/consumers"        → Personal Microsoft accounts only
     */
    authority: "https://login.microsoftonline.com/YOUR_TENANT_ID_HERE",

    // The URL where Entra ID will redirect after authentication
    // Must match a redirect URI registered in your Azure app registration
    redirectUri: "http://localhost:5173",

    // Where to redirect after logout (optional, defaults to redirectUri)
    postLogoutRedirectUri: "http://localhost:5173",

    /**
     * navigateToLoginRequestUrl:
     * If true, MSAL will return the user to the page they were on before being
     * redirected to login. Set to false if you want to always land on a specific page.
     */
    navigateToLoginRequestUrl: true,
  },
  cache: {
    /**
     * cacheLocation: Where MSAL stores authentication tokens
     *
     * Options:
     * - "sessionStorage" → Tokens cleared when browser tab closes (more secure)
     * - "localStorage"   → Tokens persist across browser sessions (more convenient)
     *
     * For learning/development, sessionStorage is recommended for security.
     */
    cacheLocation: "sessionStorage",

    /**
     * storeAuthStateInCookie:
     * Set to true if you encounter issues with IE11/Edge or when using iframes.
     * Cookies can help with cross-site request scenarios.
     */
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      /**
       * MSAL Logger - Useful for debugging authentication issues.
       * In production, you'd want to reduce the log level or disable logging.
       */
      loggerCallback: (level, message, containsPii) => {
        // Never log Personally Identifiable Information (PII) in production
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
      // Log level controls how verbose the MSAL logs are
      // LogLevel.Verbose for debugging, LogLevel.Error for production
      logLevel: LogLevel.Warning,
    },
  },
};

/**
 * loginRequest - Scopes requested during login
 *
 * Scopes define what permissions your app is requesting from the user.
 * "User.Read" is a Microsoft Graph API scope that allows reading the
 * signed-in user's profile (name, email, etc.).
 *
 * Common scopes:
 * - "User.Read"         → Read user profile
 * - "User.ReadWrite"    → Read and update user profile
 * - "Mail.Read"         → Read user's email
 * - "openid"            → Required for OpenID Connect (usually included automatically)
 * - "profile"           → Access user's basic profile info
 * - "email"             → Access user's email address
 *
 * You can add custom API scopes here if you have a backend API protected by Entra ID:
 * - "api://{your-api-client-id}/{scope-name}"
 */
export const loginRequest = {
  scopes: ["User.Read"],
};

/**
 * graphConfig - Microsoft Graph API endpoint configuration
 *
 * Microsoft Graph is the unified API for accessing Microsoft 365 data.
 * After authenticating, you can call Graph endpoints to fetch user data,
 * emails, calendar events, and more.
 *
 * Graph Explorer is a great tool for testing queries:
 * https://developer.microsoft.com/en-us/graph/graph-explorer
 */
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};
