import { Component, OnInit, ViewChild } from '@angular/core';
import { CocktailFilterComponent } from '../cocktail-filter/cocktail-filter.component';
import { CommonModule } from '@angular/common';
import { Cocktail } from '../../core/interfaces/cocktail.interface';
import { CocktailCardComponent } from '../../shared/components/cocktail-card/cocktail-card.component';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cocktails-list',
  standalone: true,
  imports: [
    CommonModule,
    CocktailFilterComponent,
    CocktailCardComponent,
    ContextMenuModule
  ],
  templateUrl: './cocktails-list.component.html',
  styleUrl: './cocktails-list.component.scss'
})
export class CocktailsListComponent implements OnInit{
  @ViewChild('cm') cm!: ContextMenu;

  items: MenuItem[] | undefined;
  cocktails: Cocktail[] = [];
  selectedCocktail!: Cocktail | null;

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'Favorite',
        icon: 'pi pi-star',
        command: () => {
          this.addFavorite();
        }
      },
      {
        label: 'Details',
        icon: 'pi pi-eye',
        command: () => {
          this.showDetails();
        }
      }
    ];
  }

  addFavorite() {
    console.log('Favorito', this.selectedCocktail);
  }

  showDetails() {
    if(!this.selectedCocktail) {
      return;
    }
    this.router.navigate(['cocktails', this.selectedCocktail?.id])
  }

  onFilterChange($event: Cocktail[]) {
    this.cocktails = $event;
  }

  onContextMenu(event: any, cocktail: Cocktail) {
    this.selectedCocktail = cocktail
    this.cm.show(event);
  }

  onHide() {
    this.selectedCocktail = null;
  }

}
