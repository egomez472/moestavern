import { Cocktail } from '../../interfaces/cocktail.interface';
import { processCocktailResponse, extractIngredients, mapCocktail } from './cocktails';

describe('Cocktail Processing Functions', () => {

  describe('processCocktailResponse', () => {
    it('debería devolver un array vacío si la respuesta es nula', () => {
      const result = processCocktailResponse(null);
      expect(result).toEqual([]);
    });

    it('debería devolver un array vacío si la respuesta no contiene drinks', () => {
      const result = processCocktailResponse({ drinks: [] });
      expect(result).toEqual([]);
    });

    it('debería devolver un array vacío si drinks no es un array', () => {
      const result = processCocktailResponse({ drinks: '' });
      expect(result).toEqual([]);
    });

    it('debería procesar correctamente la respuesta y devolver un array de cócteles', () => {
      const mockResponse = {
        drinks: [
          {
            idDrink: '11000',
            strDrink: 'Mojito',
            strDrinkThumb: 'http://example.com/mojito.jpg',
            strInstructions: 'Mix ingredients.',
            strInstructionsDE: 'Zutaten mischen.',
            strInstructionsES: 'Mezclar ingredientes.',
            strInstructionsFR: 'Mélanger les ingrédients.',
            strInstructionsIT: 'Mescolare gli ingredienti.',
            strIngredient1: 'Rum',
            strMeasure1: '50ml',
            strIngredient2: 'Mint',
            strMeasure2: '10 leaves'
          }
        ]
      };

      const result = processCocktailResponse(mockResponse);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual({
        id: 11000,
        img: 'http://example.com/mojito.jpg',
        name: 'Mojito',
        ingredients: [
          { name: 'Rum', measure: '50ml' },
          { name: 'Mint', measure: '10 leaves' }
        ],
        instructions: {
          EN: 'Mix ingredients.',
          DE: 'Zutaten mischen.',
          ES: 'Mezclar ingredientes.',
          FR: 'Mélanger les ingrédients.',
          IT: 'Mescolare gli ingredienti.',
        },
      });
    });
  });

  describe('extractIngredients', () => {
    it('debería devolver un array vacío si no hay ingredientes', () => {
      const result = extractIngredients({});
      expect(result).toEqual([]);
    });

    it('debería extraer ingredientes y medidas correctamente', () => {
      const mockItem = {
        strIngredient1: 'Rum',
        strMeasure1: '50ml',
        strIngredient2: 'Mint',
        strMeasure2: '10 leaves',
        strIngredient3: null,
        strMeasure3: null,
      };

      const result = extractIngredients(mockItem);
      expect(result).toEqual([
        { name: 'Rum', measure: '50ml' },
        { name: 'Mint', measure: '10 leaves' }
      ]);
    });

    it('debería devolver medidas vacías si no están especificadas', () => {
      const mockItem = {
        strIngredient1: 'Rum',
        strMeasure1: '',
        strIngredient2: 'Mint',
        strMeasure2: null,
      };

      const result = extractIngredients(mockItem);
      expect(result).toEqual([
        { name: 'Rum', measure: '' },
        { name: 'Mint', measure: '' }
      ]);
    });
  });

  describe('mapCocktail', () => {
    it('debería mapear un objeto de cóctel correctamente', () => {
      const mockItem = {
        idDrink: '11000',
        strDrink: 'Mojito',
        strDrinkThumb: 'http://example.com/mojito.jpg',
        strInstructions: 'Mix ingredients.',
        strInstructionsDE: 'Zutaten mischen.',
        strInstructionsES: 'Mezclar ingredientes.',
        strInstructionsFR: 'Mélanger les ingrédients.',
        strInstructionsIT: 'Mescolare gli ingredienti.',
        strIngredient1: 'Rum',
        strMeasure1: '50ml',
        strIngredient2: 'Mint',
        strMeasure2: '10 leaves'
      };

      const expectedResult: Cocktail = {
        id: 11000,
        img: 'http://example.com/mojito.jpg',
        name: 'Mojito',
        ingredients: [
          { name: 'Rum', measure: '50ml' },
          { name: 'Mint', measure: '10 leaves' }
        ],
        instructions: {
          EN: 'Mix ingredients.',
          DE: 'Zutaten mischen.',
          ES: 'Mezclar ingredientes.',
          FR: 'Mélanger les ingrédients.',
          IT: 'Mescolare gli ingredienti.',
        },
      };

      const result = mapCocktail(mockItem);
      expect(result).toEqual(expectedResult);
    });

    it('debería manejar correctamente los campos faltantes', () => {
      const mockItem = {
        idDrink: '11001',
        strDrink: 'Daiquiri',
        strDrinkThumb: null,
        strInstructions: '',
        strInstructionsDE: '',
        strInstructionsES: '',
        strInstructionsFR: '',
        strInstructionsIT: '',
        strIngredient1: null,
        strMeasure1: null,
      };

      const mockItem2 = {
        idDrink: '11001',
        strDrink: null,
        strDrinkThumb: null,
        strInstructions: '',
        strInstructionsDE: '',
        strInstructionsES: '',
        strInstructionsFR: '',
        strInstructionsIT: '',
        strIngredient1: null,
        strMeasure1: null,
      };

      const expectedResult: Cocktail = {
        id: 11001,
        img: '',
        name: 'Daiquiri',
        ingredients: [],
        instructions: {
          EN: '',
          DE: '',
          ES: '',
          FR: '',
          IT: '',
        },
      };

      const expectedResult2: Cocktail = {
        id: 11001,
        img: '',
        name: '',
        ingredients: [],
        instructions: {
          EN: '',
          DE: '',
          ES: '',
          FR: '',
          IT: '',
        },
      };

      const result = mapCocktail(mockItem);
      const result2 = mapCocktail(mockItem2);
      expect(result).toEqual(expectedResult);
      expect(result2).toEqual(expectedResult2);
    });
  });
});
