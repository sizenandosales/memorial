# DEVELOPMENT.md — Desenvolvimento Local

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

Executar conforme os scripts existentes no `package.json`. O desenvolvimento local utiliza `http://localhost:4200`.

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
