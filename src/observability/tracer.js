const traces = [];

export function createTrace(data = {}) {
  const trace = {
    id: `trace-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    startedAt: new Date().toISOString(),
    events: [],
    ...data
  };
  traces.push(trace);
  return trace;
}

export function event(trace, name, data = {}) {
  trace.events.push({
    name,
    at: new Date().toISOString(),
    data
  });
}

export function finishTrace(trace) {
  trace.finishedAt = new Date().toISOString();
  trace.latencyMs =
    new Date(trace.finishedAt).getTime() -
    new Date(trace.startedAt).getTime();
}

export function getTraces() {
  return traces;
}

export function getSummary() {
  const total = traces.length;
  const errors = traces.filter(t =>
    t.events.some(e => e.name === "request_failed")
  ).length;

  const latencies = traces
    .map(t => t.latencyMs)
    .filter(Number.isFinite);

  return {
    requests: total,
    errors,
    successRate: total ? (total - errors) / total : 0,
    avgLatencyMs: latencies.length
      ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
      : 0
  };
}