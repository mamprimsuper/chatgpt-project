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

  // Sistema de artefatos
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
    
    const messagesToAdd: Message[] = [];
    
    if (initialMessage) {
      messagesToAdd.push({
        id: "0",
        content: initialMessage,
        role: "user",
        timestamp: new Date(),
      });
    }
    
    messagesToAdd.push(welcomeMessage);
    
    setMessages(messagesToAdd);
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
    
    // Para demo, sempre gerar artefato para Content Creator
    if (selectedAgent?.id === "content") {
      // Selecionar artigo e resposta aleatórios
      const randomArticle = mockArticles[Math.floor(Math.random() * mockArticles.length)];
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      // Criar mensagem com artefato em estado de streaming
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        role: "assistant",
        timestamp: new Date(),
        artifact: {
          id: Date.now().toString(),
          type: "text",
          title: randomArticle.title,
          content: "" // Começa vazio para simular streaming
        }
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Simular streaming do conteúdo do artefato
      const fullContent = randomArticle.content;
      const words = fullContent.split(' ');
      let currentContent = '';
      let wordIndex = 0;
      
      // Abrir o artefato imediatamente com animação
      setTimeout(() => {
        const artifactElement = document.querySelector(`[data-artifact-id="${aiMessage.artifact?.id}"]`);
        if (artifactElement && aiMessage.artifact) {
          const rect = artifactElement.getBoundingClientRect();
          
          // Configurar e abrir artefato em modo streaming
          setArtifact({
            title: aiMessage.artifact.title || "Documento",
            documentId: aiMessage.artifact.id,
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
        }
      }, 300);
      
      // Simular streaming do conteúdo
      const streamInterval = setInterval(() => {
        if (wordIndex < words.length) {
          currentContent += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
          wordIndex++;
          
          // Atualizar mensagem com conteúdo parcial
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessage.id
              ? {
                  ...msg,
                  artifact: {
                    ...msg.artifact!,
                    content: currentContent
                  }
                }
              : msg
          ));
          
          // Atualizar artefato aberto
          setArtifact(prev => ({
            ...prev,
            content: currentContent
          }));
        } else {
          // Finalizar streaming
          clearInterval(streamInterval);
          setIsLoading(false);
          
          // Mudar status para idle
          setArtifact(prev => ({
            ...prev,
            status: 'idle'
          }));
        }
      }, 50); // 50ms entre palavras para efeito suave
      
    } else {
      // Resposta padrão para outros agentes
      setTimeout(() => {
        const defaultResponse = `## 🤖 **${selectedAgent?.name}** respondendo!\n\n${selectedAgent?.description}\n\nComo posso ajudar você hoje?`;
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: defaultResponse,
          role: "assistant",
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1500);
    }
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

  // Determinar se deve mostrar o layout de chat com artefato
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

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
        onSelectChat={setCurrentChatId}
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
                        Especialistas Criativos
                      </h2>
                      <p className="text-muted-foreground text-lg max-w-lg mx-auto">
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
              <>
                <ChatHeader agent={selectedAgent} />

                <div className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4">
                  {messages.map((message, index) => (
                    <MessageItem
                      key={message.id}
                      message={message}
                      agent={selectedAgent}
                      isLast={index === messages.length - 1 && message.role === "assistant"}
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

                <form 
                  className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                >
                  <ChatInput
                    value={input}
                    onChange={setInput}
                    onSend={handleSendMessage}
                    agent={selectedAgent}
                    isLoading={isLoading}
                    placeholder="Send a message..."
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
          onClose={hideArtifact}
          onUpdateContent={handleUpdateArtifactContent}
        />
      </div>
    </div>
  );
}