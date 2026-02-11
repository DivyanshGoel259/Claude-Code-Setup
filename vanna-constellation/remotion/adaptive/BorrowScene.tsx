import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./colors";

const DURATION = 120;

export const BorrowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [DURATION - 20, DURATION], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sceneFade = fadeIn * fadeOut;

  const walletOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const walletScale = spring({ frame, fps, config: { damping: 12, stiffness: 80 }, durationInFrames: 25 });

  const labelOpacity = interpolate(frame, [18, 30], [0, 1], { extrapolateRight: "clamp" });

  const morphProgress = interpolate(frame, [32, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const orbGlow = interpolate(morphProgress, [0, 1], [0, 50]);
  const orbScale = interpolate(morphProgress, [0, 1], [1, 1.15]);

  const counterValue = interpolate(frame, [45, 75], [1000, 10000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const counterOpacity = interpolate(frame, [45, 52], [0, 1], { extrapolateRight: "clamp" });

  const badgeScale = spring({ frame: Math.max(0, frame - 65), fps, config: { damping: 10, stiffness: 120 }, durationInFrames: 18 });
  const badgeOpacity = interpolate(frame, [65, 72], [0, 1], { extrapolateRight: "clamp" });

  const rippleProgress = interpolate(frame, [60, 88], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rippleScale = interpolate(rippleProgress, [0, 1], [0.5, 2.5]);
  const rippleOpacity = interpolate(rippleProgress, [0, 0.3, 1], [0, 0.6, 0]);

  const underBadgeOpacity = interpolate(frame, [72, 82], [0, 1], { extrapolateRight: "clamp" });
  const underBadgeY = interpolate(frame, [72, 82], [15, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center", opacity: sceneFade }}>
      <div style={{ position: "absolute", width: 450, height: 450, borderRadius: "50%", background: `radial-gradient(circle, ${C.violet}30, transparent 70%)`, filter: "blur(60px)" }} />

      <div style={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", border: `2px solid ${C.violet}`, opacity: rippleOpacity, transform: `scale(${rippleScale})` }} />

      <div style={{ opacity: walletOpacity, transform: `scale(${walletScale * orbScale})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <div style={{ width: 140, height: 140, borderRadius: interpolate(morphProgress, [0, 1], [28, 70]), background: `linear-gradient(135deg, ${C.violet}, ${C.red})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 ${orbGlow}px ${orbGlow / 2}px ${C.violet}80` }}>
          {morphProgress < 0.5 ? (
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: interpolate(morphProgress, [0, 0.5], [1, 0], { extrapolateRight: "clamp" }) }}>
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
          ) : (
            <div style={{ width: 90, height: 90, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", opacity: interpolate(morphProgress, [0.5, 1], [0, 1], { extrapolateLeft: "clamp" }) }}>
              <Img src={staticFile("icons/vanna-icon.png")} style={{ width: 60, height: 60, objectFit: "contain" }} />
            </div>
          )}
        </div>

        <div style={{ opacity: labelOpacity * (1 - morphProgress), fontSize: 22, fontWeight: 600, color: C.textSecondary, letterSpacing: 1 }}>$1,000 Collateral</div>

        <div style={{ opacity: counterOpacity, fontSize: 68, fontWeight: 800, color: C.text, letterSpacing: -1, lineHeight: 1 }}>
          ${Math.floor(counterValue).toLocaleString()}
        </div>
      </div>

      {/* 10x Leverage badge */}
      <div style={{ position: "absolute", top: 170, right: 180, opacity: badgeOpacity, transform: `scale(${badgeScale})`, background: `linear-gradient(135deg, ${C.violet}, ${C.purple})`, padding: "12px 26px", borderRadius: 50, display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
        <span style={{ color: "white", fontSize: 20, fontWeight: 700, fontFamily: FONT }}>10x Leverage</span>
      </div>

      {/* Undercollateralized Credit badge */}
      <div style={{ position: "absolute", bottom: 150, opacity: underBadgeOpacity, transform: `translateY(${underBadgeY}px)`, background: C.surface, border: `1px solid ${C.border}`, padding: "12px 28px", borderRadius: 50, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.cyan }} />
        <span style={{ color: C.textSecondary, fontSize: 18, fontWeight: 600, fontFamily: FONT }}>Undercollateralized Credit</span>
      </div>
    </AbsoluteFill>
  );
};
