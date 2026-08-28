import path from 'path';
import fs from 'fs';

class Skill {
  constructor(data) {
    this.name = data.name;
    this.description = data.description;
    this.instructions = data.instructions || '';
    this.version = data.version || '1.0.0';
    this.tags = data.tags || [];
  }

  static fromMarkdown(filePath) {
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, 'utf8');
    // Basic parser for YAML frontmatter + markdown body
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
      return new Skill({ name: path.basename(filePath, '.md'), description: 'Parsed without frontmatter', instructions: content });
    }

    const frontmatter = match[1];
    const instructions = match[2].trim();
    
    const data = { instructions };
    frontmatter.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        let value = valueParts.join(':').trim();
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        data[key.trim()] = value;
      }
    });

    return new Skill(data);
  }

  toMarkdown() {
    return `---
name: "${this.name}"
description: "${this.description}"
version: "${this.version}"
tags: [${this.tags.map(t => `"${t}"`).join(', ')}]
---

${this.instructions}`;
  }
}

export default Skill;
