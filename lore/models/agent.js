import path from 'path';
import fs from 'fs';

class Agent {
  constructor(data) {
    this.name = data.name;
    this.description = data.description;
    this.instructions = data.instructions || '';
    this.version = data.version || '1.0.0';
    this.model = data.model || 'default';
  }

  static fromMarkdown(filePath) {
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
      return new Agent({ name: path.basename(filePath, '.md'), description: 'Parsed without frontmatter', instructions: content });
    }

    const frontmatter = match[1];
    const instructions = match[2].trim();
    
    const data = { instructions };
    frontmatter.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        let value = valueParts.join(':').trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        data[key.trim()] = value;
      }
    });

    return new Agent(data);
  }

  toMarkdown() {
    return `---
name: "${this.name}"
description: "${this.description}"
version: "${this.version}"
model: "${this.model}"
---

${this.instructions}`;
  }
}

export default Agent;
