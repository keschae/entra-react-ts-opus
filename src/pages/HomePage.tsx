/**
 * HomePage.tsx - Public Landing Page
 *
 * This page is accessible to everyone, whether authenticated or not.
 * It demonstrates using MSAL React's template components to show
 * different content based on authentication state.
 */

import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="page">
      <h1>Welcome to the Entra ID Auth Demo</h1>
      <p className="subtitle">
        This application demonstrates Microsoft Entra ID (formerly Azure AD)
        authentication using the MSAL React library.
      </p>

      {/*
        Show different hero content depending on whether the user is signed in.
        This is a common pattern: showing a "Get Started" CTA for anonymous users
        and a "Go to Dashboard" CTA for authenticated users.
      */}
      <UnauthenticatedTemplate>
        <div className="card info-card">
          <h2>🔓 You are not signed in</h2>
          <p>
            Click the <strong>Sign In</strong> button in the navigation bar to
            authenticate with Microsoft Entra ID. Once signed in, you'll be able
            to access protected pages like the Dashboard and Profile.
          </p>
          <p>
            You can still browse the{" "}
            <Link to="/public">Public Page</Link> without signing in.
          </p>
        </div>
      </UnauthenticatedTemplate>

      <AuthenticatedTemplate>
        <div className="card success-card">
          <h2>✅ You are signed in!</h2>
          <p>
            You now have access to all pages. Check out your authenticated
            content:
          </p>
          <div className="card-actions">
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
            <Link to="/profile" className="btn btn-secondary">
              View Profile
            </Link>
          </div>
        </div>
      </AuthenticatedTemplate>

      {/* This section is always visible regardless of auth state */}
      <section className="features">
        <h2>What This Demo Covers</h2>
        <div className="feature-grid">
          <div className="feature-item">
            <h3>🔐 Authentication</h3>
            <p>Sign in/out using Microsoft Entra ID with popup or redirect flows</p>
          </div>
          <div className="feature-item">
            <h3>🛡️ Route Protection</h3>
            <p>Protected routes that require authentication to access</p>
          </div>
          <div className="feature-item">
            <h3>📊 Graph API</h3>
            <p>Fetch user profile data from Microsoft Graph after sign-in</p>
          </div>
          <div className="feature-item">
            <h3>🧭 Public Routes</h3>
            <p>Pages accessible to everyone, with or without authentication</p>
          </div>
        </div>
      </section>
    </div>
  );
}
