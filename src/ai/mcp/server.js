/**
 * Mini MCP Server (didactic/mock).
 * Não é o SDK oficial do MCP.
 */

import { executeTool, toolDefinitions } from "../tools.js";
import { retrieve } from "../rag.js";

const tools = [
  ...toolDefinitions,
  {
    name: "buscar_documentacao",
    description: "Busca documentação usando RAG.",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"]
    }
  }
];

export function listTools() {
  return tools;
}

export async function callTool(name, args = {}, context = {}) {
  if (name === "buscar_documentacao") {
    const docs = retrieve(args.query || "");
    return {
      results: docs.map(doc => ({
        id: doc.id,
        title: doc.title,
        text: doc.text,
        score: doc.score
      }))
    };
  }

  return executeTool(name, args, context);
}