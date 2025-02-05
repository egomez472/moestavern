import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocktailsListComponent } from './cocktails-list.component';
import { Cocktail } from '../../core/interfaces/cocktail.interface';
import { Router } from '@angular/router';

describe('CocktailsListComponent', () => {
  let component: CocktailsListComponent;
  let fixture: ComponentFixture<CocktailsListComponent>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CocktailsListComponent],
      providers: [
        { provide: Router, useValue: routerMock } // Usar el mock aquí
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CocktailsListComponent);
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

  it('debería loguear selectedCocktail cuando addFavorite se llama', () => {
    const cocktailMock: Cocktail = {
      id: 1,
      img: 'img.png',
      name: 'Mojito',
      ingredients: [{ name: 'Rum', measure: '1 oz' }],
      instructions: { EN: '', DE: '', ES: '', FR: '', IT: '' }
    };

    component.selectedCocktail = cocktailMock;
    const consoleLogSpy = spyOn(console, 'log');

    component.addFavorite();

    expect(consoleLogSpy).toHaveBeenCalledWith('Favorito', cocktailMock);
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

  it('no debería navegar si no hay un cóctel seleccionado', () => {
    component.selectedCocktail = null;
    component.showDetails();

    expect(routerMock.navigate).not.toHaveBeenCalled();
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
  })
});
