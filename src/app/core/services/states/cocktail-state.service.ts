import { Injectable } from '@angular/core';
import { Cocktail } from '../../interfaces/cocktail.interface';
import { SearchQuery } from '../../interfaces/search-query.interface';
import { Position } from '../../interfaces/position.interface';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { StorageService } from '../storage.service';
import { ActionResponse } from '../../interfaces/actions-response.interface';

const COCKTAIL_KEY: string = 'cocktailState';
const POSITION_KEY: string = 'statePosition';
const FAVORITES_KEY: string = 'favorites';
@Injectable({
  providedIn: 'root'
})
export class CocktailStateService {

  private cocktailStateSubject: BehaviorSubject<SearchQuery> = new BehaviorSubject<SearchQuery>({
    query: '',
    id: '',
    ingredient: '',
    cocktails: [],
    favorites: [],
  });
  public cocktailState$: Observable<SearchQuery> = this.cocktailStateSubject.asObservable();

  private positionSubject: BehaviorSubject<Position> = new BehaviorSubject<Position>({
    x: 0,
    y: 0
  });
  public position$: Observable<Position> = this.positionSubject.asObservable();

  constructor(
    private storage: StorageService
  ) {
    if(this.storage.get(COCKTAIL_KEY)) {
      this.cocktailStateSubject.next(this.storage.get(COCKTAIL_KEY));
    } else {
      this.cocktailStateSubject.next({
        query: '',
        id: '',
        ingredient: '',
        cocktails: [],
        favorites: [],
      });
    }
    this.cocktailState$.subscribe((response: SearchQuery) => {
      this.storage.save(COCKTAIL_KEY, response);
    });

    if(this.storage.get(POSITION_KEY)) {
      this.positionSubject.next(this.storage.get(POSITION_KEY));
    } else {
      this.positionSubject.next({
        x: 0,
        y: 0
      });
    }
    this.position$.subscribe((response: Position) => {
      this.storage.save(POSITION_KEY, response);
    });
  };

  setSearchQuery(query: string) {
    this.cocktailStateSubject.next({ ...this.cocktailStateSubject.value, query });
  }

  setIdState(id: number) {
    this.cocktailStateSubject.next({...this.cocktailStateSubject.value, id});
  }

  setIngredientState(ingredient: string) {
    this.cocktailStateSubject.next({...this.cocktailStateSubject.value, ingredient});
  }

  setCocktailState(cocktails: Cocktail[]) {
    this.cocktailStateSubject.next({ ...this.cocktailStateSubject.value, cocktails });
  }

  addFavoriteState(cocktail: Cocktail): ActionResponse {
    const favorites = this.getState().favorites;
    const exists = (favorites||[]).some(_cocktail => _cocktail.id === cocktail.id);
    if(exists) {
      return {error: true, message: 'Cocktail already exists in favorites', title: 'Add Favorite'}
    } else {
      favorites.unshift(cocktail);
      this.cocktailStateSubject.next({ ...this.cocktailStateSubject.value, favorites });
      return {error: false, message: 'Cocktail added to favorites', title: 'Add Favorite'}
    }
  }

  setFavoriteListState(favorites: Cocktail[]) {
    this.cocktailStateSubject.next({ ...this.cocktailStateSubject.value, favorites });
  }

  getState(): SearchQuery {
    const state = this.storage.get(COCKTAIL_KEY);
    if(state) {
      this.cocktailStateSubject.next(state);
    }
    return this.cocktailStateSubject.value;
  }

  setPosition(x: number, y: number) {
    this.positionSubject.next({x, y});
  }

  getPosition() {
    const statePosition = this.storage.get(POSITION_KEY)
    if(statePosition) {
      this.positionSubject.next({x:statePosition.x, y:statePosition.y});
    }
    return this.positionSubject.value;
  }
}
