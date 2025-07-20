"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Copy, Download, Maximize2, CheckCircle, Code2 } from "lucide-react";
import { Artifact } from "@/types";

interface ArtifactViewerProps {
  artifact: Artifact;
  onOpen?: () => void;
}

export function ArtifactViewer({ artifact, onOpen }: ArtifactViewerProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(artifact.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadArtifact = () => {
    const blob = new Blob([artifact.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${artifact.title.toLowerCase().replace(/\s+/g, '-')}.${artifact.language || 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLanguageColor = (language?: string) => {
    const colors: Record<string, string> = {
      javascript: 'text-yellow-400',
      typescript: 'text-blue-400', 
      python: 'text-green-400',
      jsx: 'text-cyan-400',
      html: 'text-orange-400',
      css: 'text-pink-400',
      json: 'text-purple-400',
    };
    return colors[language || ''] || 'text-green-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group border border-zinc-700/50 rounded-xl overflow-hidden bg-zinc-900/50 backdrop-blur-sm hover:border-zinc-600/50 transition-all duration-300 cursor-pointer"
      onClick={onOpen}
    >
      {/* Header Compacto */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-700/50 bg-zinc-800/30">
        <div className="flex items-center gap-3">
          <Code2 className="w-4 h-4 text-zinc-400" />
          <span className="text-sm font-medium text-white">{artifact.title}</span>
          {artifact.language && (
            <span className={`text-xs px-2 py-1 bg-zinc-700/50 rounded font-mono ${getLanguageColor(artifact.language)}`}>
              {artifact.language.toUpperCase()}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard();
            }}
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-700/50"
          >
            {copied ? (
              <CheckCircle className="w-3 h-3 text-green-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </Button>
          
          <Button
            onClick={(e) => {
              e.stopPropagation();
              downloadArtifact();
            }}
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-700/50"
          >
            <Download className="w-3 h-3" />
          </Button>
          
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onOpen?.();
            }}
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-700/50"
          >
            <Maximize2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Preview Compacto */}
      <div className="p-4 bg-black/30 max-h-32 overflow-hidden relative">
        <pre className={`text-xs whitespace-pre-wrap font-mono ${getLanguageColor(artifact.language)} leading-relaxed opacity-80`}>
          {artifact.content.slice(0, 200)}...
        </pre>
        
        {/* Gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        
        {/* Click indicator */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm">
          <span className="text-xs text-white bg-blue-500 px-3 py-1 rounded-full">
            Clique para abrir
          </span>
        </div>
      </div>
    </motion.div>
  );
}