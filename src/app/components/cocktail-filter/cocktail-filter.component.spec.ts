import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CocktailFilterComponent } from './cocktail-filter.component';
import { CocktailsService } from '../../core/services/cocktails/cocktails.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Cocktail } from '../../core/interfaces/cocktail.interface';
import { CocktailStateService } from '../../core/services/states/cocktail-state.service';

describe('CocktailFilterComponent', () => {
  let component: CocktailFilterComponent;
  let fixture: ComponentFixture<CocktailFilterComponent>;
  let cocktailServiceSpy: jasmine.SpyObj<CocktailsService>;
  let cocktailStateService: jasmine.SpyObj<CocktailStateService>;

  beforeEach(async () => {
    const cocktailSvcSpy = jasmine.createSpyObj('CocktailsService', ['getCocktailByName']);
    const mockCocktailStateService = {
      getSearchQuery: jasmine.createSpy('getSearchQuery').and.returnValue({ query: '', cocktails: [] }),
      setSearchQuery: jasmine.createSpy('setSearchQuery'),
      setPosition: jasmine.createSpy('setPosition'),
      getPosition: jasmine.createSpy('getPosition').and.returnValue({ x: 0, y: 0 }),
      setCocktailState: jasmine.createSpy('setCocktailState')
    };

    await TestBed.configureTestingModule({
      imports: [
        CocktailFilterComponent,
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        {provide: CocktailsService, useValue: cocktailSvcSpy},
        {provide: CocktailStateService, useValue: mockCocktailStateService}
      ]
    }).compileComponents();

    const fb = TestBed.inject(FormBuilder);

    fixture = TestBed.createComponent(CocktailFilterComponent);
    component = fixture.componentInstance;
    cocktailServiceSpy = TestBed.inject(CocktailsService) as jasmine.SpyObj<CocktailsService>;
    cocktailStateService = TestBed.inject(CocktailStateService) as jasmine.SpyObj<CocktailStateService>;
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar filterForm con los controles correctos', () => {
    expect(component.filterForm).toBeTruthy();
    const controls = component.filterForm.controls;

    expect(controls['name']).toBeTruthy();
    expect(controls['name'].validator).toBeTruthy();
    expect(controls['ingredient']).toBeTruthy();
    expect(controls['ingredient'].validator).toBeTruthy();
    expect(controls['id']).toBeTruthy();
    expect(controls['id'].validator).toBeTruthy();
  });

  it('debería tener validadores configurados correctamente para el control "name"', () => {
    const nameControl = component.filterForm.get('name');
    nameControl?.setValue('ValidName');
    expect(nameControl?.valid).toBeTrue();

    nameControl?.setValue('Invalid Name 123');
    expect(nameControl?.valid).toBeFalse();

    nameControl?.setValue('');
    expect(nameControl?.valid).toBeTrue();
  });

  it('debería tener validadores configurados correctamente para el control "ingredient"', () => {
    const ingredientControl = component.filterForm.get('ingredient');
    ingredientControl?.setValue('ValidIngredient');
    expect(ingredientControl?.valid).toBeTrue();

    ingredientControl?.setValue('Invalid Ingredient 123');
    expect(ingredientControl?.valid).toBeFalse();

    ingredientControl?.setValue('');
    expect(ingredientControl?.valid).toBeTrue();
  });

  it('debería tener validadores configurados correctamente para el control "id"', () => {
    const idControl = component.filterForm.get('id');
    idControl?.setValue(123);
    expect(idControl?.valid).toBeTrue();

    idControl?.setValue('abc');
    expect(idControl?.valid).toBeFalse();

    idControl?.setValue(null);
    expect(idControl?.valid).toBeTrue();
  });

  it('debería suscribirse a valueChanges en ngOnInit y llamar a getCocktailByName', fakeAsync(() => {
    const nameControl = component.filterForm.get('name');
    const mockResponse: Cocktail[] = [
      {
        id: 1,
        img:'',
        name: 'Mojito',
        ingredients: [{name: 'mojito', measure: '1/2'}],
        instructions: {
          EN: 'string',
          DE: 'string',
          ES: 'string',
          FR: 'string',
          IT: 'string'
        }
      }
    ];
    cocktailServiceSpy.getCocktailByName.and.returnValue(of(mockResponse));

    spyOn(component, 'getCocktailByName').and.callThrough();

    component.ngOnInit();
    nameControl?.setValue('Mojito');

    tick(500);
    expect(component.getCocktailByName).toHaveBeenCalledWith('Mojito');
    expect(cocktailServiceSpy.getCocktailByName).toHaveBeenCalledWith('Mojito');
  }));

  it('debería limpiar el observable en ngOnDestroy', () => {
    component.ngOnInit();
    component.ngOnDestroy();
    expect(cocktailServiceSpy.getCocktailByName).not.toHaveBeenCalled();
  });

  it('should update position on scroll', () => {
    const scrollX = 100;
    const scrollY = 200;
    Object.defineProperty(window, 'scrollX', { value: scrollX });
    Object.defineProperty(window, 'scrollY', { value: scrollY });

    component.onMouseMove();

    expect(cocktailStateService.setPosition).toHaveBeenCalledWith(scrollX, scrollY);
  });

});
