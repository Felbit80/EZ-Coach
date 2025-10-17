# Estrutura do Projeto EZ Coach

## 📁 Organização de Pastas

```
ez-coach/
├── assets/                      # Assets estáticos (ícones, splash)
│   └── README.md
│
├── src/                         # Código fonte principal
│   ├── components/              # Componentes reutilizáveis
│   │   ├── Button.tsx          # Botão customizado
│   │   ├── Input.tsx           # Campo de entrada
│   │   ├── SportCard.tsx       # Card de esporte
│   │   ├── TeamCard.tsx        # Card de time
│   │   └── PlayerMarker.tsx    # Marcador de jogador
│   │
│   ├── config/                  # Configurações
│   │   ├── sports.ts           # Configurações de esportes
│   │   └── supabase.ts         # Cliente Supabase
│   │
│   ├── contexts/                # Context API
│   │   ├── AuthContext.tsx     # Autenticação
│   │   └── TeamContext.tsx     # Gerenciamento de times
│   │
│   ├── navigation/              # Navegação
│   │   └── AppNavigator.tsx    # Tab Navigator principal
│   │
│   ├── screens/                 # Telas do app
│   │   ├── OnboardingScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── SignUpScreen.tsx
│   │   ├── SelectSportScreen.tsx
│   │   ├── CreateTeamScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── TeamsScreen.tsx
│   │   ├── TacticalScreen.tsx
│   │   ├── CalendarScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   └── ProfileScreen.tsx
│   │
│   └── types/                   # Tipos TypeScript
│       └── index.ts
│
├── .env.example                 # Exemplo de variáveis de ambiente
├── .gitignore                   # Arquivos ignorados pelo Git
├── App.tsx                      # Componente raiz
├── app.json                     # Configuração do Expo
├── babel.config.js              # Configuração Babel
├── package.json                 # Dependências do projeto
├── tsconfig.json                # Configuração TypeScript
├── supabase-schema.sql          # Schema do banco de dados
├── README.md                    # Documentação principal
├── SETUP.md                     # Guia de configuração
└── PROJECT_STRUCTURE.md         # Este arquivo
```

## 🎯 Arquivos Principais

### `App.tsx`
Componente raiz que gerencia:
- Estado de autenticação
- Navegação entre onboarding/auth/app
- Providers (Auth, Navigation)
- Verificação de primeiro acesso

### `src/config/sports.ts`
Configurações de todos os esportes:
- Número de jogadores
- Posições disponíveis
- Dimensões da quadra
- Limites por plano
- Cores do tema

### `src/config/supabase.ts`
Cliente Supabase configurado com:
- URL e chave anônima
- AsyncStorage para persistência
- Auto-refresh de tokens

## 🔄 Fluxo de Navegação

```
Onboarding (primeira vez)
    ↓
Login / Cadastro
    ↓
Seleção de Esporte (opcional)
    ↓
Criação de Time (opcional)
    ↓
Dashboard (Tab Navigator)
    ├── Home
    ├── Times
    ├── Tático
    ├── Calendário
    ├── Chat
    └── Perfil
```

## 🎨 Componentes Reutilizáveis

### Button
Botão customizado com três variantes:
- `primary`: Fundo verde
- `secondary`: Fundo azul
- `outline`: Apenas borda

Props:
- `title`: Texto do botão
- `onPress`: Função ao clicar
- `variant`: Estilo do botão
- `loading`: Estado de carregamento
- `disabled`: Botão desabilitado
- `fullWidth`: Largura total

### Input
Campo de entrada com validação:
- Label customizável
- Placeholder
- Tipos especiais (email, senha, numérico)
- Exibição de erros
- Suporte a multiline

### SportCard
Card de seleção de esporte:
- Emoji do esporte
- Nome
- Número de jogadores
- Estado selecionado

### TeamCard
Card de time:
- Emoji do esporte
- Nome do time
- Esporte associado
- Estado selecionado

### PlayerMarker
Marcador de jogador no quadro tático:
- Número da camisa
- Posição
- Tamanho customizável
- Estilo esportivo

## 🔐 Contexts

### AuthContext
Gerencia autenticação:
- Estado do usuário
- Login/Logout
- Cadastro
- Atualização de plano
- Persistência de sessão

Métodos:
- `signIn(email, password)`
- `signUp(email, password, name)`
- `signOut()`
- `updateSubscription(plan)`

### TeamContext
Gerencia times:
- Lista de times do usuário
- Time atual selecionado
- Membros do time
- CRUD de times
- Convites

Métodos:
- `selectTeam(team)`
- `createTeam(data)`
- `updateTeam(id, updates)`
- `deleteTeam(id)`
- `inviteMember(teamId, email, role)`

## 📱 Telas

### Autenticação
- **OnboardingScreen**: 4 slides introdutórios
- **LoginScreen**: Email e senha
- **SignUpScreen**: Cadastro completo

