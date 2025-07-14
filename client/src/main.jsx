import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import "./index.css"
import { RouterProvider } from 'react-router-dom'
import routes from '../routes'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from './components/Authentication/Auth'
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}
      >
        <RouterProvider router={routes} />
      </GoogleOAuthProvider>
    </AuthProvider>
  </StrictMode>
);
