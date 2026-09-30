# DATABASE.md — Banco de Dados do My Memo

## 1. Tecnologia

O My Memo utiliza PostgreSQL como banco de dados relacional e Prisma como ORM.

O schema principal está em `backend/prisma/schema.prisma`.

## 2. Modelos atuais

- `User`
- `Partner`
- `Memorial`
- `MuralMessage`

## 3. User

Representa o usuário autenticado responsável por memoriais.

Campos conhecidos incluem `id`, `name`, `email`, `password`, `role`, `createdAt`, `updatedAt`, dados de endereço, telefone, documento, `refreshToken`, `isVerified` e tokens relacionados à verificação e recuperação de senha.

E-mail e documento possuem restrições de unicidade.

## 4. Partner

Representa parceiros existentes na arquitetura atual.

Campos conhecidos: `id`, `name`, `cpfCnpj`, `email`, `password`, `role`, `totalSales`, `createdAt`.

CPF/CNPJ e e-mail possuem unicidade.

A lógica comercial completa dos parceiros ainda não está definida.

## 5. Memorial

Representa o memorial digital.

Campos conhecidos:

- `id`
- `slug`
- `fullName`
- `birthDate`
- `deathDate`
- `birthCity`
- `deathCity`
- `cemetery`
- `biography`
- `profilePicture`
- `gallery`
- `status`
- `expiresAt`
- `createdAt`
- `userId`
- `partnerId`

O `slug` é único.

## 6. MuralMessage

Representa mensagem enviada por visitante.

Campos conhecidos: `id`, `visitorName`, `message`, `status`, `createdAt`, `memorialId`.

O status inicial é `PENDING`. Mensagens aprovadas utilizam `APPROVED`.

## 7. Relações

```text
User
  |
  +----< Memorial
             |
             +----< MuralMessage

Partner
  |
  +----< Memorial
```

## 8. Segurança

Senhas não devem ser armazenadas em texto puro. Tokens e credenciais não devem ser expostos em documentação ou commits. Arquivos `.env` devem permanecer fora do controle de versão.

## 9. Alterações de banco

Antes de modificar o schema:

1. verificar modelos e relações existentes;
2. procurar uso no backend;
3. procurar uso no frontend;
4. avaliar compatibilidade;
5. executar alteração controlada;
6. testar;
7. atualizar este documento.

## 10. Fonte de verdade

Este documento é referência explicativa. O `schema.prisma` real permanece como fonte técnica primária.

## 11. Regra para IA

Não criar tabelas, campos, relações, enums ou regras de negócio por suposição. Toda alteração estrutural deve ter motivo claro e ser documentada.
