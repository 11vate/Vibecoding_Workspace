const fs = require('fs-extra');
const path = require('path');

class AssetRegistry {
  constructor(storagePath) {
    this.storagePath = storagePath || path.join(process.cwd(), 'ASSET_REGISTRY.json');
    this.assets = [];
  }

  async load() {
    if (await fs.pathExists(this.storagePath)) {
      this.assets = await fs.readJson(this.storagePath);
    } else {
      this.assets = [];
      await this.save();
    }
    return this.assets;
  }

  async save() {
    await fs.writeJson(this.storagePath, this.assets, { spaces: 2 });
  }

  async register(asset) {
    await this.load();
    const existingIndex = this.assets.findIndex(a => a.id === asset.id);
    if (existingIndex >= 0) {
      this.assets[existingIndex] = { ...this.assets[existingIndex], ...asset, updated_at: Date.now() };
    } else {
      this.assets.push({ ...asset, created_at: Date.now() });
    }
    await this.save();
    return asset;
  }

  async get(id) {
    await this.load();
    return this.assets.find(a => a.id === id);
  }

  async findByProject(project) {
    await this.load();
    return this.assets.filter(a => a.project === project);
  }
  
  async findByType(type) {
      await this.load();
      return this.assets.filter(a => a.type === type);
  }
}

module.exports = AssetRegistry;
