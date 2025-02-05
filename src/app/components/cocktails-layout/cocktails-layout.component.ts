import { Component, OnInit, ViewChild } from '@angular/core';
import { CocktailFilterComponent } from '../cocktail-filter/cocktail-filter.component';
import { CommonModule } from '@angular/common';
import { Cocktail } from '../../core/interfaces/cocktail.interface';
import { CocktailCardComponent } from '../../shared/components/cocktail-card/cocktail-card.component';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { CocktailStateService } from '../../core/services/states/cocktail-state.service';
import { ActionResponse } from '../../core/interfaces/actions-response.interface';

@Component({
  selector: 'app-cocktails-list',
  standalone: true,
  imports: [
    CommonModule,
    CocktailFilterComponent,
    CocktailCardComponent,
    ContextMenuModule,
    ToastModule
  ],
  providers: [MessageService],
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
    private state: CocktailStateService,
    private messageService: MessageService
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
    if (this.selectedCocktail) {
      const added: ActionResponse = this.state.addFavoriteState(this.selectedCocktail);
      this.showToast(added.error ? 'warn' : 'success', added.message, added.title);
    }
  }

  showToast(severity: string, detail:string, summary:string ) {
    this.messageService.add({ severity, summary, detail, key: 'action' });
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
