/**
 * LAYER 3 — UI SYSTEMIZATION
 *
 * Treat UI Like Gameplay
 * UI should react to game state, not just user input
 */
/**
 * UI Sentiment - the emotional state the UI should convey
 */
export type UISentiment = "calm" | "anticipation" | "instability" | "danger" | "revelation";
/**
 * UI Screen State - combines sentiment with intensity
 */
export interface UIScreenState {
    sentiment: UISentiment;
    intensity: number;
}
/**
 * Sentiment-to-Color mapping
 * UI colors should shift based on sentiment to reinforce emotion
 */
export declare const SENTIMENT_COLORS: Record<UISentiment, string>;
/**
 * Sentiment-to-Animation mapping
 * Animations should match the sentiment
 */
export declare const SENTIMENT_ANIMATIONS: Record<UISentiment, {
    type: string;
    duration: string;
    easing: string;
}>;
//# sourceMappingURL=layer-3-ui-states.d.ts.map