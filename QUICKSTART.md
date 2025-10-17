# 🚀 Início Rápido - EZ Coach

Comece a usar o EZ Coach em 10 minutos!

## ⚡ Setup Express (5 minutos)

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Supabase
```bash
# 1. Crie conta em https://supabase.com
# 2. Crie novo projeto
# 3. Execute SQL do arquivo supabase-schema.sql
# 4. Copie URL e Anon Key
```

### 3. Configurar Ambiente
```bash
cp .env.example .env
# Edite .env com suas credenciais
```

### 4. Iniciar App
```bash
npm start
```

### 5. Abrir no Celular
- Instale Expo Go ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Escaneie o QR code

## 🎯 Primeiro Acesso (3 minutos)

### 1. Onboarding
- Passe pelos 4 slides introdutórios
- Clique em "Começar"

### 2. Criar Conta
- Email: seu@email.com
- Senha: mínimo 6 caracteres
- Nome completo

### 3. Selecionar Esporte
- Escolha **Voleibol** 🏐 (recomendado)
- Ou outro esporte de sua preferência

### 4. Criar Primeiro Time
- Nome: "Meu Time"
- Confirme o esporte
- Clique em "Criar Time"

## ✅ Testar Funcionalidades (2 minutos)

### Dashboard
- ✅ Veja resumo na tela inicial
- ✅ Times criados aparecem

### Quadro Tático
- ✅ Acesse aba "Tático"
- ✅ Crie nova formação
- ✅ Veja jogadores posicionados
- ✅ Salve a formação

### Chat
- ✅ Acesse aba "Chat"
- ✅ Chat "Geral" criado automaticamente
- ✅ Envie uma mensagem

### Calendário
- ✅ Acesse aba "Calendário"
- ✅ Crie um evento de treino
- ✅ Veja na listagem

### Perfil
- ✅ Acesse aba "Perfil"
- ✅ Veja limites do plano Free
- ✅ (Opcional) Faça upgrade

## 🎓 Próximos Passos

### Convidar Membros
1. Aba "Times" → Selecione time
2. Seção "Membros" → "+ Convidar"
3. Email do membro
4. Escolha função (Treinador/Capitão/Atleta)

### Criar Mais Times
1. Aba "Times" → "+ Novo Time"
2. Nome e esporte
3. Criar

### Organizar Treinos
1. Aba "Calendário" → "+ Novo Evento"
2. Tipo: Treino 🏋️
3. Preencha detalhes
4. Criar

### Estratégias Táticas
1. Aba "Tático" → "+ Nova Formação"
2. Visualize posicionamento
3. Salve com nome descritivo

## 🐛 Problemas Comuns

### "Erro ao conectar com Supabase"
```bash
# Verifique .env
cat .env

# Confirme credenciais no Supabase Dashboard
# Settings → API
```

### "App não carrega no celular"
```bash
# Mesma rede Wi-Fi?
# Tente modo tunnel:
npx expo start --tunnel
```

### "Erro ao criar conta"
```bash
# Verifique se SQL foi executado no Supabase
# Database → Tables → deve ter 'users', 'teams', etc
```

## 📱 Comandos Úteis

```bash
# Iniciar
npm start

# Limpar cache
npx expo start -c

# Android
npm run android

# iOS (Mac only)
npm run ios

# Web
npm run web
```

## 🎨 Explorar Código

```bash
# Componentes reutilizáveis
src/components/

# Telas principais
src/screens/

# Lógica de negócio
src/contexts/

# Configurações
src/config/

# Tipos TypeScript
src/types/
```

## 📚 Documentação Completa

- **README.md** - Visão geral do projeto
- **SETUP.md** - Guia completo de configuração
- **PROJECT_STRUCTURE.md** - Estrutura detalhada
- **FAQ.md** - Perguntas frequentes
- **DEPLOYMENT.md** - Guia de deploy
- **CONTRIBUTING.md** - Como contribuir

## 🏐 Dica: Foco em Voleibol

O EZ Coach foi otimizado para voleibol com:
- 6 jogadores em quadra
- 5 posições específicas
- Quadra 9x18m com rede
- Biblioteca de exercícios

Mas funciona perfeitamente para basquete, handebol, futsal e futebol!

## 💡 Recursos Principais

| Recurso | Free | Premium | Pro |
|---------|------|---------|-----|
| Times | 1 | 3 | ∞ |
| Formações | 3 | 20 | ∞ |
| Chats | 1 | 5 | ∞ |
| Suporte | Básico | Prioritário | VIP |

## 🎯 Checklist de Sucesso

- [x] App instalado e rodando
- [x] Conta criada
- [x] Time criado
- [x] Formação salva
- [x] Mensagem enviada
- [x] Evento criado
- [ ] Membro convidado
- [ ] Upgrade de plano (opcional)

## 🚀 Pronto para Começar!

```bash
npm install && npm start
```

Escaneie o QR code e comece a gerenciar seu time agora! 🏐

---

**Dúvidas?** Consulte [FAQ.md](FAQ.md) ou entre em contato: suporte@ezcoach.app
