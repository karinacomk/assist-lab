import { documents } from "../data/knowledge.js";

function tokens(text) {
  return new Set(
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .split(/\W+/)
      .filter(Boolean)
  );
}

export async function initializeRag() {
  return true;
}

export function retrieve(query, topK = 2) {
  const q = tokens(query);

  return documents
    .map(doc => {
      const d = tokens(`${doc.title} ${doc.text}`);
      const score = [...q].filter(token => d.has(token)).length;
      return { ...doc, score };
    })
    .filter(doc => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

export function getRagStatus() {
  return {
    initialized: true,
    documents: documents.length,
    type: "local mock retrieval"
  };
}