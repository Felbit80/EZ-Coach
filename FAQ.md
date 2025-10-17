# Perguntas Frequentes (FAQ) - EZ Coach

## 📱 Geral

### O que é o EZ Coach?
O EZ Coach é um aplicativo móvel completo para gerenciamento de times esportivos, com foco principal em voleibol. Permite criar times, gerenciar membros, criar estratégias táticas, organizar eventos e se comunicar com a equipe em tempo real.

### Quais esportes são suportados?
- 🏐 Voleibol (foco principal)
- 🏀 Basquete
- 🤾 Handebol
- ⚽ Futsal
- ⚽ Futebol

### O app funciona offline?
Atualmente não. O EZ Coach requer conexão com internet para funcionar, pois todas as funcionalidades dependem do Supabase (autenticação, banco de dados, chat em tempo real). O modo offline está planejado para versões futuras.

### Em quais plataformas funciona?
- Android (recomendado)
- iOS
- Web (suporte básico)

## 💰 Planos e Preços

### Qual a diferença entre os planos?

**Free (Gratuito)**
- 1 time
- 3 jogadas salvas
- 1 chat
- Funcionalidades básicas

**Premium - R$ 19,90/mês**
- 3 times
- 20 jogadas salvas
- 5 chats
- Suporte prioritário

**Premium Pro - R$ 59,90/mês**
- Times ilimitados
- Jogadas ilimitadas
- Chats ilimitados
- Suporte VIP
- Recursos exclusivos

### Como faço upgrade do meu plano?
1. Acesse a aba "Perfil"
2. Toque em "Fazer Upgrade"
3. Escolha o plano desejado
4. Complete o pagamento

### Posso mudar de plano depois?
Sim! Você pode fazer upgrade ou downgrade a qualquer momento. O ajuste será feito na próxima cobrança.

### Há período de teste gratuito?
O plano Free é totalmente gratuito e sem tempo limite. Para testar os recursos Premium, ocasionalmente oferecemos períodos de teste.

## 👥 Times e Membros

### Como criar um time?
1. Na aba "Times", toque em "+ Novo Time"
2. Digite o nome do time
3. Selecione o esporte
4. Toque em "Criar"

### Como convidar membros?
1. Selecione um time
2. Na seção "Membros", toque em "+ Convidar"
3. Digite o email do membro
4. Escolha a função (Treinador, Capitão ou Atleta)
5. Toque em "Convidar"

### Qual a diferença entre as funções?

- **Treinador** 👨‍🏫: Acesso total, pode convidar membros e gerenciar o time
- **Capitão** 👑: Pode criar jogadas e eventos, ajuda na organização
- **Atleta** 🏃: Participa do time, visualiza jogadas e eventos

### Quantos membros posso ter por time?
Não há limite de membros por time, independente do plano.

### Posso transferir a liderança do time?
Esta funcionalidade está planejada para uma futura atualização.

## 📋 Quadro Tático

### Como criar uma formação?
1. Acesse a aba "Tático"
2. Toque em "+ Nova Formação"
3. Os jogadores aparecem na quadra
4. (Futuramente) arraste para posicionar
5. Toque em "Salvar" e dê um nome

### Posso mover os jogadores?
A funcionalidade de drag & drop está em desenvolvimento e será lançada em breve. Atualmente, os jogadores são posicionados automaticamente.

### Quantas formações posso salvar?
Depende do seu plano:
- Free: 3 formações
- Premium: 20 formações
- Premium Pro: Ilimitado

### Como excluir uma formação?
Toque na formação e, em seguida, no ícone de lixeira (funcionalidade a ser implementada).

## 💬 Chat

### Como funciona o chat em tempo real?
O chat usa Supabase Realtime, que envia e recebe mensagens instantaneamente sem precisar recarregar a página.

### Posso criar mais chats?
Sim! A quantidade de chats depende do seu plano. Treinadores podem criar novos chats no tipo desejado (Geral, Estratégia, Treinos).

### As mensagens são salvas?
Sim, todas as mensagens são salvas no banco de dados e podem ser acessadas a qualquer momento.

