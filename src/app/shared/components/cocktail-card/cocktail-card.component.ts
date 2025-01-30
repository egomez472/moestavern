import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cocktail } from '../../../core/interfaces/cocktail.interface';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';

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
  styleUrl: './cocktail-card.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CocktailCardComponent {
  @Input('cocktail') cocktail!: Cocktail;
}
