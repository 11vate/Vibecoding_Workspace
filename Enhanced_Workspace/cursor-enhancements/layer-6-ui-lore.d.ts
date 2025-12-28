/**
 * LAYER 6 — UI LORE
 *
 * Gives UI intentionality and narrative weight
 * Every screen has a story, a purpose, a reason to exist
 */
export declare const UILORE: {
    readonly fusionLab: {
        readonly name: "Fusion Lab";
        readonly description: "An ancient machine that recombines essence";
        readonly narrative: "A mysterious alchemical device where two creatures are merged into something new. The machine hums with unstable energy, ready to transform matter. Each fusion is permanent, consuming the parents to create a unique offspring.";
        readonly feeling: "Mystical transformation, alchemical process, permanent change";
        readonly visualTheme: "Ancient technology, unstable energy, alchemical diagrams";
    };
    readonly battleUI: {
        readonly name: "Battle Interface";
        readonly description: "A tactical overlay reacting to creature instincts";
        readonly narrative: "The battlefield becomes visible through a tactical interface. Creatures act on their own instincts, with the player orchestrating the team composition. Field effects modify the terrain, status effects track creature conditions, and each ability triggers based on the creature's nature.";
        readonly feeling: "Controlled chaos, strategic observation, creature autonomy";
        readonly visualTheme: "Tactical overlay, creature-driven actions, field modifications";
    };
    readonly codex: {
        readonly name: "Collection / Codex";
        readonly description: "A living archive that grows with discovery";
        readonly narrative: "Your collection is a living codex of discovered creatures. Each entry documents a unique being with its own story, lineage, and abilities. The codex grows organically as you fuse and discover new creatures, creating a personal archive of your journey.";
        readonly feeling: "Discovery, documentation, living history, personal archive";
        readonly visualTheme: "Codex/grimoire aesthetic, discovery-focused, lineage visualization";
    };
    readonly summoning: {
        readonly name: "Summoning Circle";
        readonly description: "Where essence becomes creature";
        readonly narrative: "A summoning circle where collected essence is channeled into physical form. The process is ritualistic, transforming raw essence into a living creature. Higher rarity summons require less essence but more skill to acquire the essence itself.";
        readonly feeling: "Ritual, transformation, anticipation, investment";
        readonly visualTheme: "Ritual circle, essence flows, transformation effects";
    };
    readonly dungeon: {
        readonly name: "Dungeon Exploration";
        readonly description: "Challenges that reward essence and stones";
        readonly narrative: "Dungeons are challenges that test your team's strength and strategy. Defeating bosses rewards essence needed for summoning, and stones that enhance fusion. Each tier becomes available as your collection grows, creating natural progression.";
        readonly feeling: "Challenge, progression, reward, mastery";
        readonly visualTheme: "Dungeon depths, boss encounters, reward emphasis";
    };
    readonly teamBuilder: {
        readonly name: "Team Assembly";
        readonly description: "Strategic composition of creatures";
        readonly narrative: "The team builder is where strategy takes shape. You compose teams of creatures, considering their abilities, elements, and synergies. Formation matters, as creatures fight in front or back positions. Each team is saved for different challenges.";
        readonly feeling: "Strategy, composition, preparation, tactical thinking";
        readonly visualTheme: "Tactical interface, formation visualization, synergy indicators";
    };
    readonly leaderboard: {
        readonly name: "Leaderboard";
        readonly description: "Hall of champions and competitors";
        readonly narrative: "The leaderboard shows the strongest teams and most skilled players. Rankings reflect PvP performance, with ratings that adjust based on victories and defeats. Seasonal resets keep competition fresh, and high rankings are earned through skill and creativity.";
        readonly feeling: "Competition, recognition, achievement, skill demonstration";
        readonly visualTheme: "Champion's hall, ranking visualization, achievement focus";
    };
};
/**
 * Helper function to get UI lore for a screen
 */
export declare function getUILore(screenName: keyof typeof UILORE): {
    readonly name: "Fusion Lab";
    readonly description: "An ancient machine that recombines essence";
    readonly narrative: "A mysterious alchemical device where two creatures are merged into something new. The machine hums with unstable energy, ready to transform matter. Each fusion is permanent, consuming the parents to create a unique offspring.";
    readonly feeling: "Mystical transformation, alchemical process, permanent change";
    readonly visualTheme: "Ancient technology, unstable energy, alchemical diagrams";
} | {
    readonly name: "Battle Interface";
    readonly description: "A tactical overlay reacting to creature instincts";
    readonly narrative: "The battlefield becomes visible through a tactical interface. Creatures act on their own instincts, with the player orchestrating the team composition. Field effects modify the terrain, status effects track creature conditions, and each ability triggers based on the creature's nature.";
    readonly feeling: "Controlled chaos, strategic observation, creature autonomy";
    readonly visualTheme: "Tactical overlay, creature-driven actions, field modifications";
} | {
    readonly name: "Collection / Codex";
    readonly description: "A living archive that grows with discovery";
    readonly narrative: "Your collection is a living codex of discovered creatures. Each entry documents a unique being with its own story, lineage, and abilities. The codex grows organically as you fuse and discover new creatures, creating a personal archive of your journey.";
    readonly feeling: "Discovery, documentation, living history, personal archive";
    readonly visualTheme: "Codex/grimoire aesthetic, discovery-focused, lineage visualization";
} | {
    readonly name: "Summoning Circle";
    readonly description: "Where essence becomes creature";
    readonly narrative: "A summoning circle where collected essence is channeled into physical form. The process is ritualistic, transforming raw essence into a living creature. Higher rarity summons require less essence but more skill to acquire the essence itself.";
    readonly feeling: "Ritual, transformation, anticipation, investment";
    readonly visualTheme: "Ritual circle, essence flows, transformation effects";
} | {
    readonly name: "Dungeon Exploration";
    readonly description: "Challenges that reward essence and stones";
    readonly narrative: "Dungeons are challenges that test your team's strength and strategy. Defeating bosses rewards essence needed for summoning, and stones that enhance fusion. Each tier becomes available as your collection grows, creating natural progression.";
    readonly feeling: "Challenge, progression, reward, mastery";
    readonly visualTheme: "Dungeon depths, boss encounters, reward emphasis";
} | {
    readonly name: "Team Assembly";
    readonly description: "Strategic composition of creatures";
    readonly narrative: "The team builder is where strategy takes shape. You compose teams of creatures, considering their abilities, elements, and synergies. Formation matters, as creatures fight in front or back positions. Each team is saved for different challenges.";
    readonly feeling: "Strategy, composition, preparation, tactical thinking";
    readonly visualTheme: "Tactical interface, formation visualization, synergy indicators";
} | {
    readonly name: "Leaderboard";
    readonly description: "Hall of champions and competitors";
    readonly narrative: "The leaderboard shows the strongest teams and most skilled players. Rankings reflect PvP performance, with ratings that adjust based on victories and defeats. Seasonal resets keep competition fresh, and high rankings are earned through skill and creativity.";
    readonly feeling: "Competition, recognition, achievement, skill demonstration";
    readonly visualTheme: "Champion's hall, ranking visualization, achievement focus";
};
//# sourceMappingURL=layer-6-ui-lore.d.ts.map