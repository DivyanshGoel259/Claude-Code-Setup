'use client';

/**
 * CategoryFilters Component
 * Overlay filter buttons for protocol categories
 */

import { motion } from 'framer-motion';
import { categories } from './protocols-data';
import { ProtocolCategory } from './types';

interface CategoryFiltersProps {
  activeCategory: ProtocolCategory | 'all';
  onCategoryChange: (category: ProtocolCategory | 'all') => void;
}

export default function CategoryFilters({
  activeCategory,
  onCategoryChange,
}: CategoryFiltersProps) {
  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-40 flex gap-3 flex-wrap justify-center px-4">
      {categories.map((category) => (
        <motion.button
          key={category.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(category.id)}
          className={`
            px-6 py-2 rounded-full font-medium transition-all
            ${
              activeCategory === category.id
                ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 backdrop-blur-sm'
            }
          `}
          aria-label={`Filter by ${category.label}`}
          aria-pressed={activeCategory === category.id}
        >
          {category.label}
        </motion.button>
      ))}
    </div>
  );
}
