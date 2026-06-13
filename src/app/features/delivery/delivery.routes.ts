import { Routes } from '@angular/router';

export const DELIVERY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/delivery-list/delivery-list').then((m) => m.DeliveryList),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/delivery-form/delivery-form').then((m) => m.DeliveryForm),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/delivery-detail/delivery-detail').then((m) => m.DeliveryDetail),
  },
];
