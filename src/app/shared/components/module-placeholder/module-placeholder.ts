import { Component, input } from '@angular/core';

@Component({
  selector: 'app-module-placeholder',
  templateUrl: './module-placeholder.html',
  styleUrl: './module-placeholder.css',
})
export class ModulePlaceholder {
  readonly message = input.required<string>();
}
