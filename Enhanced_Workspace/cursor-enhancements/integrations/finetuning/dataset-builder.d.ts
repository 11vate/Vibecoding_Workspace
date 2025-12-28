/**
 * Dataset Builder
 *
 * Utilities for preparing training datasets from sprite images.
 */
/**
 * Dataset configuration
 */
export interface DatasetConfig {
    inputDir: string;
    outputDir: string;
    imageExtensions?: string[];
    captionStyle?: "filename" | "metadata" | "auto";
    metadataFile?: string;
}
/**
 * Dataset item
 */
export interface DatasetItem {
    imagePath: string;
    caption: string;
    tags: string[];
    metadata?: Record<string, unknown>;
}
/**
 * Dataset Builder
 */
export declare class DatasetBuilder {
    private config;
    constructor(config: DatasetConfig);
    /**
     * Build dataset from directory
     */
    buildDataset(): Promise<DatasetItem[]>;
    /**
     * Scan directory for images
     */
    private scanDirectory;
    /**
     * Process image file
     */
    private processImage;
    /**
     * Generate caption for image
     */
    private generateCaption;
    /**
     * Auto-generate caption from filename
     */
    private autoGenerateCaption;
    /**
     * Extract tags from filename
     */
    private extractTags;
    /**
     * Save dataset in Kohya SS format
     */
    saveKohyaSSFormat(items: DatasetItem[], outputDir: string): Promise<void>;
}
/**
 * Create dataset builder
 */
export declare function createDatasetBuilder(config: DatasetConfig): DatasetBuilder;
//# sourceMappingURL=dataset-builder.d.ts.map