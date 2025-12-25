import { OllamaResponse } from './types';

const OLLAMA_BASE_URL = 'http://localhost:11434';

export async function queryOllama(prompt: string): Promise<string> {
    try {
        const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'mistral',
                prompt: prompt,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const data = (await response.json()) as OllamaResponse;
        return data.message.content;
    } catch (error) {
        console.error('Ollama query failed:', error);
        throw error;
    }
}

export async function checkOllamaStatus(): Promise<boolean> {
    try {
        const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
        return response.ok;
    } catch {
        return false;
    }
}
