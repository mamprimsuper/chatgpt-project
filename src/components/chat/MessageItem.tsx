"use client";

import { motion } from "framer-motion";
import { Message, Agent } from "@/types";
import { ArtifactCard } from "./ArtifactCard";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: Message;
  agent?: Agent | null;
  isLast?: boolean;
  onArtifactOpen?: (artifact: any, rect: DOMRect) => void;
}

export function MessageItem({ message, agent, isLast, onArtifactOpen }: MessageItemProps) {
  const handleArtifactOpen = (rect: DOMRect) => {
    if (message.artifact && onArtifactOpen) {
      onArtifactOpen(message.artifact, rect);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full mx-auto max-w-3xl px-4 group/message"
      data-role={message.role}
    >
      <div
        className={cn(
          "flex gap-4 w-full",
          message.role === "user" && "ml-auto max-w-2xl w-fit"
        )}
      >
        <div className="flex flex-col gap-4 w-full">
          {message.role === "user" ? (
            <div className="bg-primary text-primary-foreground px-4 py-3 rounded-xl ml-auto">
              <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          ) : (
            <>
              <div className="text-base leading-relaxed">
                <MarkdownRenderer content={message.content} isLast={false} />
              </div>
              
              {message.artifact && (
                <ArtifactCard
                  artifact={message.artifact}
                  onOpen={handleArtifactOpen}
                  agentColor={agent?.color}
                />
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}