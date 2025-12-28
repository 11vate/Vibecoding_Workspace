/**
 * Main DNA data processor
 * Orchestrates file input, CSV parsing, and data processing
 */

import { FileInputResult } from '../../types/fileInput';
import { DNAFileData, DNAProcessedData, ProcessingError } from '../../types/dna';
import { DNAFileProcessor } from '../csvParser/DNAFileProcessor';
import { TextFileProcessor } from '../csvParser/TextFileProcessor';
import { ZipProcessor } from '../fileInput/ZipProcessor';
import { DNADataMerger } from './DNADataMerger';

export class DNADataProcessor {
  /**
   * Process file input result into DNA processed data
   * Handles CSV, TXT, and ZIP files
   */
  static async process(inputResult: FileInputResult): Promise<DNAProcessedData> {
    const errors: ProcessingError[] = [];

    // Check for input errors
    if (inputResult.error) {
      errors.push({
        filename: inputResult.name,
        type: 'processing',
        message: inputResult.error,
      });
    }

    // Process ZIP files first (extract them)
    const allFiles = await this.processZipFiles(inputResult.files, errors);

    // Filter and categorize files
    const csvFiles = allFiles.filter((file) => DNAFileProcessor.isCSVFile(file));
    const txtFiles = allFiles.filter((file) => TextFileProcessor.isTextFile(file));

    if (csvFiles.length === 0 && txtFiles.length === 0) {
      errors.push({
        filename: inputResult.name,
        type: 'processing',
        message: 'No supported DNA files (CSV, TXT) found in input',
      });
      return {
        files: [],
        totalRecords: 0,
        errors,
      };
    }

    // Process all supported files
    const dnaFilesPromises = [
      ...csvFiles.map((file) => DNAFileProcessor.processFile(file)),
      ...txtFiles.map((file) => TextFileProcessor.processFile(file)),
    ];

    const dnaFiles = await Promise.allSettled(dnaFilesPromises).then((results) =>
      results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          const file = index < csvFiles.length ? csvFiles[index] : txtFiles[index - csvFiles.length];
          errors.push({
            filename: file.name,
            type: 'processing',
            message: result.reason instanceof Error ? result.reason.message : 'Failed to process file',
          });
          return {
            filename: file.name,
            records: [],
            headers: [],
            metadata: {
              rowCount: 0,
              columnCount: 0,
              processedAt: Date.now(),
              errors: [result.reason instanceof Error ? result.reason.message : 'Failed to process file'],
            },
          } as DNAFileData;
        }
      })
    );

    // Collect errors from file processing
    dnaFiles.forEach((file) => {
      if (file.metadata?.errors && file.metadata.errors.length > 0) {
        file.metadata.errors.forEach((errorMsg) => {
          errors.push({
            filename: file.filename,
            type: 'validation',
            message: errorMsg,
          });
        });
      }
    });

    // Calculate total records
    const totalRecords = dnaFiles.reduce((sum, file) => sum + file.records.length, 0);

    // Merge data if multiple files
    let merged: DNARecord[] | undefined;
    if (dnaFiles.length > 1) {
      merged = DNADataMerger.merge(dnaFiles);
    } else if (dnaFiles.length === 1) {
      merged = dnaFiles[0].records;
    }

    return {
      files: dnaFiles,
      totalRecords,
      errors: errors.length > 0 ? errors : [],
      merged,
    };
  }

  /**
   * Process multiple file input results
   */
  static async processMultiple(
    inputResults: FileInputResult[]
  ): Promise<DNAProcessedData> {
    const allFiles: DNAFileData[] = [];
    const allErrors: ProcessingError[] = [];
    let totalRecords = 0;

    for (const inputResult of inputResults) {
      const processed = await this.process(inputResult);
      allFiles.push(...processed.files);
      allErrors.push(...processed.errors);
      totalRecords += processed.totalRecords;
    }

    // Merge all data if we have multiple files
    const merged = allFiles.length > 0 ? DNADataMerger.merge(allFiles) : undefined;

    return {
      files: allFiles,
      totalRecords,
      errors: allErrors,
      merged,
    };
  }

  /**
   * Process ZIP files by extracting their contents
   */
  private static async processZipFiles(
    files: FileInputResult['files'],
    errors: ProcessingError[]
  ): Promise<FileInputResult['files']> {
    const processedFiles: FileInputResult['files'] = [];
    const zipFiles = files.filter((file) => ZipProcessor.isZipFile(file));
    const nonZipFiles = files.filter((file) => !ZipProcessor.isZipFile(file));

    // Add non-ZIP files directly
    processedFiles.push(...nonZipFiles);

    // Extract ZIP files
    for (const zipFile of zipFiles) {
      try {
        const extracted = await ZipProcessor.extractZip(zipFile);
        processedFiles.push(...extracted);
      } catch (error) {
        errors.push({
          filename: zipFile.name,
          type: 'processing',
          message: error instanceof Error ? error.message : 'Failed to extract ZIP file',
        });
      }
    }

    return processedFiles;
  }

  /**
   * Get summary statistics from processed data
   */
  static getSummary(processed: DNAProcessedData): {
    fileCount: number;
    totalRecords: number;
    errorCount: number;
    headers: string[];
    recordCounts: Record<string, number>;
  } {
    const recordCounts: Record<string, number> = {};
    processed.files.forEach((file) => {
      recordCounts[file.filename] = file.records.length;
    });

    const allHeaders = DNADataMerger.getUnionHeaders(processed.files);

    return {
      fileCount: processed.files.length,
      totalRecords: processed.totalRecords,
      errorCount: processed.errors.length,
      headers: allHeaders,
      recordCounts,
    };
  }
}

