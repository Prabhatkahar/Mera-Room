import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Admin from "../pages/Admin";
import ProtectedRoute from "../features/auth/ProtectedRoute";

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <Admin />
        </ProtectedRoute>
      }
    />
  </Routes>
);
