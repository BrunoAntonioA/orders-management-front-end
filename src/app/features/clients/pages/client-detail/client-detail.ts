import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { customerFullName } from '../../../../shared/models/customer.model';
import { Customer } from '../../../../shared/models/customer.model';
import { ClientsService } from '../../services/clients.service';

@Component({
  selector: 'app-client-detail',
  imports: [PageHeader, RouterLink, DatePipe],
  templateUrl: './client-detail.html',
  styleUrl: './client-detail.css',
})
export class ClientDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly clientsService = inject(ClientsService);

  protected readonly client = signal<Customer | null>(null);
  protected readonly loading = signal(true);
  protected readonly deleting = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly fullName = customerFullName;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Invalid client.');
      this.loading.set(false);
      return;
    }

    this.clientsService.getClientById(id).subscribe({
      next: (client) => {
        this.client.set(client);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        const message = err instanceof Error ? err.message : 'Client not found.';
        this.error.set(message);
        this.loading.set(false);
      },
    });
  }

  protected deleteClient(): void {
    const current = this.client();
    if (!current || !confirm(`Delete ${customerFullName(current)}?`)) {
      return;
    }

    this.deleting.set(true);
    this.clientsService.deleteClient(current.id).subscribe({
      next: () => {
        void this.router.navigate(['/clients']);
      },
      error: (err: Error) => {
        this.error.set(err.message ?? 'Could not delete client.');
        this.deleting.set(false);
      },
    });
  }
}
