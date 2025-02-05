import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CocktailsService } from '../../core/services/cocktails/cocktails.service';
import { Subject, takeUntil } from 'rxjs';
import { Cocktail, Ingredient } from '../../core/interfaces/cocktail.interface';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cocktail-detail',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    AccordionModule,
    ButtonModule
  ],
  templateUrl: './cocktail-detail.component.html',
  styleUrl: './cocktail-detail.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CocktailDetailComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  @Input('id') cocktailId!: number;
  cocktail!: Cocktail;
  ingredients!: Ingredient[]

  constructor(
    private cocktailsSvc: CocktailsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCocktail(this.cocktailId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCocktail(cocktailId: number) {
    this.cocktailsSvc.getCocktailById(cocktailId).pipe(takeUntil(this.destroy$)).subscribe(
      cocktailDetail => {
        if(cocktailDetail !== null) {
          this.cocktail = cocktailDetail[0];
          this.ingredients = this.cocktail.ingredients;
        }
      }
    );
  }

  navigate(url:string) {
    this.router.navigate([url]);
  }
}
