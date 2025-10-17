# Guia de Configuração do EZ Coach

Este guia ajudará você a configurar completamente o aplicativo EZ Coach.

## 1. Configuração do Supabase

### 1.1 Criar Projeto
1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em "New Project"
3. Escolha um nome (ex: "ez-coach")
4. Defina uma senha forte para o banco de dados
5. Selecione a região mais próxima

### 1.2 Configurar Banco de Dados
1. No painel do Supabase, vá para "SQL Editor"
2. Clique em "New Query"
3. Copie todo o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor e clique em "Run"
5. Verifique se todas as tabelas foram criadas em "Database" > "Tables"

### 1.3 Configurar Autenticação
1. Vá para "Authentication" > "Providers"
2. Habilite "Email" provider
3. Configure as URLs de callback (opcional para produção)

### 1.4 Obter Credenciais
1. Vá para "Settings" > "API"
2. Copie:
   - **Project URL** (algo como `https://xxx.supabase.co`)
   - **anon public** key

### 1.5 Configurar Realtime
1. Vá para "Database" > "Replication"
2. Verifique se a tabela `messages` está habilitada para Realtime
3. Se não estiver, execute no SQL Editor:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
```

## 2. Configuração do Projeto

### 2.1 Instalar Dependências
```bash
npm install
```

### 2.2 Configurar Variáveis de Ambiente
1. Crie o arquivo `.env` na raiz do projeto:
```bash
cp .env.example .env
```

2. Edite `.env` e adicione suas credenciais do Supabase:
```
EXPO_PUBLIC_SUPABASE_URL=sua_url_aqui
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

### 2.3 Criar Assets (Opcional para desenvolvimento)
- Siga as instruções em `assets/README.md`
- Ou crie placeholders simples temporariamente

## 3. Executar o Aplicativo

### 3.1 Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento
npm start

# Para Android
npm run android

# Para iOS (somente em Mac)
npm run ios

# Para Web
npm run web
```

### 3.2 Escanear QR Code
1. Instale o app Expo Go no seu celular
   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS](https://apps.apple.com/app/expo-go/id982107779)
2. Escaneie o QR code que aparece no terminal
3. O app será carregado no seu dispositivo

## 4. Testar Funcionalidades

### 4.1 Criar Conta
1. Abra o app
2. Passe pelo onboarding
3. Clique em "Criar conta"
4. Preencha os dados e crie sua conta

### 4.2 Criar Time
1. Após login, selecione "Voleibol"
2. Digite o nome do seu time
3. Clique em "Criar Time"

### 4.3 Testar Chat
1. Navegue até a aba "Chat"
2. O chat "Geral" será criado automaticamente
3. Envie mensagens para testar o Realtime

### 4.4 Criar Eventos
1. Vá para "Calendário"
2. Clique em "+ Novo Evento"
3. Preencha os dados e salve

### 4.5 Quadro Tático
1. Acesse a aba "Tático"
2. Clique em "+ Nova Formação"
3. Visualize os jogadores posicionados
4. Salve a formação

## 5. Problemas Comuns

### Erro de Conexão com Supabase
- Verifique se as variáveis de ambiente estão corretas
- Confirme que o projeto Supabase está ativo
- Teste as credenciais no dashboard do Supabase

### App não carrega no Expo Go
- Certifique-se de que o celular está na mesma rede Wi-Fi
- Tente usar o modo tunnel: `expo start --tunnel`
- Reinstale o Expo Go se necessário

### Erros de TypeScript
- Execute: `npx tsc --noEmit` para ver todos os erros
- Verifique se todas as dependências foram instaladas
- Limpe o cache: `expo start -c`

### Chat não funciona em tempo real
- Verifique se a tabela `messages` está habilitada para Realtime no Supabase
- Confirme que as policies RLS estão corretas
- Teste no dashboard do Supabase em "Realtime" > "Inspector"

## 6. Deploy em Produção

### 6.1 Build para Android
```bash
# Configurar EAS
npm install -g eas-cli
eas login
eas build:configure

# Build
eas build --platform android
```

### 6.2 Build para iOS
```bash
# Requer conta Apple Developer
eas build --platform ios
```

### 6.3 Publicar Atualização
```bash
eas update --branch production --message "Descrição da atualização"
```

## 7. Próximos Passos

1. **Adicionar Assets**: Crie ícones e splash screen profissionais
2. **Testar Planos**: Implemente integração com sistema de pagamento
3. **Notificações**: Configure Expo Notifications
4. **Analytics**: Adicione rastreamento de eventos
5. **Testes**: Escreva testes unitários e de integração

## 8. Recursos Úteis

- [Documentação Expo](https://docs.expo.dev/)
- [Documentação Supabase](https://supabase.com/docs)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 9. Suporte

Precisa de ajuda? Entre em contato:
- Email: dev@ezcoach.app
- GitHub Issues: [Criar Issue](https://github.com/seu-usuario/ez-coach/issues)

---

**Boa sorte com seu projeto EZ Coach! 🏐**
