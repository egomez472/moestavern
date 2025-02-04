import { Injectable } from '@angular/core';
import { Cocktail } from '../../interfaces/cocktail.interface';
import { SearchQuery } from '../../interfaces/search-query.interface';
import { Position } from '../../interfaces/position.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from '../storage.service';

const COCKTAIL_KEY: string = 'cocktailState';
const POSITION_KEY: string = 'statePosition';
@Injectable({
  providedIn: 'root'
})
export class CocktailStateService {

  private cocktailStateSubject: BehaviorSubject<SearchQuery> = new BehaviorSubject<SearchQuery>({
    query: '',
    cocktails: []
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
    }
    this.cocktailState$.subscribe((response: SearchQuery) => {
      this.storage.save(COCKTAIL_KEY, response);
    });

    if(this.storage.get(POSITION_KEY)) {
      this.positionSubject.next(this.storage.get(POSITION_KEY));
    }
    this.position$.subscribe((response: Position) => {
      this.storage.save(POSITION_KEY, response);
    })
  };

  setSearchQuery(query: string) {
    this.cocktailStateSubject.next({ ...this.cocktailStateSubject.value, query });
  }

  setCocktailState(cocktails: Cocktail[]) {
    this.cocktailStateSubject.next({ ...this.cocktailStateSubject.value, cocktails });
  }

  getSearchQuery(): SearchQuery {
    const state = this.storage.get(COCKTAIL_KEY)
    if(state) {
      this.cocktailStateSubject.next({ query: state.query, cocktails: state.cocktails });
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
