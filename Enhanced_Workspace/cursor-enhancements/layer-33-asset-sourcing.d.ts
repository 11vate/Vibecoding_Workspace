/**
 * LAYER 33 — FREE ASSET SOURCING & LICENSING
 *
 * Guidelines and patterns for sourcing free assets, managing licenses,
 * and ensuring legal compliance
 *
 * This layer provides comprehensive information about free asset sources,
 * license types, compliance requirements, and best practices for using
 * free assets in game development.
 */
/**
 * License type
 */
export type LicenseType = "CC0" | "CC-BY" | "CC-BY-SA" | "CC-BY-NC" | "CC-BY-NC-SA" | "MIT" | "Apache" | "GPL" | "Proprietary" | "Custom";
/**
 * License compatibility
 */
export type LicenseCompatibility = "compatible" | "incompatible" | "conditional" | "unknown";
/**
 * Asset source definition
 */
export interface AssetSource {
    name: string;
    url: string;
    description: string;
    assetTypes: string[];
    licenseTypes: LicenseType[];
    attributionRequired: boolean;
    commercialUse: boolean;
    modificationAllowed: boolean;
    notes?: string[];
}
/**
 * License definition
 */
export interface License {
    type: LicenseType;
    name: string;
    description: string;
    attributionRequired: boolean;
    commercialUse: boolean;
    modificationAllowed: boolean;
    shareAlike: boolean;
    redistribution: boolean;
    notes: string[];
}
/**
 * Attribution template
 */
export interface AttributionTemplate {
    licenseType: LicenseType;
    template: string;
    requiredFields: string[];
    example: string;
}
/**
 * Main asset sourcing configuration
 */
