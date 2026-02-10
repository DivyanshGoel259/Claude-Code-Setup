/**
 * Protocol Constellation - Mock Data
 * 18 DeFi protocols arranged in 3 orbital rings
 * Positions are pre-computed for consistent layout
 */

import { Protocol, CategoryConfig } from './types';

/**
 * Helper function to calculate orbital positions
 * @param ring - Ring number (1=inner, 2=middle, 3=outer)
 * @param index - Index within the ring
 * @param totalInRing - Total protocols in this ring
 * @returns {x, y, z} 3D position
 */
function calculatePosition(ring: number, index: number, totalInRing: number) {
  const radius = ring * 3; // inner=3, middle=6, outer=9
  const angle = (index / totalInRing) * Math.PI * 2;
  const yVariation = (Math.random() - 0.5) * 1.5; // Slight vertical variation

  return {
    x: radius * Math.cos(angle),
    y: yVariation,
    z: radius * Math.sin(angle),
  };
}

/**
 * Category configurations with colors
 */
export const categories: CategoryConfig[] = [
  {
    id: 'all',
    label: 'All',
    color: '#8B5CF6',
    tailwindClass: 'text-violet-500',
  },
  {
    id: 'perps',
    label: 'Perps',
    color: '#C4B5FD',
    tailwindClass: 'text-violet-300',
  },
  {
    id: 'spot',
    label: 'Spot',
    color: '#3B82F6',
    tailwindClass: 'text-electric-blue-500',
  },
  {
    id: 'options',
    label: 'Options',
    color: '#FB7185',
    tailwindClass: 'text-rose-400',
  },
  {
    id: 'yield',
    label: 'Yield',
    color: '#E879F9',
    tailwindClass: 'text-magenta-400',
  },
  {
    id: 'lending',
    label: 'Lending',
    color: '#EF4444',
    tailwindClass: 'text-imperial-red-500',
  },
];

/**
 * 18 Protocol nodes arranged in 3 orbital rings
 */
