import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useIsMobile from "../hooks/useIsMobile";

// Public Pages
import Landing from "../pages/landing/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import RoleSelection from "../pages/auth/RoleSelection";

// Admin Auth
import AdminLogin from "../pages/auth/AdminLogin";

// Admin Pages
import Dashboard from "../pages/admin/Dashboard";
import ManageEvents from "../pages/admin/ManageEvents";
import ManageQuizzes from "../pages/admin/ManageQuizzes";
import QuizResults from "../pages/admin/QuizResults";
import AdminProfile from "../pages/admin/AdminProfile";
import DashboardLayout from "../layouts/DashboardLayout";

// Student Pages
import StudentLayout from "../layouts/StudentLayout";
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentQuizzes from "../pages/student/StudentQuizzes";
import StudentEvents from "../pages/student/StudentEvents";
import StudentProfile from "../pages/student/StudentProfile";
import QuizAttempt from "../pages/student/QuizAttempt";
import StudentQuizResults from "../pages/student/StudentQuizResults";

// --- Mobile Pages ---
// Public Mobile
import MobileLanding from "../pages/mobile/landing/MobileLanding";
import MobileLogin from "../pages/mobile/auth/MobileLogin";
import MobileRegister from "../pages/mobile/auth/MobileRegister";
import MobileRoleSelection from "../pages/mobile/auth/MobileRoleSelection";
import MobileAdminLogin from "../pages/mobile/auth/MobileAdminLogin";

// Admin Mobile
import MobileDashboard from "../pages/mobile/admin/MobileDashboard";
import MobileManageEvents from "../pages/mobile/admin/MobileManageEvents";
import MobileManageQuizzes from "../pages/mobile/admin/MobileManageQuizzes";
import MobileQuizResults from "../pages/mobile/admin/MobileQuizResults";
import MobileAdminProfile from "../pages/mobile/admin/MobileAdminProfile";
import MobileDashboardLayout from "../pages/mobile/layouts/MobileDashboardLayout";

// Student Mobile
import MobileStudentLayout from "../pages/mobile/layouts/MobileStudentLayout";
import MobileStudentDashboard from "../pages/mobile/student/MobileStudentDashboard";
import MobileStudentQuizzes from "../pages/mobile/student/MobileStudentQuizzes";
import MobileStudentEvents from "../pages/mobile/student/MobileStudentEvents";
import MobileStudentProfile from "../pages/mobile/student/MobileStudentProfile";
import MobileQuizAttempt from "../pages/mobile/student/MobileQuizAttempt";
import MobileStudentQuizResults from "../pages/mobile/student/MobileStudentQuizResults";

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  
  const loginPath = allowedRole === "admin" ? "/admin/login" : "/login";

  if (!token) {
    return <Navigate to={loginPath} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to={loginPath} replace />;
  }

  return children;
};

const AppRoutes = () => {
  const isMobile = useIsMobile();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={isMobile ? <MobileLanding /> : <Landing />} />
      <Route path="/role-selection" element={isMobile ? <MobileRoleSelection /> : <RoleSelection />} />
      <Route path="/login" element={isMobile ? <MobileLogin /> : <Login />} />
      <Route path="/register" element={isMobile ? <MobileRegister /> : <Register />} />

      {/* Dedicated Admin Login */}
      <Route path="/admin/login" element={isMobile ? <MobileAdminLogin /> : <AdminLogin />} />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            {isMobile ? <MobileDashboardLayout /> : <DashboardLayout />}
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={isMobile ? <MobileDashboard /> : <Dashboard />} />
        <Route path="events" element={isMobile ? <MobileManageEvents /> : <ManageEvents />} />
        <Route path="quizzes" element={isMobile ? <MobileManageQuizzes /> : <ManageQuizzes />} />

        {/* Supporting upstream's route for manage-quizzes */}
        <Route path="manage-quizzes" element={<Navigate to="quizzes" replace />} />

        <Route path="quizzes/:id/results" element={isMobile ? <MobileQuizResults /> : <QuizResults />} />
        <Route path="profile" element={isMobile ? <MobileAdminProfile /> : <AdminProfile />} />
      </Route>

      {/* Student Protected Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRole="student">
            {isMobile ? <MobileStudentLayout /> : <StudentLayout />}
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={isMobile ? <MobileStudentDashboard /> : <StudentDashboard />} />
        <Route path="quizzes" element={isMobile ? <MobileStudentQuizzes /> : <StudentQuizzes />} />
        <Route path="quizzes/:id/attempt" element={isMobile ? <MobileQuizAttempt /> : <QuizAttempt />} />
        <Route path="quizzes/:id/results" element={isMobile ? <MobileStudentQuizResults /> : <StudentQuizResults />} />
        <Route path="events" element={isMobile ? <MobileStudentEvents /> : <StudentEvents />} />
        <Route path="profile" element={isMobile ? <MobileStudentProfile /> : <StudentProfile />} />
      </Route>

      {/* Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
