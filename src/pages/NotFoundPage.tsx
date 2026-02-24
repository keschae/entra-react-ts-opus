/**
 * NotFoundPage.tsx - 404 Error Page
 *
 * This page is displayed when a user navigates to a route that doesn't exist.
 * It serves as the catch-all route in the router configuration using the
 * wildcard path "*".
 *
 * This page is accessible to both authenticated and unauthenticated users,
 * since anyone can stumble upon a non-existent URL.
 */

import { Link } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";

export function NotFoundPage() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <div className="page error-page">
      <div className="error-content">
        <h1 className="error-code">404</h1>
        <h2>Page Not Found</h2>
        <p>
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="card-actions">
          <Link to="/" className="btn btn-primary">
            Go to Home
          </Link>

          {/* Show dashboard link only if the user is authenticated */}
          {isAuthenticated && (
            <Link to="/dashboard" className="btn btn-secondary">
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
