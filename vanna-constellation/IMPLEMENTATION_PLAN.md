# Unified "How It Works" Scroll Experience — Implementation Plan

## Vision

Combine three separate sections (FlowSection + CalculatorSection + StrategySection) into **one immersive scroll-driven section**. As the user scrolls, a sticky left panel shows the 4-phase timeline, while the right panel transitions between interactive components for each phase.

```
┌─────────────────────────────────────────────────────┐
│              HOW IT WORKS                           │
│     From deposit to deployment                      │
├──────────────────────┬──────────────────────────────┤
│                      │                              │
│  ● PHASE 01          │   [Deposit Widget]           │
│    Deposit           │   Wallet connect mockup      │
│    Collateral        │   Asset selector + amount    │
│                      │   Animated deposit flow      │
│  ○ PHASE 02          │                              │
│  ○ PHASE 03          │                              │
│  ○ PHASE 04          │                              │
│                      │                              │
├──────────────────────┴──────────────────────────────┤
│  ↓ scroll ↓                                         │
├──────────────────────┬──────────────────────────────┤
│                      │                              │
│  ✓ PHASE 01          │   [Calculator]               │
│                      │   Deposit → Leverage slider  │
│  ● PHASE 02          │   Trading power output       │
│    Borrow 10x        │   Traditional vs Vanna bars  │
│    Credit            │                              │
│                      │                              │
│  ○ PHASE 03          │                              │
│  ○ PHASE 04          │                              │
│                      │                              │
├──────────────────────┴──────────────────────────────┤
│  ↓ scroll ↓                                         │
├──────────────────────┬──────────────────────────────┤
│                      │                              │
│  ✓ PHASE 01          │   [Strategy Builder]         │
│  ✓ PHASE 02          │   Block selector + canvas    │
│                      │   Risk/Yield metrics         │
│  ● PHASE 03          │   Template presets           │
│    Deploy            │                              │
│    Anywhere          │                              │
│                      │                              │
│  ○ PHASE 04          │                              │
│                      │                              │
├──────────────────────┴──────────────────────────────┤
│  ↓ scroll ↓                                         │
├──────────────────────┬──────────────────────────────┤
│                      │                              │
│  ✓ PHASE 01          │   [Dashboard Preview]        │
│  ✓ PHASE 02          │   Portfolio overview mockup  │
│  ✓ PHASE 03          │   Health factor gauge        │
│                      │   P&L chart + positions      │
│  ● PHASE 04          │                              │
│    Manage            │                              │
│    Everything        │                              │
│                      │                              │
└──────────────────────┴──────────────────────────────┘
```

---

## Architecture

### Single New File
**`components/sections/HowItWorksSection.tsx`** — replaces FlowSection, CalculatorSection, and StrategySection from `page.tsx`

### Sub-components (inline or small files)
- **`DepositWidget`** — Phase 01 right panel (NEW)
- **`CalculatorWidget`** — Phase 02 right panel (extracted from CalculatorSection)
- **`StrategyWidget`** — Phase 03 right panel (extracted from StrategySection)
- **`DashboardWidget`** — Phase 04 right panel (NEW)

---

## Scroll Mechanics

### Approach: CSS `position: sticky` + Framer Motion `useScroll`

```
<section style={{ height: "400vh" }}>        ← tall scroll container
  <div style={{ position: "sticky", top: 0 }}> ← sticks to viewport
    <div className="grid grid-cols-[1fr_1.5fr]">
      <TimelinePanel activePhase={currentPhase} />
      <AnimatePresence mode="wait">
        <PhaseContent phase={currentPhase} />
      </AnimatePresence>
    </div>
  </div>
</section>
```

- Section height = `400vh` (100vh per phase = 4 phases)
- Inner content is `sticky` at `top: 0`, `height: 100vh`
- `useScroll({ target: sectionRef })` gives `scrollYProgress` (0→1)
- Map progress to active phase: `0–0.25 = Phase 1`, `0.25–0.5 = Phase 2`, etc.
- Phase transitions use `AnimatePresence mode="wait"` for smooth crossfade

