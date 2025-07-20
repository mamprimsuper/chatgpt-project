"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Loader2, ArrowUp } from "lucide-react";
import { Agent } from "@/types";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  agent?: Agent | null;
  isLoading?: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  agent, 
  isLoading = false,
  placeholder = "Send a message..."
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, [value]);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSend();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col w-full">
      <form className="flex mx-auto px-4 bg-background pb-2 gap-2 w-full md:max-w-3xl">
        <div className="relative w-full flex flex-col gap-4">
          <textarea
            ref={textareaRef}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={cn(
              'min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl',
              '!text-base bg-muted pb-10 dark:border-zinc-700',
              'w-full px-4 py-4 pr-24',
              'border border-border',
              'focus:outline-none focus:ring-1 focus:ring-ring',
              'placeholder:text-muted-foreground',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
            rows={2}
            autoFocus
            disabled={isLoading}
          />

          <div className="absolute bottom-0 p-2 w-fit flex flex-row justify-start">
            <Button
              className="rounded-md rounded-bl-lg p-[7px] h-fit dark:border-zinc-700 hover:dark:bg-zinc-900 hover:bg-zinc-200"
              onClick={(event) => {
                event.preventDefault();
                // TODO: Implementar upload de arquivos
              }}
              disabled={isLoading}
              variant="ghost"
              type="button"
            >
              <Paperclip className="w-[14px] h-[14px]" />
            </Button>
          </div>

          <div className="absolute bottom-0 right-0 p-2 w-fit flex flex-row justify-end">
            <Button
              className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
              onClick={(event) => {
                event.preventDefault();
                if (value.trim() && !isLoading) {
                  onSend();
                }
              }}
              disabled={!value.trim() || isLoading}
              type="submit"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-[14px] h-[14px]" />
                </motion.div>
              ) : (
                <ArrowUp className="w-[14px] h-[14px]" />
              )}
            </Button>
          </div>
        </div>
      </form>

      {agent && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.6, y: 0 }}
          className="text-[11px] text-muted-foreground text-center pb-3"
        >
          Conversando com {agent.name} • Especialista em {agent.speciality}
        </motion.p>
      )}
    </div>
  );
}