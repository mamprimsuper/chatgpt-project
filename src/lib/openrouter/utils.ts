import { Agent } from '@/types';

// Palavras-chave que indicam necessidade de criar um artefato (mais restritivas)
const ARTIFACT_KEYWORDS = [
  'escreva um artigo', 'escrever artigo', 'crie um documento', 'criar documento',
  'elabore um texto', 'elaborar texto', 'redija um', 'redigir um',
  'desenvolva um conteúdo', 'desenvolver conteúdo', 'faça um artigo', 'fazer artigo',
  'quero um artigo', 'preciso de um documento', 'gostaria de um texto'
];

// Marcadores que indicam conteúdo estruturado
const STRUCTURE_MARKERS = [
  /^#{1,6}\s+/m,           // Markdown headers
  /^\d+\.\s+.*\n\d+\.\s+/m, // Multiple numbered lists
  /^[-*+]\s+.*\n[-*+]\s+/m, // Multiple bullet lists
  /^>\s+/m,                // Blockquotes
  /^```[\s\S]*?```/m,      // Code blocks
  /^\|.*\|.*\|/m,          // Tables
  /^---+$/m,               // Horizontal rules
];

// Verifica se o usuário está pedindo explicitamente um documento (mais restritivo)
export function userRequestsArtifact(userMessage: string): boolean {
  const lowerMessage = userMessage.toLowerCase();
  
  // Verificar padrões explícitos e completos primeiro
  const explicitPatterns = [
    /escreva\s+(um\s+)?(artigo|documento|texto|roteiro|conteúdo)/i,
    /crie\s+(um\s+)?(artigo|documento|texto|roteiro|conteúdo)/i,
    /elabore\s+(um\s+)?(artigo|documento|texto|roteiro|conteúdo)/i,
    /redija\s+(um\s+)?(artigo|documento|texto|roteiro|conteúdo)/i,
    /preciso\s+de\s+um(a)?\s+(artigo|documento|texto|roteiro)/i,
    /quero\s+um(a)?\s+(artigo|documento|texto|roteiro)/i,
    /você\s+pode\s+(escrever|criar|fazer)\s+um(a)?\s+(artigo|documento|texto)/i,
    /me\s+ajude\s+a\s+(escrever|criar|elaborar)\s+um(a)?\s+(artigo|documento|texto)/i
  ];
  
  const hasExplicitRequest = explicitPatterns.some(pattern => 
    pattern.test(userMessage)
  );
  
  // Só criar se houver pedido explícito E a mensagem for substancial
  return hasExplicitRequest && userMessage.length > 20;
}