### Mobile Approach
- On `lg:` breakpoint and below: stack vertically (no sticky), each phase is a separate block
- Timeline becomes horizontal breadcrumb or collapses to phase indicator
- Each widget renders inline as user scrolls past it

---

## Phase 01: Deposit Widget (NEW)

Interactive mockup showing the deposit flow:

```
┌──────────────────────────────────┐
│  Select Asset                    │
│  ┌──────┐ ┌──────┐ ┌──────┐    │
│  │ ETH  │ │ BTC  │ │ USDC │    │
│  └──────┘ └──────┘ └──────┘    │
│                                  │
│  Amount                          │
│  ┌──────────────────────────┐   │
│  │ $ 1,000                  │   │
│  └──────────────────────────┘   │
│                                  │
│  ┌──────────────────────────┐   │
│  │  Deposit to Vanna  →     │   │
│  └──────────────────────────┘   │
│                                  │
│  ─ ─ ─ animated flow ─ ─ ─ ─   │
│  Wallet → Vanna Margin Account  │
│  ✓ Collateral Secured           │
│  ✓ Ready for 10x leverage       │
│                                  │
└──────────────────────────────────┘
```

**Features:**
- Asset selector (ETH/BTC/USDC) with icons
- Deposit amount input (mirrors calculator value if user already interacted)
- Animated "deposit flow" — shows wallet → protocol with animated dotted line + checkmarks appearing sequentially
- Clean card with subtle entrance animation

---

## Phase 02: Calculator Widget (EXTRACTED)

Reuse existing CalculatorSection logic but as a compact widget:

- Remove section header/padding (parent handles that)
- Keep: Deposit input, Asset selector, Leverage slider, Results panel
- Keep: Bar chart comparison (Traditional vs Vanna)
- Fits within the right panel card

---

## Phase 03: Strategy Widget (EXTRACTED)

Reuse existing StrategySection logic but as a compact widget:

- Remove section header/padding
- Keep: Template buttons, 3-column grid (blocks / canvas / metrics)
- Keep: All calculation logic, risk gauge, capital allocation
- Keep: Disclaimer text at bottom
- Fits within the right panel card

---

## Phase 04: Dashboard Widget (NEW)

Interactive dashboard preview showing portfolio management:

```
┌──────────────────────────────────┐
│  Portfolio Overview              │
│  ┌────────────────────────────┐ │
│  │ Total Value    $10,450     │ │
│  │ P&L Today      +$450      │ │
│  │ Health Factor   ████░ 1.8 │ │
│  └────────────────────────────┘ │
│                                  │
│  Active Positions                │
│  ┌────────────────────────────┐ │
│  │ ETH Spot Long    +12.4%   │ │
│  │ ETH Perp Short    +6.2%   │ │
│  │ USDC Lend          +4.0%  │ │
│  └────────────────────────────┘ │
│                                  │
│  Protocols Connected             │
│  [Hyperliquid] [Derive] [Aave]  │
│                                  │
└──────────────────────────────────┘
```

**Features:**
- Portfolio value with animated counter (reuse AnimatedNumber pattern)
- Health factor gauge (gradient bar like risk gauge in strategy)
- Active positions list with green P&L values
- Connected protocols as small pills/badges
- All values are illustrative/mock — animated on entrance

---

## Timeline Panel (Left Side)

```
┌─────────────────────┐
│                      │
│  ● ─── Phase 01     │  ← active: filled dot, bright text
│  │     Deposit       │
│  │     Collateral    │
│  │     description   │
│  │                   │
│  ○ ─── Phase 02     │  ← upcoming: hollow dot, muted text
│  │     Borrow 10x   │
│  │                   │
│  ○ ─── Phase 03     │
│  │     Deploy        │
│  │                   │
│  ○ ─── Phase 04     │
│        Manage        │
│                      │
└─────────────────────┘
```

**Behavior:**
- Vertical line connects all phases
- Active phase: filled circle with pulse glow + accent color + visible description
- Completed phases: checkmark icon, muted but visible
- Upcoming phases: hollow circle, faded text
- Smooth color/opacity transitions as active phase changes
- Phase number label (PHASE 01, PHASE 02, etc.)

