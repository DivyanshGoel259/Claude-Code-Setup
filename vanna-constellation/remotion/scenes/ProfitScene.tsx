import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "../colors";

const DURATION = 150; // 5s at 30fps

const incomeItems = [
  { label: "Funding Fees", value: 150, color: COLORS.green },
  { label: "Yield Farming APY", value: 200, color: COLORS.green },
];

const costItems = [{ label: "Borrow Interest", value: -85, color: COLORS.red }];

export const ProfitScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in/out
  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [DURATION - 20, DURATION], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sceneFade = fadeIn * fadeOut;

  // Card slide in (0-20)
  const cardX = interpolate(frame, [0, 20], [120, 0], { extrapolateRight: "clamp" });
  const cardOpacity = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const cardBlur = interpolate(frame, [0, 20], [8, 0], { extrapolateRight: "clamp" });

  const titleOpacity = interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" });

  // Divider (65-78)
  const dividerWidth = interpolate(frame, [65, 78], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Net profit (82-100)
  const profitDelay = 82;
  const profitScale = spring({ frame: Math.max(0, frame - profitDelay), fps, config: { damping: 10, stiffness: 120 }, durationInFrames: 20 });
  const profitOpacity = interpolate(frame, [profitDelay, profitDelay + 10], [0, 1], { extrapolateRight: "clamp" });
  const profitValue = interpolate(frame, [profitDelay, profitDelay + 25], [0, 265], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ROI badge (95-110)
  const roiDelay = 95;
  const roiScale = spring({ frame: Math.max(0, frame - roiDelay), fps, config: { damping: 8, stiffness: 150 }, durationInFrames: 18 });
  const roiOpacity = interpolate(frame, [roiDelay, roiDelay + 10], [0, 1], { extrapolateRight: "clamp" });

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
      <div style={{ position: "absolute", top: 70, opacity: titleOpacity, fontSize: 14, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" as const, color: COLORS.green }}>
        Profit Breakdown
      </div>

      {/* Main card */}
      <div
        style={{
          opacity: cardOpacity,
          transform: `translateX(${cardX}px)`,
          filter: `blur(${cardBlur}px)`,
          width: 420,
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 24,
          padding: "32px 36px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${COLORS.green}18`, border: `1px solid ${COLORS.green}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>Strategy Returns</span>
          <span style={{ fontSize: 12, color: COLORS.textMuted, marginLeft: "auto" }}>on $1,000 collateral</span>
        </div>

        {/* Income items */}
        {incomeItems.map((item, i) => {
          const delay = 22 + i * 14;
          const opacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: "clamp" });
          const x = interpolate(frame, [delay, delay + 10], [20, 0], { extrapolateRight: "clamp" });
          const amount = interpolate(frame, [delay + 8, delay + 28], [0, item.value], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ opacity, transform: `translateX(${x}px)`, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0" }}>
              <span style={{ fontSize: 15, color: COLORS.textSecondary }}>{item.label}</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: item.color }}>+${Math.floor(amount)}</span>
            </div>
          );
        })}

        {/* Total income */}
        {(() => {
          const totalDelay = 52;
          const totalOpacity = interpolate(frame, [totalDelay, totalDelay + 10], [0, 1], { extrapolateRight: "clamp" });
          const totalAmount = interpolate(frame, [totalDelay, totalDelay + 20], [0, 350], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div style={{ opacity: totalOpacity, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px dashed ${COLORS.border}`, marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.textMuted }}>Total Income</span>
              <span style={{ fontSize: 17, fontWeight: 700, color: COLORS.green }}>+${Math.floor(totalAmount)}</span>
            </div>
          );
        })()}

        {/* Cost items */}
        {costItems.map((item, i) => {
          const delay = 58 + i * 10;
          const opacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: "clamp" });
          const amount = interpolate(frame, [delay + 5, delay + 20], [0, Math.abs(item.value)], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={`c${i}`} style={{ opacity, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0" }}>
              <span style={{ fontSize: 15, color: COLORS.textSecondary }}>{item.label}</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: COLORS.red }}>-${Math.floor(amount)}</span>
            </div>
          );
        })}

        {/* Divider */}
        <div style={{ height: 2, background: `linear-gradient(90deg, ${COLORS.violet}, ${COLORS.cyan})`, width: `${dividerWidth}%`, borderRadius: 2, margin: "12px 0" }} />

        {/* Net profit */}
        <div
          style={{
            opacity: profitOpacity,
            transform: `scale(${profitScale})`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            background: `${COLORS.green}10`,
            border: `1px solid ${COLORS.green}25`,
            borderRadius: 14,
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>Net Profit</span>
          <span style={{ fontSize: 28, fontWeight: 800, color: COLORS.green }}>+${Math.floor(profitValue)}</span>
        </div>
      </div>

      {/* ROI badge */}
      <div
        style={{
          position: "absolute",
          bottom: 140,
          right: 180,
          opacity: roiOpacity,
          transform: `scale(${roiScale})`,
          background: `linear-gradient(135deg, ${COLORS.green}, ${COLORS.cyan})`,
          padding: "12px 28px",
          borderRadius: 50,
          boxShadow: `0 0 30px ${COLORS.green}40`,
        }}
      >
        <span style={{ fontSize: 20, fontWeight: 800, color: "white" }}>
          ROI: {Math.floor(interpolate(frame, [roiDelay, roiDelay + 18], [0, 26.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}%
        </span>
      </div>
    </AbsoluteFill>
  );
};
