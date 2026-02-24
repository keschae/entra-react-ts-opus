/**
 * DashboardPage.tsx - Protected Dashboard Page
 *
 * This page is ONLY accessible to authenticated users.
 * It's wrapped with <ProtectedRoute> in the router configuration.
 *
 * This component demonstrates:
 * 1. Accessing the signed-in user's account info from MSAL
 * 2. Acquiring access tokens silently for API calls
 * 3. Calling the Microsoft Graph API to fetch user data
 *
 * Token Acquisition Flow:
 * - acquireTokenSilent: Tries to get a token from the cache first (no user interaction)
 * - If the cached token is expired, MSAL automatically refreshes it
 * - If silent acquisition fails (e.g., user needs to re-consent), fall back to popup/redirect
 */

import { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { type InteractionRequiredAuthError } from "@azure/msal-browser";
import { loginRequest } from "../auth/authConfig";
import { callMsGraph, type GraphData } from "../auth/graph";

export function DashboardPage() {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * fetchGraphData - Demonstrates the token acquisition + API call pattern
   *
   * This is the standard pattern for calling protected APIs with MSAL:
   * 1. Try to get a token silently (from cache or by refreshing)
   * 2. If that fails with InteractionRequiredAuthError, use a popup/redirect
   * 3. Use the token to call your API
   *
   * Why "silent first"?
   * - Better UX: No login prompts if a valid token exists
   * - Performance: Cache lookups are instant
   * - Only falls back to interactive when absolutely necessary
   */
  const fetchGraphData = async () => {
    setLoading(true);
    setError(null);

    try {
      /**
       * acquireTokenSilent - Get an access token without user interaction
       *
       * Parameters:
       * - scopes: The permissions needed for the API call
       * - account: Which account to get the token for (important for multi-account scenarios)
       *
       * The token returned has the scopes (permissions) requested in loginRequest.
       * If you need different scopes for different APIs, create separate request objects.
       */
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0], // Use the first (usually only) signed-in account
      });

      // Use the access token to call Microsoft Graph
      const data = await callMsGraph(response.accessToken);
      setGraphData(data);
    } catch (err) {
      /**
       * InteractionRequiredAuthError - Indicates silent token acquisition failed
       *
       * This can happen when:
       * - The refresh token has expired (usually after 90 days of inactivity)
       * - The user needs to consent to new permissions
       * - The Entra ID admin requires re-authentication
       * - Conditional Access policies require interaction (e.g., MFA)
       *
       * Solution: Fall back to interactive token acquisition
       */
      if ((err as InteractionRequiredAuthError).errorCode) {
        try {
          const response = await instance.acquireTokenPopup(loginRequest);
          const data = await callMsGraph(response.accessToken);
          setGraphData(data);
        } catch (popupErr) {
          setError("Failed to acquire token interactively. Please try again.");
          console.error("Interactive token acquisition failed:", popupErr);
        }
      } else {
        setError("An unexpected error occurred while fetching data.");
        console.error("Token acquisition error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p className="subtitle">
        🔒 This is a protected page &mdash; only visible to authenticated users.
      </p>

      {/* Display basic account info from the ID token claims */}
      <div className="card">
        <h2>Account Information</h2>
        <p>
          This data comes from the <strong>ID token</strong> that Entra ID
          returned during login. No additional API calls are needed!
        </p>
        <table className="info-table">
          <tbody>
            <tr>
              <td><strong>Name</strong></td>
              <td>{accounts[0]?.name ?? "N/A"}</td>
            </tr>
            <tr>
              <td><strong>Username</strong></td>
              <td>{accounts[0]?.username ?? "N/A"}</td>
            </tr>
            <tr>
              <td><strong>Tenant ID</strong></td>
              <td><code>{accounts[0]?.tenantId ?? "N/A"}</code></td>
            </tr>
            <tr>
              <td><strong>Account ID</strong></td>
              <td><code>{accounts[0]?.localAccountId ?? "N/A"}</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Microsoft Graph API call demo */}
      <div className="card">
        <h2>Microsoft Graph API</h2>
        <p>
          Click the button below to fetch your profile from the{" "}
          <strong>Microsoft Graph API</strong>. This demonstrates acquiring an
          access token and using it to call a protected API.
        </p>

        <button
          onClick={fetchGraphData}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? "Loading..." : "Fetch My Profile from Graph"}
        </button>

        {error && <p className="error-text">{error}</p>}

        {graphData && (
          <div className="graph-data">
            <h3>Graph API Response</h3>
            <table className="info-table">
              <tbody>
                <tr>
                  <td><strong>Display Name</strong></td>
                  <td>{graphData.displayName}</td>
                </tr>
                <tr>
                  <td><strong>Email</strong></td>
                  <td>{graphData.mail ?? "N/A"}</td>
                </tr>
                <tr>
                  <td><strong>Job Title</strong></td>
                  <td>{graphData.jobTitle ?? "N/A"}</td>
                </tr>
                <tr>
                  <td><strong>Office Location</strong></td>
                  <td>{graphData.officeLocation ?? "N/A"}</td>
                </tr>
                <tr>
                  <td><strong>User Principal Name</strong></td>
                  <td>{graphData.userPrincipalName}</td>
                </tr>
                <tr>
                  <td><strong>ID</strong></td>
                  <td><code>{graphData.id}</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
