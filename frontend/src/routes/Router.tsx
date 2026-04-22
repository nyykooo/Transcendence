import { Routes, Route } from "react-router-dom";
import {
  Home, 
  RecipeView, 
  RecipeListView, 
  PrivacyPolicy, 
  TermsOfService, 
  NotFound, 
  Login,
  Register,
  GithubCallback,
  Profile,
  AdminView
 }  from "../views/index";
import FileManagement from "../components/FileManagement";
import { ProtectedRoute } from "../components/components";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/recipe/:name" element={<ProtectedRoute><RecipeView /></ProtectedRoute>} />
      <Route path="/recipe-list-view" element={<ProtectedRoute><RecipeListView /></ProtectedRoute>} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/file-management" element={<ProtectedRoute><FileManagement /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminView /></ProtectedRoute>} />
      <Route path="/auth/github/callback" element={<GithubCallback />} />
      <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
    </Routes>
  );
}