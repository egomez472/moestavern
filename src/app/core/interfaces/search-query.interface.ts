import { Cocktail } from "./cocktail.interface";

export interface SearchQuery {
  query: string,
  id: number | string,
  ingredient: string,
  cocktails: Cocktail[],
  favorites: Cocktail[]
}
