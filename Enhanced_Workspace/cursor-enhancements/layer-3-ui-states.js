/**
 * LAYER 3 — UI SYSTEMIZATION
 *
 * Treat UI Like Gameplay
 * UI should react to game state, not just user input
 */
/**
 * Sentiment-to-Color mapping
 * UI colors should shift based on sentiment to reinforce emotion
 */
export const SENTIMENT_COLORS = {
    calm: "#16213e", // Default panel background
    anticipation: "#0f3460", // Slightly darker, building tension
    instability: "#aa00ff", // Violet, unstable energy
    danger: "#ff0000", // Red, warning
    revelation: "#00ffff" // Cyan, revelation and discovery
};
/**
 * Sentiment-to-Animation mapping
 * Animations should match the sentiment
 */
export const SENTIMENT_ANIMATIONS = {
    calm: {
        type: "breathing",
        duration: "2s",
        easing: "ease-in-out"
    },
    anticipation: {
        type: "slow pulse",
        duration: "1.5s",
        easing: "ease-in-out"
    },
    instability: {
        type: "non-linear pulse",
        duration: "500ms",
        easing: "cubic-bezier(0.4, 0, 1, 1)"
    },
    danger: {
        type: "sharp pulse",
        duration: "300ms",
        easing: "ease-out"
    },
    revelation: {
        type: "bright flash",
        duration: "500ms",
        easing: "ease-out"
    }
};
    * /div>
    * ;
;
    * ;
;
    * `` `
 */

/**
 * State transition guidelines
 * 
 * calm → anticipation: User initiates action, waiting begins
 * anticipation → instability: Process starts, transformation begins
 * instability → revelation: Outcome ready, reveal happens
 * revelation → calm: User acknowledges, returns to normal
 * 
 * Any state → danger: Critical action required (can interrupt flow)
 * danger → calm: Action confirmed or cancelled
 */

/**
 * Intensity scaling
 * 
 * Intensity should scale with:
 * - Importance of the action (fusion = high, button hover = low)
 * - Rarity of outcome (mythic fusion = high, basic fusion = medium)
 * - User's emotional investment (first fusion = high, routine = low)
 */

;
//# sourceMappingURL=layer-3-ui-states.js.map