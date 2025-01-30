import { Cocktail } from "./cocktail.interface";

export interface SearchQuery {
  query: string,
  cocktails: Cocktail[]
}