export const protocols: Protocol[] = [
  // === INNER RING (5 protocols) - Major perps/spot ===
  {
    id: 'hyperliquid',
    name: 'Hyperliquid',
    category: 'perps',
    position: calculatePosition(1, 0, 5),
    size: 1.2,
    integrationType: 'Smart Contract Integration',
    supportedActions: ['Long', 'Short', '50x Leverage'],
    chains: ['arbitrum'],
    color: '#C4B5FD',
    description: 'High-performance perpetuals exchange',
  },
  {
    id: 'uniswap',
    name: 'Uniswap',
    category: 'spot',
    position: calculatePosition(1, 1, 5),
    size: 1.3,
    integrationType: 'Smart Contract Integration',
    supportedActions: ['Swap', 'Pool', 'Liquidity'],
    chains: ['base', 'arbitrum', 'optimism'],
    color: '#3B82F6',
    description: 'Leading decentralized exchange',
  },
  {
    id: 'dydx',
    name: 'dYdX',
    category: 'perps',
    position: calculatePosition(1, 2, 5),
    size: 1.2,
    integrationType: 'API Integration',
    supportedActions: ['Perp Trading', 'Margin', 'Stop Loss'],
    chains: ['stellar'],
    color: '#C4B5FD',
    description: 'Decentralized perpetuals platform',
  },
  {
    id: 'gmx',
    name: 'GMX',
    category: 'perps',
    position: calculatePosition(1, 3, 5),
    size: 1.1,
    integrationType: 'Smart Contract Integration',
    supportedActions: ['Spot', 'Perps', 'Leverage'],
    chains: ['arbitrum'],
    color: '#C4B5FD',
    description: 'Spot and perpetual exchange',
  },
  {
    id: 'curve',
    name: 'Curve',
    category: 'spot',
    position: calculatePosition(1, 4, 5),
    size: 1.0,
    integrationType: 'Smart Contract Integration',
    supportedActions: ['Swap', 'Liquidity', 'Stake'],
    chains: ['base', 'optimism'],
    color: '#3B82F6',
    description: 'Stablecoin-focused DEX',
  },

  // === MIDDLE RING (8 protocols) - Options/Yield/Lending ===
  {
    id: 'derive',
    name: 'Derive',
    category: 'options',
    position: calculatePosition(2, 0, 8),
    size: 0.9,
    integrationType: 'Smart Contract Integration',
    supportedActions: ['Options', 'Strategies', 'Hedging'],
    chains: ['base'],
    color: '#FB7185',
    description: 'Structured options trading',
  },
  {
    id: 'pendle',
    name: 'Pendle',
    category: 'yield',
    position: calculatePosition(2, 1, 8),
    size: 0.95,
    integrationType: 'Smart Contract Integration',
    supportedActions: ['Yield Trading', 'Fixed Rates', 'PT/YT'],
    chains: ['arbitrum', 'optimism'],
    color: '#E879F9',
    description: 'Yield tokenization protocol',
  },
  {
    id: 'aave',
    name: 'Aave',
    category: 'lending',
    position: calculatePosition(2, 2, 8),
    size: 1.1,
    integrationType: 'Smart Contract Integration',
    supportedActions: ['Lend', 'Borrow', 'Flash Loans'],
    chains: ['base', 'arbitrum', 'optimism'],
    color: '#EF4444',
    description: 'Decentralized lending protocol',
  },
  {
    id: 'lyra',
    name: 'Lyra',
    category: 'options',
    position: calculatePosition(2, 3, 8),
    size: 0.85,
    integrationType: 'Smart Contract Integration',
    supportedActions: ['Options', 'AMM', 'Volatility'],
    chains: ['optimism'],
    color: '#FB7185',
    description: 'Options AMM platform',
  },
  {
    id: 'ribbon',
    name: 'Ribbon',
    category: 'options',
    position: calculatePosition(2, 4, 8),
    size: 0.8,
    integrationType: 'Smart Contract Integration',
    supportedActions: ['Vaults', 'Covered Calls', 'Theta'],
    chains: ['arbitrum'],
    color: '#FB7185',
    description: 'Structured product vaults',
  },
  {
    id: 'yearn',
    name: 'Yearn',
    category: 'yield',
    position: calculatePosition(2, 5, 8),
    size: 0.9,
    integrationType: 'Smart Contract Integration',
    supportedActions: ['Vaults', 'Auto-compound', 'Strategies'],
    chains: ['base', 'arbitrum'],
    color: '#E879F9',
    description: 'Yield optimization aggregator',
  },
  {
    id: 'compound',
    name: 'Compound',
    category: 'lending',
    position: calculatePosition(2, 6, 8),
    size: 1.0,
    integrationType: 'Smart Contract Integration',
    supportedActions: ['Lend', 'Borrow', 'Interest'],
    chains: ['base', 'arbitrum'],
    color: '#EF4444',
    description: 'Algorithmic money market',
  },
  {
    id: 'maker',
    name: 'MakerDAO',
    category: 'lending',
    position: calculatePosition(2, 7, 8),
    size: 0.95,
    integrationType: 'Smart Contract Integration',
    supportedActions: ['Mint DAI', 'Vaults', 'Collateral'],
    chains: ['base'],
    color: '#EF4444',
    description: 'Decentralized stablecoin issuer',
  },

  // === OUTER RING (5 protocols) - Smaller/specialized ===
  {
    id: 'morpho',
    name: 'Morpho',
    category: 'lending',
    position: calculatePosition(3, 0, 5),
    size: 0.75,
    integrationType: 'Smart Contract Integration',
    supportedActions: ['Optimized Lending', 'P2P'],
    chains: ['base', 'optimism'],
    color: '#EF4444',
    description: 'Lending optimizer',
  },
  {
    id: 'euler',
    name: 'Euler',
    category: 'lending',
    position: calculatePosition(3, 1, 5),
    size: 0.7,
    integrationType: 'Smart Contract Integration',
    supportedActions: ['Lend', 'Borrow', 'Risk-adjusted'],
    chains: ['arbitrum'],
    color: '#EF4444',
    description: 'Permissionless lending protocol',
  },
  {
    id: 'notional',
    name: 'Notional',
    category: 'yield',
    position: calculatePosition(3, 2, 5),
    size: 0.75,
    integrationType: 'Smart Contract Integration',
    supportedActions: ['Fixed Rates', 'Lending', 'Borrowing'],
    chains: ['arbitrum'],
    color: '#E879F9',
    description: 'Fixed-rate lending',
  },
  {
    id: 'angle',
    name: 'Angle',
    category: 'spot',
    position: calculatePosition(3, 3, 5),
    size: 0.7,
    integrationType: 'Smart Contract Integration',
    supportedActions: ['Stablecoins', 'Swap', 'Mint'],
    chains: ['base', 'optimism'],
    color: '#3B82F6',
    description: 'Decentralized stablecoin protocol',
  },
  {
    id: 'convex',
    name: 'Convex',
    category: 'yield',
    position: calculatePosition(3, 4, 5),
    size: 0.75,
    integrationType: 'Smart Contract Integration',
    supportedActions: ['Boost Rewards', 'Curve LP', 'Stake'],
    chains: ['base', 'arbitrum'],
    color: '#E879F9',
    description: 'Curve yield booster',
  },
];

/**
 * Get category configuration by ID
 */
export function getCategoryConfig(categoryId: string): CategoryConfig {
  return categories.find((c) => c.id === categoryId) || categories[0];
}

/**
 * Get protocols filtered by category
 */
export function getProtocolsByCategory(categoryId: string): Protocol[] {
  if (categoryId === 'all') return protocols;
  return protocols.filter((p) => p.category === categoryId);
}

/**
 * Get protocol by ID
 */
export function getProtocolById(id: string): Protocol | undefined {
  return protocols.find((p) => p.id === id);
}
