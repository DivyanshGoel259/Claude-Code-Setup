import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "../colors";

const DURATION = 120; // 4s at 30fps

export const BorrowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in/out
  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [DURATION - 20, DURATION], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sceneFade = fadeIn * fadeOut;

  // Wallet fade in (0-20)
  const walletOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const walletScale = spring({ frame, fps, config: { damping: 12, stiffness: 80 }, durationInFrames: 25 });

  // Label (18-30)
  const labelOpacity = interpolate(frame, [18, 30], [0, 1], { extrapolateRight: "clamp" });

  // Morph to orb (32-50)
  const morphProgress = interpolate(frame, [32, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const orbGlow = interpolate(morphProgress, [0, 1], [0, 40]);
  const orbScale = interpolate(morphProgress, [0, 1], [1, 1.15]);

  // Counter (45-75)
  const counterValue = interpolate(frame, [45, 75], [1000, 10000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const counterOpacity = interpolate(frame, [45, 52], [0, 1], { extrapolateRight: "clamp" });

  // Badge (65-80)
  const badgeScale = spring({ frame: Math.max(0, frame - 65), fps, config: { damping: 10, stiffness: 120 }, durationInFrames: 18 });
  const badgeOpacity = interpolate(frame, [65, 72], [0, 1], { extrapolateRight: "clamp" });

  // Ripple (60-90)
  const rippleProgress = interpolate(frame, [60, 88], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rippleScale = interpolate(rippleProgress, [0, 1], [0.5, 2.5]);
  const rippleOpacity = interpolate(rippleProgress, [0, 0.3, 1], [0, 0.6, 0]);

  // Undercollateralized badge (72-85)
  const underBadgeOpacity = interpolate(frame, [72, 82], [0, 1], { extrapolateRight: "clamp" });
  const underBadgeY = interpolate(frame, [72, 82], [15, 0], { extrapolateRight: "clamp" });

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
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.violet}25, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Ripple effect */}
      <div
        style={{
          position: "absolute",
          width: 160,
          height: 160,
          borderRadius: "50%",
          border: `2px solid ${COLORS.violet}`,
          opacity: rippleOpacity,
          transform: `scale(${rippleScale})`,
        }}
      />

      {/* Wallet / Orb */}
      <div
        style={{
          opacity: walletOpacity,
          transform: `scale(${walletScale * orbScale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: interpolate(morphProgress, [0, 1], [24, 60]),
            background: `linear-gradient(135deg, ${COLORS.violet}, ${COLORS.red})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 ${orbGlow}px ${orbGlow / 2}px ${COLORS.violet}80`,
          }}
        >
          {morphProgress < 0.5 ? (
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: interpolate(morphProgress, [0, 0.5], [1, 0], { extrapolateRight: "clamp" }) }}>
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
          ) : (
            <span style={{ color: "white", fontSize: 40, fontWeight: 800, fontFamily: FONT, opacity: interpolate(morphProgress, [0.5, 1], [0, 1], { extrapolateLeft: "clamp" }) }}>
              V
            </span>
          )}
        </div>

        {/* Collateral label */}
        <div style={{ opacity: labelOpacity * (1 - morphProgress), fontSize: 18, fontWeight: 600, color: COLORS.textSecondary, letterSpacing: 1 }}>
          $1,000 Collateral
        </div>

        {/* Counter */}
        <div style={{ opacity: counterOpacity, fontSize: 56, fontWeight: 800, color: COLORS.text, letterSpacing: -1, lineHeight: 1 }}>
          ${Math.floor(counterValue).toLocaleString()}
        </div>
      </div>

      {/* 10x Leverage badge */}
      <div
        style={{
          position: "absolute",
          top: 180,
          right: 200,
          opacity: badgeOpacity,
          transform: `scale(${badgeScale})`,
          background: `linear-gradient(135deg, ${COLORS.violet}, ${COLORS.purple})`,
          padding: "10px 22px",
          borderRadius: 50,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
        <span style={{ color: "white", fontSize: 16, fontWeight: 700, fontFamily: FONT }}>10x Leverage</span>
      </div>

      {/* Undercollateralized Credit badge */}
      <div
        style={{
          position: "absolute",
          bottom: 160,
          opacity: underBadgeOpacity,
          transform: `translateY(${underBadgeY}px)`,
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          padding: "10px 24px",
          borderRadius: 50,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.cyan }} />
        <span style={{ color: COLORS.textSecondary, fontSize: 14, fontWeight: 600, fontFamily: FONT }}>Undercollateralized Credit</span>
      </div>
    </AbsoluteFill>
  );
};
