// src/services/apiService.ts

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

export interface RequestOptions extends Omit<RequestInit, "method" | "body"> {
  /**
   * Query parameters opsional (e.g. { page: 1, limit: 10, search: 'react' })
   */
  params?: QueryParams;
  /**
   * Base URL opsional jika ingin menimpa default origin
   */
  baseUrl?: string;
  /**
   * Timeout request dalam milidetik (default: 30000 / 30 detik)
   */
  timeout?: number;
}

export interface MutationOptions<TBody = unknown> extends RequestOptions {
  /**
   * Data payload/body yang akan dikirim (object biasa atau FormData)
   */
  body?: TBody;
}

/**
 * Custom Error Class untuk menangani error response HTTP
 */
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Helper untuk menyusun query params ke dalam URL secara aman
 */
function buildUrl(url: string, params?: QueryParams, baseUrl?: string): string {
  const isAbsolute = url.startsWith("http://") || url.startsWith("https://");
  const base =
    baseUrl || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

  const urlObj = isAbsolute ? new URL(url) : new URL(url, base);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        urlObj.searchParams.append(key, String(value));
      }
    });
  }

  // Jika URL input berupa relative path ("/api/...") dan tanpa custom baseUrl,
  // kembalikan pathname + query params saja
  if (!isAbsolute && !baseUrl) {
    return `${urlObj.pathname}${urlObj.search}`;
  }

  return urlObj.toString();
}

/**
 * Core Request Function (Wrapper fetch dengan interceptor dasar)
 */
async function coreRequest<TResponse>(
  method: HttpMethod,
  url: string,
  options: MutationOptions = {},
): Promise<TResponse> {
  const { params, baseUrl, body, headers = {}, timeout = 30000, ...restOptions } = options;
  const targetUrl = buildUrl(url, params, baseUrl);

  // Setup abort controller untuk handling timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Deteksi tipe body (apakah FormData atau JSON object)
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const finalHeaders: HeadersInit = {
    ...(!isFormData && { "Content-Type": "application/json" }),
    Accept: "application/json",
    ...headers,
  };

  const finalBody =
    body === undefined || body === null ? undefined : isFormData ? body : JSON.stringify(body);

  try {
    const response = await fetch(targetUrl, {
      method,
      headers: finalHeaders,
      body: finalBody,
      signal: controller.signal,
      ...restOptions,
    });

    clearTimeout(timeoutId);

    // Handle jika status respons bukan 2xx
    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }

      throw new ApiError(
        `Request gagal [${response.status}]: ${response.statusText}`,
        response.status,
        errorData,
      );
    }

    // Handle jika status response 204 No Content (biasanya response DELETE)
    if (response.status === 204) {
      return {} as TResponse;
    }

    const data: TResponse = await response.json();
    return data;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError(`Request timeout setelah ${timeout}ms`, 408);
    }

    throw new ApiError(error instanceof Error ? error.message : "Unknown network failure", 0);
  }
}

// ==========================================
// Export Method Functions
// ==========================================

export async function onGet<TResponse>(url: string, options?: RequestOptions): Promise<TResponse> {
  return coreRequest<TResponse>("GET", url, options);
}

export async function onPost<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  options?: RequestOptions,
): Promise<TResponse> {
  return coreRequest<TResponse>("POST", url, { ...options, body });
}

export async function onPut<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  options?: RequestOptions,
): Promise<TResponse> {
  return coreRequest<TResponse>("PUT", url, { ...options, body });
}

export async function onPatch<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  options?: RequestOptions,
): Promise<TResponse> {
  return coreRequest<TResponse>("PATCH", url, { ...options, body });
}

export async function onDelete<TResponse>(
  url: string,
  options?: RequestOptions,
): Promise<TResponse> {
  return coreRequest<TResponse>("DELETE", url, options);
}

// Object grouping
export const apiService = {
  onGet,
  onPost,
  onPut,
  onPatch,
  onDelete,
};

export default apiService;
