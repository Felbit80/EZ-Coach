# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2025-10-17

### ✨ Adicionado

#### Autenticação
- Sistema completo de autenticação com Supabase
- Tela de onboarding para novos usuários
- Login com email e senha
- Cadastro de novos usuários
- Persistência de sessão com AsyncStorage

#### Gestão de Times
- Criação de times para 5 esportes diferentes
- Seleção de esporte (Voleibol, Basquete, Handebol, Futsal, Futebol)
- Gerenciamento de membros do time
- Sistema de convites por email
- Definição de funções (Treinador, Capitão, Atleta)
- Configurações específicas por esporte (jogadores, posições)

#### Quadro Tático
- Visualização de quadra específica por esporte
- Posicionamento de jogadores
- Salvamento de formações
- Marcadores visuais de jogadores com números

#### Chat em Tempo Real
- Múltiplos chats por time (Geral, Estratégia, Treinos)
- Mensagens em tempo real via Supabase Realtime
- Interface estilo WhatsApp
- Indicação de remetente

#### Calendário
- Criação de eventos (Treinos, Amistosos, Campeonatos, Reuniões)
- Visualização de próximos eventos
- Detalhes de eventos (data, hora, local, descrição)
- Integração com dashboard

#### Sistema de Planos
- Plano Free (1 time, 3 jogadas, 1 chat)
- Plano Premium - R$19,90 (3 times, 20 jogadas, 5 chats)
- Plano Premium Pro - R$59,90 (ilimitado)
- Interface de upgrade de plano

#### Dashboard
- Tela inicial com resumo
- Navegação por abas (Home, Times, Tático, Calendário, Chat, Perfil)
- Saudações personalizadas
- Ações rápidas
- Perfil do usuário

#### Design System
- Paleta de cores esportiva
- Componentes reutilizáveis (Button, Input, Cards)
- Interface intuitiva e moderna
- Tema consistente em todo o app

#### Banco de Dados
- Schema completo no Supabase
- Row Level Security habilitado
- Tabelas: users, teams, team_members, formations, chats, messages, events, exercises
- Índices otimizados para performance
- Biblioteca inicial de exercícios de voleibol

#### Segurança
- RLS (Row Level Security) em todas as tabelas
- Políticas de acesso granulares
- Autenticação segura
- Dados criptografados

#### Documentação
- README completo
- Guia de setup detalhado
- Documentação da estrutura do projeto
- Schema SQL documentado
- Guia de contribuição

### 🏐 Foco em Voleibol
- Configuração padrão para voleibol
- 6 jogadores em quadra
- Posições: Ponteiro, Oposto, Levantador, Central, Líbero
- Quadra 9x18m com rede
- 7 exercícios de voleibol pré-cadastrados

### 📱 Suporte a Plataformas
- Android
- iOS
- Web (básico)

### 🔧 Tecnologias
- React Native com Expo SDK 51
- TypeScript rigoroso
- Supabase (Auth, Database, Realtime, Storage)
- React Navigation 6
- Context API
- AsyncStorage
- Material Community Icons

### 🌐 Internacionalização
- Interface em Português Brasileiro

## [Não Lançado]

### 🚀 Planejado para v1.1.0
- Drag & drop interativo no quadro tático
- Notificações push
- Biblioteca de vídeos de treinos
- Estatísticas de jogadores
- Exportação de relatórios PDF

### 🔮 Futuro
- Modo offline
- Integração com calendário do dispositivo
- Suporte a mais esportes
- Análise de desempenho
- IA para sugestões táticas
- Gamificação
- Marketplace de treinos

## Tipos de Mudanças

- `✨ Adicionado`: para novas funcionalidades
- `🔄 Modificado`: para mudanças em funcionalidades existentes
- `❌ Depreciado`: para funcionalidades que serão removidas
- `🗑️ Removido`: para funcionalidades removidas
- `🐛 Corrigido`: para correção de bugs
- `🔒 Segurança`: para vulnerabilidades corrigidas

---

[1.0.0]: https://github.com/seu-usuario/ez-coach/releases/tag/v1.0.0
