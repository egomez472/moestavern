export class EndpointsConstant {
  public static baseUrl: string = 'https://www.thecocktaildb.com/api/json/v1/1/'

  public static getCocktailByName: string = `${this.baseUrl}search.php`;
  public static getCocktailById: string = `${this.baseUrl}lookup.php`;
  public static getCocktailByIngredient: string = `${this.baseUrl}filter.php`;
}
