import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { DeliveryStatusBadge } from '../../../../shared/components/delivery-status-badge/delivery-status-badge';
import { DeliveryRoute } from '../../models/delivery.model';
import { DeliveryService } from '../../services/delivery.service';

@Component({
  selector: 'app-delivery-list',
  imports: [PageHeader, RouterLink, DeliveryStatusBadge, DatePipe],
  templateUrl: './delivery-list.html',
  styleUrl: './delivery-list.css',
})
export class DeliveryList {
  private readonly deliveryService = inject(DeliveryService);

  protected readonly deliveries = signal<DeliveryRoute[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly deletingId = signal<string | null>(null);

  constructor() {
    this.loadDeliveries();
  }

  protected loadDeliveries(): void {
    this.loading.set(true);
    this.error.set(null);

    this.deliveryService.getDeliveries().subscribe({
      next: (deliveries) => {
        this.deliveries.set(deliveries);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.error.set(err instanceof Error ? err.message : 'Could not load deliveries.');
        this.loading.set(false);
      },
    });
  }

  protected deleteDelivery(delivery: DeliveryRoute): void {
    const label = delivery.name ?? delivery.routeDate;
    if (!confirm(`Delete delivery "${label}"? Orders will be unassigned.`)) {
      return;
    }

    this.deletingId.set(delivery.id);
    this.deliveryService.deleteDelivery(delivery.id).subscribe({
      next: () => {
        this.deliveries.update((list) => list.filter((entry) => entry.id !== delivery.id));
        this.deletingId.set(null);
      },
      error: (err: unknown) => {
        this.error.set(err instanceof Error ? err.message : 'Could not delete delivery.');
        this.deletingId.set(null);
      },
    });
  }
}
