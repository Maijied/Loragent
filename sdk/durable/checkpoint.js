import fs from 'node:fs';
import path from 'node:path';

/**
 * LoragentCheckpointEngine — Durable Agentic State & Checkpointing
 * Enables step-level state persistence, time-travel debugging, and fault-tolerant resumption.
 */
export class LoragentCheckpointEngine {
  constructor(options = {}) {
    this.storageDir = options.storageDir || path.join(process.cwd(), '.loragent', 'checkpoints');
    this._ensureStorage();
  }

  _ensureStorage() {
    try {
      if (!fs.existsSync(this.storageDir)) {
        fs.mkdirSync(this.storageDir, { recursive: true });
      }
    } catch {
      // Memory fallback if filesystem unavailable
    }
  }

  /**
   * Save a state checkpoint
   */
  async saveCheckpoint(taskId, stepIndex, state = {}, metadata = {}) {
    const checkpointId = `chk_${taskId}_step_${stepIndex}_${Date.now()}`;
    const data = {
      checkpointId,
      taskId,
      stepIndex,
      timestamp: new Date().toISOString(),
      state,
      metadata
    };

    const filePath = path.join(this.storageDir, `${checkpointId}.json`);
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.warn('[CHECKPOINT] Failed to write checkpoint to disk:', err.message);
    }

    return data;
  }

  /**
   * Load checkpoint by ID
   */
  async loadCheckpoint(checkpointId) {
    const filePath = path.join(this.storageDir, `${checkpointId}.json`);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Checkpoint not found: ${checkpointId}`);
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  /**
   * List all checkpoints for a task
   */
  async listCheckpoints(taskId) {
    if (!fs.existsSync(this.storageDir)) return [];
    const files = fs.readdirSync(this.storageDir);
    const checkpoints = [];

    for (const f of files) {
      if (f.endsWith('.json') && (!taskId || f.includes(taskId))) {
        try {
          const content = JSON.parse(fs.readFileSync(path.join(this.storageDir, f), 'utf8'));
          checkpoints.push(content);
        } catch {}
      }
    }

    return checkpoints.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  /**
   * Get latest checkpoint for task to resume execution
   */
  async getLatestCheckpoint(taskId) {
    const list = await this.listCheckpoints(taskId);
    return list.length > 0 ? list[list.length - 1] : null;
  }
}
