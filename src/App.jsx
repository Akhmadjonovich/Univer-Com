import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import OrgDashboard from "./pages/OrgDashboard";
import MasulDashboard from "./pages/MasulDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminPanel";
import AdminLogin from "./pages/AdminLogin";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin login page */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Admin dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Tashkilot login */}
          <Route path="/login" element={<Login />} />

          {/* Tashkilot dashboard */}
          <Route
            path="/dashboard-org"
            element={
              <ProtectedRoute role="tashkilot">
                <OrgDashboard />
              </ProtectedRoute>
            }
          />

          {/* Mas’ul dashboard */}
          <Route
            path="/dashboard-masul"
            element={
              <ProtectedRoute role="masul">
                <MasulDashboard />
              </ProtectedRoute>
            }
          />

          {/* Default route */}
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
