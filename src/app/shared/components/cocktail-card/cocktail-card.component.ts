import { Component, Input } from '@angular/core';
import { Cocktail } from '../../../core/interfaces/cocktail.interface';

@Component({
  selector: 'app-cocktail-card',
  standalone: true,
  imports: [],
  templateUrl: './cocktail-card.component.html',
  styleUrl: './cocktail-card.component.scss'
})
export class CocktailCardComponent {

  @Input('cocktail') cocktail!: Cocktail;

}
