# AUTHENTICATION.md — Autenticação e Autorização

## 1. Visão geral

O My Memo utiliza autenticação baseada em JWT, com cadastro, verificação de e-mail, login, access token, refresh token e recuperação de senha.

## 2. Cadastro e verificação

O cadastro cria um token de verificação e envia e-mail. O usuário permanece não verificado até concluir a confirmação.

Endpoint: `GET /auth/verify?token=...`

## 3. Login

O login valida usuário, senha e estado de verificação. A senha é comparada utilizando bcrypt. Após validação são gerados access token e refresh token.

## 4. JWT

Payload conhecido:

```text
sub
email
role
```

Access token: aproximadamente 15 minutos. Refresh token: aproximadamente 7 dias.

## 5. Refresh token

O backend armazena uma versão protegida do refresh token no banco.

Endpoint: `POST /auth/refresh`

O backend atualmente exige `userId` e `refreshToken`. O frontend possui uma divergência conhecida e envia somente `refreshToken`.

## 6. Frontend

O access token é atualmente mantido em `localStorage` usando a chave `access_token`.

O interceptor ativo adiciona:

```text
Authorization: Bearer <access_token>
```

## 7. Guard

O `authGuard` atual verifica a existência do token no navegador. Ele não valida localmente a validade criptográfica do JWT. A proteção efetiva das APIs permanece no backend.

## 8. Recuperação de senha

Existe fluxo de `forgot-password` e `reset-password`, com validade limitada para o token de recuperação.

## 9. E-mails

Os fluxos atuais possuem URLs de localhost. Antes da produção, essas URLs devem ser parametrizadas para o domínio correto.

## 10. Segurança

Nunca colocar em documentação: senhas, secrets, chaves Supabase, JWT reais, tokens de recuperação, tokens de verificação ou credenciais de banco.

## 11. Regra para IA

Alterações de autenticação são sensíveis. Antes de alterar, verificar backend, frontend, contrato da API, guards, interceptors e armazenamento de tokens. Testar login e rotas protegidas. Não criar refresh automático, logout ou mudanças de armazenamento apenas por iniciativa da IA.
