'use client';

/**
 * DetailPanel Component
 * Slides in from right to show protocol details
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Protocol } from './types';
function X({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

interface DetailPanelProps {
  protocol: Protocol | null;
  onClose: () => void;
}

export default function DetailPanel({ protocol, onClose }: DetailPanelProps) {
  return (
    <AnimatePresence>
      {protocol && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-96 bg-gray-900/95 backdrop-blur-xl border-l border-gray-700 p-8 z-50 overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              aria-label="Close panel"
            >
              <svg
                className="w-5 h-5 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Protocol Content */}
            <div className="mt-4">
              {/* Protocol Icon Placeholder */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-electric-blue-500 mb-4" />

              {/* Protocol Name */}
              <h3 className="text-3xl font-semibold text-white mb-2">
                {protocol.name}
              </h3>

              {/* Integration Type */}
              <p className="text-violet-400 text-sm mb-2">
                {protocol.integrationType}
              </p>

              {/* Description */}
              {protocol.description && (
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  {protocol.description}
                </p>
              )}

              {/* Supported Chains */}
              <div className="mb-6">
                <h4 className="text-gray-400 text-sm font-semibold mb-2">
                  Supported Chains
                </h4>
                <div className="flex flex-wrap gap-2">
                  {protocol.chains.map((chain) => (
                    <span
                      key={chain}
                      className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs capitalize"
                    >
                      {chain}
                    </span>
                  ))}
                </div>
              </div>

              {/* Supported Actions */}
              <div className="mb-8">
                <h4 className="text-gray-400 text-sm font-semibold mb-2">
                  Supported Actions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {protocol.supportedActions.map((action) => (
                    <span
                      key={action}
                      className="px-3 py-1 bg-violet-500/20 text-violet-300 rounded-full text-sm"
                    >
                      {action}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <button className="w-full bg-gradient-to-r from-violet-500 to-electric-blue-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-violet-500/50 transition-all">
                Trade on {protocol.name}
              </button>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-xs leading-relaxed">
                  Connect your wallet to start trading with 10x leverage across{' '}
                  {protocol.name} and 15+ other integrated protocols.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
