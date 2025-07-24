"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { type Dispatch, memo, type SetStateAction, useCallback, useEffect, useState, useRef, useMemo } from 'react';
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
  
  // Cache para evitar re-cálculos desnecessários
  const memoizedDocument = useMemo((): Document => ({
    id: artifact.documentId,
    content: artifact.content,
    createdAt: new Date(),
  }), [artifact.documentId, artifact.content]);

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

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(artifact.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [artifact.content]);

  const downloadArtifact = useCallback(() => {
    const blob = new Blob([artifact.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${artifact.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [artifact.content, artifact.title]);

  // Otimizar animações para evitar piscar
  const animationConfig = useMemo(() => ({
    initial: isMobile
      ? {
          opacity: 1,
          x: artifact.boundingBox.left,
          y: artifact.boundingBox.top,
          height: artifact.boundingBox.height,
          width: artifact.boundingBox.width,
          borderRadius: 24,
        }
      : {
          opacity: 1,
          x: artifact.boundingBox.left,
          y: artifact.boundingBox.top,
          height: artifact.boundingBox.height,
          width: artifact.boundingBox.width,
          borderRadius: 8,
        },
    animate: isMobile
      ? {
          opacity: 1,
          x: 0,
          y: 0,
          height: windowHeight,
          width: windowWidth || '100dvw',
          borderRadius: 0,
          transition: {
            delay: 0,
            type: 'spring',
            stiffness: 200,
            damping: 30,
          },
        }
      : {
          opacity: 1,
          x: 400,
          y: 0,
          height: windowHeight,
          width: windowWidth ? windowWidth - 400 : 'calc(100dvw - 400px)',
          borderRadius: 0,
          transition: {
            delay: 0,
            type: 'spring',
            stiffness: 200,
            damping: 30,
          },
        },
    exit: {
      opacity: 0,
      scale: 0.5,
      transition: {
        delay: 0.1,
        type: 'spring',
        stiffness: 600,
        damping: 30,
      },
    }
  }), [isMobile, artifact.boundingBox, windowHeight, windowWidth]);

  return (
    <AnimatePresence mode="wait">
      {artifact.isVisible && (
        <motion.div
          className="fixed inset-0 z-50 bg-transparent"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.4 } }}
        >
          {/* Container do Artefato */}
          <motion.div
            className={`fixed dark:bg-muted bg-background h-dvh flex flex-col overflow-hidden ${isMobile ? '' : 'border-l dark:border-zinc-700 border-zinc-200'}`}
            {...animationConfig}
          >
            {/* Header do Artefato */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-foreground truncate">
                  {artifact.title}
                </h3>
                {isContentDirty && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    Salvando...
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  disabled={artifact.status === 'streaming'}
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
                  disabled={artifact.status === 'streaming'}
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
                  disabled={artifact.status === 'streaming'}
                >
                  <Download className="w-4 h-4" />
                </Button>

                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="dark:bg-muted bg-background h-full overflow-y-scroll !max-w-full items-center">
              {agent && (
                <div className={`h-1 bg-gradient-to-r ${agent.color} opacity-30`} />
              )}
              
              <div className="p-8">
                {isEditing && artifact.status !== 'streaming' ? (
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const Artifact = memo(PureArtifact, (prevProps, nextProps) => {
  // Otimização: só re-renderizar se propriedades relevantes mudaram
  return (
    prevProps.artifact.isVisible === nextProps.artifact.isVisible &&
    prevProps.artifact.content === nextProps.artifact.content &&
    prevProps.artifact.title === nextProps.artifact.title &&
    prevProps.artifact.status === nextProps.artifact.status &&
    prevProps.agent?.color === nextProps.agent?.color
  );
});