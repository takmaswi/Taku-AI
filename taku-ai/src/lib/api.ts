import { invoke } from "@tauri-apps/api/core";

// ================================
// Type Definitions
// ================================

export interface ChatMessage {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: Date;
    isStreaming?: boolean;
    sources?: DocumentSource[];
}

export interface DocumentSource {
    title: string;
    path: string;
    relevanceScore: number;
    snippet?: string;
}

export interface OllamaResponse {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
    context?: number[];
    total_duration?: number;
    load_duration?: number;
    prompt_eval_count?: number;
    prompt_eval_duration?: number;
    eval_count?: number;
    eval_duration?: number;
}

export interface OllamaStreamChunk {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
}

export interface ChatRequest {
    model: string;
    prompt: string;
    stream?: boolean;
    context?: number[];
}

export interface ApiError {
    code: string;
    message: string;
    details?: unknown;
}

// ================================
// Configuration
// ================================

const OLLAMA_BASE_URL = "http://localhost:11434";
const DEFAULT_MODEL = "mistral";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// ================================
// Utility Functions
// ================================

/**
 * Generate a unique ID for messages
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Delay execution for specified milliseconds
 */
function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// ================================
// Tauri IPC Commands
// ================================

/**
 * Invoke a Tauri command with error handling
 */
export async function invokeCommand<T>(
    command: string,
    args?: Record<string, unknown>
): Promise<T> {
    try {
        return await invoke<T>(command, args);
    } catch (error) {
        console.error(`Tauri command '${command}' failed:`, error);
        throw {
            code: "TAURI_IPC_ERROR",
            message: `Failed to execute command: ${command}`,
            details: error,
        } as ApiError;
    }
}

/**
 * Check if Ollama service is available via Tauri
 */
export async function checkOllamaHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Get list of available models from Ollama
 */
export async function getAvailableModels(): Promise<string[]> {
    try {
        const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        return data.models?.map((m: { name: string }) => m.name) || [];
    } catch (error) {
        console.error("Failed to fetch models:", error);
        return [];
    }
}

// ================================
// Chat API Functions
// ================================

/**
 * Send a chat message to Ollama and get a response
 * Includes retry logic for reliability
 */
export async function sendChatMessage(
    prompt: string,
    model: string = DEFAULT_MODEL,
    context?: number[]
): Promise<OllamaResponse> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model,
                    prompt,
                    stream: false,
                    context,
                } as ChatRequest),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            lastError = error as Error;
            console.warn(`Attempt ${attempt + 1} failed:`, error);

            if (attempt < MAX_RETRIES - 1) {
                await delay(RETRY_DELAY_MS * (attempt + 1));
            }
        }
    }

    throw {
        code: "OLLAMA_API_ERROR",
        message: "Failed to send chat message after retries",
        details: lastError,
    } as ApiError;
}

/**
 * Send a streaming chat message to Ollama
 * Returns an async generator for real-time response streaming
 */
export async function* streamChatMessage(
    prompt: string,
    model: string = DEFAULT_MODEL,
    context?: number[]
): AsyncGenerator<OllamaStreamChunk> {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model,
            prompt,
            stream: true,
            context,
        } as ChatRequest),
    });

    if (!response.ok) {
        throw {
            code: "OLLAMA_STREAM_ERROR",
            message: `Stream failed: HTTP ${response.status}`,
        } as ApiError;
    }

    if (!response.body) {
        throw {
            code: "OLLAMA_STREAM_ERROR",
            message: "Response body is null",
        } as ApiError;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n").filter((line) => line.trim());

            for (const line of lines) {
                try {
                    const parsed = JSON.parse(line) as OllamaStreamChunk;
                    yield parsed;

                    if (parsed.done) return;
                } catch {
                    // Skip invalid JSON lines
                }
            }
        }
    } finally {
        reader.releaseLock();
    }
}

// ================================
// Helper Functions for Chat Interface
// ================================

/**
 * Create a new user message
 */
export function createUserMessage(content: string): ChatMessage {
    return {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date(),
    };
}

/**
 * Create a new assistant message
 */
export function createAssistantMessage(
    content: string,
    isStreaming: boolean = false,
    sources?: DocumentSource[]
): ChatMessage {
    return {
        id: generateId(),
        role: "assistant",
        content,
        timestamp: new Date(),
        isStreaming,
        sources,
    };
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(date: Date): string {
    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}
