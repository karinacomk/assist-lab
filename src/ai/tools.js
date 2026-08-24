import { campaigns, orders } from "../data/mock-data.js";

export const toolDefinitions = [
  {
    name: "consultar_pedido",
    description: "Consulta o status de um pedido.",
    inputSchema: {
      type: "object",
      properties: { pedidoId: { type: "string" } },
      required: ["pedidoId"]
    }
  },
  {
    name: "cancelar_pedido",
    description: "Cancela um pedido.",
    inputSchema: {
      type: "object",
      properties: { pedidoId: { type: "string" } },
      required: ["pedidoId"]
    }
  },
  {
    name: "consultar_metricas_campanha",
    description: "Consulta métricas de uma campanha.",
    inputSchema: {
      type: "object",
      properties: { campanhaId: { type: "string" } },
      required: ["campanhaId"]
    }
  }
];

export function toolNames() {
  return toolDefinitions.map(t => t.name);
}

export async function executeTool(name, args = {}) {
  switch (name) {
    case "consultar_pedido":
      return orders[args.pedidoId] ?? { error: `Pedido ${args.pedidoId} não encontrado` };

    case "cancelar_pedido": {
      const order = orders[args.pedidoId];
      if (!order) return { error: `Pedido ${args.pedidoId} não encontrado` };
      if (order.status === "cancelled") return order;
      order.status = "cancelled";
      return { success: true, ...order };
    }

    case "consultar_metricas_campanha": {
      const campaign = campaigns[args.campanhaId];
      if (!campaign) return { error: `Campanha ${args.campanhaId} não encontrada` };

      return {
        campanhaId: args.campanhaId,
        impressions: 1284000,
        clicks: 35952,
        ctr: 2.8,
        conversions: 1240,
        spend: 87200,
        status: campaign.status
      };
    }

    default:
      return { error: `Tool desconhecida: ${name}` };
  }
}