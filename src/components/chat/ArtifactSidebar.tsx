"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Copy, Download, CheckCircle, Code2 } from "lucide-react";
import { useState } from "react";
import { Artifact } from "@/types";

interface ArtifactSidebarProps {
  artifact?: Artifact;
  isOpen: boolean;
  onClose: () => void;
}

export function ArtifactSidebar({ artifact, isOpen, onClose }: ArtifactSidebarProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!artifact) return;
    try {
      await navigator.clipboard.writeText(artifact.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadArtifact = () => {
    if (!artifact) return;
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
    <AnimatePresence>
      {isOpen && artifact && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-[600px] bg-zinc-950/95 backdrop-blur-xl border-l border-zinc-800/50 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800/50 bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <Code2 className="w-5 h-5 text-zinc-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{artifact.title}</h3>
                  {artifact.language && (
                    <span className={`text-sm px-2 py-1 bg-zinc-800/50 rounded font-mono ${getLanguageColor(artifact.language)}`}>
                      {artifact.language.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={copyToClipboard}
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                
                <Button
                  onClick={downloadArtifact}
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                >
                  <Download className="w-4 h-4" />
                </Button>
                
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
              <div className="p-6">
                <div className="bg-black/50 rounded-lg border border-zinc-800/50 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border-b border-zinc-800/50">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <span className="text-sm text-zinc-400 ml-2">{artifact.title}</span>
                  </div>
                  
                  <div className="p-4">
                    <pre className={`text-sm whitespace-pre-wrap font-mono ${getLanguageColor(artifact.language)} leading-relaxed`}>
                      {artifact.content}
                    </pre>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}