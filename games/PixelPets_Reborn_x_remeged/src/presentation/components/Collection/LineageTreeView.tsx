/**
 * Lineage Tree Visualization Component
 * Displays pet fusion ancestry in hierarchical tree layout
 */

import { useMemo, useState } from 'react';
import type { Pet } from '@/domain/entities/Pet';
import type { PetId } from '@/shared/types/brands';
import './LineageTreeView.css';

interface TreeNode {
  pet: Pet;
  parents: TreeNode[];
  depth: number;
  x: number;
  y: number;
  isExpanded: boolean;
}

interface LineageTreeViewProps {
  rootPet: Pet;
  allPets: Pet[];
}

export function LineageTreeView({ rootPet, allPets }: LineageTreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([rootPet.id as string]));

  /**
   * Build tree structure from fusion history
   */
  const buildTreeNode = (pet: Pet, petMap: Map<string, Pet>, depth: number): TreeNode => {
    const node: TreeNode = {
      pet,
      parents: [],
      depth,
      x: 0,
      y: 0,
      isExpanded: expandedNodes.has(pet.id as string)
    };

    // Get most recent fusion (last entry in history)
    if (pet.fusionHistory.length > 0) {
      const latestFusion = pet.fusionHistory[pet.fusionHistory.length - 1];
      const [parent1Id, parent2Id] = latestFusion.parentIds;

      const parent1 = petMap.get(parent1Id as string);
      const parent2 = petMap.get(parent2Id as string);

      if (parent1) {
        node.parents.push(buildTreeNode(parent1, petMap, depth + 1));
      }
      if (parent2) {
        node.parents.push(buildTreeNode(parent2, petMap, depth + 1));
      }
    }

    return node;
  };

  /**
   * Calculate tree layout positions using Reingold-Tilford algorithm (simplified)
   */
  const calculateTreeLayout = (root: TreeNode): TreeNode => {
    const NODE_WIDTH = 200;
    const NODE_HEIGHT = 120;
    const HORIZONTAL_SPACING = 40;
    const VERTICAL_SPACING = 80;

    function layoutNode(node: TreeNode, depth: number, xOffset: number): number {
      node.depth = depth;
      node.y = depth * (NODE_HEIGHT + VERTICAL_SPACING);

      // Leaf node (no parents)
      if (node.parents.length === 0) {
        node.x = xOffset;
        return xOffset + NODE_WIDTH + HORIZONTAL_SPACING;
      }

      // Layout children first (bottom-up)
      let currentX = xOffset;
      node.parents.forEach(parent => {
        currentX = layoutNode(parent, depth + 1, currentX);
      });

      // Center parent above children
      if (node.parents.length === 1) {
        node.x = node.parents[0].x;
      } else {
        const leftmostChild = node.parents[0];
        const rightmostChild = node.parents[node.parents.length - 1];
        node.x = (leftmostChild.x + rightmostChild.x + NODE_WIDTH) / 2 - NODE_WIDTH / 2;
      }

      return currentX;
    }

    layoutNode(root, 0, 0);
    return root;
  };

  /**
   * Get all nodes in tree (for rendering)
   */
  const getAllNodes = (node: TreeNode): TreeNode[] => {
    const nodes: TreeNode[] = [node];

    if (node.isExpanded) {
      node.parents.forEach(parent => {
        nodes.push(...getAllNodes(parent));
      });
    }

    return nodes;
  };

  /**
   * Get all connections (edges) in tree
   */
  const getAllConnections = (node: TreeNode): Array<{ from: TreeNode; to: TreeNode }> => {
    const connections: Array<{ from: TreeNode; to: TreeNode }> = [];

    if (node.isExpanded) {
      node.parents.forEach(parent => {
        connections.push({ from: node, to: parent });
        connections.push(...getAllConnections(parent));
      });
    }

    return connections;
  };

  /**
   * Toggle node expansion
   */
  const toggleNodeExpansion = (petId: PetId) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(petId as string)) {
        next.delete(petId as string);
      } else {
        next.add(petId as string);
      }
      return next;
    });
  };

  // Build and layout tree
  const tree = useMemo(() => {
    const petMap = new Map<string, Pet>(allPets.map(p => [p.id as string, p]));
    const rootNode = buildTreeNode(rootPet, petMap, 0);
    return calculateTreeLayout(rootNode);
  }, [rootPet, allPets, expandedNodes]);

  const allNodes = getAllNodes(tree);
  const allConnections = getAllConnections(tree);

  // Calculate SVG dimensions
  const maxX = Math.max(...allNodes.map(n => n.x)) + 200;
  const maxY = Math.max(...allNodes.map(n => n.y)) + 120;

  return (
    <div className="lineage-tree-container">
      <div className="lineage-tree-header">
        <h2>Fusion Lineage</h2>
        <p>Ancestry tree for {rootPet.name}</p>
        <div className="lineage-stats">
          <span>Generation: {rootPet.getGeneration()}</span>
          <span>Total Mutations: {rootPet.getTotalMutations()}</span>
        </div>
      </div>

      <div className="lineage-tree-scroll">
        <svg
          width={Math.max(maxX, 800)}
          height={Math.max(maxY, 600)}
          className="lineage-tree-svg"
        >
          {/* Render connection lines */}
          <g className="connections">
            {allConnections.map(({ from, to }, index) => {
              const fromCenterX = from.x + 100; // NODE_WIDTH / 2
              const fromBottomY = from.y + 120; // NODE_HEIGHT
              const toCenterX = to.x + 100;
              const toTopY = to.y;

              // Curved path for better aesthetics
              const midY = (fromBottomY + toTopY) / 2;

              return (
                <path
                  key={`connection-${index}`}
                  d={`M ${fromCenterX} ${fromBottomY} C ${fromCenterX} ${midY}, ${toCenterX} ${midY}, ${toCenterX} ${toTopY}`}
                  stroke="#888"
                  strokeWidth="2"
                  fill="none"
                  className="connection-line"
                />
              );
            })}
          </g>

          {/* Render pet nodes */}
          <g className="nodes">
            {allNodes.map(node => (
              <g
                key={node.pet.id as string}
                transform={`translate(${node.x}, ${node.y})`}
                className={`tree-node ${node.depth === 0 ? 'root-node' : ''}`}
              >
                {/* Node background */}
                <rect
                  x="0"
                  y="0"
                  width="200"
                  height="120"
                  rx="8"
                  className={`node-bg rarity-${node.pet.rarity}`}
                  style={{
                    fill: node.depth === 0 ? '#4A90E2' : '#2C2C2C',
                    stroke: node.pet.isHacked ? '#FF0000' : '#666',
                    strokeWidth: 2
                  }}
                />

                {/* Pet info */}
                <text x="100" y="25" textAnchor="middle" className="pet-name" fill="#FFF">
                  {node.pet.name}
                </text>

                <text x="100" y="45" textAnchor="middle" className="pet-family" fill="#AAA" fontSize="12">
                  {node.pet.family}
                </text>

                {/* Stats */}
                <text x="10" y="65" className="pet-stat" fill="#CCC" fontSize="11">
                  HP: {node.pet.stats.maxHp}
                </text>
                <text x="110" y="65" className="pet-stat" fill="#CCC" fontSize="11">
                  ATK: {node.pet.stats.attack}
                </text>

                <text x="10" y="80" className="pet-stat" fill="#CCC" fontSize="11">
                  DEF: {node.pet.stats.defense}
                </text>
                <text x="110" y="80" className="pet-stat" fill="#CCC" fontSize="11">
                  SPD: {node.pet.stats.speed}
                </text>

                {/* Generation badge */}
                <circle cx="180" cy="15" r="12" fill="#666" />
                <text x="180" y="19" textAnchor="middle" className="generation-badge" fill="#FFF" fontSize="10">
                  G{node.pet.getGeneration()}
                </text>

                {/* Fusion signature (if fused) */}
                {node.pet.fusionHistory.length > 0 && (
                  <text x="100" y="100" textAnchor="middle" className="fusion-signature" fill="#888" fontSize="9">
                    Fusion: {node.pet.fusionHistory[node.pet.fusionHistory.length - 1].fusionSeed.slice(0, 8)}
                  </text>
                )}

                {/* Expand/collapse button (if has parents) */}
                {node.pet.fusionHistory.length > 0 && (
                  <g
                    onClick={() => toggleNodeExpansion(node.pet.id)}
                    className="expand-button"
                    style={{ cursor: 'pointer' }}
                  >
                    <circle cx="100" cy="110" r="8" fill="#555" />
                    <text
                      x="100"
                      y="114"
                      textAnchor="middle"
                      fill="#FFF"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {node.isExpanded ? '−' : '+'}
                    </text>
                  </g>
                )}
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="lineage-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#4A90E2' }} />
          <span>Current Pet</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#2C2C2C' }} />
          <span>Ancestor</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ border: '2px solid #FF0000', backgroundColor: 'transparent' }} />
          <span>Hacked Pet</span>
        </div>
      </div>
    </div>
  );
}
