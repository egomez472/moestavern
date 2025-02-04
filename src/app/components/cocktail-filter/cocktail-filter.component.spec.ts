import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CocktailFilterComponent } from './cocktail-filter.component';
import { CocktailsService } from '../../core/services/cocktails/cocktails.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, of, Subject, takeUntil } from 'rxjs';
import { Cocktail } from '../../core/interfaces/cocktail.interface';
import { CocktailStateService } from '../../core/services/states/cocktail-state.service';

describe('CocktailFilterComponent', () => {
  let component: CocktailFilterComponent;
  let fixture: ComponentFixture<CocktailFilterComponent>;
  let cocktailServiceSpy: jasmine.SpyObj<CocktailsService>;
  let cocktailStateService: jasmine.SpyObj<CocktailStateService>;
  let destroy$: Subject<void>;
  let mockCocktailStateService = {
    getState: jasmine.createSpy('getState').and.returnValue({ query: '', id: '1', ingredient: '', cocktails: [] }),
    setSearchQuery: jasmine.createSpy('setSearchQuery'),
    setPosition: jasmine.createSpy('setPosition'),
    getPosition: jasmine.createSpy('getPosition').and.returnValue({ x: 0, y: 0 }),
    setCocktailState: jasmine.createSpy('setCocktailState'),
    setIdState: jasmine.createSpy('setIdState')
  };

  beforeEach(async () => {
    destroy$ = new Subject<void>();
    const cocktailSvcSpy = jasmine.createSpyObj('CocktailsService', ['getCocktailByName', 'getCocktailById']);

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

  afterEach(() => {
    destroy$.next();
    destroy$.complete();
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

  it('debería suscribirse a valueChanges en ngOnInit y llamar a getCocktailById', fakeAsync(() => {
    const idControl = component.filterForm.get('id');
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
    cocktailServiceSpy.getCocktailById.and.returnValue(of(mockResponse));

    spyOn(component, 'getCocktailById').and.callThrough();

    component.ngOnInit();
    idControl?.setValue(1);

    tick(500);
    expect(component.getCocktailById).toHaveBeenCalledWith(1);
    expect(cocktailServiceSpy.getCocktailById).toHaveBeenCalledWith(1);
  }));

  it('debería limpiar el observable en ngOnDestroy', () => {
    component.ngOnInit();
    component.ngOnDestroy();
    expect(cocktailServiceSpy.getCocktailByName).not.toHaveBeenCalled();
  });

  it('deberia actualizar la posicion del scroll', () => {
    const scrollX = 100;
    const scrollY = 200;
    Object.defineProperty(window, 'scrollX', { value: scrollX });
    Object.defineProperty(window, 'scrollY', { value: scrollY });

    component.onMouseMove();

    expect(cocktailStateService.setPosition).toHaveBeenCalledWith(scrollX, scrollY);
  });

});
