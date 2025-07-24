import { useState, useEffect, useCallback } from 'react';
import { Agent } from '@/types';

interface UseAgentsResult {
  agents: Agent[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAgents(includeInactive: boolean = false, includeComingSoon: boolean = true): UseAgentsResult {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let url = '/api/agents';
      const params = new URLSearchParams();
      
      if (includeInactive) {
        params.append('include_inactive', 'true');
      }
      if (includeComingSoon) {
        params.append('include_coming_soon', 'true');
      }
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch agents: ${response.status}`);
      }

      const dynamicAgents = await response.json();
      
      if (Array.isArray(dynamicAgents)) {
        setAgents(dynamicAgents);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching agents:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setAgents([]); // Array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  }, [includeInactive, includeComingSoon]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return {
    agents,
    loading,
    error,
    refetch: fetchAgents,
  };
}

// Hook específico para buscar um agente por ID
export function useAgent(id: string | null) {
  const { agents, loading, error } = useAgents();
  
  const agent = agents.find(agent => agent.id === id) || null;
  
  return {
    agent,
    loading,
    error,
  };
}
