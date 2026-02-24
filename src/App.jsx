import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/PublicHome";
import Login from "./pages/Login";
import OrgDashboard from "./pages/OrgDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminDashboard from "./pages/AdminPanel";
import AdminLogin from "./pages/AdminLogin";
import ProblemDetail from "./pages/ProblemDetail";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Home (default page) */}
          <Route path="/" element={<Home />} />
          <Route path="/problem/:id" element={<ProblemDetail />} />
          {/* Tashkilot login */}
          <Route path="/login" element={<Login />} />

          {/* Tashkilot dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="tashkilot">
                <OrgDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin login */}
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

          {/* Fallback route */}
          <Route path="*" element={<Home />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}