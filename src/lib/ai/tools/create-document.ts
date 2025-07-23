import { ToolDefinition } from '../types';

export const createDocumentTool: ToolDefinition = {
  type: 'function',
  function: {
    name: 'createDocument',
    description: 'Create a document for writing or content creation activities. Use this when the user asks for articles, essays, emails, letters, or any substantial written content.',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'The title of the document'
        },
        kind: {
          type: 'string',
          enum: ['text'],
          description: 'The type of document (currently only text is supported)'
        }
      },
      required: ['title', 'kind']
    }
  }
};

// Função para executar a tool (será chamada quando a IA decidir usar)
export async function executeCreateDocument(args: { title: string; kind: 'text' }) {
  // Por enquanto, apenas retorna os metadados
  // O conteúdo será gerado pela IA após a tool ser executada
  return {
    id: Date.now().toString(),
    title: args.title,
    kind: args.kind,
    message: 'Document created successfully. The AI will now generate the content.'
  };
}
