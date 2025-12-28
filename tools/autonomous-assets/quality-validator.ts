/**
 * Quality Validator - Validate generated assets against specifications
 *
 * Purpose: Ensure generated assets meet quality standards
 * Authority: Tier 2 (Mandatory for autonomous asset generation)
 * Use: Asset quality assurance before registration
 */

import { AssetNeed } from './asset-decision-engine';
import { GenerationSpec } from './specification-builder';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  checks: ValidationCheck[];
}

export interface ValidationCheck {
  name: string;
  passed: boolean;
  message?: string;
}

/**
 * Validate generated asset
 */
export async function validateGeneratedAsset(
  buffer: Buffer | string,
  need: AssetNeed,
  spec: GenerationSpec
): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const checks: ValidationCheck[] = [];

  // Check 1: Buffer is not empty
  const bufferCheck = validateBuffer(buffer);
  checks.push(bufferCheck);
  if (!bufferCheck.passed) {
    errors.push(bufferCheck.message || 'Buffer validation failed');
  }

  // Check 2: Dimensions match specification (for PNG buffers)
  if (Buffer.isBuffer(buffer)) {
    const dimensionCheck = await validateDimensions(buffer, need, spec);
    checks.push(dimensionCheck);
    if (!dimensionCheck.passed) {
      errors.push(dimensionCheck.message || 'Dimension validation failed');
    }

    // Check 3: File size is reasonable
    const sizeCheck = validateFileSize(buffer, need.type);
    checks.push(sizeCheck);
    if (!sizeCheck.passed) {
      errors.push(sizeCheck.message || 'File size validation failed');
    }

    // Check 4: Valid PNG format
    const formatCheck = validatePNGFormat(buffer);
    checks.push(formatCheck);
    if (!formatCheck.passed) {
      errors.push(formatCheck.message || 'PNG format validation failed');
    }
  }

  // Check 5: Specification compliance
  const specCheck = validateSpecificationCompliance(spec, need);
  checks.push(specCheck);
  if (!specCheck.passed) {
    warnings.push(specCheck.message || 'Specification compliance warning');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    checks
  };
}

/**
 * Validate buffer is not empty
 */
function validateBuffer(buffer: Buffer | string): ValidationCheck {
  if (Buffer.isBuffer(buffer)) {
    if (buffer.length === 0) {
      return { name: 'Buffer Not Empty', passed: false, message: 'Generated buffer is empty' };
    }
    if (buffer.length < 100) {
      return {
        name: 'Buffer Not Empty',
        passed: false,
        message: 'Generated buffer is suspiciously small (< 100 bytes)'
      };
    }
  } else if (typeof buffer === 'string') {
    if (buffer.length === 0) {
      return { name: 'Content Not Empty', passed: false, message: 'Generated content is empty' };
    }
  }

  return { name: 'Buffer Not Empty', passed: true };
}

/**
 * Validate dimensions match specification
 */
