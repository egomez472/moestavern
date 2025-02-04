import { TestBed } from '@angular/core/testing';
import { CocktailStateService } from './cocktail-state.service';
import { Cocktail } from '../../interfaces/cocktail.interface';
import { SearchQuery } from '../../interfaces/search-query.interface';
import { Position } from '../../interfaces/position.interface';

describe('CocktailStateService', () => {
  let service: CocktailStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CocktailStateService);
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
      expect(searchQuery.query).toBe(query);
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
      const id = '20';
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
  })
});
