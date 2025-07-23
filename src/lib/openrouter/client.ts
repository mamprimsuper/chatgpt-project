import { Agent } from '@/types';

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: any[];
  tool_call_id?: string;
}

export interface OpenRouterRequestBody {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  tools?: any[];
  tool_choice?: 'auto' | 'none' | 'required' | any;
}

export interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
      tool_calls?: any[];
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class OpenRouterClient {
  private apiKey: string;
  private baseUrl: string;
  private defaultModel: string;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    this.baseUrl = 'https://openrouter.ai/api/v1';
    this.defaultModel = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

    if (!this.apiKey) {
      console.warn('OPENROUTER_API_KEY not found in environment variables');
    }
  }

  async sendMessage(
    messages: OpenRouterMessage[], 
    agent?: Agent | null,
    stream: boolean = false,
    additionalOptions?: {
      tools?: any[];
      tool_choice?: 'auto' | 'none' | 'required' | any;
    }
  ): Promise<Response> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    // Se um agente foi fornecido e não há system message, adicionar
    if (agent && agent.systemPrompt && !messages.some(m => m.role === 'system')) {
      messages = [
        {
          role: 'system',
          content: agent.systemPrompt
        },
        ...messages
      ];
    }

    const requestBody: OpenRouterRequestBody = {
      model: this.defaultModel,
      messages,
      temperature: 0.7,
      max_tokens: 4096,
      stream,
      ...additionalOptions
    };

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
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
      console.error('OpenRouter API error:', error);
      throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
    }

    return response;
  }

  // Método helper para testar a conexão
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.sendMessage([
        { role: 'user', content: 'Hello' }
      ]);
      const data = await response.json();
      return !!data.choices?.[0]?.message?.content;
    } catch (error) {
      console.error('OpenRouter connection test failed:', error);
      return false;
    }
  }
}

// Exportar instância única
export const openRouterClient = new OpenRouterClient();
