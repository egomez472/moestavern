import { Injectable } from '@angular/core';
import { Cocktail } from '../../interfaces/cocktail.interface';
import { SearchQuery } from '../../interfaces/search-query.interface';
import { Position } from '../../interfaces/position.interface';
import { BehaviorSubject, Observable } from 'rxjs';
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

  constructor(private storage: StorageService) {
    // Inicializa el estado de cócteles desde el almacenamiento
    const storedCocktailState = this.storage.get(COCKTAIL_KEY);
    this.cocktailStateSubject.next(storedCocktailState || {
      query: '',
      id: '',
      ingredient: '',
      cocktails: [],
      favorites: [],
    });
    this.cocktailState$.subscribe(response => this.storage.save(COCKTAIL_KEY, response));

    // Inicializa la posición desde el almacenamiento
    const storedPosition = this.storage.get(POSITION_KEY);
    this.positionSubject.next(storedPosition || { x: 0, y: 0 });
    this.position$.subscribe(response => this.storage.save(POSITION_KEY, response));
  }

  /**
   * Actualiza la consulta de búsqueda de cócteles.
   * @param query - La nueva consulta de búsqueda.
   */
  setSearchQuery(query: string) {
    this.cocktailStateSubject.next({ ...this.cocktailStateSubject.value, query });
  }

  /**
   * Actualiza el ID del estado del cóctel.
   * @param id - El nuevo ID del cóctel.
   */
  setIdState(id: number) {
    this.cocktailStateSubject.next({ ...this.cocktailStateSubject.value, id });
  }

  /**
   * Actualiza el ingrediente del estado del cóctel.
   * @param ingredient - El nuevo ingrediente.
   */
  setIngredientState(ingredient: string) {
    this.cocktailStateSubject.next({ ...this.cocktailStateSubject.value, ingredient });
  }

  /**
   * Actualiza la lista de cócteles en el estado.
   * @param cocktails - La nueva lista de cócteles.
   */
  setCocktailState(cocktails: Cocktail[]) {
    this.cocktailStateSubject.next({ ...this.cocktailStateSubject.value, cocktails });
  }

  /**
   * Agrega un cóctel a la lista de favoritos.
   * @param cocktail - El cóctel a agregar.
   * @returns Un objeto ActionResponse indicando el resultado de la operación.
   */
  addFavoriteState(cocktail: Cocktail): ActionResponse {
    const favorites = this.getState().favorites;
    const exists = (favorites || []).some(_cocktail => _cocktail.id === cocktail.id);
    if (exists) {
      return { error: true, message: 'Cocktail already exists in favorites', title: 'Add Favorite' };
    } else {
      favorites.unshift(cocktail);
      this.cocktailStateSubject.next({ ...this.cocktailStateSubject.value, favorites });
      return { error: false, message: 'Cocktail added to favorites', title: 'Add Favorite' };
    }
  }

  /**
   * Actualiza la lista de favoritos en el estado.
   * @param favorites - La nueva lista de favoritos.
   */
  setFavoriteListState(favorites: Cocktail[]) {
    this.cocktailStateSubject.next({ ...this.cocktailStateSubject.value, favorites });
  }

  /**
   * Obtiene el estado actual de los cócteles.
   * @returns El estado actual de los cócteles.
   */
  getState(): SearchQuery {
    const state = this.storage.get(COCKTAIL_KEY);
    if (state) {
      this.cocktailStateSubject.next(state);
    }
    return this.cocktailStateSubject.value;
  }

  /**
   * Actualiza la posición del estado.
   * @param x - La nueva coordenada X.
   * @param y - La nueva coordenada Y.
   */
  setPosition(x: number, y: number) {
    this.positionSubject.next({ x, y });
  }

  /**
   * Obtiene la posición actual del estado.
   * @returns La posición actual.
   */
  getPosition() {
    const statePosition = this.storage.get(POSITION_KEY);
    if (statePosition) {
      this.positionSubject.next({ x: statePosition.x, y: statePosition.y });
    }
    return this.positionSubject.value;
  }
}
