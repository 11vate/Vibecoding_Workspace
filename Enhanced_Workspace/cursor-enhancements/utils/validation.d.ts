/**
 * Validation utilities
 */
import { z } from 'zod';
/**
 * Validate data against Zod schema
 */
export declare function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): {
    valid: boolean;
    data?: T;
    errors?: z.ZodError;
};
/**
 * Safe parse with error handling
 */
export declare function safeParse<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: true;
    data: T;
} | {
    success: false;
    error: z.ZodError;
};
/**
 * Validate image buffer
 */
export declare function validateImageBuffer(buffer: Buffer): {
    valid: boolean;
    format?: string;
    error?: string;
};
/**
 * Validate dimensions
 */
export declare function validateDimensions(width: number, height: number, minWidth?: number, minHeight?: number, maxWidth?: number, maxHeight?: number): {
    valid: boolean;
    error?: string;
};
/**
 * Validate color palette
 */
export declare function validateColorPalette(colors: string[], maxColors?: number): {
    valid: boolean;
    error?: string;
    count?: number;
};
/**
 * Validate file path
 */
export declare function validateFilePath(path: string): {
    valid: boolean;
    error?: string;
};
//# sourceMappingURL=validation.d.ts.map