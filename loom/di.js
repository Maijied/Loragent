import { StateWatcher } from '../pulse/daemon/state-watcher.js';
import { Engine } from '../lore/models/agent.js';

class Container {
  constructor() {
    this.services = new Map();
    this.register('stateWatcher', new StateWatcher());
    this.register('engine', new Engine());
  }

  register(name, instance) {
    this.services.set(name, instance);
  }

  resolve(name) {
    if (!this.services.has(name)) {
      throw new Error(`Service ${name} not found in LOOM container`);
    }
    return this.services.get(name);
  }
}

export const container = new Container();
