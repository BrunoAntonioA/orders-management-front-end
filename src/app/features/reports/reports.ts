import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { OrderStatusBadge } from '../../shared/components/order-status-badge/order-status-badge';
import { DELIVERY_STATUS_LABELS, DeliveryStatus } from '../delivery/models/delivery.model';
import { ReportSnapshot } from './models/reports.model';
import { ReportsService } from './services/reports.service';

@Component({
  selector: 'app-reports',
  imports: [PageHeader, RouterLink, OrderStatusBadge, CurrencyPipe, DatePipe, PercentPipe],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports {
  private readonly reportsService = inject(ReportsService);

  protected readonly report = signal<ReportSnapshot | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly deliveryStatusLabels = DELIVERY_STATUS_LABELS;

  constructor() {
    this.loadReport();
  }

  protected loadReport(): void {
    this.loading.set(true);
    this.error.set(null);

    this.reportsService.getReport().subscribe({
      next: (snapshot) => {
        this.report.set(snapshot);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        const message = err instanceof Error ? err.message : 'Could not load reports.';
        this.error.set(message);
        this.loading.set(false);
      },
    });
  }

  protected statusShare(count: number, total: number): number {
    return total ? count / total : 0;
  }

  protected deliveryStatusLabel(status: string): string {
    return this.deliveryStatusLabels[status as DeliveryStatus] ?? status;
  }
}
