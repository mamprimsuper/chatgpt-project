"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  MessageSquare, 
  User, 
  Sparkles, 
  PanelLeftClose,
  Clock,
  Search
} from "lucide-react";
import { Agent, Chat } from "@/types";

interface SidebarProps {
  isVisible: boolean;
  selectedAgent?: Agent | null;
  chats: Chat[];
  currentChatId?: string | null;
  onToggle: () => void;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
}

export function Sidebar({ 
  isVisible, 
  selectedAgent, 
  chats, 
  currentChatId, 
  onToggle, 
  onNewChat, 
  onSelectChat 
}: SidebarProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -256, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -256, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="w-64 bg-zinc-950/90 backdrop-blur-xl border-r border-zinc-800/50 flex flex-col relative"
        >
          {/* Subtle glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none" />
          
          {/* Header */}
          <div className="relative p-4 border-b border-zinc-800/50">
            <div className="flex items-center justify-between mb-4">
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg ring-1 ring-white/10">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                  Creator HUB
                </h2>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={onToggle}
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 hover:text-white h-8 w-8 hover:bg-zinc-800/50"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={onNewChat}
                className="w-full justify-center gap-3 bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 border-zinc-700/50 h-12 text-base font-medium transition-all duration-300 hover:shadow-lg hover:shadow-black/25"
                variant="secondary"
              >
                <Plus className="w-5 h-5" />
                Novo Chat
              </Button>
            </motion.div>
          </div>

          {/* Current Agent */}
          {selectedAgent && (
            <motion.div 
              className="p-4 border-b border-zinc-800/50 bg-zinc-900/30"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${selectedAgent.color} text-white shadow-lg ring-1 ring-white/10`}>
                  {selectedAgent.icon}
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-200">{selectedAgent.name}</div>
                  <div className="text-xs text-zinc-400">{selectedAgent.speciality}</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Search */}
          <div className="p-4 border-b border-zinc-800/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar conversas..."
                className="w-full pl-10 pr-3 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-zinc-600 transition-all duration-200"
              />
            </div>
          </div>

          {/* Chat List */}
          <ScrollArea className="flex-1 p-2">
            <div className="space-y-1">
              {chats.length > 0 ? (
                <>
                  <div className="px-2 py-2 text-xs text-zinc-500 uppercase tracking-wide flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Últimos 7 dias
                  </div>
                  {chats.map((chat, index) => (
                    <motion.button
                      key={chat.id}
                      onClick={() => onSelectChat(chat.id)}
                      className={`w-full text-left p-3 rounded-lg hover:bg-zinc-800/50 transition-all duration-200 group ${
                        currentChatId === chat.id ? 'bg-zinc-800/70 ring-1 ring-white/10' : ''
                      }`}
                      whileHover={{ scale: 1.01, x: 2 }}
                      whileTap={{ scale: 0.99 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-4 h-4 text-zinc-400 group-hover:text-zinc-300 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate text-zinc-200 group-hover:text-white transition-colors">
                            {chat.title}
                          </div>
                          <div className="text-xs text-zinc-500 truncate group-hover:text-zinc-400 transition-colors">
                            {chat.lastMessage}
                          </div>
                          <div className="text-xs text-zinc-600 mt-1">
                            {chat.timestamp.toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </>
              ) : (
                <motion.div 
                  className="px-2 py-8 text-center text-zinc-500 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <MessageSquare className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                  <p>Seus chats aparecerão aqui</p>
                  <p className="text-xs text-zinc-600 mt-1">Comece uma conversa!</p>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <motion.div 
            className="p-4 border-t border-zinc-800/50 bg-zinc-950/50"
            whileHover={{ backgroundColor: "rgba(39, 39, 42, 0.7)" }}
          >
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-600 flex items-center justify-center ring-1 ring-white/10">
                <User className="w-3 h-3" />
              </div>
              <span className="font-medium">Usuário</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}