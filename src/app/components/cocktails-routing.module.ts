import { NgModule } from '@angular/core';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { Routetrategy } from '../core/utils/strategy/route-strategy';

const routes: Routes = [
  {
    path:'',
    loadComponent: () => import('./cocktails-layout/cocktails-layout.component').then(c => c.CocktailsLayoutComponent),
    children: [
      {
        path: 'favorites',
        loadComponent: () => import('./favorites/favorites.component').then(c => c.FavoritesComponent)
      }
    ]
  },
  {
    path: ':id',
    loadComponent: () => import('./cocktail-detail/cocktail-detail.component').then(c => c.CocktailDetailComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    {provide: RouteReuseStrategy, useClass: Routetrategy}
  ]
})
export class CocktailsRoutingModule { }
