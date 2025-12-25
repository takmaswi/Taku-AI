import React from 'react';
import { Message } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatMessageProps {
    message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.role === 'user';

    // Handle both Date objects and string timestamps from localStorage
    const formatTimestamp = (timestamp: Date | string): string => {
        const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div
            className={`flex w-full gap-3 px-4 py-3 ${isUser ? 'justify-end' : 'justify-start'
                }`}
        >
            <div
                className={`max-w-[70%] rounded-lg p-3 ${isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                    }`}
            >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <span className="mt-1 block text-xs opacity-70">
                    {formatTimestamp(message.timestamp)}
                </span>
            </div>
        </div>
    );
};

interface ChatMessagesListProps {
    messages: Message[];
    isLoading: boolean;
}

export const ChatMessagesList: React.FC<ChatMessagesListProps> = ({
    messages,
    isLoading,
}) => {
    return (
        <ScrollArea className="h-[calc(100vh-200px)] w-full rounded-lg border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
            <div className="flex flex-col space-y-1 p-4">
                {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center p-8">
                        <p className="text-gray-500 dark:text-gray-400">
                            No messages yet. Start by uploading documents or asking a question.
                        </p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                    ))
                )}
                {isLoading && (
                    <div className="flex gap-3 px-4 py-3">
                        <div className="flex items-center gap-2 rounded-lg bg-gray-200 p-3 dark:bg-gray-700">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-gray-600 dark:bg-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Thinking...
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>
    );
};
