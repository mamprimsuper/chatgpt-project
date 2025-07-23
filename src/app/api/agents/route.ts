import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { dbAgentToAgent } from '@/types';
import { processAgentsWithIcons } from '@/lib/agent-utils';
import { ICON_MAP } from '@/lib/icons';

// GET - Listar agentes
export async function GET() {
  try {
    const { data: agents, error } = await supabase
      .from('agents')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: true });

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
    
    // Processar ícones
    const agentsWithIcons = processAgentsWithIcons(formattedAgents);

    console.log('Agents processed:', agentsWithIcons.length);

    return NextResponse.json(agentsWithIcons);
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
      greeting: body.greeting || `Olá! Sou ${body.name}. Como posso ajudar você hoje?`,
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

    // Converter e processar o agente criado
    const formattedAgent = dbAgentToAgent(data);
    const [agentWithIcon] = processAgentsWithIcons([formattedAgent]);

    return NextResponse.json(agentWithIcon, { status: 201 });
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
      'greeting', 'suggestions', 'color', 'icon_name',
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

    // Converter e processar o agente atualizado
    const formattedAgent = dbAgentToAgent(data);
    const [agentWithIcon] = processAgentsWithIcons([formattedAgent]);

    return NextResponse.json(agentWithIcon);
  } catch (error) {
    console.error('Error in update agent API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Desativar agente (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

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
      console.error('Error deleting agent:', error);
      return NextResponse.json(
        { error: 'Failed to delete agent', details: error.message },
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
  } catch (error) {
    console.error('Error in delete agent API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}