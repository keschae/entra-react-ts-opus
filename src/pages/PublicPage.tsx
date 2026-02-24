/**
 * PublicPage.tsx - Publicly Accessible Page
 *
 * This page demonstrates a route that is available to ALL users,
 * whether they are authenticated or not. No route guard is applied.
 *
 * In a real application, public pages might include:
 * - Marketing/landing pages
 * - Documentation
 * - Pricing pages
 * - About/Contact pages
 * - Terms of Service / Privacy Policy
 */

import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";

export function PublicPage() {
  return (
    <div className="page">
      <h1>Public Page</h1>
      <p className="subtitle">
        This page is accessible to everyone &mdash; no authentication required!
      </p>

      <div className="card">
        <h2>🌐 Open Access Content</h2>
        <p>
          This content is visible to all visitors. In a real application, this
          could be a marketing page, documentation, or any content that doesn't
          require user authentication.
        </p>
      </div>

      {/*
        Even on public pages, you can show different content to authenticated
        vs. unauthenticated users. This is useful for personalizing the
        experience while still keeping the page publicly accessible.
      */}
      <AuthenticatedTemplate>
        <div className="card success-card">
          <h2>👋 Hello, authenticated user!</h2>
          <p>
            Since you're signed in, you can see this extra content.
            This demonstrates how you can personalize public pages
            for authenticated users without restricting access.
          </p>
        </div>
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <div className="card info-card">
          <h2>💡 Want to see more?</h2>
          <p>
            Sign in to access protected content like the Dashboard and Profile
            pages. You'll also see personalized content here on this page!
          </p>
        </div>
      </UnauthenticatedTemplate>
    </div>
  );
}
