import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "../colors";

const DURATION = 150; // 5s at 30fps

const badges = [
  { text: "Directional Risk: 0%", color: COLORS.cyan },
  { text: "No Funding Rate", color: COLORS.green },
  { text: "Funding Fee Arbitrage", color: COLORS.violet },
  { text: "Health Factor: Safe", color: COLORS.cyan },
];

export const HedgeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in/out
  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [DURATION - 20, DURATION], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sceneFade = fadeIn * fadeOut;

  // Scale structure (0-28)
  const scaleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const scaleScale = spring({ frame, fps, config: { damping: 14, stiffness: 80 }, durationInFrames: 28 });

  // Left pan (20-42)
  const leftSpring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 10, stiffness: 100 }, durationInFrames: 24 });

  // Right pan (28-50)
  const rightSpring = spring({ frame: Math.max(0, frame - 28), fps, config: { damping: 10, stiffness: 100 }, durationInFrames: 24 });

  // Balance oscillation (50-75)
  const balanceOscillation = interpolate(frame, [50, 56, 62, 68, 75], [0, -3, 2, -1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Balanced glow (70+)
  const balancedGlow = interpolate(frame, [70, 82], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Equals label (60-75)
  const equalsOpacity = interpolate(frame, [60, 72], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        fontFamily: FONT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: sceneFade,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.cyan}10, transparent 70%)`,
          filter: "blur(60px)",
          opacity: balancedGlow,
        }}
      />

      <div style={{ position: "absolute", top: 70, opacity: scaleOpacity, fontSize: 14, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" as const, color: COLORS.cyan }}>
        Hedge Strategy
      </div>

      {/* Balance beam */}
      <div
        style={{
          opacity: scaleOpacity,
          transform: `scale(${scaleScale}) rotate(${balanceOscillation}deg)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <svg width="500" height="40" viewBox="0 0 500 40">
          <polygon points="250,38 240,25 260,25" fill={COLORS.violet} />
          <rect x="60" y="18" width="380" height="6" rx="3" fill={`${COLORS.textMuted}`} />
          <circle cx="100" cy="21" r="6" fill={COLORS.cyan} />
          <circle cx="400" cy="21" r="6" fill={COLORS.red} />
        </svg>

        <div style={{ display: "flex", gap: 180, marginTop: 8 }}>
          {/* Left - Long Spot */}
          <div style={{ opacity: leftSpring, transform: `scale(${leftSpring})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 160 }}>
            <div
              style={{
                width: 130,
                height: 110,
                borderRadius: 16,
                background: `${COLORS.cyan}12`,
                border: `1px solid ${COLORS.cyan}30`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={COLORS.cyan} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
              <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.cyan }}>Long Spot</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: COLORS.text }}>$4,000</span>
            </div>
          </div>

          {/* Right - Short Perp */}
          <div style={{ opacity: rightSpring, transform: `scale(${rightSpring})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 160 }}>
            <div
              style={{
                width: 130,
                height: 110,
                borderRadius: 16,
                background: `${COLORS.red}12`,
                border: `1px solid ${COLORS.red}30`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={COLORS.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                <polyline points="16 17 22 17 22 11" />
              </svg>
              <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.red }}>Short Perp</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: COLORS.text }}>$4,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Equals label */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          opacity: equalsOpacity,
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: `linear-gradient(135deg, ${COLORS.violet}15, ${COLORS.cyan}15)`,
          border: `1px solid ${COLORS.violet}25`,
          padding: "10px 24px",
          borderRadius: 14,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.cyan} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
        <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>= Zero Directional Risk</span>
      </div>

      {/* Badges */}
      {badges.map((badge, i) => {
        const delay = 78 + i * 8;
        const bOpacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: "clamp" });
        const bY = interpolate(frame, [delay, delay + 10], [10, 0], { extrapolateRight: "clamp" });
        const positions = [
          { top: 130, left: 60 },
          { top: 130, right: 60 },
          { bottom: 130, left: 80 },
          { bottom: 130, right: 80 },
        ];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              ...positions[i],
              opacity: bOpacity,
              transform: `translateY(${bY}px)`,
              background: `${badge.color}12`,
              border: `1px solid ${badge.color}30`,
              padding: "6px 14px",
              borderRadius: 50,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={badge.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span style={{ fontSize: 12, fontWeight: 600, color: badge.color }}>{badge.text}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
