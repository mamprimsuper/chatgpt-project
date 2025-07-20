import { useState, useCallback } from 'react';
import type { UIArtifact } from '@/types';

interface ArtifactMetadata {
  [key: string]: any;
}

export function useArtifact() {
  const [artifact, setArtifact] = useState<UIArtifact>({
    title: '',
    documentId: 'init',
    kind: 'text',
    content: '',
    isVisible: false,
    status: 'idle',
    boundingBox: {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    },
  });

  const [metadata, setMetadata] = useState<ArtifactMetadata>({});

  const showArtifact = useCallback((rect: DOMRect) => {
    setArtifact(prev => ({
      ...prev,
      isVisible: true,
      boundingBox: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
    }));
  }, []);

  const hideArtifact = useCallback(() => {
    setArtifact(prev => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  return {
    artifact,
    setArtifact,
    metadata,
    setMetadata,
    showArtifact,
    hideArtifact,
  };
}
