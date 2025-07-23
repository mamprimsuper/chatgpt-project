# 📚 API de Agentes - Documentação

## 🔗 Endpoints Disponíveis

### 1. **GET /api/agents**
Listar todos os agentes ativos.

**Resposta:**
```json
[
  {
    "id": "uuid",
    "name": "Content Creator",
    "description": "Especialista em criação de conteúdo",
    "speciality": "Criação de Conteúdo",
    "icon": "<React Component>",
    "color": "from-purple-500 to-pink-600",
    "greeting": "Olá! Sou especialista em conteúdo...",
    "suggestions": ["..."],
    "systemPrompt": "...",
    "category": "content",
    "premiumTier": 0,
    "active": true
  }
]
```

### 2. **POST /api/agents**
Criar um novo agente.

**Corpo da Requisição:**
```json
{
  "name": "SEO Expert",
  "description": "Especialista em otimização para mecanismos de busca",
  "speciality": "SEO e Marketing Digital",
  "system_prompt": "Você é um especialista em SEO com anos de experiência...",
  "greeting": "Olá! Sou especialista em SEO e posso ajudar você a melhorar seu ranking!",
  "suggestions": [
    "Como melhorar meu SEO?",
    "Análise de palavras-chave",
    "Estratégia de link building",
    "Otimização de conteúdo"
  ],
  "color": "from-green-500 to-teal-600",
  "icon_name": "search",
  "category": "marketing",
  "premium_tier": 1,
  "active": true
}
```

**Campos:**

| Campo | Tipo | Obrigatório | Descrição | Padrão |
|-------|------|-------------|-----------|---------|
| `name` | string | ✅ | Nome do agente | - |
| `system_prompt` | string | ✅ | Prompt do sistema para a IA | - |
| `description` | string | ❌ | Descrição breve | null |
| `speciality` | string | ❌ | Especialidade do agente | null |
| `greeting` | string | ❌ | Mensagem de boas-vindas | Auto-gerada |
| `suggestions` | string[] | ❌ | Sugestões de prompts | 4 padrões |
| `color` | string | ❌ | Gradiente Tailwind | "from-blue-500 to-purple-600" |
| `icon_name` | string | ❌ | Nome do ícone | "lightbulb" |
| `category` | string | ❌ | Categoria do agente | "general" |
| `premium_tier` | number | ❌ | Nível premium (0-3) | 0 |
| `active` | boolean | ❌ | Se está ativo | true |

### 3. **PUT /api/agents**
Atualizar um agente existente.

**Corpo da Requisição:**
```json
{
  "id": "uuid-do-agente",
  "name": "SEO Expert Pro",
  "description": "Especialista avançado em SEO",
  "premium_tier": 2
}
```

### 4. **DELETE /api/agents?id={agent_id}**
Desativar um agente (soft delete).

## 🎨 Cores Disponíveis (Gradientes Tailwind)

```
"from-blue-500 to-purple-600"
"from-purple-500 to-pink-600"
"from-green-500 to-teal-600"
"from-yellow-500 to-orange-600"
"from-red-500 to-pink-600"
"from-indigo-500 to-blue-600"
"from-gray-500 to-gray-700"
"from-cyan-500 to-blue-600"
"from-emerald-500 to-green-600"
"from-rose-500 to-pink-600"
"from-amber-500 to-yellow-600"
"from-violet-500 to-purple-600"
```

## 🎯 Ícones Disponíveis

```
'lightbulb'    - Lâmpada (ideias)
'code'         - Código (desenvolvimento)
'pen-tool'     - Caneta (design)
'bar-chart-3'  - Gráfico (análise)
'camera'       - Câmera (visual)
'edit-3'       - Editar (escrita)
'type'         - Texto (UX writing)
'share-2'      - Compartilhar (social)
'book-open'    - Livro (conteúdo)
'video'        - Vídeo (audiovisual)
'megaphone'    - Megafone (marketing)
'palette'      - Paleta (criativo)
```

## 📁 Categorias Sugeridas

- `general` - Uso geral
- `content` - Criação de conteúdo (cria artefatos)
- `copy` - Copywriting (cria artefatos)
- `ux` - UX Writing (cria artefatos)
- `script` - Roteiros (cria artefatos)
- `dev` - Desenvolvimento
- `design` - Design
- `marketing` - Marketing
- `data` - Análise de dados
- `video` - Produção audiovisual
- `social` - Redes sociais

## 💡 Exemplos de System Prompts

### Para Agente de Conteúdo:
```
Você é um especialista em criação de conteúdo digital com mais de 10 anos de experiência. 
Você domina técnicas de storytelling, SEO, e escrita persuasiva. 
Sempre cria conteúdo original, envolvente e otimizado para o público-alvo.
Responda em português brasileiro de forma profissional mas acessível.
```

### Para Agente Técnico:
```
Você é um desenvolvedor sênior full-stack especializado em React, Next.js e TypeScript.
Você segue as melhores práticas de código limpo, performance e acessibilidade.
Sempre explique conceitos técnicos de forma clara e forneça exemplos práticos.
Responda em português brasileiro com terminologia técnica quando apropriado.
```

### Para Agente de Marketing:
```
Você é um estrategista de marketing digital com expertise em growth hacking e análise de dados.
Você cria campanhas baseadas em métricas e ROI, sempre focando em resultados mensuráveis.
Suas estratégias são criativas, éticas e alinhadas com as tendências do mercado.
Responda em português brasileiro de forma energética e inspiradora.
```

## 🚀 Exemplo Completo: Criar um Agente de SEO

```bash
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "SEO Master",
    "description": "Especialista em otimização para mecanismos de busca e marketing de conteúdo",
    "speciality": "SEO e SEM",
    "system_prompt": "Você é um especialista em SEO com 15 anos de experiência. Você domina técnicas de otimização on-page e off-page, análise de palavras-chave, link building, e estratégias de conteúdo. Sempre forneça conselhos práticos e atualizados com as últimas tendências do Google. Responda em português brasileiro de forma clara e didática.",
    "greeting": "👋 Olá! Sou o SEO Master, seu especialista em otimização para mecanismos de busca. Posso ajudar você a melhorar o ranking do seu site, encontrar as melhores palavras-chave, e criar estratégias de conteúdo que realmente convertem!",
    "suggestions": [
      "Como melhorar o SEO do meu site?",
      "Quais são as melhores palavras-chave para meu nicho?",
      "Como criar uma estratégia de link building?",
      "Análise de SEO para e-commerce"
    ],
    "color": "from-green-500 to-emerald-600",
    "icon_name": "bar-chart-3",
    "category": "marketing",
    "premium_tier": 1,
    "active": true
  }'
```

## 🔒 Considerações de Segurança

1. **Validação**: Todos os campos são validados antes da inserção
2. **Soft Delete**: Agentes são desativados, não deletados permanentemente
3. **System Prompt**: Deve ser cuidadosamente escrito para evitar comportamentos indesejados
4. **Rate Limiting**: Considere implementar rate limiting em produção

## 🎯 Dicas para Criar Bons Agentes

1. **System Prompt Detalhado**: Quanto mais específico, melhor será o comportamento
2. **Sugestões Relevantes**: Crie sugestões que demonstrem as capacidades do agente
3. **Categoria Correta**: Use `content`, `copy`, `ux`, ou `script` para agentes que criam artefatos
4. **Greeting Acolhedora**: Primeira impressão é importante
5. **Cor e Ícone**: Escolha combinações que representem visualmente a função