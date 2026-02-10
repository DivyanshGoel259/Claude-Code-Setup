# Protocol Constellation - 3D Ecosystem Map Design

> **Version:** 1.0 | **Date:** February 10, 2026
> **Project:** Vanna Finance - Section 5: Protocol Constellation
> **Purpose:** Interactive 3D visualization of DeFi protocol integrations

---

## Overview

The Protocol Constellation is an interactive 3D visualization showcasing Vanna's 15+ protocol integrations across 5 chains. Users can explore the ecosystem through an orbital node graph with Vanna at the center, connected to categorized protocol nodes via animated particle streams.

**Key Features:**
- 3D constellation with auto-rotating camera
- Click nodes to focus + show detail panel
- Hover effects with spring physics (1.3x scale)
- Category filtering (dim non-matching to 20% opacity)
- Animated particles that pulse on interaction
- Mobile fallback: 2D grid with Framer Motion
- Responsive breakpoint at 768px

---

## 1. Architecture

### File Structure
```
src/
  components/
    protocol-constellation/
      ProtocolConstellation.tsx        # Main section wrapper
      ProtocolScene3D.tsx               # Three.js scene (dynamic import)
      ProtocolGrid2D.tsx                # Mobile fallback grid
      DetailPanel.tsx                   # Sliding info panel
      CategoryFilters.tsx               # Filter buttons
      types.ts                          # TypeScript interfaces
      protocols-data.ts                 # Mock protocol data
      shaders/
        connection-line.vert/frag       # Custom dashed line shader (optional)
```

### Component Hierarchy
- `ProtocolConstellation` (main wrapper)
  - Handles responsive breakpoint detection (768px)
  - Desktop (≥768px): renders `ProtocolScene3D`
  - Mobile (<768px): renders `ProtocolGrid2D`
  - Shared: `DetailPanel` and `CategoryFilters`

### State Management
- React local state (no external library needed)
- State variables:
  - `selectedProtocol: Protocol | null` - clicked protocol
  - `activeCategory: string` - filter selection
  - `hoveredProtocol: string | null` - hovered node ID
- Communication via props/callbacks

### Performance Strategy
- `ProtocolScene3D` loaded via `next/dynamic` with `ssr: false`
- Three.js bundle (~200KB) only loads client-side
- Intersection Observer triggers animations when section enters viewport

---

## 2. Data Structure

### TypeScript Interfaces

```typescript
interface Protocol {
  id: string;
  name: string;
  category: 'perps' | 'spot' | 'options' | 'yield' | 'lending';
  position: { x: number; y: number; z: number }; // Pre-computed 3D positions
  size: number; // Node size multiplier (0.8 - 1.5)
  integrationType: string; // e.g., "Smart Contract", "API"
  supportedActions: string[]; // e.g., ["Long", "Short", "Leverage"]
  chains: ('base' | 'arbitrum' | 'optimism' | 'stellar')[];
  color: string; // Hex color for Three.js materials
}

interface CategoryConfig {
  id: string;
  label: string;
  color: string; // Hex for Three.js materials
  tailwindClass: string; // For 2D grid
}
```

### Mock Data (protocols-data.ts)

**Hardcoded ~18 protocols** arranged in 3 orbital rings:
- **Inner ring (5 protocols)**: Hyperliquid, Uniswap, dYdX, GMX, Binance
- **Middle ring (8 protocols)**: Derive, Pendle, Aave, Lyra, Ribbon, Yield Protocol, Compound, MakerDAO
- **Outer ring (5 protocols)**: Morpho, Euler, Notional, Angle, Frax

**Position Calculation:**
```javascript
radius = ring * 3 // inner=3, middle=6, outer=9
angle = (index / protocolsInRing) * Math.PI * 2
x = radius * Math.cos(angle)
z = radius * Math.sin(angle)
y = random(-1, 1) // Slight vertical variation for depth
```

Pre-computed positions ensure consistent layout without runtime calculation.

---

## 3. Three.js Scene Setup

### Canvas Configuration

```typescript
<Canvas
  camera={{ position: [0, 8, 15], fov: 50 }}
  gl={{ antialias: true, alpha: true }}
  dpr={[1, 2]} // Responsive pixel ratio (caps at 2x)
>
  <color attach="background" args={['#0A0A0F']} />
  <ambientLight intensity={0.2} />
  <pointLight position={[0, 10, 10]} intensity={0.5} />
```

### Camera Controls (OrbitControls)

