
const recipes = [
  {
    id: 1,
    name: "Shakshuka",
    diet: 1, // Vegetarian per your views.sql mapping
    instructions:
      "1. **Prepare ingredients**:\n" +
      "   Finely dice all ingredients, really small cuts\n" +
      "2. **Sauté aromatics**:\n" +
      "   - Heat olive oil in a large pan\n" +
      "   - Brown the garlic, onion and the pepper\n" +
      "   - Add the tomato and season, let it in low heat until the sauce is thickened\n\n" +
      "3. **Add tomatoes and spices**:\n" +
      "   - Add the tomato and season\n" +
      "   - Salt to taste\n" +
      "   - Simmer for 15-20 minutes until thickened\n\n" +
      "4. **Add eggs**:\n" +
      "   - Make wells in the sauce and crack eggs\n" +
      "   - Cover and cook until eggs are set (5-7 minutes)\n\n" +
      "5. **Serve**:\n" +
      "   - Serve hot with Saloia bread (100g) on the side\n" +
      "   - Garnish with fresh herbs if desired",
    url: "https://youtu.be/SjCkW-oAFQ8?si=8dk4eXJW1kk6ohr1&t=31",
    cost: 12.75,
    portions: 4,
    is_public: false,
    prep_time: null,
    cooking_time: null,
    created_at: new Date().toISOString(),
    updated: null,
    createdBy: 1,
    ingredients: [
      // Fill ingredient_id from DB (next section)
      { ingredient_id: 93 /*"EGG"*/, quantity: 2, unit: "units" },
      { ingredient_id: 20/*" Onion "*/ , quantity: 0.115, unit: "kg" },
      { ingredient_id: 105 /*" Red Bell Pepper "*/, quantity: 0.114, unit: "kg" },
      { ingredient_id: 122 /*" Tomato "*/, quantity: 0.551, unit: "kg" },
      { ingredient_id: 9 /*" Garlic "*/, quantity: 0.014, unit: "kg" },
      { ingredient_id: 8 /*" Rosemary "*/, quantity: 0.002, unit: "kg" },
      { ingredient_id: 124 /*" Thyme "*/, quantity: 0.004, unit: "kg" },
      { ingredient_id: 74 /*" Basil "*/, quantity: 0.006, unit: "kg" },
      { ingredient_id: 103 /*" Chili Pepper "*/, quantity: 0.011, unit: "kg" },
      { ingredient_id: " Sweet Paprika " , quantity: 0.010, unit: "kg" },
      { ingredient_id: " Cumin ", quantity: 0.004, unit: "kg" },
      { ingredient_id: 32/*" Tomato Concentrate id "*/, quantity: 0.050, unit: "kg" },
      { ingredient_id: 99/*" Saloia Bread id "*/, quantity: 0.100, unit: "kg" },
    ],
  },
];


let recipeId = 2;

function nextRecipeId() {
    return recipeId++;
}

module.exports = {recipes, nextRecipeId};