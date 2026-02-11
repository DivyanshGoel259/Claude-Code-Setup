import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./colors";

const DURATION = 150;

const badges = [
  { text: "Directional Risk: 0%", color: C.cyan },
  { text: "No Funding Rate", color: C.green },
  { text: "Funding Fee Arbitrage", color: C.violet },
  { text: "Health Factor: Safe", color: C.cyan },
];

export const HedgeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [DURATION - 20, DURATION], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sceneFade = fadeIn * fadeOut;

  const scaleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const scaleScale = spring({ frame, fps, config: { damping: 14, stiffness: 80 }, durationInFrames: 28 });

  const leftSpring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 10, stiffness: 100 }, durationInFrames: 24 });
  const rightSpring = spring({ frame: Math.max(0, frame - 28), fps, config: { damping: 10, stiffness: 100 }, durationInFrames: 24 });

  const balanceOscillation = interpolate(frame, [50, 56, 62, 68, 75], [0, -3, 2, -1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const balancedGlow = interpolate(frame, [70, 82], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const equalsOpacity = interpolate(frame, [60, 72], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center", opacity: sceneFade }}>
      <div style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle, ${C.cyan}12, transparent 70%)`, filter: "blur(60px)", opacity: balancedGlow }} />

      <div style={{ position: "absolute", top: 60, opacity: scaleOpacity, fontSize: 18, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" as const, color: C.cyan }}>Hedge Strategy</div>

      {/* Balance beam */}
      <div style={{ opacity: scaleOpacity, transform: `scale(${scaleScale}) rotate(${balanceOscillation}deg)`, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <svg width="520" height="44" viewBox="0 0 520 44">
          <polygon points="260,42 248,28 272,28" fill={C.violet} />
          <rect x="50" y="20" width="420" height="7" rx="3.5" fill={C.textMuted} />
          <circle cx="90" cy="23" r="7" fill={C.cyan} />
          <circle cx="430" cy="23" r="7" fill={C.red} />
        </svg>

        <div style={{ display: "flex", gap: 160, marginTop: 12 }}>
          {/* Long Spot */}
          <div style={{ opacity: leftSpring, transform: `scale(${leftSpring})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: 170 }}>
            <div style={{ width: 150, height: 125, borderRadius: 18, background: `${C.cyan}14`, border: `1.5px solid ${C.cyan}35`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
              <span style={{ fontSize: 17, fontWeight: 700, color: C.cyan }}>Long Spot</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: C.text }}>$4,000</span>
            </div>
          </div>

          {/* Short Perp */}
          <div style={{ opacity: rightSpring, transform: `scale(${rightSpring})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: 170 }}>
            <div style={{ width: 150, height: 125, borderRadius: 18, background: `${C.red}14`, border: `1.5px solid ${C.red}35`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                <polyline points="16 17 22 17 22 11" />
              </svg>
              <span style={{ fontSize: 17, fontWeight: 700, color: C.red }}>Short Perp</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: C.text }}>$4,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Equals label */}
      <div style={{ position: "absolute", bottom: 185, opacity: equalsOpacity, display: "flex", alignItems: "center", gap: 12, background: `linear-gradient(135deg, ${C.violet}18, ${C.cyan}18)`, border: `1px solid ${C.violet}30`, padding: "12px 28px", borderRadius: 16 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
        <span style={{ fontSize: 20, fontWeight: 700, color: C.text }}>= Zero Directional Risk</span>
      </div>

      {/* Badges */}
      {badges.map((badge, i) => {
        const delay = 78 + i * 8;
        const bOpacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: "clamp" });
        const bY = interpolate(frame, [delay, delay + 10], [10, 0], { extrapolateRight: "clamp" });
        const positions = [
          { top: 120, left: 50 },
          { top: 120, right: 50 },
          { bottom: 120, left: 70 },
          { bottom: 120, right: 70 },
        ];
        return (
          <div key={i} style={{ position: "absolute", ...positions[i], opacity: bOpacity, transform: `translateY(${bY}px)`, background: `${badge.color}14`, border: `1px solid ${badge.color}35`, padding: "8px 16px", borderRadius: 50, display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={badge.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span style={{ fontSize: 15, fontWeight: 600, color: badge.color }}>{badge.text}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
