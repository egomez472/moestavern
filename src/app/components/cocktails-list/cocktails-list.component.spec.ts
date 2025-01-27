import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocktailsListComponent } from './cocktails-list.component';
import { Cocktail } from '../../core/interfaces/cocktail.interface';

describe('CocktailsListComponent', () => {
  let component: CocktailsListComponent;
  let fixture: ComponentFixture<CocktailsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CocktailsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CocktailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Deberia crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('onFilterChange debería recibir datos de tipo Cocktail[]', () => {
    const mockCocktails: Cocktail[] = [
      { id: 1,img: '', name: 'Mojito', ingredients: [{name: 'Mojito', measure: '1/4'}], instructions: {EN:'',DE:'',ES:'',FR:'',IT:''}  },
      { id: 2,img: '', name: 'Daiquiri', ingredients: [{name: 'Daiquiri', measure: '1/4'}], instructions: {EN:'',DE:'',ES:'',FR:'',IT:''} }
    ];

    component.onFilterChange(mockCocktails);

    expect(component.cocktails).toEqual(mockCocktails);
    expect(component.cocktails.length).toBe(2);
    expect(component.cocktails[0].name).toBe('Mojito');
    expect(component.cocktails[1].name).toBe('Daiquiri');
  })
});
