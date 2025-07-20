"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { type Dispatch, memo, type SetStateAction, useCallback, useEffect, useState } from 'react';
import { useDebounceCallback, useWindowSize } from 'usehooks-ts';
import type { Document, Agent, UIArtifact } from '@/types';
import { TextEditor } from '@/artifacts/text/editor';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X, Download, Copy, CheckCircle, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MarkdownRenderer } from '@/components/chat/MarkdownRenderer';

interface ArtifactProps {
  artifact: UIArtifact;
  agent: Agent | null;
  onClose: () => void;
  onUpdateContent: (content: string) => void;
}

function PureArtifact({ artifact, agent, onClose, onUpdateContent }: ArtifactProps) {
  const [isContentDirty, setIsContentDirty] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const isMobile = windowWidth ? windowWidth < 768 : false;

  // Simular documento atual
  const currentDocument: Document = {
    id: artifact.documentId,
    content: artifact.content,
    createdAt: new Date(),
  };

  const handleContentChange = useCallback(
    (updatedContent: string) => {
      if (!artifact) return;
      onUpdateContent(updatedContent);
      setIsContentDirty(false);
    },
    [artifact, onUpdateContent]
  );

  const debouncedHandleContentChange = useDebounceCallback(
    handleContentChange,
    2000
  );

  const saveContent = useCallback(
    (updatedContent: string, debounce: boolean) => {
      if (updatedContent !== artifact.content) {
        setIsContentDirty(true);

        if (debounce) {
          debouncedHandleContentChange(updatedContent);
        } else {
          handleContentChange(updatedContent);
        }
      }
    },
    [artifact.content, debouncedHandleContentChange, handleContentChange]
  );

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(artifact.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadArtifact = () => {
    const blob = new Blob([artifact.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${artifact.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {artifact.isVisible && (
        <motion.div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Container principal com layout de duas colunas */}
          <div className="h-full flex">
            {/* Coluna do Chat (esquerda) */}
            <motion.div
              className="w-[400px] bg-background"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Coluna do Artefato (direita) */}
            <motion.div
              className="flex-1 bg-muted dark:bg-background border-l border-border flex flex-col"
              initial={{
                opacity: 0,
                x: 100
              }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  type: 'spring',
                  stiffness: 200,
                  damping: 30,
                }
              }}
              exit={{
                opacity: 0,
                x: 100,
                transition: {
                  duration: 0.2
                }
              }}
            >
              {/* Header do Artefato */}
              <div className="p-4 flex flex-row justify-between items-start">
                <div className="flex flex-row gap-4 items-start">
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </Button>

                  <div className="flex flex-col">
                    <div className="font-medium">{artifact.title}</div>
                    {isContentDirty ? (
                      <div className="text-sm text-muted-foreground">
                        Salvando alterações...
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        {`Atualizado ${formatDistanceToNow(currentDocument.createdAt, {
                          addSuffix: true,
                          locale: ptBR,
                        })}`}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {isEditing ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </Button>

                  <Button
                    onClick={copyToClipboard}
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  
                  <Button
                    onClick={downloadArtifact}
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto bg-muted">
                {agent && (
                  <div className={`h-1 bg-gradient-to-r ${agent.color} opacity-30`} />
                )}
                
                <div className="p-8">
                  {isEditing ? (
                    <TextEditor
                      content={artifact.content}
                      status={artifact.status}
                      onSaveContent={saveContent}
                      agentColor={agent?.color}
                    />
                  ) : (
                    <div className="prose prose-invert max-w-none">
                      <MarkdownRenderer content={artifact.content} />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const Artifact = memo(PureArtifact);