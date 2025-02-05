import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocktailsLayoutComponent } from './cocktails-layout.component';
import { Cocktail } from '../../core/interfaces/cocktail.interface';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { CocktailStateService } from '../../core/services/states/cocktail-state.service';
import { MessageService } from 'primeng/api';
import { ActionResponse } from '../../core/interfaces/actions-response.interface';

describe('CocktailsLayoutComponent', () => {
  let component: CocktailsLayoutComponent;
  let fixture: ComponentFixture<CocktailsLayoutComponent>;
  let routerMock: jasmine.SpyObj<Router>;
  let activatedRouteStub: any;
  let stateMock: jasmine.SpyObj<CocktailStateService>;

  let mockMessageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteStub = {queryParamMap: of(convertToParamMap({favs: true}))};
    stateMock = jasmine.createSpyObj('CocktailStateService', ['addFavoriteState', 'getState', 'getPosition']);
    stateMock.getPosition.and.returnValue({
      x: 0,
      y: 0
    })
    stateMock.getState.and.returnValue({
      query: '',
      id:1,
      ingredient: '',
      cocktails: [],
      favorites: []
    })

    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [CocktailsLayoutComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub},
        { provide: CocktailStateService, useValue: stateMock},

        { provide: MessageService, useValue: mockMessageService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CocktailsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deberia crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('deberia inicializar this.items en el ngOnInit', () => {
    component.ngOnInit();

    expect(component.items).toBeDefined();
    expect(component.items?.length).toBe(2);
    expect(component.items![0].label).toBe('Favorite');
    expect(component.items![1].label).toBe('Details');
  });

  it('deberia llamar a addFavorite cuando la opcion Favorite es cliqueada', () => {
    spyOn(component, 'addFavorite');
    component.ngOnInit();
    const favoriteItem = component.items![0];
    const eventMock = {};
    favoriteItem.command!(eventMock);

    expect(component.addFavorite).toHaveBeenCalled();
  });

  it('deberia llamar a showDetails cuando la opcion Details es cliqueada', () => {
    spyOn(component, 'showDetails');
    component.ngOnInit();
    const detailsItem = component.items![1];
    const eventMock = {};
    detailsItem.command!(eventMock);

    expect(component.showDetails).toHaveBeenCalled();
  });

  it('deberia actualizar selectedCocktail cuando se activa onContextMenu', () => {
    const cocktailMock: Cocktail = { id: 1, img: 'img.png', name: 'Mojito', ingredients: [{name: 'Rum', measure: '1 oz'}], instructions: {EN:'',DE:'',ES:'',FR:'',IT:''} };
    const eventMock = {
      originalEvent: new MouseEvent('click'),
      stopPropagation: () => {},
      preventDefault: () => {}
    };
    component.onContextMenu(eventMock, cocktailMock);
    expect(component.selectedCocktail).toEqual(cocktailMock);
  });

  it('deberia setear selectedCocktail en null cuando se activa onHide', () => {
    component.selectedCocktail = { id: 1, img: 'img.png', name: 'Mojito', ingredients: [{name: 'Rum', measure: '1 oz'}], instructions: {EN:'',DE:'',ES:'',FR:'',IT:''} };
    component.onHide();
    expect(component.selectedCocktail).toBeNull();
  });

  it('debería navegar a la ruta correcta cuando se llama a showDetails', () => {
    component.selectedCocktail = {
      id: 1,
      img: 'img.png',
      name: 'Mojito',
      ingredients: [{ name: 'Rum', measure: '1 oz' }],
      instructions: { EN: '', DE: '', ES: '', FR: '', IT: '' }
    };

    component.showDetails();
    expect(routerMock.navigate).toHaveBeenCalledWith(['cocktails', component.selectedCocktail.id]);
  });

  it('deberia navegar a la ruta correcta cuando se llama a showDetails cuando selectedCocktail es null', () => {
    const mockCocktail = {
      id: 1,
      img: 'img.png',
      name: 'Mojito',
      ingredients: [{ name: 'Rum', measure: '1 oz' }],
      instructions: { EN: '', DE: '', ES: '', FR: '', IT: '' }
    };

    component.selectedCocktail = null;
    expect(component.selectedCocktail).toBeNull();

    component.showDetails(mockCocktail);
    expect(routerMock.navigate).toHaveBeenCalledWith(['cocktails', mockCocktail.id])
  });

  it('onFilterChange debería recibir datos de tipo Cocktail[]', () => {
    const mockCocktails: Cocktail[] = [
      { id: 1,img: '', name: 'Mojito', ingredients: [{name: 'Mojito', measure: '1/3'}], instructions: {EN:'',DE:'',ES:'',FR:'',IT:''}  },
      { id: 2,img: '', name: 'Daiquiri', ingredients: [{name: 'Daiquiri', measure: '1/4'}], instructions: {EN:'',DE:'',ES:'',FR:'',IT:''} }
    ];

    component.onFilterChange(mockCocktails);

    expect(component.cocktails).toEqual(mockCocktails);
    expect(component.cocktails.length).toBe(2);
    expect(component.cocktails[0].name).toBe('Mojito');
    expect(component.cocktails[1].name).toBe('Daiquiri');
  });

  it('deberia llamar a addFavoriteState y showToast cuando selectedCocktail es definido', () => {
    const cocktail: Cocktail = { id: 1, img: '', name: 'Mojito', ingredients: [{ name: 'Mojito', measure: '1/3' }], instructions: { EN: '', DE: '', ES: '', FR: '', IT: '' } };
    component.selectedCocktail = cocktail;

    const response: ActionResponse = { error: false, message: 'Added to favorites', title: 'Success' };
    stateMock.addFavoriteState.and.returnValue(response);

    const msgSpy = spyOn(component['messageService'], 'add')
    component.addFavorite();

    expect(stateMock.addFavoriteState).toHaveBeenCalledWith(cocktail);
    expect(msgSpy).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Added to favorites',
      key: 'action'
    });

    const response2: ActionResponse = { error: true, message: 'Added to favorites', title: 'Warn' };
    stateMock.addFavoriteState.and.returnValue(response2);

    component.addFavorite();

    expect(stateMock.addFavoriteState).toHaveBeenCalledWith(cocktail);
    expect(msgSpy).toHaveBeenCalledWith({
      severity: 'warn',
      summary: 'Warn',
      detail: 'Added to favorites',
      key: 'action'
    });
  });

});