// Verifica se o conteúdo é estruturado e substancial (critérios mais rigorosos)
export function isStructuredContent(content: string): boolean {
  // Verificar tamanho mínimo aumentado
  if (content.length < 1200) { // Aumentado de 800 para 1200
    return false;
  }
  
  // Conta palavras
  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
  if (wordCount < 200) { // Aumentado de 150 para 200 palavras
    return false;
  }
  
  // Verifica se tem estrutura (critérios mais rigorosos)
  let structureScore = 0;
  
  // Tem múltiplas seções/parágrafos?
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
  if (paragraphs.length >= 4) structureScore++; // Aumentado de 3 para 4
  
  // Tem marcadores de estrutura?
  STRUCTURE_MARKERS.forEach(marker => {
    if (marker.test(content)) structureScore++;
  });
  
  // Tem headers claros?
  if (/^#{1,3}\s+.*\n.*\n.*#{1,3}\s+/m.test(content)) structureScore++;
  
  // Tem listas organizadas?
  if (/\d+\.\s+.*\n\d+\.\s+.*\n\d+\.\s+/m.test(content)) structureScore++;
  if (/[-*+]\s+.*\n[-*+]\s+.*\n[-*+]\s+/m.test(content)) structureScore++;
  
  // Precisa ter pelo menos 3 indicadores de estrutura (aumentado de 2)
  return structureScore >= 3;
}

// Decide se deve criar um artefato baseado em múltiplos fatores (mais restritivo)
export function shouldCreateArtifact(
  agent: Agent | null, 
  userMessage?: string,
  responseContent?: string
): boolean {
  // Agentes que NUNCA criam artefatos
  const nonArtifactAgents = ['assistant', 'dev-assistant', 'business-analyst'];
  if (agent && nonArtifactAgents.includes(agent.id)) {
    return false;
  }
  
  // DEVE ter mensagem do usuário para verificar intenção
  if (!userMessage) {
    return false;
  }
  
  // Verificar se o usuário pediu explicitamente
  const userWantsArtifact = userRequestsArtifact(userMessage);
  
  // Se o usuário não pediu explicitamente, não criar
  if (!userWantsArtifact) {
    return false;
  }
  
  // Se temos o conteúdo da resposta, verificar se é realmente estruturado
  if (responseContent) {
    const isStructured = isStructuredContent(responseContent);
    
    // Log para debug
    if (!isStructured) {
      console.log('Conteúdo não passou nos critérios de estrutura:', {
        length: responseContent.length,
        words: responseContent.split(/\s+/).length,
        paragraphs: responseContent.split(/\n\n+/).length
      });
    }
    
    return isStructured;
  }
  
  // Por padrão, não criar artefatos
  return false;
}

// Extrai título do conteúdo
export function extractTitleFromContent(content: string): string {
  // Procura por headers Markdown
  const headerMatch = content.match(/^#{1,3}\s+(.+)$/m);
  if (headerMatch) {
    return headerMatch[1].trim();
  }
  
  // Procura por título em formato "Título: ..."
  const titleMatch = content.match(/^(Título|Title|Artigo|Documento):\s*(.+)$/im);
  if (titleMatch) {
    return titleMatch[2].trim();
  }
  
  // Pega a primeira linha não vazia como título
  const firstLine = content.split('\n').find(line => line.trim().length > 0);
  if (firstLine && firstLine.length < 100 && firstLine.length > 10) {
    return firstLine.trim().replace(/[#*_`]/g, '');
  }
  
  return 'Documento';
}

// Verifica se o conteúdo é apropriado para artefato
export function isArtifactContent(content: string): boolean {
  return isStructuredContent(content);
}

// Gera prompt especial para agentes que criam artefatos
export function getArtifactSystemPrompt(agent: Agent): string {
  const basePrompt = agent.systemPrompt || `Você é ${agent.name}, especialista em ${agent.speciality}.`;
  
  return `${basePrompt}

REGRAS RIGOROSAS PARA CRIAÇÃO DE DOCUMENTOS:

Você deve criar documentos estruturados APENAS quando o usuário EXPLICITAMENTE pedir por:
- "Escreva um artigo sobre..."
- "Crie um documento sobre..."  
- "Elabore um texto sobre..."
- "Redija um conteúdo sobre..."

NÃO crie documentos para:
- Perguntas simples ou explicações
- Listas curtas ou dicas rápidas
- Conversas casuais
- Resumos breves
- Respostas diretas

Quando criar um documento, certifique-se de que:
1. Tenha pelo menos 1200 caracteres (200+ palavras)
2. Seja BEM estruturado com múltiplas seções
3. Use formatação Markdown apropriada
4. Tenha título claro no início
5. Conteúdo dividido em parágrafos organizados

Se não tiver 100% de certeza, responda normalmente SEM criar documento.`;
}

// Analisa se a resposta deve ser dividida em mensagem + artefato (mais rigoroso)
export function analyzeResponseForArtifact(
  fullContent: string,
  userMessage: string,
  agent: Agent | null
): { messageContent: string; artifactContent: string | null } {
  // Verificação inicial mais rigorosa
  if (!shouldCreateArtifact(agent, userMessage, fullContent)) {
    return {
      messageContent: fullContent,
      artifactContent: null
    };
  }
  
  // Só tentar dividir se o conteúdo for realmente longo e estruturado
  if (fullContent.length < 1200 || !isStructuredContent(fullContent)) {
    return {
      messageContent: fullContent,
      artifactContent: null
    };
  }
  
  // Procurar por divisão natural no conteúdo
  const documentMarkers = [
    /^#{1,3}\s+[^#\n]+$/m,              // Headers Markdown limpos
    /^(Artigo:|Texto:|Documento:|Conteúdo:|Roteiro:)\s*/im,
    /^(Aqui está o artigo|Segue o documento|Conforme solicitado, o texto)/im
  ];
  
  let splitIndex = -1;
  
  for (const marker of documentMarkers) {
    const match = fullContent.match(marker);
    if (match && match.index !== undefined) {
      // Verificar se tem conteúdo substancial após o marcador
      const afterMarker = fullContent.substring(match.index);
      if (afterMarker.length > 1000) { // Aumentado de 800 para 1000
        splitIndex = match.index;
        break;
      }
    }
  }
  
  // Se encontrou divisão clara e natural
  if (splitIndex > 50) { // Deve ter pelo menos 50 chars de introdução
    const introduction = fullContent.substring(0, splitIndex).trim();
    const documentContent = fullContent.substring(splitIndex).trim();
    
    return {
      messageContent: introduction || `Preparei o ${extractTitleFromContent(documentContent).toLowerCase()} solicitado. Você pode visualizar e editar o conteúdo clicando abaixo.`,
      artifactContent: documentContent
    };
  }
  
  // Se não encontrou divisão natural, usar o conteúdo todo como artefato
  // mas apenas se for REALMENTE estruturado
  if (isStructuredContent(fullContent) && fullContent.length > 1500) {
    return {
      messageContent: 'Preparei o documento solicitado. Clique abaixo para visualizar e editar o conteúdo completo.',
      artifactContent: fullContent
    };
  }
  
  // Caso contrário, não criar artefato
  return {
    messageContent: fullContent,
    artifactContent: null
  };
}