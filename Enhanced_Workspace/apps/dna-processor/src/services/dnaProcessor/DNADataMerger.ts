/**
 * Merge DNA data from multiple files
 */

import { DNAFileData, DNARecord, DNAProcessedData } from '../../types/dna';

export class DNADataMerger {
  /**
   * Merge multiple DNA file data into a single dataset
   */
  static merge(dnaFiles: DNAFileData[]): DNARecord[] {
    if (dnaFiles.length === 0) {
      return [];
    }

    // If all files have the same headers, we can merge directly
    const firstHeaders = dnaFiles[0].headers;
    const allSameHeaders = dnaFiles.every(
      (file) =>
        file.headers.length === firstHeaders.length &&
        file.headers.every((h, i) => h === firstHeaders[i])
    );

    if (allSameHeaders) {
      // Direct merge - all records have same structure
      return dnaFiles.flatMap((file) => file.records);
    }

    // Different headers - need to merge carefully
    return this.mergeWithDifferentHeaders(dnaFiles);
  }

  /**
   * Merge files with potentially different headers
   */
  private static mergeWithDifferentHeaders(dnaFiles: DNAFileData[]): DNARecord[] {
    // Collect all unique headers
    const allHeaders = new Set<string>();
    dnaFiles.forEach((file) => {
      file.headers.forEach((header) => allHeaders.add(header));
    });

    const mergedHeaders = Array.from(allHeaders);
    const mergedRecords: DNARecord[] = [];

    // Merge records, filling in missing fields with null
    dnaFiles.forEach((file) => {
      file.records.forEach((record) => {
        const mergedRecord: DNARecord = {};
        mergedHeaders.forEach((header) => {
          mergedRecord[header] = record[header] ?? null;
        });
        mergedRecords.push(mergedRecord);
      });
    });

    return mergedRecords;
  }

  /**
   * Get union of all headers from DNA files
   */
  static getUnionHeaders(dnaFiles: DNAFileData[]): string[] {
    const headerSet = new Set<string>();
    dnaFiles.forEach((file) => {
      file.headers.forEach((header) => headerSet.add(header));
    });
    return Array.from(headerSet);
  }

  /**
   * Get intersection of headers (headers present in all files)
   */
  static getIntersectionHeaders(dnaFiles: DNAFileData[]): string[] {
    if (dnaFiles.length === 0) return [];

    const firstHeaders = new Set(dnaFiles[0].headers);
    dnaFiles.slice(1).forEach((file) => {
      const fileHeaders = new Set(file.headers);
      firstHeaders.forEach((header) => {
        if (!fileHeaders.has(header)) {
          firstHeaders.delete(header);
        }
      });
    });

    return Array.from(firstHeaders);
  }
}









