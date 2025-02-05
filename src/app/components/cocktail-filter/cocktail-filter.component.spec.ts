import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CocktailFilterComponent } from './cocktail-filter.component';
import { CocktailsService } from '../../core/services/cocktails/cocktails.service';
import { CocktailStateService } from '../../core/services/states/cocktail-state.service';
import { convertToParamMap, Router } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';
import { ActivatedRoute } from '@angular/router';
import { SearchQuery } from '../../core/interfaces/search-query.interface';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { Cocktail } from '../../core/interfaces/cocktail.interface';

const COCKTAIL_KEY: string = 'cocktailState';

describe('CocktailFilterComponent', () => {
  let component: CocktailFilterComponent;
  let fixture: ComponentFixture<CocktailFilterComponent>;
  let cocktailService: jasmine.SpyObj<CocktailsService>;
  let cocktailStateService: jasmine.SpyObj<CocktailStateService>;
  let router: jasmine.SpyObj<Router>;
  let storageService: jasmine.SpyObj<StorageService>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let activatedRouteStub;
  let destroy$: Subject<void>;

  beforeEach(async () => {
    destroy$ = new Subject<void>();
    const cocktailServiceSpy = jasmine.createSpyObj('CocktailsService', ['getCocktailByName', 'getCocktailById', 'getCocktailByIngredient']);
    const cocktailStateServiceSpy = jasmine.createSpyObj('CocktailStateService', ['setSearchQuery', 'setIngredientState', 'setIdState', 'getState', 'setCocktailState', 'setFavoriteListState', 'getPosition', 'setPosition']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['get']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['queryParamMap']);

    activatedRouteStub = {queryParamMap: of(convertToParamMap({favs: true}))}

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CocktailFilterComponent],
      providers: [
        { provide: CocktailsService, useValue: cocktailServiceSpy },
        { provide: CocktailStateService, useValue: cocktailStateServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CocktailFilterComponent);
    component = fixture.componentInstance;
    cocktailService = TestBed.inject(CocktailsService) as jasmine.SpyObj<CocktailsService>;
    cocktailStateService = TestBed.inject(CocktailStateService) as jasmine.SpyObj<CocktailStateService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    activatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;

    component.filterForm = new FormGroup({
      name: new FormControl(''),
      ingredient: new FormControl(''),
      id: new FormControl('')
    });
    component['destroy$'] = destroy$;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el estado y actualizar el formulario correctamente', () => {
    const mockState: SearchQuery = {
      query: 'Mojito',
      id: 1,
      ingredient: 'Rum',
      cocktails: [],
      favorites: []
    };

    cocktailStateService.getState.and.returnValue(mockState);
    spyOn(component.filterChange, 'emit');

    component.initState();

    expect(component.filterChange.emit).toHaveBeenCalledWith(mockState.cocktails);

    expect(component.filterForm.value).toEqual({
      name: 'Mojito',
      ingredient: 'Rum',
      id: 1
    });
  });

  it('debería llamar a getCocktailByName, getCocktailById y getCocktailByIngredient del servicio y emitir el resultado', () => {
    const mockCocktails: Cocktail[] = [
      { id: 1,img:'', name: 'Mojito', ingredients: [{name: 'Rum', measure: '1/2'}], instructions: {EN:'',DE:'',ES:'',FR:'',IT:''} },
      { id: 2,img:'', name: 'Gin Tonic', ingredients: [{name: 'Gin', measure: '1/4'}], instructions: {EN:'',DE:'',ES:'',FR:'',IT:''} }
    ];

    cocktailService.getCocktailByName.and.returnValue(of([mockCocktails[0]]));
    cocktailService.getCocktailById.and.returnValue(of([mockCocktails[0]]));
    cocktailService.getCocktailByIngredient.and.returnValue(of([mockCocktails[0]]));
    spyOn(component, 'setAndEmit');
    component.getCocktailByName('Mojito');
    component.getCocktailById(1);
    component.getCocktailByIngredient('Rum');

    expect(cocktailService.getCocktailByName).toHaveBeenCalledWith('Mojito');
    expect(component.setAndEmit).toHaveBeenCalledWith([mockCocktails[0]]);
    expect(cocktailService.getCocktailById).toHaveBeenCalledWith(1);
    expect(component.setAndEmit).toHaveBeenCalledWith([mockCocktails[0]]);
    expect(cocktailService.getCocktailByIngredient).toHaveBeenCalledWith('Rum');
    expect(component.setAndEmit).toHaveBeenCalledWith([mockCocktails[0]]);
  });

  it('debería establecer el estado y emitir los datos cuando fav es false', () => {
    const mockCocktails: Cocktail[] = [
      { id: 1, img: '', name: 'Mojito', ingredients: [{ name: 'Rum', measure: '1/2' }], instructions: { EN: '', DE: '', ES: '', FR: '', IT: '' } }
    ];

    spyOn(component.filterChange, 'emit');
    component.setAndEmit(mockCocktails);

    expect(component.isFavoriteList).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['cocktails']);
    expect(cocktailStateService.setCocktailState).toHaveBeenCalledWith(mockCocktails);
    expect(component.filterChange.emit).toHaveBeenCalledWith(mockCocktails);
  });

  it('debería establecer el estado de la lista de favoritos y emitir los datos cuando fav es true', () => {
    const mockFavorites: Cocktail[] = [
      { id: 2, img: '', name: 'Daiquiri', ingredients: [{ name: 'Rum', measure: '1' }], instructions: { EN: '', DE: '', ES: '', FR: '', IT: '' } }
    ];

    spyOn(component.filterChange, 'emit');
    component.setAndEmit(mockFavorites, true);

    expect(cocktailStateService.setFavoriteListState).toHaveBeenCalledWith(mockFavorites);
    expect(component.filterChange.emit).toHaveBeenCalledWith(mockFavorites);
  });

  it('debería alternar isFavoriteList y navegar a la lista de favoritos', () => {
    expect(component.isFavoriteList).toBeFalse();

    spyOn(component, 'showFavorites');
    component.goToFavoriteList();

    expect(component.isFavoriteList).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['cocktails'], { queryParams: { favs: true } });
    expect(component.showFavorites).toHaveBeenCalled();
  });

  it('debería alternar isFavoriteList y navegar sin parámetros de consulta si ya es true', () => {
    component.isFavoriteList = true;

    spyOn(component, 'showFavorites');
    component.goToFavoriteList();

    expect(component.isFavoriteList).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['cocktails'], {});
    expect(component.showFavorites).toHaveBeenCalled();
  });

  it('debería obtener los cócteles favoritos y emitirlos cuando isFavoriteList es true', () => {
    const mockFavorites: Cocktail[] = [{ id: 1, img: '', name: 'Mojito', ingredients: [{ name: 'Rum', measure: '1/2' }], instructions: { EN: '', DE: '', ES: '', FR: '', IT: '' } }];

    spyOn(storageService, 'get').and.returnValue({ favorites: mockFavorites, cocktails: [] });

    component.isFavoriteList = true;

    spyOn(component, 'setAndEmit');

    component.showFavorites();

    expect(storageService.get).toHaveBeenCalledWith(COCKTAIL_KEY);
    expect(component.setAndEmit).toHaveBeenCalledWith(mockFavorites, true);
  });

  it('debería obtener los cócteles y emitirlos cuando isFavoriteList es false', () => {
    const mockCocktails: Cocktail[] = [
      { id: 2, img: '', name: 'Daiquiri', ingredients: [{ name: 'Rum', measure: '1' }], instructions: { EN: '', DE: '', ES: '', FR: '', IT: '' } }
    ];

    spyOn(storageService, 'get').and.returnValue({ favorites: [], cocktails: mockCocktails });

    component.isFavoriteList = false;

    spyOn(component, 'setAndEmit');

    component.showFavorites();

    expect(storageService.get).toHaveBeenCalledWith(COCKTAIL_KEY);
    expect(component.setAndEmit).toHaveBeenCalledWith(mockCocktails, false);
  });

  it('debería llamar a setPosition con las coordenadas correctas al hacer scroll', () => {
    const mockScrollX = 100;
    const mockScrollY = 200;

    Object.defineProperty(window, 'scrollX', { value: mockScrollX });
    Object.defineProperty(window, 'scrollY', { value: mockScrollY });

    component.onMouseMove();

    expect(cocktailStateService.setPosition).toHaveBeenCalledWith(mockScrollX, mockScrollY);
  });

  it('deberia llamar a initState en el ngOnInit', () => {
    spyOn(component, 'initState')
    const mockState: SearchQuery = {
      query: 'Mojito',
      id: 1,
      ingredient: 'Rum',
      cocktails: [],
      favorites: []
    };
    cocktailStateService.getState.and.returnValue(mockState)
    component.ngOnInit();
    expect(component.initState).toHaveBeenCalled();
  });

  it('deberia setear la query y llamar a getCocktailByName en valueChanges', (done) => {
    spyOn(component, 'getCocktailByName');
    spyOn(component, 'initState');
    const mockState: SearchQuery = {
      query: 'Mojito',
      id: 1,
      ingredient: 'Rum',
      cocktails: [],
      favorites: []
    };
    cocktailStateService['cocktailStateSubject'] = new BehaviorSubject(mockState);
    cocktailStateService.getState.and.returnValue(mockState)
    component.ngOnInit();
    component.filterForm.get('name')?.setValue('Mojito');

    setTimeout(() => {
      expect(cocktailStateService.setSearchQuery).toHaveBeenCalledWith('Mojito');
      expect(component.getCocktailByName).toHaveBeenCalledWith('Mojito');
      done();
    }, 600);
  });

  it('deberia setear el id y llamar a getCocktailById en valueChanges', (done) => {
    spyOn(component, 'getCocktailById');
    spyOn(component, 'initState');
    const mockState: SearchQuery = {
      query: 'Mojito',
      id: 1,
      ingredient: 'Rum',
      cocktails: [],
      favorites: []
    };
    cocktailStateService['cocktailStateSubject'] = new BehaviorSubject(mockState);
    cocktailStateService.getState.and.returnValue(mockState)
    component.ngOnInit();
    component.filterForm.get('id')?.setValue(1);

    setTimeout(() => {
      expect(cocktailStateService.setIdState).toHaveBeenCalledWith(1);
      expect(component.getCocktailById).toHaveBeenCalledWith(1);
      done();
    }, 600);
  });

  it('deberia setear el ingrediente y llamar a getCocktailByIngredient en valueChanges', (done) => {
    spyOn(component, 'getCocktailByIngredient');
    spyOn(component, 'initState');
    const mockState: SearchQuery = {
      query: 'Mojito',
      id: 1,
      ingredient: 'Rum',
      cocktails: [],
      favorites: []
    };
    cocktailStateService['cocktailStateSubject'] = new BehaviorSubject(mockState);
    cocktailStateService.getState.and.returnValue(mockState)
    component.ngOnInit();
    component.filterForm.get('ingredient')?.setValue(mockState.ingredient);

    setTimeout(() => {
      expect(cocktailStateService.setIngredientState).toHaveBeenCalledWith(mockState.ingredient);
      expect(component.getCocktailByIngredient).toHaveBeenCalledWith(mockState.ingredient);
      done();
    }, 600);
  });

  it('deberia llamarse initPositionState en el afterViewInit', () => {
    const mockPosition = { x: 100, y: 200 };
    cocktailStateService.getPosition.and.returnValue(mockPosition);
    spyOn(window, 'scrollTo');
    spyOn(component, 'initPositionState').and.callThrough();

    component.ngAfterViewInit();

    expect(component.initPositionState).toHaveBeenCalled();
  });

  it('deberia scrollear a la posicion retornada por getPosition', () => {
    const mockPosition = { x: 100, y: 200 };
    cocktailStateService.getPosition.and.returnValue(mockPosition);
    spyOn(window, 'scrollTo');

    component.initPositionState();

    expect(cocktailStateService.getPosition).toHaveBeenCalled();
    expect(window.scrollTo).toHaveBeenCalledWith(mockPosition.x, mockPosition.y);
  })

  afterEach(() => {
    destroy$.next();
    destroy$.complete();
  });
});
