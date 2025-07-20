import { 
  Lightbulb,
  Code,
  PenTool,
  BarChart3,
  Camera,
  Edit3,
  Type,
  Share2,
  BookOpen,
  Video,
  Megaphone,
  Palette
} from "lucide-react";
import { Agent } from "@/types";

export const AGENTS: Agent[] = [
  {
    id: "general",
    name: "Assistente Geral",
    description: "Ajudo com perguntas gerais e tarefas do dia a dia",
    speciality: "Conhecimento geral",
    icon: <Lightbulb className="w-5 h-5" />,
    color: "from-blue-500 to-purple-600",
    greeting: "Olá! Sou seu assistente geral. Posso ajudar com qualquer dúvida ou tarefa. O que você gostaria de saber?",
    suggestions: [
      "Explicar um conceito científico complexo",
      "Ajudar com redação de textos", 
      "Resolver problemas matemáticos",
      "Dar conselhos sobre produtividade"
    ]
  },
  {
    id: "developer",
    name: "Dev Assistant",
    description: "Especialista em programação e desenvolvimento",
    speciality: "Desenvolvimento",
    icon: <Code className="w-5 h-5" />,
    color: "from-green-500 to-emerald-600",
    greeting: "E aí, dev! 👨‍💻 Pronto para programar? Posso ajudar com código, arquitetura, debugging e muito mais!",
    suggestions: [
      "Criar uma API REST com Node.js",
      "Implementar autenticação JWT",
      "Otimizar performance de React",
      "Revisar código e encontrar bugs"
    ]
  },
  {
    id: "designer",
    name: "Design Pro", 
    description: "Especializado em design, UX/UI e branding",
    speciality: "Design & UX",
    icon: <PenTool className="w-5 h-5" />,
    color: "from-pink-500 to-rose-600",
    greeting: "Oi! Sou especialista em design. Vamos criar algo incrível? Posso ajudar com UX, UI, branding e criatividade!",
    suggestions: [
      "Criar wireframes para app mobile",
      "Definir paleta de cores moderna",
      "Melhorar UX de um formulário",
      "Gerar ideias para logo da marca"
    ]
  },
  {
    id: "analyst",
    name: "Business Analyst",
    description: "Focado em análise de dados e estratégia", 
    speciality: "Análise & Estratégia",
    icon: <BarChart3 className="w-5 h-5" />,
    color: "from-orange-500 to-amber-600",
    greeting: "Olá! Sou seu analista de negócios. Vamos analisar dados, criar estratégias e otimizar processos!",
    suggestions: [
      "Analisar métricas de engajamento",
      "Criar estratégia de marketing digital",
      "Otimizar funil de vendas",
      "Gerar relatório de performance"
    ]
  },
  {
    id: "scriptwriter",
    name: "Roteirista Pro",
    description: "Criação de roteiros para vídeos, filmes e teatro",
    speciality: "Roteiros & Scripts",
    icon: <Camera className="w-5 h-5" />,
    color: "from-purple-500 to-indigo-600",
    greeting: "Ação! 🎬 Sou especialista em roteiros. Vamos criar histórias incríveis juntos!",
    suggestions: [
      "Escrever roteiro para vídeo YouTube",
      "Criar estrutura de filme curta",
      "Desenvolver diálogos naturais",
      "Adaptar história para roteiro"
    ]
  },
  {
    id: "copywriter",
    name: "Copy Expert",
    description: "Textos persuasivos para vendas e marketing",
    speciality: "Copywriting",
    icon: <Edit3 className="w-5 h-5" />,
    color: "from-red-500 to-pink-600",
    greeting: "Vamos converter! 💰 Sou especialista em copy que vende. Textos que transformam visitantes em clientes!",
    suggestions: [
      "Criar copy para página de vendas",
      "Escrever email marketing",
      "Desenvolver headlines impactantes",
      "Otimizar CTAs para conversão"
    ]
  },
  {
    id: "uxwriter",
    name: "UX Writer",
    description: "Microtextos e experiência do usuário",
    speciality: "UX Writing",
    icon: <Type className="w-5 h-5" />,
    color: "from-cyan-500 to-blue-600",
    greeting: "Olá! ✨ Sou especialista em UX Writing. Vamos criar textos que guiam e encantam os usuários!",
    suggestions: [
      "Escrever microtextos para app",
      "Criar mensagens de erro amigáveis",
      "Desenvolver onboarding textual",
      "Otimizar labels e botões"
    ]
  },
  {
    id: "social",
    name: "Social Media",
    description: "Conteúdo para redes sociais e engajamento",
    speciality: "Redes Sociais",
    icon: <Share2 className="w-5 h-5" />,
    color: "from-violet-500 to-purple-600",
    greeting: "Hey! 📱 Sou especialista em redes sociais. Vamos criar conteúdo viral e engajar sua audiência!",
    suggestions: [
      "Criar posts para Instagram",
      "Desenvolver estratégia de conteúdo",
      "Escrever captions envolventes",
      "Planejar campanha viral"
    ]
  },
  {
    id: "content",
    name: "Content Creator",
    description: "Artigos, blogs e conteúdo educativo",
    speciality: "Criação de Conteúdo",
    icon: <BookOpen className="w-5 h-5" />,
    color: "from-emerald-500 to-green-600",
    greeting: "Oi! 📝 Sou especialista em conteúdo. Vamos criar artigos e materiais que educam e inspiram!",
    suggestions: [
      "Escrever artigo para blog",
      "Criar guia educativo completo",
      "Desenvolver newsletter",
      "Produzir conteúdo SEO"
    ]
  },
  {
    id: "video",
    name: "Video Creator",
    description: "Criação e edição de vídeos profissionais",
    speciality: "Produção de Vídeo",
    icon: <Video className="w-5 h-5" />,
    color: "from-amber-500 to-orange-600",
    greeting: "Gravando! 🎥 Sou especialista em vídeos. Vamos criar conteúdo audiovisual que marca!",
    suggestions: [
      "Planejar vídeo promocional",
      "Criar conceito para storytelling",
      "Desenvolver storyboard",
      "Otimizar vídeo para plataformas"
    ]
  },
  {
    id: "marketing",
    name: "Marketing Pro",
    description: "Estratégias de marketing e campanhas publicitárias",
    speciality: "Marketing Digital",
    icon: <Megaphone className="w-5 h-5" />,
    color: "from-teal-500 to-cyan-600",
    greeting: "Oi! 📢 Sou especialista em marketing. Vamos criar campanhas que convertem e marcas que ficam na memória!",
    suggestions: [
      "Criar estratégia de lançamento",
      "Desenvolver funil de marketing",
      "Planejar campanha publicitária",
      "Otimizar ROI de campanhas"
    ]
  },
  {
    id: "creative",
    name: "Creative Director",
    description: "Direção criativa e conceitos inovadores",
    speciality: "Direção Criativa",
    icon: <Palette className="w-5 h-5" />,
    color: "from-indigo-500 to-violet-600",
    greeting: "Olá! 🎨 Sou diretor criativo. Vamos transformar ideias em conceitos únicos e impactantes!",
    suggestions: [
      "Criar conceito de campanha criativa",
      "Desenvolver identidade visual",
      "Brainstorm de ideias inovadoras",
      "Direção de arte para projeto"
    ]
  }
];