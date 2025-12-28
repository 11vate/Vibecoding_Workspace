const fs = require('fs-extra');
const path = require('path');
let sharp;

try {
  sharp = require('sharp');
} catch (e) {
  console.warn("Sharp is not installed or failed to load. Image processing will be limited to file copying.");
}

class ImageProcessor {
  constructor(outputDir) {
    this.outputDir = outputDir;
  }

  async process(intent, sourcePath) {
    const outputPath = path.join(this.outputDir, intent.project, 'assets', intent.type + 's');
    await fs.ensureDir(outputPath);

    const filename = `${intent.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    const finalPath = path.join(outputPath, filename);

    if (sharp) {
      let pipeline = sharp(sourcePath);

      if (intent.spec.dimensions) {
        pipeline = pipeline.resize(intent.spec.dimensions.width, intent.spec.dimensions.height, {
          kernel: sharp.kernel.nearest, // Good for pixel art
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        });
      }

      await pipeline.toFile(finalPath);
    } else {
      await fs.copy(sourcePath, finalPath);
    }

    return {
      path: finalPath,
      metadata: {
        width: intent.spec.dimensions?.width,
        height: intent.spec.dimensions?.height,
        format: 'png'
      }
    };
  }
  
  // Future: Add atlas packing, spritesheet generation logic here
}

module.exports = ImageProcessor;
