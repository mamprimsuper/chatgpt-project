"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu } from "lucide-react";

// Components
import { MessageItem } from "@/components/chat/MessageItem";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { AgentGrid } from "@/components/agents/AgentGrid";
import { AgentWelcome } from "@/components/agents/AgentWelcome";
import { Sidebar } from "@/components/layout/Sidebar";
import { Artifact } from "@/components/artifact";

// Hooks
import { useArtifact } from "@/hooks/use-artifact";

// Types and Data
import { Message, Agent, Chat, AppState } from "@/types";
import { AGENTS } from "@/data/agents";

export default function ChatPage() {
  const [appState, setAppState] = useState<AppState>("agent-selection");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Novo sistema de artefatos
  const { artifact, setArtifact, showArtifact, hideArtifact } = useArtifact();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectArtifactType = (content: string, agentId?: string): { artifact: any; processedContent: string } | null => {
    const lowerContent = content.toLowerCase();
    
    // Detectar conteúdo de texto para agentes específicos
    if (agentId && ['content', 'copywriter', 'uxwriter', 'scriptwriter'].includes(agentId)) {
      // Verificar se tem conteúdo substancial de texto
      if (content.length > 300 && (
        lowerContent.includes("escrevi") ||
        lowerContent.includes("criei") ||
        lowerContent.includes("texto") ||
        lowerContent.includes("copy") ||
        lowerContent.includes("roteiro") ||
        lowerContent.includes("conteúdo") ||
        lowerContent.includes("artigo") ||
        lowerContent.includes("## ") ||
        lowerContent.includes("### ")
      )) {
        // Extrair o título do conteúdo
        let title = "Documento de Texto";
        const titleMatch = content.match(/##\s+(.+?)[\n\r]/);
        if (titleMatch) {
          title = titleMatch[1].replace(/[*_]/g, '').trim();
        }

        // Processar o conteúdo para o artefato
        let artifactContent = content;
        
        // Se o conteúdo tem estrutura de documento, preservar
        if (content.includes("##") || content.includes("###")) {
          artifactContent = content;
        }

        return {
          artifact: {
            id: Date.now().toString(),
            type: "text",
            title: title,
            content: artifactContent
          },
          processedContent: content
        };
      }
    }
    
    // Detectar código (manter lógica original)
    if (lowerContent.includes("```") || 
        lowerContent.includes("function") || 
        lowerContent.includes("const ") ||
        lowerContent.includes("import ") ||
        lowerContent.includes("class ") ||
        lowerContent.includes("<div") ||
        lowerContent.includes("def ") ||
        lowerContent.includes("package ")) {
      
      let language = "javascript";
      if (lowerContent.includes("python") || lowerContent.includes("def ")) language = "python";
      if (lowerContent.includes("react") || lowerContent.includes("jsx")) language = "jsx";
      if (lowerContent.includes("html") || lowerContent.includes("<div")) language = "html";
      if (lowerContent.includes("css")) language = "css";
      
      return {
        artifact: {
          id: Date.now().toString(),
          type: language === "jsx" ? "react" : "code",
          title: `Código ${language.toUpperCase()}`,
          content: content,
          language
        },
        processedContent: content
      };
    }
    
    return null;
  };

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setAppState("agent-welcome");
  };

  const handleStartChat = (initialMessage?: string) => {
    if (!selectedAgent) return;
    
    const welcomeMessage: Message = {
      id: "1",
      content: selectedAgent.greeting,
      role: "assistant", 
      timestamp: new Date(),
    };
    
    const userMessages: Message[] = [];
    if (initialMessage) {
      userMessages.push({
        id: "0",
        content: initialMessage,
        role: "user",
        timestamp: new Date(),
      });
    }
    
    setMessages([...userMessages, welcomeMessage]);
    setAppState("chat");
    
    if (initialMessage) {
      // Simular resposta para a mensagem inicial
      setTimeout(() => {
        handleAIResponse(initialMessage);
      }, 800);
    }
  };

  const handleAIResponse = (userMessage: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      let responseContent = "";
      
      // Respostas específicas por agente com artefatos de texto
      if (selectedAgent?.id === "content") {
        if (userMessage.toLowerCase().includes("artigo") || userMessage.toLowerCase().includes("blog")) {
          responseContent = "## 📝 Artigo criado com sucesso!\n\nVou criar um artigo completo e otimizado para você.\n\n---\n\n## Como a Inteligência Artificial está Transformando o Mundo dos Negócios\n\n### Introdução\n\nA Inteligência Artificial (IA) não é mais uma promessa futurista - é uma realidade presente que está revolucionando a forma como empresas operam, competem e criam valor. Desde startups inovadoras até gigantes corporativos, organizações de todos os tamanhos estão descobrindo o poder transformador da IA.\n\n### O Impacto nos Diferentes Setores\n\n**1. Varejo e E-commerce**\nA personalização alimentada por IA está redefinindo a experiência de compra. Algoritmos inteligentes analisam padrões de comportamento, histórico de compras e preferências para criar recomendações ultra-personalizadas.\n\n**2. Saúde e Medicina**\nDiagnósticos assistidos por IA estão salvando vidas. Machine learning pode detectar padrões em exames que o olho humano poderia perder, acelerando diagnósticos e melhorando tratamentos.\n\n**3. Finanças**\nDetecção de fraudes, análise de risco e trading algorítmico são apenas algumas das aplicações que estão tornando o setor financeiro mais seguro e eficiente.\n\n### Benefícios Tangíveis para Empresas\n\n- **Redução de Custos**: Automação de processos repetitivos\n- **Aumento de Produtividade**: Funcionários focam em tarefas estratégicas\n- **Melhoria na Tomada de Decisão**: Insights baseados em dados\n- **Experiência do Cliente Aprimorada**: Atendimento 24/7 e personalizado\n\n### Desafios e Considerações Éticas\n\nApesar dos benefícios, a implementação de IA traz desafios importantes:\n\n1. **Privacidade de Dados**: Como proteger informações sensíveis?\n2. **Viés Algorítmico**: Garantir que a IA seja justa e inclusiva\n3. **Desemprego Tecnológico**: Requalificação da força de trabalho\n4. **Transparência**: Explicabilidade das decisões da IA\n\n### O Futuro da IA nos Negócios\n\nO futuro promete ainda mais integração entre humanos e máquinas. Conceitos como:\n\n- **IA Generativa**: Criação de conteúdo original\n- **Edge AI**: Processamento local para maior velocidade\n- **IA Quântica**: Poder computacional exponencial\n- **AutoML**: IA que cria e otimiza outros modelos de IA\n\n### Conclusão\n\nA questão não é mais se sua empresa deve adotar IA, mas como e quando. As organizações que abraçarem essa transformação de forma estratégica e ética estarão melhor posicionadas para prosperar na economia digital.\n\n### Call to Action\n\nPronto para iniciar sua jornada de transformação digital? Comece identificando processos que podem ser otimizados e busque parceiros especializados para uma implementação bem-sucedida.\n\n---\n\n**Palavras-chave**: Inteligência Artificial, Transformação Digital, Inovação Empresarial, Machine Learning, Automação\n\n**Meta Description**: Descubra como a Inteligência Artificial está revolucionando os negócios e como sua empresa pode se beneficiar dessa transformação tecnológica.";
        } else {
          responseContent = "## 📝 **Content Creator** pronto para criar!\n\nPosso criar diversos tipos de conteúdo para você:\n\n- **Artigos de Blog**: SEO-otimizados e envolventes\n- **E-books**: Conteúdo rico e estruturado\n- **Newsletters**: Comunicação efetiva com sua audiência\n- **Guias e Tutoriais**: Conteúdo educativo detalhado\n- **Case Studies**: Histórias de sucesso convincentes\n\n💡 **Dica**: Me diga sobre qual tema você gostaria de criar conteúdo e eu preparo algo incrível!";
        }
      } else if (selectedAgent?.id === "copywriter") {
        if (userMessage.toLowerCase().includes("copy") || userMessage.toLowerCase().includes("venda")) {
          responseContent = "## 💰 Copy de Alta Conversão Criado!\n\nAqui está um copy persuasivo que vai converter:\n\n---\n\n## 🔥 Descubra o Segredo que Está Transformando Negócios Comuns em Máquinas de Vendas\n\n### ⚡ Atenção Empreendedor!\n\n**Você está cansado de:**\n- ❌ Ver seus concorrentes crescendo enquanto você fica para trás?\n- ❌ Investir em marketing sem ver resultados reais?\n- ❌ Perder vendas por não saber se comunicar com seu público?\n\n### 🎯 A Solução Que Você Procurava\n\nApresento o **Sistema de Copywriting Magnético** - a metodologia comprovada que já ajudou mais de 3.000 empresários a:\n\n✅ **Triplicar suas vendas** em menos de 90 dias\n✅ **Criar mensagens irresistíveis** que seu público não consegue ignorar\n✅ **Dominar a arte da persuasão** ética e eficaz\n✅ **Economizar milhares** em agências caras\n\n### 📊 Resultados Reais de Clientes Reais\n\n> \"Aumentei meu faturamento em 347% aplicando as técnicas do Sistema. É simplesmente revolucionário!\" - Maria Silva, CEO da TechStart\n\n> \"Finalmente entendi como falar a língua do meu cliente. Minhas taxas de conversão explodiram!\" - João Santos, E-commerce\n\n### 🎁 Bônus Exclusivos (Apenas Hoje!)\n\n**Comprando agora, você recebe GRÁTIS:**\n1. 📚 E-book: \"101 Headlines que Vendem\" (Valor: R$ 197)\n2. 🎥 Masterclass: \"Gatilhos Mentais na Prática\" (Valor: R$ 297)\n3. 📝 50 Templates de Copy Prontos (Valor: R$ 497)\n4. 👥 Acesso ao Grupo VIP no Telegram (Valor: Inestimável)\n\n### ⏰ Oferta Por Tempo Limitado!\n\n~~De R$ 1.997~~ \n**Por apenas 12x de R$ 97,90**\n\nOu R$ 997 à vista (economia de R$ 1.000!)\n\n### 🛡️ Garantia Tripla de 30 Dias\n\n1. **Garantia de Satisfação**: Não gostou? Devolvemos 100% do valor\n2. **Garantia de Resultados**: Se não ver resultados, devolvemos em dobro\n3. **Garantia de Suporte**: Acompanhamento personalizado por 90 dias\n\n### ⚡ ATENÇÃO: Restam Apenas 17 Vagas!\n\n[QUERO TRANSFORMAR MEU NEGÓCIO AGORA]\n\n### ❓ Perguntas Frequentes\n\n**Para quem é este sistema?**\nEmpreendedores, profissionais de marketing, freelancers e qualquer pessoa que queira vender mais.\n\n**Preciso ter experiência?**\nNão! O sistema foi criado para iniciantes e avançados.\n\n**Quanto tempo leva para ver resultados?**\nMuitos alunos relatam resultados na primeira semana!\n\n### 🚨 Último Aviso!\n\nA cada minuto que você espera, seus concorrentes estão fechando as vendas que poderiam ser suas.\n\n**Não deixe essa oportunidade passar!**\n\n[SIM! QUERO DOMINAR O COPYWRITING]\n\n*P.S.: Lembre-se, com nossa garantia tripla, você não tem nada a perder e um negócio transformado a ganhar!*";
        } else {
          responseContent = "## 💰 **Copy Expert** aqui!\n\nSou especialista em criar textos que vendem. Posso ajudar com:\n\n- **Copy de Vendas**: Páginas que convertem\n- **Email Marketing**: Sequências que nutrem e vendem\n- **Anúncios**: Facebook, Google, Instagram\n- **Scripts de Vendas**: Abordagens que fecham negócios\n- **Headlines**: Títulos que param o scroll\n\nQual tipo de copy você precisa? Me dê detalhes sobre seu produto/serviço!";
        }
      } else if (selectedAgent?.id === "uxwriter") {
        if (userMessage.toLowerCase().includes("app") || userMessage.toLowerCase().includes("interface")) {
          responseContent = "## ✨ Microtextos UX Criados!\n\nAqui está um conjunto completo de microtextos para sua interface:\n\n---\n\n## 📱 Sistema de Microtextos para App\n\n### Onboarding\n\n**Tela de Boas-vindas**\n```\nTítulo: Bem-vindo ao AppName! 👋\nSubtítulo: Vamos configurar tudo em 3 passos rápidos\nBotão: Começar agora\nLink: Já tenho uma conta\n```\n\n**Permissões**\n```\nNotificações:\n\"Receba atualizações importantes\"\n\"Prometemos não exagerar 🤝\"\n[Permitir] [Agora não]\n\nLocalização:\n\"Encontre experiências próximas a você\"\n\"Seus dados estão seguros conosco\"\n[Ativar localização] [Pular]\n```\n\n### Formulários\n\n**Campos de Input**\n```\nNome:\nPlaceholder: \"Como podemos te chamar?\"\nErro: \"Ops! Esqueceu de preencher seu nome\"\n\nEmail:\nPlaceholder: \"seu@email.com\"\nErro: \"Hmm, esse email parece estranho 🤔\"\nSucesso: \"Email válido ✓\"\n\nSenha:\nPlaceholder: \"Crie uma senha segura\"\nDica: \"Use 8+ caracteres, com números e símbolos\"\nForça: \"Fraca | Boa | Excelente! 💪\"\n```\n\n### Mensagens de Estado\n\n**Carregando**\n```\n\"Preparando tudo para você...\"\n\"Quase lá! Só mais um segundo...\"\n\"Organizando as coisas...\"\n```\n\n**Estados Vazios**\n```\nSem resultados:\n\"Nada por aqui... ainda! 🌱\"\n\"Que tal explorar outras opções?\"\n[Descobrir mais]\n\nSem conexão:\n\"Parece que você está offline 📡\"\n\"Verifique sua conexão e tente novamente\"\n[Tentar novamente]\n```\n\n### Feedback e Confirmações\n\n**Sucesso**\n```\n\"Feito! 🎉\"\n\"Salvamos suas alterações\"\n\"Tudo certo por aqui ✓\"\n\"Sucesso! Você arrasou 🚀\"\n```\n\n**Avisos**\n```\n\"Tem certeza? Essa ação não pode ser desfeita\"\n\"Atenção: Você tem alterações não salvas\"\n\"Último aviso antes de continuar\"\n```\n\n### Call-to-Actions\n\n**Botões Principais**\n```\nAção positiva: \"Vamos lá\" | \"Continuar\" | \"Confirmar\"\nAção negativa: \"Agora não\" | \"Cancelar\" | \"Voltar\"\nAção neutra: \"Saiba mais\" | \"Ver detalhes\" | \"Explorar\"\n```\n\n### Notificações Push\n\n```\n🎯 \"João, você tem 3 novas oportunidades!\"\n💬 \"Maria respondeu sua mensagem\"\n🔥 \"Oferta especial: 50% off só hoje!\"\n⏰ \"Lembrete: Sua tarefa vence em 1h\"\n```\n\n### Tooltips e Ajuda\n\n```\nℹ️ \"Dica: Arraste para reorganizar\"\n💡 \"Você sabia? Pode fazer isso mais rápido com...\"\n❓ \"Precisa de ajuda? Estamos aqui\"\n```\n\n### Tom de Voz\n\n**Princípios:**\n- Conversacional mas profissional\n- Empático e humano\n- Claro e direto\n- Positivo e encorajador\n\n---\n\n💡 **Dicas de Implementação:**\n- Teste A/B diferentes versões\n- Mantenha consistência em todo o app\n- Adapte para o contexto do usuário\n- Sempre ofereça uma saída clara";
        } else {
          responseContent = "## ✨ **UX Writer** especialista!\n\nCrio microtextos que guiam e encantam usuários:\n\n- **Onboarding**: Primeiras impressões perfeitas\n- **Mensagens de Erro**: Transformo frustrações em sorrisos\n- **CTAs**: Botões que usuários querem clicar\n- **Formulários**: Campos que se preenchem sozinhos\n- **Notificações**: Comunicação no momento certo\n\nQual interface você está criando? Vamos deixá-la mais humana!";
        }
      } else if (selectedAgent?.id === "scriptwriter") {
        if (userMessage.toLowerCase().includes("roteiro") || userMessage.toLowerCase().includes("vídeo")) {
          responseContent = "## 🎬 Roteiro Profissional Criado!\n\nAqui está seu roteiro completo:\n\n---\n\n## ROTEIRO: \"O Produto Que Vai Mudar Sua Vida\"\n**Duração:** 2 minutos\n**Formato:** Vídeo para YouTube/Redes Sociais\n\n### 🎬 ABERTURA (0:00 - 0:10)\n\n**[VISUAL]** *Close no rosto do apresentador com expressão intrigada*\n\n**[ÁUDIO]** *Música de suspense suave*\n\n**APRESENTADOR:** \n\"Você já parou para pensar quanto tempo perde todos os dias com [problema do público]? E se eu te dissesse que existe uma solução que pode te devolver 2 horas por dia?\"\n\n**[VISUAL]** *Corte rápido para b-roll do problema*\n\n### 📍 INTRODUÇÃO (0:10 - 0:25)\n\n**[VISUAL]** *Apresentador em plano médio, ambiente clean*\n\n**APRESENTADOR:**\n\"Oi! Eu sou [Nome] e no vídeo de hoje vou te mostrar como [benefício principal]. Mas antes, se inscreve no canal e ativa o sininho!\"\n\n**[VISUAL]** *Animação subscribe + sino*\n\n**[TRANSIÇÃO]** *Whoosh*\n\n### 🎯 PROBLEMA (0:25 - 0:45)\n\n**[VISUAL]** *Montagem rápida mostrando frustrações*\n\n**APRESENTADOR (V.O.):**\n\"Vamos ser honestos... [descrever dor do público em detalhes]. É frustrante, eu sei. Eu também passava por isso até descobrir...\"\n\n**[VISUAL]** *Revelar produto com zoom dramático*\n\n### 💡 SOLUÇÃO (0:45 - 1:20)\n\n**[VISUAL]** *Demonstração do produto em ação*\n\n**APRESENTADOR:**\n\"Este é o [Nome do Produto]. Veja como funciona:\"\n\n**[SEQUÊNCIA DE DEMONSTRAÇÃO]**\n1. *Close nas features principais*\n2. *Slow motion nos momentos-chave*\n3. *Antes x Depois split screen*\n\n**APRESENTADOR:**\n\"Em apenas [tempo], você consegue [resultado]. Simples assim!\"\n\n### 🌟 BENEFÍCIOS (1:20 - 1:40)\n\n**[VISUAL]** *Bullet points animados aparecem*\n\n**APRESENTADOR:**\n\"Com o [Produto] você vai:\"\n- ✅ [Benefício 1 - mais importante]\n- ✅ [Benefício 2 - economiza tempo/dinheiro]\n- ✅ [Benefício 3 - resultado emocional]\n\n**[VISUAL]** *Depoimento rápido de cliente satisfeito*\n\n### 🎁 OFERTA ESPECIAL (1:40 - 1:50)\n\n**[VISUAL]** *Tela dividida: produto + preço*\n\n**[EFEITO SONORO]** *Sino de notificação*\n\n**APRESENTADOR:**\n\"E tem mais! Usando o código [CÓDIGO] você ganha [desconto/bônus]. Mas corre, é só até [data]!\"\n\n### 📢 CALL TO ACTION (1:50 - 2:00)\n\n**[VISUAL]** *Zoom no apresentador, olhar direto na câmera*\n\n**APRESENTADOR:**\n\"Clica no link aqui na descrição AGORA e garanta o seu. Ah, e comenta aqui embaixo qual foi sua parte favorita!\"\n\n**[VISUAL]** *End screen com vídeos relacionados*\n\n---\n\n### 📝 NOTAS DE PRODUÇÃO\n\n**Equipamentos:**\n- Câmera principal: 4K 60fps\n- B-roll: Slow motion 120fps\n- Áudio: Lapela + boom\n\n**Locação:**\n- Cenário minimalista\n- Iluminação natural + ring light\n\n**Pós-produção:**\n- Cortes dinâmicos a cada 3-4 segundos\n- Legendas amarelas para pontos-chave\n- Música energética mas não invasiva\n- Sound effects para transições\n\n**Thumbnails sugeridas:**\n1. Antes/depois split\n2. Reação surpresa + produto\n3. Número grande + benefício";
        } else {
          responseContent = "## 🎬 **Roteirista Pro** à disposição!\n\nCrio roteiros que prendem do início ao fim:\n\n- **YouTube**: Roteiros que retêm audiência\n- **Comerciais**: 15s, 30s, 60s\n- **Vídeos Corporativos**: Institucional, treinamento\n- **Stories/Reels**: Conteúdo viral curto\n- **Documentários**: Narrativas envolventes\n\nQual tipo de vídeo você quer criar? Me conte sobre o projeto!";
        }
      } else if (selectedAgent?.id === "developer") {
        if (userMessage.toLowerCase().includes("api") || userMessage.toLowerCase().includes("código")) {
          responseContent = "## 🚀 API REST com Express.js\n\nVou criar uma API moderna e robusta para você:\n\n```javascript\nconst express = require('express');\nconst cors = require('cors');\nconst helmet = require('helmet');\nconst rateLimit = require('express-rate-limit');\n\nconst app = express();\n\n// Middlewares de segurança\napp.use(helmet());\napp.use(cors());\napp.use(express.json({ limit: '10mb' }));\n\n// Rate limiting\nconst limiter = rateLimit({\n  windowMs: 15 * 60 * 1000, // 15 minutes\n  max: 100 // limit each IP to 100 requests per windowMs\n});\napp.use(limiter);\n\n// Rotas\napp.get('/api/users', async (req, res) => {\n  try {\n    const users = await User.findAll();\n    res.json({ success: true, data: users });\n  } catch (error) {\n    res.status(500).json({ success: false, error: error.message });\n  }\n});\n\napp.post('/api/users', async (req, res) => {\n  try {\n    const user = await User.create(req.body);\n    res.status(201).json({ success: true, data: user });\n  } catch (error) {\n    res.status(400).json({ success: false, error: error.message });\n  }\n});\n\nconst PORT = process.env.PORT || 3000;\napp.listen(PORT, () => {\n  console.log(`🚀 Server running on port ${PORT}`);\n});\n```\n\n### ✨ **Características desta API:**\n- **Segurança**: Helmet para headers seguros\n- **CORS**: Configurado para requisições cross-origin\n- **Rate Limiting**: Proteção contra spam\n- **Error Handling**: Tratamento robusto de erros\n- **Async/Await**: Código moderno e limpo\n\n**Próximos passos**: Que tipo de funcionalidade específica você gostaria de adicionar?";
        } else {
          responseContent = "## 👨‍💻 **Dev Assistant** aqui!\n\nComo desenvolvedor especializado, posso ajudar com:\n\n- **Arquitetura de Software**: Padrões, microserviços, APIs\n- **Frontend**: React, Next.js, Vue, Angular\n- **Backend**: Node.js, Python, Java, .NET\n- **DevOps**: Docker, Kubernetes, CI/CD\n- **Debugging**: Encontrar e corrigir bugs complexos\n- **Code Review**: Melhorar qualidade e performance\n\n**💡 Dica**: Seja específico sobre sua stack e o problema que está enfrentando!";
        }
      } else {
        // Respostas padrão para outros agentes
        switch(selectedAgent?.id) {
          case "social":
            responseContent = "## 📱 **Social Media** expert online!\n\n**Bora viralizar!** Sou especialista em conteúdo que engaja, conecta e converte nas redes sociais.\n\n### 🚀 **Meu foco:**\n- **Conteúdo viral**: Posts que explodem no alcance\n- **Engajamento**: Textos que geram interação\n- **Storytelling social**: Histórias para Instagram/TikTok\n- **Trends**: Surfar nas ondas do momento\n- **Comunidade**: Construir audiência fiel\n\nQual rede vamos dominar primeiro?";
          
          case "video":
            responseContent = "## 🎥 **Video Creator** no ar!\n\n**Luzes, câmera, criação!** Sou especialista em conteúdo audiovisual que marca e converte.\n\n### 🎬 **Minha expertise:**\n- **Conceito criativo**: Ideias que se destacam\n- **Storyboard**: Planejamento visual detalhado\n- **Roteiros para vídeo**: Scripts envolventes\n- **Produção**: Dicas de filmagem e equipamentos\n- **Pós-produção**: Edição e finalização\n\nQue tipo de vídeo vamos criar?";
          
          case "marketing":
            responseContent = "## 📢 **Marketing Pro** estrategista!\n\n**Vamos crescer seu negócio!** Sou especialista em campanhas que geram resultados mensuráveis.\n\n### 🎯 **Minhas estratégias:**\n- **Funis de marketing**: Da atração à conversão\n- **Campanhas 360°**: Integração entre canais\n- **Growth hacking**: Crescimento acelerado\n- **Performance**: ROI e métricas que importam\n- **Branding**: Construção de marca forte\n\nQual desafio de marketing vamos resolver?";
          
          case "creative":
            responseContent = "## 🎨 **Creative Director** visionário!\n\n**Vamos criar algo único!** Sou especialista em conceitos criativos que marcam e diferenciam.\n\n### ✨ **Minha visão criativa:**\n- **Conceitos únicos**: Ideias que ninguém teve\n- **Direção de arte**: Visual que comunica\n- **Branding criativo**: Identidades marcantes\n- **Campanhas conceituais**: Narrativas poderosas\n- **Inovação**: Quebrar padrões estabelecidos\n\nQue tipo de conceito criativo precisamos desenvolver?";
          
          case "designer":
            responseContent = "## 🎨 **Design Pro** criativo!\n\n**Design que funciona e encanta!** Sou especialista em criar experiências visuais que resolvem problemas.\n\n### 🎯 **Minha expertise:**\n- **UI/UX Design**: Interfaces intuitivas e bonitas\n- **Design System**: Consistência visual\n- **Prototipagem**: Do wireframe ao produto final\n- **Branding**: Identidades visuais marcantes\n- **Design Responsivo**: Funciona em todos os dispositivos\n\nQue desafio de design vamos resolver?";
          
          case "analyst":
            responseContent = "## 📊 **Business Analyst** estratégico!\n\n**Dados que geram insights!** Sou especialista em transformar números em decisões estratégicas.\n\n### 🎯 **Minha análise:**\n- **KPIs e Métricas**: Acompanhar o que importa\n- **Business Intelligence**: Dashboards inteligentes\n- **Análise de Mercado**: Oportunidades e ameaças\n- **ROI e Performance**: Retorno sobre investimento\n- **Previsões**: Modelagem e forecasting\n\nQue tipo de análise precisa ser feita?";
          
          default:
            responseContent = "## 💫 **Assistente Geral** à disposição!\n\n**Seu parceiro multifuncional!** Posso ajudar com uma ampla variedade de tarefas e dúvidas.\n\n### 🎯 **Como posso ajudar:**\n- **Pesquisa e Informação**: Explicações claras sobre qualquer tópico\n- **Escrita e Redação**: Textos, e-mails, documentos\n- **Resolução de Problemas**: Análise e soluções criativas\n- **Aprendizado**: Explicações didáticas e exemplos\n- **Produtividade**: Organização e planejamento\n\nEm que posso ajudar você hoje?";
        }
      }

      const detectionResult = detectArtifactType(responseContent, selectedAgent?.id);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        role: "assistant",
        timestamp: new Date(),
        artifact: detectionResult?.artifact || undefined
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user", 
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = input;
    setInput("");
    
    handleAIResponse(messageContent);
  };

  const handleBackToAgents = () => {
    setAppState("agent-selection");
    setSelectedAgent(null);
    setMessages([]);
    setInput("");
  };

  const handleNewChat = () => {
    setAppState("agent-selection");
    setSelectedAgent(null);
    setMessages([]);
    setInput("");
    hideArtifact();
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleArtifactOpen = (artifactData: any, rect: DOMRect) => {
    // Configurar o artefato
    setArtifact({
      title: artifactData.title || "Documento",
      documentId: artifactData.id,
      kind: 'text',
      content: artifactData.content,
      isVisible: false,
      status: 'idle',
      boundingBox: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
    });

    // Mostrar com animação
    setTimeout(() => {
      showArtifact(rect);
    }, 50);
  };

  const handleUpdateArtifactContent = (content: string) => {
    setArtifact(prev => ({
      ...prev,
      content
    }));

    // Atualizar a mensagem correspondente
    setMessages(prevMessages => 
      prevMessages.map(msg => {
        if (msg.artifact && msg.artifact.id === artifact.documentId) {
          return {
            ...msg,
            artifact: {
              ...msg.artifact,
              content
            }
          };
        }
        return msg;
      })
    );
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isVisible={sidebarVisible}
        selectedAgent={selectedAgent}
        chats={chats}
        currentChatId={currentChatId}
        onToggle={toggleSidebar}
        onNewChat={handleNewChat}
        onSelectChat={setCurrentChatId}
      />

      {/* Botão para mostrar sidebar quando minimizada */}
      {!sidebarVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-4 left-4 z-50"
        >
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-white bg-zinc-950/80 border border-zinc-800/50 backdrop-blur-sm"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </motion.div>
      )}

      {/* Área Principal */}
      <div className={`flex-1 flex flex-col relative overflow-hidden transition-all duration-300`}>
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col h-full">
          <AnimatePresence mode="wait">
            {appState === "agent-selection" ? (
              /* ETAPA 1: Seleção de Agente */
              <motion.div
                key="agent-selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col"
              >
                <ScrollArea className="flex-1">
                  <div className="p-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mb-8"
                    >
                      <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                        Especialistas Criativos
                      </h2>
                      <p className="text-zinc-400 text-lg max-w-lg mx-auto">
                        Cada agente domina uma área específica da criação. Escolha o especialista ideal para seu projeto.
                      </p>
                    </motion.div>

                    <AgentGrid agents={AGENTS} onSelectAgent={handleSelectAgent} />
                  </div>
                </ScrollArea>
              </motion.div>
            ) : appState === "agent-welcome" ? (
              /* ETAPA 2: Tela de Boas-vindas do Agente */
              <motion.div
                key="agent-welcome"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <AgentWelcome
                  agent={selectedAgent!}
                  onBack={handleBackToAgents}
                  onStartChat={handleStartChat}
                />
              </motion.div>
            ) : (
              /* ETAPA 3: Chat Ativo */
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col"
              >
                <ChatHeader agent={selectedAgent} />

                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="max-w-4xl mx-auto p-6 space-y-6">
                      <AnimatePresence>
                        {messages.map((message, index) => (
                          <MessageItem
                            key={message.id}
                            message={message}
                            agent={selectedAgent}
                            isLast={index === messages.length - 1 && message.role === "assistant"}
                            onArtifactOpen={handleArtifactOpen}
                          />
                        ))}
                      </AnimatePresence>

                      {isLoading && <TypingIndicator agent={selectedAgent} />}

                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </div>

                <ChatInput
                  value={input}
                  onChange={setInput}
                  onSend={handleSendMessage}
                  agent={selectedAgent}
                  isLoading={isLoading}
                  placeholder={`Conversar com ${selectedAgent?.name}...`}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Novo Sistema de Artefatos */}
      <Artifact
        artifact={artifact}
        agent={selectedAgent}
        onClose={hideArtifact}
        onUpdateContent={handleUpdateArtifactContent}
      />
    </div>
  );
}