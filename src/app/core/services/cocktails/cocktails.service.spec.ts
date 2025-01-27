import { TestBed } from '@angular/core/testing';

import { CocktailsService } from './cocktails.service';
import { RestService } from '../rest/rest.service';

describe('CocktailsService', () => {
  let service: CocktailsService;
  let restServiceSpy: jasmine.SpyObj<RestService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('RestService', ['get']);
    TestBed.configureTestingModule({
      providers: [
        CocktailsService,
        { provide: RestService, useValue: spy },
      ]
    });
    service = TestBed.inject(CocktailsService);
    restServiceSpy = TestBed.inject(RestService) as jasmine.SpyObj<RestService>;
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería inyectar RestService correctamente', () => {
    expect(restServiceSpy).toBeTruthy();
  });
});
