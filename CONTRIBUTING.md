# Contribuindo para o EZ Coach

Obrigado por considerar contribuir para o EZ Coach! 🏐

## 📋 Código de Conduta

Este projeto adere a um código de conduta. Ao participar, você concorda em manter um ambiente respeitoso e inclusivo.

## 🚀 Como Contribuir

### Reportar Bugs

1. Verifique se o bug já não foi reportado em [Issues](https://github.com/seu-usuario/ez-coach/issues)
2. Crie uma nova issue com:
   - Título claro e descritivo
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Informações do ambiente (OS, versão do app, etc)

### Sugerir Funcionalidades

1. Verifique se a funcionalidade já não foi sugerida
2. Crie uma issue com tag `enhancement`
3. Descreva:
   - Qual problema resolve
   - Como deveria funcionar
   - Por que seria útil para usuários

### Pull Requests

1. **Fork** o repositório
2. **Clone** seu fork
3. **Crie** uma branch descritiva
4. **Faça** suas alterações
5. **Teste** suas mudanças
6. **Commit** com mensagens claras
7. **Push** para seu fork
8. **Abra** um Pull Request

## 🔧 Configuração para Desenvolvimento

```bash
# Clone seu fork
git clone https://github.com/seu-usuario/ez-coach.git
cd ez-coach

# Adicione o repositório original como upstream
git remote add upstream https://github.com/original/ez-coach.git

# Instale dependências
npm install

# Configure ambiente
cp .env.example .env
# Adicione suas credenciais Supabase

# Inicie o app
npm start
```

## 📝 Padrões de Código

### TypeScript
- Use TypeScript rigoroso
- Sempre defina tipos para props e estados
- Evite `any`, use tipos específicos

### React Native
- Use componentes funcionais com hooks
- Memoize componentes pesados
- Siga o padrão de nomenclatura PascalCase

### Commits
Use Conventional Commits:
```
feat: adiciona drag & drop no quadro tático
fix: corrige erro ao criar time sem internet
docs: atualiza README com novas instruções
style: formata código com Prettier
refactor: reorganiza estrutura de pastas
test: adiciona testes para AuthContext
chore: atualiza dependências
```

### Comentários
- Comente código complexo
- Use JSDoc para funções públicas
- Mantenha comentários atualizados

## 🧪 Testes

```bash
# Executar testes
npm test

# Testes com coverage
npm run test:coverage

# Lint
npm run lint
```

## 📚 Documentação

- Atualize README.md se adicionar funcionalidades
- Documente novos componentes
- Atualize CHANGELOG.md

## 🎨 UI/UX

- Mantenha consistência com Design System
- Use cores do tema (`COLORS`)
- Siga diretrizes de acessibilidade
- Teste em diferentes tamanhos de tela

## 🔍 Code Review

Seu PR será revisado considerando:
- Funcionalidade
- Qualidade do código
- Testes
- Documentação
- Performance
- Segurança

## 📦 Estrutura de Branches

- `main`: Código de produção
- `develop`: Desenvolvimento ativo
- `feature/*`: Novas funcionalidades
- `fix/*`: Correções de bugs
- `hotfix/*`: Correções urgentes

## 🏆 Créditos

Contribuidores são reconhecidos em:
- README.md
- Release notes
- Tela "Sobre" do app

## 📞 Contato

Dúvidas sobre contribuição:
- Email: dev@ezcoach.app
- Discord: [Comunidade EZ Coach](https://discord.gg/ezcoach)

## 📜 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença MIT do projeto.

---

**Obrigado por contribuir! 🎉**
