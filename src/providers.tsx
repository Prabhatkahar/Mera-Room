// src/providers.tsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );
};
