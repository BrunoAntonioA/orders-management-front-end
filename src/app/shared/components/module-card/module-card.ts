import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavItem } from '../../../core/models/nav-item.model';

@Component({
  selector: 'app-module-card',
  imports: [RouterLink],
  templateUrl: './module-card.html',
  styleUrl: './module-card.css',
})
export class ModuleCard {
  readonly module = input.required<NavItem>();
}
