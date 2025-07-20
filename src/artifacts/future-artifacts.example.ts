// Exemplo de estrutura para adicionar novos tipos de artefatos no futuro

// 1. Para adicionar artefatos de código:
export const codeArtifact = {
  kind: 'code',
  description: 'Para snippets de código com syntax highlighting',
  editor: 'CodeMirror', // ou Monaco Editor
  features: [
    'Syntax highlighting',
    'Auto-complete',
    'Múltiplas linguagens',
    'Temas personalizados'
  ]
};

// 2. Para adicionar artefatos de imagem:
export const imageArtifact = {
  kind: 'image',
  description: 'Para visualização e edição básica de imagens',
  editor: 'Canvas API',
  features: [
    'Crop e resize',
    'Filtros básicos',
    'Anotações',
    'Export em múltiplos formatos'
  ]
};

// 3. Para adicionar artefatos de planilha:
export const sheetArtifact = {
  kind: 'sheet',
  description: 'Para dados tabulares e cálculos',
  editor: 'react-data-grid',
  features: [
    'Células editáveis',
    'Fórmulas básicas',
    'Ordenação e filtros',
    'Export para CSV/Excel'
  ]
};

// 4. Estrutura para registrar novo tipo de artefato:
/*
1. Criar pasta em src/artifacts/[tipo]/
2. Implementar editor.tsx com interface:
   - content: string
   - onSaveContent: (content: string, debounce: boolean) => void
   - status: 'streaming' | 'idle'
   - agentColor?: string

3. Adicionar detecção em detectArtifactType()
4. Mapear agentes para o novo tipo
5. Adicionar caso no MessageItem.tsx para renderizar botão específico
*/

// Exemplo de mapeamento agente -> artefato:
export const agentArtifactMapping = {
  'developer': ['code', 'text'],
  'designer': ['image', 'text'],
  'analyst': ['sheet', 'text'],
  'content': ['text'],
  'copywriter': ['text'],
  'uxwriter': ['text'],
  'scriptwriter': ['text'],
  // ... outros agentes
};
