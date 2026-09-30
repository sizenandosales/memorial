# PROJECT.md — Visão e Regras do Produto My Memo

## 1. Identidade do produto

**Nome:** My Memo

**Domínio:** mymemo.com.br

**Tagline:** Preservando Memórias

O My Memo é uma plataforma digital dedicada à criação e preservação de memoriais digitais.

A proposta central é permitir que informações, histórias, fotografias e mensagens relacionadas a uma pessoa falecida sejam preservadas digitalmente e possam ser acessadas ao longo do tempo.

O acesso público ao memorial poderá ser realizado por meio de uma URL própria e, futuramente, por um QR Code instalado em túmulo, lápide, placa ou outro local associado à memória da pessoa homenageada.

---

# 2. Propósito

O propósito do My Memo é ajudar famílias e pessoas próximas a preservar a memória de seus entes queridos por meio de um memorial digital.

O produto deve tratar o memorial não apenas como uma página web, mas como um espaço de memória.

A plataforma deve permitir que informações importantes sobre uma pessoa possam permanecer disponíveis para familiares, amigos e futuras gerações.

O conceito fundamental do produto é:

> **Preservar memórias para que histórias e pessoas não sejam esquecidas.**

---

# 3. Visão de longo prazo

A visão do My Memo é tornar-se uma plataforma de preservação de memória digital de longo prazo.

O projeto deve evoluir de maneira que os memoriais possam permanecer acessíveis durante muitos anos, respeitando a sustentabilidade técnica e financeira do serviço.

A arquitetura deve, portanto, evitar decisões que dificultem a manutenção futura da plataforma.

Sempre que possível, funcionalidades devem ser construídas de maneira modular para permitir evolução posterior.

---

# 4. Conceito do memorial digital

Cada pessoa homenageada poderá possuir um memorial digital próprio.

O memorial possui uma URL pública baseada em um `slug`.

Exemplo conceitual:

```text
/memorial/nome-da-pessoa-1234
```

A página pública poderá apresentar informações como:

- nome completo;
- fotografia principal;
- data de nascimento;
- data de falecimento;
- cidade de nascimento;
- cidade de falecimento;
- cemitério;
- biografia;
- galeria de fotografias;
- mensagens deixadas por visitantes.

A estrutura poderá ser ampliada futuramente.

---

# 5. QR Code

O QR Code é uma parte importante da visão do produto.

A ideia é que um QR Code associado ao memorial possa ser colocado fisicamente em:

- túmulos;
- lápides;
- placas memoriais;
- jazigos;
- espaços de homenagem.

Ao escanear o QR Code, o visitante deverá ser direcionado diretamente para o memorial digital correspondente.

O QR Code deverá funcionar como uma ponte entre o espaço físico da memória e o espaço digital.

### Importante

O QR Code é parte da visão do produto, mas sua implementação pode não estar concluída na versão atual do sistema.

Não considerar funcionalidades de geração, gerenciamento ou impressão de QR Code como existentes simplesmente por fazerem parte da visão do produto.

---

# 6. Usuário proprietário do memorial

O usuário proprietário é a pessoa responsável pela criação e administração de seus memoriais.

No sistema atual existe o modelo `User`.

O proprietário deverá poder, conforme as funcionalidades disponíveis:

- criar um memorial;
- informar os dados da pessoa homenageada;
- enviar fotografia;
- enviar imagens para a galeria;
- editar informações;
- visualizar seus memoriais;
- administrar mensagens;
- alterar o status do memorial;
- excluir um memorial.

O acesso administrativo aos memoriais é protegido por autenticação.

---

# 7. Visitante

O visitante é uma pessoa que acessa um memorial público.

O visitante não precisa necessariamente possuir uma conta para visualizar um memorial público.

A experiência pública deve ser simples e acessível.

O visitante poderá visualizar informações do homenageado e, conforme as funcionalidades atuais, enviar uma mensagem para o mural.

As mensagens enviadas por visitantes não devem aparecer automaticamente como aprovadas.

O fluxo atual utiliza o conceito:

```text
Visitante
   ↓
Envia mensagem
   ↓
Mensagem PENDING
   ↓
Proprietário/administração analisa
   ↓
Mensagem APPROVED
   ↓
Mensagem aparece publicamente
```

---

# 8. Mural de mensagens

O mural é um espaço destinado a mensagens de pessoas que desejam registrar uma lembrança, homenagem ou manifestação relacionada ao falecido.

No modelo atual, uma mensagem possui:

- nome do visitante;
- conteúdo da mensagem;
- status;
- data de criação;
- memorial relacionado.

O status padrão é:

```text
PENDING
```

Uma mensagem aprovada utiliza:

```text
APPROVED
```

