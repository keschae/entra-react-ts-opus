/**
 * ProfilePage.tsx - Protected Profile Page
 *
 * This is another protected page that demonstrates accessing ID token claims.
 * It shows how to extract and display information from the user's authentication
 * tokens without making any additional API calls.
 *
 * Key concept: ID Token vs Access Token
 *
 * ID Token:
 * - Contains claims about the USER (who they are)
 * - Used by your app to identify the user
 * - Includes: name, email, tenant ID, token expiry, etc.
 * - Automatically available after login via MSAL's account object
 *
 * Access Token:
 * - Contains claims about PERMISSIONS (what the user can do)
 * - Used to call protected APIs (like Microsoft Graph)
 * - Includes: scopes, audience, token expiry, etc.
 * - Obtained via acquireTokenSilent/acquireTokenPopup/acquireTokenRedirect
 */

import { useMsal } from "@azure/msal-react";
import type { AccountInfo } from "@azure/msal-browser";

export function ProfilePage() {
  const { accounts } = useMsal();

  /**
   * The accounts array contains all signed-in accounts.
   * In most SPA scenarios, there's only one account.
   *
   * Each AccountInfo object contains claims from the ID token:
   * - name: User's display name
   * - username: Usually their email or UPN (User Principal Name)
   * - localAccountId: Unique identifier for this user in this tenant
   * - tenantId: The Entra ID tenant they belong to
   * - environment: The cloud environment (e.g., "login.microsoftonline.com")
   * - idTokenClaims: Raw claims from the ID token (most detailed info)
   */
  const account: AccountInfo | undefined = accounts[0];

  // Extract ID token claims for display
  // These claims come directly from the JWT ID token issued by Entra ID
  const idTokenClaims = account?.idTokenClaims as Record<string, unknown> | undefined;

  return (
    <div className="page">
      <h1>User Profile</h1>
      <p className="subtitle">
        🔒 This is a protected page showing your ID token claims.
      </p>

      <div className="card">
        <h2>Account Details</h2>
        <p>
          These details come from the <strong>MSAL account object</strong>,
          which is populated from your ID token after login.
        </p>
        <table className="info-table">
          <tbody>
            <tr>
              <td><strong>Display Name</strong></td>
              <td>{account?.name ?? "N/A"}</td>
            </tr>
            <tr>
              <td><strong>Username (UPN)</strong></td>
              <td>{account?.username ?? "N/A"}</td>
            </tr>
            <tr>
              <td><strong>Local Account ID</strong></td>
              <td><code>{account?.localAccountId ?? "N/A"}</code></td>
            </tr>
            <tr>
              <td><strong>Tenant ID</strong></td>
              <td><code>{account?.tenantId ?? "N/A"}</code></td>
            </tr>
            <tr>
              <td><strong>Environment</strong></td>
              <td>{account?.environment ?? "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {idTokenClaims && (
        <div className="card">
          <h2>ID Token Claims</h2>
          <p>
            These are the raw claims from your <strong>ID token</strong>.
            The ID token is a JWT (JSON Web Token) that Entra ID issues after
            authentication. Each claim provides specific information about the user
            or the authentication event.
          </p>

          {/*
            Common ID token claims explained:
            - aud: Audience - your app's client ID (who the token is for)
            - iss: Issuer - the Entra ID endpoint that issued the token
            - iat: Issued At - when the token was created (Unix timestamp)
            - exp: Expiration - when the token expires (Unix timestamp)
            - name: User's display name
            - preferred_username: User's primary username (usually email)
            - oid: Object ID - unique identifier for the user in Entra ID
            - sub: Subject - unique identifier for this user+app combination
            - tid: Tenant ID - the Entra ID tenant
            - ver: Token version (1.0 or 2.0)
          */}
          <div className="claims-container">
            <table className="info-table">
              <thead>
                <tr>
                  <th>Claim</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(idTokenClaims).map(([key, value]) => (
                  <tr key={key}>
                    <td><strong>{key}</strong></td>
                    <td>
                      <code>
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value)}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
