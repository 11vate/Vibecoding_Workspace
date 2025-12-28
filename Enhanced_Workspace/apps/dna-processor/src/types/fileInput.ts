/**
 * Types for file and folder input handling
 */

export interface FileInputResult {
  type: 'file' | 'directory';
  name: string;
  files: ProcessedFile[];
  error?: string;
}

export interface ProcessedFile {
  name: string;
  path: string;
  type: string;
  size: number;
  content: string | ArrayBuffer;
  lastModified: number;
}

export interface DirectoryEntry {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  lastModified?: number;
}

export interface FileProcessor {
  canProcess(file: ProcessedFile): boolean;
  process(file: ProcessedFile): Promise<ProcessedData>;
}

export interface ProcessedData {
  file: ProcessedFile;
  data: unknown;
  errors?: string[];
}

export interface FileInputOptions {
  accept?: string[];
  multiple?: boolean;
  recursive?: boolean; // For directory processing
}









