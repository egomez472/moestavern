import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CocktailFilterInterface } from '../../core/interfaces/cocktail-filter.interface';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cocktail-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './cocktail-filter.component.html',
  styleUrl: './cocktail-filter.component.scss'
})
export class CocktailFilterComponent implements OnDestroy {
  @Output() filterChange = new EventEmitter<CocktailFilterInterface>();
  private destroy$ = new Subject<void>();

  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      name: ['',[Validators.pattern(/^[a-zA-Z\s]*$/), Validators.maxLength(50)]],
      ingredient: ['', [Validators.pattern(/^[a-zA-Z\s]*$/), Validators.maxLength(50)]],
      id: [null, [Validators.pattern(/^\d*$/)]]
    });

    this.filterForm.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300)
    ).subscribe((values) => {
      console.log(this.filterForm.value);

      if (this.filterForm.valid) {
        this.filterChange.emit(values);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
