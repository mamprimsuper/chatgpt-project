"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Paperclip, Square } from "lucide-react";
import { Agent } from "@/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  agent?: Agent | null;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  agent, 
  isLoading = false,
  disabled = false,
  placeholder = "Send a message...",
  className
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);


  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
    adjustHeight();
  };

  const handleSend = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    onSend();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (!isLoading && !disabled && value.trim()) {
        handleSend();
      }
    }
  };

  return (
    <>
      <div className={cn("relative w-full", className)}>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none",
          "rounded-2xl !text-base bg-muted pb-10 dark:border-zinc-700",
          "pr-24",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        rows={2}
        disabled={isLoading || disabled}
      />
      
      <div className="absolute bottom-0 p-2 w-fit flex flex-row justify-start">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-md rounded-bl-lg p-[7px] h-fit dark:border-zinc-700 hover:dark:bg-zinc-900 hover:bg-zinc-200"
          disabled={isLoading || disabled}
        >
          <Paperclip size={14} />
        </Button>
      </div>

      <div className="absolute bottom-0 right-0 p-2 w-fit flex flex-row justify-end">
        {isLoading ? (
          <Button
            onClick={() => {/* stop function would go here */}}
            size="icon"
            className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
          >
            <Square size={14} />
          </Button>
        ) : (
          <Button
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            size="icon"
            className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
          >
            <ArrowUp size={14} />
          </Button>
        )}
      </div>
    </div>
      
      <AuthModal 
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultTab="signup"
        onSuccess={() => {
          setShowAuthModal(false);
          // Aguardar um pouco para o contexto de auth ser atualizado e então enviar
          setTimeout(() => {
            onSend();
          }, 100);
        }}
      />
    </>
  );
}