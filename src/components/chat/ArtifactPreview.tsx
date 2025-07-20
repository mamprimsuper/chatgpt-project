"use client";

import { motion } from "framer-motion";
import { FileText, Maximize2, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Artifact } from "@/types";
import { useRef } from "react";

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
      data-artifact-id={artifact.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      onClick={handleClick}
      className="relative w-full cursor-pointer"
    >
      {/* Header */}
      <div className="p-4 border rounded-t-2xl flex flex-row gap-2 items-center justify-between bg-muted border-b-0">
        <div className="flex flex-row items-center gap-3">
          <div className="text-muted-foreground">
            {isStreaming ? (
              <div className="animate-spin">
                <LoaderCircle className="w-4 h-4" />
              </div>
            ) : (
              <FileText className="w-4 h-4" />
            )}
          </div>
          <div className="font-medium">{artifact.title}</div>
        </div>
        <div className="opacity-0 hover:opacity-100 transition-opacity">
          <Maximize2 className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Content Preview */}
      <div className="h-[257px] overflow-y-scroll border rounded-b-2xl bg-muted border-t-0">
        <div className="p-4 sm:px-14 sm:py-16 text-sm text-foreground/80">
          <pre className="whitespace-pre-wrap font-sans">
            {previewContent}
            {hasMore && (
              <span className="text-muted-foreground">...</span>
            )}
          </pre>
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 rounded-2xl hover:bg-foreground/5 transition-colors pointer-events-none" />
    </motion.div>
  );
}