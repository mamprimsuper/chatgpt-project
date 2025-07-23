import { Agent } from '@/types';

// Palavras-chave que indicam necessidade de criar um artefato
const ARTIFACT_KEYWORDS = [
  'escreva', 'escrever', 'crie', 'criar', 'elabore', 'elaborar',
  'redija', 'redigir', 'desenvolva', 'desenvolver', 'faça', 'fazer',
  'artigo', 'documento', 'texto', 'roteiro', 'script', 'conteúdo',
  'relatório', 'resumo', 'guia', 'manual', 'tutorial', 'post',
  'blog', 'copy', 'carta', 'email', 'proposta', 'apresentação'
];

// Marcadores que indicam conteúdo estruturado
const STRUCTURE_MARKERS = [
  /^#{1,6}\s+/m,           // Markdown headers
  /^\d+\.\s+/m,            // Numbered lists
  /^[-*+]\s+/m,            // Bullet lists
  /^>\s+/m,                // Blockquotes
  /^```[\s\S]*?```/m,      // Code blocks
  /^\|.*\|.*\|/m,          // Tables
  /^---+$/m,               // Horizontal rules
];

// Verifica se o usuário está pedindo explicitamente um documento
export function userRequestsArtifact(userMessage: string): boolean {
  const lowerMessage = userMessage.toLowerCase();
  
  // Verifica se contém palavras-chave
  const hasKeyword = ARTIFACT_KEYWORDS.some(keyword => 
    lowerMessage.includes(keyword)
  );
  
  // Verifica padrões específicos de pedido
  const explicitPatterns = [
    /preciso de um(a)? (artigo|documento|texto|roteiro)/i,
    /me ajude a (escrever|criar|elaborar)/i,
    /você pode (escrever|criar|fazer) um(a)?/i,
    /quero um(a)? (artigo|documento|texto) sobre/i,
    /faça um(a)? (lista|resumo|guia) de/i
  ];
  
  const hasExplicitRequest = explicitPatterns.some(pattern => 
    pattern.test(userMessage)
  );
  
  return hasKeyword || hasExplicitRequest;
}

// Verifica se o conteúdo é estruturado e substancial
export function isStructuredContent(content: string): boolean {
  // Verifica tamanho mínimo (aumentado para 800 caracteres)
  if (content.length < 800) {
    return false;
  }
  
  // Conta palavras
  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
  if (wordCount < 150) { // Mínimo de 150 palavras
    return false;
  }
  
  // Verifica se tem estrutura
  let structureScore = 0;
  
  // Tem múltiplas seções/parágrafos?
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
  if (paragraphs.length >= 3) structureScore++;
  
  // Tem marcadores de estrutura?
  STRUCTURE_MARKERS.forEach(marker => {
    if (marker.test(content)) structureScore++;
  });
  
  // Tem listas?
  if (/\d+\.\s+.*\n\d+\.\s+/m.test(content)) structureScore++;
  if (/[-*+]\s+.*\n[-*+]\s+/m.test(content)) structureScore++;
  
  // Precisa ter pelo menos 2 indicadores de estrutura
  return structureScore >= 2;
}

// Decide se deve criar um artefato baseado em múltiplos fatores
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
  
  // Se temos a mensagem do usuário, verificar se ele pediu explicitamente
  if (userMessage) {
    const userWantsArtifact = userRequestsArtifact(userMessage);
    
    // Se o usuário não pediu explicitamente, não criar
    if (!userWantsArtifact) {
      return false;
    }
  }
  
  // Se temos o conteúdo da resposta, verificar se é estruturado
  if (responseContent) {
    return isStructuredContent(responseContent);
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
  if (firstLine && firstLine.length < 100) {
    return firstLine.trim().replace(/[#*_`]/g, '');
  }
  
  return 'Documento sem título';
}

// Verifica se o conteúdo é apropriado para artefato
export function isArtifactContent(content: string): boolean {
  return isStructuredContent(content);
}

// Gera prompt especial para agentes que criam artefatos
export function getArtifactSystemPrompt(agent: Agent): string {
  const basePrompt = agent.systemPrompt || `Você é ${agent.name}, especialista em ${agent.speciality}.`;
  
  return `${basePrompt}

IMPORTANTE: Você deve criar documentos estruturados APENAS quando o usuário explicitamente pedir por:
- Artigos, textos, documentos, roteiros
- Conteúdo que ele vai editar ou salvar
- Materiais com estrutura clara (seções, listas, etc)

NÃO crie documentos para:
- Simples explicações ou respostas
- Listas curtas ou dicas rápidas
- Conversas casuais ou perguntas diretas

Quando criar um documento, certifique-se de que:
1. Tenha pelo menos 800 caracteres (150+ palavras)
2. Seja bem estruturado com seções claras
3. Use formatação Markdown quando apropriado
4. Inclua um título claro no início

Se não tiver certeza, pergunte ao usuário se ele gostaria de receber a resposta como um documento editável.`;
}

// Analisa se a resposta deve ser dividida em mensagem + artefato
export function analyzeResponseForArtifact(
  fullContent: string,
  userMessage: string,
  agent: Agent | null
): { messageContent: string; artifactContent: string | null } {
  // Se não deve criar artefato, retorna tudo como mensagem
  if (!shouldCreateArtifact(agent, userMessage, fullContent)) {
    return {
      messageContent: fullContent,
      artifactContent: null
    };
  }
  
  // Tenta encontrar onde começa o documento principal
  const documentMarkers = [
    /^#{1,3}\s+/m,                    // Headers Markdown
    /^(Artigo:|Texto:|Documento:|Conteúdo:|Roteiro:)/im,
    /^---+\s*$/m,                     // Separadores
    /^(Aqui está|Segue abaixo|Conforme solicitado)/im
  ];
  
  let splitIndex = -1;
  let matchedMarker = null;
  
  for (const marker of documentMarkers) {
    const match = fullContent.match(marker);
    if (match && match.index !== undefined) {
      // Verifica se tem conteúdo substancial após o marcador
      const afterMarker = fullContent.substring(match.index);
      if (afterMarker.length > 800) {
        splitIndex = match.index;
        matchedMarker = match[0];
        break;
      }
    }
  }
  
  // Se encontrou um ponto de divisão claro
  if (splitIndex > 0) {
    const introduction = fullContent.substring(0, splitIndex).trim();
    const documentContent = fullContent.substring(splitIndex).trim();
    
    // Se a introdução é muito curta, usar uma padrão
    const messageContent = introduction.length > 50 
      ? introduction 
      : `Criei o ${extractTitleFromContent(documentContent).toLowerCase()} solicitado. Você pode visualizar, editar e baixar o conteúdo clicando no botão abaixo.`;
    
    return {
      messageContent,
      artifactContent: documentContent
    };
  }
  
  // Se não encontrou divisão clara mas o conteúdo é estruturado
  if (isStructuredContent(fullContent)) {
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