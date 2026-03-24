import { Routes, Route } from "react-router-dom";
import {
  Home, 
  RecipeView, 
  RecipeListView, 
  PrivacyPolicy, 
  TermsOfService, 
  NotFound, 
  Login
 }  from "../views/index";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/RecipeView/:name" element={<ProtectedRoute><RecipeView /></ProtectedRoute>} />
      <Route path="/RecipeListView" element={<ProtectedRoute><RecipeListView /></ProtectedRoute>} />
      <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
      <Route path="/TermsOfService" element={<TermsOfService />} />
      <Route path="/Login" element={<Login />} />
      <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
    </Routes>
  );
}