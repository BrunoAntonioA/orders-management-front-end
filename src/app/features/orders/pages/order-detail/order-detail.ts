import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { OrderStatusBadge } from '../../../../shared/components/order-status-badge/order-status-badge';
import { CustomerSummaryCard } from '../../components/customer-summary-card/customer-summary-card';
import { OrdersService } from '../../services/orders.service';
import { OrderWithCustomer, canMarkAsDelivered } from '../../models/order.model';

@Component({
  selector: 'app-order-detail',
  imports: [
    PageHeader,
    RouterLink,
    OrderStatusBadge,
    CustomerSummaryCard,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css',
})
export class OrderDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly ordersService = inject(OrdersService);

  protected readonly order = signal<OrderWithCustomer | null>(null);
  protected readonly loading = signal(true);
  protected readonly markingDelivered = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly canMarkDelivered = canMarkAsDelivered;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Invalid order.');
      this.loading.set(false);
      return;
    }

    this.ordersService.getOrderById(id).subscribe({
      next: (order) => {
        this.order.set(order);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Order not found.');
        this.loading.set(false);
      },
    });
  }

  protected shortId(id: string): string {
    return id.slice(0, 8).toUpperCase();
  }

  protected lineTotal(quantity: number, unitPrice: number): number {
    return quantity * unitPrice;
  }

  protected markAsDelivered(): void {
    const current = this.order();
    if (!current || !canMarkAsDelivered(current.status)) {
      return;
    }

    this.markingDelivered.set(true);
    this.ordersService.markAsDelivered(current.id).subscribe({
      next: (updated) => {
        this.order.set(updated);
        this.markingDelivered.set(false);
      },
      error: () => {
        this.error.set('Could not mark order as delivered.');
        this.markingDelivered.set(false);
      },
    });
  }
}
