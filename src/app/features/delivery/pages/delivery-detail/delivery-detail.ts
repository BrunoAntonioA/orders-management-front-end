import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { DeliveryStatusBadge } from '../../../../shared/components/delivery-status-badge/delivery-status-badge';
import { OrderStatusBadge } from '../../../../shared/components/order-status-badge/order-status-badge';
import { OrderWithCustomer } from '../../../orders/models/order.model';
import { DeliveryWithOrders, DeliveryService } from '../../services/delivery.service';

@Component({
  selector: 'app-delivery-detail',
  imports: [
    PageHeader,
    RouterLink,
    DeliveryStatusBadge,
    OrderStatusBadge,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './delivery-detail.html',
  styleUrl: './delivery-detail.css',
})
export class DeliveryDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly deliveryService = inject(DeliveryService);

  protected readonly delivery = signal<DeliveryWithOrders | null>(null);
  protected readonly availableOrders = signal<OrderWithCustomer[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly actingOrderId = signal<string | null>(null);

  private deliveryId = '';

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Invalid delivery.');
      this.loading.set(false);
      return;
    }

    this.deliveryId = id;
    this.loadDelivery();
  }

  protected loadDelivery(): void {
    this.loading.set(true);
    this.error.set(null);

    this.deliveryService.getDeliveryWithOrders(this.deliveryId).subscribe({
      next: (delivery) => {
        this.delivery.set(delivery);
        this.loading.set(false);
        this.loadAvailableOrders();
      },
      error: (err: unknown) => {
        this.error.set(err instanceof Error ? err.message : 'Delivery not found.');
        this.loading.set(false);
      },
    });
  }

  protected addOrder(orderId: string): void {
    this.actingOrderId.set(orderId);

    this.deliveryService.addOrderToDelivery(this.deliveryId, orderId).subscribe({
      next: () => {
        this.actingOrderId.set(null);
        this.loadDelivery();
      },
      error: (err: unknown) => {
        this.error.set(err instanceof Error ? err.message : 'Could not add order.');
        this.actingOrderId.set(null);
      },
    });
  }

  protected removeOrder(orderId: string): void {
    this.actingOrderId.set(orderId);

    this.deliveryService.removeOrderFromDelivery(orderId).subscribe({
      next: () => {
        this.actingOrderId.set(null);
        this.loadDelivery();
      },
      error: (err: unknown) => {
        this.error.set(err instanceof Error ? err.message : 'Could not remove order.');
        this.actingOrderId.set(null);
      },
    });
  }

  protected shortId(id: string): string {
    return id.slice(0, 8).toUpperCase();
  }

  private loadAvailableOrders(): void {
    this.deliveryService.getAssignableOrders().subscribe({
      next: (orders) => {
        const assignedIds = new Set(this.delivery()?.orders.map((order) => order.id) ?? []);
        this.availableOrders.set(orders.filter((order) => !assignedIds.has(order.id)));
      },
    });
  }
}
