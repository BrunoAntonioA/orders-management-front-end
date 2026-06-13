import { Component, inject, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { CustomersService } from '../../services/customers.service';
import { OrdersService } from '../../services/orders.service';
import { Customer } from '../../models/customer.model';
import { ORDER_STATUS_LABELS, CreateOrderPayload, OrderStatus } from '../../models/order.model';

interface OrderItemFormValue {
  product: string;
  quantity: number;
  unitPrice: number;
}

interface OrderFormValue {
  customerId: string;
  orderDate: string;
  status: OrderStatus;
  notes: string;
  items: OrderItemFormValue[];
}

@Component({
  selector: 'app-order-form',
  imports: [ReactiveFormsModule, RouterLink, PageHeader, CurrencyPipe],
  templateUrl: './order-form.html',
  styleUrl: './order-form.css',
})
export class OrderForm {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ordersService = inject(OrdersService);
  private readonly customersService = inject(CustomersService);

  protected readonly isEditMode = signal(false);
  protected readonly orderId = signal<string | null>(null);
  protected readonly customers = signal<Customer[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly statusOptions = Object.entries(ORDER_STATUS_LABELS) as [
    OrderStatus,
    string,
  ][];

  protected readonly form = this.fb.group({
    customerId: ['', Validators.required],
    orderDate: [this.todayIsoDate(), Validators.required],
    status: ['created' as OrderStatus, Validators.required],
    notes: [''],
    items: this.fb.array([this.createItemGroup()]),
  });

  protected get computedTotal(): number {
    return this.form.controls.items.controls.reduce((sum, group) => {
      const quantity = Number(group.controls['quantity'].value) || 0;
      const unitPrice = Number(group.controls['unitPrice'].value) || 0;
      return sum + quantity * unitPrice;
    }, 0);
  }

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    const isEdit = this.route.snapshot.url.some((segment) => segment.path === 'edit');

    this.isEditMode.set(isEdit && !!id);
    this.orderId.set(id);

    this.customersService.getCustomers().subscribe({
      next: (customers) => {
        this.customers.set(customers);

        if (this.isEditMode() && id) {
          this.loadOrder(id);
        } else {
          this.loading.set(false);
        }
      },
      error: () => {
        this.error.set('Could not load customers.');
        this.loading.set(false);
      },
    });
  }

  protected get items(): FormArray<FormGroup> {
    return this.form.controls.items;
  }

  protected addItem(): void {
    this.items.push(this.createItemGroup());
  }

  protected removeItem(index: number): void {
    if (this.items.length === 1) {
      return;
    }
    this.items.removeAt(index);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    const value = this.form.getRawValue() as OrderFormValue;
    const payload: CreateOrderPayload = {
      customerId: value.customerId,
      orderDate: value.orderDate,
      status: value.status,
      notes: value.notes || undefined,
      items: value.items.map((item) => ({
        product: item.product,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
    };

    const request$ =
      this.isEditMode() && this.orderId()
        ? this.ordersService.updateOrder(this.orderId()!, payload)
        : this.ordersService.createOrder(payload);

    request$.subscribe({
      next: (order) => {
        this.saving.set(false);
        void this.router.navigate(['/orders', order.id]);
      },
      error: () => {
        this.saving.set(false);
        this.error.set('Could not save the order. Please try again.');
      },
    });
  }

  protected isInvalid(controlName: string, index?: number): boolean {
    if (index !== undefined) {
      const group = this.items.at(index);
      const control = group.get(controlName);
      return !!control && control.invalid && control.touched;
    }

    const control = this.form.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  private loadOrder(id: string): void {
    this.ordersService.getOrderById(id).subscribe({
      next: (order) => {
        this.form.patchValue({
          customerId: order.customerId,
          orderDate: order.orderDate,
          status: order.status,
          notes: order.notes ?? '',
        });

        this.items.clear();
        order.items.forEach((item) => {
          this.items.push(
            this.createItemGroup({
              product: item.product,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            }),
          );
        });

        this.loading.set(false);
      },
      error: () => {
        this.error.set('Order not found.');
        this.loading.set(false);
      },
    });
  }

  private createItemGroup(item?: {
    product: string;
    quantity: number;
    unitPrice: number;
  }): FormGroup {
    return this.fb.group({
      product: [item?.product ?? '', Validators.required],
      quantity: [item?.quantity ?? 1, [Validators.required, Validators.min(1)]],
      unitPrice: [item?.unitPrice ?? 0, [Validators.required, Validators.min(0)]],
    });
  }

  private todayIsoDate(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
