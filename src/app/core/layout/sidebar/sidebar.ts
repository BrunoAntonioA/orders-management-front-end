import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MAIN_NAV_ITEMS } from '../../constants/navigation';
import { NavItem } from '../../models/nav-item.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly navItems: NavItem[] = MAIN_NAV_ITEMS;

  protected userEmail(): string | null {
    return this.auth.userEmail();
  }

  protected signOut(): void {
    this.auth.signOut().subscribe({
      next: () => {
        void this.router.navigate(['/login']);
      },
    });
  }
}
