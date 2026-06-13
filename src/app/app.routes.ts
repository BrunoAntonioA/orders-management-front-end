import { Routes } from '@angular/router';
import { DashboardLayout } from './core/layout/dashboard-layout/dashboard-layout';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayout,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/orders/orders').then((m) => m.Orders),
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('./features/clients/clients').then((m) => m.Clients),
      },
      {
        path: 'delivery',
        loadComponent: () =>
          import('./features/delivery/delivery').then((m) => m.Delivery),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/reports/reports').then((m) => m.Reports),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
