import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import {
  CreateCustomerPayload,
  Customer,
} from '../../../../shared/models/customer.model';
import { ClientsService } from '../../services/clients.service';

interface ClientFormValue {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  addressHint: string;
  notes: string;
}

@Component({
  selector: 'app-client-form',
  imports: [ReactiveFormsModule, RouterLink, PageHeader],
  templateUrl: './client-form.html',
  styleUrl: './client-form.css',
})
export class ClientForm {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly clientsService = inject(ClientsService);

  protected readonly isEditMode = signal(false);
  protected readonly clientId = signal<string | null>(null);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: [''],
    email: [''],
    address: ['', Validators.required],
    addressHint: [''],
    notes: [''],
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    const isEdit = this.route.snapshot.url.some((segment) => segment.path === 'edit');

    this.isEditMode.set(isEdit && !!id);
    this.clientId.set(id);

    if (this.isEditMode() && id) {
      this.loadClient(id);
    } else {
      this.loading.set(false);
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    const value = this.form.getRawValue() as ClientFormValue;
    const payload: CreateCustomerPayload = {
      firstName: value.firstName,
      lastName: value.lastName,
      phone: value.phone || undefined,
      email: value.email || undefined,
      address: value.address,
      addressHint: value.addressHint || undefined,
      notes: value.notes || undefined,
    };

    const request$ =
      this.isEditMode() && this.clientId()
        ? this.clientsService.updateClient(this.clientId()!, payload)
        : this.clientsService.createClient(payload);

    request$.subscribe({
      next: (client) => {
        this.saving.set(false);
        void this.router.navigate(['/clients', client.id]);
      },
      error: (err: unknown) => {
        const message = err instanceof Error ? err.message : 'Could not save client.';
        this.error.set(message);
        this.saving.set(false);
      },
    });
  }

  protected isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  private loadClient(id: string): void {
    this.clientsService.getClientById(id).subscribe({
      next: (client: Customer) => {
        this.form.patchValue({
          firstName: client.firstName,
          lastName: client.lastName,
          phone: client.phone ?? '',
          email: client.email ?? '',
          address: client.address,
          addressHint: client.addressHint ?? '',
          notes: client.notes ?? '',
        });
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Client not found.');
        this.loading.set(false);
      },
    });
  }
}