### Posso enviar imagens?
Esta funcionalidade está planejada para uma futura atualização.

## 📅 Calendário

### Como criar um evento?
1. Acesse a aba "Calendário"
2. Toque em "+ Novo Evento"
3. Preencha título, tipo, local e descrição
4. Toque em "Criar"

### Que tipos de eventos existem?
- 🏋️ Treino
- 🤝 Amistoso
- 🏆 Campeonato
- 👥 Reunião

### Recebo notificações de eventos?
Notificações push estão planejadas para uma futura atualização.

### Posso sincronizar com meu calendário?
Integração com calendário do dispositivo está planejada para uma futura atualização.

## 🔐 Segurança e Privacidade

### Meus dados estão seguros?
Sim! Utilizamos:
- Supabase com criptografia em trânsito e em repouso
- Row Level Security (RLS) para isolamento de dados
- Autenticação segura
- Políticas de acesso granulares

### Quem pode ver meus times?
Apenas você e os membros que você convidar podem ver seus times e dados relacionados.

### Posso deletar minha conta?
Sim, entre em contato com suporte@ezcoach.app para solicitar a exclusão completa dos seus dados.

## 🐛 Problemas Técnicos

### O app não está carregando
1. Verifique sua conexão com internet
2. Feche e abra o app novamente
3. Limpe o cache do app
4. Reinstale o app se o problema persistir

### Não consigo fazer login
1. Verifique se o email e senha estão corretos
2. Tente redefinir a senha
3. Verifique sua conexão com internet
4. Entre em contato com o suporte se o problema persistir

### O chat não atualiza em tempo real
1. Verifique sua conexão com internet
2. Saia e entre no chat novamente
3. Reinicie o app
4. Verifique se está na versão mais recente

### Encontrei um bug, como reporto?
1. Acesse [GitHub Issues](https://github.com/seu-usuario/ez-coach/issues)
2. Crie uma nova issue
3. Descreva o problema detalhadamente
4. Inclua screenshots se possível

## 🎯 Esportes Específicos

### Por que o foco em voleibol?
O EZ Coach foi desenvolvido inicialmente pensando nas necessidades específicas de times de voleibol, mas a arquitetura permite fácil adaptação para outros esportes.

### Posso sugerir um novo esporte?
Sim! Abra uma issue no GitHub ou envie um email para suporte@ezcoach.app com detalhes sobre o esporte e suas necessidades específicas.

### As posições estão corretas para cada esporte?
Sim, cada esporte tem suas posições específicas configuradas:
- Voleibol: Ponteiro, Oposto, Levantador, Central, Líbero
- Basquete: Armador, Ala-armador, Ala, Ala-pivô, Pivô
- Handebol: Goleiro, Armador Central, Meias, Pontas, Pivô
- Futsal: Goleiro, Fixo, Ala, Pivô
- Futebol: Goleiro, Lateral, Zagueiro, Volante, Meia, Atacante

## 📞 Suporte

### Como entro em contato com o suporte?
- Email: suporte@ezcoach.app
- Discord: [Comunidade EZ Coach](https://discord.gg/ezcoach)
- GitHub Issues: Para bugs e sugestões técnicas

### Qual o tempo de resposta do suporte?
- Free: Até 48 horas
- Premium: Até 24 horas (prioritário)
- Premium Pro: Até 12 horas (VIP)

### Onde posso sugerir novas funcionalidades?
Abra uma issue no GitHub com a tag `enhancement` ou envie um email para dev@ezcoach.app

## 🚀 Atualizações

### Com que frequência o app é atualizado?
Planejamos lançar atualizações mensais com melhorias e correções de bugs, e atualizações maiores trimestralmente.

### Como sei se há uma nova versão?
Você será notificado automaticamente quando abrir o app, caso haja uma atualização disponível.

### Minhas configurações são mantidas após atualizar?
Sim, todas as suas configurações, times e dados são mantidos após atualizações.

---

**Não encontrou sua resposta?** Entre em contato conosco em suporte@ezcoach.app
