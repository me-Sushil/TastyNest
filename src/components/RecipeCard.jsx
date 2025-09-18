//RecipeCard.jsx


import { Edit2, Trash2 } from "lucide-react";

const RecipeCard = ({
  recipe,
  onClick,
  setEditingRecipe,
  setCurrentView,
  saveLocalRecipes,
  localRecipes,
}) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <img
        src={recipe.image}
        alt={recipe.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {recipe.name}
          </h3>
          {recipe.isLocal && (
            <div className="flex gap-1 ml-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingRecipe(recipe);
                  setCurrentView("form");
                }}
                className="p-1 text-blue-600 hover:bg-blue-100 rounded"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const updated = localRecipes.filter(
                    (r) => r.id !== recipe.id
                  );
                  saveLocalRecipes(updated);
                }}
                className="p-1 text-red-600 hover:bg-red-100 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full inline-block">
          {recipe.category}
        </p>
        {recipe.area && (
          <p className="text-sm text-gray-500 mt-1">{recipe.area}</p>
        )}
        {recipe.isLocal && (
          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-2">
            Local Recipe
          </span>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
