# Sistema de Autenticação

## Visão Geral

O sistema de autenticação foi implementado usando Supabase Auth com as seguintes características:

- **Navegação livre**: Usuários podem explorar a interface sem login
- **Login obrigatório para interação**: Ao tentar enviar mensagem, é solicitado login
- **Autenticação por email/senha**: Sistema básico sem login social (por enquanto)
- **Área administrativa protegida**: Apenas usuários admin podem acessar `/admin`

## Componentes Implementados

### 1. Frontend

#### AuthContext (`src/contexts/AuthContext.tsx`)
- Gerencia o estado de autenticação global
- Fornece métodos `signIn`, `signUp`, `signOut`
- Detecta automaticamente se usuário é admin

#### AuthModal (`src/components/auth/AuthModal.tsx`)
- Modal com tabs para Login/Signup
- Validação de formulários
- Feedback de erros e sucesso

#### AdminGuard (`src/components/auth/AdminGuard.tsx`)
- Componente wrapper para proteger rotas admin
- Redireciona usuários não autorizados

### 2. Integração na Interface

#### ChatHeader
- Botão "Sign up" para usuários não logados
- Menu de usuário com avatar e logout para usuários logados

#### ChatInput
- Intercepta tentativa de envio de mensagem
- Abre modal de autenticação se não logado
- Envia mensagem automaticamente após login bem-sucedido

### 3. Backend

#### Proteção de Rotas API (`src/lib/auth/server.ts`)
- `requireAuth()`: Verifica se usuário está autenticado
- `requireAdmin()`: Verifica se usuário é admin
- Usado em rotas de modificação (POST, PUT, DELETE)

#### Rotas Protegidas
- `/api/agents` - POST, PUT, DELETE requerem admin
- `/api/chat` - POST requer autenticação

## Banco de Dados

### Migração Necessária

Execute o arquivo `supabase/migrations/001_auth_system.sql` para:

1. Criar tabela `profiles` com campos de usuário
2. Adicionar `user_id` na tabela `chats`
3. Implementar RLS (Row Level Security) em todas as tabelas
4. Criar triggers para sincronizar dados de usuário

### Como Tornar um Usuário Admin

Após criar uma conta, execute no SQL Editor do Supabase:

```sql
-- Substitua 'email@exemplo.com' pelo email do usuário
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}' 
WHERE email = 'email@exemplo.com';

UPDATE public.profiles 
SET is_admin = true 
WHERE email = 'email@exemplo.com';
```

## Fluxo de Autenticação

1. **Usuário Não Logado**:
   - Pode navegar e explorar agentes
   - Vê botão "Sign up" no header
   - Ao tentar enviar mensagem → Modal de login aparece

2. **Processo de Signup**:
   - Email e senha (mínimo 6 caracteres)
   - Email de confirmação enviado
   - Perfil criado automaticamente via trigger

3. **Usuário Logado**:
   - Avatar com inicial do email no header
   - Menu dropdown com opção de logout
   - Mensagens associadas ao user_id
   - Histórico de chat persistente

4. **Usuário Admin**:
   - Acesso à página `/admin`
   - Pode criar, editar e deletar agentes
   - Visualiza estatísticas do sistema

## Configuração de Ambiente

Certifique-se de ter as variáveis de ambiente:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

## Próximos Passos

- [ ] Implementar login social (Google, GitHub)
- [ ] Adicionar recuperação de senha
- [ ] Implementar 2FA para admins
- [ ] Adicionar limites de uso por usuário
- [ ] Dashboard de usuário com histórico