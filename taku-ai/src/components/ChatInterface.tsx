import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChatMessagesList } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { DocumentUpload } from './DocumentUpload';
import { Message, Document } from '@/lib/types';
import { queryOllama, checkOllamaStatus } from '@/lib/ollama';
import { AlertCircle, Wifi } from 'lucide-react';

export const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ollamaReady, setOllamaReady] = useState(false);

    useEffect(() => {
        checkOllamaStatus().then(setOllamaReady).catch(() => setOllamaReady(false));
    }, []);

    const handleSendMessage = async (content: string) => {
        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: 'user',
            content,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        try {
            const response = await queryOllama(content);
            const assistantMessage: Message = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content: response,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (file: File) => {
        const newDocument: Document = {
            id: `doc-${Date.now()}`,
            name: file.name,
            type: file.name.split('.').pop() as 'pdf' | 'txt' | 'docx',
            uploadedAt: new Date(),
            size: file.size,
        };
        setDocuments((prev) => [...prev, newDocument]);
    };

    return (
        <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <div className="w-80 border-r border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        TAKU AI
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Your Offline AI Tutor
                    </p>
                </div>

                <div className="space-y-4">
                    <DocumentUpload
                        documents={documents}
                        onFileSelect={handleFileSelect}
                        isLoading={isLoading}
                    />

                    {!ollamaReady && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Ollama is not connected. Check that it's running on localhost:11434
                            </AlertDescription>
                        </Alert>
                    )}

                    {ollamaReady && (
                        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-2 text-sm text-green-700 dark:bg-green-900 dark:text-green-200">
                            <Wifi className="h-4 w-4" />
                            Mistral Ready
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex flex-1 flex-col">
                <div className="flex-1 overflow-hidden p-4">
                    <ChatMessagesList messages={messages} isLoading={isLoading} />
                </div>

                {error && (
                    <Alert variant="destructive" className="m-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="border-t border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <ChatInput
                        onSendMessage={handleSendMessage}
                        disabled={isLoading || !ollamaReady}
                    />
                </div>
            </div>
        </div>
    );
};
