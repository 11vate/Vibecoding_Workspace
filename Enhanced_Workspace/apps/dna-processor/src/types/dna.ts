/**
 * Types for DNA data structures
 * These will be refined based on the actual DNA data format
 */

export interface DNARecord {
  [key: string]: string | number | null;
}

export interface DNAFileData {
  filename: string;
  records: DNARecord[];
  headers: string[];
  metadata?: DNAFileMetadata;
}

export interface DNAFileMetadata {
  rowCount: number;
  columnCount: number;
  processedAt: number;
  errors?: string[];
}

export interface DNAProcessedData {
  files: DNAFileData[];
  totalRecords: number;
  errors: ProcessingError[];
  merged?: DNARecord[]; // Optional merged dataset
}

export interface ProcessingError {
  filename: string;
  type: 'parse' | 'validation' | 'processing' | 'unknown';
  message: string;
  details?: unknown;
}









