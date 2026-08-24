export async function askLLMWithTools({
  message,
  tools = [],
  system = "",
  toolResult = null
}) {
  // Mock intentionally: no external LLM/API is called.
  if (toolResult) {
    return {
      text: `Resultado da tool "${toolResult.name}": ${JSON.stringify(toolResult.result)}`
    };
  }

  const lower = message.toLowerCase();

  if (lower.includes("métrica") || lower.includes("metrica") || lower.includes("performance")) {
    return {
      toolCall: {
        name: tools.find(t => t.name === "consultar_metricas_campanha")?.name,
        arguments: { campanhaId: "camp-001" }
      }
    };
  }

  if (lower.includes("pedido") && lower.includes("cancel")) {
    return {
      toolCall: {
        name: tools.find(t => t.name === "cancelar_pedido")?.name,
        arguments: { pedidoId: "ped-001" }
      }
    };
  }

  if (lower.includes("campanha")) {
    return {
      toolCall: {
        name: tools.find(t => t.name === "consultar_metricas_campanha")?.name,
        arguments: { campanhaId: "camp-001" }
      }
    };
  }

  return {
    text: `Modo mock: recebi sua pergunta e não precisei executar uma tool.`
  };
}