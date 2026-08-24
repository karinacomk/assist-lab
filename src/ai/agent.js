import { askLLMWithTools } from "./llm.js";
import { executeTool, toolDefinitions } from "./tools.js";
import { retrieve } from "./rag.js";
import { createTrace, event, finishTrace } from "../observability/tracer.js";

export async function runAgent(message, context = {}) {
  const trace = createTrace({ type: "agent", message });

  try {
    event(trace, "request_started", { message });

    const response = await askLLMWithTools({
      message,
      tools: toolDefinitions,
      system: "Você é o Ada Assist. Não invente dados."
    });

    if (response.toolCall?.name) {
      event(trace, "tool_requested", {
        tool: response.toolCall.name
      });

      const result = await executeTool(
        response.toolCall.name,
        response.toolCall.arguments,
        context
      );

      event(trace, "tool_completed", {
        tool: response.toolCall.name
      });

      const final = await askLLMWithTools({
        message,
        toolResult: {
          name: response.toolCall.name,
          result
        }
      });

      event(trace, "request_completed", { success: true });
      finishTrace(trace);

      return {
        mode: "mock-agent",
        answer: final.text,
        trace
      };
    }

    const docs = retrieve(message);

    if (docs.length) {
      event(trace, "rag_retrieval", {
        documents: docs.map(d => d.id)
      });
    }

    event(trace, "request_completed", { success: true });
    finishTrace(trace);

    return {
      mode: "mock-agent",
      answer: docs.length
        ? docs.map(d => d.text).join(" ")
        : response.text,
      trace
    };
  } catch (error) {
    event(trace, "request_failed", { error: error.message });
    finishTrace(trace);
    throw error;
  }
}