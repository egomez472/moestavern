import { Injectable } from '@angular/core';
import { EndpointsConstant } from '../../utils/constants';
import { HttpParams } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { RestService } from '../rest/rest.service';
import { processCocktailResponse } from '../../utils/functions/cocktails';
import { Cocktail } from '../../interfaces/cocktail.interface';

@Injectable({
  providedIn: 'root'
})
export class CocktailsService {

  constructor(
    private restSvc: RestService
  ) { }

  /**
 * Obtiene una lista de cócteles a partir del nombre proporcionado.
 *
 * @param cocktailName - El nombre del cóctel que se desea buscar.
 *                      Debe ser una cadena no vacía.
 * @returns Un Observable que emite un array de cócteles.
 *          Si el nombre del cóctel está vacío o solo contiene espacios,
 *          se emite un array vacío.
 *
 * @throws {Error} Si el nombre del cóctel es inválido, se registra un error en la consola.
 *
 * Este método realiza una solicitud HTTP a un servicio REST para obtener
 * los cócteles que coinciden con el nombre proporcionado. Utiliza
 * `HttpParams` para establecer los parámetros de la consulta y
 * transforma la respuesta con el pipe map utilizando la función `processCocktailResponse`.
 */
  getCocktailByName(cocktailName: string): Observable<Cocktail[]> {

    if (!cocktailName || cocktailName.trim() === '') {
      console.error('El nombre del cóctel no puede estar vacío.');
      return of([]);
    };

    const params = new HttpParams().set('s', cocktailName);

    return this.restSvc.get<{drinks: any[]}>(EndpointsConstant.getCocktailByName, params).pipe(
      map((response) => processCocktailResponse(response))
    );
  };

  /**
 * Obtiene un cóctel.
 *
 * @param cocktailId - El id del cóctel que se desea buscar.
 * @returns Un Observable que emite un objeto con el cóctel encontrado.
 *
 * @throws {Error} Si el id del cóctel es inválido, se registra un error en la consola.
 *
 * Este método realiza una solicitud HTTP a un servicio REST para obtener
 * un cócteles que coincida con el id proporcionado. Utiliza
 * `HttpParams` para establecer el parámetro de la consulta y
 * transforma la respuesta con el pipe map utilizando la función `processCocktailResponse`.
 */
  getCocktailById(cocktailId: number): Observable<Cocktail | null> {
    const params = new HttpParams().set('i', cocktailId.toString());

    return this.restSvc.get<{drinks: any[]}>(EndpointsConstant.getCocktailById, params).pipe(
      map((response) => processCocktailResponse(response)[0])
    )
  }

}
