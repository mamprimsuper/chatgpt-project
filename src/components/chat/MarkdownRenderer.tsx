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
      }, 8); // Muito mais rápido - era 20ms, agora 8ms

      return () => clearInterval(typeInterval);
    } else {
      setDisplayedContent(content);
      setIsTyping(false);
    }
  }, [content, isLast]);

  const renderContent = (text: string) => {
    // Renderização markdown melhorada
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-zinc-300">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-2 py-1 bg-zinc-800 rounded text-sm font-mono text-green-400">$1</code>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-4 text-white">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-5 mb-3 text-white">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mt-4 mb-2 text-white">$1</h3>')
      .replace(/^\- (.*$)/gm, '<div class="flex items-start gap-2 my-1"><span class="text-blue-400 mt-1">•</span><span class="text-zinc-200">$1</span></div>')
      .replace(/^(\d+)\. (.*$)/gm, '<div class="flex items-start gap-2 my-1"><span class="text-blue-400 mt-1">$1.</span><span class="text-zinc-200">$2</span></div>')
      .replace(/\n\n/g, '<div class="my-4"></div>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="text-sm leading-relaxed text-zinc-200">
      <div 
        dangerouslySetInnerHTML={{ 
          __html: renderContent(displayedContent) 
        }} 
        className="prose prose-invert max-w-none"
      />
      {isTyping && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="inline-block w-2 h-5 bg-blue-400 ml-1 rounded-sm"
        />
      )}
    </div>
  );
}