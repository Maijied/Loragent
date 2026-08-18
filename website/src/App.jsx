import React from 'react';
import { motion } from 'framer-motion';
import './index.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12
    }
  }
};

const headerVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 15
    }
  }
};

function App() {
  return (
    <div className="app-container">
      <motion.header
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <motion.h1 
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          Loragent
        </motion.h1>
        <p>The Autonomous Professional Virtual Office</p>
      </motion.header>

      <motion.main 
        className="grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="glass-card" 
          variants={itemVariants}
          whileHover={{ y: -10, scale: 1.02 }}
        >
          <h2>LLDP Architecture</h2>
          <p>
            Built on the Lorapok Labs Design Pattern (LLDP). Organized into FACE, PULSE, LORE, PORT, and LOOM layers for clean, scalable agent orchestration.
          </p>
          <motion.a 
            href="#" 
            className="btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            View Source
          </motion.a>
        </motion.div>

        <motion.div 
          className="glass-card" 
          variants={itemVariants}
          whileHover={{ y: -10, scale: 1.02 }}
        >
          <h2>108 Specialized Agents</h2>
          <p>
            Dynamically summon specific skills on-demand using the Loragent Boss. Agents span from React developers to 3D designers and Project Managers.
          </p>
          <motion.a 
            href="#" 
            className="btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Roster
          </motion.a>
        </motion.div>

        <motion.div 
          className="glass-card" 
          variants={itemVariants}
          whileHover={{ y: -10, scale: 1.02 }}
        >
          <h2>Autopilot Engine</h2>
          <p>
            Trigger <code>/loragent autopilot</code> to continuously orchestrate skills, run loops, and execute commands until your ultimate goal is achieved.
          </p>
          <motion.a 
            href="#" 
            className="btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Documentation
          </motion.a>
        </motion.div>
      </motion.main>
    </div>
  );
}

export default App;
