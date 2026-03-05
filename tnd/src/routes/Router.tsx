import { Routes, Route } from "react-router-dom";
import { Home, RecipeView, RecipeListView, PrivacyPolicy, TermsOfService, NotFound }  from "../views/index";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/RecipeView" element={<RecipeView />} />
      <Route path="/RecipeListView" element={<RecipeListView />} />
      <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
      <Route path="/TermsOfService" element={<TermsOfService />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}