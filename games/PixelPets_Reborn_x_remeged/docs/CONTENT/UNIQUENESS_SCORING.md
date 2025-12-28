# Uniqueness Scoring System

## Overview
The Uniqueness Scoring System quantifies how unique a fusion result is on a scale of 0-100 points. This system provides players with feedback on fusion quality and adds a meta-game element by rewarding creative and strategic fusion decisions.

## Scoring Components (Total: 0-100 points)

### 1. Ability Uniqueness (0-30 points)
This component measures how unique the abilities are compared to the parents and standard templates.

**Scoring:**
- 0-5 unique abilities: 0 points
- 1 unique ability: 5 points
- 2 unique abilities: 10 points
- 3 unique abilities: 15 points
- 4+ unique abilities: 20 points
- Each mutated ability (from parents): 3 points
- Truly innovative abilities (not just mutations): 5 points each
- Maximum for this category: 30 points

**Calculation Method:**
- Compare new abilities against parent abilities
- Check against standard ability templates
- Evaluate innovation beyond simple mutation
- Bonus for abilities that combine multiple elements or themes

### 2. Stat Distribution (0-20 points)
Measures deviation from standard stat ratios, rewarding non-standard builds.

**Scoring:**
- Standard stat distribution: 0 points
- 10-25% deviation from standard: 5 points
- 25-50% deviation from standard: 10 points
- 50-75% deviation from standard: 15 points
- 75%+ deviation from standard: 20 points

**Standard Distributions by Rarity:**
- BASIC: HP 40%, ATK 20%, DEF 25%, SPD 15%
- RARE: HP 38%, ATK 22%, DEF 25%, SPD 15%
- SR: HP 35%, ATK 25%, DEF 25%, SPD 15%
- LEGENDARY: HP 32%, ATK 28%, DEF 25%, SPD 15%
- MYTHIC: HP 30%, ATK 30%, DEF 25%, SPD 15%
- PRISMATIC/OMEGA: Significant deviations acceptable

### 3. Element Combination (0-15 points)
Rewards multiple unique elements and rare element combinations.

**Scoring:**
- Single element (no fusion of elements): 0 points
- 2 different elements: 5 points
- 3 different elements: 10 points
- 4+ different elements: 15 points
- Special combinations (Steam, Lava, etc.): Additional 2-5 points
- Rare combination (Plasma, Twilight, etc.): Additional 3-7 points

**Element Counting:**
- Count unique elements from parents
- Count unique elements from stones
- Count resulting fused element combinations
- Consider fusion intent's influence on element usage

### 4. Rarity Factor (0-10 points)
Higher rarity pets have potential for more uniqueness.

**Scoring:**
- BASIC: 0-3 points (lower ceiling)
- RARE: 2-5 points
- SR: 4-7 points
- LEGENDARY: 6-9 points
- MYTHIC: 8-10 points
- PRISMATIC/OMEGA: 10 points

**Multiplier Effect:**
- Higher rarity allows for more complex, unique builds
- More ability slots enable more unique combinations
- Higher base stats allow for more creative distributions

### 5. Name Uniqueness (0-10 points)
Evaluates how unique the generated name is.

**Scoring:**
- Common name (top 100 most common): 0 points
- Semi-common name: 2 points
- Uncommon name: 5 points
- Unique name: 8 points
- Linguistically innovative name: 10 points

**Name Analysis:**
- Compare against standard pet name database
- Check linguistic complexity and creativity
- Evaluate cultural/linguistic blending
- Consider fusion context in naming

### 6. Visual Uniqueness (0-15 points)
Measures how visually unique the pet is based on sprite generation.

**Scoring:**
- Standard visual tags: 0-3 points
- Unusual visual tags: 5-8 points
- Innovative visual combinations: 10-12 points
- Completely unique visual signature: 13-15 points

**Visual Factors:**
- Number of visual tags used
- Combination of visual elements
- Color palette innovation
- Sprite mutation effects (especially for glitched pets)
- Fusion-specific visual elements (from element interactions)

## Comprehensive Scoring Algorithm

### Base Calculation
```
Total Uniqueness Score = AbilityUniqueness + StatDistribution + ElementCombination + RarityFactor + NameUniqueness + VisualUniqueness
```

### Special Bonuses (Additional points, not part of 100 base)
- **Glitched Pet Bonus**: +10 points for glitched fusions
- **Fusion Intent Bonus**: +5 points for intentional fusion intent matching
- **Lineage Uniqueness**: +5 points if parents were themselves unique (score >70)
- **Stone Tier Bonus**: +3 points for Tier IV+ stones used
- **Chaos Stone Bonus**: +5 points for Chaos stone usage
- **Perfect Fusion**: +10 points if all categories score maximum

### Penalties
- **Template Overuse**: -5 points if 50%+ abilities are standard templates
- **Stat Clustering**: -3 points if all stats are within 10% of each other
- **Common Elements**: -3 points if only basic element combinations
- **Repetitive Fusion**: -5 points if too similar to recent fusions

## Implementation Structure

### UniquenessScore Interface
```typescript
interface UniquenessScore {
  totalScore: number; // 0-100+ (with bonuses)
  breakdown: {
    abilityUniqueness: number; // 0-30
    statDistribution: number; // 0-20
    elementCombination: number; // 0-15
    rarityFactor: number; // 0-10
    nameUniqueness: number; // 0-10
    visualUniqueness: number; // 0-15
  };
  bonuses: {
    glitchedPet: boolean;
    fusionIntent: boolean;
    lineageUnique: boolean;
    stoneTier: boolean;
    chaosStone: boolean;
    perfectFusion: boolean;
  };
  penalties: {
    templateOveruse: boolean;
    statClustering: boolean;
    commonElements: boolean;
    repetitiveFusion: boolean;
  };
  totalBonusPoints: number;
  totalPenaltyPoints: number;
  percentile: number; // 0-100 relative to all pets of same rarity
  rank: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
}
```

