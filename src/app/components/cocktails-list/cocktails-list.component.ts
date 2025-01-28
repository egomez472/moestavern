import { Component } from '@angular/core';
import { CocktailFilterComponent } from '../cocktail-filter/cocktail-filter.component';
import { CommonModule } from '@angular/common';
import { Cocktail } from '../../core/interfaces/cocktail.interface';
import { CocktailCardComponent } from '../../shared/components/cocktail-card/cocktail-card.component';

@Component({
  selector: 'app-cocktails-list',
  standalone: true,
  imports: [
    CommonModule,
    CocktailFilterComponent,
    CocktailCardComponent
  ],
  templateUrl: './cocktails-list.component.html',
  styleUrl: './cocktails-list.component.scss'
})
export class CocktailsListComponent {

  cocktails: Cocktail[] = [];

  onFilterChange($event: Cocktail[]) {
    this.cocktails = $event;
  }

}
