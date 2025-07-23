"use client";

import { useState, useEffect } from "react";
import { useDebounceCallback } from "usehooks-ts";

interface TextEditorProps {
  content: string;
  status: string;
  onSaveContent: (content: string, debounce: boolean) => void;
  agentColor?: string;
}

export function TextEditor({ 
  content, 
  status,
  onSaveContent, 
  agentColor
}: TextEditorProps) {
  const [localContent, setLocalContent] = useState(content);

  // Usar useDebounceCallback para salvar conteúdo
  const debouncedSave = useDebounceCallback((newContent: string) => {
    if (newContent !== content) {
      onSaveContent(newContent, true);
    }
  }, 1000);

  // Chamar debounced save quando conteúdo local mudar
  useEffect(() => {
    if (localContent !== content) {
      debouncedSave(localContent);
    }
  }, [localContent, content, debouncedSave]);

  // Sync com props quando content muda externamente
  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContent(e.target.value);
  };

  return (
    <div className="h-full">
      <textarea
        value={localContent}
        onChange={handleContentChange}
        className="w-full h-full resize-none bg-transparent outline-none font-mono leading-relaxed p-4"
        placeholder="Digite seu texto aqui..."
        spellCheck="true"
      />
    </div>
  );
}