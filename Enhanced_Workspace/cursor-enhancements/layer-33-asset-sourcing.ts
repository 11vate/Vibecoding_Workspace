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
export const ASSET_SOURCING = {
  /**
   * Free Asset Sources
   */
  sources: {
    opengameart: {
      name: "OpenGameArt.org",
      url: "https://opengameart.org",
      description: "Large repository of free game art assets",
      assetTypes: ["Sprites", "Backgrounds", "Tiles", "UI", "Audio", "3D Models"],
      licenseTypes: ["CC0", "CC-BY", "CC-BY-SA", "GPL"],
      attributionRequired: true,
      commercialUse: true,
      modificationAllowed: true,
      notes: [
        "Very large collection",
        "Various quality levels",
        "Check individual asset licenses",
        "Community-driven"
      ]
    },
    
    itchIo: {
      name: "Itch.io Free Assets",
      url: "https://itch.io/game-assets/free",
      description: "Free game assets on Itch.io marketplace",
      assetTypes: ["Sprites", "Backgrounds", "UI", "Audio", "Fonts", "Templates"],
      licenseTypes: ["CC0", "CC-BY", "Custom", "Proprietary"],
      attributionRequired: true,
      commercialUse: true,
      modificationAllowed: true,
      notes: [
        "Mix of free and paid",
        "Check individual licenses",
        "Many high-quality assets",
        "Support independent creators"
      ]
    },
    
    kenney: {
      name: "Kenney.nl",
      url: "https://kenney.nl/assets",
      description: "High-quality free game asset packs by Kenney",
      assetTypes: ["Sprites", "UI", "Audio", "3D Models"],
      licenseTypes: ["CC0"],
      attributionRequired: false,
      commercialUse: true,
      modificationAllowed: true,
      notes: [
        "CC0 (public domain)",
        "High quality",
        "Consistent style",
        "Large asset packs",
        "No attribution required"
      ]
    },
    
    craftpix: {
      name: "Craftpix Free Assets",
      url: "https://craftpix.net/freebies",
      description: "Free game asset packs (with paid premium versions)",
      assetTypes: ["Sprites", "Backgrounds", "UI", "Characters"],
      licenseTypes: ["Custom", "Proprietary"],
      attributionRequired: true,
      commercialUse: true,
      modificationAllowed: true,
      notes: [
        "Free packs available",
        "Check license terms",
        "High-quality pixel art",
        "Commercial use allowed"
      ]
    },
    
    pexels: {
      name: "Pexels",
      url: "https://www.pexels.com",
      description: "Free stock photos and textures",
      assetTypes: ["Textures", "Backgrounds", "Photos"],
      licenseTypes: ["Pexels License"],
      attributionRequired: false,
      commercialUse: true,
      modificationAllowed: true,
      notes: [
        "Free for commercial use",
        "No attribution required (but appreciated)",
        "Photos and textures",
        "Need to process for game use"
      ]
    },
    
    pixabay: {
      name: "Pixabay",
      url: "https://pixabay.com",
      description: "Free images, vectors, and illustrations",
      assetTypes: ["Textures", "Backgrounds", "Illustrations", "Vectors"],
      licenseTypes: ["Pixabay License"],
      attributionRequired: false,
      commercialUse: true,
      modificationAllowed: true,
      notes: [
        "Free for commercial use",
        "No attribution required",
        "Large collection",
        "Various styles"
      ]
    },
    
    freepik: {
      name: "Freepik",
      url: "https://www.freepik.com",
      description: "Free vectors, photos, and PSD files (with attribution)",
      assetTypes: ["Vectors", "Photos", "Icons", "Templates"],
      licenseTypes: ["Freepik License"],
      attributionRequired: true,
      commercialUse: true,
      modificationAllowed: true,
      notes: [
        "Attribution required",
        "Free version has attribution requirement",
        "Premium available",
        "High-quality assets"
      ]
    },
    
    freesound: {
      name: "Freesound",
      url: "https://freesound.org",
      description: "Free sound effects and audio",
      assetTypes: ["Audio", "Sound Effects", "Music"],
      licenseTypes: ["CC0", "CC-BY", "CC-BY-NC"],
      attributionRequired: true,
      commercialUse: true,
      modificationAllowed: true,
      notes: [
        "Large audio library",
        "Various licenses",
        "Check individual licenses",
        "Community-contributed"
      ]
    },
    
    creativeCommons: {
      name: "Creative Commons Search",
      url: "https://search.creativecommons.org",
      description: "Search engine for Creative Commons licensed content",
      assetTypes: ["All types"],
      licenseTypes: ["CC0", "CC-BY", "CC-BY-SA", "CC-BY-NC", "CC-BY-NC-SA"],
      attributionRequired: true,
      commercialUse: true,
      modificationAllowed: true,
      notes: [
        "Aggregates multiple sources",
        "Filter by license type",
        "Various quality levels",
        "Check source for actual license"
      ]
    },
    
    gameDevMarket: {
      name: "GameDev Market Free Assets",
      url: "https://www.gamedevmarket.net/category/free",
      description: "Free game assets from GameDev Market",
      assetTypes: ["Sprites", "UI", "Audio", "Fonts", "Templates"],
      licenseTypes: ["Custom", "Proprietary"],
      attributionRequired: true,
      commercialUse: true,
      modificationAllowed: true,
      notes: [
        "Free section available",
        "Check individual licenses",
        "Professional quality",
        "Support creators"
      ]
    }
  },

  /**
   * License Types
   */
  licenses: {
    cc0: {
      type: "CC0" as LicenseType,
      name: "Public Domain (CC0)",
      description: "Dedicated to public domain, no restrictions",
      attributionRequired: false,
      commercialUse: true,
      modificationAllowed: true,
      shareAlike: false,
      redistribution: true,
      notes: [
        "No attribution required",
        "Commercial use allowed",
        "Modification allowed",
        "Most permissive license",
        "Best for game development"
      ]
    },
    
    ccBy: {
      type: "CC-BY" as LicenseType,
      name: "Creative Commons Attribution",
      description: "Must attribute creator, commercial use allowed",
      attributionRequired: true,
      commercialUse: true,
      modificationAllowed: true,
      shareAlike: false,
      redistribution: true,
      notes: [
        "Attribution required",
        "Commercial use allowed",
        "Modification allowed",
        "Must credit creator"
      ]
    },
    
    ccBySa: {
      type: "CC-BY-SA" as LicenseType,
      name: "Creative Commons Attribution-ShareAlike",
      description: "Must attribute and use same license",
      attributionRequired: true,
      commercialUse: true,
      modificationAllowed: true,
      shareAlike: true,
      redistribution: true,
      notes: [
        "Attribution required",
        "Must use same license (CC-BY-SA)",
        "Commercial use allowed",
        "Derivative works must share license"
      ]
    },
    
    ccByNc: {
      type: "CC-BY-NC" as LicenseType,
      name: "Creative Commons Attribution-NonCommercial",
      description: "Must attribute, no commercial use",
      attributionRequired: true,
      commercialUse: false,
      modificationAllowed: true,
      shareAlike: false,
      redistribution: true,
      notes: [
        "Attribution required",
        "Non-commercial use only",
        "Not suitable for commercial games",
        "Modification allowed"
      ]
    },
    
    ccByNcSa: {
      type: "CC-BY-NC-SA" as LicenseType,
      name: "Creative Commons Attribution-NonCommercial-ShareAlike",
      description: "Must attribute, no commercial use, same license",
      attributionRequired: true,
      commercialUse: false,
      modificationAllowed: true,
      shareAlike: true,
      redistribution: true,
      notes: [
        "Attribution required",
        "Non-commercial use only",
        "Must use same license",
        "Not suitable for commercial games"
      ]
    },
    
    mit: {
      type: "MIT" as LicenseType,
      name: "MIT License",
      description: "Permissive license, mainly for code/assets",
      attributionRequired: true,
      commercialUse: true,
      modificationAllowed: true,
      shareAlike: false,
      redistribution: true,
      notes: [
        "Attribution required",
        "Commercial use allowed",
        "Very permissive",
        "Common for code/assets"
      ]
    },
    
    apache: {
      type: "Apache" as LicenseType,
      name: "Apache License",
      description: "Permissive license with patent grant",
      attributionRequired: true,
      commercialUse: true,
      modificationAllowed: true,
      shareAlike: false,
      redistribution: true,
      notes: [
        "Attribution required",
        "Commercial use allowed",
        "Patent grant included",
        "Similar to MIT"
      ]
    },
    
    gpl: {
      type: "GPL" as LicenseType,
      name: "GNU General Public License",
      description: "Copyleft license, derivative works must be GPL",
      attributionRequired: true,
      commercialUse: true,
      modificationAllowed: true,
      shareAlike: true,
      redistribution: true,
      notes: [
        "Copyleft license",
        "Derivative works must be GPL",
        "Commercial use allowed",
        "May require open-sourcing game"
      ]
    },
    
    proprietary: {
      type: "Proprietary" as LicenseType,
      name: "Proprietary License",
      description: "Custom license terms, check specific license",
      attributionRequired: true,
      commercialUse: true,
      modificationAllowed: true,
      shareAlike: false,
      redistribution: true,
      notes: [
        "Check specific terms",
        "Varies by source",
        "Read license carefully",
        "May have restrictions"
      ]
    },
    
    custom: {
      type: "Custom" as LicenseType,
      name: "Custom License",
      description: "Custom license terms, must read specific license",
      attributionRequired: true,
      commercialUse: true,
      modificationAllowed: true,
      shareAlike: false,
      redistribution: true,
      notes: [
        "Read license carefully",
        "Terms vary",
        "Check all requirements",
        "Document license terms"
      ]
    }
  },

  /**
   * License Compliance
   */
  compliance: {
    attribution: {
      description: "Attribution requirements",
      requirements: [
        "Credit creator name",
        "Link to original work (if available)",
        "Link to license",
        "Indicate if modified",
        "Place attribution in credits/README"
      ],
      formats: [
        "In-game credits",
        "README file",
        "License file",
        "About/Attributions section"
      ]
    },
    
    compatibility: {
      description: "License compatibility checking",
      rules: {
        cc0: {
          compatible: ["All licenses"],
          notes: "CC0 is compatible with everything"
        },
        ccBy: {
          compatible: ["CC0", "CC-BY", "CC-BY-SA", "MIT", "Apache", "Proprietary"],
          notes: "Compatible with most licenses, attribution required"
        },
        ccBySa: {
          compatible: ["CC0", "CC-BY-SA"],
          notes: "Requires ShareAlike, must use CC-BY-SA for derivatives"
        },
        ccByNc: {
          compatible: ["CC0", "CC-BY-NC", "CC-BY-NC-SA"],
          notes: "Non-commercial only, not for commercial games"
        }
      }
    },
    
    commercialUse: {
      description: "Commercial use verification",
      checkList: [
        "Verify license allows commercial use",
        "Check for non-commercial restrictions",
        "Verify attribution requirements",
        "Check for additional fees",
        "Review license terms carefully"
      ],
      allowed: ["CC0", "CC-BY", "CC-BY-SA", "MIT", "Apache", "GPL", "Proprietary (check terms)"],
      notAllowed: ["CC-BY-NC", "CC-BY-NC-SA"]
    },
    
    modification: {
      description: "Modification permissions",
      checkList: [
        "Verify license allows modification",
        "Check ShareAlike requirements",
        "Document modifications",
        "Maintain attribution if modified"
      ],
      allowed: ["CC0", "CC-BY", "CC-BY-SA", "CC-BY-NC", "CC-BY-NC-SA", "MIT", "Apache", "GPL"],
      restrictions: [
        "CC-BY-SA and CC-BY-NC-SA require ShareAlike",
        "Some proprietary licenses may restrict modification"
      ]
    },
    
    redistribution: {
      description: "Redistribution rules",
      rules: [
        "Most licenses allow redistribution",
        "Check license terms",
        "Maintain attribution",
        "Include license file",
        "Follow ShareAlike if applicable"
      ]
    }
  },

  /**
   * Asset Documentation
   */
  documentation: {
    licenseTracking: {
      description: "Track licenses for all assets",
      methods: [
        "License metadata in asset files",
        "License tracking file (LICENSES.md)",
        "Asset metadata database",
        "Version control tracking"
      ],
      format: {
        asset: "Asset name",
        source: "Source URL",
        license: "License type",
        author: "Author name",
        url: "Original URL",
        modifications: "Any modifications made"
      }
    },
    
    attributionTemplates: {
      cc0: {
        licenseType: "CC0" as LicenseType,
        template: "[Asset Name] by [Author] - CC0 Public Domain",
        requiredFields: ["Asset Name", "Author"],
        example: "Forest Background by John Doe - CC0 Public Domain"
      },
      
      ccBy: {
        licenseType: "CC-BY" as LicenseType,
        template: "[Asset Name] by [Author] (https://[source-url]) - CC BY [version]",
        requiredFields: ["Asset Name", "Author", "Source URL"],
        example: "Character Sprite by Jane Smith (https://opengameart.org/content/character) - CC BY 3.0"
      },
      
      ccBySa: {
        licenseType: "CC-BY-SA" as LicenseType,
        template: "[Asset Name] by [Author] (https://[source-url]) - CC BY-SA [version]",
        requiredFields: ["Asset Name", "Author", "Source URL"],
        example: "UI Icons by Bob Jones (https://opengameart.org/content/ui-icons) - CC BY-SA 4.0"
      },
      
      kenney: {
        licenseType: "CC0" as LicenseType,
        template: "[Asset Pack Name] by Kenney (https://kenney.nl) - CC0",
        requiredFields: ["Asset Pack Name"],
        example: "UI Pack by Kenney (https://kenney.nl) - CC0"
      },
      
      custom: {
        licenseType: "Custom" as LicenseType,
        template: "[Asset Name] by [Author] - [License Name] (check license for terms)",
        requiredFields: ["Asset Name", "Author", "License Name"],
        example: "Music Track by Artist Name - Custom License (see LICENSE file)"
      }
    },
    
    sourceDocumentation: {
      description: "Document asset sources",
      include: [
        "Source website/URL",
        "Asset URL",
        "Download date",
        "License information",
        "Author information",
        "Modifications made"
      ],
      format: "Markdown or JSON file with source information"
    },
    
    modificationLogs: {
      description: "Log modifications to assets",
      include: [
        "Original asset information",
        "Modifications made",
        "Date of modification",
        "Reason for modification",
        "Modified asset location"
      ]
    },
    
    complianceChecklist: {
      description: "Compliance checklist",
      items: [
        "✓ License verified and documented",
        "✓ Attribution requirements met",
        "✓ Commercial use allowed (if commercial project)",
        "✓ Modification allowed (if modified)",
        "✓ ShareAlike requirements met (if applicable)",
        "✓ Attribution included in credits/README",
        "✓ License file included",
        "✓ Source documented"
      ]
    }
  },

  /**
   * Best Practices
   */
  bestPractices: {
    licenseVerification: {
      description: "License verification workflows",
      steps: [
        "Read license terms carefully",
        "Verify license allows intended use",
        "Check attribution requirements",
        "Document license information",
        "Include in asset metadata",
        "Create attribution entry"
      ]
    },
    
    attributionFile: {
      description: "Attribution file management",
      strategies: [
        "Create ATTRIBUTIONS.md or CREDITS.md",
        "Include all free assets",
        "Format consistently",
        "Update when adding assets",
        "Place in project root or assets folder"
      ],
      format: "Markdown file with organized sections"
    },
    
    licenseExpiration: {
      description: "Track license expiration (if applicable)",
      notes: [
        "Most free licenses don't expire",
        "Check for time-limited free licenses",
        "Track subscription-based asset access",
        "Set reminders for license reviews"
      ]
    },
    
    assetReplacement: {
      description: "Asset replacement strategies",
      scenarios: [
        "License violation discovered",
        "Better asset found",
        "Style consistency needed",
        "Legal concerns"
      ],
      steps: [
        "Identify replacement asset",
        "Verify new license",
        "Test replacement",
        "Update documentation",
        "Remove old asset",
        "Update attributions"
      ]
    },
    
    legalRiskMitigation: {
      description: "Mitigate legal risks",
      strategies: [
        "Use CC0 assets when possible (no restrictions)",
        "Prefer assets from reputable sources",
        "Document all assets and licenses",
        "Maintain attribution files",
        "Review licenses before use",
        "Consult legal counsel for commercial projects",
        "Keep license documentation up to date"
      ]
    }
  }
} as const;

/**
 * Check license compatibility
 */
export function checkLicenseCompatibility(license1: LicenseType, license2: LicenseType): LicenseCompatibility {
  // Simplified compatibility check
  if (license1 === "CC0") return "compatible";
  if (license1 === license2) return "compatible";
  if (license1.includes("NC") && license2.includes("NC")) {
    return license1.includes("SA") && license2.includes("SA") ? "compatible" : "conditional";
  }
  return "unknown";
}

/**
 * Get attribution template for license
 */
export function getAttributionTemplate(licenseType: LicenseType): AttributionTemplate | undefined {
  const templates = ASSET_SOURCING.documentation.attributionTemplates;
  return (templates as Record<string, AttributionTemplate>)[licenseType] || templates.custom;
}

/**
 * Check if license allows commercial use
 */
export function allowsCommercialUse(licenseType: LicenseType): boolean {
  const license = ASSET_SOURCING.licenses[licenseType as keyof typeof ASSET_SOURCING.licenses];
  return license?.commercialUse ?? false;
}

/**
 * Type exports
 */
export type { AssetSource, License, LicenseType, LicenseCompatibility, AttributionTemplate };





















