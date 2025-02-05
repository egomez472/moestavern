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
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';

const COCKTAIL_KEY: string = 'cocktailState';

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
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './cocktail-filter.component.html',
  styleUrl: './cocktail-filter.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CocktailFilterComponent implements OnInit, OnDestroy {
  @Output() filterChange = new EventEmitter<Cocktail[]>();
  @HostListener('window:scroll', ['$event'])
  onMouseMove() {
    const scrollY = window.scrollY;
    this.cocktailState.setPosition(window.scrollX, scrollY);
  }

  private destroy$ = new Subject<void>();

  filterForm: FormGroup;
  isFavoriteList: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cocktailSvc: CocktailsService,
    private cocktailState: CocktailStateService,
    private router: Router,
    private route: ActivatedRoute,
    private storage: StorageService
  ) {
    this.filterForm = this.fb.group({
      name: ['',[Validators.pattern(/^[a-zA-Z\s]*$/), Validators.maxLength(50)]],
      ingredient: ['', [Validators.pattern(/^[a-zA-Z\s]*$/), Validators.maxLength(50)]],
      id: ['', [Validators.pattern(/^\d*$/)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe((params: any) => {
      let fav = params.params.favs ? true : false;
      this.isFavoriteList = fav;
      this.showFavorites();
    });

    this.initState();

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

  ngAfterViewInit(): void {
    this.initPositionState();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initPositionState() {
    const position = this.cocktailState.getPosition();
    window.scrollTo(position.x, position.y)
  }

  initState() {
    const state: SearchQuery = this.cocktailState.getState()

    this.filterChange.emit(this.isFavoriteList ? state.favorites : state.cocktails);

    this.filterForm.patchValue({
      name: state.query,
      ingredient: state.ingredient,
      id: state.id
    })
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

  setAndEmit(data: Cocktail[], fav: boolean = false) {
    if(!fav) {
      this.isFavoriteList = false;
      this.router.navigate(['cocktails'])
      this.cocktailState.setCocktailState(data);
    } else {
      this.cocktailState.setFavoriteListState(data);
    }
    this.filterChange.emit(data);
  }

  goToFavoriteList() {
    this.isFavoriteList = !this.isFavoriteList;
    this.router.navigate(['cocktails'], this.isFavoriteList ? {queryParams: {favs: true}} : {});
    this.showFavorites();
  }

  showFavorites() {
    let cocktails: Cocktail[] = this.isFavoriteList ?
      this.storage.get(COCKTAIL_KEY).favorites :
      this.storage.get(COCKTAIL_KEY).cocktails;
    this.setAndEmit(cocktails, this.isFavoriteList);
  }
}
