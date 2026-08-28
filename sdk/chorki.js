import { LoragentClient } from './client.js';
import { LifecycleHooks } from './constants.js';

/**
 * LoragentChorki — The Relentless Autonomous Autopilot Loop Engine
 * Loops through execution until the verification hook passes 100%.
 */
export class LoragentChorki {
  constructor(options = {}) {
    this.client = options.client instanceof LoragentClient ? options.client : new LoragentClient(options);
    this.maxIterations = options.maxIterations || 10;
  }

  /**
   * Run the continuous autopilot loop until verified done
   */
  async runLoop(objective, options = {}) {
    const max = options.maxIterations || this.maxIterations;
    const hook = options.hook || LifecycleHooks.CHECK_DONE;
    const onProgress = options.onProgress || (() => {});

    let iteration = 0;
    let isComplete = false;
    let lastError = null;

    await this.client.saveWatchman(objective, 'Chorki loop started', 'Phase 1');

    while (!isComplete && iteration < max) {
      iteration++;
      onProgress({ iteration, max, status: 'EXECUTING', objective });

      // Trigger verification hook
      try {
        const hookResult = await this.client.triggerHook(hook);
        const text = hookResult?.content?.[0]?.text || '';
        
        if (text.includes('100% DONE') || text.includes('PASSED') || text.includes('successfully')) {
          isComplete = true;
          onProgress({ iteration, max, status: 'DONE', message: 'All verification checks passed' });
          await this.client.saveWatchman(objective, `Verified iteration ${iteration}`, 'Complete');
          break;
        } else {
          lastError = text;
          onProgress({ iteration, max, status: 'RETRYING', error: text });
        }
      } catch (err) {
        lastError = err.message;
        onProgress({ iteration, max, status: 'ERROR', error: err.message });
      }

      // Small delay between iterations
      await new Promise(r => setTimeout(r, 1000));
    }

    return {
      success: isComplete,
      iterations: iteration,
      objective,
      lastError
    };
  }
}
