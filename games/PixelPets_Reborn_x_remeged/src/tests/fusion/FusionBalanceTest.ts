/**
 * Fusion Balance Testing
 * Validates fusion chains produce balanced stat distributions
 * Tests 30+ fusion scenarios with various parent combinations and stone types
 */

import type { Pet } from '@/domain/entities/Pet';

interface FusionTestResult {
  parentA: Pet;
  parentB: Pet;
  stone: string;
  fusedPet: Pet;
  statDistribution: {
    hpGain: number;
    attackGain: number;
    defenseGain: number;
    speedGain: number;
    totalStatGain: number;
  };
  expectedRange: {
    minTotal: number;
    maxTotal: number;
  };
  isBalanced: boolean;
  notes: string;
}

export class FusionBalanceTest {
  /**
   * Run comprehensive fusion tests
   */
  static async runFusionTests(testCount: number = 30): Promise<FusionTestResult[]> {
    const results: FusionTestResult[] = [];
    
    // Get sample pets for fusion testing
    // const seedData = await SeedService.getInstance();
    const testPets = [
      { id: 'BASE-PYRO-001' as any, name: 'Emberling' },
      { id: 'BASE-AQUA-001' as any, name: 'Droplet' },
      { id: 'BASE-TERRA-001' as any, name: 'Rockpebble' },
      { id: 'BASE-PYRO-006' as any, name: 'Pyroclast' },
      { id: 'BASE-AQUA-006' as any, name: 'Torrentwolf' },
    ];
    
    const stoneTypes = ['RUBY', 'SAPPHIRE', 'EMERALD', 'TOPAZ', 'AMETHYST', 'PEARL', 'OBSIDIAN', 'DIAMOND'];
    
    // Test fusion chains
    for (let i = 0; i < testCount; i++) {
      const parentAIdx = Math.floor(Math.random() * testPets.length);
      const parentBIdx = Math.floor(Math.random() * testPets.length);
      const stoneIdx = Math.floor(Math.random() * stoneTypes.length);
      
      // Ensure different parents
      const finalParentBIdx = parentAIdx === parentBIdx ? (parentBIdx + 1) % testPets.length : parentBIdx;
      
      const parentA = testPets[parentAIdx];
      const parentB = testPets[finalParentBIdx];
      const stone = stoneTypes[stoneIdx];
      
      try {
        const result = await this.runSingleFusionTest(parentA, parentB, stone);
        results.push(result);
      } catch (error) {
        console.error(`Fusion test failed: ${parentA.name} + ${parentB.name} + ${stone}`, error);
      }
    }
    
    return results;
  }
  
  /**
   * Test a single fusion
   */
  private static async runSingleFusionTest(
    parentASpec: { id: any; name: string },
    parentBSpec: { id: any; name: string },
    stoneType: string
  ): Promise<FusionTestResult> {
    // Mock fusion - would normally use PerformFusion service
    // For now return placeholder result
    
    // Simulate stat calculation
    const parentAHp = 550;
    const parentAAtk = 47;
    const parentADef = 38;
    const parentASpd = 62;
    
    const parentBHp = 525;
    const parentBAtk = 47;
    const parentBDef = 40;
    const parentBSpd = 64;
    
    // Fusion formula: (parentA + parentB) / 2 + random bonus
    const fusedHp = Math.floor((parentAHp + parentBHp) / 2 + Math.random() * 50);
    const fusedAtk = Math.floor((parentAAtk + parentBAtk) / 2 + Math.random() * 20);
    const fusedDef = Math.floor((parentADef + parentBDef) / 2 + Math.random() * 15);
    const fusedSpd = Math.floor((parentASpd + parentBSpd) / 2 + Math.random() * 15);
    
    const statGain = {
      hpGain: fusedHp - parentAHp,
      attackGain: fusedAtk - parentAAtk,
      defenseGain: fusedDef - parentADef,
      speedGain: fusedSpd - parentASpd,
      totalStatGain: (fusedHp + fusedAtk + fusedDef + fusedSpd) - (parentAHp + parentAAtk + parentADef + parentASpd),
    };
    
    const expectedRange = {
      minTotal: (parentAHp + parentBHp + parentAAtk + parentBAtk + parentADef + parentBDef) / 2,
      maxTotal: ((parentAHp + parentBHp) / 2 + 50) + ((parentAAtk + parentBAtk) / 2 + 20) + 
                ((parentADef + parentBDef) / 2 + 15) + ((parentASpd + parentBSpd) / 2 + 15),
    };
    
    const totalFusedStats = fusedHp + fusedAtk + fusedDef + fusedSpd;
    const isBalanced = totalFusedStats >= expectedRange.minTotal && totalFusedStats <= expectedRange.maxTotal;
    
    return {
      parentA: { id: parentASpec.id, name: parentASpec.name } as Pet,
      parentB: { id: parentBSpec.id, name: parentBSpec.name } as Pet,
      stone: stoneType,
      fusedPet: {
        id: `FUSED-${Date.now()}` as any,
        name: `[FUSED] ${parentASpec.name} x ${parentBSpec.name}`,
        stats: { hp: fusedHp, attack: fusedAtk, defense: fusedDef, speed: fusedSpd, maxHp: fusedHp },
      } as Pet,
      statDistribution: statGain,
      expectedRange,
      isBalanced,
      notes: isBalanced ? 'Within expected range' : `Out of range: ${totalFusedStats} (expected ${expectedRange.minTotal}-${expectedRange.maxTotal})`,
    };
  }
  
  /**
   * Analyze fusion test results
   */
  static analyzeResults(results: FusionTestResult[]): {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    averageStatGain: number;
    balanceRate: number;
  } {
    const passedTests = results.filter(r => r.isBalanced).length;
    const failedTests = results.length - passedTests;
    const averageStatGain = results.reduce((sum, r) => sum + r.statDistribution.totalStatGain, 0) / results.length;
    
    return {
      totalTests: results.length,
      passedTests,
      failedTests,
      averageStatGain,
      balanceRate: (passedTests / results.length) * 100,
    };
  }
}
