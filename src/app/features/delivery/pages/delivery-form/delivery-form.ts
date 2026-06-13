import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { CreateDeliveryPayload } from '../../models/delivery.model';
import { DeliveryService } from '../../services/delivery.service';

interface DeliveryFormValue {
  routeDate: string;
  name: string;
  driver: string;
  notes: string;
}

@Component({
  selector: 'app-delivery-form',
  imports: [ReactiveFormsModule, RouterLink, PageHeader],
  templateUrl: './delivery-form.html',
})
export class DeliveryForm {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly deliveryService = inject(DeliveryService);

  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.group({
    routeDate: [this.todayIsoDate(), Validators.required],
    name: [''],
    driver: [''],
    notes: [''],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    const value = this.form.getRawValue() as DeliveryFormValue;
    const payload: CreateDeliveryPayload = {
      routeDate: value.routeDate,
      name: value.name || undefined,
      driver: value.driver || undefined,
      notes: value.notes || undefined,
    };

    this.deliveryService.createDelivery(payload).subscribe({
      next: (delivery) => {
        this.saving.set(false);
        void this.router.navigate(['/delivery', delivery.id]);
      },
      error: (err: unknown) => {
        this.error.set(err instanceof Error ? err.message : 'Could not create delivery.');
        this.saving.set(false);
      },
    });
  }

  protected isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  private todayIsoDate(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
