import React from 'react';
import './index.css';

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Loragent</h1>
        <p>The Autonomous Professional Virtual Office</p>
      </header>

      <main className="grid">
        <div className="glass-card">
          <h2>LLDP Architecture</h2>
          <p>
            Built on the Lorapok Labs Design Pattern (LLDP). Organized into FACE, PULSE, LORE, PORT, and LOOM layers for clean, scalable agent orchestration.
          </p>
          <a href="#" className="btn">View Source</a>
        </div>

        <div className="glass-card">
          <h2>108 Specialized Agents</h2>
          <p>
            Dynamically summon specific skills on-demand using the Loragent Boss. Agents span from React developers to 3D designers and Project Managers.
          </p>
          <a href="#" className="btn">Explore Roster</a>
        </div>

        <div className="glass-card">
          <h2>Autopilot Engine</h2>
          <p>
            Trigger <code>/loragent autopilot</code> to continuously orchestrate skills, run loops, and execute commands until your ultimate goal is achieved.
          </p>
          <a href="#" className="btn">Documentation</a>
        </div>
      </main>
    </div>
  );
}

export default App;
