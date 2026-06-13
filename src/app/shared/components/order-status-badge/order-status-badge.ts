import { Component, input } from '@angular/core';
import {
  ORDER_STATUS_LABELS,
  OrderStatus,
} from '../../../features/orders/models/order.model';

@Component({
  selector: 'app-order-status-badge',
  templateUrl: './order-status-badge.html',
  styleUrl: './order-status-badge.css',
})
export class OrderStatusBadge {
  readonly status = input.required<OrderStatus>();

  protected label(status: OrderStatus): string {
    return ORDER_STATUS_LABELS[status];
  }
}
