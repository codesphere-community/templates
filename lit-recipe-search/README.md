# LitElement Recipe Search

A Codesphere-ready LitElement recipe search template powered by the free [TheMealDB](https://www.themealdb.com/api.php) public API.

## Features

- Search recipes by ingredient, dish name, or category
- View recipe photos, category, area, ingredients, and instructions
- Save favorite recipes in local storage
- Responsive Lit web components with Vite
- No API key required

## Run Locally

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

## Deploy On Codesphere

Create a Codesphere workspace from this template and run the included CI pipeline:

1. `prepare` installs dependencies and builds the production bundle.
2. `run` serves the built app on port `3000`.

No extra API credentials are required. The template uses TheMealDB public endpoints:

- `https://www.themealdb.com/api/json/v1/1/search.php?s=`
- `https://www.themealdb.com/api/json/v1/1/filter.php?i=`
- `https://www.themealdb.com/api/json/v1/1/filter.php?c=`
- `https://www.themealdb.com/api/json/v1/1/lookup.php?i=`

## Customize

- Update `src/recipe-search-app.ts` to add more filters or a different recipe provider.
- Update `src/styles.css` to match your brand.
- If your recipe API requires credentials, add the needed variables in Codesphere and document them here.
