/**
 * Normalizes an unknown thrown value into a human-readable message.
 *
 * `catch` clauses receive `unknown`, so this keeps error handling type-safe
 * without sprinkling `any` across the codebase.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (typeof error === "string" && error.trim() !== "") {
    return error;
  }
  return fallback;
}
