"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  RefreshCw,
  Users,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { ICON_MAP } from "@/lib/icons";
import { Agent } from "@/types";
import { useAgents } from "@/hooks/use-agents";
import { Header } from "@/components/header";

interface AgentFormData {
  name: string;
  description: string;
  system_prompt: string;
  color: string;
  icon_name: string;
  status: 'active' | 'inactive' | 'coming_soon';
}

const defaultFormData: AgentFormData = {
  name: "",
  description: "",
  system_prompt: "",
  color: "from-blue-500 to-purple-600",
  icon_name: "lightbulb",
  status: 'active'
};

const colorOptions = [
  // Azuis
  "from-blue-500 to-purple-600",
  "from-blue-600 to-indigo-700",
  "from-sky-400 to-blue-600",
  "from-indigo-500 to-blue-600",
  "from-cyan-400 to-blue-500",
  
  // Verdes
  "from-green-500 to-teal-600",
  "from-emerald-400 to-green-600",
  "from-lime-400 to-green-500",
  "from-teal-500 to-cyan-600",
  "from-green-600 to-emerald-700",
  
  // Vermelhos e Rosas
  "from-red-500 to-pink-600",
  "from-pink-500 to-rose-600",
  "from-rose-400 to-pink-600",
  "from-red-600 to-orange-600",
  "from-fuchsia-500 to-pink-600",
  
  // Amarelos e Laranjas
  "from-yellow-500 to-orange-600",
  "from-orange-500 to-red-600",
  "from-amber-400 to-orange-500",
  "from-yellow-400 to-amber-500",
  "from-orange-400 to-red-500",
  
  // Roxos
  "from-purple-500 to-pink-600",
  "from-violet-500 to-purple-600",
  "from-indigo-600 to-purple-700",
  "from-purple-600 to-fuchsia-700",
  "from-violet-400 to-purple-600",
  
  // Tons neutros premium
  "from-slate-600 to-gray-700",
  "from-gray-600 to-slate-700",
  "from-zinc-600 to-gray-700",
  "from-stone-600 to-neutral-700",
  "from-neutral-600 to-stone-700",
  
  // Gradientes especiais
  "from-rose-400 via-fuchsia-500 to-indigo-500",
  "from-blue-400 via-purple-500 to-purple-600",
  "from-green-400 via-cyan-500 to-blue-500",
  "from-yellow-400 via-red-500 to-pink-500",
  "from-purple-400 via-pink-500 to-red-500",
  "from-indigo-400 via-purple-500 to-pink-500",
  
  // Tons mais suaves
  "from-blue-300 to-blue-500",
  "from-green-300 to-green-500",
  "from-purple-300 to-purple-500",
  "from-pink-300 to-pink-500",
  "from-yellow-300 to-yellow-500",
  
  // Tons mais intensos
  "from-blue-700 to-purple-800",
  "from-green-700 to-emerald-800",
  "from-red-700 to-pink-800",
  "from-orange-700 to-red-800",
  "from-purple-700 to-fuchsia-800"
];