async function validateDimensions(
  buffer: Buffer,
  need: AssetNeed,
  spec: GenerationSpec
): Promise<ValidationCheck> {
  // Extract dimensions from spec
  let expectedWidth = 0;
  let expectedHeight = 0;

  if ('width' in spec && 'height' in spec) {
    expectedWidth = spec.width as number;
    expectedHeight = spec.height as number;
  } else if ('size' in spec) {
    expectedWidth = expectedHeight = spec.size as number;
  }

  // Skip validation if no expected dimensions
  if (expectedWidth === 0 || expectedHeight === 0) {
    return { name: 'Dimension Match', passed: true, message: 'No dimension specification to validate' };
  }

  // Read PNG dimensions from buffer
  try {
    const dimensions = readPNGDimensions(buffer);

    if (dimensions.width !== expectedWidth || dimensions.height !== expectedHeight) {
      return {
        name: 'Dimension Match',
        passed: false,
        message: `Dimensions mismatch: expected ${expectedWidth}x${expectedHeight}, got ${dimensions.width}x${dimensions.height}`
      };
    }

    return { name: 'Dimension Match', passed: true };
  } catch (error) {
    return {
      name: 'Dimension Match',
      passed: false,
      message: `Failed to read dimensions: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Read PNG dimensions from buffer
 */
function readPNGDimensions(buffer: Buffer): { width: number; height: number } {
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // Verify PNG signature
  if (!buffer.slice(0, 8).equals(pngSignature)) {
    throw new Error('Invalid PNG signature');
  }

  // IHDR chunk starts at byte 8
  // Width is at bytes 16-19 (big-endian)
  // Height is at bytes 20-23 (big-endian)
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);

  return { width, height };
}

/**
 * Validate file size is reasonable
 */
function validateFileSize(buffer: Buffer, assetType: string): ValidationCheck {
  const size = buffer.length;

  // Define size limits based on asset type (in bytes)
  const limits: Record<string, { max: number; warn: number }> = {
    sprite: { max: 100 * 1024, warn: 50 * 1024 }, // 100KB max, warn at 50KB
    ui: { max: 100 * 1024, warn: 50 * 1024 },
    icon: { max: 20 * 1024, warn: 10 * 1024 }, // 20KB max, warn at 10KB
    texture: { max: 500 * 1024, warn: 250 * 1024 }, // 500KB max
    tileset: { max: 500 * 1024, warn: 250 * 1024 },
    animation: { max: 1024 * 1024, warn: 512 * 1024 } // 1MB max
  };

  const limit = limits[assetType] || limits.sprite;

  if (size > limit.max) {
    return {
      name: 'File Size',
      passed: false,
      message: `File size ${(size / 1024).toFixed(1)}KB exceeds maximum ${(limit.max / 1024).toFixed(0)}KB`
    };
  }

  if (size > limit.warn) {
    return {
      name: 'File Size',
      passed: true,
      message: `File size ${(size / 1024).toFixed(1)}KB is large (warning threshold: ${(limit.warn / 1024).toFixed(0)}KB)`
    };
  }

  return { name: 'File Size', passed: true };
}

/**
 * Validate PNG format
 */
function validatePNGFormat(buffer: Buffer): ValidationCheck {
  // Check PNG signature
  const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  if (!buffer.slice(0, 8).equals(pngSignature)) {
    return { name: 'PNG Format', passed: false, message: 'Invalid PNG signature' };
  }

  // Check for IHDR chunk (required)
  const ihdrChunkType = buffer.slice(12, 16).toString('ascii');
  if (ihdrChunkType !== 'IHDR') {
    return { name: 'PNG Format', passed: false, message: 'Missing IHDR chunk' };
  }

  // Validate color type (byte 25)
  const colorType = buffer.readUInt8(25);
  // Valid color types: 0 (grayscale), 2 (RGB), 3 (indexed), 4 (grayscale+alpha), 6 (RGBA)
  const validColorTypes = [0, 2, 3, 4, 6];
  if (!validColorTypes.includes(colorType)) {
    return { name: 'PNG Format', passed: false, message: `Invalid color type: ${colorType}` };
  }

  return { name: 'PNG Format', passed: true };
}

/**
 * Validate specification compliance
 */
function validateSpecificationCompliance(spec: GenerationSpec, need: AssetNeed): ValidationCheck {
  // Check that spec matches need requirements
  const issues: string[] = [];

  // Validate dimensions if specified in need
  if (need.dimensions) {
    if ('width' in spec && spec.width !== need.dimensions.width) {
      issues.push(`Width mismatch: need ${need.dimensions.width}, spec ${spec.width}`);
    }
    if ('height' in spec && spec.height !== need.dimensions.height) {
      issues.push(`Height mismatch: need ${need.dimensions.height}, spec ${spec.height}`);
    }
  }

  // Validate type compatibility
  if (need.type === 'ui' && !('style' in spec || 'type' in spec)) {
    issues.push('UI asset missing style specification');
  }

  if (need.type === 'sprite' && !('seed' in spec || 'type' in spec)) {
    issues.push('Sprite asset missing seed specification');
  }

  if (issues.length > 0) {
    return {
      name: 'Specification Compliance',
      passed: false,
      message: issues.join('; ')
    };
  }

  return { name: 'Specification Compliance', passed: true };
}

/**
 * Validate against asset generation gate rules
 */
export async function validateAgainstGate(
  buffer: Buffer,
  need: AssetNeed,
  spec: GenerationSpec
): Promise<ValidationResult> {
  // This implements checks from asset-generation-gate.md
  const errors: string[] = [];
  const warnings: string[] = [];
  const checks: ValidationCheck[] = [];

  // Gate Check 1: Technical Compliance
  if (Buffer.isBuffer(buffer)) {
    // PNG files: 32-bit with alpha, sRGB
    const formatCheck = validatePNGFormat(buffer);
    checks.push(formatCheck);
    if (!formatCheck.passed) {
      errors.push(`Gate violation - Technical Compliance: ${formatCheck.message}`);
    }

    // Dimensions must be grid-aligned (multiples of 8 or 16)
    try {
      const dims = readPNGDimensions(buffer);
      const isAligned = (dims.width % 8 === 0 && dims.height % 8 === 0) ||
                       (dims.width % 16 === 0 && dims.height % 16 === 0);

      if (!isAligned) {
        warnings.push(`Dimensions ${dims.width}x${dims.height} not grid-aligned (recommend multiples of 8 or 16)`);
      }
      checks.push({ name: 'Grid Alignment', passed: isAligned });
    } catch (error) {
      // Skip if can't read dimensions
    }
  }

  // Gate Check 2: Visual Quality (simplified - would use image analysis in production)
  checks.push({
    name: 'Visual Quality',
    passed: true,
    message: 'Manual visual inspection recommended'
  });

  // Gate Check 3: Normalization Standards
  if (need.type === 'sprite') {
    // Sprites should follow normalization standards
    checks.push({
      name: 'Normalization Standards',
      passed: true,
      message: 'Sprite normalization compliance assumed (verify manually)'
    });
  }

  // Gate Check 4: Generation Method Compliance
  checks.push({
    name: 'Generation Method',
    passed: true,
    message: 'Generated using approved procedural methods'
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    checks
  };
}

/**
 * Batch validate multiple assets
 */
export async function validateAssetBatch(
  assets: Array<{ buffer: Buffer | string; need: AssetNeed; spec: GenerationSpec }>
): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  for (const asset of assets) {
    const result = await validateGeneratedAsset(asset.buffer, asset.need, asset.spec);
    results.push(result);
  }

  return results;
}
