import path from 'path';
import fs from 'fs';

class Rule {
  constructor(data) {
    this.name = data.name;
    this.description = data.description;
    this.content = data.content || '';
    this.globs = data.globs || [];
  }

  static fromMarkdown(filePath) {
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    
    if (!match) {
      return new Rule({ name: path.basename(filePath, '.mdc'), description: 'Parsed without frontmatter', content });
    }

    const frontmatter = match[1];
    const ruleContent = match[2].trim();
    
    const data = { content: ruleContent };
    frontmatter.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        let value = valueParts.join(':').trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        if (key.trim() === 'globs') {
            // Handle array representation if needed, simple parsing for now
            data[key.trim()] = value; // Needs better array parsing if formatting is strict array
        } else {
            data[key.trim()] = value;
        }
      }
    });

    return new Rule(data);
  }

  toMarkdown() {
    return `---
name: ${this.name}
description: ${this.description}
globs: ${this.globs}
---

${this.content}`;
  }
}

export default Rule;
