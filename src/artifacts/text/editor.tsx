"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useDebounce } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { X, Copy, Download, Save, Check, ZoomIn, ZoomOut, FileText } from "lucide-react";
import { Agent } from "@/types";

interface TextEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onClose: () => void;
  agent: Agent | null;
  title?: string;
}

export function TextEditor({ 
  content, 
  onContentChange, 
  onClose, 
  agent,
  title = "Documento"
}: TextEditorProps) {
  const [localContent, setLocalContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Usar useDebounce do usehooks-ts
  const debouncedContent = useDebounce(localContent, 1000);

  // Salvar quando o conteúdo mudar (depois do debounce)
  useEffect(() => {
    if (debouncedContent !== content && debouncedContent === localContent) {
      setIsSaving(true);
      onContentChange(debouncedContent);
      
      setTimeout(() => {
        setIsSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }, 500);
    }
  }, [debouncedContent, content, localContent, onContentChange]);

  // Calcular contadores
  useEffect(() => {
    const words = localContent.trim().split(/\s+/).filter(word => word.length > 0).length;
    const chars = localContent.length;
    setWordCount(words);
    setCharCount(chars);
  }, [localContent]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContent(e.target.value);
    setSaved(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(localContent);
  };

  const handleDownload = () => {
    const blob = new Blob([localContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const adjustFontSize = (delta: number) => {
    setFontSize(prev => Math.max(12, Math.min(24, prev + delta)));
  };

  // Auto-focus no textarea
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-4xl h-[90vh] bg-background border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${agent?.color || 'from-blue-500 to-purple-600'} text-white`}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                {title}
                {isSaving && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-muted-foreground flex items-center gap-1"
                  >
                    <Save className="w-3 h-3" />
                    Salvando...
                  </motion.span>
                )}
                {saved && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Salvo
                  </motion.span>
                )}
              </h2>
              <p className="text-xs text-muted-foreground">
                {wordCount} palavras • {charCount} caracteres
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Controles de Zoom */}
            <div className="flex items-center gap-1 mr-2">
              <Button
                onClick={() => adjustFontSize(-2)}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-xs text-muted-foreground w-12 text-center">
                {fontSize}px
              </span>
              <Button
                onClick={() => adjustFontSize(2)}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            <Button
              onClick={handleCopy}
              variant="ghost"
              size="icon"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleDownload}
              variant="ghost"
              size="icon"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 p-6 overflow-hidden">
          <textarea
            ref={textareaRef}
            value={localContent}
            onChange={handleContentChange}
            className="w-full h-full resize-none bg-transparent outline-none font-mono leading-relaxed"
            style={{ 
              fontSize: `${fontSize}px`,
              lineHeight: '1.7'
            }}
            placeholder="Digite seu texto aqui..."
            spellCheck="true"
          />
        </div>

        {/* Footer com dicas */}
        <div className="p-3 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            💡 Dica: Use Ctrl+A para selecionar tudo • O documento é salvo automaticamente
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}