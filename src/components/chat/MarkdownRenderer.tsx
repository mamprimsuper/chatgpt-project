"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface MarkdownRendererProps {
  content: string;
  isLast?: boolean;
}

export function MarkdownRenderer({ content, isLast }: MarkdownRendererProps) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isLast) {
      setIsTyping(true);
      setDisplayedContent("");
      
      let index = 0;
      const typeInterval = setInterval(() => {
        if (index < content.length) {
          setDisplayedContent(content.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(typeInterval);
        }
      }, 8);

      return () => clearInterval(typeInterval);
    } else {
      setDisplayedContent(content);
      setIsTyping(false);
    }
  }, [content, isLast]);

  const renderContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-muted rounded text-sm font-mono">$1</code>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-3 mb-2">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mt-2 mb-1">$1</h3>')
      .replace(/^\- (.*$)/gm, '<div class="flex items-start gap-2"><span>•</span><span>$1</span></div>')
      .replace(/^(\d+)\. (.*$)/gm, '<div class="flex items-start gap-2"><span>$1.</span><span>$2</span></div>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="text-sm text-foreground">
      <div 
        dangerouslySetInnerHTML={{ 
          __html: `<p class="mb-4">${renderContent(displayedContent)}</p>` 
        }} 
        className="[&>p:last-child]:mb-0"
      />
      {isTyping && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="inline-block w-0.5 h-4 bg-foreground ml-0.5 align-middle"
        />
      )}
    </div>
  );
}