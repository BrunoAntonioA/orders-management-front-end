import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MAIN_NAV_ITEMS } from '../../constants/navigation';
import { NavItem } from '../../models/nav-item.model';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  protected readonly navItems: NavItem[] = MAIN_NAV_ITEMS;
}
