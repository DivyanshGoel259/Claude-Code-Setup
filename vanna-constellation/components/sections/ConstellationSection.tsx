"use client";

/**
 * Section 5: Protocol Constellation - 2D Ecosystem Map
 * Beautiful animated grid showing 15+ protocol integrations
 * with category filtering and hover interactions
 */

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";

// const ThreeBackground = dynamic(() => import("./ThreeBackground"), {
//   ssr: false,
//   loading: () => <div className="absolute inset-0 bg-transparent" />,
// });

const categoryFilters = [
  { id: "all", label: "All", color: "#703AE6" },
  { id: "spot", label: "Spot / Swaps", color: "#3B82F6" },
  { id: "perps", label: "Perps", color: "#9F7BEE" },
  { id: "options", label: "Options", color: "#FB7185" },
  { id: "yield", label: "Yield", color: "#E879F9" },
];

const protocolNodes = [
  /* ── Spot / Swaps ── */
  {
    id: "uniswap",
    name: "Uniswap",
    category: "spot",
    chains: ["Base", "Optimism"],
    color: "#3B82F6",
    actions: ["Swap", "AMM Pool"],
    logo: "/icons/Uniswap.png",
  },
  {
    id: "soroswap",
    name: "Soroswap",
    category: "spot",
    chains: ["Stellar"],
    color: "#3B82F6",
    actions: ["Swap", "AMM Pool"],
    logo: "/icons/protocols/soroswap.png",
  },
  {
    id: "aquarius",
    name: "Aquarius",
    category: "spot",
    chains: ["Stellar"],
    color: "#3B82F6",
    actions: ["Swap", "AMM Pool"],
    logo: "/icons/protocols/Aquarius.png",
  },
  {
    id: "aerodrome",
    name: "Aerodrome",
    category: "spot",
    chains: ["Base"],
    color: "#3B82F6",
    actions: ["Swap", "AMM Pool"],
    logo: "/icons/protocols/Aerodrome.svg",
  },
  {
    id: "hyperliquid-spot",
    name: "HyperLiquid Spot",
    category: "spot",
    chains: ["Hyperliquid"],
    color: "#3B82F6",
    actions: ["Spot OrderBook"],
    logo: "/icons/protocols/Hyperliquid.png",
  },
  {
    id: "aster-spot",
    name: "Aster Spot",
    category: "spot",
    chains: ["BNB"],
    color: "#3B82F6",
    actions: ["Spot OrderBook"],
    logo: "/icons/protocols/aster.png",
  },
  /* ── Perps ── */
  {
    id: "hyperliquid",
    name: "Hyperliquid",
    category: "perps",
    chains: ["Hyperliquid"],
    color: "#9F7BEE",
    actions: ["Leverage Trading", "40x Leverage"],
    logo: "/icons/protocols/Hyperliquid.png",
  },
  {
    id: "avantis",
    name: "Avantis",
    category: "perps",
    chains: ["Base"],
    color: "#9F7BEE",
    actions: ["Leverage Trading", "1000x Leverage"],
    logo: "/icons/protocols/Avantis.png",
  },
  {
    id: "aster-perp",
    name: "Aster",
    category: "perps",
    chains: ["BNB"],
    color: "#9F7BEE",
    actions: ["Leverage Trading", "200x Leverage"],
    logo: "/icons/protocols/aster.png",
  },
  /* ── Options ── */
  {
    id: "derive",
    name: "Derive",
    category: "options",
    chains: ["Derive"],
    color: "#FB7185",
    actions: ["Options Trading"],
    logo: "/icons/protocols/Derive.png",
  },
  /* ── Yield ── */
  {
    id: "morpho",
    name: "Morpho",
    category: "yield",
    chains: ["Base", "Optimism"],
    color: "#E879F9",
    actions: ["Optimized Lending", "Yield"],
    logo: "/icons/protocols/morpho.png",
  },
  {
    id: "blend",
    name: "Blend",
    category: "yield",
    chains: ["Stellar"],
    color: "#E879F9",
    actions: ["Lend", "Borrow", "Yield"],
    logo: "/icons/protocols/Blend.png",
  },
  {
    id: "katana",
    name: "Katana",
    category: "yield",
    chains: ["Katana"],
    color: "#E879F9",
    actions: ["Yield Farming", "LP"],
    logo: "/icons/protocols/katana.png",
  },
];