---

## Step-by-Step Implementation

### Step 1: Create `HowItWorksSection.tsx` scaffold
- Section wrapper with `height: 400vh` (scroll container)
- Sticky inner container with `100vh` height
- Section header ("How It Works" / "From deposit to deployment")
- 2-column grid: timeline (left) + content (right)
- `useScroll` + `useMotionValueEvent` to track active phase

### Step 2: Build TimelinePanel component
- 4 phases with vertical connecting line
- State-driven: receives `activePhase` prop (0-3)
- Animate dot states (empty → active → completed)
- Show description only for active phase

### Step 3: Build DepositWidget (Phase 01 — NEW)
- Asset selector (ETH/BTC/USDC buttons)
- Amount input field
- Animated deposit flow visualization
- Sequential checkmark reveals

### Step 4: Extract CalculatorWidget (Phase 02)
- Move calculator logic from CalculatorSection into a widget component
- Remove section wrapper, keep interactive UI
- Ensure it works standalone within the right panel

### Step 5: Extract StrategyWidget (Phase 03)
- Move strategy logic from StrategySection into a widget component
- Remove section wrapper, keep 3-column interactive grid
- Keep all calculation logic, templates, risk gauge

### Step 6: Build DashboardWidget (Phase 04 — NEW)
- Mock portfolio overview card
- Health factor gauge
- Animated position list
- Protocol badges

### Step 7: Wire up phase transitions
- `AnimatePresence mode="wait"` for right panel content
- Crossfade animation (opacity + slight y-shift)
- Timeline dot transitions synchronized with scroll

### Step 8: Mobile responsive layout
- Below `lg:` breakpoint: convert to vertical stacked layout
- Each phase becomes a full-width card
- Timeline becomes horizontal or inline indicator
- Widgets render inline without sticky behavior

### Step 9: Update page.tsx
- Remove: `<CalculatorSection />`, `<FlowSection />`, `<StrategySection />`
- Add: `<HowItWorksSection />`
- Adjust section ordering

### Step 10: Clean up
- Delete or keep old files (CalculatorSection.tsx, FlowSection.tsx, StrategySection.tsx) as reference
- Test all scroll breakpoints
- Verify mobile layout
- Test all interactive features still work (calculator inputs, strategy toggles)

---

## Animation Specs

| Transition | Animation | Duration | Easing |
|---|---|---|---|
| Phase change (right panel) | Fade out → Fade in + slide up 20px | 300ms each | `[0.22, 1, 0.36, 1]` |
| Timeline dot activate | Scale 0.5→1 + opacity | 400ms | spring(200, 25) |
| Timeline dot complete | Color shift + checkmark appear | 300ms | ease-out |
| Widget entrance elements | Stagger children fade up | 80ms stagger | `[0.22, 1, 0.36, 1]` |
| Number counters | useSpring | 800ms | spring(100, 30) |

---

## Files Changed

| File | Action |
|---|---|
| `components/sections/HowItWorksSection.tsx` | **CREATE** — main unified section |
| `app/page.tsx` | **EDIT** — replace 3 sections with 1 |
| `components/sections/FlowSection.tsx` | Keep as backup (unused) |
| `components/sections/CalculatorSection.tsx` | Keep as backup (unused) |
| `components/sections/StrategySection.tsx` | Keep as backup (unused) |

---

## Key Decisions

1. **Single file vs multi-file**: All widgets + timeline in ONE file (`HowItWorksSection.tsx`) to keep it self-contained. Sub-components are defined within the same file.

2. **Scroll library**: Pure Framer Motion `useScroll` + CSS `position: sticky`. No GSAP ScrollTrigger needed — keeps bundle lean.

3. **Mobile fallback**: Vertical stacked layout without sticky. Each phase is a standalone card with `useInView` entrance animations (same pattern as current sections).

4. **Interactivity preserved**: Calculator inputs, strategy block toggles, template selectors all remain fully interactive within their widgets.

5. **Height**: 400vh total (100vh per phase). This gives comfortable scroll distance between phases without feeling rushed.
