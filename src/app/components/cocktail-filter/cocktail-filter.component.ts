import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { CocktailsService } from '../../core/services/cocktails/cocktails.service';
import { HttpClientModule } from '@angular/common/http';
import { Cocktail } from '../../core/interfaces/cocktail.interface';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { CocktailStateService } from '../../core/services/states/cocktail-state.service';
import { SearchQuery } from '../../core/interfaces/search-query.interface';
import { Position } from '../../core/interfaces/position.interface';

@Component({
  selector: 'app-cocktail-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule
  ],
  templateUrl: './cocktail-filter.component.html',
  styleUrl: './cocktail-filter.component.scss'
})
export class CocktailFilterComponent implements OnInit, OnDestroy {
  @Output() filterChange = new EventEmitter<Cocktail[]>();
  private destroy$ = new Subject<void>();

  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cocktailSvc: CocktailsService,
    private cocktailState: CocktailStateService
  ) {
    this.filterForm = this.fb.group({
      name: ['',[Validators.pattern(/^[a-zA-Z\s]*$/), Validators.maxLength(50)]],
      ingredient: ['', [Validators.pattern(/^[a-zA-Z\s]*$/), Validators.maxLength(50)]],
      id: ['', [Validators.pattern(/^\d*$/)]]
    });
  }

  ngOnInit(): void {
    this.initState(this.cocktailState.getState(), this.cocktailState.getPosition());

    this.filterForm.get('name')?.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(500)
    ).subscribe(
      value => {
        this.cocktailState.setSearchQuery(value);
        this.getCocktailByName(value)
      }
    );

    this.filterForm.get('ingredient')?.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(500)
    ).subscribe(
      value => {
        this.cocktailState.setIngredientState(value);
        this.getCocktailByIngredient(value)
      }
    )

    this.filterForm.get('id')?.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(500)
    ).subscribe(
      value => {
        this.cocktailState.setIdState(value);
        this.getCocktailById(value)
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:scroll', ['$event'])
  onMouseMove() {
    const scrollY = window.scrollY;
    this.cocktailState.setPosition(window.scrollX, scrollY);
  }

  initState(cocktailState: SearchQuery, positionState: Position) {
    const state = cocktailState;

    const position = positionState;
    this.filterForm.patchValue({
      name: state.query,
      ingredient: state.ingredient,
      id: state.id
    })
    this.filterChange.emit(state.cocktails);

    setTimeout(() => {
      window.scrollTo(position.x, position.y)
    }, 50);
  }

  getCocktailByName(name: string) {
    this.cocktailSvc.getCocktailByName(name).pipe(takeUntil(this.destroy$)).subscribe(
      (response: Cocktail[]) => {
        this.setAndEmit(response);
      }
    )
  }

  getCocktailById(id: number) {
    this.cocktailSvc.getCocktailById(id).pipe(takeUntil(this.destroy$)).subscribe(
      (response: Cocktail[]) => {
        this.setAndEmit(response);
      }
    )
  }

  getCocktailByIngredient(ingredient: string) {
    this.cocktailSvc.getCocktailByIngredient(ingredient).pipe(takeUntil(this.destroy$)).subscribe(
      (response: Cocktail[]) => {
        this.setAndEmit(response);
      }
    )
  }

  setAndEmit(data: Cocktail[]) {
    this.cocktailState.setCocktailState(data);
    this.filterChange.emit(data);
  }

}
