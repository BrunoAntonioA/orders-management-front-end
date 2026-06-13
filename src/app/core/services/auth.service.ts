import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { authApi } from '../../shared/config/auth-api.config';
import {
  AuthSession,
  AuthUser,
  TokenResponse,
} from '../models/auth.model';

const SESSION_STORAGE_KEY = 'oms.auth.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly session = signal<AuthSession | null>(null);

  readonly user = this.session.asReadonly();

  constructor() {
    this.restoreFromStorage();
  }

  userId(): string | null {
    return this.session()?.user.id ?? null;
  }

  userEmail(): string | null {
    return this.session()?.user.email ?? null;
  }

  getAccessToken(): string | null {
    return this.session()?.accessToken ?? null;
  }

  isAuthenticated(): boolean {
    const current = this.session();
    return !!current && this.isSessionValid(current);
  }

  hasRefreshToken(): boolean {
    return !!this.readStoredSession()?.refreshToken;
  }

  signIn(email: string, password: string): Observable<AuthUser> {
    return this.http
      .post<TokenResponse>(authApi.tokenUrl, { email, password }, {
        params: { grant_type: 'password' },
      })
      .pipe(
        map((response) => this.persistSession(this.mapTokenResponse(response)).user),
        catchError((error) => throwError(() => new Error(toAuthError(error)))),
      );
  }

  signOut(): Observable<void> {
    const token = this.getAccessToken();

    const request$ = token
      ? this.http.post<void>(authApi.logoutUrl, {}).pipe(catchError(() => of(undefined)))
      : of(undefined);

    return request$.pipe(tap(() => this.clearSession()));
  }

  restoreSession(): Observable<boolean> {
    const stored = this.readStoredSession();
    if (!stored) {
      return of(false);
    }

    if (this.isSessionValid(stored)) {
      this.session.set(stored);
      return of(true);
    }

    if (!stored.refreshToken) {
      this.clearSession();
      return of(false);
    }

    return this.http
      .post<TokenResponse>(
        authApi.tokenUrl,
        { refresh_token: stored.refreshToken },
        { params: { grant_type: 'refresh_token' } },
      )
      .pipe(
        map((response) => {
          this.persistSession(this.mapTokenResponse(response));
          return true;
        }),
        catchError(() => {
          this.clearSession();
          return of(false);
        }),
      );
  }

  private restoreFromStorage(): void {
    const stored = this.readStoredSession();
    if (stored && this.isSessionValid(stored)) {
      this.session.set(stored);
    }
  }

  private persistSession(session: AuthSession): AuthSession {
    this.session.set(session);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    return session;
  }

  private clearSession(): void {
    this.session.set(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }

  private readStoredSession(): AuthSession | null {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw) as AuthSession;
      if (!parsed.accessToken || !parsed.user?.id) {
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  }

  private isSessionValid(session: AuthSession): boolean {
    return Date.now() / 1000 < session.expiresAt - 30;
  }

  private mapTokenResponse(response: TokenResponse): AuthSession {
    return {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      expiresAt: response.expires_at,
      user: {
        id: response.user.id,
        email: response.user.email ?? '',
      },
    };
  }
}

function toAuthError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as { msg?: string; error_description?: string; error?: string };
    if (body?.msg) {
      return body.msg;
    }
    if (body?.error_description) {
      return body.error_description;
    }
    if (body?.error) {
      return body.error;
    }
  }

  return 'Sign in failed. Check your email and password.';
}
