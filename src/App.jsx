
import { useState, useEffect, useCallback } from "react";
import { Search, Plus, ChefHat } from "lucide-react";
import service from "./services/service";
const App = () => {
  const [viewMode, setViewMode] = useState("list");
  const [apiData, setApiData] = useState([]);
  const [storedRecipes, setStoredRecipes] = useState([]);
  const [query, setQuery] = useState("");
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load recipes from local storage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("storedRecipes") || "[]");
    setStoredRecipes(saved);
  }, []);

  // Fetch recipes from API

  const getRecipes = async (searchTerm = "") => {
    setIsLoading(true);
    try {
      const res = await service.getAll(searchTerm);
      console.log(res.meals);
      setApiData(res.meals || []);
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
      setApiData([]);
    }
    setIsLoading(false);
  };

  // Debounce helper
  const createDebounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const debouncedFetch = useCallback(createDebounce(getRecipes, 500), []);

  // Initial fetch
  useEffect(() => {
    getRecipes();
  }, []);

  // Watch for search query changes
  useEffect(() => {
    if (query.trim()) {
      debouncedFetch(query);
    } else {
      getRecipes();
    }
  }, [query, debouncedFetch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ChefHat className="text-blue-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-800">TastyNest</h1>
          </div>

          {viewMode === "list" && ( 
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 ">
              <div className="relative w-full md:w-64">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
              </div>
              <button
                onClick={() => {
                  setActiveRecipe(null);
                  setViewMode("form");
                }}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors w-full md:w-auto"              >
                <Plus size={20} />
                Add Recipe
              </button>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default App;
