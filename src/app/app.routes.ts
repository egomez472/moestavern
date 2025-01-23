import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/cocktails',
    pathMatch: 'full'
  },
  {
    path: 'cocktails',
    loadChildren: () => import('./components/cocktails.module').then(m => m.CocktailsModule)
  }
];
