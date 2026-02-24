/**
 * ProtectedRoute.tsx - Route Guard for Authenticated Users
 *
 * This component wraps routes that should only be accessible to authenticated users.
 * It uses MSAL React's built-in components to handle the authentication check.
 *
 * Key MSAL React components used:
 * - <AuthenticatedTemplate>: Only renders its children if a user is signed in
 * - <UnauthenticatedTemplate>: Only renders its children if NO user is signed in
 *
 * These components automatically react to authentication state changes,
 * so they re-render when a user logs in or out.
 */

import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute - Wraps child components with authentication checks
 *
 * Usage in your router:
 *   <Route path="/dashboard" element={
 *     <ProtectedRoute>
 *       <DashboardPage />
 *     </ProtectedRoute>
 *   } />
 *
 * Behavior:
 * - If the user IS authenticated → renders the child component
 * - If the user is NOT authenticated → redirects to the home page
 *
 * Alternative approaches:
 * - Instead of redirecting, you could show a "Please sign in" message
 * - You could trigger the login popup/redirect automatically
 * - You could redirect to a dedicated "/login" page
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  return (
    <>
      {/*
        AuthenticatedTemplate only renders when a user account exists in MSAL's cache.
        This means the user has successfully completed the Entra ID login flow.
      */}
      <AuthenticatedTemplate>{children}</AuthenticatedTemplate>

      {/*
        UnauthenticatedTemplate only renders when no user account is found.
        Here we redirect unauthenticated users back to the home page.
        The `replace` prop prevents the protected URL from appearing in browser history.
      */}
      <UnauthenticatedTemplate>
        <Navigate to="/" replace />
      </UnauthenticatedTemplate>
    </>
  );
}
