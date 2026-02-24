/**
 * App.tsx - Main Application Component with Routing
 *
 * This is where we set up React Router with both public and protected routes.
 * The MSAL Provider is set up in main.tsx, so all components in this tree
 * have access to MSAL hooks and context.
 *
 * Route Architecture:
 * ┌─────────────────────────────────────────────────┐
 * │ PageLayout (Navbar + Footer wrapper)            │
 * │  ├── /              → HomePage        (public)  │
 * │  ├── /public        → PublicPage      (public)  │
 * │  ├── /dashboard     → DashboardPage   (protected)│
 * │  ├── /profile       → ProfilePage     (protected)│
 * │  └── *              → NotFoundPage    (public)  │
 * └─────────────────────────────────────────────────┘
 */

import { Routes, Route } from "react-router-dom";
import { PageLayout } from "./components/PageLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { PublicPage } from "./pages/PublicPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProfilePage } from "./pages/ProfilePage";
import { NotFoundPage } from "./pages/NotFoundPage";

import "./App.css";

function App() {
  return (
    <Routes>
      {/*
        The PageLayout is a "layout route" — it renders the Navbar and Footer,
        with an <Outlet> in the middle that renders the matched child route.
        All child routes inherit this layout.
      */}
      <Route element={<PageLayout />}>
        {/* ============================================
            PUBLIC ROUTES
            These routes are accessible to everyone,
            no authentication required.
            ============================================ */}

        {/* Home page — the landing page of the app */}
        <Route path="/" element={<HomePage />} />

        {/* Public page — example of an unauthenticated route */}
        <Route path="/public" element={<PublicPage />} />

        {/* ============================================
            PROTECTED ROUTES
            These routes require the user to be authenticated.
            The <ProtectedRoute> wrapper checks auth state
            and redirects to home if not signed in.
            ============================================ */}

        {/* Dashboard — shows account info and Graph API demo */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Profile — shows ID token claims and user details */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* ============================================
            CATCH-ALL / 404 ROUTE
            The wildcard "*" matches any path that wasn't
            matched by the routes above. This handles
            nonexistent/invalid URLs gracefully.
            ============================================ */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
