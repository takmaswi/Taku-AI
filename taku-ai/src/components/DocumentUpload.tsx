import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Document } from '@/lib/types';
import { Upload } from 'lucide-react';

interface DocumentUploadProps {
    documents: Document[];
    onFileSelect: (file: File) => void;
    isLoading?: boolean;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
    documents,
    onFileSelect,
    isLoading = false,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Study Materials
                </h3>
                {documents.length > 0 && (
                    <Badge variant="secondary">{documents.length} uploaded</Badge>
                )}
            </div>

            <Button
                onClick={handleClick}
                disabled={isLoading}
                className="w-full gap-2"
                variant="outline"
            >
                <Upload className="h-4 w-4" />
                Upload PDF, TXT, or DOCX
            </Button>

            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.docx"
                onChange={handleFileChange}
                className="hidden"
                disabled={isLoading}
            />

            {documents.length > 0 && (
                <div className="space-y-2">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="flex items-center justify-between rounded-lg bg-gray-100 p-2 text-sm dark:bg-gray-700"
                        >
                            <span className="text-gray-900 dark:text-gray-100">{doc.name}</span>
                            <Badge variant="outline" className="text-xs">
                                {(doc.size / 1024).toFixed(1)}KB
                            </Badge>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
