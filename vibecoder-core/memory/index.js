const fs = require('fs-extra');
const path = require('path');

class ProjectMemory {
  constructor() {
    this.path = path.join(process.cwd(), '..', '.claude', 'PROJECT_MEMORY.json');
  }

  async load() {
    if (await fs.pathExists(this.path)) {
      return fs.readJson(this.path);
    }
    return { projects: {}, global_lessons: [] };
  }

  async save(data) {
    await fs.writeJson(this.path, data, { spaces: 2 });
  }

  async addBlueprint(project, blueprint) {
    const data = await this.load();
    if (!data.projects[project]) data.projects[project] = { blueprints: [], assets: [] };
    
    data.projects[project].blueprints.push({
      ...blueprint,
      timestamp: Date.now()
    });
    
    await this.save(data);
  }

  async addLesson(lesson) {
    const data = await this.load();
    data.global_lessons.push({
      content: lesson,
      timestamp: Date.now()
    });
    await this.save(data);
  }
}

module.exports = ProjectMemory;
