/**
 * DNA-specific CSV file validation
 */

import { CSVParseResult } from '../../types/csv';
import { DNARecord } from '../../types/dna';

export class DNAFileValidator {
  /**
   * Validate DNA CSV file structure
   * This is a basic implementation that can be extended based on specific DNA data requirements
   */
  static validateDNAFile(
    parseResult: CSVParseResult<DNARecord>
  ): { valid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if file has data
    if (parseResult.data.length === 0) {
      errors.push('DNA file contains no data records');
      return { valid: false, errors, warnings };
    }

    // Check if file has headers
    if (!parseResult.meta.fields || parseResult.meta.fields.length === 0) {
      errors.push('DNA file must have column headers');
      return { valid: false, errors, warnings };
    }

    // Check for parsing errors
    const criticalErrors = parseResult.errors.filter(
      (e) => e.type === 'Delimiter' || e.type === 'Quotes'
    );
    if (criticalErrors.length > 0) {
      errors.push(
        `CSV parsing errors: ${criticalErrors.map((e) => e.message).join(', ')}`
      );
    }

    // Check for field mismatch warnings (non-critical but worth noting)
    const fieldMismatches = parseResult.errors.filter((e) => e.type === 'FieldMismatch');
    if (fieldMismatches.length > 0) {
      warnings.push(
        `Some rows have inconsistent field counts (${fieldMismatches.length} rows affected)`
      );
    }

    // Validate record structure
    const headers = parseResult.meta.fields;
    const sampleRecord = parseResult.data[0];

    if (sampleRecord) {
      // Check if all records have the same keys (if header-based parsing)
      const recordKeys = Object.keys(sampleRecord);
      const missingHeaders = headers.filter((h) => !recordKeys.includes(h));
      if (missingHeaders.length > 0) {
        warnings.push(`Some headers are missing in data: ${missingHeaders.join(', ')}`);
      }
    }

    // Additional validations can be added here based on specific DNA data requirements
    // e.g., required fields, data type validation, value ranges, etc.

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate DNA record structure
   */
  static validateDNARecord(
    record: DNARecord,
    expectedFields?: string[]
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (expectedFields) {
      const missingFields = expectedFields.filter((field) => !(field in record));
      if (missingFields.length > 0) {
        errors.push(`Missing required fields: ${missingFields.join(', ')}`);
      }
    }

    // Additional record-level validations can be added here

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get required fields for DNA records (can be customized)
   */
  static getRequiredFields(): string[] {
    // This should be customized based on actual DNA data requirements
    return [];
  }
}









