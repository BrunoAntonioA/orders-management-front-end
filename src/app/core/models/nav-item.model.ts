export interface NavItem {
  label: string;
  path: string;
  description: string;
  icon: 'dashboard' | 'orders' | 'clients' | 'delivery' | 'reports';
}