A arquitetura atual prevê moderação antes da publicação.

Essa regra deve ser preservada em futuras alterações, salvo decisão explícita em sentido diferente.

---

# 9. Privacidade e controle

O memorial possui uma distinção importante entre:

### Área administrativa

Acessada pelo proprietário autenticado.

Contém funcionalidades de gerenciamento do memorial.

### Área pública

Acessada por visitantes.

Permite visualizar o memorial e utilizar as funcionalidades públicas disponíveis.

Essa separação deve ser preservada na arquitetura.

Informações e operações administrativas não devem ser expostas simplesmente porque existe uma página pública do memorial.

---

# 10. Parceiros

O sistema possui atualmente o modelo `Partner`.

O conceito de parceiro faz parte da arquitetura atual do produto.

Um parceiro poderá futuramente representar uma pessoa ou organização que participe da comercialização ou disponibilização dos memoriais.

O modelo atualmente possui informações como:

- nome;
- CPF/CNPJ;
- e-mail;
- senha;
- função;
- total de vendas.

A lógica comercial completa dos parceiros ainda não deve ser considerada totalmente definida.

Não inventar regras de comissão, planos ou repasses sem uma decisão específica do projeto.

---

# 11. Modelo comercial

O My Memo possui potencial para funcionar como um serviço pago.

A arquitetura já contém elementos relacionados a:

- parceiros;
- expiração de memoriais;
- notificações de expiração.

Entretanto, o modelo comercial definitivo ainda não está completamente especificado.

Possíveis mecanismos de pagamento poderão ser integrados futuramente, incluindo:

- Mercado Pago;
- PagSeguro;
- outros meios de pagamento.

### Regra importante

Integração com gateway de pagamento não deve ser considerada existente apenas porque está planejada.

Enquanto não estiver implementada e documentada, deve ser tratada como funcionalidade futura.

---

# 12. Expiração do memorial

O sistema atual possui o conceito de `expiresAt`.

Isso indica que um memorial pode possuir uma data de expiração.

Existe também uma rotina automática que verifica memoriais próximos da expiração e envia notificações.

Atualmente essa rotina tem finalidade de aviso.

Ela não deve ser interpretada como um sistema completo de cobrança, renovação ou bloqueio.

A política definitiva de expiração e renovação ainda poderá ser aprimorada.

---

# 13. Funcionalidades atualmente existentes

De acordo com o estado atual do código, o sistema possui funcionalidades relacionadas a:

### Conta

- cadastro;
- verificação de e-mail;
- login;
- recuperação de senha;
- redefinição de senha;
- autenticação por JWT;
- refresh token no backend.

### Memorial

- criação;
- edição;
- consulta;
- exclusão;
- alteração de status;
- slug público;
- fotografia de perfil;
- galeria de imagens;
- biografia;
- informações de nascimento e falecimento;
- cemitério;
- data de expiração.

### Mural

- envio público de mensagem;
- consulta de mensagens aprovadas;
- consulta administrativa das mensagens;
- aprovação/moderação.

### Armazenamento

- upload de arquivos utilizando Supabase Storage.

### Notificações

- envio de e-mails;
- aviso de proximidade da expiração.

---

# 14. Funcionalidades previstas para evolução

As funcionalidades abaixo fazem parte da direção ou das possibilidades futuras do produto, mas não devem ser tratadas como implementadas enquanto não estiverem efetivamente presentes no código:

- geração automática de QR Code;
- gerenciamento de QR Codes;
- impressão ou personalização de QR Code;
- planos de assinatura;
- pagamentos online;
- renovação automática;
- área específica para parceiros;
- expansão das galerias;
- vídeos;
- áudios;
- documentos;
- linha do tempo da vida da pessoa;
- recursos avançados de homenagem;
- melhorias de compartilhamento;
- mecanismos avançados de preservação de longo prazo.

A lista pode ser alterada conforme a evolução do produto.

---

# 15. Funcionalidades fora do escopo atual

Até que uma decisão diferente seja registrada, não considerar como prioridade da versão atual:

- aplicativo mobile nativo;
- hospedagem própria de vídeos em grande escala;
- infraestrutura própria de streaming;
- rede social completa;
- sistema complexo de mensagens privadas;
- marketplace;
- funcionalidades financeiras avançadas para parceiros;
- integração automática de todos os meios de pagamento.

Essas funcionalidades poderão ser reconsideradas no futuro.

---

# 16. Princípio de evolução do produto

O My Memo deve evoluir de forma incremental.

Uma nova funcionalidade deve ser adicionada somente depois de:

