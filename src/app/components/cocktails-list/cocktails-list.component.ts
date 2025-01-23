import { Component, EventEmitter } from '@angular/core';
import { CocktailFilterComponent } from '../cocktail-filter/cocktail-filter.component';
import { CommonModule } from '@angular/common';
import { CocktailFilterInterface } from '../../core/interfaces/cocktail-filter.interface';

@Component({
  selector: 'app-cocktails-list',
  standalone: true,
  imports: [
    CommonModule,
    CocktailFilterComponent
  ],
  templateUrl: './cocktails-list.component.html',
  styleUrl: './cocktails-list.component.scss'
})
export class CocktailsListComponent {

  cocktails = [
    { name: 'Mojito', ingredient: 'Rum', id: 1 },
    { name: 'Martini', ingredient: 'Gin', id: 2 },
    { name: 'Margarita', ingredient: 'Tequila', id: 3 }
  ];

  filteredCocktails = [...this.cocktails];

  onFilterChange(filters: CocktailFilterInterface): void {
    this.filteredCocktails = this.cocktails.filter((cocktail) => {

      const matchesName = filters.name
        ? cocktail.name.toLowerCase().includes(filters.name.toLowerCase())
        : true;

      const matchesIngredient = filters.ingredient
        ? cocktail.ingredient.toLowerCase().includes(filters.ingredient.toLowerCase())
        : true;

      const matchesId = filters.id.toString() ? cocktail.id.toString() === filters.id.toString() : true;

      return matchesName && matchesIngredient && matchesId;
    });
  }

}
