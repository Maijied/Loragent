import { container } from '../../loom/di.js';

/**
 * Runs the Loragent autopilot loop.
 * It coordinates with the state-watcher (PULSE) and agent models (LORE).
 */
export async function runAutopilot(prompt) {
  const engine = container.resolve('engine');
  const watcher = container.resolve('stateWatcher');

  console.log('[Autopilot] Initializing workflow manager...');
  watcher.start();

  console.log(`[Autopilot] Processing prompt: ${prompt}`);
  
  // The LORE layer engine executes the prompt
  try {
    const result = await engine.execute(prompt);
    console.log(`[Autopilot] Task Completed: ${result}`);
  } catch (error) {
    console.error(`[Autopilot] Task Failed:`, error);
  } finally {
    watcher.stop();
  }
}
