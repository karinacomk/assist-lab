import { callMcpTool, listMcpTools } from "./mcp/client.js";
import { askLLMWithTools } from "./llm.js";
import {
  createTrace,
  event,
  finishTrace
} from "../observability/tracer.js";

export async function runMcpAgent(message) {
  const trace = createTrace({
    type: "mcp_agent",
    message
  });

  try {
    event(trace, "mcp_request_started", { message });

    const mcpTools = await listMcpTools();

    event(trace, "mcp_tools_discovered", {
      count: mcpTools.length,
      tools: mcpTools.map(tool => tool.name)
    });

    const response = await askLLMWithTools({
      message,
      tools: mcpTools,
      system: `
Você é o Ada Assist em modo MCP.
Use as ferramentas MCP quando necessário.
Para documentação, use buscar_documentacao.
Não invente dados.
`
    });

    if (response.toolCall?.name) {
      event(trace, "mcp_tool_requested", {
        tool: response.toolCall.name
      });

      const started = Date.now();

      const result = await callMcpTool(
        response.toolCall.name,
        response.toolCall.arguments
      );

      event(trace, "mcp_tool_completed", {
        tool: response.toolCall.name,
        latencyMs: Date.now() - started
      });

      const final = await askLLMWithTools({
        message,
        toolResult: {
          name: response.toolCall.name,
          result
        }
      });

      event(trace, "mcp_request_completed", { success: true });
      finishTrace(trace);

      return {
        mode: "mcp",
        answer: final.text,
        trace
      };
    }

    event(trace, "mcp_request_completed", { success: true });
    finishTrace(trace);

    return {
      mode: "mcp",
      answer: response.text,
      trace
    };
  } catch (error) {
    event(trace, "mcp_request_failed", {
      error: error.message
    });
    finishTrace(trace);
    throw error;
  }
}