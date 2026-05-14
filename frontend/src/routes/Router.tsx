
import { Routes, Route } from "react-router-dom";
import { Home, RecipeView, RecipeListView, PrivacyPolicy, TermsOfService, NotFound, Login, Register, GithubCallback, Profile, AdminView } from "../views/index";
import FileManagement from "../components/FileManagement";
import { ProtectedRoute } from "../components/components";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

export default function Router() {
  return (
    <Routes>
      {/* Com Header */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/recipe/:name" element={<ProtectedRoute><RecipeView /></ProtectedRoute>} />
        <Route path="/recipe-list-view" element={<ProtectedRoute><RecipeListView /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        {/* <Route path="/profile/:name" element={<ProtectedRoute><PublicProfile /></ProtectedRoute>} /> */}
        <Route path="/file-management" element={<ProtectedRoute><FileManagement /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminView /></ProtectedRoute>} />
        <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
      </Route>

      {/* Sem Header */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/github/callback" element={<GithubCallback />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
      </Route>
    </Routes>
  );
}