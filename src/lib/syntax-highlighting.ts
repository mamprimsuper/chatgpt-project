// Sistema de syntax highlighting simples
export function highlightCode(code: string, language: string): string {
  const keywords: Record<string, string[]> = {
    javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'break', 'continue', 'class', 'extends', 'import', 'export', 'default', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'super'],
    typescript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'break', 'continue', 'class', 'extends', 'import', 'export', 'default', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'super', 'interface', 'type', 'enum', 'namespace'],
    python: ['def', 'class', 'import', 'from', 'as', 'if', 'elif', 'else', 'for', 'while', 'break', 'continue', 'return', 'try', 'except', 'finally', 'raise', 'with', 'lambda', 'global', 'nonlocal'],
    html: ['html', 'head', 'body', 'div', 'span', 'p', 'a', 'img', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    css: ['color', 'background', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position', 'top', 'left', 'right', 'bottom']
  };

  let highlighted = code;

  // Highlight keywords
  const langKeywords = keywords[language] || keywords.javascript;
  langKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
    highlighted = highlighted.replace(regex, `<span class="text-purple-400 font-semibold">$1</span>`);
  });

  // Highlight strings
  highlighted = highlighted.replace(/(["'])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-green-400">$1$2$3</span>');

  // Highlight numbers
  highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-yellow-400">$1</span>');

  // Highlight comments
  if (language === 'javascript' || language === 'typescript') {
    highlighted = highlighted.replace(/\/\/(.*$)/gm, '<span class="text-zinc-500 italic">//$1</span>');
    highlighted = highlighted.replace(/\/\*([\s\S]*?)\*\//g, '<span class="text-zinc-500 italic">/*$1*/</span>');
  } else if (language === 'python') {
    highlighted = highlighted.replace(/#(.*$)/gm, '<span class="text-zinc-500 italic">#$1</span>');
  }

  // Highlight operators
  highlighted = highlighted.replace(/([+\-*/%=<>!&|]+)/g, '<span class="text-orange-400">$1</span>');

  // Highlight brackets and parentheses
  highlighted = highlighted.replace(/([{}()[\]])/g, '<span class="text-zinc-300 font-bold">$1</span>');

  // Highlight HTML tags
  if (language === 'html') {
    highlighted = highlighted.replace(/(&lt;\/?)(\w+)([^&]*?)(&gt;)/g, 
      '<span class="text-blue-400">$1</span><span class="text-red-400">$2</span><span class="text-yellow-400">$3</span><span class="text-blue-400">$4</span>');
  }

  return highlighted;
}