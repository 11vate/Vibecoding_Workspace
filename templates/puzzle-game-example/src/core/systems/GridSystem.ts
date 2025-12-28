/**
 * Grid System - Puzzle Game Mechanics
 *
 * Purpose: Handle grid logic, cell selection, swapping
 * Priority: 10 (Early in update cycle)
 */

import { BaseSystem } from './SystemManager';
import { store, ActionType, GridCell } from '../state/store';

export class GridSystem extends BaseSystem {
  private swapAnimating: boolean = false;

  constructor() {
    super('GridSystem', 10);
  }

  initialize(): void {
    console.log('[GridSystem] Initialized');
  }

  update(deltaTime: number): void {
    const state = store.getState();

    if (state.gameState !== 'playing') {
      return;
    }

    // Grid logic handled by user input
    // This system mainly provides methods for other systems
  }

  cleanup(): void {
    console.log('[GridSystem] Cleaned up');
  }

  /**
   * Handle cell click
   */
  handleCellClick(row: number, col: number): void {
    const state = store.getState();

    if (this.swapAnimating) {
      return;
    }

    if (state.selectedCell === null) {
      // First selection
      store.dispatch({
        type: ActionType.CELL_SELECTED,
        payload: { row, col }
      });
    } else {
      // Second selection - check if adjacent
      const selected = state.selectedCell;
      const isAdjacent = this.isAdjacent(selected.row, selected.col, row, col);

      if (isAdjacent) {
        this.swapCells(selected.row, selected.col, row, col);
      }

      // Clear selection
      store.dispatch({
        type: ActionType.CELL_SELECTED,
        payload: null
      });
    }
  }

  /**
   * Check if cells are adjacent
   */
  private isAdjacent(row1: number, col1: number, row2: number, col2: number): boolean {
    const rowDiff = Math.abs(row1 - row2);
    const colDiff = Math.abs(col1 - col2);

    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  }

  /**
   * Swap two cells
   */
  private swapCells(row1: number, col1: number, row2: number, col2: number): void {
    const state = store.getState();
    const grid = JSON.parse(JSON.stringify(state.grid)) as GridCell[][];

    const temp = grid[row1][col1].type;
    grid[row1][col1].type = grid[row2][col2].type;
    grid[row2][col2].type = temp;

    this.swapAnimating = true;

    store.dispatch({
      type: ActionType.CELLS_SWAPPED,
      payload: grid
    });

    setTimeout(() => {
      this.swapAnimating = false;
      this.checkMatches();
    }, 200);
  }

  /**
   * Check for matches
   */
  checkMatches(): void {
    const state = store.getState();
    const grid = JSON.parse(JSON.stringify(state.grid)) as GridCell[][];
    let hasMatches = false;

    // Check horizontal matches
    for (let row = 0; row < state.gridRows; row++) {
      for (let col = 0; col < state.gridCols - 2; col++) {
        const type = grid[row][col].type;

        if (type === grid[row][col + 1].type && type === grid[row][col + 2].type) {
          grid[row][col].matched = true;
          grid[row][col + 1].matched = true;
          grid[row][col + 2].matched = true;
          hasMatches = true;
        }
      }
    }

    // Check vertical matches
    for (let col = 0; col < state.gridCols; col++) {
      for (let row = 0; row < state.gridRows - 2; row++) {
        const type = grid[row][col].type;

        if (type === grid[row + 1][col].type && type === grid[row + 2][col].type) {
          grid[row][col].matched = true;
          grid[row + 1][col].matched = true;
          grid[row + 2][col].matched = true;
          hasMatches = true;
        }
      }
    }

    if (hasMatches) {
      store.dispatch({
        type: ActionType.MATCHES_FOUND,
        payload: grid
      });

      // Count matched cells for scoring
      let matchCount = 0;
      for (let row = 0; row < state.gridRows; row++) {
        for (let col = 0; col < state.gridCols; col++) {
          if (grid[row][col].matched) {
            matchCount++;
          }
        }
      }

      // Add score
      const baseScore = matchCount * 10;
      const comboBonus = state.combo * 5;
      store.dispatch({
        type: ActionType.SCORE_ADDED,
        payload: baseScore + comboBonus
      });

      // Increase combo
      store.dispatch({ type: ActionType.COMBO_INCREASED });

      // Clear matched cells after delay
      setTimeout(() => {
        this.clearMatched();
      }, 300);
    } else {
      // No matches, reset combo
      store.dispatch({ type: ActionType.COMBO_RESET });
    }
  }

  /**
   * Clear matched cells
   */
  private clearMatched(): void {
    const state = store.getState();
    const grid = JSON.parse(JSON.stringify(state.grid)) as GridCell[][];

    for (let row = 0; row < state.gridRows; row++) {
      for (let col = 0; col < state.gridCols; col++) {
        if (grid[row][col].matched) {
          grid[row][col].type = -1; // Empty cell
          grid[row][col].matched = false;
        }
      }
    }

    store.dispatch({
      type: ActionType.CELLS_CLEARED,
      payload: grid
    });

    setTimeout(() => {
      this.applyGravity();
    }, 100);
  }

  /**
   * Apply gravity to cells
   */
  private applyGravity(): void {
    const state = store.getState();
    const grid = JSON.parse(JSON.stringify(state.grid)) as GridCell[][];

    // Move cells down
    for (let col = 0; col < state.gridCols; col++) {
      let writePos = state.gridRows - 1;

      for (let row = state.gridRows - 1; row >= 0; row--) {
        if (grid[row][col].type !== -1) {
          if (row !== writePos) {
            grid[writePos][col].type = grid[row][col].type;
            grid[row][col].type = -1;
          }
          writePos--;
        }
      }
    }

    // Fill empty cells with new gems
    for (let row = 0; row < state.gridRows; row++) {
      for (let col = 0; col < state.gridCols; col++) {
        if (grid[row][col].type === -1) {
          grid[row][col].type = Math.floor(Math.random() * 6);
        }
      }
    }

    store.dispatch({
      type: ActionType.CELLS_FALLEN,
      payload: grid
    });

    setTimeout(() => {
      this.checkMatches();
    }, 300);
  }
}
