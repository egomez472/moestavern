import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CocktailFilterInterface } from '../../core/interfaces/cocktail-filter.interface';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { CocktailsService } from '../../core/services/cocktails/cocktails.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-cocktail-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './cocktail-filter.component.html',
  styleUrl: './cocktail-filter.component.scss'
})
export class CocktailFilterComponent implements OnInit, OnDestroy {
  @Output() filterChange = new EventEmitter<CocktailFilterInterface>();
  private destroy$ = new Subject<void>();

  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cocktailSvc: CocktailsService
  ) {
    this.filterForm = this.fb.group({
      name: ['',[Validators.pattern(/^[a-zA-Z\s]*$/), Validators.maxLength(50)]],
      ingredient: ['', [Validators.pattern(/^[a-zA-Z\s]*$/), Validators.maxLength(50)]],
      id: [null, [Validators.pattern(/^\d*$/)]]
    });
  }

  ngOnInit(): void {
    this.filterForm.get("name")?.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(500)
    ).subscribe(
      value => this.getCocktailByName(value)
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCocktailByName(value: string) {
    const name = value;
    this.cocktailSvc.getCocktailByName(name).pipe(takeUntil(this.destroy$)).subscribe(
      response => {
        console.log(response);
        this.filterChange.emit({
          name: name,
          ingredient: this.filterForm.get('ingredient')?.value || '',
          id: this.filterForm.get('id')?.value || null,
        });
      }
    )
  }

}