export default function AdminPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState<AgentFormData>(defaultFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [showSystemPrompt, setShowSystemPrompt] = useState<string | null>(null);

  const { agents, loading, error, refetch } = useAgents(true); // Incluir agentes inativos para admin

  const handleInputChange = (field: keyof AgentFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };



  const openCreateForm = () => {
    setEditingAgent(null);
    setFormData(defaultFormData);
    setIsFormOpen(true);
  };

  const openEditForm = (agent: Agent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      description: agent.description || "",
      system_prompt: agent.systemPrompt || "",
      color: agent.color,
      icon_name: agent.iconName || "lightbulb",
      status: agent.active === false ? 'inactive' : 
              (agent.active as any) === 'coming_soon' ? 'coming_soon' : 'active'
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingAgent(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const method = editingAgent ? 'PUT' : 'POST';
      
      // Converter status para formato do backend
      const backendData = {
        ...formData,
        active: formData.status === 'active' ? true : 
                formData.status === 'inactive' ? false : 
                'coming_soon',
        suggestions: [
          'Como posso começar?',
          'Me dê algumas dicas',
          'O que você pode fazer?',
          'Me ajude com um projeto'
        ],
        category: 'general',
        premium_tier: 0
      };
      
      const body = editingAgent 
        ? { ...backendData, id: editingAgent.id }
        : backendData;

      const response = await fetch('/api/agents', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to save agent');
      }

      await refetch();
      closeForm();
    } catch (error) {
      console.error('Error saving agent:', error);
      alert('Erro ao salvar agente. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (agentId: string) => {
    if (!confirm('Tem certeza que deseja deletar este agente?')) return;

    try {
      const response = await fetch(`/api/agents?id=${agentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete agent');
      }

      await refetch();
    } catch (error) {
      console.error('Error deleting agent:', error);
      alert('Erro ao deletar agente. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Carregando agentes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Erro: {error}</p>
          <Button onClick={refetch}>Tentar Novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Estatísticas */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total de Agentes</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{agents.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Ativos</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {agents.filter(a => a.active === true).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 rounded-lg p-4 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500 rounded-lg">
                <XCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">Inativos</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {agents.filter(a => a.active === false).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Em Breve</p>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                  {agents.filter(a => a.active === 'coming_soon').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {agents.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhum agente encontrado</h3>
            <p className="text-muted-foreground mb-6">Comece criando seu primeiro agente especializado</p>
            <Button onClick={openCreateForm} className="gap-2">
              <Plus className="w-4 h-4" />
              Criar Primeiro Agente
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {agents.map((agent, index) => {
              const IconComponent = ICON_MAP[agent.iconName || 'lightbulb'];
              
              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:shadow-black/5 hover:border-border/80 transition-all duration-200 group"
                >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${agent.color} text-white`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{agent.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{agent.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      onClick={() => setShowSystemPrompt(
                        showSystemPrompt === agent.id ? null : agent.id
                      )}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      {showSystemPrompt === agent.id ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      onClick={() => openEditForm(agent)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(agent.id)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    agent.active === true ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                    agent.active === false ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {agent.active === true ? '✅ Ativo' : 
                     agent.active === false ? '❌ Inativo' : 
                     '🚧 Em Breve'}
                  </span>
                </div>

                {showSystemPrompt === agent.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-3 bg-muted rounded text-xs"
                  >
                    <strong>System Prompt:</strong>
                    <p className="mt-1 whitespace-pre-wrap">{agent.systemPrompt}</p>
                  </motion.div>
                )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold">
                {editingAgent ? 'Editar Agente' : 'Criar Novo Agente'}
              </h2>
              <Button onClick={closeForm} variant="ghost" size="icon">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="h-[calc(90vh-120px)]">
              <div className="p-6">
                {/* Preview do Agente */}
                {(formData.name || formData.icon_name || formData.color) && (
                  <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
                    <h3 className="text-sm font-medium mb-3">Preview:</h3>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${formData.color} text-white`}>
                        {(() => {
                          const IconComponent = ICON_MAP[formData.icon_name];
                          return <IconComponent className="w-5 h-5" />;
                        })()}
                      </div>
                      <div>
                        <h4 className="font-semibold">{formData.name || 'Novo Agente'}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {formData.description || 'Descrição do agente...'}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          formData.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                          formData.status === 'inactive' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                        }`}>
                          {formData.status === 'active' ? '✅ Ativo' : 
                           formData.status === 'inactive' ? '❌ Inativo' : 
                           '🚧 Em Breve'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-6">
                {/* Nome */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Nome *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ex: Assistente de Marketing"
                    required
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Descrição</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Breve descrição do que o agente faz"
                    rows={2}
                  />
                </div>

                {/* System Prompt */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Prompt do Sistema *</label>
                    <span className={`text-xs px-2 py-1 rounded ${
                      formData.system_prompt.length < 50 
                        ? 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400' 
                        : formData.system_prompt.length < 200 
                        ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-400'
                        : 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400'
                    }`}>
                      {formData.system_prompt.length} caracteres
                    </span>
                  </div>
                  <Textarea
                    value={formData.system_prompt}
                    onChange={(e) => handleInputChange('system_prompt', e.target.value)}
                    placeholder="Instruções detalhadas para o agente de IA sobre como se comportar..."
                    rows={6}
                    required
                    className="resize-none"
                  />
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      💡 <strong>Dicas para um bom prompt:</strong>
                    </p>
                    <ul className="text-xs text-muted-foreground ml-4 space-y-1">
                      <li>• Seja específico sobre a especialidade do agente</li>
                      <li>• Defina o tom de voz (formal, casual, técnico, etc.)</li>
                      <li>• Inclua exemplos de como o agente deve responder</li>
                      <li>• Mencione limitações ou coisas que NÃO deve fazer</li>
                      <li>• Use pelo menos 200 caracteres para maior efetividade</li>
                    </ul>
                  </div>
                </div>

                {/* Ícone Visual */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium">Ícone</label>
                    <span className="text-xs text-muted-foreground">
                      {Object.keys(ICON_MAP).length} ícones disponíveis
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto border border-border rounded-lg p-3">
                    <div className="grid grid-cols-8 gap-2">
                      {Object.entries(ICON_MAP).map(([iconName, IconComponent]) => (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => handleInputChange('icon_name', iconName)}
                          className={`p-3 rounded-lg border-2 transition-all hover:scale-105 group ${
                            formData.icon_name === iconName 
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-md' 
                              : 'border-border hover:border-blue-300 hover:bg-muted/50'
                          }`}
                          title={iconName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        >
                          <IconComponent className={`w-5 h-5 mx-auto transition-colors ${
                            formData.icon_name === iconName 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : 'text-foreground group-hover:text-blue-600'
                          }`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Ícone selecionado: <span className="font-mono bg-muted px-1 rounded">{formData.icon_name}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    💡 Dica: Passe o mouse sobre os ícones para ver seus nomes
                  </p>
                </div>

                {/* Cor do Gradiente */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Cor do Gradiente</label>
                  <div className="max-h-64 overflow-y-auto border border-border rounded-lg p-3">
                    <div className="grid grid-cols-6 gap-2">
                      {colorOptions.map((color, index) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => handleInputChange('color', color)}
                          className={`h-10 rounded-lg bg-gradient-to-br ${color} border-2 transition-all hover:scale-105 ${
                            formData.color === color ? 'border-white shadow-lg ring-2 ring-blue-500' : 'border-transparent hover:border-white/50'
                          }`}
                          title={`Gradiente ${index + 1}: ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Gradiente selecionado: <span className="font-mono text-xs bg-muted px-1 rounded">{formData.color}</span>
                  </p>
                </div>

                {/* Status */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Status</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleInputChange('status', 'active')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.status === 'active' 
                          ? 'border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300' 
                          : 'border-border hover:border-green-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-lg mb-1">✅</div>
                        <div className="text-sm font-medium">Ativo</div>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleInputChange('status', 'inactive')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.status === 'inactive' 
                          ? 'border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300' 
                          : 'border-border hover:border-red-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-lg mb-1">❌</div>
                        <div className="text-sm font-medium">Inativo</div>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleInputChange('status', 'coming_soon')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.status === 'coming_soon' 
                          ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300' 
                          : 'border-border hover:border-yellow-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-lg mb-1">🚧</div>
                        <div className="text-sm font-medium">Em Breve</div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={isLoading} className="gap-2">
                    <Save className="w-4 h-4" />
                    {isLoading ? 'Salvando...' : 'Salvar'}
                  </Button>
                  <Button type="button" onClick={closeForm} variant="outline">
                    Cancelar
                  </Button>
                </div>
              </form>
            </ScrollArea>
          </motion.div>
        </div>
      )}
    </div>
  );
} 