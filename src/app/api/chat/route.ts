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
import { createDocumentTool, executeCreateDocument } from '@/lib/ai/tools/create-document';
import { getAgentSystemPrompt } from '@/lib/ai/prompts';
import type { ToolCall } from '@/lib/ai/types';

export const runtime = 'edge';

// Agentes que podem usar tools
const TOOL_ENABLED_AGENTS = ['content-creator', 'copywriter', 'ux-writer', 'scriptwriter'];

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

    // Verificar se o agente pode usar tools
    const canUseTools = agent && TOOL_ENABLED_AGENTS.includes(agent.id);
    const tools = canUseTools ? [createDocumentTool] : undefined;

    // Adicionar system prompt
    const systemPrompt = agent ? getAgentSystemPrompt(agent, canUseTools) : undefined;
    if (systemPrompt && !openRouterMessages.some(msg => msg.role === 'system')) {
      openRouterMessages.unshift({
        role: 'system',
        content: systemPrompt
      });
    }

    // Fazer a chamada para OpenRouter com tools
    const response = await openRouterClient.sendMessage(
      openRouterMessages,
      null, // agent já está no system prompt
      false,
      {
        tools,
        tool_choice: canUseTools ? 'auto' : undefined
      }
    );

    const data = await response.json();
    
    // Verificar se a IA chamou alguma tool
    const toolCalls = data.choices?.[0]?.message?.tool_calls;
    
    if (toolCalls && toolCalls.length > 0) {
      // Processar tool calls
      const toolCall = toolCalls[0] as ToolCall;
      
      if (toolCall.function.name === 'createDocument') {
        const args = JSON.parse(toolCall.function.arguments);
        const toolResult = await executeCreateDocument(args);
        
        // Agora precisamos fazer uma segunda chamada para gerar o conteúdo
        const messagesWithTool = [
          ...openRouterMessages,
          {
            role: 'assistant' as const,
            content: null,
            tool_calls: toolCalls
          },
          {
            role: 'tool' as const,
            content: JSON.stringify(toolResult),
            tool_call_id: toolCall.id
          }
        ];
        
        // Segunda chamada para gerar o conteúdo do documento
        const contentResponse = await openRouterClient.sendMessage(
          messagesWithTool,
          null,
          false,
          {
            tools,
            tool_choice: 'none' // Não permitir mais tool calls
          }
        );
        
        const contentData = await contentResponse.json();
        const fullContent = contentData.choices?.[0]?.message?.content || '';
        
        // Retornar com artefato
        return NextResponse.json({
          content: `Criei o documento "${args.title}" para você. O conteúdo está disponível para visualização e edição.`,
          artifact: {
            id: toolResult.id,
            type: 'text',
            title: args.title,
            content: fullContent
          },
          toolUsed: true
        });
      }
    }
    
    // Se não usou tools, continuar com o fluxo antigo
    const fullContent = data.choices?.[0]?.message?.content || '';

    // Verificar se o usuário está pedindo um documento (compatibilidade com sistema antigo)
    const userWantsArtifact = userRequestsArtifact(lastUserMessage);

    // Analisar a resposta para decidir sobre artefato
    const { messageContent, artifactContent } = analyzeResponseForArtifact(
      fullContent,
      lastUserMessage,
      agent
    );

    // Se houver conteúdo para artefato, criar
    let artifact = null;
    if (artifactContent && userWantsArtifact) {
      artifact = {
        id: Date.now().toString(),
        type: 'text',
        title: extractTitleFromContent(artifactContent),
        content: artifactContent
      };
    }

    // Log para debug
    console.log('Response Decision:', {
      userMessage: lastUserMessage.substring(0, 100),
      canUseTools,
      toolsUsed: !!toolCalls,
      hasArtifact: !!artifact,
      contentLength: fullContent.length
    });

    // Resposta com ou sem artefato
    return NextResponse.json({
      content: artifact ? messageContent : fullContent,
      artifact,
      toolUsed: false
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
