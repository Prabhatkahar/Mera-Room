import React from "react";
import { AuthProvider } from "../features/auth/AuthContext";

type Props = {
  children: React.ReactNode;
};

export default function Providers({ children }: Props) {
  return <AuthProvider>{children}</AuthProvider>;
}