1. compreender a arquitetura existente;
2. identificar os módulos afetados;
3. verificar se já existe alguma implementação relacionada;
4. evitar duplicação;
5. preservar funcionalidades existentes;
6. definir as regras de negócio;
7. implementar;
8. testar;
9. atualizar a documentação.

Não modificar estruturas existentes apenas para seguir uma arquitetura teórica.

A arquitetura deve servir ao produto real.

---

# 17. Princípio de preservação da memória

O produto possui uma característica diferente de aplicações convencionais.

O conteúdo armazenado pode representar memória familiar e afetiva.

Por isso, a plataforma deve considerar, desde sua arquitetura inicial:

- durabilidade dos dados;
- segurança;
- possibilidade de recuperação;
- manutenção de longo prazo;
- estabilidade das URLs;
- preservação dos arquivos;
- migração futura de infraestrutura;
- continuidade do serviço.

Mudanças técnicas futuras devem considerar o impacto potencial sobre memoriais já publicados.

---

# 18. URLs e estabilidade

A URL pública de um memorial é parte importante da experiência do produto.

Uma vez divulgada ou associada a um QR Code físico, uma URL não deve ser alterada sem uma razão importante.

O sistema deve buscar preservar a estabilidade dos `slugs`.

Qualquer mudança futura na estratégia de URLs deve considerar:

- QR Codes já distribuídos;
- links compartilhados;
- mecanismos de busca;
- familiares que tenham salvo o endereço;
- possibilidade de redirecionamento.

---

# 19. Segurança

A segurança é requisito fundamental do produto.

As operações administrativas devem exigir autenticação adequada.

Dados de autenticação não devem ser expostos desnecessariamente.

Senhas devem permanecer armazenadas de forma protegida.

Tokens e credenciais não devem ser incluídos na documentação pública ou enviados ao repositório.

Arquivos `.env` e outras informações secretas devem permanecer fora do controle de versão conforme as regras do projeto.

---

# 20. Regra para desenvolvimento com IA

O projeto poderá utilizar ferramentas de inteligência artificial para auxiliar no desenvolvimento.

A IA deve tratar os documentos existentes em `docs/` como contexto técnico do projeto.

Antes de propor ou implementar alterações relevantes, a IA deverá:

1. consultar `docs/CURRENT-STATE.md`;
2. consultar os demais documentos técnicos relevantes;
3. verificar o código real;
4. identificar funcionalidades existentes;
5. evitar criar componentes ou serviços duplicados;
6. não assumir que uma funcionalidade planejada já existe;
7. explicar alterações estruturais relevantes;
8. preservar funcionalidades existentes;
9. atualizar a documentação quando uma decisão importante for tomada.

---

# 21. Regra contra funcionalidades imaginárias

Uma das regras mais importantes do projeto é:

> **Planejado não significa implementado.**

Uma funcionalidade mencionada neste documento como futura não pode ser apresentada pela IA como existente.

Da mesma forma, uma funcionalidade existente no código não deve ser considerada concluída apenas porque está descrita neste documento.

O código e a documentação devem permanecer coerentes.

---

# 22. Relação entre documentação e código

A documentação do projeto possui funções diferentes.

### CURRENT-STATE.md

Descreve:

> **Como o sistema está agora.**

### PROJECT.md

Descreve:

> **O que é o produto, seu propósito e suas regras gerais.**

### ARCHITECTURE.md

Descreverá:

> **Como os componentes técnicos se relacionam.**

### DATABASE.md

Descreverá:

> **Como os dados são estruturados.**

### API.md

Descreverá:

> **Quais APIs existem e como funcionam.**

### AUTHENTICATION.md

Descreverá:

> **Como autenticação e autorização funcionam.**

### FRONTEND.md

Descreverá:

> **Como o Angular está organizado.**

### STORAGE.md

Descreverá:

> **Como arquivos e armazenamento são tratados.**

### DEVELOPMENT-AND-DEPLOYMENT.md

Descreverá:

> **Como executar e desenvolver o projeto e como o sistema será colocado em produção.**

### DECISIONS.md

Registrará:

> **Por que decisões técnicas importantes foram tomadas.**

---

# 23. Regra principal do projeto

O My Memo deve ser desenvolvido como um produto real e de longo prazo.

A prioridade deve ser:

- clareza;
- segurança;
- simplicidade;
- manutenção;
- estabilidade;
- preservação dos dados;
- evolução incremental.

Novas tecnologias ou arquiteturas somente devem ser introduzidas quando trouxerem benefício concreto para o produto.

---

## Estado deste documento

Este documento descreve a visão, os princípios e o escopo conhecido do produto My Memo.

Ele não substitui a documentação técnica do estado atual do código.

Quando houver mudança significativa nas regras de negócio ou na visão do produto, este documento deverá ser revisado.
