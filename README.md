# 🚀 ChatGPT Project - Sistema de Agentes Especializados

## 🎯 Visão Geral
Sistema de chat com 12 agentes especializados, cada um com expertise única em diferentes áreas criativas. Agora com **sistema avançado de artefatos de texto editáveis**!

## ✨ Novidades da Versão 2.0

### 🎨 Sistema de Artefatos de Texto
- **Editor de texto ao vivo**: Edite documentos criados pelos agentes em tempo real
- **Salvamento automático**: Suas edições são salvas automaticamente
- **Animações suaves**: Transições elegantes ao abrir/fechar artefatos
- **Design responsivo**: Funciona perfeitamente em desktop e mobile

### 📝 Agentes com Suporte a Artefatos
Os seguintes agentes agora podem criar documentos editáveis:
- **Content Creator**: Artigos, blogs, guias
- **Copywriter**: Textos de vendas, copies persuasivas
- **UX Writer**: Microtextos, interfaces
- **Scriptwriter**: Roteiros completos

## 🛠️ Tecnologias Utilizadas
- **Next.js 14**: Framework React com App Router
- **TypeScript**: Type safety em todo o projeto
- **Tailwind CSS**: Estilização utility-first
- **Framer Motion**: Animações fluidas e interativas
- **Radix UI**: Componentes acessíveis
- **date-fns**: Formatação de datas
- **usehooks-ts**: Hooks customizados

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação
```bash
# Clonar o repositório
git clone [seu-repositorio]

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## 🎮 Como Usar

### 1. Seleção de Agente
- Escolha um dos 12 agentes especializados na tela inicial
- Cada agente tem expertise única e personalidade própria

### 2. Tela de Boas-vindas
- Veja sugestões personalizadas do agente
- Comece com uma sugestão ou digite sua própria mensagem

### 3. Chat Interativo
- Converse naturalmente com o agente
- Agentes de conteúdo criarão documentos editáveis automaticamente

### 4. Edição de Artefatos
- Clique em "Clique para editar" nos documentos criados
- Editor abre com animação suave
- Edite o texto em tempo real
- Salvamento automático com indicador visual
- Baixe ou copie o conteúdo finalizado

## 📂 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   └── page.tsx           # Página principal
├── artifacts/             # Sistema de artefatos
│   └── text/             # Editor de texto
├── components/           # Componentes React
│   ├── agents/          # Componentes de agentes
│   ├── chat/            # Componentes de chat
│   ├── layout/          # Layout components
│   └── ui/              # Componentes UI base
├── data/                # Dados estáticos
│   └── agents.tsx       # Definição dos 12 agentes
├── hooks/               # Hooks customizados
├── lib/                 # Utilitários
└── types/               # TypeScript types
```

## 🎨 Features Principais

### Agentes Especializados
- **Assistente Geral**: Conhecimento amplo
- **Dev Assistant**: Programação e desenvolvimento
- **Design Pro**: Design e UX/UI
- **Business Analyst**: Análise de dados
- **Roteirista Pro**: Criação de roteiros
- **Copy Expert**: Textos persuasivos
- **UX Writer**: Microtextos e UX
- **Social Media**: Conteúdo para redes
- **Content Creator**: Artigos e blogs
- **Video Creator**: Produção audiovisual
- **Marketing Pro**: Estratégias de marketing
- **Creative Director**: Direção criativa

### Interface Rica
- Animações Framer Motion em todos elementos
- Gradientes únicos por agente
- Modo escuro nativo
- Responsivo para todas telas
- Feedback visual em todas ações

### Sistema de Chat
- Mensagens com markdown formatting
- Indicador de digitação animado
- Timestamps em todas mensagens
- Scroll automático suave

## 🔧 Próximas Melhorias
- [ ] Mais tipos de artefatos (código, imagens, planilhas)
- [ ] Histórico de versões dos documentos
- [ ] Colaboração em tempo real
- [ ] Exportação em múltiplos formatos
- [ ] Integração com IA real

## 📄 Licença
MIT License - sinta-se livre para usar em seus projetos!

---

**Desenvolvido com 💜 por [Seu Nome]**