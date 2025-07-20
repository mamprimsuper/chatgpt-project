"use client";

import { motion } from "framer-motion";
import { Agent } from "@/types";

interface TypingIndicatorProps {
  agent?: Agent | null;
}

export function TypingIndicator({ agent }: TypingIndicatorProps) {
  return (
    <div className="flex gap-4">
      {agent && (
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
          <div className="translate-y-px">
            {agent.icon}
          </div>
        </div>
      )}
      
      <div className="flex flex-col gap-2 text-muted-foreground">
        Hmm...
      </div>
    </div>
  );
}