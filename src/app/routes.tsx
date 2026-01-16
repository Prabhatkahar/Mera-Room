// src/app/routes.tsx
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home.js";
import Login from "../pages/Login.js";
import Admin from "../pages/Admin.js";
import ProtectedRoute from "../features/auth/ProtectedRoute.js";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    ),
  },
]);
