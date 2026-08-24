import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { initializeRag, getRagStatus } from "./ai/rag.js";
import { runAgent } from "./ai/agent.js";
import { runMcpAgent } from "./ai/mcp-agent.js";
import { getSummary, getTraces } from "./observability/tracer.js";
import { toolNames } from "./ai/tools.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

await initializeRag();

app.post("/api/chat", async (req, res) => {
  try {
    const { message, confirmedCancellation = false } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: "Mensagem obrigatória." });
    }

    res.json(await runAgent(message.trim(), { confirmedCancellation }));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/observability", (_req, res) => {
  res.json({
    summary: getSummary(),
    traces: getTraces().slice().reverse().slice(0, 20)
  });
});

app.get("/api/architecture", (_req, res) => {
  res.json({
    model: process.env.LLM_MODEL || "mock-llm",
    mockMode: process.env.MOCK_MODE !== "false",
    rag: getRagStatus(),
    tools: toolNames()
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/mcp/tools", async (_req, res) => {
  const { listMcpTools } = await import("./ai/mcp/client.js");
  res.json({ tools: await listMcpTools() });
});

app.post("/api/mcp/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: "Mensagem obrigatória." });
    }

    res.json(await runMcpAgent(message.trim()));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/dashboard", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/dashboard.html"));
});

app.get("/mcp", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/mcp.html"));
});

app.listen(port, () => {
  console.log(`🚀 Ada Assist Lab running at http://localhost:${port}`);
  console.log(`🤖 MOCK_MODE=${process.env.MOCK_MODE !== "false"}`);
});