### Setup
- **SelectSportScreen**: Escolha do esporte
- **CreateTeamScreen**: Criação do primeiro time

### Dashboard
- **HomeScreen**: Visão geral e próximos eventos
- **TeamsScreen**: Lista e gerenciamento de times
- **TacticalScreen**: Quadro tático interativo
- **CalendarScreen**: Eventos e agenda
- **ChatScreen**: Mensagens em tempo real
- **ProfileScreen**: Perfil e assinatura

## 🗄️ Tipos TypeScript

### Principais Interfaces

```typescript
// Esporte
interface Sport {
  id: SportType;
  name: string;
  emoji: string;
  playersCount: number;
  positions: string[];
  courtDimensions: { width: number; height: number };
}

// Usuário
interface User {
  id: string;
  email: string;
  name: string;
  subscription_plan: SubscriptionPlan;
}

// Time
interface Team {
  id: string;
  name: string;
  sport: SportType;
  created_by: string;
}

// Membro do Time
interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: UserRole;
  position?: string;
}

// Formação
interface Formation {
  id: string;
  team_id: string;
  name: string;
  players: Player[];
}

// Evento
interface Event {
  id: string;
  team_id: string;
  title: string;
  type: EventType;
  start_date: string;
  end_date: string;
}

// Mensagem
interface Message {
  id: string;
  chat_id: string;
  user_id: string;
  content: string;
  created_at: string;
}
```

## 🎨 Sistema de Design

### Cores
```typescript
COLORS = {
  primary: '#2E8B57',      // Verde esportivo
  secondary: '#1E40AF',    // Azul confiança
  background: '#F5F5F5',   // Cinza claro
  card: '#FFFFFF',         // Branco
  text: '#1F2937',         // Cinza escuro
  textSecondary: '#6B7280',// Cinza médio
  border: '#E5E7EB',       // Cinza borda
  error: '#EF4444',        // Vermelho
  success: '#10B981',      // Verde
  warning: '#F59E0B'       // Laranja
}
```

### Espaçamentos
- Padding padrão: 16px
- Padding grande: 24px
- Border radius: 12px
- Border radius grande: 16px

## 📊 Banco de Dados

### Tabelas Principais
1. **users**: Perfis de usuários
2. **teams**: Times criados
3. **team_members**: Relação usuário-time
4. **formations**: Formações táticas
5. **chats**: Conversas
6. **messages**: Mensagens (Realtime)
7. **events**: Eventos e treinos
8. **exercises**: Biblioteca de exercícios

### Segurança (RLS)
Todas as tabelas têm Row Level Security:
- Usuários veem apenas seus dados
- Membros de times acessam dados do time
- Criadores têm permissões especiais

## 🔄 Fluxo de Dados

### Autenticação
```
App.tsx → AuthContext → Supabase Auth → AsyncStorage
```

### Times
```
TeamsScreen → TeamContext → Supabase → RLS Check → Data
```

### Chat Realtime
```
ChatScreen → Supabase Realtime Channel → Messages Table → Update UI
```

### Eventos
```
CalendarScreen → Direct Supabase Query → Events Table → Display
```

## 🚀 Performance

### Otimizações
- Lazy loading de telas
- Memoização de componentes pesados
- Queries otimizadas com índices
- Realtime apenas em chats ativos
- Cache de dados com Context API

### Best Practices
- TypeScript rigoroso para evitar bugs
- Context API ao invés de prop drilling
- Componentes reutilizáveis
- Separation of concerns
- RLS para segurança no banco

## 📝 Convenções de Código

### Nomenclatura
- Componentes: PascalCase (`Button.tsx`)
- Funções: camelCase (`handlePress`)
- Constantes: UPPER_CASE (`COLORS`)
- Interfaces: PascalCase (`interface User`)

### Estrutura de Arquivo
```typescript
// 1. Imports
import React from 'react';

// 2. Types
interface Props {}

// 3. Component
export const Component: React.FC<Props> = () => {
  // 4. Hooks
  // 5. Handlers
  // 6. Render
};

// 7. Styles
const styles = StyleSheet.create({});
```

## 🧪 Testing (Futuro)

Estrutura sugerida:
```
src/
├── __tests__/
│   ├── components/
│   ├── contexts/
│   ├── screens/
│   └── utils/
```

## 📦 Dependências Principais

- `expo`: ~51.0.0
- `react-native`: 0.74.2
- `typescript`: ~5.3.3
- `@supabase/supabase-js`: ^2.43.4
- `@react-navigation/native`: ^6.1.17
- `@react-navigation/bottom-tabs`: ^6.5.20

## 🔮 Próximos Passos

1. Implementar drag & drop no quadro tático
2. Adicionar notificações push
3. Criar biblioteca de treinos com vídeos
4. Implementar estatísticas de jogadores
5. Adicionar modo offline
6. Testes automatizados
7. CI/CD pipeline

---

Última atualização: 2025-10-17
