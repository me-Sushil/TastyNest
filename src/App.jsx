
import { useState, useEffect, useCallback } from "react";
import { Search, Plus, ChefHat } from "lucide-react";
import RecipeCard from "./components/RecipeCard";
import service from "./services/service";
import RecipeDetails from "./components/RecipeDetails";
import RecipeForm from "./components/RecipeForm";

const App = () => {
  const [currentView, setCurrentView] = useState("list");
  const [apiRecipes, setApiRecipes] = useState([]);
  const [localRecipes, setLocalRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize local recipes from memory
  useEffect(() => {
    const savedRecipes = JSON.parse(
      localStorage?.getItem?.("localRecipes") || "[]"
    );
    setLocalRecipes(savedRecipes);
  }, []);

  // Save local recipes to memory
  const saveLocalRecipes = (recipes) => {
    setLocalRecipes(recipes);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("localRecipes", JSON.stringify(recipes));
    }
  };

  // Fetch recipes from API
   const getRecipes = async (searchTerm = "") => {
    setLoading(true);
    try {
      const res = await service.getAll(searchTerm);
      console.log(res.meals);
      setApiRecipes(res.meals || []);
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
      setApiRecipes([]);
    }
    setLoading(false);
  };


  // Debounced search
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const debouncedSearch = useCallback(debounce(getRecipes, 500), []);

  useEffect(() => {
    getRecipes();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    } else {
      getRecipes();
    }
  }, [searchQuery, debouncedSearch]);

  // Transform API recipe to consistent format
  const transformApiRecipe = (meal) => ({
    id: meal.idMeal,
    name: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory,
    area: meal.strArea,
    instructions: meal.strInstructions,
    ingredients: Array.from({ length: 20 }, (_, i) => {
      const ingredient = meal[`strIngredient${i + 1}`];
      const measure = meal[`strMeasure${i + 1}`];
      return ingredient?.trim()
        ? `${measure?.trim() || ""} ${ingredient.trim()}`.trim()
        : null;
    }).filter(Boolean),
    isLocal: false,
  });

  // Save recipe handler
  const handleSaveRecipe = (recipe) => {
    if (editingRecipe) {
      const updated = localRecipes.map((r) =>
        r.id === editingRecipe.id ? recipe : r
      );
      saveLocalRecipes(updated);
    } else {
      saveLocalRecipes([...localRecipes, recipe]);
    }
    setEditingRecipe(null);
    setCurrentView("list");
  };

  // Combine and filter recipes
  const allRecipes = [...localRecipes, ...apiRecipes.map(transformApiRecipe)];

  const filteredRecipes = allRecipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const localFilteredRecipes = localRecipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const apiFilteredRecipes = apiRecipes
    .map(transformApiRecipe)
    .filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ChefHat className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-800">TastyNest</h1>
            </div>

            {currentView === "list" && (
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>
                <button
                  onClick={() => {
                    setEditingRecipe(null);
                    setCurrentView("form");
                  }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  <Plus size={20} />
                  Add Recipe
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === "list" && (
          <div className="space-y-8">
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading recipes...</p>
              </div>
            )}

            {localFilteredRecipes.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Your Recipes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {localFilteredRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      setEditingRecipe={setEditingRecipe}
                      setCurrentView={setCurrentView}
                      saveLocalRecipes={saveLocalRecipes}
                      localRecipes={localRecipes}
                      onClick={() => {
                        setSelectedRecipe(recipe);
                        setCurrentView("detail");
                      }}
                    />
                  ))}
                </div>
              </section>
            )}

            {apiFilteredRecipes.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Discover Recipes {searchQuery && `for "${searchQuery}"`}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {apiFilteredRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onClick={() => {
                        setSelectedRecipe(recipe);
                        setCurrentView("detail");
                      }}
                    />
                  ))}
                </div>
              </section>
            )}

            {!loading && filteredRecipes.length === 0 && (
              <div className="text-center py-12">
                <ChefHat size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  No recipes found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or add a new recipe
                </p>
              </div>
            )}
          </div>
        )}

        {currentView === "detail" && selectedRecipe && (
          <RecipeDetails
            recipe={selectedRecipe}
            setCurrentView={setCurrentView}
          />
        )}
 {currentView === "form" && (
          <RecipeForm
            recipe={editingRecipe}
            onSave={handleSaveRecipe}
            onCancel={() => {
              setEditingRecipe(null);
              setCurrentView("list");
            }}
          />
        )}
      
      </main>
    </div>
  );
};

export default App;
