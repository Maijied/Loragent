/**
 * Loragent OpenTelemetry-Compatible Tracer & Observability Layer
 * Tracks agent reasoning spans, tool calls, token usage, and latency.
 */
export class LoragentTracer {
  constructor(options = {}) {
    this.serviceName = options.serviceName || 'loragent-sdk';
    this.spans = [];
    this.activeSpans = new Map();
  }

  startSpan(name, attributes = {}) {
    const spanId = `span_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const span = {
      spanId,
      name,
      startTime: Date.now(),
      attributes,
      status: 'ACTIVE'
    };
    this.activeSpans.set(spanId, span);
    return spanId;
  }

  endSpan(spanId, output = null, error = null) {
    const span = this.activeSpans.get(spanId);
    if (!span) return null;

    span.endTime = Date.now();
    span.durationMs = span.endTime - span.startTime;
    span.status = error ? 'ERROR' : 'OK';
    span.output = output;
    span.error = error ? (error.message || String(error)) : null;

    this.activeSpans.delete(spanId);
    this.spans.push(span);
    return span;
  }

  getTraceSummary() {
    const total = this.spans.length;
    const errors = this.spans.filter(s => s.status === 'ERROR').length;
    const totalDuration = this.spans.reduce((acc, s) => acc + (s.durationMs || 0), 0);

    return {
      serviceName: this.serviceName,
      totalSpans: total,
      errorCount: errors,
      successRate: total > 0 ? ((total - errors) / total) * 100 : 100,
      totalDurationMs: totalDuration,
      recentSpans: this.spans.slice(-10)
    };
  }
}
