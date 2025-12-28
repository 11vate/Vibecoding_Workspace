/**
 * Self-Verification & Repair System
 *
 * Automatically scans projects for asset issues and repairs them.
 */
import type { AssetEnforcementConfig } from '../../layer-42-asset-enforcement';
/**
 * Verification report
 */
export interface VerificationReport {
    projectPath: string;
    scanned: number;
    assetsFound: number;
    assetsValid: number;
    assetsMissing: number;
    brokenReferences: BrokenReference[];
    missingFiles: string[];
    generated: number;
    errors: string[];
    warnings: string[];
}
/**
 * Broken asset reference
 */
export interface BrokenReference {
    assetId: string;
    filePath: string;
    line: number;
    context: string;
}
/**
 * Repair result
 */
export interface RepairResult {
    success: boolean;
    generated: string[];
    fixed: string[];
    failed: string[];
    errors: string[];
}
/**
 * Verify project assets
 */
export declare function verifyProjectAssets(projectPath: string): Promise<VerificationReport>;
/**
 * Repair missing assets
 */
export declare function repairMissingAssets(report: VerificationReport, config: AssetEnforcementConfig): Promise<RepairResult>;
/**
 * Generate verification report as markdown
 */
export declare function generateVerificationReport(projectPath: string): Promise<string>;
/**
 * Export types
 */
export type { VerificationReport, RepairResult, BrokenReference };
//# sourceMappingURL=self-verification.d.ts.map