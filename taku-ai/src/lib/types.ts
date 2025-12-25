export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isLoading?: boolean;
}

export interface ChatState {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    uploadedDocuments: Document[];
}

export interface Document {
    id: string;
    name: string;
    type: 'pdf' | 'txt' | 'docx';
    uploadedAt: Date;
    size: number;
}

export interface OllamaResponse {
    model: string;
    created_at: string;
    message: {
        role: string;
        content: string;
    };
    done: boolean;
}
