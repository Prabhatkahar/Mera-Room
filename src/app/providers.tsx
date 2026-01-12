// src/app/providers.tsx
import React, { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../features/auth/AuthContext"; // path correct now

interface ProvidersProps {
  children: ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>{children}</AuthProvider>
  </BrowserRouter>
);
