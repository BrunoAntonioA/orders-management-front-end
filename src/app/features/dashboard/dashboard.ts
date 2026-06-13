import { Component } from '@angular/core';
import { MAIN_NAV_ITEMS } from '../../core/constants/navigation';
import { NavItem } from '../../core/models/nav-item.model';
import { ModuleCard } from '../../shared/components/module-card/module-card';
import { PageHeader } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-dashboard',
  imports: [PageHeader, ModuleCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  protected readonly modules: NavItem[] = MAIN_NAV_ITEMS.filter(
    (item) => item.path !== '/dashboard',
  );
}
