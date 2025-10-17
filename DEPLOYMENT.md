# Guia de Deploy - EZ Coach

Este guia explica como fazer deploy do EZ Coach para produção.

## 📋 Pré-requisitos

- [ ] Conta Expo configurada
- [ ] EAS CLI instalado (`npm install -g eas-cli`)
- [ ] Projeto Supabase em produção
- [ ] Contas de desenvolvedor (Apple e/ou Google)
- [ ] Variáveis de ambiente configuradas

## 🔧 Configuração Inicial

### 1. Instalar EAS CLI

```bash
npm install -g eas-cli
eas login
```

### 2. Configurar EAS Build

```bash
eas build:configure
```

Isso criará o arquivo `eas.json`:

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

### 3. Configurar Variáveis de Ambiente

Crie secrets no EAS:

```bash
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "sua_url"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "sua_chave"
```

### 4. Configurar app.json

Atualize com informações de produção:

```json
{
  "expo": {
    "name": "EZ Coach",
    "slug": "ez-coach",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#2E8B57"
    },
    "ios": {
      "bundleIdentifier": "com.ezcoach.app",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.ezcoach.app",
      "versionCode": 1
    }
  }
}
```

## 🤖 Deploy Android

### Build APK/AAB

```bash
# Build para Google Play Store (AAB)
eas build --platform android --profile production

# Build APK para distribuição direta
eas build --platform android --profile preview
```

### Submit para Google Play

```bash
eas submit --platform android
```

### Configurações do Google Play

1. **Acesse** [Google Play Console](https://play.google.com/console)
2. **Crie** novo aplicativo
3. **Preencha**:
   - Nome: EZ Coach
   - Categoria: Esportes
   - Idioma: Português (Brasil)
4. **Adicione** screenshots e descrição
5. **Configure** classificação de conteúdo
6. **Defina** preços (gratuito)
7. **Publique** versão de teste interna
8. **Lance** para produção após testes

## 🍎 Deploy iOS

### Requisitos
- Conta Apple Developer ($99/ano)
- Certificados e perfis de provisionamento

### Build IPA

```bash
eas build --platform ios --profile production
```

### Submit para App Store

```bash
eas submit --platform ios
```

### Configurações da App Store

1. **Acesse** [App Store Connect](https://appstoreconnect.apple.com)
2. **Crie** novo app
3. **Preencha**:
   - Nome: EZ Coach
   - Categoria primária: Esportes
   - Subcategoria: Voleibol
4. **Adicione** screenshots para todos os tamanhos de tela
5. **Configure** privacidade e classificação
6. **Envie** para revisão
7. **Aguarde** aprovação (1-3 dias)

## 🌐 Deploy Web (Opcional)

### Build Web

```bash
npx expo export:web
```

### Deploy em Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Deploy em Netlify

```bash
# Build
npm run web

# Arrastar pasta 'web-build' para Netlify Dashboard
```

## 🔄 Updates Over-The-Air (OTA)

Para enviar atualizações sem passar pelas lojas:

```bash
# Publicar update
eas update --branch production --message "Correção de bugs"

# Update específico por plataforma
eas update --branch production --platform android
eas update --branch production --platform ios
```

### Configurar Updates no app.json

```json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/[your-project-id]"
    },
    "runtimeVersion": {
      "policy": "sdkVersion"
    }
  }
}
```

## 📊 Monitoramento

### Configurar Sentry

```bash
npm install @sentry/react-native
```

```typescript
// App.tsx
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "your-sentry-dsn",
  enableInExpoDevelopment: true,
  debug: true,
});
```

### Analytics

Configurar Google Analytics ou Firebase Analytics:

```bash
expo install expo-firebase-analytics
```

## 🔒 Checklist de Segurança

- [ ] Todas as chaves de API em variáveis de ambiente
- [ ] RLS habilitado em todas as tabelas Supabase
- [ ] Autenticação configurada corretamente
- [ ] HTTPS em todas as requisições
- [ ] Validação de entrada de dados
- [ ] Rate limiting configurado
- [ ] Logs de segurança ativados

## 🧪 Checklist de Testes

- [ ] Testar em dispositivos reais (Android e iOS)
- [ ] Testar em diferentes tamanhos de tela
- [ ] Testar com conexão lenta
- [ ] Testar sem conexão (verificar mensagens de erro)
- [ ] Testar todos os fluxos principais
- [ ] Testar com dados reais
- [ ] Testar limites de planos
- [ ] Testar chat em tempo real
- [ ] Testar notificações (quando implementado)

## 📱 Lojas - Requisitos

### Google Play Store

**Screenshots necessários:**
- Mínimo 2 screenshots (recomendado 8)
- Tamanhos: 1080x1920px ou 1920x1080px
- Formatos: PNG ou JPEG

**Ícone:**
- 512x512px
- PNG com transparência

**Feature Graphic:**
- 1024x500px
- Opcional mas recomendado

**Descrição:**
- Curta: até 80 caracteres
- Completa: até 4000 caracteres

### App Store

**Screenshots necessários:**
- iPhone 6.5": 1242x2688px ou 1284x2778px
- iPhone 5.5": 1242x2208px
- iPad Pro 12.9": 2048x2732px
- iPad Pro 11": 1668x2388px

**Ícone:**
- 1024x1024px
- PNG sem transparência

**Descrição:**
- Até 4000 caracteres
- Palavras-chave: até 100 caracteres

## 🚀 Processo de Release

### 1. Preparação

```bash
# Atualizar versão
# Editar app.json e package.json

# Commitar mudanças
git add .
git commit -m "chore: bump version to 1.0.0"
git tag v1.0.0
git push origin main --tags
```

### 2. Build

```bash
# Build Android
eas build --platform android --profile production

# Build iOS
eas build --platform ios --profile production
```

### 3. Testes Finais

- Baixar build
- Instalar em dispositivos físicos
- Executar testes manuais
- Verificar funcionalidades críticas

### 4. Submit

```bash
# Android
eas submit --platform android

# iOS
eas submit --platform ios
```

### 5. Monitoramento

- Acompanhar revisão nas lojas
- Verificar crash reports
- Monitorar feedback de usuários
- Estar pronto para hotfixes

## 🔧 Rollback

Se houver problemas críticos:

```bash
# Reverter OTA update
eas update:republish --group [update-group-id]

# Ou publicar versão anterior
eas update --branch production --message "Rollback to stable version"
```

## 📈 Métricas de Sucesso

Monitorar:
- Número de downloads
- Taxa de retenção
- Crashes por sessão
- Avaliações na loja
- Tempo médio de sessão
- Features mais usadas
- Taxa de conversão (Free → Premium)

## 📞 Suporte Pós-Launch

- Monitorar reviews nas lojas diariamente
- Responder feedback rapidamente
- Criar issues para bugs reportados
- Planejar próximas atualizações
- Comunicar mudanças aos usuários

## 🎯 Próximos Passos

1. **v1.0.1** - Correções de bugs reportados
2. **v1.1.0** - Drag & drop tático
3. **v1.2.0** - Notificações push
4. **v2.0.0** - Modo offline

---

**Boa sorte com o launch! 🚀🏐**
