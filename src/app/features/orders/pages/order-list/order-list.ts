import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { OrderStatusBadge } from '../../../../shared/components/order-status-badge/order-status-badge';
import { OrdersService } from '../../services/orders.service';
import { OrderWithCustomer, canMarkAsDelivered } from '../../models/order.model';

@Component({
  selector: 'app-order-list',
  imports: [PageHeader, RouterLink, OrderStatusBadge, CurrencyPipe, DatePipe],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css',
})
export class OrderList {
  private readonly ordersService = inject(OrdersService);

  protected readonly orders = signal<OrderWithCustomer[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly markingDeliveredId = signal<string | null>(null);

  protected readonly canMarkDelivered = canMarkAsDelivered;

  constructor() {
    this.loadOrders();
  }

  protected loadOrders(): void {
    this.loading.set(true);
    this.error.set(null);

    this.ordersService.getOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load orders. Please try again.');
        this.loading.set(false);
      },
    });
  }

  protected shortId(id: string): string {
    return id.slice(0, 8).toUpperCase();
  }

  protected markAsDelivered(orderId: string): void {
    this.markingDeliveredId.set(orderId);

    this.ordersService.markAsDelivered(orderId).subscribe({
      next: (updated) => {
        this.orders.update((list) =>
          list.map((order) => (order.id === orderId ? updated : order)),
        );
        this.markingDeliveredId.set(null);
      },
      error: () => {
        this.error.set('Could not mark order as delivered.');
        this.markingDeliveredId.set(null);
      },
    });
  }
}
