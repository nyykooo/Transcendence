import { Routes, Route } from "react-router-dom";
import { Home, RecipeView, RecipeListView }  from "../views/index";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/RecipeView" element={<RecipeView />} />
      <Route path="/RecipeListView" element={<RecipeListView />} />
    </Routes>
  );
}