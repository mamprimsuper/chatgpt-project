import { Agent } from '@/types';

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
}

export class OpenRouterClient {
  private apiKey: string;
  private apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private model: string;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    this.model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
    
    if (!this.apiKey) {
      console.warn('OpenRouter API key not found in environment variables');
    }
  }

  async sendMessage(
    messages: OpenRouterMessage[],
    agent: Agent | null,
    stream: boolean = false
  ): Promise<Response> {
    // Adicionar system prompt do agente se disponível
    const systemMessages: OpenRouterMessage[] = [];
    
    if (agent?.systemPrompt) {
      systemMessages.push({
        role: 'system',
        content: agent.systemPrompt
      });
    } else if (agent) {
      // System prompt padrão baseado no agente
      systemMessages.push({
        role: 'system',
        content: `Você é ${agent.name}, um especialista em ${agent.speciality}. ${agent.description}. Responda em português brasileiro de forma natural e profissional.`
      });
    }

    const allMessages = [...systemMessages, ...messages];

    const requestBody: OpenRouterRequest = {
      model: this.model,
      messages: allMessages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: stream
    };

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'ChatGPT Project'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${error}`);
    }

    return response;
  }

  // Método helper para processar streaming
  async *processStream(response: Response) {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No response body');
    }

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              return;
            }
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                yield content;
              }
            } catch (e) {
              // Ignorar erros de parsing
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}

export const openRouterClient = new OpenRouterClient();