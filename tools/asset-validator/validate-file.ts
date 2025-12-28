/**
 * File Validator - Validate asset file structure
 *
 * Purpose: Validate asset files for technical compliance
 * Authority: Tier 2 (Mandatory for asset validation)
 * Use: Asset quality assurance, batch validation
 */

import * as fs from 'fs';
import * as path from 'path';

export interface FileValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  info: {
    filePath: string;
    fileSize: number;
    format: string;
    dimensions?: { width: number; height: number };
    colorType?: string;
    bitDepth?: number;
  };
}

/**
 * Validate asset file
 */
export async function validateFile(filePath: string): Promise<FileValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check file exists
  if (!fs.existsSync(filePath)) {
    return {
      valid: false,
      errors: ['File does not exist'],
      warnings: [],
      info: {
        filePath,
        fileSize: 0,
        format: 'unknown'
      }
    };
  }

  // Read file
  const buffer = fs.readFileSync(filePath);
  const fileSize = buffer.length;

  // Detect format
  const format = detectFormat(buffer);

  // Validate based on format
  let dimensions: { width: number; height: number } | undefined;
  let colorType: string | undefined;
  let bitDepth: number | undefined;

  switch (format) {
    case 'png':
      const pngResult = validatePNG(buffer);
      errors.push(...pngResult.errors);
      warnings.push(...pngResult.warnings);
      dimensions = pngResult.dimensions;
      colorType = pngResult.colorType;
      bitDepth = pngResult.bitDepth;
      break;

    case 'svg':
      const svgResult = validateSVG(buffer);
      errors.push(...svgResult.errors);
      warnings.push(...svgResult.warnings);
      break;

    case 'jpg':
    case 'jpeg':
      warnings.push('JPEG format detected - PNG or SVG recommended for assets');
      break;

    default:
      errors.push(`Unknown or unsupported file format`);
  }

  // Check file size
  const sizeLimit = format === 'png' ? 1024 * 1024 : 100 * 1024; // 1MB for PNG, 100KB for others
  if (fileSize > sizeLimit) {
    warnings.push(`File size (${formatFileSize(fileSize)}) exceeds recommended limit (${formatFileSize(sizeLimit)})`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    info: {
      filePath,
      fileSize,
      format,
      dimensions,
      colorType,
      bitDepth
    }
  };
}

/**
 * Detect file format from buffer
 */
