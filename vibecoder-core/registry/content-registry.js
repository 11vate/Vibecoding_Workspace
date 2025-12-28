const fs = require('fs-extra');
const path = require('path');

class ContentRegistry {
  constructor(storagePath) {
    this.storagePath = storagePath || path.join(process.cwd(), 'CONTENT_REGISTRY.json');
    this.content = {
      entities: [],
      biomes: [],
      interactions: []
    };
  }

  async load() {
    if (await fs.pathExists(this.storagePath)) {
      this.content = await fs.readJson(this.storagePath);
    } else {
      await this.save();
    }
    return this.content;
  }

  async save() {
    await fs.writeJson(this.storagePath, this.content, { spaces: 2 });
  }

  async register(type, item) {
    await this.load();
    
    // Type safety check (simple)
    if (!this.content[type]) {
        this.content[type] = [];
    }

    const list = this.content[type];
    const existingIndex = list.findIndex(i => i.id === item.id);
    
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...item, updated_at: Date.now() };
    } else {
      list.push({ ...item, created_at: Date.now() });
    }
    
    await this.save();
    return item;
  }

  async get(type, id) {
    await this.load();
    if (!this.content[type]) return null;
    return this.content[type].find(i => i.id === id);
  }
}

module.exports = ContentRegistry;
