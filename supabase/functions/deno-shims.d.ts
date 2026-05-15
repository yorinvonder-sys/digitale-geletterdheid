declare namespace Deno {
  const env: {
    get(key: string): string | undefined;
  };

  function serve(handler: (request: Request) => Response | Promise<Response>): void;
}

interface SupabaseErrorLike {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

type SupabaseDataLike = {
  [key: string]: never;
} & Array<{
  [key: string]: never;
}>;

interface SupabaseQueryResultLike {
  data: SupabaseDataLike;
  error: SupabaseErrorLike | null;
  count?: number | null;
  status?: number;
  statusText?: string;
}

interface SupabaseQueryBuilderLike extends PromiseLike<SupabaseQueryResultLike> {
  select(columns?: string, options?: unknown): SupabaseQueryBuilderLike;
  insert(values: unknown, options?: unknown): SupabaseQueryBuilderLike;
  update(values: unknown, options?: unknown): SupabaseQueryBuilderLike;
  upsert(values: unknown, options?: unknown): SupabaseQueryBuilderLike;
  delete(options?: unknown): SupabaseQueryBuilderLike;
  eq(column: string, value: unknown): SupabaseQueryBuilderLike;
  neq(column: string, value: unknown): SupabaseQueryBuilderLike;
  gt(column: string, value: unknown): SupabaseQueryBuilderLike;
  gte(column: string, value: unknown): SupabaseQueryBuilderLike;
  lt(column: string, value: unknown): SupabaseQueryBuilderLike;
  lte(column: string, value: unknown): SupabaseQueryBuilderLike;
  is(column: string, value: unknown): SupabaseQueryBuilderLike;
  in(column: string, values: readonly unknown[]): SupabaseQueryBuilderLike;
  or(filters: string): SupabaseQueryBuilderLike;
  order(column: string, options?: unknown): SupabaseQueryBuilderLike;
  limit(count: number): SupabaseQueryBuilderLike;
  maybeSingle(): SupabaseQueryBuilderLike;
  single(): SupabaseQueryBuilderLike;
}

interface SupabaseUserLike {
  id: string;
  email?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}

interface SupabaseClientLike {
  from(table: string): SupabaseQueryBuilderLike;
  rpc(functionName: string, args?: Record<string, unknown>): SupabaseQueryBuilderLike;
  storage: {
    from(bucket: string): {
      download(path: string): Promise<{ data: Blob | null; error: SupabaseErrorLike | null }>;
    };
  };
  auth: {
    getUser(): Promise<{ data: { user: SupabaseUserLike | null }; error: SupabaseErrorLike | null }>;
    admin: {
      getUserById(userId: string): Promise<{ data: { user: SupabaseUserLike | null }; error: SupabaseErrorLike | null }>;
      updateUserById(userId: string, attributes: Record<string, unknown>): Promise<{ data: { user: SupabaseUserLike | null }; error: SupabaseErrorLike | null }>;
      deleteUser(userId: string): Promise<{ data: SupabaseDataLike; error: SupabaseErrorLike | null }>;
    };
  };
}

declare module "https://esm.sh/@supabase/supabase-js@2" {
  export function createClient(url: string, key: string, options?: unknown): SupabaseClientLike;
}

declare module "jsr:@supabase/supabase-js@2" {
  export function createClient(url: string, key: string, options?: unknown): SupabaseClientLike;
}

declare module "https://deno.land/std@0.177.0/http/server.ts" {
  export function serve(handler: (request: Request) => Response | Promise<Response>): void;
}

declare module "https://deno.land/x/denomailer@1.6.0/mod.ts" {
  export interface SMTPClientOptions {
    connection: {
      hostname: string;
      port: number;
      tls?: boolean;
      auth?: {
        username: string;
        password: string;
      };
    };
  }

  export interface SMTPMessage {
    from: string;
    to: string | string[];
    subject: string;
    content?: string;
    html?: string;
  }

  export class SMTPClient {
    constructor(options: SMTPClientOptions);
    send(message: SMTPMessage): Promise<void>;
    close(): Promise<void>;
  }
}

declare module "https://esm.sh/fflate@0.8.2" {
  export function strToU8(input: string): Uint8Array;
  export function zipSync(data: Record<string, Uint8Array>): Uint8Array;
}
