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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setSearchQuery', () => {
    it('should set the search query', () => {
      const query = 'Mojito';
      service.setSearchQuery(query);
      const searchQuery: SearchQuery = service.getSearchQuery();
      expect(searchQuery.query).toBe(query);
    });
  });

  describe('setCocktailState', () => {
    it('should set the cocktails', () => {
      const cocktails: Cocktail[] = [
        { id: 1, img: 'img.png', name: 'Mojito', ingredients: [{name: 'Rum', measure: '1 oz'}], instructions: {EN:'',DE:'',ES:'',FR:'',IT:''} },
        { id: 2, img: 'img.png', name: 'Daiquiri', ingredients: [{name: 'Rum', measure: '1 oz'}], instructions: {EN:'',DE:'',ES:'',FR:'',IT:''} }
      ];
      service.setCocktailState(cocktails);
      const searchQuery: SearchQuery = service.getSearchQuery();
      expect(searchQuery.cocktails).toEqual(cocktails);
    });
  });

  describe('getSearchQuery', () => {
    it('should return the current search query', () => {
      const query = 'Margarita';
      service.setSearchQuery(query);
      const searchQuery: SearchQuery = service.getSearchQuery();
      expect(searchQuery.query).toBe(query);
    });
  });

  describe('setPosition', () => {
    it('should set the position', () => {
      const x = 10;
      const y = 20;
      service.setPosition(x, y);
      const position: Position = service.getPosition();
      expect(position).toEqual({ x, y });
    });
  });

  describe('getPosition', () => {
    it('should return the current position', () => {
      const x = 5;
      const y = 15;
      service.setPosition(x, y);
      const position: Position = service.getPosition();
      expect(position).toEqual({ x, y });
    });
  });
});
