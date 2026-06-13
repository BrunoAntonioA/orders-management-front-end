import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

export const SUPABASE_WRITE_HEADERS = new HttpHeaders({
  Prefer: 'return=representation',
});

export function readSupabaseError(error: HttpErrorResponse, fallback: string): string {
  const body = error.error as { message?: string; details?: string; hint?: string } | null;
  const message = body?.message ?? body?.details ?? fallback;

  if (message.includes('customers_owner_id_fkey')) {
    return 'Invalid owner. Check Supabase auth user configuration.';
  }

  if (message.includes('foreign key') || message.includes('violates foreign key')) {
    return 'This client has orders and cannot be deleted.';
  }

  return message;
}

export function requireFirstRow<T>(rows: T[] | null | undefined, notFoundMessage: string): T {
  const row = rows?.[0];
  if (!row) {
    throw new Error(notFoundMessage);
  }
  return row;
}

export function toServiceError(error: unknown, fallback: string): Error {
  if (error instanceof HttpErrorResponse) {
    return new Error(readSupabaseError(error, fallback));
  }
  if (error instanceof Error) {
    return error;
  }
  return new Error(fallback);
}
