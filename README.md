# Foresight Web

Interface web do **Foresight**, projeto de gestão comercial e financeira. Este repositório contém uma aplicação **Angular 21 + TypeScript**, com Bootstrap e recursos organizados por domínio.

> **Escopo:** esta documentação descreve o frontend. O repositório [Foresight](https://github.com/gusty22/foresight) também reúne API Java/Spring Boot e infraestrutura Docker. A presença de telas e módulos no código não garante que todos os fluxos estejam concluídos ou integrados.

## Organização do código

A pasta `src/app` separa responsabilidades em `core/`, `shared/`, `layout/` e `features/`. As áreas encontradas em `features/` são:

- Autenticação e usuários
- Dashboard e relatórios
- Clientes, produtos e vendas
- Financeiro e empresa
- Auditoria e configurações

Consulte os componentes e serviços de cada área para verificar os fluxos implementados.

## Tecnologias

- Angular 21 e TypeScript
- Bootstrap 5 e Bootstrap Icons
- RxJS
- jsPDF e jsPDF AutoTable (dependências do projeto)
- Vitest (configurado no projeto)

## Executar localmente

**Pré-requisito:** Node.js e npm compatíveis com a versão do Angular utilizada.

```bash
git clone https://github.com/gusty22/foresight-web.git
cd foresight-web
npm ci
npm start
```

Acesse `http://localhost:4200`. Para gerar a compilação de produção:

```bash
npm run build
```

Para executar os testes configurados:

```bash
npm test
```

Algumas telas podem depender da API do Foresight. Consulte o repositório principal para instruções sobre backend e infraestrutura.

## Estrutura resumida

```text
src/app/
├── core/
├── features/
├── layout/
├── shared/
├── app.config.ts
└── app.routes.ts
```

## Estado e próximos passos

Projeto de desenvolvimento e aprendizado. Antes de utilizar em produção, valide autenticação, autorização, integração com a API, tratamento de erros e cobertura de testes. Não há demonstração pública verificada neste README.

## Repositório relacionado

- [Foresight — API e aplicação integrada](https://github.com/gusty22/foresight)
