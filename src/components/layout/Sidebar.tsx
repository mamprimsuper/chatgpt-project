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
  Search,
  BookOpen,
  Trash2,
  LogOut,
  Crown,
  ChevronUp
} from "lucide-react";
import { Agent, Chat } from "@/types";
import React, { useState, useRef, useEffect } from "react";
import { ThemeSelector } from "@/components/theme-selector";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isVisible: boolean;
  selectedAgent?: Agent | null;
  chats: Chat[];
  currentChatId?: string | null;
  onToggle: () => void;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
  onOpenAuthModal?: () => void;
}

export function Sidebar({ 
  isVisible, 
  selectedAgent, 
  chats, 
  currentChatId, 
  onToggle, 
  onNewChat, 
  onSelectChat,
  onDeleteChat,
  onOpenAuthModal 
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  // Filtrar chats baseado na busca
  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fechar menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleDeleteClick = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation(); // Prevenir seleção do chat
    if (onDeleteChat) {
      if (confirm('Tem certeza que deseja apagar esta conversa?')) {
        onDeleteChat(chatId);
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

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
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedAgent.color} text-white shadow-lg ring-1 ring-white/10 flex items-center justify-center`}>
                  {React.isValidElement(selectedAgent.icon) ? 
                    React.cloneElement(selectedAgent.icon as React.ReactElement, { 
                      className: "w-5 h-5",
                      style: { color: 'white' }
                    }) : 
                    <BookOpen className="w-5 h-5 text-white" />
                  }
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-input border border-border rounded-lg text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
              />
            </div>
          </div>

          {/* Chat List */}
          <ScrollArea className="flex-1 p-2">
            <div className="space-y-1">
              {filteredChats.length > 0 ? (
                <>
                  <div className="px-2 py-2 text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Conversas Recentes
                  </div>
                  {filteredChats.map((chat, index) => (
                    <motion.div
                      key={chat.id}
                      className="relative"
                      onMouseEnter={() => setHoveredChatId(chat.id)}
                      onMouseLeave={() => setHoveredChatId(null)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <motion.button
                        onClick={() => onSelectChat(chat.id)}
                        className={`w-full text-left p-3 rounded-lg hover:bg-sidebar-accent transition-all duration-200 group ${
                          currentChatId === chat.id ? 'bg-sidebar-accent' : ''
                        }`}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-start gap-3">
                          <MessageSquare className="w-4 h-4 text-muted-foreground group-hover:text-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0 pr-8">
                            <div className="text-sm font-medium truncate group-hover:text-foreground transition-colors">
                              {chat.title}
                            </div>
                            <div className="text-xs text-muted-foreground truncate transition-colors">
                              {chat.lastMessage}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {chat.timestamp.toLocaleDateString("pt-BR", {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                      
                      {/* Delete button */}
                      <AnimatePresence>
                        {hoveredChatId === chat.id && onDeleteChat && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={(e) => handleDeleteClick(e, chat.id)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </>
              ) : searchQuery ? (
                <motion.div 
                  className="px-2 py-8 text-center text-muted-foreground text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Search className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p>Nenhum chat encontrado</p>
                  <p className="text-xs text-muted-foreground mt-1">Tente buscar com outros termos</p>
                </motion.div>
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
            className="p-4 border-t border-sidebar-border space-y-3"
          >
            {/* User Menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-sidebar-accent transition-colors group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-medium text-sm">
                      {user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium truncate max-w-[120px]">
                        {user.email?.split('@')[0] || 'Usuário'}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Plano Free
                      </div>
                    </div>
                  </div>
                  <ChevronUp 
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                      showUserMenu ? 'rotate-0' : 'rotate-180'
                    }`} 
                  />
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-full left-0 right-0 mb-2 bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
                    >
                      <div className="p-3 border-b border-border">
                        <div className="text-sm font-medium">{user.email}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Crown className="w-3 h-3" />
                          Plano Free - Ilimitado
                        </div>
                      </div>
                      
                      <div className="p-1">
                        <motion.button
                          onClick={handleSignOut}
                          className="flex items-center gap-2 w-full p-2 text-sm rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                          whileHover={{ x: 2 }}
                        >
                          <LogOut className="w-4 h-4" />
                          Sair da conta
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                onClick={() => onOpenAuthModal?.()}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-sidebar-accent w-full text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-3 h-3" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Fazer login</span>
                  <span className="text-xs opacity-70">Clique para entrar</span>
                </div>
              </motion.button>
            )}
            
            {/* Theme Selector */}
            <ThemeSelector />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}