import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./recipe-card";
import "./styles.css";

type SearchMode = "name" | "ingredient" | "category";

interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

interface MealDetail extends MealSummary {
  strArea?: string;
  strCategory?: string;
  strInstructions?: string;
  strSource?: string;
  strYoutube?: string;
  [key: string]: string | undefined;
}

const API_ROOT = "https://www.themealdb.com/api/json/v1/1";
const DEFAULT_QUERY = "chicken";
const DEFAULT_MODE: SearchMode = "ingredient";

@customElement("recipe-search-app")
export class RecipeSearchApp extends LitElement {
  @state() private query = DEFAULT_QUERY;
  @state() private mode: SearchMode = DEFAULT_MODE;
  @state() private meals: MealDetail[] = [];
  @state() private selectedMeal?: MealDetail;
  @state() private favorites = new Set<string>();
  @state() private loading = false;
  @state() private error = "";

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      color: #1f2937;
      background: #f7f3ed;
      font-family:
        Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", sans-serif;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.loadFavorites();
    void this.search();
  }

  render() {
    return html`
      <main class="shell">
        <section class="masthead">
          <div>
            <p class="eyebrow">LitElement recipe finder</p>
            <h1>Search meals, save favorites, and ship it on Codesphere.</h1>
          </div>
          <form class="search" @submit=${this.handleSubmit}>
            <input
              aria-label="Recipe search"
              .value=${this.query}
              @input=${this.handleQueryInput}
              placeholder="Search chicken, pasta, vegan..."
            />
            <select
              aria-label="Search mode"
              .value=${this.mode}
              @change=${this.handleModeChange}
            >
              <option value="ingredient">Ingredient</option>
              <option value="name">Dish name</option>
              <option value="category">Category</option>
            </select>
            <button type="submit" ?disabled=${this.loading}>
              ${this.loading ? "Searching" : "Search"}
            </button>
          </form>
        </section>

        ${this.error ? html`<p class="notice">${this.error}</p>` : nothing}

        <section class="layout">
          <div class="results" aria-live="polite">
            ${this.meals.map(
              (meal) => html`
                <recipe-card
                  .meal=${meal}
                  .favorite=${this.favorites.has(meal.idMeal)}
                  .selected=${this.selectedMeal?.idMeal === meal.idMeal}
                  @open-meal=${() => this.selectMeal(meal)}
                  @toggle-favorite=${() => this.toggleFavorite(meal)}
                ></recipe-card>
              `
            )}
          </div>

          <aside class="details">
            ${this.selectedMeal
              ? this.renderDetails(this.selectedMeal)
              : html`<p>Select a recipe to see ingredients and instructions.</p>`}
          </aside>
        </section>
      </main>
    `;
  }

  private renderDetails(meal: MealDetail) {
    const ingredients = this.getIngredients(meal);

    return html`
      <img src=${meal.strMealThumb} alt=${meal.strMeal} />
      <div class="detail-head">
        <div>
          <span>${meal.strCategory ?? "Recipe"}</span>
          <h2>${meal.strMeal}</h2>
          <p>${meal.strArea ?? "Global"} kitchen</p>
        </div>
        <button type="button" @click=${() => this.toggleFavorite(meal)}>
          ${this.favorites.has(meal.idMeal) ? "Saved" : "Save"}
        </button>
      </div>

      <h3>Ingredients</h3>
      <ul>
        ${ingredients.map((item) => html`<li>${item}</li>`)}
      </ul>

      <h3>Instructions</h3>
      <p class="instructions">${meal.strInstructions}</p>

      <div class="links">
        ${meal.strSource
          ? html`<a href=${meal.strSource} target="_blank" rel="noreferrer"
              >Source</a
            >`
          : nothing}
        ${meal.strYoutube
          ? html`<a href=${meal.strYoutube} target="_blank" rel="noreferrer"
              >Video</a
            >`
          : nothing}
      </div>
    `;
  }

  private async search() {
    const query = this.query.trim();

    if (!query) {
      this.error = "Enter a recipe, category, or ingredient to search.";
      return;
    }

    this.loading = true;
    this.error = "";

    try {
      const endpoint = this.getSearchUrl(query);
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error("The recipe API did not respond successfully.");
      }

      const data = (await response.json()) as { meals: MealSummary[] | null };
      const summaries = data.meals ?? [];
      const details = await Promise.all(
        summaries.slice(0, 12).map((meal) => this.fetchMealDetail(meal.idMeal))
      );

      this.meals = details.filter((meal): meal is MealDetail => Boolean(meal));
      this.selectedMeal = this.meals[0];
      this.error = this.meals.length
        ? ""
        : "No recipes found. Try another ingredient or category.";
    } catch (error) {
      this.error =
        error instanceof Error
          ? error.message
          : "Something went wrong while searching recipes.";
    } finally {
      this.loading = false;
    }
  }

  private getSearchUrl(query: string) {
    const encoded = encodeURIComponent(query);

    if (this.mode === "ingredient") {
      return `${API_ROOT}/filter.php?i=${encoded}`;
    }

    if (this.mode === "category") {
      return `${API_ROOT}/filter.php?c=${encoded}`;
    }

    return `${API_ROOT}/search.php?s=${encoded}`;
  }

  private async fetchMealDetail(id: string) {
    const response = await fetch(`${API_ROOT}/lookup.php?i=${id}`);
    const data = (await response.json()) as { meals: MealDetail[] | null };

    return data.meals?.[0];
  }

  private getIngredients(meal: MealDetail) {
    return Array.from({ length: 20 }, (_, index) => {
      const number = index + 1;
      const ingredient = meal[`strIngredient${number}`]?.trim();
      const measure = meal[`strMeasure${number}`]?.trim();

      if (!ingredient) {
        return "";
      }

      return [measure, ingredient].filter(Boolean).join(" ");
    }).filter(Boolean);
  }

  private selectMeal(meal: MealDetail) {
    this.selectedMeal = meal;
  }

  private toggleFavorite(meal: MealDetail) {
    const next = new Set(this.favorites);

    if (next.has(meal.idMeal)) {
      next.delete(meal.idMeal);
    } else {
      next.add(meal.idMeal);
    }

    this.favorites = next;
    localStorage.setItem("favorite-recipes", JSON.stringify([...next]));
  }

  private loadFavorites() {
    try {
      const raw = localStorage.getItem("favorite-recipes");
      this.favorites = new Set(raw ? (JSON.parse(raw) as string[]) : []);
    } catch {
      this.favorites = new Set();
    }
  }

  private handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    void this.search();
  }

  private handleQueryInput(event: InputEvent) {
    this.query = (event.target as HTMLInputElement).value;
  }

  private handleModeChange(event: Event) {
    this.mode = (event.target as HTMLSelectElement).value as SearchMode;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "recipe-search-app": RecipeSearchApp;
  }
}
