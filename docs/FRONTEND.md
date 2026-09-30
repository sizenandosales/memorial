# FRONTEND.md — Frontend Angular do My Memo

## 1. Tecnologia

Localização: `frontend/`

Tecnologias: Angular 21, TypeScript, Angular Router, HttpClient, SSR, Express 5 e RxJS.

## 2. Rotas

Rotas conhecidas:

```text
/
/auth/login
/auth/register
/dashboard
/dashboard/memorials/new
/dashboard/memorials/edit/:slug
/dashboard/memorials/messages/:slug
/memorial/:slug
```

Existe redirecionamento de wildcard para `/`.

## 3. Área autenticada

O dashboard utiliza `authGuard`, que verifica `localStorage.getItem('access_token')`.

## 4. Interceptor

O interceptor ativo está em `src/app/services/auth.interceptor.ts` e adiciona o header Bearer às requisições protegidas.

A rota pública de memorial é tratada como exceção.

## 5. Serviço de autenticação

O serviço ativo utiliza a API local `http://localhost:3000/auth` e possui métodos relacionados a register, login, refreshToken, verifyToken, forgotPassword e resetPassword.

## 6. Serviço de memorial

O serviço ativo está em `src/app/services/memorial.service.ts` e realiza chamadas relacionadas a listar, criar, atualizar, alterar status, consultar mensagens e excluir.

## 7. Formulários

A criação utiliza `FormData` para fotografia de perfil e imagens de galeria. A edição atual utiliza JSON e não envia imagens selecionadas.

## 8. Memorial público

A página pública carrega o memorial pelo slug, carrega mensagens aprovadas, permite envio de mensagem e possui lightbox para imagens.

## 9. SSR

O frontend utiliza Angular SSR com Express e `AngularNodeAppEngine`. O servidor SSR usa a porta definida por `PORT` ou, localmente, 4000.

## 10. Código legado

Existem arquivos antigos/duplicados, incluindo interceptor legado, serviço de memorial legado e componente antigo de criação. Não excluir automaticamente. Antes de remover, confirmar referências e impacto.

## 11. Regra para IA

Antes de criar componente, service, guard ou interceptor: procurar se já existe, identificar qual versão está ativa, verificar imports e rotas, evitar duplicação, alterar somente o necessário e testar.
