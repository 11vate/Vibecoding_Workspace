/**
 * CSV parsing utilities using papaparse
 */

import Papa from 'papaparse';
import { CSVParseResult, CSVParseOptions, CSVParseError } from '../../types/csv';

export class CSVParser {
  /**
   * Parse CSV content from string
   */
  static parse<T = Record<string, string>>(
    content: string,
    options: CSVParseOptions = {}
  ): CSVParseResult<T> {
    const parseOptions: Papa.ParseConfig = {
      header: options.header !== false, // Default to true
      delimiter: options.delimiter || '',
      skipEmptyLines: options.skipEmptyLines !== false, // Default to true
      transformHeader: options.transformHeader,
      dynamicTyping: false, // Keep as strings for DNA data
    };

    const result = Papa.parse<T>(content, parseOptions);

    // Convert papaparse errors to our format
    const errors: CSVParseError[] = result.errors.map((error) => ({
      type: this.mapErrorType(error.type),
      code: error.code || 'UNKNOWN',
      message: error.message || 'Unknown error',
      row: error.row !== undefined ? error.row + 1 : undefined, // Convert to 1-based
      field: error.type === 'FieldMismatch' ? String(error.index) : undefined,
    }));

    return {
      data: result.data,
      errors,
      meta: {
        delimiter: result.meta.delimiter || ',',
        linebreak: result.meta.linebreak || '\n',
        aborted: result.meta.aborted || false,
        fields: result.meta.fields,
        truncated: result.meta.truncated || false,
        cursor: result.meta.cursor || 0,
      },
    };
  }

  /**
   * Map papaparse error types to our error types
   */
  private static mapErrorType(
    papaType: string
  ): 'FieldMismatch' | 'Quotes' | 'Delimiter' | 'LineBreaks' | 'Unknown' {
    switch (papaType) {
      case 'FieldMismatch':
        return 'FieldMismatch';
      case 'Quotes':
        return 'Quotes';
      case 'Delimiter':
        return 'Delimiter';
      case 'LineBreaks':
        return 'LineBreaks';
      default:
        return 'Unknown';
    }
  }

  /**
   * Auto-detect CSV delimiter
   */
  static detectDelimiter(content: string, sampleLines: number = 5): string {
    const lines = content.split('\n').slice(0, sampleLines);
    const delimiters = [',', ';', '\t', '|'];
    const counts: Record<string, number> = {};

    delimiters.forEach((delim) => {
      counts[delim] = 0;
      lines.forEach((line) => {
        counts[delim] += (line.match(new RegExp(`\\${delim}`, 'g')) || []).length;
      });
    });

    // Return delimiter with highest count, default to comma
    const maxDelim = Object.entries(counts).reduce((a, b) =>
      counts[a[0]] > counts[b[0]] ? a : b
    );
    return maxDelim[0] || ',';
  }

  /**
   * Check if content appears to be CSV
   */
  static isCSV(content: string): boolean {
    // Basic heuristic: check for common CSV patterns
    const lines = content.split('\n').slice(0, 10);
    if (lines.length < 2) return false;

    // Check if there are delimiters present
    const hasDelimiters = lines.some((line) =>
      /[,;\t|]/.test(line)
    );

    // Check if lines have similar structure (similar number of fields)
    const fieldCounts = lines
      .map((line) => line.split(/[,;\t]/).length)
      .filter((count) => count > 1);

    if (fieldCounts.length < 2) return false;

    // Check for consistent field counts (allow some variation)
    const avgFields = fieldCounts.reduce((a, b) => a + b, 0) / fieldCounts.length;
    const variance = fieldCounts.reduce(
      (sum, count) => sum + Math.abs(count - avgFields),
      0
    ) / fieldCounts.length;

    return hasDelimiters && variance < avgFields * 0.5; // Allow 50% variance
  }

  /**
   * Validate CSV structure
   */
  static validateStructure(
    parseResult: CSVParseResult
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (parseResult.data.length === 0) {
      errors.push('CSV file is empty');
    }

    if (parseResult.meta.fields && parseResult.meta.fields.length === 0) {
      errors.push('CSV file has no headers');
    }

    if (parseResult.errors.length > 0) {
      const criticalErrors = parseResult.errors.filter(
        (e) => e.type !== 'FieldMismatch' || (e.row && e.row <= 10)
      );
      if (criticalErrors.length > 0) {
        errors.push(
          `CSV parsing errors found: ${criticalErrors.map((e) => e.message).join(', ')}`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}









