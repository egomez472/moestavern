import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocktailDetailComponent } from './cocktail-detail.component';
import { CocktailsService } from '../../core/services/cocktails/cocktails.service';
import { Router } from '@angular/router';
import { Cocktail } from '../../core/interfaces/cocktail.interface';
import { of } from 'rxjs';

describe('CocktailDetailComponent', () => {
  let component: CocktailDetailComponent;
  let fixture: ComponentFixture<CocktailDetailComponent>;
  let cocktailServiceSpy: jasmine.SpyObj<CocktailsService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const cocktailSvcSpy = jasmine.createSpyObj('CocktailsService', ['getCocktailById']);
    const routerSvcSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CocktailDetailComponent],
      providers: [
        {provide: CocktailsService, useValue: cocktailSvcSpy},
        { provide: Router, useValue: routerSvcSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CocktailDetailComponent);
    component = fixture.componentInstance;
    cocktailServiceSpy = TestBed.inject(CocktailsService) as jasmine.SpyObj<CocktailsService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('deberia crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('deberia llamar a getCocktail al iniciarse el componente', () => {
    const cocktailId = 1;
    component.cocktailId = cocktailId;
    const cocktailDetail: Cocktail = {
      id: 1,
      img:'',
      name: 'Mojito',
      ingredients: [{name: 'mojito', measure: '1/4'}],
      instructions: {
        EN: 'string',
        DE: 'string',
        ES: 'string',
        FR: 'string',
        IT: 'string'
      }
    };
    cocktailServiceSpy.getCocktailById.and.returnValue(of(cocktailDetail));

    component.ngOnInit();

    expect(cocktailServiceSpy.getCocktailById).toHaveBeenCalledWith(cocktailId);
    expect(component.cocktail).toEqual(cocktailDetail);
    expect(component.ingredients).toEqual(cocktailDetail.ingredients);
  });

  it('deberia navegar a la ruta especificada', () => {
    const url = '/urlTest';
    component.navigate(url);

    expect(routerSpy.navigate).toHaveBeenCalledWith([url]);
  });

  it('deberia limpiarse el destroy', () => {
    const destroySpy = spyOn(component['destroy$'], 'next');
    const completeSpy = spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
