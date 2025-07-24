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

// Função para verificar se um agente pode usar tools baseado em suas características
function canAgentUseTools(agent: Agent | null): boolean {
  if (!agent) return false;
  
  // Agentes por categoria
  const toolEnabledCategories = ['content', 'writing', 'creative'];
  
  // Agentes por especialidade (palavras-chave)
  const toolEnabledSpecialities = [
    'content', 'conteúdo', 'criação', 'writing', 'escrita',
    'blog', 'artigo', 'copy', 'texto', 'documento', 'redação'
  ];
  
  // Agentes por nome (palavras-chave)
  const toolEnabledNames = [
    'content creator', 'copywriter', 'writer', 'redator', 
    'criador', 'blogger', 'jornalista', 'escritor'
  ];
  
  // Verificar categoria
  if (agent.category && toolEnabledCategories.includes(agent.category.toLowerCase())) {
    return true;
  }
  
  // Verificar especialidade
  if (agent.speciality) {
    const specialityLower = agent.speciality.toLowerCase();
    if (toolEnabledSpecialities.some(keyword => specialityLower.includes(keyword))) {
      return true;
    }
  }
  
  // Verificar nome
  if (agent.name) {
    const nameLower = agent.name.toLowerCase();
    if (toolEnabledNames.some(keyword => nameLower.includes(keyword))) {
      return true;
    }
  }
  
  return false;
}

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

    // Segurança: Impedir chat com agentes "coming soon"
    if (agent && agent.active === 'coming_soon') {
      return NextResponse.json(
        { error: 'This agent is not yet available' },
        { status: 403 }
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

    // Verificar se o agente pode usar tools (lógica melhorada)
    const canUseTools = canAgentUseTools(agent);
    const tools = canUseTools ? [createDocumentTool] : undefined;

    // Log inicial para debug
    console.log('=== TOOLS DEBUG ===', {
      agentName: agent?.name,
      agentCategory: agent?.category,
      agentSpeciality: agent?.speciality,
      canUseTools,
      lastUserMessage: lastUserMessage.substring(0, 100) + '...'
    });

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
    
    // Log da resposta da API
    console.log('=== API RESPONSE ===', {
      hasChoices: !!data.choices,
      hasToolCalls: !!data.choices?.[0]?.message?.tool_calls,
      toolCallsCount: data.choices?.[0]?.message?.tool_calls?.length || 0,
      messageLength: data.choices?.[0]?.message?.content?.length || 0
    });
    
    // Verificar se a IA chamou alguma tool
    const toolCalls = data.choices?.[0]?.message?.tool_calls;
    let usedTools = false;
    
    if (toolCalls && toolCalls.length > 0) {
      usedTools = true;
      console.log('=== TOOL CALLED ===', {
        toolName: toolCalls[0].function.name,
        arguments: toolCalls[0].function.arguments
      });
      
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
        
        // Log para debug
        console.log('=== TOOL SUCCESS ===', {
          title: args.title,
          contentLength: fullContent.length,
          agent: agent?.name
        });
        
        // Retornar com artefato via tool - SISTEMA NOVO
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
    
    // **IMPORTANTE**: Se usou tools, NÃO executar sistema antigo
    if (usedTools) {
      const fullContent = data.choices?.[0]?.message?.content || '';
      console.log('=== TOOLS USED BUT NO ARTIFACT ===', {
        contentLength: fullContent.length
      });
      return NextResponse.json({
        content: fullContent,
        artifact: null,
        toolUsed: true
      });
    }
    
    // Sistema antigo - APENAS se não usou tools
    console.log('=== FALLBACK TO OLD SYSTEM ===');
    const fullContent = data.choices?.[0]?.message?.content || '';

    // Para agentes habilitados para tools, não usar sistema antigo
    if (canUseTools) {
      console.log('=== TOOL-ENABLED AGENT, NO OLD SYSTEM ===');
      return NextResponse.json({
        content: fullContent,
        artifact: null,
        toolUsed: false
      });
    }

    // Sistema antigo APENAS para agentes não habilitados
    const userWantsArtifact = userRequestsArtifact(lastUserMessage);
    let artifact = null;
    let finalContent = fullContent;
    
    if (userWantsArtifact) {
      const { messageContent, artifactContent } = analyzeResponseForArtifact(
        fullContent,
        lastUserMessage,
        agent
      );

      if (artifactContent) {
        artifact = {
          id: Date.now().toString(),
          type: 'text',
          title: extractTitleFromContent(artifactContent),
          content: artifactContent
        };
        finalContent = messageContent;
        
        console.log('=== OLD SYSTEM ARTIFACT ===', {
          title: artifact.title,
          contentLength: artifactContent.length
        });
      }
    }

    // Resposta final
    return NextResponse.json({
      content: finalContent,
      artifact,
      toolUsed: false
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