```typescript
<OrbitControls
  autoRotate={true}
  autoRotateSpeed={0.5}
  minPolarAngle={Math.PI / 6}
  maxPolarAngle={Math.PI / 2.5}
  enableDamping={true}
  dampingFactor={0.05}
  maxDistance={30}
  minDistance={8}
/>
```

### Center Node (Vanna)

- **Geometry:** `SphereGeometry(1, 32, 32)` - larger than protocol nodes
- **Material:** `MeshStandardMaterial`
  - `emissive`: Gradient simulation (lerp #8B5CF6 violet → #3B82F6 blue)
  - `emissiveIntensity`: 1.5 with subtle pulsing (sine wave)
- **Animation:** Pulsing emissive intensity creates "breathing" effect

### Protocol Nodes

- **Geometry:** `SphereGeometry` with size based on `protocol.size` (radius 0.3 - 0.6)
- **Material:** `MeshStandardMaterial`
  - `emissive`: Category color
  - `emissiveIntensity`: 0.8 default, 1.2 on hover
- **Hover Animation:** Scale 1.0 → 1.3 using react-spring

---

## 4. Interaction System

### Click Behavior (Focus Node)

When a node is clicked:

1. **State Update:** Set `selectedProtocol` → triggers DetailPanel slide-in
2. **Camera Animation (GSAP):**
```typescript
gsap.to(camera.position, {
  x: targetPosition.x * 0.7,
  y: targetPosition.y + 2,
  z: targetPosition.z * 0.7,
  duration: 1.2,
  ease: "power2.inOut"
});
```
3. **Visual Feedback:**
   - Connection lines to that node brighten (opacity 0.3 → 1.0)
   - Particles on those lines pulse faster (speed × 3)

### Hover Behavior

- **Node:** Scale 1.0 → 1.3 with spring physics (react-spring)
- **Cursor:** Changes to pointer
- **Connections:** Subtle brightening (opacity 0.3 → 0.5)
- **Particles:** Speed × 2 on hovered node's connections

### Category Filter Interaction

- **Active Filter:** Dim non-matching nodes to opacity 0.2
- **Connections:** Also dim to 0.2
- **Transition:** Smooth lerp in animation loop (150ms)
- **"All" Filter:** Resets all opacities to default

### Raycaster Implementation

Using @react-three/fiber's built-in pointer events:

```typescript
<mesh
  onClick={(e) => handleNodeClick(protocol)}
  onPointerOver={(e) => handleNodeHover(protocol)}
  onPointerOut={handleNodeLeave}
  position={[protocol.position.x, protocol.position.y, protocol.position.z]}
>
```

---

## 5. Connection Lines & Particles

### Connection Lines

Each protocol connects to the center Vanna node.

**Implementation:**
```typescript
<Line
  points={[
    [0, 0, 0],  // Vanna center
    [protocol.position.x, protocol.position.y, protocol.position.z]
  ]}
  color={isHighlighted ? '#8B5CF6' : '#4B5563'}
  lineWidth={2}
  dashed={true}
  dashScale={20}
  opacity={dimmed ? 0.2 : 0.3}
/>
```

**States:**
- Default: Gray (#4B5563), opacity 0.3
- Highlighted (hover/click): Violet (#8B5CF6), opacity 1.0
- Dimmed (filter): Opacity 0.2

### Particle System

**InstancedMesh for Performance:**
- Total particles: `protocols.length × 12` (~216 particles)
- 10-15 particles per connection line

**Animation Logic:**
```typescript
particles.forEach((particle, i) => {
  // Update progress along line
  particle.progress += particle.speed * deltaTime * intensityMultiplier;
  if (particle.progress > 1) particle.progress = 0;

  // Lerp position from center to protocol
  const pos = new THREE.Vector3().lerpVectors(
    centerPos,
    particle.targetPos,
    particle.progress
  );

  // Scale creates fade in/out effect
  dummy.position.copy(pos);
  dummy.scale.setScalar(0.05 * Math.sin(particle.progress * Math.PI));
  dummy.updateMatrix();
  instancedMesh.setMatrixAt(i, dummy.matrix);
});
```

**Intensity Multiplier (Pulse on Interaction):**
- Default: 0.3 (subtle flow)
- On hover: 2.0 (particles on hovered node's connections speed up)
- On click: 3.0 (dramatic pulse effect)

---

## 6. UI Overlay Components

### DetailPanel (Slide-in Panel)

**Location:** Fixed right side, full height
**Animation:** Framer Motion spring (slides from right)

```typescript
<motion.div
  initial={{ x: '100%' }}
  animate={{ x: selectedProtocol ? 0 : '100%' }}
  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
  className="fixed right-0 top-0 h-full w-96 bg-gray-900/95 backdrop-blur-xl
             border-l border-gray-700 p-8 z-50"
>
  {selectedProtocol && (
    <>
      <h3 className="text-3xl font-semibold text-white mb-2">
        {selectedProtocol.name}
      </h3>
      <p className="text-violet-400 text-sm mb-6">
        {selectedProtocol.integrationType}
      </p>

      <div className="mb-6">
        <h4 className="text-gray-400 text-sm mb-2">Supported Actions</h4>
        <div className="flex flex-wrap gap-2">
          {selectedProtocol.supportedActions.map(action => (
            <span className="px-3 py-1 bg-violet-500/20 text-violet-300
                           rounded-full text-sm">
              {action}
            </span>
          ))}
        </div>
      </div>

      <button className="w-full bg-gradient-to-r from-violet-500 to-blue-500
                       text-white py-3 rounded-lg font-semibold
                       hover:shadow-lg hover:shadow-violet-500/50 transition-all">
        Trade on {selectedProtocol.name}
      </button>
    </>
  )}
</motion.div>
```

**Behavior:**
- Slides in when protocol clicked
- Content replaces smoothly when clicking another protocol
- Backdrop blur + transparency for glassmorphic effect

### CategoryFilters (Top Overlay)

**Location:** Centered at top, absolute positioned
**Animation:** Framer Motion hover/tap

```typescript
<div className="absolute top-8 left-1/2 -translate-x-1/2 z-40 flex gap-3">
  <button className="px-6 py-2 rounded-full">All</button>
  <button className="px-6 py-2 rounded-full">Perps</button>
  <button className="px-6 py-2 rounded-full">Spot</button>
  <button className="px-6 py-2 rounded-full">Options</button>
  <button className="px-6 py-2 rounded-full">Yield</button>
  <button className="px-6 py-2 rounded-full">Lending</button>
</div>
```

**States:**
- Active: `bg-violet-500 text-white`
- Inactive: `bg-gray-700/50 text-gray-300 hover:bg-gray-600/50`

---

## 7. Mobile 2D Fallback

### ProtocolGrid2D Component

**Responsive Grid:** 2 columns on mobile, stagger animation

```typescript
<motion.div
  className="grid grid-cols-2 gap-4 p-6"
  initial="hidden"
  animate="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.05 } }
  }}
>
  {filteredProtocols.map((protocol) => (
    <motion.div
      key={protocol.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setSelectedProtocol(protocol)}
      className={`
        relative p-4 rounded-xl backdrop-blur-sm border cursor-pointer
        ${activeCategory === protocol.category || !activeCategory
          ? 'bg-gray-800/60 border-gray-700 opacity-100'
          : 'bg-gray-800/20 border-gray-800 opacity-30'}
      `}
    >
      {/* Category indicator dot */}
      <div
        className="absolute top-2 right-2 w-2 h-2 rounded-full"
        style={{ backgroundColor: getCategoryColor(protocol.category) }}
      />

      {/* Protocol icon placeholder */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br
                    from-violet-500 to-blue-500 mb-3" />

      <h4 className="text-white font-semibold mb-1">{protocol.name}</h4>
      <p className="text-gray-400 text-xs capitalize">{protocol.category}</p>
    </motion.div>
  ))}
</motion.div>
```

### Responsive Breakpoint Detection

```typescript
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth < 768);
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);

return isMobile ? <ProtocolGrid2D /> : <ProtocolScene3D />;
```

**Breakpoint:** 768px
- **< 768px:** 2D grid
- **≥ 768px:** 3D scene

---

## 8. Main Section Wrapper

### ProtocolConstellation.tsx

```typescript
export default function ProtocolConstellation() {
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hoveredProtocol, setHoveredProtocol] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  return (
    <section className="relative w-full min-h-screen bg-[#0A0A0F] overflow-hidden">
      {/* Header Content */}
      <div className="relative z-30 text-center pt-20 pb-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-violet-400 text-sm font-semibold mb-3 tracking-wide">
            15+ PROTOCOLS. 5 CHAINS. ONE ACCOUNT.
          </p>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Your Gateway to All of DeFi
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Vanna connects you to the protocols you love - with 10x more capital.
          </p>
        </motion.div>
      </div>

      {/* Category Filters */}
      <CategoryFilters
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* 3D Scene or 2D Grid */}
      <div className="relative w-full h-[600px] md:h-[700px]">
        {isMobile ? (
          <ProtocolGrid2D
            protocols={protocols}
            selectedProtocol={selectedProtocol}
            onProtocolClick={setSelectedProtocol}
            activeCategory={activeCategory}
          />
        ) : (
          <ProtocolScene3D
            protocols={protocols}
            selectedProtocol={selectedProtocol}
            onProtocolClick={setSelectedProtocol}
            hoveredProtocol={hoveredProtocol}
            onProtocolHover={setHoveredProtocol}
            activeCategory={activeCategory}
          />
        )}
      </div>

      {/* Detail Panel */}
      <DetailPanel
        protocol={selectedProtocol}
        onClose={() => setSelectedProtocol(null)}
      />
    </section>
  );
}
```

---

## 9. Dependencies & Configuration

### package.json

```json
{
  "name": "vanna-protocol-constellation",
  "version": "1.0.0",
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "^15.0.0",
    "three": "^0.170.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.100.0",
    "framer-motion": "^11.0.0",
    "gsap": "^3.12.0",
    "@types/three": "^0.170.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0"
  }
}
```

### tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'vanna-dark': '#0A0A0F',
        violet: {
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        'electric-blue': {
          400: '#60A5FA',
          500: '#3B82F6',
        },
        rose: {
          400: '#FB7185',
          500: '#F43F5E',
        },
        magenta: {
          400: '#E879F9',
          500: '#D946EF',
        },
        'imperial-red': {
          400: '#F87171',
          500: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
```

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
};

export default nextConfig;
```

---

## 10. Performance & Accessibility

### Performance Optimizations

**1. Dynamic Imports (SSR Disabled)**

```typescript
import dynamic from 'next/dynamic';

const ProtocolScene3D = dynamic(
  () => import('./ProtocolScene3D'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400 animate-pulse">Loading 3D scene...</div>
      </div>
    )
  }
);
```

**2. Three.js Optimizations**

- `dpr={[1, 2]}` - Caps pixel ratio at 2x for retina displays
- `frameloop="demand"` - Only renders when needed (after interactions stop)
- Dispose geometries/materials on unmount to prevent memory leaks
- `useMemo` for static geometries and materials

**3. Intersection Observer**

```typescript
const [isVisible, setIsVisible] = useState(false);
const sectionRef = useRef<HTMLElement>(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => setIsVisible(entry.isIntersecting),
    { threshold: 0.1 }
  );
  if (sectionRef.current) observer.observe(sectionRef.current);
  return () => observer.disconnect();
}, []);

// Only start animations when isVisible === true
```

**4. Bundle Size Targets**

- Initial page load: <100KB JS
- Three.js chunk (lazy): ~200KB gzipped
- Total with assets: <400KB

### Accessibility

**prefers-reduced-motion:**
```typescript
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

// Disable auto-rotate, particle animations, use instant transitions
<OrbitControls autoRotate={!prefersReducedMotion} />
```

**Keyboard Navigation:**
- Tab through category filter buttons
- Enter/Space to select category
- Focus visible with violet ring

**ARIA Labels:**
```typescript
<div
  role="img"
  aria-label="Interactive 3D constellation showing Vanna's protocol integrations"
>
  <Canvas />
</div>
```

**Screen Reader Fallback:**
```html
<div className="sr-only">
  Vanna integrates with 15+ DeFi protocols across 5 chains including
  Hyperliquid, Uniswap, dYdX, and more. Explore the visualization to
  learn about each protocol integration.
</div>
```

**Focus Management:**
- Visible focus rings: `ring-2 ring-violet-500 ring-offset-2 ring-offset-gray-900`
- Detail panel traps focus when open
- Escape key closes detail panel

---

## Summary

This design provides a complete, production-ready implementation plan for the Protocol Constellation section. The architecture prioritizes:

1. **Performance** - Dynamic imports, lazy loading, optimized Three.js rendering
2. **Responsiveness** - 3D on desktop/tablet, beautiful 2D fallback on mobile
3. **Interactivity** - Rich interactions (hover, click, filter) with smooth animations
4. **Accessibility** - Keyboard navigation, ARIA labels, reduced motion support
5. **Maintainability** - Modular components, TypeScript types, clear separation of concerns

**Next Steps:**
1. Set up Next.js 15 project with dependencies
2. Implement component structure
3. Create mock protocol data
4. Build 3D scene with Three.js
5. Add interactions and animations
6. Implement mobile fallback
7. Test performance and accessibility
