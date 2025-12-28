/**
 * LAYER 3 — UI SYSTEMIZATION
 * 
 * Treat UI Like Gameplay
 * UI should react to game state, not just user input
 */

/**
 * UI Sentiment - the emotional state the UI should convey
 */
export type UISentiment =
  | "calm"           // Normal state, no action needed
  | "anticipation"   // Waiting for outcome, building tension
  | "instability"    // Fusion in progress, transformation happening
  | "danger"         // Critical action, irreversible decision
  | "revelation";    // Discovery, outcome revealed

/**
 * UI Screen State - combines sentiment with intensity
 */
export interface UIScreenState {
  sentiment: UISentiment;
  intensity: number; // 0.0 - 1.0, how strongly the sentiment should be expressed
}

/**
 * Sentiment-to-Color mapping
 * UI colors should shift based on sentiment to reinforce emotion
 */
export const SENTIMENT_COLORS: Record<UISentiment, string> = {
  calm: "#16213e",          // Default panel background
  anticipation: "#0f3460",  // Slightly darker, building tension
  instability: "#aa00ff",   // Violet, unstable energy
  danger: "#ff0000",        // Red, warning
  revelation: "#00ffff"     // Cyan, revelation and discovery
} as const;

/**
 * Sentiment-to-Animation mapping
 * Animations should match the sentiment
 */
export const SENTIMENT_ANIMATIONS: Record<UISentiment, {
  type: string;
  duration: string;
  easing: string;
}> = {
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
} as const;

/**
 * Example: React component using UI states
 * 
 * ```tsx
 * const FusionLab = () => {
 *   const [uiState, setUIState] = useState<UIScreenState>({
 *     sentiment: "calm",
 *     intensity: 0
 *   });
 * 
 *   const handleFusionStart = () => {
 *     setUIState({ sentiment: "instability", intensity: 0.8 });
 *   };
 * 
 *   const handleReveal = () => {
 *     setUIState({ sentiment: "revelation", intensity: 1.0 });
 *   };
 * 
 *   const backgroundColor = SENTIMENT_COLORS[uiState.sentiment];
 *   const opacity = 0.3 + (uiState.intensity * 0.7);
 * 
 *   return (
 *     <div style={{ backgroundColor, opacity }}>
 *       {/* Fusion lab UI */}
 *     </div>
 *   );
 * };
 * ```
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

