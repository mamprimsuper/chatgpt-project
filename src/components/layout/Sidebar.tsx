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
          className="w-64 bg-sidebar-background backdrop-blur-xl border-r border-sidebar-border flex flex-col relative"
        >
          {/* Header */}
          <div className="relative p-4 border-b border-sidebar-border">
            <div className="flex items-center justify-between mb-4">
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg ring-1 ring-white/10">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold">
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
                  className="text-sidebar-foreground hover:text-sidebar-foreground h-8 w-8"
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
                className="w-full justify-center gap-3 h-12 text-base font-medium"
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
              className="p-4 border-b border-sidebar-border bg-sidebar-accent"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${selectedAgent.color} text-white shadow-lg ring-1 ring-white/10`}>
                  {selectedAgent.icon}
                </div>
                <div>
                  <div className="text-sm font-medium">{selectedAgent.name}</div>
                  <div className="text-xs text-muted-foreground">{selectedAgent.speciality}</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Search */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar conversas..."
                className="w-full pl-10 pr-3 py-2 bg-input border border-border rounded-lg text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
              />
            </div>
          </div>

          {/* Chat List */}
          <ScrollArea className="flex-1 p-2">
            <div className="space-y-1">
              {chats.length > 0 ? (
                <>
                  <div className="px-2 py-2 text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Últimos 7 dias
                  </div>
                  {chats.map((chat, index) => (
                    <motion.button
                      key={chat.id}
                      onClick={() => onSelectChat(chat.id)}
                      className={`w-full text-left p-3 rounded-lg hover:bg-sidebar-accent transition-all duration-200 group ${
                        currentChatId === chat.id ? 'bg-sidebar-accent' : ''
                      }`}
                      whileHover={{ scale: 1.01, x: 2 }}
                      whileTap={{ scale: 0.99 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-4 h-4 text-muted-foreground group-hover:text-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate group-hover:text-foreground transition-colors">
                            {chat.title}
                          </div>
                          <div className="text-xs text-muted-foreground truncate transition-colors">
                            {chat.lastMessage}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {chat.timestamp.toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </>
              ) : (
                <motion.div 
                  className="px-2 py-8 text-center text-muted-foreground text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p>Seus chats aparecerão aqui</p>
                  <p className="text-xs text-muted-foreground mt-1">Comece uma conversa!</p>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <motion.div 
            className="p-4 border-t border-sidebar-border"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
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