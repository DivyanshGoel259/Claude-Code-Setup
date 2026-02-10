# Vanna Finance - Protocol Constellation

An interactive 3D visualization of DeFi protocol integrations built with Next.js 15, React Three Fiber, and Tailwind CSS.

## ✨ Features

- **Interactive 3D Constellation** - Explore 18+ DeFi protocols in a stunning 3D space
- **Auto-rotating Camera** - Smooth orbital controls with constrained viewing angles
- **Click-to-Focus** - Camera smoothly animates to focus on selected protocols
- **Hover Effects** - Protocols scale 1.3x with spring physics on hover
- **Animated Particles** - Particles flow along connection lines, pulsing on interaction
- **Category Filtering** - Filter protocols by category (Perps, Spot, Options, Yield, Lending)
- **Detail Panel** - Slide-in panel with protocol information and CTAs
- **Mobile Responsive** - Beautiful 2D grid fallback for mobile devices (<768px)
- **Accessibility** - WCAG compliant with keyboard navigation and screen reader support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Open your browser
# Navigate to http://localhost:3000
```

## 📦 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.x | React framework with App Router |
| **React** | 19.x | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **Three.js** | 0.170+ | 3D rendering engine |
| **React Three Fiber** | 8.x | React renderer for Three.js |
| **@react-three/drei** | 9.x | Three.js helpers and abstractions |
| **Framer Motion** | 11.x | Animation library |
| **GSAP** | 3.12+ | Camera animations |

## 🎨 Vanna Brand Colors

```css
--color-vanna-dark: #0A0A0F
--color-violet-500: #8B5CF6
--color-electric-blue-500: #3B82F6
--color-rose-400: #FB7185
--color-magenta-400: #E879F9
--color-imperial-red-500: #EF4444
```

## 📁 Project Structure

```
vanna-constellation/
├── app/
│   ├── page.tsx              # Main landing page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles + Vanna brand colors
├── components/
│   └── protocol-constellation/
│       ├── ProtocolConstellation.tsx  # Main wrapper component
│       ├── ProtocolScene3D.tsx        # Three.js 3D scene
│       ├── ProtocolGrid2D.tsx         # Mobile 2D grid fallback
│       ├── DetailPanel.tsx            # Slide-in info panel
│       ├── CategoryFilters.tsx        # Filter buttons
│       ├── types.ts                   # TypeScript interfaces
│       └── protocols-data.ts          # Mock protocol data (18 protocols)
```

## 🎮 Interactions

### Desktop (≥768px)

1. **Auto-Rotate**: The constellation automatically rotates slowly
2. **Orbit**: Drag to orbit around the constellation
3. **Zoom**: Scroll to zoom in/out (constrained between 8-30 units)
4. **Hover Protocol**: Nodes scale 1.3x, connections brighten, particles speed up
5. **Click Protocol**: Camera focuses on the node, detail panel slides in
6. **Filter Category**: Dim non-matching protocols to 20% opacity

### Mobile (<768px)

1. **Grid View**: Protocols displayed in a responsive 2-column grid
2. **Tap Card**: Opens detail panel with protocol information
3. **Filter Category**: Cards fade out when not matching active category

## 🎯 Protocol Categories

18 real DeFi protocols across 5 categories:

| Category | Protocols | Color |
|----------|-----------|-------|
| **Perps** | Hyperliquid, dYdX, GMX | Violet |
| **Spot** | Uniswap, Curve, Angle | Electric Blue |
| **Options** | Derive, Lyra, Ribbon | Rose |
| **Yield** | Pendle, Yearn, Notional, Convex | Magenta |
| **Lending** | Aave, Compound, MakerDAO, Morpho, Euler | Imperial Red |

## ⚙️ Configuration

### Adding New Protocols

Edit `components/protocol-constellation/protocols-data.ts`:

```typescript
{
  id: 'new-protocol',
  name: 'New Protocol',
  category: 'perps',
  position: calculatePosition(2, 3, 8),
  size: 0.9,
  integrationType: 'Smart Contract Integration',
  supportedActions: ['Long', 'Short', 'Leverage'],
  chains: ['base', 'arbitrum'],
  color: '#C4B5FD',
  description: 'Protocol description',
}
```

## 🚀 Build for Production

```bash
npm run build
npm start
```

## ♿ Accessibility

- ✅ `prefers-reduced-motion` support
- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Focus indicators
- ✅ Screen reader support

## 📝 License

MIT License

## 🙏 Credits

Built with ❤️ for Vanna Finance using Three.js, React Three Fiber, and Framer Motion.
