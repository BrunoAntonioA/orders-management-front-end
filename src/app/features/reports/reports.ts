import { Component } from '@angular/core';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { ModulePlaceholder } from '../../shared/components/module-placeholder/module-placeholder';

@Component({
  selector: 'app-reports',
  imports: [PageHeader, ModulePlaceholder],
  templateUrl: './reports.html',
})
export class Reports {}
