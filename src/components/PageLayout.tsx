/**
 * PageLayout.tsx - Shared Layout Component
 *
 * A simple layout wrapper that includes the Navbar on every page.
 * Uses React Router's <Outlet> to render child routes.
 */

import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function PageLayout() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {/* Outlet renders the matched child route's component */}
        <Outlet />
      </main>
      <footer className="footer">
        <p>Microsoft Entra ID Authentication Demo &mdash; Built with React + MSAL</p>
      </footer>
    </div>
  );
}
