/**
 * Main file input handler
 * Supports both single file and directory input
 */

import { ProcessedFile, FileInputOptions, FileInputResult } from '../../types/fileInput';
import { DirectoryProcessor } from './DirectoryProcessor';

export class FileInputHandler {
  /**
   * Handle single file input
   */
  static async handleFileInput(
    file: File,
    options: FileInputOptions = {}
  ): Promise<FileInputResult> {
    try {
      const processedFile = await this.processFile(file);
      
      return {
        type: 'file',
        name: file.name,
        files: [processedFile],
      };
    } catch (error) {
      return {
        type: 'file',
        name: file.name,
        files: [],
        error: error instanceof Error ? error.message : 'Failed to process file',
      };
    }
  }

  /**
   * Handle multiple file input
   */
  static async handleMultipleFileInput(
    fileList: FileList,
    options: FileInputOptions = {}
  ): Promise<FileInputResult> {
    const files: ProcessedFile[] = [];
    const errors: string[] = [];

    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        
        try {
          const processedFile = await this.processFile(file);
          files.push(processedFile);
        } catch (error) {
          errors.push(`Failed to process ${file.name}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }

      return {
        type: 'file',
        name: `${fileList.length} files`,
        files,
        error: errors.length > 0 ? errors.join('; ') : undefined,
      };
    } catch (error) {
      return {
        type: 'file',
        name: 'Multiple files',
        files: [],
        error: error instanceof Error ? error.message : 'Failed to process files',
      };
    }
  }

  /**
   * Handle directory input using File System Access API
   */
  static async handleDirectoryInput(
    dirHandle: FileSystemDirectoryHandle,
    options: FileInputOptions = {}
  ): Promise<FileInputResult> {
    try {
      const { recursive = true, accept } = options;
      const files = await DirectoryProcessor.processDirectory(dirHandle, {
        recursive,
        accept,
      });

      return {
        type: 'directory',
        name: dirHandle.name,
        files,
      };
    } catch (error) {
      return {
        type: 'directory',
        name: dirHandle.name,
        files: [],
        error: error instanceof Error ? error.message : 'Failed to process directory',
      };
    }
  }

  /**
   * Process a File object into ProcessedFile format
   */
  private static async processFile(file: File): Promise<ProcessedFile> {
    const isText = this.isTextFile(file.name);
    const content = isText ? await file.text() : await file.arrayBuffer();

    return {
      name: file.name,
      path: file.name,
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
   * Get file extension
   */
  private static getExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot >= 0 ? filename.substring(lastDot + 1).toLowerCase() : '';
  }

  /**
   * Check if File System Access API is supported
   */
  static isDirectoryInputSupported(): boolean {
    return 'showDirectoryPicker' in window;
  }

  /**
   * Request directory access from user
   */
  static async requestDirectoryAccess(
    options?: { mode?: 'read' | 'readwrite' }
  ): Promise<FileSystemDirectoryHandle | null> {
    if (!this.isDirectoryInputSupported()) {
      throw new Error('Directory picker API is not supported in this browser');
    }

    try {
      return await (window as any).showDirectoryPicker(options);
    } catch (error) {
      // User cancelled the picker
      if ((error as any).name === 'AbortError') {
        return null;
      }
      throw error;
    }
  }
}









