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

// Hooks
import { useArtifact } from "@/hooks/use-artifact";

// Types and Data
import { Message, Agent, Chat, AppState } from "@/types";
import { AGENTS } from "@/data/agents";
import { mockArticles, mockResponses } from "@/data/mockContent";

export default function ChatPage() {
  const [appState, setAppState] = useState<AppState>("agent-selection");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Novo sistema de artefatos
  const { artifact, setArtifact, showArtifact, hideArtifact } = useArtifact();

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

  const handleStartChat = (initialMessage?: string) => {
    if (!selectedAgent) return;
    
    const welcomeMessage: Message = {
      id: "1",
      content: selectedAgent.greeting,
      role: "assistant", 
      timestamp: new Date(),
    };
    
    const userMessages: Message[] = [];
    if (initialMessage) {
      userMessages.push({
        id: "0",
        content: initialMessage,
        role: "user",
        timestamp: new Date(),
      });
    }
    
    setMessages([...userMessages, welcomeMessage]);
    setAppState("chat");
    
    if (initialMessage) {
      // Simular resposta para a mensagem inicial
      setTimeout(() => {
        handleAIResponse(initialMessage);
      }, 800);
    }
  };

  const handleAIResponse = (userMessage: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Para demo, sempre gerar artefato para Content Creator
      if (selectedAgent?.id === "content") {
        // Selecionar artigo e resposta aleatórios
        const randomArticle = mockArticles[Math.floor(Math.random() * mockArticles.length)];
        const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: randomResponse,
          role: "assistant",
          timestamp: new Date(),
          artifact: {
            id: Date.now().toString(),
            type: "text",
            title: randomArticle.title,
            content: randomArticle.content
          }
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Resposta padrão para outros agentes
        const defaultResponse = `## 🤖 **${selectedAgent?.name}** respondendo!\n\n${selectedAgent?.description}\n\nComo posso ajudar você hoje?`;
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: defaultResponse,
          role: "assistant",
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, aiMessage]);
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user", 
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = input;
    setInput("");
    
    handleAIResponse(messageContent);
  };

  const handleBackToAgents = () => {
    setAppState("agent-selection");
    setSelectedAgent(null);
    setMessages([]);
    setInput("");
  };

  const handleNewChat = () => {
    setAppState("agent-selection");
    setSelectedAgent(null);
    setMessages([]);
    setInput("");
    hideArtifact();
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleArtifactOpen = (artifactData: any, rect: DOMRect) => {
    // Configurar o artefato
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
    });

    // Mostrar com animação
    setTimeout(() => {
      showArtifact(rect);
    }, 50);
  };

  const handleUpdateArtifactContent = (content: string) => {
    setArtifact(prev => ({
      ...prev,
      content
    }));

    // Atualizar a mensagem correspondente
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

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isVisible={sidebarVisible}
        selectedAgent={selectedAgent}
        chats={chats}
        currentChatId={currentChatId}
        onToggle={toggleSidebar}
        onNewChat={handleNewChat}
        onSelectChat={setCurrentChatId}
      />

      {/* Botão para mostrar sidebar quando minimizada */}
      {!sidebarVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-4 left-4 z-50"
        >
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-white bg-zinc-950/80 border border-zinc-800/50 backdrop-blur-sm"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </motion.div>
      )}

      {/* Área Principal */}
      <div className={`flex-1 flex flex-col relative overflow-hidden transition-all duration-300`}>
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col h-full">
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
                      <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                        Especialistas Criativos
                      </h2>
                      <p className="text-zinc-400 text-lg max-w-lg mx-auto">
                        Cada agente domina uma área específica da criação. Escolha o especialista ideal para seu projeto.
                      </p>
                    </motion.div>

                    <AgentGrid agents={AGENTS} onSelectAgent={handleSelectAgent} />
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
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col"
              >
                <ChatHeader agent={selectedAgent} />

                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="max-w-4xl mx-auto p-6 space-y-6">
                      <AnimatePresence>
                        {messages.map((message, index) => (
                          <MessageItem
                            key={message.id}
                            message={message}
                            agent={selectedAgent}
                            isLast={index === messages.length - 1 && message.role === "assistant"}
                            onArtifactOpen={handleArtifactOpen}
                          />
                        ))}
                      </AnimatePresence>

                      {isLoading && <TypingIndicator agent={selectedAgent} />}

                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </div>

                <ChatInput
                  value={input}
                  onChange={setInput}
                  onSend={handleSendMessage}
                  agent={selectedAgent}
                  isLoading={isLoading}
                  placeholder={`Conversar com ${selectedAgent?.name}...`}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Novo Sistema de Artefatos */}
      <Artifact
        artifact={artifact}
        agent={selectedAgent}
        onClose={hideArtifact}
        onUpdateContent={handleUpdateArtifactContent}
      />
    </div>
  );
}