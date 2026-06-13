import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { supabaseAuthApi } from '../../shared/config/customers-api.config';
import { AuthService } from './auth.service';

interface AuthUsersResponse {
  users: { id: string }[];
}

@Injectable({ providedIn: 'root' })
export class OwnerService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private cachedOwnerId: string | null = null;

  getOwnerId(): Observable<string> {
    const authUserId = this.authService.userId();
    if (authUserId) {
      return of(authUserId);
    }

    if (this.cachedOwnerId) {
      return of(this.cachedOwnerId);
    }

    if (environment.supabase.ownerId) {
      this.cachedOwnerId = environment.supabase.ownerId;
      return of(this.cachedOwnerId);
    }

    return this.http
      .get<AuthUsersResponse>(supabaseAuthApi.usersUrl, {
        params: { per_page: 1 },
      })
      .pipe(
        map((response) => {
          const ownerId = response.users[0]?.id;
          if (!ownerId) {
            throw new Error(
              'No auth user found. Create a user in Supabase → Authentication first.',
            );
          }
          return ownerId;
        }),
        tap((ownerId) => {
          this.cachedOwnerId = ownerId;
        }),
      );
  }
}
