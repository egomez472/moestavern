import { Component, OnInit, ViewChild } from '@angular/core';
import { CocktailFilterComponent } from '../cocktail-filter/cocktail-filter.component';
import { CommonModule } from '@angular/common';
import { Cocktail } from '../../core/interfaces/cocktail.interface';
import { CocktailCardComponent } from '../../shared/components/cocktail-card/cocktail-card.component';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { CocktailStateService } from '../../core/services/states/cocktail-state.service';

@Component({
  selector: 'app-cocktails-list',
  standalone: true,
  imports: [
    CommonModule,
    CocktailFilterComponent,
    CocktailCardComponent,
    ContextMenuModule
  ],
  templateUrl: './cocktails-layout.component.html',
  styleUrl: './cocktails-layout.component.scss'
})
export class CocktailsLayoutComponent implements OnInit{
  @ViewChild('cm') cm!: ContextMenu;

  items: MenuItem[] | undefined;
  cocktails: Cocktail[] = [];
  selectedCocktail!: Cocktail | null;

  constructor(
    private router: Router,
    private state: CocktailStateService
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
    if(this.selectedCocktail) {
      this.state.addFavoriteState(this.selectedCocktail);
    }
  }

  showDetails(cocktail?: Cocktail) {
    if(cocktail) {
      this.selectedCocktail = cocktail;
      this.router.navigate(['cocktails', this.selectedCocktail?.id]);
      return
    }
    this.router.navigate(['cocktails', this.selectedCocktail?.id]);
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
