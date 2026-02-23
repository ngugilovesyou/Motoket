import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import "./index.css"
import { RouterProvider } from 'react-router-dom'
import routes from '../routes'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from './components/Authentication/Auth'
import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from 'react-helmet-async'
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}
      >
        <ErrorBoundary
  FallbackComponent={({ error }) => (
    <div>
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
    </div>
  )}
>
  <HelmetProvider>
    <RouterProvider router={routes} />
  </HelmetProvider>
  
</ErrorBoundary>
        
      </GoogleOAuthProvider>
    </AuthProvider>
  </StrictMode>
);
