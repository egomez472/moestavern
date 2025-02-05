import { TestBed } from '@angular/core/testing';
import { CocktailStateService } from './cocktail-state.service';
import { Cocktail } from '../../interfaces/cocktail.interface';
import { SearchQuery } from '../../interfaces/search-query.interface';
import { Position } from '../../interfaces/position.interface';
import { BehaviorSubject } from 'rxjs';

describe('CocktailStateService', () => {
  let service: CocktailStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CocktailStateService);
    service['cocktailStateSubject'].next({
      query: '',
      id: '',
      ingredient: '',
      cocktails: [],
      favorites: []
    })
  });

  it('deberia crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  describe('setSearchQuery', () => {
    it('deberia setear la query en el state', () => {
      const query = 'Mojito';
      service.setSearchQuery(query);
      const searchQuery: SearchQuery = service.getState();
      expect(searchQuery.query).toBe(query);
    });
  });

  describe('setCocktailState', () => {
    it('deberia setear y retornar los cocktails en el state', () => {
      const cocktails: Cocktail[] = [
        { id: 1, img: 'img.png', name: 'Mojito', ingredients: [{name: 'Rum', measure: '1 oz'}], instructions: {EN:'',DE:'',ES:'',FR:'',IT:''} },
        { id: 2, img: 'img.png', name: 'Daiquiri', ingredients: [{name: 'Rum', measure: '1 oz'}], instructions: {EN:'',DE:'',ES:'',FR:'',IT:''} }
      ];
      service.setCocktailState(cocktails);
      const searchQuery: SearchQuery = service.getState();
      expect(searchQuery.cocktails).toEqual(cocktails);
    });
  });

  describe('getSearchQuery', () => {
    it('deberia setear y retornar la query actual', () => {
      const query = 'Margarita';
      service.setSearchQuery(query);
      const searchQuery: SearchQuery = service.getState();
      expect(searchQuery.query).toBe('Margarita');
    });
  });

  describe('setPosition', () => {
    it('deberia setear la posicion', () => {
      const x = 10;
      const y = 20;
      service.setPosition(x, y);
      const position: Position = service.getPosition();
      expect(position).toEqual({ x, y });
    });
  });

  describe('getPosition', () => {
    it('deberia retornar la posicion', () => {
      const x = 5;
      const y = 15;
      service.setPosition(x, y);
      const position: Position = service.getPosition();
      expect(position).toEqual({ x, y });
    });
  });

  describe('getIdState', () => {
    it('deberia setear y retornar el id del state', () => {
      const id = 20;
      service.setIdState(id);
      const idState: SearchQuery = service.getState();
      expect(idState.id).toEqual(id);
    });
  });

  describe('getIngredientState', () => {
    it('deberia setear y retornar el ingrediente del state', () => {
      const ingredient = 'Rum';
      service.setIngredientState(ingredient);
      const ingredientState: SearchQuery = service.getState();
      expect(ingredientState.ingredient).toEqual(ingredient);
    });
  });

  describe('addFavoriteState', () => {
    it('debería retornar un objeto ActionResponse cuando el cóctel ya existe en favoritos', () => {
      const cocktailMock: Cocktail = {
        id: 1,
        img: 'img.png',
        name: 'Mojito',
        ingredients: [{ name: 'Rum', measure: '1 oz' }],
        instructions: { EN: '', DE: '', ES: '', FR: '', IT: '' }
      };

      service['cocktailStateSubject'].next({
        query: '',
        id: '',
        ingredient: '',
        cocktails: [],
        favorites: [cocktailMock]
      });

      const response = service.addFavoriteState(cocktailMock);

      expect(response.error).toBeTrue();
      expect(response.message).toBe('Cocktail already exists in favorites');
      expect(response.title).toBe('Add Favorite');
      expect(service['cocktailStateSubject'].value.favorites.length).toBe(1);
    });

    it('debería agregar el cóctel a favoritos y emitir un nuevo estado cuando no existe en favoritos', () => {
      const cocktailMock: Cocktail = {
        id: 2,
        img: 'img.png',
        name: 'Daiquiri',
        ingredients: [{ name: 'Rum', measure: '1 oz' }],
        instructions: { EN: '', DE: '', ES: '', FR: '', IT: '' }
      };

      service['cocktailStateSubject'].next({
        query: '',
        id: '',
        ingredient: '',
        cocktails: [],
        favorites: []
      })

      const response = service.addFavoriteState(cocktailMock);
      expect(response.error).toBeFalse();
      expect(response.message).toBe('Cocktail added to favorites');
      expect(service.getState().favorites).toContain(cocktailMock);

      expect(service['cocktailStateSubject'].value.favorites.length).toBe(1);
      expect(service['cocktailStateSubject'].value.favorites[0]).toEqual(cocktailMock);
      expect(service['cocktailStateSubject'].value.favorites[0].name).toEqual('Daiquiri');
    });
  })

  describe('setFavoriteListState', () => {
    it('debería actualizar el estado de favorites cuando se llama a setFavoriteListState', () => {
      const cocktailMock1: Cocktail = {
        id: 1,
        img: 'img1.png',
        name: 'Mojito',
        ingredients: [{ name: 'Rum', measure: '1 oz' }],
        instructions: { EN: '', DE: '', ES: '', FR: '', IT: '' }
      };

      const cocktailMock2: Cocktail = {
        id: 2,
        img: 'img2.png',
        name: 'Daiquiri',
        ingredients: [{ name: 'Rum', measure: '1 oz' }],
        instructions: { EN: '', DE: '', ES: '', FR: '', IT: '' }
      };

      service.setFavoriteListState([cocktailMock1, cocktailMock2]);

      expect(service['cocktailStateSubject'].value.favorites.length).toBe(2);
      expect(service['cocktailStateSubject'].value.favorites).toEqual([cocktailMock1, cocktailMock2]);
    });
  })
});
