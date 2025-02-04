import { Cocktail } from "./cocktail.interface";

export interface SearchQuery {
  query: string,
  id: string,
  ingredient: string,
  cocktails: Cocktail[]
}
