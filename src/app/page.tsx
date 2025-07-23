"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu } from "lucide-react";

// Components
import { MessageItem } from "@/components/chat/MessageItem";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { AgentGrid } from "@/components/agents/AgentGrid";
import { AgentWelcome } from "@/components/agents/AgentWelcome";
import { Sidebar } from "@/components/layout/Sidebar";
import { Artifact } from "@/components/artifact";
import { MessageLimitWarning } from "@/components/chat/MessageLimitWarning";

// Hooks
import { useArtifact } from "@/hooks/use-artifact";
import { useAgents } from "@/hooks/use-agents";
import { 
  useChats, 
  useMessages, 
  createChat, 
  saveMessage, 
  deleteChat,
  getChatMessageCount,
  updateChatTitle 
} from "@/hooks/use-supabase-chat";

// Types
import { Message, Agent, Chat, AppState } from "@/types";

const MESSAGE_LIMIT = 20;

export default function ChatPage() {
  const [appState, setAppState] = useState<AppState>("agent-selection");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [messageCount, setMessageCount] = useState(0);
  const [isNewConversation, setIsNewConversation] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Hooks do Supabase
  const { chats, refresh: refreshChats } = useChats();
  const { messages, setMessages } = useMessages(currentChatId);

  // Buscar agentes dinâmicos
  const { agents, loading: agentsLoading, error: agentsError } = useAgents();

  // Sistema de artefatos
  const { artifact, setArtifact, showArtifact, hideArtifact } = useArtifact();

  // Verificar limite de mensagens quando o chat mudar
  useEffect(() => {
    if (currentChatId) {
      getChatMessageCount(currentChatId).then(count => {
        setMessageCount(count);
      });
    }
  }, [currentChatId, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setAppState("agent-welcome");
  };

  const handleStartChat = async (initialMessage?: string) => {
    if (!selectedAgent) return;
    
    // Criar novo chat no banco
    const chatId = await createChat(selectedAgent);
    if (!chatId) {
      console.error('Failed to create chat');
      return;
    }

    setCurrentChatId(chatId);
    setIsNewConversation(true);
    
    // Se houver mensagem inicial, processar
    if (initialMessage) {
      // Salvar mensagem do usuário
      const userMessage = await saveMessage(chatId, {
        content: initialMessage,
        role: "user",
      });

      if (userMessage) {
        setMessages([userMessage]);
        
        // Chamar API para resposta
        setAppState("chat");
        handleAIResponse(initialMessage, chatId, [userMessage], true);
      }
    } else {
      // Apenas mostrar greeting como primeira mensagem
      const greetingMessage = await saveMessage(chatId, {
        content: selectedAgent.greeting,
        role: "assistant",
      });
      
      if (greetingMessage) {
        setMessages([greetingMessage]);
        setAppState("chat");
      }
    }

    // Atualizar lista de chats
    refreshChats();
  };

  const handleAIResponse = async (
    userMessage: string, 
    chatId: string, 
    currentMessages: Message[],
    isNewMessage: boolean = true
  ) => {
    setIsLoading(true);
    
    try {
      // Preparar mensagens para a API
      const apiMessages = currentMessages
        .filter(msg => msg.role === 'user' || msg.role === 'assistant')
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      
      // Adicionar a mensagem atual se não estiver já incluída
      const lastMessage = apiMessages[apiMessages.length - 1];
      if (!lastMessage || lastMessage.content !== userMessage || lastMessage.role !== 'user') {
        apiMessages.push({
          role: 'user',
          content: userMessage
        });
      }

      // Chamar API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          agent: selectedAgent,
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      // Salvar resposta no banco
      const aiMessage = await saveMessage(chatId, {
        content: data.content,
        role: "assistant",
        artifact: data.artifact
      });

      if (aiMessage) {
        // Marcar como nova mensagem para streaming
        if (isNewMessage) {
          aiMessage._isNew = true;
        }
        
        setMessages(prev => [...prev, aiMessage]);

        // Se for a primeira resposta real (não greeting), gerar título
        if (currentMessages.length <= 2 && currentMessages.some(m => m.role === 'user')) {
          // Gerar título baseado na conversa
          const title = userMessage.slice(0, 50) + (userMessage.length > 50 ? '...' : '');
          await updateChatTitle(chatId, title);
          refreshChats();
        }

        // Se houver artefato, abrir
        if (data.artifact) {
          setTimeout(() => {
            const artifactElement = document.querySelector(`[data-artifact-id="${data.artifact.id}"]`);
            if (artifactElement) {
              const rect = artifactElement.getBoundingClientRect();
              
              setArtifact({
                title: data.artifact.title || "Documento",
                documentId: data.artifact.id,
                kind: 'text',
                content: '',
                isVisible: false,
                status: 'streaming',
                boundingBox: {
                  top: rect.top,
                  left: rect.left,
                  width: rect.width,
                  height: rect.height,
                },
              });
              
              setTimeout(() => {
                showArtifact(rect);
              }, 50);

              // Simular streaming do conteúdo
              const fullContent = data.artifact.content;
              const words = fullContent.split(' ');
              let currentContent = '';
              let wordIndex = 0;
              
              const streamInterval = setInterval(() => {
                if (wordIndex < words.length) {
                  currentContent += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
                  wordIndex++;
                  
                  setArtifact(prev => ({
                    ...prev,
                    content: currentContent
                  }));
                } else {
                  clearInterval(streamInterval);
                  
                  setArtifact(prev => ({
                    ...prev,
                    status: 'idle'
                  }));
                }
              }, 50);
            }
          }, 300);
        }
      }

      setIsLoading(false);

    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const fallbackMessage = await saveMessage(chatId, {
        content: `Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.`,
        role: "assistant",
      });
      
      if (fallbackMessage) {
        setMessages(prev => [...prev, fallbackMessage]);
      }
      
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || !currentChatId || messageCount >= MESSAGE_LIMIT) {
      return;
    }

    // Salvar mensagem do usuário
    const userMessage = await saveMessage(currentChatId, {
      content: input,
      role: "user",
    });

    if (!userMessage) {
      console.error('Failed to save message');
      return;
    }

    setMessages(prev => [...prev, userMessage]);
    const messageContent = input;
    setInput("");
    setIsNewConversation(false);
    
    await handleAIResponse(messageContent, currentChatId, [...messages, userMessage], true);
  };

  const handleBackToAgents = () => {
    setAppState("agent-selection");
    setSelectedAgent(null);
    setMessages([]);
    setInput("");
    setCurrentChatId(null);
    setIsNewConversation(true);
  };

  const handleNewChat = () => {
    setAppState("agent-selection");
    setSelectedAgent(null);
    setMessages([]);
    setInput("");
    setCurrentChatId(null);
    setIsNewConversation(true);
    hideArtifact();
  };

  const handleSelectChat = async (chatId: string) => {
    setCurrentChatId(chatId);
    setIsNewConversation(false);
    setIsLoadingMessages(true);
    
    // Encontrar o agente do chat
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      const agent = agents.find(a => a.id === chat.agentId);
      if (agent) {
        setSelectedAgent(agent);
        setAppState("chat");
      }
    }
    
    // Aguardar mensagens carregarem
    setTimeout(() => {
      setIsLoadingMessages(false);
    }, 100);
    
    hideArtifact();
  };

  const handleDeleteChat = async (chatId: string) => {
    const success = await deleteChat(chatId);
    if (success) {
      refreshChats();
      
      // Se deletou o chat atual, voltar para seleção
      if (chatId === currentChatId) {
        handleNewChat();
      }
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleArtifactOpen = (artifactData: any, rect: DOMRect) => {
    // Salvar posição do scroll antes de abrir
    if (chatScrollRef.current) {
      const scrollTop = chatScrollRef.current.scrollTop;
      
      setArtifact({
        title: artifactData.title || "Documento",
        documentId: artifactData.id,
        kind: 'text',
        content: artifactData.content,
        isVisible: false,
        status: 'idle',
        boundingBox: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
        scrollPosition: scrollTop, // Salvar posição do scroll
      });

      setTimeout(() => {
        showArtifact(rect);
      }, 50);
    }
  };

  const handleCloseArtifact = () => {
    const scrollPosition = artifact.scrollPosition;
    hideArtifact();
    
    // Restaurar scroll após fechar
    if (scrollPosition !== undefined && chatScrollRef.current) {
      requestAnimationFrame(() => {
        if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = scrollPosition;
        }
      });
    }
  };

  const handleUpdateArtifactContent = (content: string) => {
    setArtifact(prev => ({
      ...prev,
      content
    }));

    setMessages(prevMessages => 
      prevMessages.map(msg => {
        if (msg.artifact && msg.artifact.id === artifact.documentId) {
          return {
            ...msg,
            artifact: {
              ...msg.artifact,
              content
            }
          };
        }
        return msg;
      })
    );
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const hasReachedLimit = messageCount >= MESSAGE_LIMIT;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Background overlay quando o artefato está visível em desktop */}
      <AnimatePresence>
        {artifact.isVisible && !isMobile && (
          <motion.div
            className="fixed inset-0 bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ zIndex: 10 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar
        isVisible={sidebarVisible && (!artifact.isVisible || isMobile)}
        selectedAgent={selectedAgent}
        chats={chats}
        currentChatId={currentChatId}
        onToggle={toggleSidebar}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
      />

      {/* Botão para mostrar sidebar quando minimizada */}
      {!sidebarVisible && (!artifact.isVisible || isMobile) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-4 left-4 z-50"
        >
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground bg-background border border-border"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </motion.div>
      )}

      {/* Layout principal com duas colunas quando artefato está aberto */}
      <div className={`flex-1 flex ${artifact.isVisible && !isMobile ? 'relative' : ''}`}>
        {/* Área do Chat */}
        <div className={`flex flex-col min-w-0 h-dvh bg-background ${artifact.isVisible && !isMobile ? 'w-[400px] border-r border-border z-20' : 'w-full'} ${artifact.isVisible && isMobile ? 'hidden' : ''}`}>
          <AnimatePresence mode="wait">
            {appState === "agent-selection" ? (
              /* ETAPA 1: Seleção de Agente */
              <motion.div
                key="agent-selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col"
              >
                <ScrollArea className="flex-1">
                  <div className="p-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mb-8"
                    >
                      <h2 className="text-4xl font-bold mb-4">
                        Especialistas Dinâmicos
                      </h2>
                      <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                        Agentes inteligentes criados dinamicamente. Cada um com sua especialidade única.
                      </p>
                    </motion.div>

                    {agentsError ? (
                      <div className="text-center p-8">
                        <div className="text-red-500 mb-4">
                          Erro ao carregar agentes: {agentsError}
                        </div>
                        <Button onClick={() => window.location.reload()}>
                          Tentar Novamente
                        </Button>
                      </div>
                    ) : null}

                    <AgentGrid 
                      agents={agents} 
                      onSelectAgent={handleSelectAgent}
                      loading={agentsLoading}
                    />

                    {!agentsLoading && agents.length === 0 && !agentsError && (
                      <div className="text-center text-muted-foreground">
                        Nenhum agente disponível no momento.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </motion.div>
            ) : appState === "agent-welcome" ? (
              /* ETAPA 2: Tela de Boas-vindas do Agente */
              <motion.div
                key="agent-welcome"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <AgentWelcome
                  agent={selectedAgent!}
                  onBack={handleBackToAgents}
                  onStartChat={handleStartChat}
                />
              </motion.div>
            ) : (
              /* ETAPA 3: Chat Ativo */
              <>
                <ChatHeader agent={selectedAgent} />

                <div 
                  ref={chatScrollRef}
                  id="chat-messages-container"
                  className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
                >
                  {messages.map((message, index) => (
                    <MessageItem
                      key={message.id}
                      message={message}
                      agent={selectedAgent}
                      isLast={false} // Nunca fazer streaming de mensagens antigas
                      onArtifactOpen={handleArtifactOpen}
                    />
                  ))}

                  {isLoading && (
                    <div className="w-full mx-auto max-w-3xl px-4">
                      <TypingIndicator agent={selectedAgent} />
                    </div>
                  )}

                  <div ref={messagesEndRef} className="shrink-0 min-w-[24px] min-h-[24px]" />
                </div>

                {/* Aviso de limite de mensagens */}
                {hasReachedLimit && (
                  <MessageLimitWarning onNewChat={handleNewChat} />
                )}

                <form 
                  className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!hasReachedLimit) {
                      handleSendMessage();
                    }
                  }}
                >
                  <ChatInput
                    value={input}
                    onChange={setInput}
                    onSend={handleSendMessage}
                    agent={selectedAgent}
                    isLoading={isLoading}
                    disabled={hasReachedLimit}
                    placeholder={hasReachedLimit ? "Limite de mensagens atingido" : "Enviar mensagem..."}
                    className="bg-background dark:bg-muted"
                  />
                </form>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Sistema de Artefatos */}
        <Artifact
          artifact={artifact}
          agent={selectedAgent}
          onClose={handleCloseArtifact}
          onUpdateContent={handleUpdateArtifactContent}
        />
      </div>
    </div>
  );
}