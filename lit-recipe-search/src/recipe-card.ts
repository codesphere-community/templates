import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
}

@customElement("recipe-card")
export class RecipeCard extends LitElement {
  @property({ type: Object }) meal!: MealSummary;
  @property({ type: Boolean }) favorite = false;
  @property({ type: Boolean }) selected = false;

  static styles = css`
    :host {
      display: block;
    }

    article {
      display: grid;
      grid-template-columns: 92px 1fr auto;
      gap: 16px;
      align-items: center;
      min-height: 112px;
      padding: 12px;
      border: 1px solid #e1d8cc;
      border-radius: 8px;
      background: #fffaf3;
      box-shadow: 0 10px 30px rgb(47 35 23 / 8%);
    }

    article.selected {
      border-color: #1f7a5b;
      box-shadow: 0 12px 34px rgb(31 122 91 / 16%);
    }

    img {
      width: 92px;
      height: 88px;
      border-radius: 6px;
      object-fit: cover;
    }

    h2 {
      margin: 0 0 6px;
      font-size: 1rem;
      line-height: 1.25;
    }

    p {
      margin: 0;
      color: #6f665c;
      font-size: 0.9rem;
    }

    button {
      border: 0;
      border-radius: 6px;
      min-width: 40px;
      min-height: 40px;
      cursor: pointer;
      background: #efe4d4;
      color: #2b2118;
      font-weight: 700;
    }

    .open {
      cursor: pointer;
    }

    @media (max-width: 640px) {
      article {
        grid-template-columns: 78px 1fr auto;
      }

      img {
        width: 78px;
        height: 78px;
      }
    }
  `;

  render() {
    return html`
      <article class=${this.selected ? "selected" : ""}>
        <img src=${this.meal.strMealThumb} alt=${this.meal.strMeal} />
        <div class="open" @click=${this.openMeal}>
          <h2>${this.meal.strMeal}</h2>
          <p>${[this.meal.strCategory, this.meal.strArea].filter(Boolean).join(" / ")}</p>
        </div>
        <button
          type="button"
          aria-label=${this.favorite ? "Remove favorite" : "Save favorite"}
          @click=${this.toggleFavorite}
        >
          ${this.favorite ? "Saved" : "Save"}
        </button>
      </article>
    `;
  }

  private openMeal() {
    this.dispatchEvent(new CustomEvent("open-meal", { bubbles: true }));
  }

  private toggleFavorite() {
    this.dispatchEvent(new CustomEvent("toggle-favorite", { bubbles: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "recipe-card": RecipeCard;
  }
}
