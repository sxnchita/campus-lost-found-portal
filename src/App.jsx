import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ReportLost from "./pages/ReportLost";
import ReportFound from "./pages/ReportFound";
import LostItems from "./pages/LostItems";
import FoundItems from "./pages/FoundItems";
import Claims from "./pages/Claims";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import AdminPanel from "./pages/AdminPanel";
import AdminLostItems from "./pages/AdminLostItems";
import AdminFoundItems from "./pages/AdminFoundItems";
import AdminMatches from "./pages/AdminMatches";
import AdminClaims from "./pages/AdminClaims";
import AdminHandovers from "./pages/AdminHandovers";
import AuditLogs from "./pages/AuditLogs";

import StudentMatches from "./pages/StudentMatches";
import StudentHandovers from "./pages/StudentHandovers";
import MyFoundItems from "./pages/MyFoundItems";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/auth" />;
  if (role && userRole !== role) return <Navigate to="/auth" />;

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute role="STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-matches"
          element={
            <ProtectedRoute role="STUDENT">
              <StudentMatches />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-found-items"
          element={
            <ProtectedRoute role="STUDENT">
              <MyFoundItems />
            </ProtectedRoute>
          }
        />

        <Route
          path="/handovers"
          element={
            <ProtectedRoute role="STUDENT">
              <StudentHandovers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-panel"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/lost-items"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminLostItems />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/found-items"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminFoundItems />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/matches"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminMatches />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/claims"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminClaims />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/handovers"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminHandovers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute role="ADMIN">
              <AuditLogs />
            </ProtectedRoute>
          }
        />

        <Route path="/report-lost" element={<ReportLost />} />
        <Route path="/report-found" element={<ReportFound />} />
        <Route path="/lost-items" element={<LostItems />} />
        <Route path="/found-items" element={<FoundItems />} />
        <Route path="/claims" element={<Claims />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;