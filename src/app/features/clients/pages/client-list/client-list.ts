import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { customerFullName } from '../../../../shared/models/customer.model';
import { Customer } from '../../../../shared/models/customer.model';
import { ClientsService } from '../../services/clients.service';

@Component({
  selector: 'app-client-list',
  imports: [PageHeader, RouterLink, DatePipe],
  templateUrl: './client-list.html',
  styleUrl: './client-list.css',
})
export class ClientList {
  private readonly clientsService = inject(ClientsService);

  protected readonly clients = signal<Customer[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly deletingId = signal<string | null>(null);

  protected readonly fullName = customerFullName;

  constructor() {
    this.loadClients();
  }

  protected loadClients(): void {
    this.loading.set(true);
    this.error.set(null);

    this.clientsService.getClients().subscribe({
      next: (clients) => {
        this.clients.set(clients);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        const message = err instanceof Error ? err.message : 'Could not load clients.';
        this.error.set(message);
        this.loading.set(false);
      },
    });
  }

  protected deleteClient(client: Customer, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!confirm(`Delete ${customerFullName(client)}?`)) {
      return;
    }

    this.deletingId.set(client.id);
    this.clientsService.deleteClient(client.id).subscribe({
      next: () => {
        this.clients.update((list) => list.filter((entry) => entry.id !== client.id));
        this.deletingId.set(null);
      },
      error: (err: Error) => {
        this.error.set(err.message ?? 'Could not delete client.');
        this.deletingId.set(null);
      },
    });
  }
}
