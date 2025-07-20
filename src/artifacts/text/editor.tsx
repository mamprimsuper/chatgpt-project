"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface TextEditorProps {
  content: string;
  status: 'streaming' | 'idle';
  onSaveContent: (content: string, debounce: boolean) => void;
  agentColor?: string;
}

export function TextEditor({ content, status, onSaveContent, agentColor }: TextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [localContent, setLocalContent] = useState(content);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  useEffect(() => {
    if (textareaRef.current) {
      // Auto-resize textarea
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [localContent]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setLocalContent(newContent);
    onSaveContent(newContent, true); // com debounce
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative">
        {/* Indicador de streaming */}
        {status === 'streaming' && (
          <div className={cn(
            "absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-50",
            agentColor || "from-blue-500 to-purple-600"
          )}>
            <div className="h-full w-1/3 bg-white/50 animate-pulse" />
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={localContent}
          onChange={handleChange}
          disabled={status === 'streaming'}
          className={cn(
            "w-full p-6 bg-background text-foreground resize-none outline-none rounded-lg",
            "placeholder:text-muted-foreground leading-relaxed",
            "font-medium text-lg",
            "transition-all duration-200",
            "focus:ring-2 focus:ring-border",
            status === 'streaming' && "opacity-70 cursor-not-allowed"
          )}
          placeholder="Comece a escrever seu texto..."
          style={{
            minHeight: '400px',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        />
      </div>
    </div>
  );
}