import { runAgent } from "./ai/agent.js";

const cases = [
  ["O que é CTR?", "CTR"],
  ["Qual é a performance da campanha?", "CTR"],
  ["Qual é o status da campanha?", "Resultado da tool"]
];

let passed = 0;

for (const [question, expected] of cases) {
  const result = await runAgent(question);
  const ok = result.answer.toLowerCase().includes(expected.toLowerCase());
  console.log(`${ok ? "PASS" : "FAIL"} — ${question}`);
  if (ok) passed++;
}

console.log(`\nEvaluation: ${passed}/${cases.length}`);
