# EZ Coach 🏐

Aplicativo completo de gerenciamento de times esportivos com foco em Voleibol, desenvolvido com React Native, Expo, TypeScript e Supabase.

## 🎯 Características Principais

- **5 Esportes Suportados**: Voleibol (foco principal), Basquete, Handebol, Futsal e Futebol
- **Quadro Tático Interativo**: Crie e salve formações personalizadas
- **Chat em Tempo Real**: Comunicação instantânea com o time via Supabase Realtime
- **Calendário de Eventos**: Organize treinos, amistosos, campeonatos e reuniões
- **Sistema de Planos**: Free, Premium (R$19,90) e Premium Pro (R$59,90)
- **Gerenciamento de Times**: Convide membros, defina funções (Treinador, Capitão, Atleta)

## 🚀 Tecnologias

- **React Native** com Expo SDK 51
- **TypeScript** (modo rigoroso)
- **Supabase** (Backend completo com Auth, Database, Realtime e Storage)
- **React Navigation 6** (Bottom Tabs)
- **Context API** (Estado global)
- **Material Community Icons**

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI
- Conta Supabase (gratuita)

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd ez-coach
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o Supabase**

   a. Crie um projeto em [supabase.com](https://supabase.com)
   
   b. Execute o SQL do arquivo `supabase-schema.sql` no SQL Editor do Supabase
   
   c. Copie as credenciais do projeto

4. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais:
```
EXPO_PUBLIC_SUPABASE_URL=sua_url_do_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

5. **Inicie o aplicativo**
```bash
npm start
```

## 📱 Como Usar

### Primeiro Acesso
1. Abra o app e passe pelo onboarding
2. Crie uma conta ou faça login
3. Selecione seu esporte principal (recomendamos Voleibol 🏐)
4. Crie seu primeiro time
5. Explore o dashboard!

### Navegação Principal
- **Início**: Visão geral e próximos eventos
- **Times**: Gerencie times e membros
- **Tático**: Crie formações e estratégias
- **Calendário**: Organize eventos e treinos
- **Chat**: Converse com seu time em tempo real
- **Perfil**: Configurações e upgrade de plano

## 🏐 Configurações por Esporte

### Voleibol (Foco Principal)
- 6 jogadores em quadra
- Posições: Ponteiro, Oposto, Levantador, Central, Líbero
- Quadra: 9x18m com rede central
- Sistema de rotação

### Basquete
- 5 jogadores
- Posições: Armador, Ala-armador, Ala, Ala-pivô, Pivô

### Handebol
- 7 jogadores
- Posições: Goleiro, Armador Central, Meias, Pontas, Pivô

### Futsal
- 5 jogadores
- Posições: Goleiro, Fixo, Ala, Pivô

### Futebol
- 11 jogadores
- Posições: Goleiro, Lateral, Zagueiro, Volante, Meia, Atacante

## 💎 Planos de Assinatura

### Free
- 1 time
- 3 jogadas salvas
- 1 chat
- Funcionalidades básicas

### Premium - R$ 19,90/mês
- 3 times
- 20 jogadas salvas
- 5 chats
- Suporte prioritário

### Premium Pro - R$ 59,90/mês
- Times ilimitados
- Jogadas ilimitadas
- Chats ilimitados
- Suporte VIP
- Recursos exclusivos

## 🎨 Design System

### Cores Principais
- Verde Esportivo: `#2E8B57`
- Azul Confiança: `#1E40AF`
- Background: `#F5F5F5`
- Card: `#FFFFFF`
- Texto: `#1F2937`

### Componentes Reutilizáveis
- `Button`: Botões primários, secundários e outline
- `Input`: Campos de texto com validação
- `SportCard`: Card de seleção de esporte
- `TeamCard`: Card de time
- `PlayerMarker`: Marcador de jogador no quadro tático

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais
- `users`: Perfis de usuários
- `teams`: Times criados
- `team_members`: Membros dos times
- `formations`: Formações táticas
- `chats`: Conversas do time
- `messages`: Mensagens em tempo real
- `events`: Eventos e treinos
- `exercises`: Biblioteca de exercícios

## 🔐 Segurança

- Row Level Security (RLS) habilitado em todas as tabelas
- Autenticação via Supabase Auth
- Políticas de acesso granulares
- Dados criptografados em trânsito e em repouso

## 🚧 Roadmap

- [ ] Drag & drop interativo no quadro tático
- [ ] Notificações push
- [ ] Estatísticas de jogadores
- [ ] Biblioteca de vídeos de treinos
- [ ] Exportação de relatórios
- [ ] Integração com calendário do dispositivo
- [ ] Modo offline
- [ ] Suporte a mais esportes

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, siga estas etapas:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- Desenvolvido com ❤️ para treinadores e atletas de voleibol

## 📞 Suporte

- Email: suporte@ezcoach.app
- Website: https://ezcoach.app
- Discord: [Comunidade EZ Coach](https://discord.gg/ezcoach)

---

**EZ Coach** - Gerencie seu time com facilidade! 🏐⚽🏀
