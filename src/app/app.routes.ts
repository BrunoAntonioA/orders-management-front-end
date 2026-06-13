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
        loadChildren: () =>
          import('./features/orders/orders.routes').then((m) => m.ORDERS_ROUTES),
      },
      {
        path: 'clients',
        loadChildren: () =>
          import('./features/clients/clients.routes').then((m) => m.CLIENTS_ROUTES),
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
