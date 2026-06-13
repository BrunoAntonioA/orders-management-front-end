import { Component, input } from '@angular/core';
import { CustomerSummary } from '../../models/order.model';

@Component({
  selector: 'app-customer-summary-card',
  templateUrl: './customer-summary-card.html',
  styleUrl: './customer-summary-card.css',
})
export class CustomerSummaryCard {
  readonly customer = input.required<CustomerSummary>();
}
