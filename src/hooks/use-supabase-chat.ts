import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { DbChat, DbMessage } from '@/lib/supabase/types';
import { Chat, Message, Agent } from '@/types';
import { getUserSession } from '@/lib/session';

// Hook para listar chats do usuário
export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChats = async () => {
    try {
      const userSession = getUserSession();
      
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          messages (
            content,
            role,
            created_at
          )
        `)
        .eq('user_session', userSession)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedChats: Chat[] = data.map((dbChat: any) => {
          // Pegar última mensagem
          const lastMessage = dbChat.messages?.[dbChat.messages.length - 1];
          
          return {
            id: dbChat.id,
            title: dbChat.title || 'Nova conversa',
            agentId: dbChat.agent_id || '',
            lastMessage: lastMessage?.content || '',
            timestamp: new Date(dbChat.updated_at)
          };
        });

        setChats(formattedChats);
      }
    } catch (err) {
      console.error('Error loading chats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  return { chats, loading, error, refresh: loadChats };
}

// Hook para carregar mensagens de um chat
export function useMessages(chatId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chatId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (data) {
          const formattedMessages: Message[] = data.map((msg: DbMessage) => ({
            id: msg.id,
            content: msg.content,
            role: msg.role as 'user' | 'assistant',
            timestamp: new Date(msg.created_at),
            artifact: msg.artifacts ? (msg.artifacts as any) : undefined
          }));

          setMessages(formattedMessages);
        }
      } catch (err) {
        console.error('Error loading messages:', err);
        setError(err instanceof Error ? err.message : 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [chatId]);

  return { messages, loading, error, setMessages };
}

// Função para criar um novo chat
export async function createChat(agent: Agent): Promise<string | null> {
  try {
    const userSession = getUserSession();
    
    // Gerar título baseado no agente
    const title = `Chat com ${agent.name}`;
    
    const { data, error } = await supabase
      .from('chats')
      .insert({
        agent_id: agent.id,
        title,
        user_session: userSession,
      })
      .select()
      .single();

    if (error) throw error;
    
    return data?.id || null;
  } catch (err) {
    console.error('Error creating chat:', err);
    return null;
  }
}

// Função para salvar mensagem
export async function saveMessage(
  chatId: string,
  message: Omit<Message, 'id' | 'timestamp'>
): Promise<Message | null> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        content: message.content,
        role: message.role,
        artifacts: message.artifact ? message.artifact : null,
      })
      .select()
      .single();

    if (error) throw error;

    // Atualizar timestamp do chat
    await supabase
      .from('chats')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', chatId);

    if (data) {
      return {
        id: data.id,
        content: data.content,
        role: data.role as 'user' | 'assistant',
        timestamp: new Date(data.created_at),
        artifact: data.artifacts ? (data.artifacts as any) : undefined
      };
    }

    return null;
  } catch (err) {
    console.error('Error saving message:', err);
    return null;
  }
}

// Função para deletar chat
export async function deleteChat(chatId: string): Promise<boolean> {
  try {
    // Deletar mensagens primeiro (cascade)
    const { error: messagesError } = await supabase
      .from('messages')
      .delete()
      .eq('chat_id', chatId);

    if (messagesError) throw messagesError;

    // Depois deletar o chat
    const { error: chatError } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId);

    if (chatError) throw chatError;

    return true;
  } catch (err) {
    console.error('Error deleting chat:', err);
    return false;
  }
}

// Função para atualizar título do chat
export async function updateChatTitle(chatId: string, title: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('chats')
      .update({ 
        title,
        updated_at: new Date().toISOString()
      })
      .eq('id', chatId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error updating chat title:', err);
    return false;
  }
}

// Função para contar mensagens do chat
export async function getChatMessageCount(chatId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('chat_id', chatId);

    if (error) throw error;
    return count || 0;
  } catch (err) {
    console.error('Error counting messages:', err);
    return 0;
  }
}