export declare const ASSET_SOURCING: {
    /**
     * Free Asset Sources
     */
    readonly sources: {
        readonly opengameart: {
            readonly name: "OpenGameArt.org";
            readonly url: "https://opengameart.org";
            readonly description: "Large repository of free game art assets";
            readonly assetTypes: readonly ["Sprites", "Backgrounds", "Tiles", "UI", "Audio", "3D Models"];
            readonly licenseTypes: readonly ["CC0", "CC-BY", "CC-BY-SA", "GPL"];
            readonly attributionRequired: true;
            readonly commercialUse: true;
            readonly modificationAllowed: true;
            readonly notes: readonly ["Very large collection", "Various quality levels", "Check individual asset licenses", "Community-driven"];
        };
        readonly itchIo: {
            readonly name: "Itch.io Free Assets";
            readonly url: "https://itch.io/game-assets/free";
            readonly description: "Free game assets on Itch.io marketplace";
            readonly assetTypes: readonly ["Sprites", "Backgrounds", "UI", "Audio", "Fonts", "Templates"];
            readonly licenseTypes: readonly ["CC0", "CC-BY", "Custom", "Proprietary"];
            readonly attributionRequired: true;
            readonly commercialUse: true;
            readonly modificationAllowed: true;
            readonly notes: readonly ["Mix of free and paid", "Check individual licenses", "Many high-quality assets", "Support independent creators"];
        };
        readonly kenney: {
            readonly name: "Kenney.nl";
            readonly url: "https://kenney.nl/assets";
            readonly description: "High-quality free game asset packs by Kenney";
            readonly assetTypes: readonly ["Sprites", "UI", "Audio", "3D Models"];
            readonly licenseTypes: readonly ["CC0"];
            readonly attributionRequired: false;
            readonly commercialUse: true;
            readonly modificationAllowed: true;
            readonly notes: readonly ["CC0 (public domain)", "High quality", "Consistent style", "Large asset packs", "No attribution required"];
        };
        readonly craftpix: {
            readonly name: "Craftpix Free Assets";
            readonly url: "https://craftpix.net/freebies";
            readonly description: "Free game asset packs (with paid premium versions)";
            readonly assetTypes: readonly ["Sprites", "Backgrounds", "UI", "Characters"];
            readonly licenseTypes: readonly ["Custom", "Proprietary"];
            readonly attributionRequired: true;
            readonly commercialUse: true;
            readonly modificationAllowed: true;
            readonly notes: readonly ["Free packs available", "Check license terms", "High-quality pixel art", "Commercial use allowed"];
        };
        readonly pexels: {
            readonly name: "Pexels";
            readonly url: "https://www.pexels.com";
            readonly description: "Free stock photos and textures";
            readonly assetTypes: readonly ["Textures", "Backgrounds", "Photos"];
            readonly licenseTypes: readonly ["Pexels License"];
            readonly attributionRequired: false;
            readonly commercialUse: true;
            readonly modificationAllowed: true;
            readonly notes: readonly ["Free for commercial use", "No attribution required (but appreciated)", "Photos and textures", "Need to process for game use"];
        };
        readonly pixabay: {
            readonly name: "Pixabay";
            readonly url: "https://pixabay.com";
            readonly description: "Free images, vectors, and illustrations";
            readonly assetTypes: readonly ["Textures", "Backgrounds", "Illustrations", "Vectors"];
            readonly licenseTypes: readonly ["Pixabay License"];
            readonly attributionRequired: false;
            readonly commercialUse: true;
            readonly modificationAllowed: true;
            readonly notes: readonly ["Free for commercial use", "No attribution required", "Large collection", "Various styles"];
        };
        readonly freepik: {
            readonly name: "Freepik";
            readonly url: "https://www.freepik.com";
            readonly description: "Free vectors, photos, and PSD files (with attribution)";
            readonly assetTypes: readonly ["Vectors", "Photos", "Icons", "Templates"];
            readonly licenseTypes: readonly ["Freepik License"];
            readonly attributionRequired: true;
            readonly commercialUse: true;
            readonly modificationAllowed: true;
            readonly notes: readonly ["Attribution required", "Free version has attribution requirement", "Premium available", "High-quality assets"];
        };
        readonly freesound: {
            readonly name: "Freesound";
            readonly url: "https://freesound.org";
            readonly description: "Free sound effects and audio";
            readonly assetTypes: readonly ["Audio", "Sound Effects", "Music"];
            readonly licenseTypes: readonly ["CC0", "CC-BY", "CC-BY-NC"];
            readonly attributionRequired: true;
            readonly commercialUse: true;
            readonly modificationAllowed: true;
            readonly notes: readonly ["Large audio library", "Various licenses", "Check individual licenses", "Community-contributed"];
        };
        readonly creativeCommons: {
            readonly name: "Creative Commons Search";
            readonly url: "https://search.creativecommons.org";
            readonly description: "Search engine for Creative Commons licensed content";
            readonly assetTypes: readonly ["All types"];
            readonly licenseTypes: readonly ["CC0", "CC-BY", "CC-BY-SA", "CC-BY-NC", "CC-BY-NC-SA"];
            readonly attributionRequired: true;
            readonly commercialUse: true;
            readonly modificationAllowed: true;
            readonly notes: readonly ["Aggregates multiple sources", "Filter by license type", "Various quality levels", "Check source for actual license"];
        };
        readonly gameDevMarket: {
            readonly name: "GameDev Market Free Assets";
            readonly url: "https://www.gamedevmarket.net/category/free";
            readonly description: "Free game assets from GameDev Market";
            readonly assetTypes: readonly ["Sprites", "UI", "Audio", "Fonts", "Templates"];
            readonly licenseTypes: readonly ["Custom", "Proprietary"];
            readonly attributionRequired: true;
            readonly commercialUse: true;
            readonly modificationAllowed: true;
            readonly notes: readonly ["Free section available", "Check individual licenses", "Professional quality", "Support creators"];
        };
    };
    /**
     * License Types
     */
    readonly licenses: {
        readonly cc0: {
            readonly type: LicenseType;
            readonly name: "Public Domain (CC0)";
            readonly description: "Dedicated to public domain, no restrictions";
            readonly attributionRequired: false;
            readonly commercialUse: true;
            readonly modificationAllowed: true;
            readonly shareAlike: false;
            readonly redistribution: true;
            readonly notes: readonly ["No attribution required", "Commercial use allowed", "Modification allowed", "Most permissive license", "Best for game development"];
        };
        readonly ccBy: {
            readonly type: LicenseType;
            readonly name: "Creative Commons Attribution";
            readonly description: "Must attribute creator, commercial use allowed";
            readonly attributionRequired: true;
            readonly commercialUse: true;
            readonly modificationAllowed: true;
            readonly shareAlike: false;
            readonly redistribution: true;
            readonly notes: readonly ["Attribution required", "Commercial use allowed", "Modification allowed", "Must credit creator"];
        };
        readonly ccBySa: {
            readonly type: LicenseType;
            readonly name: "Creative Commons Attribution-ShareAlike";
            readonly description: "Must attribute and use same license";
            readonly attributionRequired: true;
            readonly commercialUse: true;
            readonly modificationAllowed: true;
            readonly shareAlike: true;
            readonly redistribution: true;
            readonly notes: readonly ["Attribution required", "Must use same license (CC-BY-SA)", "Commercial use allowed", "Derivative works must share license"];
        };
        readonly ccByNc: {
            readonly type: LicenseType;
            readonly name: "Creative Commons Attribution-NonCommercial";
            readonly description: "Must attribute, no commercial use";
            readonly attributionRequired: true;
            readonly commercialUse: false;
            readonly modificationAllowed: true;
            readonly shareAlike: false;
            readonly redistribution: true;
            readonly notes: readonly ["Attribution required", "Non-commercial use only", "Not suitable for commercial games", "Modification allowed"];
        };
        readonly ccByNcSa: {
            readonly type: LicenseType;
            readonly name: "Creative Commons Attribution-NonCommercial-ShareAlike";
            readonly description: "Must attribute, no commercial use, same license";
            readonly attributionRequired: true;
            readonly commercialUse: false;
            readonly modificationAllowed: true;
            readonly shareAlike: true;
            readonly redistribution: true;
            readonly notes: readonly ["Attribution required", "Non-commercial use only", "Must use same license", "Not suitable for commercial games"];
        };
        readonly mit: {
            readonly type: LicenseType;
            readonly name: "MIT License";
            readonly description: "Permissive license, mainly for code/assets";
            readonly attributionRequired: true;
            readonly commercialUse: true;
            readonly modificationAllowed: true;
            readonly shareAlike: false;
            readonly redistribution: true;
            readonly notes: readonly ["Attribution required", "Commercial use allowed", "Very permissive", "Common for code/assets"];
        };
        readonly apache: {
            readonly type: LicenseType;
            readonly name: "Apache License";
            readonly description: "Permissive license with patent grant";
            readonly attributionRequired: true;
            readonly commercialUse: true;
            readonly modificationAllowed: true;
            readonly shareAlike: false;
            readonly redistribution: true;
            readonly notes: readonly ["Attribution required", "Commercial use allowed", "Patent grant included", "Similar to MIT"];
        };
        readonly gpl: {
            readonly type: LicenseType;
            readonly name: "GNU General Public License";
            readonly description: "Copyleft license, derivative works must be GPL";
            readonly attributionRequired: true;
            readonly commercialUse: true;
            readonly modificationAllowed: true;
            readonly shareAlike: true;
            readonly redistribution: true;
            readonly notes: readonly ["Copyleft license", "Derivative works must be GPL", "Commercial use allowed", "May require open-sourcing game"];
        };
        readonly proprietary: {
            readonly type: LicenseType;
            readonly name: "Proprietary License";
            readonly description: "Custom license terms, check specific license";
            readonly attributionRequired: true;
            readonly commercialUse: true;
            readonly modificationAllowed: true;
            readonly shareAlike: false;
            readonly redistribution: true;
            readonly notes: readonly ["Check specific terms", "Varies by source", "Read license carefully", "May have restrictions"];
        };
        readonly custom: {
            readonly type: LicenseType;
            readonly name: "Custom License";
            readonly description: "Custom license terms, must read specific license";
            readonly attributionRequired: true;
            readonly commercialUse: true;
            readonly modificationAllowed: true;
            readonly shareAlike: false;
            readonly redistribution: true;
            readonly notes: readonly ["Read license carefully", "Terms vary", "Check all requirements", "Document license terms"];
        };
    };
    /**
     * License Compliance
     */
    readonly compliance: {
        readonly attribution: {
            readonly description: "Attribution requirements";
            readonly requirements: readonly ["Credit creator name", "Link to original work (if available)", "Link to license", "Indicate if modified", "Place attribution in credits/README"];
            readonly formats: readonly ["In-game credits", "README file", "License file", "About/Attributions section"];
        };
        readonly compatibility: {
            readonly description: "License compatibility checking";
            readonly rules: {
                readonly cc0: {
                    readonly compatible: readonly ["All licenses"];
                    readonly notes: "CC0 is compatible with everything";
                };
                readonly ccBy: {
                    readonly compatible: readonly ["CC0", "CC-BY", "CC-BY-SA", "MIT", "Apache", "Proprietary"];
                    readonly notes: "Compatible with most licenses, attribution required";
                };
                readonly ccBySa: {
                    readonly compatible: readonly ["CC0", "CC-BY-SA"];
                    readonly notes: "Requires ShareAlike, must use CC-BY-SA for derivatives";
                };
                readonly ccByNc: {
                    readonly compatible: readonly ["CC0", "CC-BY-NC", "CC-BY-NC-SA"];
                    readonly notes: "Non-commercial only, not for commercial games";
                };
            };
        };
        readonly commercialUse: {
            readonly description: "Commercial use verification";
            readonly checkList: readonly ["Verify license allows commercial use", "Check for non-commercial restrictions", "Verify attribution requirements", "Check for additional fees", "Review license terms carefully"];
            readonly allowed: readonly ["CC0", "CC-BY", "CC-BY-SA", "MIT", "Apache", "GPL", "Proprietary (check terms)"];
            readonly notAllowed: readonly ["CC-BY-NC", "CC-BY-NC-SA"];
        };
        readonly modification: {
            readonly description: "Modification permissions";
            readonly checkList: readonly ["Verify license allows modification", "Check ShareAlike requirements", "Document modifications", "Maintain attribution if modified"];
            readonly allowed: readonly ["CC0", "CC-BY", "CC-BY-SA", "CC-BY-NC", "CC-BY-NC-SA", "MIT", "Apache", "GPL"];
            readonly restrictions: readonly ["CC-BY-SA and CC-BY-NC-SA require ShareAlike", "Some proprietary licenses may restrict modification"];
        };
        readonly redistribution: {
            readonly description: "Redistribution rules";
            readonly rules: readonly ["Most licenses allow redistribution", "Check license terms", "Maintain attribution", "Include license file", "Follow ShareAlike if applicable"];
        };
    };
    /**
     * Asset Documentation
     */
    readonly documentation: {
        readonly licenseTracking: {
            readonly description: "Track licenses for all assets";
            readonly methods: readonly ["License metadata in asset files", "License tracking file (LICENSES.md)", "Asset metadata database", "Version control tracking"];
            readonly format: {
                readonly asset: "Asset name";
                readonly source: "Source URL";
                readonly license: "License type";
                readonly author: "Author name";
                readonly url: "Original URL";
                readonly modifications: "Any modifications made";
            };
        };
        readonly attributionTemplates: {
            readonly cc0: {
                readonly licenseType: LicenseType;
                readonly template: "[Asset Name] by [Author] - CC0 Public Domain";
                readonly requiredFields: readonly ["Asset Name", "Author"];
                readonly example: "Forest Background by John Doe - CC0 Public Domain";
            };
            readonly ccBy: {
                readonly licenseType: LicenseType;
                readonly template: "[Asset Name] by [Author] (https://[source-url]) - CC BY [version]";
                readonly requiredFields: readonly ["Asset Name", "Author", "Source URL"];
                readonly example: "Character Sprite by Jane Smith (https://opengameart.org/content/character) - CC BY 3.0";
            };
            readonly ccBySa: {
                readonly licenseType: LicenseType;
                readonly template: "[Asset Name] by [Author] (https://[source-url]) - CC BY-SA [version]";
                readonly requiredFields: readonly ["Asset Name", "Author", "Source URL"];
                readonly example: "UI Icons by Bob Jones (https://opengameart.org/content/ui-icons) - CC BY-SA 4.0";
            };
            readonly kenney: {
                readonly licenseType: LicenseType;
                readonly template: "[Asset Pack Name] by Kenney (https://kenney.nl) - CC0";
                readonly requiredFields: readonly ["Asset Pack Name"];
                readonly example: "UI Pack by Kenney (https://kenney.nl) - CC0";
            };
            readonly custom: {
                readonly licenseType: LicenseType;
                readonly template: "[Asset Name] by [Author] - [License Name] (check license for terms)";
                readonly requiredFields: readonly ["Asset Name", "Author", "License Name"];
                readonly example: "Music Track by Artist Name - Custom License (see LICENSE file)";
            };
        };
        readonly sourceDocumentation: {
            readonly description: "Document asset sources";
            readonly include: readonly ["Source website/URL", "Asset URL", "Download date", "License information", "Author information", "Modifications made"];
            readonly format: "Markdown or JSON file with source information";
        };
        readonly modificationLogs: {
            readonly description: "Log modifications to assets";
            readonly include: readonly ["Original asset information", "Modifications made", "Date of modification", "Reason for modification", "Modified asset location"];
        };
        readonly complianceChecklist: {
            readonly description: "Compliance checklist";
            readonly items: readonly ["✓ License verified and documented", "✓ Attribution requirements met", "✓ Commercial use allowed (if commercial project)", "✓ Modification allowed (if modified)", "✓ ShareAlike requirements met (if applicable)", "✓ Attribution included in credits/README", "✓ License file included", "✓ Source documented"];
        };
    };
    /**
     * Best Practices
     */
    readonly bestPractices: {
        readonly licenseVerification: {
            readonly description: "License verification workflows";
            readonly steps: readonly ["Read license terms carefully", "Verify license allows intended use", "Check attribution requirements", "Document license information", "Include in asset metadata", "Create attribution entry"];
        };
        readonly attributionFile: {
            readonly description: "Attribution file management";
            readonly strategies: readonly ["Create ATTRIBUTIONS.md or CREDITS.md", "Include all free assets", "Format consistently", "Update when adding assets", "Place in project root or assets folder"];
            readonly format: "Markdown file with organized sections";
        };
        readonly licenseExpiration: {
            readonly description: "Track license expiration (if applicable)";
            readonly notes: readonly ["Most free licenses don't expire", "Check for time-limited free licenses", "Track subscription-based asset access", "Set reminders for license reviews"];
        };
        readonly assetReplacement: {
            readonly description: "Asset replacement strategies";
            readonly scenarios: readonly ["License violation discovered", "Better asset found", "Style consistency needed", "Legal concerns"];
            readonly steps: readonly ["Identify replacement asset", "Verify new license", "Test replacement", "Update documentation", "Remove old asset", "Update attributions"];
        };
        readonly legalRiskMitigation: {
            readonly description: "Mitigate legal risks";
            readonly strategies: readonly ["Use CC0 assets when possible (no restrictions)", "Prefer assets from reputable sources", "Document all assets and licenses", "Maintain attribution files", "Review licenses before use", "Consult legal counsel for commercial projects", "Keep license documentation up to date"];
        };
    };
};
/**
 * Check license compatibility
 */
export declare function checkLicenseCompatibility(license1: LicenseType, license2: LicenseType): LicenseCompatibility;
/**
 * Get attribution template for license
 */
export declare function getAttributionTemplate(licenseType: LicenseType): AttributionTemplate | undefined;
/**
 * Check if license allows commercial use
 */
export declare function allowsCommercialUse(licenseType: LicenseType): boolean;
/**
 * Type exports
 */
export type { AssetSource, License, LicenseType, LicenseCompatibility, AttributionTemplate };
//# sourceMappingURL=layer-33-asset-sourcing.d.ts.map