// src/services/api.ts
import { API_BASE_URL } from "../constants";
import { type ApiError } from "../types/types";

export async function get<T = unknown>(
    url: string,
    signal?: AbortSignal
): Promise<T> {
    try {
        const response = await fetch(
            url.startsWith("http") ? url : API_BASE_URL + url,
            {
                signal,
                headers: { "Content-Type": "application/json" },
            }
        );

        if (!response.ok) {
            throw {
                message: `HTTP error! status: ${response.status}`,
                status: response.status,
            } as ApiError;
        }

        return await response.json();
    } catch (error) {
        console.error("GET request failed:", error);
        throw error;
    }
}

export async function post<T = unknown>(
    url: string,
    data: any,
    signal?: AbortSignal
): Promise<T> {
    try {
        const response = await fetch(
            url.startsWith("http") ? url : API_BASE_URL + url,
            {
                method: "POST",
                signal,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            throw {
                message: `HTTP error! status: ${response.status}`,
                status: response.status,
            } as ApiError;
        }

        return await response.json();
    } catch (error) {
        console.error("POST request failed:", error);
        throw error;
    }
}

export async function deleteRequest<T = unknown>(
    url: string,
    data?: any,
    signal?: AbortSignal
): Promise<T> {
    try {
        const response = await fetch(
            url.startsWith("http") ? url : API_BASE_URL + url,
            {
                method: "DELETE",
                signal,
                headers: { "Content-Type": "application/json" },
                body: data ? JSON.stringify(data) : undefined,
            }
        );

        if (!response.ok) {
            throw {
                message: `HTTP error! status: ${response.status}`,
                status: response.status,
            } as ApiError;
        }

        return await response.json();
    } catch (error) {
        console.error("DELETE request failed:", error);
        throw error;
    }
}

export function createApiClient() {
    const controller = new AbortController();

    return {
        get: <T>(url: string) => get<T>(url, controller.signal),
        post: <T>(url: string, data: any) => post<T>(url, data, controller.signal),
        delete: <T>(url: string, data?: any) => deleteRequest<T>(url, data, controller.signal),
        abort: () => controller.abort(),
    };
}

export type ApiClient = ReturnType<typeof createApiClient>;
