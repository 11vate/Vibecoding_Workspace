/**
 * Seed Data Rarity Migration Script
 * Converts string rarity values to Rarity enum values
 *
 * Usage: node scripts/migrateSeedDataRarities.js
 *
 * This script:
 * 1. Backs up original files
 * 2. Replaces string rarity values ('Basic', 'Rare', etc.) with enum values (Rarity.BASIC, Rarity.RARE, etc.)
 * 3. Adds Rarity import to files
 * 4. Validates the changes
 */

const fs = require('fs');
const path = require('path');

const FILES_TO_MIGRATE = [
  'src/infrastructure/persistence/seedData/basePets.ts',
  'src/infrastructure/persistence/seedData/basePetsRemaining.ts'
];

const RARITY_MAPPING = {
  "'Basic'": 'Rarity.BASIC',
  '"Basic"': 'Rarity.BASIC',
  "'Rare'": 'Rarity.RARE',
  '"Rare"': 'Rarity.RARE',
  "'SR'": 'Rarity.SR',
  '"SR"': 'Rarity.SR',
  "'Legendary'": 'Rarity.LEGENDARY',
  '"Legendary"': 'Rarity.LEGENDARY',
  "'Mythic'": 'Rarity.MYTHIC',
  '"Mythic"': 'Rarity.MYTHIC',
  "'Prismatic'": 'Rarity.PRISMATIC',
  '"Prismatic"': 'Rarity.PRISMATIC',
  "'Omega'": 'Rarity.OMEGA',
  '"Omega"': 'Rarity.OMEGA'
};

const IMPORT_STATEMENT = "import { Rarity } from '@/shared/types/rarity';";

function migrateFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);

  console.log(`\n[Migration] Processing: ${filePath}`);

  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    console.error(`  ✗ File not found: ${fullPath}`);
    return false;
  }

  // Read file content
  let content = fs.readFileSync(fullPath, 'utf8');
  const originalContent = content;

  // Create backup
  const backupPath = fullPath + '.backup';
  fs.writeFileSync(backupPath, originalContent, 'utf8');
  console.log(`  ✓ Backup created: ${backupPath}`);

  // Check if Rarity import already exists
  const hasImport = content.includes("import { Rarity }") ||
                    content.includes("import type { Rarity }");

  // Add import if missing
  if (!hasImport) {
    // Find the first import statement
    const importMatch = content.match(/^import .+ from .+;/m);
    if (importMatch) {
      const firstImportIndex = content.indexOf(importMatch[0]);
      const beforeFirstImport = content.substring(0, firstImportIndex);
      const afterFirstImport = content.substring(firstImportIndex);

      content = beforeFirstImport + IMPORT_STATEMENT + '\n' + afterFirstImport;
      console.log('  ✓ Added Rarity import');
    } else {
      // No imports found, add at top after comments
      const commentEndMatch = content.match(/\*\/\n/);
      if (commentEndMatch) {
        const commentEndIndex = content.indexOf(commentEndMatch[0]) + commentEndMatch[0].length;
        const beforeCommentEnd = content.substring(0, commentEndIndex);
        const afterCommentEnd = content.substring(commentEndIndex);

        content = beforeCommentEnd + '\n' + IMPORT_STATEMENT + '\n' + afterCommentEnd;
        console.log('  ✓ Added Rarity import after file header');
      } else {
        content = IMPORT_STATEMENT + '\n\n' + content;
        console.log('  ✓ Added Rarity import at top');
      }
    }
  } else {
    console.log('  • Rarity import already exists');
  }

  // Replace string rarity values with enum values
  let replacementCount = 0;
  for (const [stringValue, enumValue] of Object.entries(RARITY_MAPPING)) {
    const regex = new RegExp(stringValue.replace(/['"]/g, '(["\'])') + '(?=,)', 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, enumValue);
      replacementCount += matches.length;
    }
  }

  console.log(`  ✓ Replaced ${replacementCount} rarity values`);

  // Write updated content
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`  ✓ File updated successfully`);

  // Verify changes
  const updatedContent = fs.readFileSync(fullPath, 'utf8');
  const hasStringRarities = /'(?:Basic|Rare|SR|Legendary|Mythic|Prismatic|Omega)',/.test(updatedContent) ||
                            /"(?:Basic|Rare|SR|Legendary|Mythic|Prismatic|Omega)",/.test(updatedContent);

  if (hasStringRarities) {
    console.warn('  ⚠ Warning: File still contains string rarity values');
    console.warn('  → Manual review recommended');
    return false;
  } else {
    console.log('  ✓ Verification passed: No string rarity values found');
    return true;
  }
}

function validateMigration() {
  console.log('\n[Validation] Checking for any remaining string rarities...\n');

  let allValid = true;

  for (const filePath of FILES_TO_MIGRATE) {
    const fullPath = path.join(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
      console.log(`  ✗ ${filePath}: NOT FOUND`);
      allValid = false;
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');

    // Check for Rarity import
    const hasImport = content.includes('import { Rarity }') ||
                     content.includes('import type { Rarity }');

    // Check for string rarities
    const hasStringRarities = /'(?:Basic|Rare|SR|Legendary|Mythic|Prismatic|Omega)',/.test(content) ||
                              /"(?:Basic|Rare|SR|Legendary|Mythic|Prismatic|Omega)",/.test(content);

    // Check for enum rarities
    const hasEnumRarities = /Rarity\.(?:BASIC|RARE|SR|LEGENDARY|MYTHIC|PRISMATIC|OMEGA)/.test(content);

    const status = hasImport && !hasStringRarities && hasEnumRarities ? '✓' : '✗';

    console.log(`  ${status} ${filePath}`);
    console.log(`      Import: ${hasImport ? '✓' : '✗'}`);
    console.log(`      String rarities: ${hasStringRarities ? '✗ FOUND' : '✓ NONE'}`);
    console.log(`      Enum rarities: ${hasEnumRarities ? '✓' : '✗'}`);

    if (!hasImport || hasStringRarities || !hasEnumRarities) {
      allValid = false;
    }
  }

  return allValid;
}

function restoreBackups() {
  console.log('\n[Restore] Restoring from backups...\n');

  for (const filePath of FILES_TO_MIGRATE) {
    const fullPath = path.join(process.cwd(), filePath);
    const backupPath = fullPath + '.backup';

    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, fullPath);
      console.log(`  ✓ Restored: ${filePath}`);
    } else {
      console.log(`  • No backup found for: ${filePath}`);
    }
  }
}

function removeBackups() {
  console.log('\n[Cleanup] Removing backup files...\n');

  for (const filePath of FILES_TO_MIGRATE) {
    const fullPath = path.join(process.cwd(), filePath);
    const backupPath = fullPath + '.backup';

    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
      console.log(`  ✓ Removed: ${backupPath}`);
    }
  }
}

// Main execution
function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  Seed Data Rarity Migration Script');
  console.log('  Converting string rarities to Rarity enum values');
  console.log('═══════════════════════════════════════════════════════════');

  const args = process.argv.slice(2);

  if (args.includes('--restore')) {
    restoreBackups();
    return;
  }

  if (args.includes('--validate-only')) {
    const isValid = validateMigration();
    console.log('\n' + '═'.repeat(60));
    if (isValid) {
      console.log('✓ All files validated successfully');
      process.exit(0);
    } else {
      console.log('✗ Validation failed');
      process.exit(1);
    }
  }

  if (args.includes('--cleanup')) {
    removeBackups();
    return;
  }

  // Run migration
  let success = true;
  for (const filePath of FILES_TO_MIGRATE) {
    const result = migrateFile(filePath);
    if (!result) {
      success = false;
    }
  }

  // Validate
  const isValid = validateMigration();

  console.log('\n' + '═'.repeat(60));
  if (success && isValid) {
    console.log('✓ Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('  1. Review the changes in the migrated files');
    console.log('  2. Run the app to test summoning system');
    console.log('  3. If successful, run: node scripts/migrateSeedDataRarities.js --cleanup');
    console.log('  4. If issues occur, run: node scripts/migrateSeedDataRarities.js --restore');
  } else {
    console.log('✗ Migration encountered issues');
    console.log('\nTo restore from backup:');
    console.log('  node scripts/migrateSeedDataRarities.js --restore');
  }
  console.log('═'.repeat(60));
}

main();
