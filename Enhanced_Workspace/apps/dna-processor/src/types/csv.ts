/**
 * Types for CSV parsing and validation
 */

export interface CSVParseOptions {
  header?: boolean;
  delimiter?: string;
  skipEmptyLines?: boolean;
  transformHeader?: (header: string) => string;
}

export interface CSVParseResult<T = Record<string, string>> {
  data: T[];
  errors: CSVParseError[];
  meta: CSVMeta;
}

export interface CSVParseError {
  type: 'FieldMismatch' | 'Quotes' | 'Delimiter' | 'LineBreaks' | 'Unknown';
  code: string;
  message: string;
  row?: number;
  field?: string;
}

export interface CSVMeta {
  delimiter: string;
  linebreak: string;
  aborted: boolean;
  fields?: string[];
  truncated: boolean;
  cursor: number;
}









