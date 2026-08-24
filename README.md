# Ada Assist Lab

Laboratório local para estudar **Agent + RAG + Tools + MCP + Observabilidade + Evaluation**.

## Rodar

```bash
npm install
cp .env.example .env
npm run dev
```

Abra:

- http://localhost:3000
- http://localhost:3000/dashboard
- http://localhost:3000/mcp

O projeto funciona em `MOCK_MODE=true` e **não chama nenhuma API externa**.

## Estrutura

```text
src/
├── server.js
├── eval.js
├── ai/
│   ├── agent.js
│   ├── llm.js
│   ├── mcp-agent.js
│   ├── rag.js
│   ├── tools.js
│   └── mcp/
│       ├── client.js
│       └── server.js
├── data/
└── observability/
```

## O que estudar

### Agent

`src/ai/agent.js`

Orquestra LLM mock, RAG, tools e observabilidade.

### RAG

`src/ai/rag.js`

Retriever local simples. Não usa vector database externo.

### Tools

`src/ai/tools.js`

Tools de negócio mockadas.

### MCP

`src/ai/mcp/`

Implementação didática da ideia de MCP.

```text
Agent
 ↓
MCP Client
 ↓
MCP Server
 ↓
Tools / RAG
```

Não é o SDK oficial do MCP.

### Observabilidade

`src/observability/tracer.js`

Registra traces, eventos, latência e resumo de execução.

### Evaluation

```bash
npm run eval
```

## Importante

Esta versão foi revisada para manter os imports consistentes com a estrutura de pastas. Não é necessário instalar nenhuma dependência adicional além de `npm install`.
