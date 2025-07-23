"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Artifact } from "@/types";

interface DocumentPreviewProps {
  artifact: Artifact;
  onOpen: (rect: DOMRect) => void;
  agentColor?: string;
  isToolGenerated?: boolean;
}

export function DocumentPreview({ 
  artifact, 
  onOpen, 
  agentColor = "from-blue-500 to-purple-600",
  isToolGenerated = false
}: DocumentPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      onOpen(rect);
    }
  };

  // Pegar apenas as primeiras linhas do conteúdo para preview
  const previewContent = artifact.content
    .split('\n')
    .slice(0, 5)
    .join('\n')
    .substring(0, 200) + '...';

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative w-full cursor-pointer group",
        "rounded-xl border border-border/50",
        "overflow-hidden",
        "transition-all duration-200",
        isHovered && "border-border shadow-md"
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-artifact-id={artifact.id}
    >
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between p-4",
        "border-b border-border/50",
        "bg-gradient-to-r",
        agentColor,
        "bg-opacity-5"
      )}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-background/80 backdrop-blur">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-medium text-sm">{artifact.title}</h4>
            {isToolGenerated && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Documento criado via ferramenta
              </p>
            )}
          </div>
        </div>
        
        <motion.div
          animate={{ 
            opacity: isHovered ? 1 : 0.7,
            scale: isHovered ? 1.1 : 1
          }}
          className="p-2 rounded-lg hover:bg-background/80 backdrop-blur transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </motion.div>
      </div>

      {/* Preview Content */}
      <div className="p-4 bg-muted/30">
        <div className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">
          {previewContent}
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}
