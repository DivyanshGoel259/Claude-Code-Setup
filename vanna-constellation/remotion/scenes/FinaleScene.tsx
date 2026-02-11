import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "../colors";

const DURATION = 120; // 4s at 30fps

export const FinaleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Collapse (0-14)
  const collapseScale = interpolate(frame, [0, 14], [1, 0], { extrapolateRight: "clamp" });
  const collapseOpacity = interpolate(frame, [0, 10], [0.5, 0], { extrapolateRight: "clamp" });

  // Shield (12-30)
  const shieldScale = spring({ frame: Math.max(0, frame - 12), fps, config: { damping: 8, stiffness: 120 }, durationInFrames: 22 });
  const shieldOpacity = interpolate(frame, [12, 20], [0, 1], { extrapolateRight: "clamp" });

  // Checkmark (25-38)
  const checkProgress = interpolate(frame, [25, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const checkLength = 22;

  // Text (38-58)
  const fullText = "Without Getting Liquidated";
  const textChars = Math.floor(interpolate(frame, [38, 58], [0, fullText.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const displayText = fullText.slice(0, textChars);
  const textOpacity = interpolate(frame, [38, 44], [0, 1], { extrapolateRight: "clamp" });

  // Checkmark after text
  const checkBadgeOpacity = interpolate(frame, [58, 64], [0, 1], { extrapolateRight: "clamp" });

  // Logo (60-72)
  const logoOpacity = interpolate(frame, [60, 70], [0, 1], { extrapolateRight: "clamp" });
  const logoY = interpolate(frame, [60, 70], [15, 0], { extrapolateRight: "clamp" });

  // Tagline (68-78)
  const taglineOpacity = interpolate(frame, [68, 76], [0, 1], { extrapolateRight: "clamp" });

  // Fade to black (100-120)
  const fadeToBlack = interpolate(frame, [100, DURATION], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        fontFamily: FONT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Glow */}
      <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.violet}20, ${COLORS.cyan}10, transparent 70%)`, filter: "blur(50px)", opacity: shieldOpacity }} />

      {/* Collapsing particles */}
      {[0, 90, 180, 270].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const dist = 160 * collapseScale;
        return (
          <div key={i} style={{ position: "absolute", left: 400 + dist * Math.cos(rad) - 6, top: 400 + dist * Math.sin(rad) - 6, width: 12, height: 12, borderRadius: "50%", background: [COLORS.violet, COLORS.red, COLORS.cyan, COLORS.purple][i], opacity: collapseOpacity, boxShadow: `0 0 10px ${[COLORS.violet, COLORS.red, COLORS.cyan, COLORS.purple][i]}` }} />
        );
      })}

      {/* Shield */}
      <div style={{ opacity: shieldOpacity, transform: `scale(${shieldScale})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
        <div style={{ width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="110" height="110" viewBox="0 0 24 24" fill="none">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="url(#sg)" stroke={COLORS.cyan} strokeWidth="0.8" />
            <polyline points="9 12 11 14 15 10" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={checkLength} strokeDashoffset={checkLength * (1 - checkProgress)} />
            <defs>
              <linearGradient id="sg" x1="4" y1="2" x2="20" y2="22">
                <stop offset="0%" stopColor={COLORS.violet} />
                <stop offset="100%" stopColor={COLORS.cyan} />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div style={{ opacity: textOpacity, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: COLORS.text, letterSpacing: -0.5 }}>{displayText}</span>
          <span style={{ opacity: checkBadgeOpacity, fontSize: 28, color: COLORS.cyan }}>&#x2713;</span>
        </div>

        <div style={{ opacity: logoOpacity, transform: `translateY(${logoY}px)` }}>
          <span style={{ fontSize: 48, fontWeight: 800, letterSpacing: 8, background: `linear-gradient(135deg, ${COLORS.red}, ${COLORS.violet})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            VANNA
          </span>
        </div>

        <span style={{ opacity: taglineOpacity, fontSize: 14, fontWeight: 500, color: COLORS.textMuted, letterSpacing: 2 }}>
          Composable Credit Infrastructure
        </span>
      </div>

      {/* Fade to black */}
      <div style={{ position: "absolute", inset: 0, backgroundColor: COLORS.bg, opacity: fadeToBlack, pointerEvents: "none" as const }} />
    </AbsoluteFill>
  );
};
