// Tipos para o sistema de tools/function calling

export interface ToolDefinition {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, any>;
      required?: string[];
    };
  };
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string; // JSON string
  };
}

export interface ToolResult {
  tool_call_id: string;
  content: string;
}

// Tipos específicos para nossas tools
export interface CreateDocumentArgs {
  title: string;
  kind: 'text'; // Por enquanto só text
}

export interface CreateDocumentResult {
  id: string;
  title: string;
  kind: 'text';
  content: string;
}

// Tipos para streaming
export type StreamDataType = 
  | { type: 'text-delta'; content: string }
  | { type: 'tool-call'; toolCall: ToolCall }
  | { type: 'document-id'; id: string }
  | { type: 'document-title'; title: string }
  | { type: 'document-content-delta'; content: string }
  | { type: 'document-finish'; id: string };
