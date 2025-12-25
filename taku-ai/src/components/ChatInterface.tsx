import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChatMessagesList } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { DocumentUpload } from './DocumentUpload';
import { Message, Document } from '@/lib/types';
import {
    sendChatMessage,
    checkOllamaHealth,
    createUserMessage,
    createAssistantMessage
} from '@/lib/api';
import { handleApiError } from '@/lib/api-helpers';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AlertCircle, Wifi, Trash2, Plus } from 'lucide-react';

export const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useLocalStorage<Message[]>('taku_messages', []);
    const [documents, setDocuments] = useLocalStorage<Document[]>('taku_documents', []);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ollamaReady, setOllamaReady] = useState(false);

    useEffect(() => {
        checkOllamaHealth()
            .then((isHealthy) => {
                setOllamaReady(isHealthy);
                if (!isHealthy) {
                    setError('⚠️ Ollama is not running. Start it with: ollama serve');
                }
            })
            .catch((err) => {
                console.error('Failed to check Ollama health:', err);
                setOllamaReady(false);
                setError('Could not connect to Ollama. Is it running on localhost:11434?');
            });
    }, []);

    const handleSendMessage = async (content: string) => {
        if (!content.trim()) {
            setError('Please enter a message');
            return;
        }

        const userMessage = createUserMessage(content);
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        try {
            const response = await sendChatMessage(content);

            const assistantMessage = createAssistantMessage(
                response.response,
                false,
                []
            );
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
            const friendlyError = handleApiError(err);
            setError(`❌ ${friendlyError.message}\n\n💡 Suggestion: ${friendlyError.suggestion}`);
            console.error('Failed to get response:', err);
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

    const handleClearHistory = () => {
        if (messages.length === 0) {
            setError('No messages to clear');
            return;
        }
        if (confirm('Clear all messages? This cannot be undone.')) {
            setMessages([]);
            setDocuments([]);
            setError(null);
        }
    };

    const handleNewChat = () => {
        if (messages.length === 0) {
            setError('Already in a new chat');
            return;
        }
        if (confirm('Start a new conversation? Current messages will be saved in history.')) {
            setMessages([]);
            setError(null);
        }
    };

    return (
        <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <div className="w-80 border-r border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 overflow-y-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        TAKU AI
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Your Offline AI Tutor
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Action buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleNewChat}
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white font-medium hover:bg-blue-600 disabled:opacity-50"
                        >
                            <Plus className="h-4 w-4" />
                            New Chat
                        </button>
                        <button
                            onClick={handleClearHistory}
                            disabled={isLoading || messages.length === 0}
                            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-red-700 font-medium hover:bg-red-200 disabled:opacity-50"
                        >
                            <Trash2 className="h-4 w-4" />
                            Clear
                        </button>
                    </div>

                    {/* Document upload */}
                    <DocumentUpload
                        documents={documents}
                        onFileSelect={handleFileSelect}
                        isLoading={isLoading}
                    />

                    {!ollamaReady && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Ollama not connected. Run: <code className="text-xs bg-red-900/20 px-1 rounded">ollama serve</code>
                            </AlertDescription>
                        </Alert>
                    )}

                    {ollamaReady && (
                        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-2 text-sm text-green-700 dark:bg-green-900 dark:text-green-200">
                            <Wifi className="h-4 w-4" />
                            Mistral Ready
                        </div>
                    )}

                    {/* Message count */}
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {messages.length} message{messages.length !== 1 ? 's' : ''}
                    </div>
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
                        <AlertDescription className="whitespace-pre-wrap">
                            {error}
                        </AlertDescription>
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
