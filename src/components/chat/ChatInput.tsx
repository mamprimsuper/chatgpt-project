"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Loader2 } from "lucide-react";
import { Agent } from "@/types";

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
  placeholder = "Digite sua mensagem..."
}: ChatInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-6 border-t border-zinc-800/50 backdrop-blur-sm bg-black/20">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className={`relative transition-all duration-300 ${
            isFocused ? 'transform scale-[1.02]' : ''
          }`}
          whileHover={{ scale: 1.005 }}
        >
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${
            agent?.color || 'from-blue-500 to-purple-600'
          } opacity-0 blur-xl transition-opacity duration-300 ${
            isFocused ? 'opacity-20' : 'opacity-0'
          }`} />
          
          <div className="relative">
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className={`pr-24 py-6 text-base rounded-2xl bg-zinc-900/90 border-2 backdrop-blur-sm
                transition-all duration-300 min-h-[60px] resize-none
                ${isFocused 
                  ? 'border-zinc-600 shadow-2xl shadow-black/50' 
                  : 'border-zinc-700/50 hover:border-zinc-600'
                }
                focus:ring-2 focus:ring-white/10
              `}
              disabled={isLoading}
            />
            
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-zinc-400 hover:text-white hover:bg-zinc-700/50 transition-all duration-200"
                  disabled={isLoading}
                >
                  <Paperclip className="w-5 h-5" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={onSend}
                  disabled={!value.trim() || isLoading}
                  size="icon"
                  className={`h-10 w-10 transition-all duration-300 ${
                    value.trim() && !isLoading
                      ? `bg-gradient-to-r ${agent?.color || 'from-blue-500 to-purple-600'} hover:shadow-lg hover:shadow-black/25`
                      : 'bg-zinc-700 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {agent && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.6, y: 0 }}
            className="text-xs text-zinc-500 mt-3 text-center"
          >
            Conversando com <span className="font-medium text-zinc-400">{agent.name}</span> • 
            Especialista em <span className="font-medium text-zinc-400">{agent.speciality}</span>
          </motion.p>
        )}
      </div>
    </div>
  );
}