/**
 * Supabase configuration, read once and reported honestly.
 *
 * The application is expected to run without a backend: until a project exists,
 * the data layer serves the seed data in src/data. `isSupabaseConfigured` is the
 * switch, and it is a plain boolean rather than a thrown error so that a missing
 * environment variable degrades to the demo rather than to a white screen.
 */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured =
  supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

/**
 * Server-only. Bypasses every row-level policy, so it is read lazily and never
 * exported as a value that a client bundle could reach.
 */
export function serviceRoleKey(): string {
  if (typeof window !== "undefined") {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY was read in the browser. It bypasses row level security and must stay on the server."
    );
  }
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return key;
}
