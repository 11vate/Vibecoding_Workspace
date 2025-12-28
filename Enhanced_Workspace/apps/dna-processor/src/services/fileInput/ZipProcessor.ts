/**
 * ZIP file processing utilities
 * Extracts and processes ZIP archives
 */

import JSZip from 'jszip';
import { ProcessedFile } from '../../types/fileInput';

export class ZipProcessor {
  /**
   * Extract files from a ZIP archive
   */
  static async extractZip(file: ProcessedFile): Promise<ProcessedFile[]> {
    if (typeof file.content !== 'object' || !(file.content instanceof ArrayBuffer)) {
      throw new Error('ZIP file content must be an ArrayBuffer');
    }

    try {
      const zip = await JSZip.loadAsync(file.content);
      const extractedFiles: ProcessedFile[] = [];

      // Process all files in the ZIP
      for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
        // Skip directories
        if (zipEntry.dir) {
          continue;
        }

        // Determine if file is text-based
        const extension = this.getExtension(relativePath);
        const isText = this.isTextFile(extension);

        // Extract file content
        const content = isText
          ? await zipEntry.async('string')
          : await zipEntry.async('arraybuffer');

        extractedFiles.push({
          name: relativePath.split('/').pop() || relativePath,
          path: relativePath,
          type: this.getMimeType(extension),
          size: zipEntry._data?.uncompressedSize || 0,
          content,
          lastModified: zipEntry.date?.getTime() || Date.now(),
        });
      }

      return extractedFiles;
    } catch (error) {
      throw new Error(
        `Failed to extract ZIP file: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Check if file is a ZIP file
   */
  static isZipFile(file: ProcessedFile): boolean {
    const extension = this.getExtension(file.name);
    return extension === 'zip';
  }

  /**
   * Get file extension from filename
   */
  private static getExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot >= 0 ? filename.substring(lastDot + 1).toLowerCase() : '';
  }

  /**
   * Check if file extension indicates a text file
   */
  private static isTextFile(extension: string): boolean {
    const textExtensions = ['csv', 'txt', 'json', 'xml', 'md', 'js', 'ts', 'html', 'css'];
    return textExtensions.includes(extension);
  }

  /**
   * Get MIME type from extension
   */
  private static getMimeType(extension: string): string {
    const mimeTypes: Record<string, string> = {
      csv: 'text/csv',
      txt: 'text/plain',
      json: 'application/json',
      xml: 'application/xml',
      zip: 'application/zip',
    };
    return mimeTypes[extension] || 'application/octet-stream';
  }
}









