# DEPLOYMENT.md — Produção e Implantação

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
