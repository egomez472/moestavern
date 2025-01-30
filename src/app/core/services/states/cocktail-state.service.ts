import { Injectable } from '@angular/core';
import { Cocktail } from '../../interfaces/cocktail.interface';
import { SearchQuery } from '../../interfaces/search-query.interface';
import { Position } from '../../interfaces/position.interface';

@Injectable({
  providedIn: 'root'
})
export class CocktailStateService {

  private searchQuery: SearchQuery = {
    query: '',
    cocktails: []
  };
  private position: Position = {
    x: 0,
    y: 0
  };

  setSearchQuery(query: string) {
    this.searchQuery.query = query;
  }

  setCocktailState(cocktails: Cocktail[]) {
    this.searchQuery.cocktails = cocktails;
  }

  getSearchQuery(): SearchQuery {
    return this.searchQuery;
  }

  setPosition(x: number, y: number) {
    this.position = { x, y };
  }

  getPosition() {
    return this.position;
  }
}