function detectFormat(buffer: Buffer): string {
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  if (buffer.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return 'png';
  }

  // JPEG signature: FF D8 FF
  if (buffer.slice(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) {
    return 'jpg';
  }

  // SVG (starts with < or <?xml)
  const start = buffer.slice(0, 100).toString('utf-8');
  if (start.includes('<svg') || start.includes('<?xml')) {
    return 'svg';
  }

  return 'unknown';
}

/**
 * Validate PNG file
 */
function validatePNG(buffer: Buffer): {
  errors: string[];
  warnings: string[];
  dimensions?: { width: number; height: number };
  colorType?: string;
  bitDepth?: number;
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Verify PNG signature
    const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    if (!buffer.slice(0, 8).equals(pngSignature)) {
      errors.push('Invalid PNG signature');
      return { errors, warnings };
    }

    // Read IHDR chunk (required, at offset 8)
    const ihdrLength = buffer.readUInt32BE(8);
    const ihdrType = buffer.slice(12, 16).toString('ascii');

    if (ihdrType !== 'IHDR') {
      errors.push('Missing or invalid IHDR chunk');
      return { errors, warnings };
    }

    // Parse IHDR data
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    const bitDepth = buffer.readUInt8(24);
    const colorTypeValue = buffer.readUInt8(25);
    const compressionMethod = buffer.readUInt8(26);
    const filterMethod = buffer.readUInt8(27);
    const interlaceMethod = buffer.readUInt8(28);

    // Validate dimensions
    if (width === 0 || height === 0) {
      errors.push('Invalid dimensions (0x0)');
    }

    if (width > 4096 || height > 4096) {
      warnings.push(`Very large dimensions (${width}x${height}) - may impact performance`);
    }

    // Validate bit depth
    const validBitDepths = [1, 2, 4, 8, 16];
    if (!validBitDepths.includes(bitDepth)) {
      errors.push(`Invalid bit depth: ${bitDepth}`);
    }

    // Validate color type
    const colorTypes: Record<number, string> = {
      0: 'Grayscale',
      2: 'RGB',
      3: 'Indexed',
      4: 'Grayscale + Alpha',
      6: 'RGBA'
    };

    const colorType = colorTypes[colorTypeValue];
    if (!colorType) {
      errors.push(`Invalid color type: ${colorTypeValue}`);
    }

    // Recommend RGBA for sprites
    if (colorTypeValue !== 6) {
      warnings.push(`Color type is ${colorType} - RGBA (type 6) recommended for sprites with transparency`);
    }

    // Validate compression method
    if (compressionMethod !== 0) {
      errors.push(`Invalid compression method: ${compressionMethod} (should be 0)`);
    }

    // Validate filter method
    if (filterMethod !== 0) {
      errors.push(`Invalid filter method: ${filterMethod} (should be 0)`);
    }

    // Check for required chunks
    const hasIDAT = buffer.includes(Buffer.from('IDAT', 'ascii'));
    const hasIEND = buffer.includes(Buffer.from('IEND', 'ascii'));

    if (!hasIDAT) {
      errors.push('Missing IDAT chunk (image data)');
    }

    if (!hasIEND) {
      errors.push('Missing IEND chunk (end marker)');
    }

    return {
      errors,
      warnings,
      dimensions: { width, height },
      colorType,
      bitDepth
    };
  } catch (error) {
    errors.push(`PNG validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { errors, warnings };
  }
}

/**
 * Validate SVG file
 */
function validateSVG(buffer: Buffer): {
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const content = buffer.toString('utf-8');

    // Check for SVG root element
    if (!content.includes('<svg')) {
      errors.push('Missing <svg> root element');
    }

    // Check for closing tag
    if (!content.includes('</svg>')) {
      errors.push('Missing </svg> closing tag');
    }

    // Check for viewBox or width/height
    if (!content.includes('viewBox') && !content.includes('width=') && !content.includes('height=')) {
      warnings.push('SVG missing viewBox, width, and height attributes');
    }

    // Check for xmlns
    if (!content.includes('xmlns="http://www.w3.org/2000/svg"')) {
      warnings.push('SVG missing xmlns attribute');
    }

    // Warn about embedded scripts (security)
    if (content.includes('<script')) {
      warnings.push('SVG contains embedded scripts - may be a security risk');
    }

    // Warn about external references
    if (content.includes('xlink:href="http') || content.includes('href="http')) {
      warnings.push('SVG contains external references - may not work offline');
    }

  } catch (error) {
    errors.push(`SVG validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return { errors, warnings };
}

/**
 * Batch validate files
 */
export async function validateFiles(filePaths: string[]): Promise<FileValidationResult[]> {
  const results: FileValidationResult[] = [];

  for (const filePath of filePaths) {
    const result = await validateFile(filePath);
    results.push(result);
  }

  return results;
}

/**
 * Validate all files in directory
 */
export async function validateDirectory(
  dirPath: string,
  recursive: boolean = true
): Promise<FileValidationResult[]> {
  const results: FileValidationResult[] = [];

  function scanDirectory(dir: string) {
    if (!fs.existsSync(dir)) {
      return;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && recursive) {
        scanDirectory(fullPath);
      } else if (entry.isFile()) {
        // Only validate image files
        const ext = path.extname(entry.name).toLowerCase();
        if (['.png', '.jpg', '.jpeg', '.svg'].includes(ext)) {
          results.push(validateFile(fullPath) as any); // Will be awaited later
        }
      }
    }
  }

  scanDirectory(dirPath);

  // Await all validations
  return Promise.all(results);
}

/**
 * Format file size
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
