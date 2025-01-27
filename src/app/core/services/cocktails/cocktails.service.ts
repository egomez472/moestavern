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

}
