export function formatMarkdown(content: string): string {
  let html = content;

  // Headers
  html = html.replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold text-white mb-2 mt-4">$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-white mb-3 mt-6">$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-white mb-4 mt-6">$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em class="italic text-zinc-300">$1</em>');

  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<div class="my-4 rounded-lg overflow-hidden border border-zinc-700">
      <div class="bg-zinc-800 px-3 py-2 text-xs text-zinc-400 border-b border-zinc-700">
        ${lang ? lang.toUpperCase() : 'CODE'}
      </div>
      <pre class="bg-black p-4 overflow-x-auto"><code class="text-emerald-400 text-sm font-mono">${code.trim()}</code></pre>
    </div>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-zinc-800 text-emerald-400 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');

  // Lists
  html = html.replace(/^\* (.*$)/gm, '<li class="ml-4 mb-1 text-zinc-300">• $1</li>');
  html = html.replace(/^- (.*$)/gm, '<li class="ml-4 mb-1 text-zinc-300">• $1</li>');
  
  // Wrap consecutive list items in ul
  html = html.replace(/(<li.*?<\/li>\s*)+/g, '<ul class="my-3">$&</ul>');

  // Numbered lists
  html = html.replace(/^\d+\. (.*$)/gm, '<li class="ml-4 mb-1 text-zinc-300">$1</li>');

  // Line breaks
  html = html.replace(/\n\n/g, '<br><br>');
  html = html.replace(/\n/g, '<br>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline" target="_blank">$1</a>');

  // Blockquotes
  html = html.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-zinc-600 pl-4 my-2 text-zinc-400 italic">$1</blockquote>');

  return html;
}