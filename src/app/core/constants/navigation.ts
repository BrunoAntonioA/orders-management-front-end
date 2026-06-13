import { NavItem } from '../models/nav-item.model';

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    description: 'Overview and quick access',
    icon: 'dashboard',
  },
  {
    label: 'Orders',
    path: '/orders',
    description: 'Manage and track orders',
    icon: 'orders',
  },
  {
    label: 'Clients',
    path: '/clients',
    description: 'Customer directory and details',
    icon: 'clients',
  },
  {
    label: 'Delivery',
    path: '/delivery',
    description: 'Shipments and logistics',
    icon: 'delivery',
  },
  {
    label: 'Reports',
    path: '/reports',
    description: 'Analytics and exports',
    icon: 'reports',
  },
];
