/**
 * main.tsx - Application Entry Point with MSAL Provider
 *
 * This is where we initialize MSAL and wrap the entire app with:
 * 1. MsalProvider — Makes MSAL available to all components via React Context
 * 2. BrowserRouter — Enables client-side routing with React Router
 *
 * The initialization order matters:
 * 1. Create the MSAL PublicClientApplication instance
 * 2. Call initialize() to set up MSAL (required before any auth operations)
 * 3. Handle any redirect promises (for redirect-based login flows)
 * 4. Set the active account (so MSAL knows which account to use by default)
 * 5. Render the app wrapped in MsalProvider
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
  PublicClientApplication,
  EventType,
  type AuthenticationResult,
  type EventMessage,
} from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./auth/authConfig";
import App from "./App";
import "./index.css";

/**
 * PublicClientApplication (PCA) - The core MSAL class for SPAs
 *
 * This is the main entry point for all MSAL operations. It handles:
 * - Token caching (in sessionStorage or localStorage, as configured)
 * - Token acquisition (silent, popup, or redirect)
 * - Account management (which users are signed in)
 * - Login/logout flows
 *
 * "PublicClient" means this app runs in a browser and cannot keep secrets.
 * This is in contrast to "ConfidentialClient" used by backend servers
 * that can securely store client secrets or certificates.
 */
const msalInstance = new PublicClientApplication(msalConfig);

/**
 * Initialize MSAL and set up the active account
 *
 * Why async initialization?
 * - MSAL needs to check the cache for existing accounts
 * - If the user was redirected back from Entra ID login, MSAL needs to
 *   process the authentication response from the URL hash/query params
 * - These operations may be asynchronous depending on the cache location
 */
async function initializeMsal() {
  // Initialize the MSAL instance — must be called before any other MSAL operations
  await msalInstance.initialize();

  /**
   * handleRedirectPromise - Process the response from redirect-based login
   *
   * If the user logged in via redirect (instead of popup), when they return
   * to your app, the authentication response is in the URL. This method
   * extracts and processes that response.
   *
   * Returns null if there's no redirect response to process (e.g., normal page load).
   */
  await msalInstance.handleRedirectPromise();

  /**
   * Set the active account
   *
   * MSAL can track multiple accounts, but your app usually works with one.
   * Setting an "active account" tells MSAL which account to use by default
   * for token acquisition, so you don't have to specify it every time.
   *
   * Priority: Use the first account found in MSAL's cache.
   */
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
  }

  /**
   * Event callback - Listen for MSAL authentication events
   *
   * MSAL fires events for various auth operations (login, logout, token acquisition).
   * Here we listen for LOGIN_SUCCESS to automatically set the active account
   * when a user signs in.
   *
   * This is important because after a popup login completes, the new account
   * might not be automatically set as active.
   */
  msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const payload = event.payload as AuthenticationResult;
      // Set the newly logged-in account as the active account
      msalInstance.setActiveAccount(payload.account);
    }
  });
}

// Initialize MSAL, then render the app
initializeMsal().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      {/*
        MsalProvider - React Context Provider for MSAL
        
        Wrapping your app with MsalProvider makes all MSAL React hooks
        and components available throughout your component tree:
        - useMsal() — access the MSAL instance and accounts
        - useIsAuthenticated() — check if user is signed in
        - <AuthenticatedTemplate> — render only when authenticated
        - <UnauthenticatedTemplate> — render only when not authenticated
        
        The `instance` prop must be a fully initialized PublicClientApplication.
      */}
      <MsalProvider instance={msalInstance}>
        {/*
          BrowserRouter enables client-side routing.
          It must be inside MsalProvider so route components can use MSAL hooks.
        */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MsalProvider>
    </StrictMode>
  );
});
