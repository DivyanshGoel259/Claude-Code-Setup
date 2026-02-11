import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "../colors";

const DURATION = 180; // 6s at 30fps

const strategies = [
  {
    label: "ETH Spot",
    amount: 4000,
    badge: "No Funding Rate",
    color: COLORS.cyan,
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    x: -220,
    y: 100,
  },
  {
    label: "ETH Short Perp",
    amount: 4000,
    badge: "Hedge Position",
    color: COLORS.red,
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
        <polyline points="16 17 22 17 22 11" />
      </svg>
    ),
    x: 0,
    y: 160,
  },
  {
    label: "Yield Farm",
    amount: 2000,
    badge: "Extra APY",
    color: COLORS.green,
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V8" />
        <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
        <path d="M8 6c0-1.5 1.5-3 4-3s4 1.5 4 3-1.5 2-4 4c-2.5-2-4-2.5-4-4z" />
      </svg>
    ),
    x: 220,
    y: 100,
  },
];

export const ComposabilityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in/out
  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [DURATION - 20, DURATION], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sceneFade = fadeIn * fadeOut;

  // Central orb (0-25)
  const orbOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const orbPulse = interpolate(frame, [0, 25], [1, 1.1], { extrapolateRight: "clamp" });

  // Paths drawing out (25-55)
  const pathProgress = interpolate(frame, [25, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Orb fade as paths extend
  const orbFade = interpolate(frame, [35, 55], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Title
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

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
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.violet}15, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />

      <div style={{ position: "absolute", top: 80, opacity: titleOpacity, fontSize: 14, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" as const, color: COLORS.violet }}>
        Composable Leverage
      </div>

      {/* Central orb */}
      <div
        style={{
          position: "absolute",
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${COLORS.violet}, ${COLORS.red})`,
          boxShadow: `0 0 30px ${COLORS.violet}60`,
          opacity: orbOpacity * orbFade,
          transform: `scale(${orbPulse}) translateY(-60px)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: "white", fontSize: 22, fontWeight: 800 }}>V</span>
      </div>

      <div style={{ position: "absolute", top: 170, opacity: orbOpacity * orbFade, fontSize: 20, fontWeight: 700, color: COLORS.text }}>
        $10,000 Borrowed
      </div>

      {/* Connecting lines */}
      <svg width="800" height="800" style={{ position: "absolute", top: 0, left: 0 }} viewBox="0 0 800 800">
        {strategies.map((s, i) => {
          const startX = 400;
          const startY = 300;
          const endX = 400 + s.x;
          const endY = 300 + s.y;
          const pathLength = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
          const dashOffset = interpolate(pathProgress, [0, 1], [pathLength, 0]);
          return (
            <line key={i} x1={startX} y1={startY} x2={endX} y2={endY} stroke={`${s.color}60`} strokeWidth="2" strokeDasharray={pathLength} strokeDashoffset={dashOffset} />
          );
        })}
      </svg>

      {/* Strategy cards */}
      {strategies.map((s, i) => {
        const cardDelay = 50 + i * 14;
        const cardScale = spring({ frame: Math.max(0, frame - cardDelay), fps, config: { damping: 12, stiffness: 100 }, durationInFrames: 24 });
        const cardOpacity = interpolate(frame, [cardDelay, cardDelay + 12], [0, 1], { extrapolateRight: "clamp" });

        const amountStart = cardDelay + 14;
        const amount = interpolate(frame, [amountStart, amountStart + 28], [0, s.amount], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        const badgeDelay = 100 + i * 14;
        const badgeOpacity = interpolate(frame, [badgeDelay, badgeDelay + 12], [0, 1], { extrapolateRight: "clamp" });
        const badgeY = interpolate(frame, [badgeDelay, badgeDelay + 12], [8, 0], { extrapolateRight: "clamp" });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 400 + s.x - 90,
              top: 300 + s.y - 40,
              opacity: cardOpacity,
              transform: `scale(${cardScale})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: `${s.color}18`,
                border: `1px solid ${s.color}35`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: s.color,
              }}
            >
              {s.icon}
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{s.label}</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: FONT }}>
              ${Math.floor(amount).toLocaleString()}
            </span>
            <div
              style={{
                opacity: badgeOpacity,
                transform: `translateY(${badgeY}px)`,
                background: `${s.color}15`,
                border: `1px solid ${s.color}30`,
                padding: "4px 12px",
                borderRadius: 50,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span style={{ fontSize: 11, fontWeight: 600, color: s.color }}>{s.badge}</span>
            </div>
          </div>
        );
      })}

      {/* Particle dots */}
      {strategies.map((s, i) => {
        const particleStart = 70 + i * 12;
        const t = interpolate(frame, [particleStart, particleStart + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const px = interpolate(t, [0, 1], [400, 400 + s.x]);
        const py = interpolate(t, [0, 1], [300, 300 + s.y]);
        return (
          <div
            key={`p${i}`}
            style={{
              position: "absolute",
              left: px - 4,
              top: py - 4,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: s.color,
              boxShadow: `0 0 12px ${s.color}`,
              opacity: t > 0 && t < 1 ? 1 : 0,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
