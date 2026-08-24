/**
 * Mini MCP Client (didactic/mock).
 * Em um MCP real, esta fronteira falaria o protocolo MCP com um servidor.
 */

import { callTool, listTools } from "./server.js";

export async function listMcpTools() {
  return listTools();
}

export async function callMcpTool(name, args, context = {}) {
  return callTool(name, args, context);
}