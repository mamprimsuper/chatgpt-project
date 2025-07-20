"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpIcon, PaperclipIcon, StopIcon } from "lucide-react";
import { Agent } from "@/types";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  agent?: Agent | null;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  agent, 
  isLoading = false,
  placeholder = "Send a message...",
  className
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (!isLoading && value.trim()) {
        onSend();
      }
    }
  };

  return (
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
          className
        )}
        rows={2}
        disabled={isLoading}
      />
      
      <div className="absolute bottom-0 p-2 w-fit flex flex-row justify-start">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-md rounded-bl-lg p-[7px] h-fit dark:border-zinc-700 hover:dark:bg-zinc-900 hover:bg-zinc-200"
          disabled={isLoading}
        >
          <PaperclipIcon size={14} />
        </Button>
      </div>

      <div className="absolute bottom-0 right-0 p-2 w-fit flex flex-row justify-end">
        {isLoading ? (
          <Button
            onClick={() => {/* stop function would go here */}}
            size="icon"
            className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
          >
            <StopIcon size={14} />
          </Button>
        ) : (
          <Button
            onClick={onSend}
            disabled={!value.trim()}
            size="icon"
            className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
          >
            <ArrowUpIcon size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}

function ArrowUpIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 5L12 19M12 5L19 12M12 5L5 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PaperclipIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.44 11.05L12.25 20.24C11.1238 21.3663 9.59719 21.9983 8.00501 21.9983C6.41283 21.9983 4.88617 21.3663 3.76001 20.24C2.63386 19.1138 2.00183 17.5872 2.00183 15.995C2.00183 14.4028 2.63386 12.8762 3.76001 11.75L12.33 3.18001C13.0863 2.4269 14.1071 2.00195 15.17 2.00195C16.233 2.00195 17.2537 2.4269 18.01 3.18001C18.7631 3.93637 19.1881 4.95712 19.1881 6.02001C19.1881 7.0829 18.7631 8.10365 18.01 8.86001L9.41001 17.46C9.03181 17.8383 8.52113 18.0508 7.99001 18.0508C7.4589 18.0508 6.94821 17.8383 6.57001 17.46C6.19181 17.0818 5.97926 16.5711 5.97926 16.04C5.97926 15.5089 6.19181 14.9983 6.57001 14.62L14.66 6.53001"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StopIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="6"
        y="6"
        width="12"
        height="12"
        rx="2"
        fill="currentColor"
      />
    </svg>
  );
}