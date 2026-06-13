import { Component, input } from '@angular/core';
import {
  DELIVERY_STATUS_LABELS,
  DeliveryStatus,
} from '../../../features/delivery/models/delivery.model';

@Component({
  selector: 'app-delivery-status-badge',
  templateUrl: './delivery-status-badge.html',
  styleUrl: './delivery-status-badge.css',
})
export class DeliveryStatusBadge {
  readonly status = input.required<DeliveryStatus>();

  protected label(status: DeliveryStatus): string {
    return DELIVERY_STATUS_LABELS[status];
  }
}
