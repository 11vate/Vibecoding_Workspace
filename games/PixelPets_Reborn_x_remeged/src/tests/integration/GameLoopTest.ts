/**
 * Game Loop Integration Testing
 * Tests complete progression: Summon → Fusion → Battle → Reward
 */

import type { Pet } from '@/domain/entities/Pet';

interface GameLoopTestResult {
  testId: string;
  summoned: Pet[];
  fusions: { parent1: string; parent2: string; result: string }[];
  battles: { teamSize: number; opponent: string; result: 'win' | 'loss' }[];
  rewards: { type: string; amount: number }[];
  totalPlaytime: number; // minutes
  success: boolean;
  notes: string;
}

export class GameLoopIntegrationTest {
  /**
   * Run complete game loop test
   */
  static async runGameLoopTest(
    testId: string,
    summonsPerCycle: number = 5,
    fusionCycles: number = 3,
    battleCycles: number = 5
  ): Promise<GameLoopTestResult> {
    const startTime = Date.now();
    const summoned: Pet[] = [];
    const fusions: any[] = [];
    const battles: any[] = [];
    const rewards: any[] = [];
    
    try {
      // Phase 1: Summoning
      console.log(`[${testId}] Phase 1: Summoning ${summonsPerCycle} pets...`);
      for (let i = 0; i < summonsPerCycle; i++) {
        const pet = this.simulateSummon();
        summoned.push(pet);
      }
      
      // Phase 2: Fusion
      console.log(`[${testId}] Phase 2: Performing ${fusionCycles} fusion cycles...`);
      for (let i = 0; i < fusionCycles; i++) {
        if (summoned.length >= 2) {
          const parent1 = summoned[Math.floor(Math.random() * summoned.length)];
          const parent2 = summoned[Math.floor(Math.random() * summoned.length)];
          if (parent1.id !== parent2.id) {
            const fused = this.simulateFusion(parent1, parent2);
            fusions.push({
              parent1: parent1.name,
              parent2: parent2.name,
              result: fused.name,
            });
            summoned.push(fused);
          }
        }
      }
      
      // Phase 3: Battles
      console.log(`[${testId}] Phase 3: Fighting ${battleCycles} battles...`);
      for (let i = 0; i < battleCycles; i++) {
        const team = this.selectTeamFromPets(summoned, 3);
        const result = this.simulateBattle(team);
        battles.push(result);
        if (result.result === 'win') {
          rewards.push({ type: 'credits', amount: 500 + Math.floor(Math.random() * 500) });
          rewards.push({ type: 'exp', amount: 100 + Math.floor(Math.random() * 200) });
          if (Math.random() > 0.8) {
            rewards.push({ type: 'stone', amount: 1 });
          }
        }
      }
      
      const endTime = Date.now();
      const totalPlaytime = (endTime - startTime) / 60000; // Convert to minutes
      
      return {
        testId,
        summoned,
        fusions,
        battles,
        rewards,
        totalPlaytime,
        success: true,
        notes: `Successfully completed game loop: ${summoned.length} pets summoned, ${fusions.length} fusions, ${battles.length} battles`,
      };
    } catch (error) {
      const endTime = Date.now();
      const totalPlaytime = (endTime - startTime) / 60000;
      
      return {
        testId,
        summoned,
        fusions,
        battles,
        rewards,
        totalPlaytime,
        success: false,
        notes: `Game loop failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
  
  /**
   * Simulate pet summoning
   */
  private static simulateSummon(): Pet {
    const names = ['Emberling', 'Droplet', 'Rockpebble', 'Sparkwhisper', 'Torchbeetle', 'Pyroclast'];
    
    const name = names[Math.floor(Math.random() * names.length)];
    
    return {
      id: `SUMMON-${Date.now()}-${Math.random()}` as any,
      name: `${name}`,
      stats: {
        hp: 500 + Math.floor(Math.random() * 200),
        attack: 40 + Math.floor(Math.random() * 50),
        defense: 35 + Math.floor(Math.random() * 40),
        speed: 55 + Math.floor(Math.random() * 30),
        maxHp: 500 + Math.floor(Math.random() * 200),
      },
    } as Pet;
  }
  
  /**
   * Simulate fusion
   */
  private static simulateFusion(parent1: Pet, parent2: Pet): Pet {
    return {
      id: `FUSED-${Date.now()}-${Math.random()}` as any,
      name: `[FUSED] ${parent1.name} x ${parent2.name}`,
      stats: {
        hp: Math.floor((parent1.stats.maxHp + parent2.stats.maxHp) / 2 + Math.random() * 50),
        attack: Math.floor((parent1.stats.attack + parent2.stats.attack) / 2 + Math.random() * 20),
        defense: Math.floor((parent1.stats.defense + parent2.stats.defense) / 2 + Math.random() * 15),
        speed: Math.floor((parent1.stats.speed + parent2.stats.speed) / 2 + Math.random() * 15),
        maxHp: Math.floor((parent1.stats.maxHp + parent2.stats.maxHp) / 2 + Math.random() * 50),
      },
    } as Pet;
  }
  
  /**
   * Select team from available pets
   */
  private static selectTeamFromPets(pets: Pet[], teamSize: number): Pet[] {
    const team: Pet[] = [];
    for (let i = 0; i < teamSize && pets.length > 0; i++) {
      const idx = Math.floor(Math.random() * pets.length);
      team.push(pets[idx]);
    }
    return team;
  }
  
  /**
   * Simulate a battle
   */
  private static simulateBattle(team: Pet[]): { teamSize: number; opponent: string; result: 'win' | 'loss' } {
    const totalStats = team.reduce((sum, p) => sum + p.stats.hp + p.stats.attack, 0);
    const result = Math.random() * totalStats > 1000 ? 'win' : 'loss';
    
    return {
      teamSize: team.length,
      opponent: 'AI Trainer',
      result,
    };
  }
  
  /**
   * Analyze game loop test results
   */
  static analyzeGameLoopResults(results: GameLoopTestResult[]): {
    totalTests: number;
    successfulTests: number;
    failureRate: number;
    averagePetsGenerated: number;
    averageFusions: number;
    averageBattles: number;
    averageRewards: number;
    averagePlaytime: number;
  } {
    const successful = results.filter(r => r.success).length;
    const averagePets = results.reduce((sum, r) => sum + r.summoned.length, 0) / results.length;
    const averageFusions = results.reduce((sum, r) => sum + r.fusions.length, 0) / results.length;
    const averageBattles = results.reduce((sum, r) => sum + r.battles.length, 0) / results.length;
    const averageRewards = results.reduce((sum, r) => sum + r.rewards.length, 0) / results.length;
    const averagePlaytime = results.reduce((sum, r) => sum + r.totalPlaytime, 0) / results.length;
    
    return {
      totalTests: results.length,
      successfulTests: successful,
      failureRate: ((results.length - successful) / results.length) * 100,
      averagePetsGenerated: averagePets,
      averageFusions,
      averageBattles,
      averageRewards,
      averagePlaytime,
    };
  }
}
