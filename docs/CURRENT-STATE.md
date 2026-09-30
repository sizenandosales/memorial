# CURRENT-STATE.md — Estado Atual do My Memo

## 1. Identificação do projeto

**Projeto:** My Memo
**Domínio:** mymemo.com.br
**Tagline:** Preservando Memórias

O My Memo é uma plataforma de memoriais digitais. A proposta é permitir que uma pessoa tenha acesso, por meio de um QR Code instalado em túmulo, lápide ou placa memorial, a uma página pública dedicada à memória de uma pessoa falecida.

A página pública do memorial poderá apresentar informações biográficas, fotografia, galeria de imagens e mural de mensagens.

Objetivo de longo prazo: criar uma plataforma de preservação de memórias digitais por longos períodos.

---

## 2. Repositório

**GitHub:** `sizenandosales/memorial`

**Projeto local:**

```text
C:\dev\memorial
```

Estrutura principal:

```text
C:\dev\memorial
├── backend
├── frontend
└── docs
```

O diretório `docs` está sendo criado para funcionar como a memória técnica permanente do projeto.

---

## 3. Stack tecnológica

### Backend

- Node.js
- TypeScript
- NestJS 11
- Prisma 6
- PostgreSQL
- JWT
- Passport
- bcrypt
- Supabase Storage
- Nodemailer / Nest Mailer
- Swagger
- Helmet
- Throttler
- Schedule/Cron

### Frontend

- Angular 21
- TypeScript
- Angular SSR
- Express 5
- RxJS
- Angular Router
- HttpClient
- CSS próprio

### Infraestrutura planejada

- PostgreSQL
- Supabase Storage
- Mercado Pago ou PagSeguro futuramente
- VPS Ubuntu em produção
- Nginx
- Docker/Compose ou PM2, conforme decisão posterior

---

## 4. Backend

Localização:

```text
C:\dev\memorial\backend
```

Principais diretórios:

```text
src/
├── auth/
├── filters/
├── mail/
├── memorials/
├── mural-messages/
├── prisma/
├── supabase/
├── tasks/
└── users/
```

Módulos atualmente registrados em `AppModule`:

- ConfigModule
- ScheduleModule
- PrismaModule
- MemorialsModule
- AuthModule
- MailModule
- MuralMessagesModule
- TasksModule
- SupabaseModule

---

## 5. Backend — execução

O backend utiliza:

```text
http://localhost:3000
```

O `main.ts` atualmente:

- cria a aplicação NestJS;
- habilita CORS;
- permite credenciais;
- utiliza `HttpExceptionFilter` globalmente;
- utiliza `ValidationPipe` globalmente;
- habilita Swagger;
- inicia o servidor na porta 3000.

Swagger:

```text
http://localhost:3000/api
```

CORS atualmente permite:

```text
http://localhost:4200
```

---

## 6. Backend — banco de dados

O projeto utiliza:

```text
PostgreSQL + Prisma
```

O schema está em:

```text
backend/prisma/schema.prisma
```

Modelos atualmente existentes:

- User
- Partner
- Memorial
- MuralMessage

### User

Principais campos:

- id
- name
- email
- password
- role
- createdAt
- bairro
- cep
- cidade
- complemento
- document
- logradouro
- numero
- phone
- refreshToken
- uf
- updatedAt
- isVerified
- verificationToken
- resetPasswordExpires
- resetPasswordToken

Um usuário pode possuir vários memoriais.

### Partner

Principais campos:

- id
- name
- cpfCnpj
- email
- password
- role
- totalSales
- createdAt

Um parceiro pode possuir vários memoriais.

### Memorial

Principais campos:

- id
- slug
- fullName
- birthDate
- deathDate
- birthCity
- deathCity
- cemetery
- biography
- profilePicture
- gallery
- status
- expiresAt
- createdAt
- userId
- partnerId

Um memorial pode possuir várias mensagens de mural.

### MuralMessage

Principais campos:

- id
- visitorName
- message
- status
- createdAt
- memorialId

Status padrão da mensagem:

```text
PENDING
```

Status utilizado para aprovação:

```text
APPROVED
```

---

## 7. Backend — expiração e avisos automáticos

Existe uma rotina agendada (Schedule/Cron) executada diariamente à meia-noite.

A rotina verifica memoriais cuja data `expiresAt` esteja entre a data atual e os próximos 3 dias e envia avisos por e-mail aos responsáveis.

Atualmente, essa rotina possui finalidade exclusiva de aviso de proximidade da expiração.

Ela não bloqueia automaticamente o memorial, não realiza renovação automática e não altera o status do memorial.

---

## 8. Backend — autenticação

O módulo de autenticação está em:

```text
backend/src/auth
```

Atualmente existem:

- registro;
- login;
- verificação de e-mail;
- recuperação de senha;
- redefinição de senha;
- geração de access token;
- geração de refresh token;
- renovação de tokens.

O login exige que o usuário tenha o e-mail verificado.

JWT utiliza payload contendo:

```text
sub
email
role
```

Access token:

```text
15 minutos
```

Refresh token:

```text
7 dias
```

O refresh token é armazenado no banco de forma protegida por hash bcrypt.

---

## 8. Rotas atuais de autenticação

```text
POST /auth/login
POST /auth/refresh
POST /auth/register
GET  /auth/verify?token=...
POST /auth/forgot-password
POST /auth/reset-password
```

Observação importante:

O backend atualmente exige `userId` e `refreshToken` no endpoint `/auth/refresh`.

O serviço Angular de autenticação atualmente envia somente `refreshToken`.

Portanto, existe uma inconsistência conhecida entre frontend e backend no fluxo de refresh token.

Não corrigir automaticamente sem uma decisão específica.

---

## 9. Backend — memoriais

Controller:

```text
backend/src/memorials/memorials.controller.ts
```

Service:

```text
backend/src/memorials/memorials.service.ts
```

Principais endpoints existentes:

```text
POST   /memorials
GET    /memorials
GET    /memorials/:id/approved-messages
POST   /memorials/:id/messages
GET    /memorials/:slug
PATCH  /memorials/:slug
PATCH  /memorials/:slug/status
GET    /memorials/:slug/messages/all
PATCH  /memorials/messages/:id/status
DELETE /memorials/:slug
```

Os endpoints administrativos/protegidos utilizam JWT.

A página pública do memorial utiliza:

```text
GET /memorials/:slug
```

sem autenticação.

---

## 10. Criação de memorial

A criação utiliza `multipart/form-data`.

Arquivos aceitos atualmente:

```text
profilePicture
gallery
```

Limites configurados no controller:

```text
profilePicture: 1 arquivo
gallery: 10 arq
```
