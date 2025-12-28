# Naming Systems

**Authority Tier**: 3 (Heuristic)
**Purpose**: Generate culturally consistent names.

## Phonetic Markov Chains
*   **Method**: Analyze a list of real names (e.g., Elvish) and generate new ones with similar phonetic probability.
*   **Input**: Training data (List of strings).
*   **Output**: New strings that "sound like" the input.

## Syllabic Construction
*   **Method**: Combine prefixes, cores, and suffixes based on meaning.
*   **Example**:
    *   `Aer` (Air) + `Thalas` (Tree) = `Aerthalas`
*   **Advantage**: Names have inherent meaning in the game's language.

## Rules
*   Every Culture/Race has its own Naming Generator.
*   Names must be unique (check against Registry).
