import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { dbAgentToAgent, isComingSoonAgent } from '@/types';
import { ICON_MAP } from '@/lib/icons';

// GET - Listar agentes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('include_inactive') === 'true';
    const includeComingSoon = searchParams.get('include_coming_soon') === 'true';
    
    let query = supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: true });
    
    // Por padrão, retorna apenas agentes ativos + coming soon para usuários finais
    // Para admin, permite buscar todos incluindo inativos
    if (!includeInactive) {
      if (includeComingSoon) {
        // Inclui ativos + coming soon
        query = query.or('active.eq.true,category.like.coming_soon_%');
      } else {
        // Apenas ativos (sem coming soon)
        query = query.eq('active', true).not('category', 'like', 'coming_soon_%');
      }
    }
    
    const { data: agents, error } = await query;

    if (error) {
      console.error('Error fetching agents:', error);
      return NextResponse.json(
        { error: 'Failed to fetch agents' },
        { status: 500 }
      );
    }

    if (!agents || agents.length === 0) {
      return NextResponse.json([]);
    }

    // Converter DbAgent para Agent
    const formattedAgents = agents.map(dbAgentToAgent);

    console.log('Agents processed:', formattedAgents.length);

    return NextResponse.json(formattedAgents);
  } catch (error) {
    console.error('Error in agents API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Criar novo agente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validação dos campos obrigatórios
    const requiredFields = ['name', 'system_prompt'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Field ${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validar ícone se fornecido
    if (body.icon_name && !ICON_MAP[body.icon_name]) {
      return NextResponse.json(
        { 
          error: 'Invalid icon_name', 
          available_icons: Object.keys(ICON_MAP) 
        },
        { status: 400 }
      );
    }

    // Gerar ID único
    const generateId = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    // Preparar dados para inserção
    const agentData = {
      id: generateId(),
      name: body.name,
      description: body.description || null,
      speciality: body.speciality || null,
      system_prompt: body.system_prompt,
      suggestions: body.suggestions || [
        'Como posso começar?',
        'Me dê algumas dicas',
        'O que você pode fazer?',
        'Me ajude com um projeto'
      ],
      color: body.color || 'from-blue-500 to-purple-600',
      icon_name: body.icon_name || 'lightbulb',
      active: body.active !== false, // Default true
      premium_tier: body.premium_tier || 0,
      category: body.category || 'general',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Inserir no Supabase
    const { data, error } = await supabase
      .from('agents')
      .insert([agentData])
      .select()
      .single();

    if (error) {
      console.error('Error creating agent:', error);
      return NextResponse.json(
        { error: 'Failed to create agent', details: error.message },
        { status: 500 }
      );
    }

    // Converter o agente criado
    const formattedAgent = dbAgentToAgent(data);

    return NextResponse.json(formattedAgent, { status: 201 });
  } catch (error) {
    console.error('Error in create agent API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar agente existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    // Validar ícone se fornecido
    if (body.icon_name && !ICON_MAP[body.icon_name]) {
      return NextResponse.json(
        { 
          error: 'Invalid icon_name', 
          available_icons: Object.keys(ICON_MAP) 
        },
        { status: 400 }
      );
    }

    // Preparar dados para atualização
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    // Adicionar apenas campos fornecidos
    const updateableFields = [
      'name', 'description', 'speciality', 'system_prompt',
      'suggestions', 'color', 'icon_name',
      'active', 'premium_tier', 'category'
    ];

    for (const field of updateableFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Atualizar no Supabase
    const { data, error } = await supabase
      .from('agents')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating agent:', error);
      return NextResponse.json(
        { error: 'Failed to update agent', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Converter o agente atualizado
    const formattedAgent = dbAgentToAgent(data);

    return NextResponse.json(formattedAgent);
  } catch (error) {
    console.error('Error in update agent API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Desativar agente (soft delete) ou apagar permanentemente (hard delete)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const permanent = searchParams.get('permanent') === 'true';
    
    if (!id) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    if (permanent) {
      // Hard delete - apaga permanentemente do banco
      const { data, error } = await supabase
        .from('agents')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error permanently deleting agent:', error);
        return NextResponse.json(
          { error: 'Failed to permanently delete agent', details: error.message },
          { status: 500 }
        );
      }

      if (!data) {
        return NextResponse.json(
          { error: 'Agent not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ 
        message: 'Agent permanently deleted successfully',
        agent: data 
      });
    } else {
      // Soft delete - apenas desativa o agente
      const { data, error } = await supabase
        .from('agents')
        .update({ 
          active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error deactivating agent:', error);
        return NextResponse.json(
          { error: 'Failed to deactivate agent', details: error.message },
          { status: 500 }
        );
      }

      if (!data) {
        return NextResponse.json(
          { error: 'Agent not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ 
        message: 'Agent deactivated successfully',
        agent: data 
      });
    }
  } catch (error) {
    console.error('Error in delete agent API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}