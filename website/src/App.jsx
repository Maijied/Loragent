import React from 'react';
import { motion } from 'framer-motion';
import { Network, Bot, Cpu, Command } from 'lucide-react';
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

const iconVariants = {
  hover: {
    rotate: [0, -10, 10, -10, 10, 0],
    scale: 1.2,
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  }
};

const logoVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: { type: "spring", stiffness: 300 }
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
        <motion.div
          variants={logoVariants}
          animate="animate"
          whileHover="hover"
          style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}
        >
          <img src="/Loragent/logo.png" alt="Loragent Logo" style={{ width: '80px', height: '80px', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0, 255, 255, 0.2)' }} />
        </motion.div>
        
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
          whileHover="hover"
        >
          <motion.div variants={iconVariants} style={{ color: '#00ffff', marginBottom: '1rem' }}>
            <Network size={40} />
          </motion.div>
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
          whileHover="hover"
        >
          <motion.div variants={iconVariants} style={{ color: '#00ffff', marginBottom: '1rem' }}>
            <Bot size={40} />
          </motion.div>
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
          whileHover="hover"
        >
          <motion.div variants={iconVariants} style={{ color: '#00ffff', marginBottom: '1rem' }}>
            <Command size={40} />
          </motion.div>
          <h2>Universal Autopilot</h2>
          <p>
            Trigger <code>/loragent autopilot</code> in CLI or AI Editors to continuously orchestrate skills, run loops, and execute commands until your ultimate goal is achieved.
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
