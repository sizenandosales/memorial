# API.md — API do My Memo

## 1. Base

Backend local: `http://localhost:3000`

Swagger: `http://localhost:3000/api`

## 2. Autenticação

### POST /auth/login

Realiza login.

### POST /auth/register

Cria cadastro de usuário.

### POST /auth/refresh

Atualiza tokens. O backend atualmente espera `userId` e `refreshToken`. Existe uma divergência conhecida: o frontend atual envia somente `refreshToken`. Não corrigir automaticamente sem decisão explícita.

### GET /auth/verify

Verifica e-mail utilizando token em query string.

### POST /auth/forgot-password

Inicia recuperação de senha.

### POST /auth/reset-password

Redefine senha usando token.

## 3. Memoriais

### POST /memorials

Cria memorial autenticado. Utiliza multipart/form-data e aceita uma fotografia de perfil e até dez imagens de galeria.

### GET /memorials

Lista memoriais do usuário autenticado.

### GET /memorials/:slug

Consulta pública de memorial por slug.

### PATCH /memorials/:slug

Atualiza memorial autenticado.

### PATCH /memorials/:slug/status

Altera status do memorial autenticado.

### DELETE /memorials/:slug

Exclui memorial autenticado.

## 4. Mural público

### GET /memorials/:id/approved-messages

Consulta mensagens aprovadas.

### POST /memorials/:id/messages

Permite envio público de mensagem. A mensagem é criada como `PENDING`.

## 5. Mural administrativo

### GET /memorials/:slug/messages/all

Lista mensagens para administração.

### PATCH /memorials/messages/:id/status

Altera o status de uma mensagem.

Existe um ponto conhecido no serviço: a alteração de status não verifica atualmente a propriedade do memorial pelo usuário autenticado. Isso deve ser tratado como ponto de atenção de autorização e não deve ser alterado silenciosamente.

## 6. Autorização

Rotas administrativas utilizam JWT. Rotas públicas do memorial não exigem autenticação.

## 7. Validação e erros

O backend utiliza validação global com whitelist, `forbidNonWhitelisted` e transformação. Erros são tratados pelo filtro global de exceções.

## 8. CORS

No desenvolvimento local, o backend permite comunicação com `http://localhost:4200` com credenciais.

## 9. Regra para IA

Antes de alterar uma API, verificar controller, DTO, service, frontend consumidor e Swagger. Preservar compatibilidade quando possível e atualizar este documento se o contrato mudar.
