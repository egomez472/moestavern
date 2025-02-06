import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    loadComponent: () => import('./cocktails-layout/cocktails-layout.component').then(c => c.CocktailsLayoutComponent)
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
