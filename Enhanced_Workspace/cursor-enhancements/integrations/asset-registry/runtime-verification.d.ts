/**
 * Runtime Asset Verification
 *
 * Generates runtime checks that fail fast if assets are missing.
 * Creates engine-specific verification code.
 */
import type { AssetRegistry, AssetEntry } from './asset-registry';
import type { GameFramework } from '../../layer-37-game-frameworks';
/**
 * Runtime verification code
 */
export interface RuntimeVerificationCode {
    code: string;
    language: 'typescript' | 'javascript';
    framework: GameFramework;
    checks: string[];
}
/**
 * Generate runtime checks for assets
 */
export declare function generateRuntimeChecks(assets: AssetEntry[], framework: GameFramework): RuntimeVerificationCode;
/**
 * Create asset loader with verification
 */
export declare function createAssetLoaderWithVerification(registry: AssetRegistry, framework: GameFramework): RuntimeVerificationCode;
/**
 * Export types
 */
export type { RuntimeVerificationCode };
//# sourceMappingURL=runtime-verification.d.ts.map