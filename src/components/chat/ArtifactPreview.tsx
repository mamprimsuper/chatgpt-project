"use client";

import { motion } from "framer-motion";
import { FileText, Maximize2, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Artifact } from "@/types";
import { useRef } from "react";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface ArtifactPreviewProps {
  artifact: Artifact;
  isStreaming?: boolean;
  onOpen: (rect: DOMRect) => void;
  agentColor?: string;
}

export function ArtifactPreview({ artifact, isStreaming = false, onOpen, agentColor }: ArtifactPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (previewRef.current) {
      const rect = previewRef.current.getBoundingClientRect();
      onOpen(rect);
    }
  };

  // Truncate content for preview
  const lines = artifact.content.split('\n');
  const previewLines = lines.slice(0, 8);
  const previewContent = previewLines.join('\n');
  const hasMore = lines.length > 8;

  return (
    <motion.div
      ref={previewRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      onClick={handleClick}
      className={cn(
        "cursor-pointer group relative overflow-hidden",
        "border rounded-2xl transition-all duration-200",
        "hover:border-zinc-600 dark:border-zinc-700",
        "bg-zinc-50 dark:bg-zinc-800/50"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-zinc-600 dark:text-zinc-400">
            {isStreaming ? (
              <LoaderCircle className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
          </div>
          <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
            {artifact.title}
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        </div>
      </div>

      {/* Content Preview */}
      <div className="relative">
        <div className="p-6 text-sm text-zinc-700 dark:text-zinc-300 max-h-[250px] overflow-hidden">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <MarkdownRenderer content={previewContent} />
          </div>
          
          {hasMore && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-zinc-50 dark:from-zinc-800/50 to-transparent pointer-events-none" />
          )}
        </div>
      </div>

      {/* Hover Overlay */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
        "bg-gradient-to-t from-black/5 to-transparent dark:from-white/5"
      )} />
    </motion.div>
  );
}