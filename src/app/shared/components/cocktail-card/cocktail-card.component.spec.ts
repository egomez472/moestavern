import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocktailCardComponent } from './cocktail-card.component';
import { Cocktail } from '../../../core/interfaces/cocktail.interface';

describe('CocktailCardComponent', () => {
  let component: CocktailCardComponent;
  let fixture: ComponentFixture<CocktailCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CocktailCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CocktailCardComponent);
    component = fixture.componentInstance;
  });

  it('deberia crearse correctamente', () => {
    const mockCocktail: Cocktail = {
      id: 1,
      img: 'img.png',
      name: 'Mojito',
      ingredients: [{ name: 'Mint', measure: '1/4' }, { name: 'Lime', measure: '1 oz' }, { name: 'Rum', measure: '2oz' }],
      instructions: {EN: '', DE: '', ES: '', FR: '', IT: ''}
    };
    component.cocktail = mockCocktail;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('div')).not.toBeNull();
  });
});
