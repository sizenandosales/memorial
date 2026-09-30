# STORAGE.md — Armazenamento de Arquivos

## 1. Tecnologia

O My Memo utiliza Supabase Storage para armazenar arquivos relacionados aos memoriais.

## 2. Configuração

Variáveis utilizadas incluem:

```text
SUPABASE_URL
SUPABASE_KEY
SUPABASE_BUCKET
```

Existe fallback atual para o bucket `memorial-files`.

## 3. Estrutura conhecida

```text
profiles/
gallery/
```

Os arquivos recebem caminhos gerados pelo serviço, incluindo elementos de data, aleatoriedade e extensão.

## 4. Fotografia de perfil

A fotografia principal é enviada para `profiles/` e a URL retornada é armazenada no memorial.

## 5. Galeria

Imagens da galeria são enviadas para `gallery/`. O memorial mantém uma lista de URLs.

## 6. Fluxo

```text
Frontend → multipart/form-data → NestJS → SupabaseService → Supabase Storage → URL → Banco
```

## 7. Segurança

Credenciais Supabase nunca devem ser colocadas no Git. O `.env` deve permanecer protegido.

## 8. Evolução futura

Qualquer migração deve considerar preservação de arquivos, atualização de URLs, compatibilidade dos memoriais existentes, backup e rollback.

## 9. Regra para IA

Não mudar bucket, estrutura de pastas ou estratégia de URLs sem verificar o código e avaliar impacto sobre memoriais existentes.
