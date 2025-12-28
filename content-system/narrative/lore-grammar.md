# Lore Grammar

**Authority Tier**: 3 (Heuristic)
**Purpose**: Generate consistent narrative text.

## Tracery / CFG (Context-Free Grammars)
*   **Structure**: JSON-based grammar definitions.
*   **Example**:
    ```json
    {
      "origin": ["The #adjective# #noun# of #place#."],
      "adjective": ["Ancient", "Cursed", "Shining", "Forgotten"],
      "noun": ["Sword", "Crown", "Amulet", "Shield"],
      "place": ["Shadows", "Light", "the North", "Valhalla"]
    }
    ```

## Template Filling
*   **Concept**: Mad-libs style templates populated with Entity properties.
*   **Example**: "This [Weapon.Type] was forged in [Weapon.Year] by [Weapon.Creator]."

## Consistency Maintenance
*   Store generated facts in a "World Knowledge Base" (Context) to avoid contradictions.
*   If "The King" is generated as "Dead", future lore cannot refer to him as "ruling".
