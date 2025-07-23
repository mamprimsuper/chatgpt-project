"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { Artifact } from "@/types";
import { useRef } from "react";

interface ArtifactCardProps {
  artifact: Artifact;
  onOpen: (rect: DOMRect) => void;
  agentColor?: string;
}

export function ArtifactCard({ artifact, onOpen, agentColor }: ArtifactCardProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      onOpen(rect);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      className="relative"
    >
      <button
        ref={buttonRef}
        onClick={handleClick}
        className={`
          relative w-full text-left rounded-lg border border-border 
          bg-gradient-to-br ${agentColor || 'from-blue-500/10 to-purple-600/10'}
          hover:from-blue-500/20 hover:to-purple-600/20
          transition-all duration-200 overflow-hidden
          hover:shadow-md hover:scale-[1.02]
        `}
        data-artifact-id={artifact.id}
      >
        <div className="p-4 flex items-center gap-3">
          <div className={`
            p-2 rounded-lg bg-gradient-to-br ${agentColor || 'from-blue-500 to-purple-600'} 
            text-white
          `}>
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{artifact.title}</h3>
            <p className="text-sm text-muted-foreground mt-0.5 italic">
              Clique para editar
            </p>
          </div>
        </div>
      </button>
    </motion.div>
  );
}