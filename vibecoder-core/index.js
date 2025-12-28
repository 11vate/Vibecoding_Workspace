const fs = require('fs-extra');
const path = require('path');
const AssetRegistry = require('./registry');
const ContentRegistry = require('./registry/content-registry');
const ImageProcessor = require('./processors/image-processor');
const PhaserBinder = require('./generators/phaser-binder');
const { AssetIntentSchema } = require('./schemas/asset-intent');
const { EntitySchema } = require('./schemas/entity');
const { BiomeSchema } = require('./schemas/biome');
const { InteractionSchema } = require('./schemas/interaction');

const registry = new AssetRegistry(path.join(__dirname, '..', 'asset-system', 'ASSET_REGISTRY.json'));
const contentRegistry = new ContentRegistry(path.join(__dirname, '..', 'content-system', 'CONTENT_REGISTRY.json'));
const processor = new ImageProcessor(path.join(__dirname, '..', 'games')); // Default to games dir

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'request') {
    // Usage: node index.js request <project> <type> <name> <description>
    const [_, project, type, name, description] = args;
    
    const intent = {
      id: Date.now().toString(),
      project,
      type,
      name,
      spec: { style: 'pixel-art' }, // Default
      context: { description },
      status: 'pending'
    };

    // Validate
    try {
      AssetIntentSchema.parse(intent);
      await registry.register(intent);
      console.log(`Asset intent registered: ${intent.id}`);
    } catch (e) {
      console.error("Invalid intent:", e.errors);
    }
  } 
  
  else if (command === 'process') {
    // Usage: node index.js process <intentId> <sourceFile>
    const [_, intentId, sourceFile] = args;
    const intent = await registry.get(intentId);
    
    if (!intent) {
      console.error("Intent not found");
      return;
    }

    console.log(`Processing ${intent.name}...`);
    const result = await processor.process(intent, sourceFile);
    
    intent.status = 'complete';
    intent.processedPath = result.path;
    await registry.register(intent);
    
    console.log(`Asset processed to: ${result.path}`);
  }

  else if (command === 'bind') {
      // Usage: node index.js bind <projectPath>
      const [_, projectPath] = args;
      const binder = new PhaserBinder(registry);
      const code = await binder.generate(projectPath);
      
      const outputPath = path.join(projectPath, 'src', 'generated', 'assets.ts');
      await fs.ensureDir(path.dirname(outputPath));
      await fs.writeFile(outputPath, code);
      console.log(`Assets bound to ${outputPath}`);
  }

  else if (command === 'define-entity') {
    // Usage: node index.js define-entity <json_string_or_path>
    const [_, input] = args;
    try {
      let data = input.startsWith('{') ? JSON.parse(input) : await fs.readJson(input);
      EntitySchema.parse(data); // Validate
      await contentRegistry.register('entities', data);
      console.log(`Entity registered: ${data.id}`);
    } catch (e) {
      console.error("Invalid entity definition:", e);
    }
  }

  else if (command === 'define-biome') {
    // Usage: node index.js define-biome <json_string_or_path>
    const [_, input] = args;
    try {
      let data = input.startsWith('{') ? JSON.parse(input) : await fs.readJson(input);
      BiomeSchema.parse(data);
      await contentRegistry.register('biomes', data);
      console.log(`Biome registered: ${data.id}`);
    } catch (e) {
       console.error("Invalid biome definition:", e);
    }
  }

  else if (command === 'define-verb') {
      // Usage: node index.js define-verb <json_string_or_path>
      const [_, input] = args;
      try {
        let data = input.startsWith('{') ? JSON.parse(input) : await fs.readJson(input);
        InteractionSchema.parse(data);
        await contentRegistry.register('interactions', data);
        console.log(`Interaction (verb) registered: ${data.id}`);
      } catch (e) {
         console.error("Invalid interaction definition:", e);
      }
  }
  
  else {
    console.log("Commands: request, process, bind, define-entity, define-biome, define-verb");
  }
}

main().catch(console.error);
