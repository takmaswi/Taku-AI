/**
 * Core type definitions for TAKU AI
 */

export type Message = {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    isStreaming?: boolean;
    sources?: DocumentSource[];
};

export type DocumentSource = {
    title: string;
    path: string;
    relevanceScore: number;
    snippet?: string;
};

export type Document = {
    id: string;
    name: string;
    type: 'pdf' | 'txt' | 'docx';
    uploadedAt: Date;
    size: number;
};

export type OllamaResponse = {
    model: string;
    created_at: string;
    response: string;  // ✅ CORRECT PROPERTY - Ollama's actual API shape
    done: boolean;
    context?: number[];
    total_duration?: number;
    load_duration?: number;
    prompt_eval_count?: number;
    prompt_eval_duration?: number;
    eval_count?: number;
    eval_duration?: number;
};

export type ChatRequest = {
    model: string;
    prompt: string;
    stream?: boolean;
    context?: number[];
};

export type ApiError = {
    code: string;
    message: string;
    details?: unknown;
};

export type ChatState = {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    uploadedDocuments: Document[];
};
