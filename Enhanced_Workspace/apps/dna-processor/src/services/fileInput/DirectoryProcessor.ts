/**
 * Directory processing utilities
 * Handles recursive folder scanning and file collection
 */

import { ProcessedFile, DirectoryEntry } from '../../types/fileInput';

export class DirectoryProcessor {
  /**
   * Process a directory entry recursively
   */
  static async processDirectory(
    dirHandle: FileSystemDirectoryHandle,
    options: { recursive?: boolean; accept?: string[] } = {}
  ): Promise<ProcessedFile[]> {
    const files: ProcessedFile[] = [];
    const { recursive = true, accept } = options;

    try {
      for await (const [name, entry] of dirHandle.entries()) {
        if (entry.kind === 'file') {
          const fileHandle = entry as FileSystemFileHandle;
          const file = await fileHandle.getFile();
          
          // Check if file matches accept list
          if (!this.shouldIncludeFile(name, accept)) {
            continue;
          }

          const processedFile = await this.processFile(file, name);
          files.push(processedFile);
        } else if (entry.kind === 'directory' && recursive) {
          const subDirHandle = entry as FileSystemDirectoryHandle;
          const subFiles = await this.processDirectory(subDirHandle, options);
          files.push(...subFiles);
        }
      }
    } catch (error) {
      console.error('Error processing directory:', error);
      throw new Error(`Failed to process directory: ${error instanceof Error ? error.message : String(error)}`);
    }

    return files;
  }

  /**
   * Check if file should be included based on accept list
   */
  private static shouldIncludeFile(filename: string, accept?: string[]): boolean {
    if (!accept || accept.length === 0) {
      return true;
    }

    const extension = this.getExtension(filename);
    
    return accept.some((pattern) => {
      if (pattern.startsWith('.')) {
        return pattern.toLowerCase() === `.${extension}`;
      }
      if (pattern.includes('/')) {
        // MIME type check could be added here
        return false;
      }
      return false;
    });
  }

  /**
   * Get file extension
   */
  private static getExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot >= 0 ? filename.substring(lastDot + 1).toLowerCase() : '';
  }

  /**
   * Process a single file into ProcessedFile format
   */
  private static async processFile(file: File, name: string): Promise<ProcessedFile> {
    const isText = this.isTextFile(name);
    const content = isText ? await file.text() : await file.arrayBuffer();

    return {
      name,
      path: name, // Path will be relative to the directory root
      type: file.type || 'application/octet-stream',
      size: file.size,
      content,
      lastModified: file.lastModified,
    };
  }

  /**
   * Check if file is likely a text file
   */
  private static isTextFile(filename: string): boolean {
    const textExtensions = ['csv', 'txt', 'json', 'xml', 'md', 'js', 'ts', 'html', 'css'];
    const extension = this.getExtension(filename);
    return textExtensions.includes(extension);
  }

  /**
   * Create directory entry structure from handle
   */
  static async createDirectoryEntry(
    dirHandle: FileSystemDirectoryHandle
  ): Promise<DirectoryEntry[]> {
    const entries: DirectoryEntry[] = [];

    try {
      for await (const [name, entry] of dirHandle.entries()) {
        entries.push({
          name,
          path: name,
          type: entry.kind === 'file' ? 'file' : 'directory',
        });
      }
    } catch (error) {
      console.error('Error creating directory entry:', error);
    }

    return entries;
  }
}









