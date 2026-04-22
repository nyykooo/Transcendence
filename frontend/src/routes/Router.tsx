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
  Profile
 }  from "../views/index";
import ProtectedRoute from "../components/ProtectedRoute";
import FileManagement from "../components/FileManagement";

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
      <Route path="/auth/github/callback" element={<GithubCallback />} />
      <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
    </Routes>
  );
}