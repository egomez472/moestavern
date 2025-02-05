import { TestBed } from '@angular/core/testing';
import { CocktailsService } from './cocktails.service';
import { RestService } from '../rest/rest.service';
import { Cocktail } from '../../interfaces/cocktail.interface';
import { of } from 'rxjs';
import { EndpointsConstant } from '../../utils/constants';
import { HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { processCocktailResponse } from '../../utils/functions/cocktails';

describe('CocktailsService', () => {
  let service: CocktailsService;
  let restServiceMock: jasmine.SpyObj<RestService>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const mockRestService = jasmine.createSpyObj('RestService', ['get']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CocktailsService,
        { provide: RestService, useValue: mockRestService },
      ]
    });
    service = TestBed.inject(CocktailsService);
    restServiceMock = TestBed.inject(RestService) as jasmine.SpyObj<RestService>;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería devolver un array vacío si el nombre del cóctel está vacío', (done) => {
    service.getCocktailByName('').subscribe((result) => {
      expect(result).toEqual([]);
      done();
    });
  });

  it('debería devolver un array vacío si el nombre del cóctel es solo espacios', (done) => {
    service.getCocktailByName('   ').subscribe((result) => {
      expect(result).toEqual([]);
      done();
    });
  });

  it('debería devolver un array vacío si el id del cóctel es inválido', (done) => {
    const invalidId = -1; // Un ID que no debería devolver resultados
    service.getCocktailById(invalidId).subscribe((result) => {
      expect(result).toEqual([]); // Asegúrate de que el resultado sea un array vacío
      done();
    });
  });

  it('debería llamar a RestService.get con el servicio getCocktailByName', () => {
    const cocktailName = 'Mojito';
    const mockResponse = { drinks: [] };

    restServiceMock.get.and.returnValue(of(mockResponse));

    service.getCocktailByName(cocktailName).subscribe();

    expect(restServiceMock.get).toHaveBeenCalledWith(
      EndpointsConstant.getCocktailByName,
      jasmine.any(HttpParams)
    );

    const params = restServiceMock.get.calls.mostRecent().args[1] as HttpParams;
    expect(params.get('s')).toBe(cocktailName);
  });

  it('debería llamar a RestService.get con el servicio getCocktailById', () => {
    const cocktailId = 1;
    const mockResponse = { drinks: [] };

    restServiceMock.get.and.returnValue(of(mockResponse));

    service.getCocktailById(1).subscribe();

    expect(restServiceMock.get).toHaveBeenCalledWith(
      EndpointsConstant.getCocktailById,
      jasmine.any(HttpParams)
    );

    const params = restServiceMock.get.calls.mostRecent().args[1] as HttpParams;
    expect(params.get('i')).toBe(cocktailId.toString());
  });

  it('debería devolver un array vacío si el ingrediente del cóctel está vacío', (done) => {
    service.getCocktailByIngredient('').subscribe((result) => {
      expect(result).toEqual([]);
      done();
    });
  });

  it('debería devolver un array vacío si el ingrediente del cóctel es solo espacios', (done) => {
    service.getCocktailByIngredient('   ').subscribe((result) => {
      expect(result).toEqual([]);
      done();
    });
  });

  it('debería llamar a RestService.get con el servicio getCocktailByIngredient', () => {
    const ingredient = 'Gin';
    const mockResponse = { drinks: [] };

    restServiceMock.get.and.returnValue(of(mockResponse));

    service.getCocktailByIngredient(ingredient).subscribe();

    expect(restServiceMock.get).toHaveBeenCalledWith(
      EndpointsConstant.getCocktailByIngredient,
      jasmine.any(HttpParams)
    );

    const params = restServiceMock.get.calls.mostRecent().args[1] as HttpParams;
    expect(params.get('i')).toBe(ingredient);
  });

});
