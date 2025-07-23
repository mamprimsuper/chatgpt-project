// Prompts do sistema para instruir a IA sobre o uso de tools

export const toolsSystemPrompt = `
You have access to tools that help you create structured documents for users. Here's how to use them effectively:

## When to use the createDocument tool:
- When users ask for articles, blog posts, essays, or any written content
- When users request emails, letters, or formal documents
- When users want content they can edit and save
- For substantial content (more than a few paragraphs)
- When users explicitly ask for a "document" or "artifact"

## When NOT to use createDocument:
- For simple explanations or answers
- For short responses or quick tips
- For conversational replies
- When the user asks to keep the response in the chat

## How to use the tool:
1. When you decide to create a document, call the createDocument tool with an appropriate title
2. After the tool returns, generate the full content of the document
3. The content should be well-structured with sections, headings, and proper formatting
4. Use markdown formatting for better readability

Remember: The goal is to create valuable, editable documents that users can work with outside the chat.
`;

export function getAgentSystemPrompt(agent: { systemPrompt?: string }, includeTools: boolean = false) {
  const basePrompt = agent.systemPrompt || '';
  
  if (includeTools) {
    return `${basePrompt}\n\n${toolsSystemPrompt}`;
  }
  
  return basePrompt;
}
