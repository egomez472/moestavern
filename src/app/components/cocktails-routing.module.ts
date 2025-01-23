import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    loadComponent: () => import('./cocktails-list/cocktails-list.component').then(c => c.CocktailsListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./cocktail-detail/cocktail-detail.component').then(c => c.CocktailDetailComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CocktailsRoutingModule { }
