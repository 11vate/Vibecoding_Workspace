/**
 * Dataset Builder
 *
 * Utilities for preparing training datasets from sprite images.
 */
import * as fs from 'fs/promises';
import * as path from 'path';
/**
 * Dataset Builder
 */
export class DatasetBuilder {
    config;
    constructor(config) {
        this.config = {
            imageExtensions: ['.png', '.jpg', '.jpeg', '.webp'],
            captionStyle: "auto",
            ...config
        };
    }
    /**
     * Build dataset from directory
     */
    async buildDataset() {
        const items = [];
        const files = await this.scanDirectory(this.config.inputDir);
        for (const file of files) {
            const item = await this.processImage(file);
            if (item) {
                items.push(item);
            }
        }
        return items;
    }
    /**
     * Scan directory for images
     */
    async scanDirectory(dir) {
        const files = [];
        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    const subFiles = await this.scanDirectory(fullPath);
                    files.push(...subFiles);
                }
                else if (entry.isFile()) {
                    const ext = path.extname(entry.name).toLowerCase();
                    if (this.config.imageExtensions.includes(ext)) {
                        files.push(fullPath);
                    }
                }
            }
        }
        catch (error) {
            console.error(`Error scanning directory ${dir}:`, error);
        }
        return files;
    }
    /**
     * Process image file
     */
    async processImage(imagePath) {
        try {
            const filename = path.basename(imagePath, path.extname(imagePath));
            const caption = this.generateCaption(imagePath, filename);
            const tags = this.extractTags(filename);
            return {
                imagePath,
                caption,
                tags,
                metadata: {
                    filename,
                    extension: path.extname(imagePath)
                }
            };
        }
        catch (error) {
            console.error(`Error processing image ${imagePath}:`, error);
            return null;
        }
    }
    /**
     * Generate caption for image
     */
    generateCaption(imagePath, filename) {
        switch (this.config.captionStyle) {
            case "filename":
                return filename.replace(/[_-]/g, ' ');
            case "metadata":
                // Would load from metadata file
                return filename;
            case "auto":
            default:
                // Auto-generate from filename
                return this.autoGenerateCaption(filename);
        }
    }
    /**
     * Auto-generate caption from filename
     */
    autoGenerateCaption(filename) {
        // Remove common prefixes/suffixes
        let caption = filename
            .replace(/^(sprite|img|image|asset)_?/i, '')
            .replace(/_/g, ' ')
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .toLowerCase();
        // Add pixel art style hint
        if (caption.includes('pixel') || caption.includes('8bit') || caption.includes('16bit')) {
            caption += ", pixel art style";
        }
        return caption;
    }
    /**
     * Extract tags from filename
     */
    extractTags(filename) {
        const tags = [];
        const lower = filename.toLowerCase();
        // Common tag patterns
        if (lower.includes('pixel'))
            tags.push('pixel-art');
        if (lower.includes('sprite'))
            tags.push('sprite');
        if (lower.includes('character'))
            tags.push('character');
        if (lower.includes('enemy'))
            tags.push('enemy');
        if (lower.includes('player'))
            tags.push('player');
        if (lower.includes('idle'))
            tags.push('idle');
        if (lower.includes('walk'))
            tags.push('walk');
        if (lower.includes('attack'))
            tags.push('attack');
        return tags;
    }
    /**
     * Save dataset in Kohya SS format
     */
    async saveKohyaSSFormat(items, outputDir) {
        await fs.mkdir(outputDir, { recursive: true });
        for (const item of items) {
            const filename = path.basename(item.imagePath);
            const captionFile = path.join(outputDir, filename.replace(/\.[^.]+$/, '.txt'));
            await fs.writeFile(captionFile, item.caption, 'utf-8');
            // Copy image
            const destImage = path.join(outputDir, filename);
            await fs.copyFile(item.imagePath, destImage);
        }
    }
}
/**
 * Create dataset builder
 */
export function createDatasetBuilder(config) {
    return new DatasetBuilder(config);
}
//# sourceMappingURL=dataset-builder.js.map