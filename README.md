# Microsoft Entra ID Authentication Demo

A React + TypeScript starter template demonstrating Microsoft Entra ID (formerly Azure Active Directory) authentication using the **MSAL React** library.

## 🎯 What This Demo Covers

- **Authentication** — Sign in/out with Microsoft Entra ID using popup flows
- **Route Protection** — Protected routes that require authentication (Dashboard, Profile)
- **Public Routes** — Pages accessible to everyone without authentication (Home, Public)
- **404 Handling** — Catch-all route for nonexistent pages
- **Microsoft Graph API** — Fetching user profile data after authentication
- **ID Token Claims** — Displaying token claims from the authentication response

## 📁 Project Structure

```
src/
├── auth/
│   ├── authConfig.ts      # Entra ID configuration (client ID, tenant, scopes)
│   └── graph.ts           # Microsoft Graph API helper functions
├── components/
│   ├── Navbar.tsx          # Navigation bar with login/logout buttons
│   ├── PageLayout.tsx      # Shared layout with Navbar + Footer
│   └── ProtectedRoute.tsx  # Route guard that requires authentication
├── pages/
│   ├── HomePage.tsx        # Public landing page
│   ├── PublicPage.tsx      # Public page (no auth required)
│   ├── DashboardPage.tsx   # Protected page (auth required) — Graph API demo
│   ├── ProfilePage.tsx     # Protected page (auth required) — ID token claims
│   └── NotFoundPage.tsx    # 404 error page for nonexistent routes
├── App.tsx                 # Router configuration with public & protected routes
├── App.css                 # Application styles
├── main.tsx                # Entry point — MSAL Provider setup
└── index.css               # Global styles
```

## 🔧 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- An [Azure account](https://azure.microsoft.com/free/) (free tier works)
- A Microsoft Entra ID tenant (comes with any Azure subscription)

## 🚀 Setup Instructions

### 1. Register Your App in Azure Portal

1. Go to the [Azure Portal](https://portal.azure.com)
2. Navigate to **Microsoft Entra ID** → **App registrations** → **New registration**
3. Configure the registration:
   - **Name:** Choose a name (e.g., "Entra Auth Demo")
   - **Supported account types:** Choose based on your needs:
     - *Single tenant* — Only your organization
     - *Multi-tenant* — Any Microsoft Entra ID tenant
     - *Multi-tenant + personal* — Any tenant + personal Microsoft accounts
   - **Redirect URI:**
     - Platform: **Single-page application (SPA)**
     - URI: `http://localhost:5173`
4. Click **Register**

### 2. Copy Your App IDs

From the app registration **Overview** page, copy:
- **Application (client) ID** — e.g., `12345678-abcd-1234-efgh-123456789012`
- **Directory (tenant) ID** — e.g., `abcdefgh-1234-abcd-1234-abcdefghijkl`

### 3. Configure the Application

Open `src/auth/authConfig.ts` and replace the placeholder values:

```typescript
auth: {
  clientId: "YOUR_CLIENT_ID_HERE",       // ← Paste your Application (client) ID
  authority: "https://login.microsoftonline.com/YOUR_TENANT_ID_HERE", // ← Paste your tenant ID
  redirectUri: "http://localhost:5173",
}
```

### 4. Install Dependencies and Run

```bash
npm install
npm run dev
```

The app will start at `http://localhost:5173`.

## 🧭 Routes Overview

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Home page with auth-aware content |
| `/public` | Public | Example public page, no login needed |
| `/dashboard` | 🔒 Protected | Account info + Microsoft Graph API demo |
| `/profile` | 🔒 Protected | ID token claims viewer |
| `/*` | Public | 404 Not Found page for invalid routes |

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `@azure/msal-browser` | Core MSAL library for browser-based auth |
| `@azure/msal-react` | React hooks and components for MSAL |
| `react-router-dom` | Client-side routing |

## 🔑 Key Concepts

### MSAL React Components
- `<MsalProvider>` — Wraps your app to provide MSAL context
- `<AuthenticatedTemplate>` — Renders children only when user is signed in
- `<UnauthenticatedTemplate>` — Renders children only when user is NOT signed in

### MSAL React Hooks
- `useMsal()` — Access the MSAL instance, accounts, and in-progress state
- `useIsAuthenticated()` — Simple boolean check for authentication status

### Token Types
- **ID Token** — Contains user identity claims (name, email, etc.)
- **Access Token** — Used to call protected APIs (e.g., Microsoft Graph)

### Authentication Flows
- **Popup** — Opens a login window (used in this demo)
- **Redirect** — Redirects the entire page to Entra ID login

## 📚 Learn More

- [Microsoft Entra ID Documentation](https://learn.microsoft.com/en-us/entra/identity/)
- [MSAL React Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react)
- [Microsoft Graph API](https://learn.microsoft.com/en-us/graph/overview)
- [React Router Documentation](https://reactrouter.com/)
- [Vite Documentation](https://vite.dev/)
