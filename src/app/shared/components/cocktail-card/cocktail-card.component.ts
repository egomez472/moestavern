import { Component, Input } from '@angular/core';
import { Cocktail } from '../../../core/interfaces/cocktail.interface';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cocktail-card',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    ChipModule,
    CommonModule
  ],
  templateUrl: './cocktail-card.component.html',
  styleUrl: './cocktail-card.component.scss'
})
export class CocktailCardComponent {

  @Input('cocktail') cocktail!: Cocktail;

}
