// RecipeDetails.jsx

import { ChefHat, ArrowLeft } from "lucide-react";

const RecipeDetails = ({ recipe, setCurrentView }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <button
        onClick={() => setCurrentView("list")}
        className="m-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
      >
        <ArrowLeft size={20} />
        Back to Recipes
      </button>

      <div className="px-6 pb-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full rounded-lg shadow-md"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {recipe.name}
            </h1>
            <div className="flex gap-4 mb-6">
              <span className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                <ChefHat size={16} />
                {recipe.category}
              </span>
              {recipe.area && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  {recipe.area}
                </span>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Ingredients
              </h3>
              <ul className="space-y-2">
                {recipe.ingredients?.map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Instructions
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {recipe.instructions}
          </p>
        </div>
      </div>
    </div>
  );
};
export default RecipeDetails;
