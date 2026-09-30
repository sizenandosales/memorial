# DEVELOPMENT-AND-DEPLOYMENT.md

## Parte I — Desenvolvimento Local

## 1. Ambiente

O desenvolvimento utiliza Windows, VS Code e PowerShell.

Raiz:

```text
C:\dev\memorial
```

Estrutura:

```text
memorial/
├── backend/
├── frontend/
└── docs/
```

## 2. Backend

```powershell
cd C:\dev\memorial\backend
npm install
```

Executar conforme os scripts existentes no `package.json`. A porta local é 3000.

## 3. Frontend

```powershell
cd C:\dev\memorial\frontend
npm install
```

Executar conforme os scripts existentes no `package.json`. O desenvolvimento local com Angular utiliza `http://localhost:4200`. Quando o frontend é executado pelo servidor SSR, a porta local padrão é `4000`.

## 4. Banco e ambiente

O backend utiliza PostgreSQL através do Prisma. Credenciais e URLs devem permanecer em variáveis de ambiente.

## 5. Swagger

Com o backend em execução: `http://localhost:3000/api`.

## 6. Fluxo de trabalho

Antes de alterar:

1. verificar `git status`;
2. consultar `CURRENT-STATE.md`;
3. consultar documentação relevante;
4. localizar o código existente;
5. fazer alteração pequena;
6. executar testes/build quando aplicável;
7. revisar diff;
8. atualizar documentação;
9. fazer commit;
10. enviar para GitHub.

## 7. Git

Preferir commits pequenos e descritivos. Antes do commit usar `git status` e `git diff`. Depois, verificar novamente `git status`.

## 8. Segurança

Nunca versionar `.env` ou arquivos contendo credenciais.

## 9. Desenvolvimento com IA

Executar comandos um por vez quando houver risco, revisar comandos destrutivos, não executar exclusões sem confirmação, verificar Git antes e depois e preservar código existente.

## 10. Regra principal

O desenvolvimento deve ser incremental. Nenhuma IA deve reestruturar o projeto inteiro para implementar uma funcionalidade pequena sem justificativa explícita.
## Parte II — Produção e Implantação

## 1. Objetivo

Este documento registra a direção conhecida para implantação do My Memo. A configuração de produção definitiva ainda deve ser tratada como etapa específica.

## 2. Arquitetura esperada

```text
Internet
   |
   v
Nginx
   |
   +--> Frontend / SSR
   |
   +--> Backend API
             |
             +--> PostgreSQL
             +--> Supabase Storage
             +--> Serviço de e-mail
```

A infraestrutura exata deverá ser definida antes da implantação definitiva.

## 3. Domínio

`mymemo.com.br`. A produção deve utilizar HTTPS.

## 4. Variáveis de ambiente

Produção deverá utilizar secrets próprios, sem reutilizar valores de desenvolvimento.

Categorias: banco, JWT, Supabase, e-mail, URLs públicas e demais integrações.

## 5. E-mails

O código atual contém URLs de localhost em verificação e recuperação de senha. Antes da produção, essas URLs devem ser parametrizadas para o domínio correto.

## 6. Banco de dados

Considerar backup, migrações controladas, recuperação, monitoramento e segurança das credenciais.

## 7. Arquivos

A produção deve preservar os arquivos dos memoriais. Mudanças de armazenamento devem possuir estratégia de migração e backup.

## 8. Observabilidade

Antes da operação em escala, definir logs, monitoramento, alertas, backup e procedimento de recuperação.

## 9. Deploy seguro

Não executar implantação de produção sem build validado, variáveis configuradas, banco preparado, armazenamento validado, HTTPS configurado, testes essenciais e rollback planejado.

## 10. Estado atual

Este documento é principalmente um registro de direção. Não considerar que toda a infraestrutura acima já está implementada.
