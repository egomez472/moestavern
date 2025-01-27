import { Cocktail, Ingredient } from "../../interfaces/cocktail.interface";

/**
   * Procesa la respuesta del servicio para convertir los datos en un formato usable.
   * @param response Respuesta del servicio
   * @returns Lista de cócteles procesada
   */
export function processCocktailResponse(response: { drinks: any[] } | null): Cocktail[] {
  if (!response?.drinks || !Array.isArray(response.drinks)) {
    console.warn('La respuesta no contiene datos válidos.');
    return [];
  }

  return response.drinks.map((item: any) => mapCocktail(item));
}

/**
 * Mapea los datos de un cóctel individual a un objeto tipo `Cocktail`.
 * @param item Elemento del array de cócteles
 * @returns Objeto `Cocktail` procesado
 */
function mapCocktail(item: any): Cocktail {
  return {
    id: parseInt(item.idDrink, 10),
    img: item.strDrinkThumb || '',
    name: item.strDrink || '',
    ingredients: extractIngredients(item),
    instructions: {
      EN: item.strInstructions || '',
      DE: item.strInstructionsDE || '',
      ES: item.strInstructionsES || '',
      FR: item.strInstructionsFR || '',
      IT: item.strInstructionsIT || '',
    },
  };
}

/**
 * Extrae y transforma los ingredientes y sus medidas desde un objeto de datos de cóctel.
 *
 * Este método recorre dinámicamente las propiedades `strIngredient1` a `strIngredient15`
 * y `strMeasure1` a `strMeasure15` del objeto proporcionado, para construir un arreglo
 * de objetos `Ingredient`. Solo se incluyen aquellos ingredientes que no sean nulos o
 * indefinidos.
 *
 * @param item - Objeto que contiene los datos del cóctel, incluyendo las propiedades
 *               `strIngredientX` y `strMeasureX`, donde `X` es un índice del 1 al 15.
 * @returns Un arreglo de objetos `Ingredient`, cada uno con las propiedades:
 *          - `name` (nombre del ingrediente).
 *          - `measure` (medida del ingrediente; si no está especificada, se asigna una cadena vacía).
 *
*/
export function extractIngredients(item: any): Ingredient[] {
  const ingredients: Ingredient[] = [];
  for (let i = 1; i <= 15; i++) {
    const ingredientName = item[`strIngredient${i}`];
    const measure = item[`strMeasure${i}`];
    if (ingredientName) {
      ingredients.push({
        name: ingredientName,
        measure: measure || '',
      });
    }
  }
  return ingredients;
}
