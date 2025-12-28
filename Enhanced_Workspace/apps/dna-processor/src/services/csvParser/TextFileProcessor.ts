/**
 * Text file processor for genome and DNA data
 * Handles .txt files that may contain tab-delimited or other DNA data formats
 */

import { ProcessedFile } from '../../types/fileInput';
import { DNAFileData, DNARecord, DNAFileMetadata } from '../../types/dna';
import { CSVParser } from './CSVParser';
import { DNAFileValidator } from './DNAFileValidator';

export class TextFileProcessor {
  /**
   * Process a text file (genome data) into DNA data structure
   * Attempts to detect format: tab-delimited, comma-delimited, or space-delimited
   */
  static async processFile(file: ProcessedFile): Promise<DNAFileData> {
    // Ensure content is a string
    const content = typeof file.content === 'string' 
      ? file.content 
      : new TextDecoder().decode(file.content as ArrayBuffer);

    // Detect delimiter by trying different options
    const delimiter = this.detectDelimiter(content);
    
    // Try parsing with detected delimiter
    let parseResult = CSVParser.parse<DNARecord>(content, {
      header: true,
      delimiter,
      skipEmptyLines: true,
    });

    // If parsing failed or resulted in no data, try without headers
    if (parseResult.data.length === 0 || parseResult.errors.length > 0) {
      parseResult = CSVParser.parse<DNARecord>(content, {
        header: false,
        delimiter,
        skipEmptyLines: true,
      });

      // If still no data, try space delimiter
      if (parseResult.data.length === 0) {
        parseResult = CSVParser.parse<DNARecord>(content, {
          header: false,
          delimiter: ' ',
          skipEmptyLines: true,
        });
      }
    }

    // Validate DNA file structure (lenient for text files)
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
      headers: parseResult.meta.fields || this.generateDefaultHeaders(parseResult.data),
      metadata,
    };

    return dnaData;
  }

  /**
   * Detect delimiter in text content
   */
  private static detectDelimiter(content: string): string {
    const sample = content.split('\n').slice(0, 10).join('\n');
    
    // Count occurrences of different delimiters
    const delimiters = ['\t', ',', ';', '|'];
    const counts: Record<string, number> = {};
    
    delimiters.forEach((delim) => {
      counts[delim] = (sample.match(new RegExp(`\\${delim}`, 'g')) || []).length;
    });

    // Return delimiter with highest count, default to tab for genome data
    const maxDelim = Object.entries(counts).reduce((a, b) =>
      counts[a[0]] > counts[b[0]] ? a : b
    );
    
    return maxDelim[1] > 0 ? maxDelim[0] : '\t'; // Default to tab for genome files
  }

  /**
   * Generate default headers if file has no headers
   */
  private static generateDefaultHeaders(data: DNARecord[]): string[] {
    if (data.length === 0) return [];
    
    const firstRecord = data[0];
    const keys = Object.keys(firstRecord);
    
    // If records have numeric keys (from array parsing), generate column names
    if (keys.every((k) => /^\d+$/.test(k))) {
      return keys.map((_, index) => `Column${index + 1}`);
    }
    
    return keys;
  }

  /**
   * Check if file is a text file
   */
  static isTextFile(file: ProcessedFile): boolean {
    const extension = file.name.toLowerCase().split('.').pop();
    return extension === 'txt';
  }
}