function ProtocolCard({
  protocol,
  index,
  isFiltered,
}: {
  protocol: (typeof protocolNodes)[0];
  index: number;
  isFiltered: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isFiltered ? 0.15 : 1,
        y: 0,
        scale: isFiltered ? 0.95 : 1,
      }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-xl p-5 cursor-pointer transition-shadow duration-300 overflow-hidden"
      style={{
        backgroundColor: "var(--card-bg)",
        border: `1px solid ${hovered ? protocol.color + "40" : "var(--card-border)"}`,
        boxShadow: hovered
          ? `0 0 20px ${protocol.color}15, 0 8px 32px rgba(0,0,0,0.08)`
          : "none",
      }}
    >
      {/* Coming Soon tag */}
      <div
        className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-[8px] text-[9px] font-bold uppercase tracking-wider text-white"
        style={{
          background: "linear-gradient(135deg, #FC5457 10%, #703AE6 80%)",
        }}
      >
        Coming Soon
      </div>

      {/* Blur overlay */}
      <div className="absolute inset-0  bg-white/2 dark:bg-black/2 z-1 rounded-xl pointer-events-none" />

      {/* Protocol logo */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${protocol.color}CC, ${protocol.color})`,
        }}
      >
        {protocol.logo ? (
          <Image
            src={protocol.logo}
            alt={protocol.name}
            width={28}
            height={28}
            className="object-contain rounded-full"
          />
        ) : (
          <span className="text-lg font-bold text-white">
            {protocol.name.charAt(0)}
          </span>
        )}
      </div>

      <h4 className="text-h10 mb-1" style={{ color: "var(--text-primary)" }}>
        {protocol.name}
      </h4>
      <p
        className="text-body-3 capitalize mb-2"
        style={{ color: "var(--text-muted)" }}
      >
        {protocol.category}
      </p>

      {/* Chains badges */}
      <div className="flex flex-wrap gap-1">
        {protocol.chains.map((chain) => (
          <span
            key={chain}
            className="text-[10px] px-1.5 py-0.5 rounded-full"
            style={{
              backgroundColor: "var(--badge-bg)",
              color: "var(--badge-text)",
            }}
          >
            {chain}
          </span>
        ))}
      </div>

      {/* Hover actions */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 flex flex-wrap gap-1.5"
            style={{ borderTop: "1px solid var(--card-border)" }}
          >
            {protocol.actions.map((action) => (
              <span
                key={action}
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: protocol.color + "15",
                  color: protocol.color,
                }}
              >
                {action}
              </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ConstellationSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const headerRef = useRef(null);
  const isInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section
      id="constellation"
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{ backgroundColor: "var(--surface-alt)" }}
    >
      {/* Three.js Animated Background */}
      <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-30 pointer-events-none">
        {/* <ThreeBackground /> */}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-violet-500 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            13 Protocols. One Account.
          </p>
          <h2 className="text-h3 text-heading mb-4">
            Your Gateway to All of DeFi
          </h2>
          <p className="text-subtext text-paragraph max-w-xl mx-auto">
            Vanna connects you to the protocols you love — with 10x more
            capital.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          {categoryFilters.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`cursor-pointer px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.id
                  ? "text-white shadow-lg"
                  : "hover:opacity-80"
              }`}
              style={
                activeCategory === cat.id
                  ? {
                      backgroundColor: cat.color,
                      boxShadow: `0 4px 15px ${cat.color}40`,
                    }
                  : {
                      backgroundColor: "var(--gauge-bg)",
                      color: "var(--text-secondary)",
                    }
              }
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Protocol Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {protocolNodes.map((protocol, i) => (
            <ProtocolCard
              key={protocol.id}
              protocol={protocol}
              index={i}
              isFiltered={
                activeCategory !== "all" && protocol.category !== activeCategory
              }
            />
          ))}
        </div>

        {/* Bottom stats */}
        <motion.div
          className="mt-16 flex flex-wrap justify-center gap-8 sm:gap-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {[
            { label: "Protocols", value: "13" },
            { label: "Chains", value: "7" },
            { label: "Categories", value: "4" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="text-h5 text-gradient font-mono block">
                {stat.value}
              </span>
              <span
                className="text-body-3"
                style={{ color: "var(--text-muted)" }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
