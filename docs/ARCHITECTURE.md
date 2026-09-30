# ARCHITECTURE.md — Arquitetura do My Memo

## 1. Objetivo

Este documento descreve a organização técnica conhecida do My Memo e a relação entre frontend, backend, banco de dados, autenticação, armazenamento e serviços auxiliares.

Ele complementa `CURRENT-STATE.md` e não substitui a inspeção do código real.

## 2. Visão geral

```text
Navegador
   |
   v
Angular 21 + SSR
   |
   | HTTP / JSON / FormData
   v
NestJS 11
   |
   +--> Auth
   +--> Memorials
   +--> Mural Messages
   +--> Users
   +--> Mail
   +--> Tasks
   +--> Supabase
   |
   +--> Prisma
          |
          v
      PostgreSQL

Arquivos
   |
   v
Supabase Storage
```

## 3. Frontend

Localização: `frontend/`

Tecnologias principais:

- Angular 21;
- TypeScript;
- Angular Router;
- HttpClient;
- SSR com Angular;
- Express 5 no servidor SSR.

O frontend é responsável pela interface do usuário, navegação, formulários, chamadas HTTP e experiência pública dos memoriais.

## 4. Backend

Localização: `backend/`

Tecnologias principais:

- NestJS 11;
- TypeScript;
- Prisma;
- PostgreSQL;
- Passport/JWT;
- bcrypt;
- Supabase;
- Nodemailer/Nest Mailer;
- Swagger;
- Helmet;
- Throttler;
- Schedule/Cron.

O backend concentra as regras de negócio, autenticação, persistência, upload e APIs.

## 5. Módulos conhecidos do backend

O `AppModule` atualmente integra configuração global, agendamento e módulos relacionados a:

- Prisma;
- Memorials;
- Auth;
- Mail;
- Mural Messages;
- Tasks;
- Supabase.

Existe também estrutura relacionada a usuários.

## 6. Comunicação

No desenvolvimento local:

- frontend em desenvolvimento: `http://localhost:4200`;
- frontend SSR local: `http://localhost:4000`;
- backend: `http://localhost:3000`;
- Swagger: `http://localhost:3000/api`.

CORS está configurado para permitir comunicação entre frontend e backend.

## 7. Banco de dados

O acesso ao PostgreSQL é realizado pelo Prisma.

Os principais modelos atuais são `User`, `Partner`, `Memorial` e `MuralMessage`.

As relações e campos detalhados devem ser consultados em `DATABASE.md` e, em caso de dúvida, no `schema.prisma` real.

## 8. Armazenamento

Arquivos de memoriais são enviados ao Supabase Storage.

O bucket padrão conhecido é `memorial-files`.

Pastas utilizadas incluem `profiles/` e `gallery/`.

## 9. Autenticação

A autenticação é baseada em JWT. O backend utiliza Passport/JWT e bcrypt.

Payload conhecido:

```text
sub
email
role
```

O access token possui duração configurada de 15 minutos e o refresh token de 7 dias.

## 10. Fluxo administrativo

```text
Usuário → Login → JWT → Frontend → Authorization: Bearer → NestJS → Controller → Service → Prisma / Supabase
```

## 11. Fluxo público

```text
Visitante → /memorial/:slug → Angular → GET /memorials/:slug → NestJS → Prisma → Memorial
```

## 12. Fluxo de arquivos

```text
Angular → multipart/form-data → NestJS → Memorial Service → Supabase Service → Supabase Storage → URL → Banco
```

## 13. SSR

O Angular utiliza SSR com `AngularNodeAppEngine` e Express. As rotas atuais devem ser tratadas considerando prerender/SSR.

## 14. Princípios arquiteturais

- preservar a separação frontend/backend;
- concentrar regras de negócio no backend;
- não duplicar serviços existentes;
- verificar código legado antes de removê-lo;
- preservar URLs públicas;
- evitar mudanças estruturais desnecessárias;
- implementar mudanças incrementalmente;
- testar alterações antes de considerá-las concluídas.

## 15. Pontos conhecidos

Existem diferenças entre partes antigas e atuais do código, principalmente no frontend, incluindo serviço antigo de memorial, interceptor legado e componente antigo de criação. Também existem divergências conhecidas no contrato de refresh token e URLs de e-mail configuradas para localhost.

Esses pontos são dívida técnica conhecida e não autorização para alterações automáticas.

## 16. Regra para IA

Antes de modificar a arquitetura, a IA deve consultar a documentação, verificar o código real, localizar implementações existentes, explicar impactos, evitar duplicação, testar e atualizar a documentação quando necessário.
