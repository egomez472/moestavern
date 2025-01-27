export interface Cocktail {
  id: number;
  img: string;
  name: string;
  ingredients: Ingredient[]
  instructions: Instructions;
}

interface Instructions {
  EN: string;
  DE: string;
  ES: string;
  FR: string;
  IT: string;
}

interface Ingredients {
  ingredient1: Ingredient;
  ingredient2: Ingredient;
  ingredient3: Ingredient;
  ingredient4: Ingredient;
  ingredient5: Ingredient;
  ingredient6: Ingredient;
  ingredient7: Ingredient;
  ingredient8: Ingredient;
  ingredient9: Ingredient;
  ingredient10: Ingredient;
  ingredient11: Ingredient;
  ingredient12: Ingredient;
  ingredient13: Ingredient;
  ingredient14: Ingredient;
  ingredient15: Ingredient;
}

export interface Ingredient {
  name: string;
  measure: string;
}
