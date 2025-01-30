import { TestBed } from '@angular/core/testing';
import { CocktailsService } from './cocktails.service';
import { RestService } from '../rest/rest.service';
import { Cocktail } from '../../interfaces/cocktail.interface';
import { of } from 'rxjs';
import { EndpointsConstant } from '../../utils/constants';
import { HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

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

});
