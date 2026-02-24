/**
 * Navbar.tsx - Navigation Bar with Authentication Controls
 *
 * This component demonstrates how to:
 * 1. Use MSAL React hooks to check authentication state
 * 2. Trigger login via popup or redirect
 * 3. Trigger logout
 * 4. Display different navigation links based on auth state
 *
 * MSAL React provides two login methods:
 * - Popup: Opens a popup window for login (better UX, stays on same page)
 * - Redirect: Redirects the entire page to Entra ID login page (simpler, no popup blockers)
 */

import { Link } from "react-router-dom";
import {
  useIsAuthenticated,
  useMsal,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { loginRequest } from "../auth/authConfig";

export function Navbar() {
  /**
   * useMsal() hook - The primary hook for interacting with MSAL
   *
   * Returns an object with:
   * - instance: The MSAL PublicClientApplication instance (used to trigger login/logout)
   * - accounts: Array of signed-in accounts (usually 0 or 1)
   * - inProgress: Current authentication operation status ("none", "login", "logout", etc.)
   */
  const { instance } = useMsal();

  /**
   * useIsAuthenticated() hook - Simple boolean check
   *
   * Returns true if there's at least one account in MSAL's cache.
   * Useful for simple conditional rendering without needing the full MSAL instance.
   */
  const isAuthenticated = useIsAuthenticated();

  /**
   * handleLogin - Initiates the Entra ID login flow via popup
   *
   * loginPopup() opens a small browser window where the user enters credentials.
   * The popup communicates back to the main window when login completes.
   *
   * Pros: User stays on the current page, smoother experience
   * Cons: Popup blockers may interfere, some mobile browsers don't support popups well
   *
   * Alternative: Use instance.loginRedirect(loginRequest) for redirect-based login
   * - Redirects the whole page to Entra ID, then back to your app
   * - More compatible but loses current page state
   */
  const handleLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (error) {
      // Common errors:
      // - "user_cancelled": User closed the popup without completing login
      // - "popup_window_error": Popup was blocked by the browser
      // - "interaction_in_progress": Another login/logout is already happening
      console.error("Login failed:", error);
    }
  };

  /**
   * handleLogout - Signs the user out
   *
   * logoutPopup() clears the MSAL cache and optionally signs out of Entra ID.
   *
   * Options:
   * - postLogoutRedirectUri: Where to go after logout (overrides config)
   * - mainWindowRedirectUri: Where the main window goes (for popup logout)
   *
   * Alternative: instance.logoutRedirect() redirects the whole page to Entra ID
   * logout endpoint, which also clears the Entra ID session cookie.
   */
  const handleLogout = async () => {
    try {
      await instance.logoutPopup({
        // Redirect the main window to home after the logout popup completes
        mainWindowRedirectUri: "/",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🔐 Entra Auth Demo</Link>
      </div>

      <div className="navbar-links">
        {/* These links are always visible to everyone */}
        <Link to="/">Home</Link>
        <Link to="/public">Public Page</Link>

        {/*
          AuthenticatedTemplate: These links only appear when user is signed in.
          This provides a clean way to conditionally render UI based on auth state
          without writing manual if/else checks.
        */}
        <AuthenticatedTemplate>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
        </AuthenticatedTemplate>
      </div>

      <div className="navbar-auth">
        {/*
          Show different buttons based on authentication state.
          You could also use the `isAuthenticated` boolean for this,
          but the template components are the idiomatic MSAL React approach.
        */}
        <UnauthenticatedTemplate>
          <button onClick={handleLogin} className="btn btn-login">
            Sign In
          </button>
        </UnauthenticatedTemplate>

        <AuthenticatedTemplate>
          {/*
            Display the user's name from the first account in the cache.
            The account object contains claims from the ID token:
            - name: Display name
            - username: Usually the email/UPN
            - localAccountId: Unique ID for this user
          */}
          <span className="navbar-user">
            {isAuthenticated && `Welcome, ${instance.getActiveAccount()?.name ?? "User"}`}
          </span>
          <button onClick={handleLogout} className="btn btn-logout">
            Sign Out
          </button>
        </AuthenticatedTemplate>
      </div>
    </nav>
  );
}
