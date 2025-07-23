import { NextRequest, NextResponse } from 'next/server';
import { openRouterClient, type OpenRouterMessage } from '@/lib/openrouter/client';
import { 
  shouldCreateArtifact, 
  getArtifactSystemPrompt,
  extractTitleFromContent,
  analyzeResponseForArtifact,
  userRequestsArtifact
} from '@/lib/openrouter/utils';
import { Agent } from '@/types';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, agent, stream = false } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Pegar a última mensagem do usuário
    const lastUserMessage = messages
      .filter((msg: any) => msg.role === 'user')
      .pop()?.content || '';

    // Converter mensagens para formato OpenRouter
    const openRouterMessages: OpenRouterMessage[] = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }));

    // Verificar se o usuário está pedindo um documento
    const userWantsArtifact = userRequestsArtifact(lastUserMessage);

    // Adicionar system prompt especial para agentes que podem criar artefatos
    let systemPromptAdded = false;
    if (agent && userWantsArtifact) {
      const systemPrompt = getArtifactSystemPrompt(agent);
      // Verificar se já não existe um system prompt
      if (!openRouterMessages.some(msg => msg.role === 'system')) {
        openRouterMessages.unshift({
          role: 'system',
          content: systemPrompt
        });
        systemPromptAdded = true;
      }
    }

    // Se for streaming (implementação futura)
    if (stream) {
      const response = await openRouterClient.sendMessage(
        openRouterMessages,
        systemPromptAdded ? null : agent,
        true
      );

      // Criar um TransformStream para processar o streaming
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      
      const transformStream = new TransformStream({
        async transform(chunk, controller) {
          const text = decoder.decode(chunk);
          const lines = text.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              controller.enqueue(encoder.encode(line + '\n\n'));
            }
          }
        }
      });

      return new Response(
        response.body!.pipeThrough(transformStream),
        {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        }
      );
    }

    // Requisição normal (não streaming)
    const response = await openRouterClient.sendMessage(
      openRouterMessages,
      systemPromptAdded ? null : agent,
      false
    );

    const data = await response.json();
    const fullContent = data.choices?.[0]?.message?.content || '';

    // Analisar a resposta para decidir sobre artefato
    const { messageContent, artifactContent } = analyzeResponseForArtifact(
      fullContent,
      lastUserMessage,
      agent
    );

    // Se houver conteúdo para artefato, criar
    let artifact = null;
    if (artifactContent) {
      artifact = {
        id: Date.now().toString(),
        type: 'text',
        title: extractTitleFromContent(artifactContent),
        content: artifactContent
      };
    }

    // Log para debug
    console.log('Artifact Decision:', {
      userMessage: lastUserMessage.substring(0, 100),
      userWantsArtifact,
      hasArtifact: !!artifact,
      contentLength: fullContent.length,
      artifactLength: artifactContent?.length || 0
    });

    // Resposta com ou sem artefato
    return NextResponse.json({
      content: messageContent,
      artifact
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Se for erro de API key
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { 
          error: 'OpenRouter API key not configured',
          details: 'Please check your OPENROUTER_API_KEY in .env.local'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to process message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}