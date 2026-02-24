/**
 * graph.ts - Microsoft Graph API Helper
 *
 * This file provides utility functions for calling the Microsoft Graph API.
 * After a user authenticates with Entra ID, you receive an access token that
 * can be used to call Graph API endpoints to fetch user data, emails, etc.
 *
 * The pattern here is:
 * 1. Acquire an access token from MSAL (silently or via popup/redirect)
 * 2. Attach the token to the Authorization header as a Bearer token
 * 3. Call the Graph API endpoint
 */

import { graphConfig } from "./authConfig";

/**
 * GraphData interface - Represents the shape of data returned from
 * the Microsoft Graph /me endpoint.
 *
 * The /me endpoint returns the signed-in user's profile information.
 * This interface only captures common fields; the actual response may
 * contain more fields depending on the user's account type and your
 * app's permissions.
 */
export interface GraphData {
  displayName: string;
  jobTitle: string | null;
  mail: string | null;
  userPrincipalName: string;
  id: string;
  businessPhones: string[];
  mobilePhone: string | null;
  officeLocation: string | null;
  preferredLanguage: string | null;
}

/**
 * callMsGraph - Fetches the signed-in user's profile from Microsoft Graph
 *
 * @param accessToken - The Bearer token obtained from MSAL after authentication
 * @returns Promise<GraphData> - The user's profile data
 *
 * How it works:
 * 1. We set the Authorization header with "Bearer {token}"
 * 2. Graph API validates the token and checks that the required scopes are present
 * 3. If valid, it returns the requested data
 *
 * Important: The token must have the "User.Read" scope for the /me endpoint.
 * This scope was requested in authConfig.ts loginRequest.
 */
export async function callMsGraph(accessToken: string): Promise<GraphData> {
  const headers = new Headers();

  // The Bearer token scheme is the standard way to authenticate API calls
  // with OAuth 2.0 access tokens
  headers.append("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(graphConfig.graphMeEndpoint, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Graph API call failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
