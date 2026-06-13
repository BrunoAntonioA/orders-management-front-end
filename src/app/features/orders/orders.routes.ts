import { Routes } from '@angular/router';

export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/order-list/order-list').then((m) => m.OrderList),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/order-form/order-form').then((m) => m.OrderForm),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/order-form/order-form').then((m) => m.OrderForm),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/order-detail/order-detail').then((m) => m.OrderDetail),
  },
];
