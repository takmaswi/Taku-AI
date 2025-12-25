/**
 * API Error Handling Utilities
 */

export type ApiErrorCode =
    | 'NETWORK_ERROR'
    | 'TIMEOUT'
    | 'OLLAMA_NOT_RUNNING'
    | 'INVALID_RESPONSE'
    | 'UNKNOWN_ERROR';

export interface UserFriendlyError {
    code: ApiErrorCode;
    message: string;
    suggestion: string;
}

export function handleApiError(error: unknown): UserFriendlyError {
    console.error('API Error:', error);

    if (error instanceof TypeError) {
        if (error.message.includes('Failed to fetch')) {
            return {
                code: 'NETWORK_ERROR',
                message: 'Failed to connect to Ollama',
                suggestion: 'Make sure Ollama is running on localhost:11434. Run: ollama serve',
            };
        }
        if (error.message.includes('NetworkError')) {
            return {
                code: 'NETWORK_ERROR',
                message: 'Network connection lost',
                suggestion: 'Check your internet connection and try again',
            };
        }
    }

    if (error instanceof Error && error.name === 'AbortError') {
        return {
            code: 'TIMEOUT',
            message: 'Request took too long (30 seconds)',
            suggestion: 'Ollama might be overloaded. Try a simpler question.',
        };
    }

    if (error instanceof Error) {
        return {
            code: 'UNKNOWN_ERROR',
            message: error.message,
            suggestion: 'Check browser console and Ollama logs for details',
        };
    }

    return {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
        suggestion: 'Try refreshing the page and ensure Ollama is running',
    };
}

export async function fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeoutMs = 30000
): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}
