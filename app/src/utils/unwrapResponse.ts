import type { GenericResponse } from "@types";

/**
 * Extracts data from a GenericResponse. Throws if response indicates failure.
 * @param response - A generic API response
 * @returns The unwrapped `data` value
 */
export function unwrapResponse<T>(response: GenericResponse<T>): T {
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
}
