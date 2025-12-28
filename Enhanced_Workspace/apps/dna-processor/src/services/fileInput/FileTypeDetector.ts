/**
 * File type detection utilities
 */

import { ProcessedFile } from '../../types/fileInput';

export class FileTypeDetector {
  /**
   * Get file extension from filename
   */
  static getExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot >= 0 ? filename.substring(lastDot + 1).toLowerCase() : '';
  }

  /**
   * Check if file is a CSV file
   */
  static isCSV(file: ProcessedFile): boolean {
    return this.getExtension(file.name) === 'csv';
  }

  /**
   * Check if file type matches accepted types
   */
  static matchesAcceptList(filename: string, acceptList?: string[]): boolean {
    if (!acceptList || acceptList.length === 0) {
      return true;
    }

    const extension = this.getExtension(filename);
    const mimeType = this.getMimeType(extension);

    return acceptList.some((accept) => {
      // Check extension
      if (accept.startsWith('.')) {
        return accept.toLowerCase() === `.${extension}`;
      }
      // Check MIME type
      if (accept.includes('/')) {
        return accept === mimeType || accept === `${mimeType.split('/')[0]}/*`;
      }
      return false;
    });
  }

  /**
   * Get MIME type from extension
   */
  static getMimeType(extension: string): string {
    const mimeTypes: Record<string, string> = {
      csv: 'text/csv',
      json: 'application/json',
      txt: 'text/plain',
      xml: 'application/xml',
      zip: 'application/zip',
    };
    return mimeTypes[extension] || 'application/octet-stream';
  }

  /**
   * Check if file is a ZIP file
   */
  static isZip(file: ProcessedFile): boolean {
    return this.getExtension(file.name) === 'zip';
  }

  /**
   * Check if file is a TXT file
   */
  static isTXT(file: ProcessedFile): boolean {
    return this.getExtension(file.name) === 'txt';
  }

  /**
   * Detect file type category
   */
  static getFileCategory(file: ProcessedFile): 'csv' | 'text' | 'binary' | 'unknown' {
    const extension = this.getExtension(file.name);
    
    if (extension === 'csv') return 'csv';
    if (['txt', 'json', 'xml', 'md'].includes(extension)) return 'text';
    if (['png', 'jpg', 'jpeg', 'gif', 'pdf', 'zip'].includes(extension)) return 'binary';
    return 'unknown';
  }
}

