import { Routes } from '@angular/router';

export const CLIENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/client-list/client-list').then((m) => m.ClientList),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/client-form/client-form').then((m) => m.ClientForm),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/client-form/client-form').then((m) => m.ClientForm),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/client-detail/client-detail').then((m) => m.ClientDetail),
  },
];