### Scoring Process

#### Step 1: Ability Analysis
```typescript
function calculateAbilityUniqueness(pet: Pet, parent1: Pet, parent2: Pet): number {
  // Count unique abilities vs parents
  // Count mutated abilities
  // Evaluate innovation beyond templates
  // Return 0-30 points
}
```

#### Step 2: Stat Distribution Analysis
```typescript
function calculateStatDistribution(pet: Pet): number {
  // Calculate deviation from standard ratios
  // Consider rarity-appropriate standards
  // Return 0-20 points
}
```

#### Step 3: Element Combination Analysis
```typescript
function calculateElementCombination(pet: Pet, parent1: Pet, parent2: Pet, stone1: Stone, stone2: Stone): number {
  // Count unique elements from all sources
  // Identify special combinations
  // Return 0-15 points
}
```

#### Step 4: Rarity-Based Scoring
```typescript
function calculateRarityFactor(pet: Pet): number {
  // Based on rarity tier
  // Higher rarity = higher potential uniqueness
  // Return 0-10 points
}
```

#### Step 5: Name Analysis
```typescript
function calculateNameUniqueness(pet: Pet): number {
  // Compare against name database
  // Evaluate linguistic innovation
  // Return 0-10 points
}
```

#### Step 6: Visual Uniqueness
```typescript
function calculateVisualUniqueness(pet: Pet): number {
  // Analyze visual tags
  // Consider sprite mutations
  // Return 0-15 points
}
```

## Scoring Examples

### Example 1: High Uniqueness Fusion
- **Parents**: Pyroclast (Fire) + Icecrystal (Water)
- **Stones**: Opal (Chaos) + Ruby (Fire)
- **Result**: Glitched pet with Steam element
- **Abilities**: 4 unique abilities (15 points) + 2 mutations (6 points) = 21 points
- **Stats**: Very unusual distribution (20 points)
- **Elements**: 4 different elements (15 points)
- **Rarity**: Legendary (9 points)
- **Name**: Linguistically innovative (10 points)
- **Visual**: Unique fusion signature (15 points)
- **Total**: 90 points + Glitched bonus (10) + Chaos Stone (5) = 105 points
- **Rank**: Mythic

### Example 2: Standard Fusion
- **Parents**: Two basic fire pets
- **Stones**: Two basic stones
- **Result**: Standard fire pet
- **Abilities**: 2 template abilities (0 points) + 0 mutations = 0 points
- **Stats**: Standard distribution (0 points)
- **Elements**: Single element (0 points)
- **Rarity**: Basic (2 points)
- **Name**: Common name (0 points)
- **Visual**: Standard visual tags (2 points)
- **Total**: 4 points
- **Rank**: Common

### Example 3: Creative Fusion
- **Parents**: Aquadracon (Water) + Electrosphere (Lightning) 
- **Stones**: Topaz (Lightning) + Sapphire (Water)
- **Result**: Storm-element pet
- **Abilities**: 3 unique abilities (15 points) + 1 mutation (3 points) = 18 points
- **Stats**: Unusual distribution (15 points)
- **Elements**: 2 different elements + special combination (10 points)
- **Rarity**: SR (7 points)
- **Name**: Uncommon name (5 points)
- **Visual**: Unusual visual tags (8 points)
- **Total**: 63 points
- **Rank**: Rare

## Integration Points

### In Fusion Process
- Calculate immediately after fusion completion
- Store score in pet metadata
- Use for collection sorting/filtering
- Display in fusion result screen

### In Collection View
- Allow filtering by uniqueness score
- Sort by uniqueness
- Highlight unique pets
- Show percentile rank

### In Game Feedback
- Show uniqueness score in pet details
- Provide breakdown of score
- Highlight what made pet unique
- Suggest improvements for future fusions

### In Achievement System
- Uniqueness milestones unlock achievements
- "Collector" achievements for unique pets
- "Creator" achievements for unique fusions
- "Explorer" achievements for trying different combinations

## Display Implementation

### Score Visualization
- **Circular progress bar** showing total score
- **Detailed breakdown** in expandable section
- **Rank indicator** (visual badge)
- **Percentile indicator** (top 10%, 25%, etc.)

### Color Coding
- 0-20: Gray (Common)
- 21-40: White (Uncommon) 
- 41-60: Green (Rare)
- 61-80: Blue (Epic)
- 81-95: Purple (Legendary)
- 96-100+: Orange/Red (Mythic)

### Tooltips
- Show what contributed to each score
- Suggest ways to improve uniqueness
- Explain special bonuses received

## Balancing Considerations

### Score Distribution
- Most pets should score 20-60 (normal range)
- High scores (70+) should be rare and meaningful
- Lowest scores should still have some value
- Highest scores should feel truly special

### Progression Incentive
- Low scores encourage improvement
- Medium scores provide reasonable satisfaction
- High scores are meaningful achievements
- Perfect scores are legendary accomplishments

### Gameplay Impact
- Uniqueness score doesn't directly affect battles
- Influences collection value and prestige
- Doesn't replace other important factors
- Adds meta-game layer without complexity

---

This completes the design specification for the uniqueness scoring system in Pixel Pets Reborn X Remerged. The system provides meaningful feedback about fusion quality while rewarding creativity and strategic thinking.