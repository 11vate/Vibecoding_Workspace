/**
 * Process DNA CSV files into application format
 */

import { ProcessedFile } from '../../types/fileInput';
import { DNAFileData, DNARecord, DNAFileMetadata } from '../../types/dna';
import { CSVParser } from './CSVParser';
import { DNAFileValidator } from './DNAFileValidator';

export class DNAFileProcessor {
  /**
   * Process a CSV file into DNA data structure
   */
  static async processFile(file: ProcessedFile): Promise<DNAFileData> {
    // Ensure content is a string
    const content = typeof file.content === 'string' 
      ? file.content 
      : new TextDecoder().decode(file.content as ArrayBuffer);

    // Parse CSV
    const parseResult = CSVParser.parse<DNARecord>(content, {
      header: true, // Assume CSV has headers
      skipEmptyLines: true,
    });

    // Validate DNA file structure
    const validation = DNAFileValidator.validateDNAFile(parseResult);

    // Create metadata
    const metadata: DNAFileMetadata = {
      rowCount: parseResult.data.length,
      columnCount: parseResult.meta.fields?.length || 0,
      processedAt: Date.now(),
      errors: validation.errors.length > 0 ? validation.errors : undefined,
    };

    // Create DNA file data
    const dnaData: DNAFileData = {
      filename: file.name,
      records: parseResult.data,
      headers: parseResult.meta.fields || [],
      metadata,
    };

    return dnaData;
  }

  /**
   * Process multiple CSV files
   */
  static async processFiles(files: ProcessedFile[]): Promise<DNAFileData[]> {
    const results: DNAFileData[] = [];

    for (const file of files) {
      try {
        const dnaData = await this.processFile(file);
        results.push(dnaData);
      } catch (error) {
        // Create error entry for failed files
        results.push({
          filename: file.name,
          records: [],
          headers: [],
          metadata: {
            rowCount: 0,
            columnCount: 0,
            processedAt: Date.now(),
            errors: [error instanceof Error ? error.message : 'Failed to process file'],
          },
        });
      }
    }

    return results;
  }

  /**
   * Check if file is a CSV file
   */
  static isCSVFile(file: ProcessedFile): boolean {
    const extension = file.name.toLowerCase().split('.').pop();
    return extension === 'csv';
  }

  /**
   * Filter CSV files from a list of processed files
   */
  static filterCSVFiles(files: ProcessedFile[]): ProcessedFile[] {
    return files.filter((file) => this.isCSVFile(file));
  }
}









