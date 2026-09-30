# DECISIONS.md — Registro de Decisões Técnicas

## 1. Objetivo

Registrar decisões importantes do My Memo para evitar que decisões já tomadas sejam desfeitas ou reinventadas sem necessidade.

## 2. Stack principal

```text
Frontend: Angular + TypeScript
Backend: NestJS + TypeScript
Banco: PostgreSQL
ORM: Prisma
Storage: Supabase Storage
```

A separação entre interface, API, persistência e armazenamento permite evolução incremental.

## 3. Angular com SSR

O frontend utiliza Angular SSR. Alterações de rotas públicas devem considerar SSR/prerender.

## 4. Slug público

Memoriais possuem slug público para endereço simples e compartilhável. URLs de memoriais são parte importante do produto.

## 5. Mural moderado

Mensagens públicas entram inicialmente como `PENDING`, permitindo moderação antes da publicação.

## 6. Supabase Storage

Arquivos de memorial são armazenados no Supabase Storage para separar arquivos do banco relacional.

## 7. JWT

A autenticação utiliza JWT para separar frontend e API e integrar guards do NestJS.

## 8. Planejado não significa implementado

Funcionalidade planejada não é considerada existente até estar implementada e documentada.

## 9. Desenvolvimento incremental

Alterações devem ser pequenas e verificáveis para reduzir risco de regressões e facilitar recuperação.

## 10. Código legado

Arquivos aparentemente antigos não devem ser removidos automaticamente enquanto não forem confirmadas suas referências.

## 11. Compatibilidade de URLs

URLs públicas devem ser consideradas estáveis porque podem ser usadas em QR Codes, links compartilhados e materiais físicos.

## 12. Documentação como memória

A pasta `docs/` será utilizada como memória permanente do projeto para desenvolvimento humano e assistido por IA.

Documentos principais:

```text
CURRENT-STATE.md
PROJECT.md
ARCHITECTURE.md
DATABASE.md
API.md
AUTHENTICATION.md
FRONTEND.md
STORAGE.md
DEVELOPMENT-AND-DEPLOYMENT.md
DECISIONS.md
```

## 13. Novas decisões

Quando uma alteração estrutural importante for tomada, registrar decisão, motivo, alternativas relevantes e impacto. Não registrar segredos ou credenciais.
