/**
 * Protocol Constellation - TypeScript Interfaces
 * Defines data structures for the 3D ecosystem visualization
 */

export type ProtocolCategory = 'perps' | 'spot' | 'options' | 'yield' | 'lending';
export type ChainType = 'base' | 'arbitrum' | 'optimism' | 'stellar';

export interface Protocol {
  id: string;
  name: string;
  category: ProtocolCategory;
  position: {
    x: number;
    y: number;
    z: number;
  };
  size: number; // Node size multiplier (0.8 - 1.5)
  integrationType: string; // e.g., "Smart Contract", "API Integration"
  supportedActions: string[]; // e.g., ["Long", "Short", "Leverage"]
  chains: ChainType[];
  color: string; // Hex color for Three.js materials
  description?: string; // Optional description for detail panel
}

export interface CategoryConfig {
  id: ProtocolCategory | 'all';
  label: string;
  color: string; // Hex for Three.js materials
  tailwindClass: string; // For 2D grid styling
}

export interface ParticleData {
  id: number;
  targetProtocolId: string;
  progress: number; // 0-1, position along connection line
  speed: number; // Base speed multiplier
}

export interface SceneState {
  selectedProtocol: Protocol | null;
  hoveredProtocol: string | null;
  activeCategory: ProtocolCategory | 'all';
}
