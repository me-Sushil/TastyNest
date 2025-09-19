🍲 TastyNest – Recipe Management App

TastyNest is a recipe management and discovery application where you can search recipes from an external API, save your own custom recipes, and manage them with ease.
Think of it as your personal cooking assistant 👨‍🍳 – only less messy than your actual kitchen.

✨ Features
🔍 Search Recipes – Find recipes from TheMealDB API
📝 Save Your Own Recipes – Store your family’s secret dishes locally (via LocalStorage)
👀 View Details – Ingredients, instructions, categories & more in a clean UI
✏️ Edit & Delete – Full CRUD for your personal recipes
⚡ Debounced Search – Optimized searching experience
📱 Responsive Design – Works smoothly across devices

🛠️ Tech Stack
Frontend: React + Vite
Styling: Tailwind CSS
Icons: Lucide React
API: TheMealDB
Storage: LocalStorage (for custom recipes)

🚀 Getting Started
1. Clone the repository
git clone https://github.com/me-Sushil/tastynest.git
cd tastynest

2. Install dependencies
npm install

3. Set up environment variables
Create a .env file in the root directory:
VITE_URL=https://www.themealdb.com/api/json/v1/1/search.php?s=

4. Run the app
npm run dev


Now visit 👉 http://localhost:5173

📂 Project Structure
src/
│── components/
│   ├── RecipeCard.jsx
│   ├── RecipeDetails.jsx
│   ├── RecipeForm.jsx
│── services/
│   └── service.js
│── App.jsx
│── main.jsx
