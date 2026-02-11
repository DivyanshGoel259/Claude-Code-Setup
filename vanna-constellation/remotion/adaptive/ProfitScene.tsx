import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./colors";

const DURATION = 150;

const incomeItems = [
  { label: "Funding Fees", value: 150, color: C.green },
  { label: "Yield Farming APY", value: 200, color: C.green },
];

const costItems = [{ label: "Borrow Interest", value: -85, color: C.red }];

export const ProfitScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [DURATION - 20, DURATION], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sceneFade = fadeIn * fadeOut;

  const cardX = interpolate(frame, [0, 20], [120, 0], { extrapolateRight: "clamp" });
  const cardOpacity = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const cardBlur = interpolate(frame, [0, 20], [8, 0], { extrapolateRight: "clamp" });
  const titleOpacity = interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" });

  const dividerWidth = interpolate(frame, [65, 78], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const profitDelay = 82;
  const profitScale = spring({ frame: Math.max(0, frame - profitDelay), fps, config: { damping: 10, stiffness: 120 }, durationInFrames: 20 });
  const profitOpacity = interpolate(frame, [profitDelay, profitDelay + 10], [0, 1], { extrapolateRight: "clamp" });
  const profitValue = interpolate(frame, [profitDelay, profitDelay + 25], [0, 265], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const roiDelay = 95;
  const roiScale = spring({ frame: Math.max(0, frame - roiDelay), fps, config: { damping: 8, stiffness: 150 }, durationInFrames: 18 });
  const roiOpacity = interpolate(frame, [roiDelay, roiDelay + 10], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center", opacity: sceneFade }}>
      <div style={{ position: "absolute", top: 60, opacity: titleOpacity, fontSize: 18, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" as const, color: C.green }}>Profit Breakdown</div>

      {/* Main card */}
      <div style={{ opacity: cardOpacity, transform: `translateX(${cardX}px)`, filter: `blur(${cardBlur}px)`, width: 460, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 26, padding: "36px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 30 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: `${C.green}1A`, border: `1px solid ${C.green}35`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: C.text }}>Strategy Returns</span>
          <span style={{ fontSize: 15, color: C.textMuted, marginLeft: "auto" }}>on $1,000 collateral</span>
        </div>

        {/* Income items */}
        {incomeItems.map((item, i) => {
          const delay = 22 + i * 14;
          const opacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: "clamp" });
          const x = interpolate(frame, [delay, delay + 10], [20, 0], { extrapolateRight: "clamp" });
          const amount = interpolate(frame, [delay + 8, delay + 28], [0, item.value], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ opacity, transform: `translateX(${x}px)`, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
              <span style={{ fontSize: 18, color: C.textSecondary }}>{item.label}</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: item.color }}>+${Math.floor(amount)}</span>
            </div>
          );
        })}

        {/* Total income */}
        {(() => {
          const totalDelay = 52;
          const totalOpacity = interpolate(frame, [totalDelay, totalDelay + 10], [0, 1], { extrapolateRight: "clamp" });
          const totalAmount = interpolate(frame, [totalDelay, totalDelay + 20], [0, 350], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div style={{ opacity: totalOpacity, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px dashed ${C.border}`, marginBottom: 6 }}>
              <span style={{ fontSize: 17, fontWeight: 600, color: C.textMuted }}>Total Income</span>
              <span style={{ fontSize: 21, fontWeight: 700, color: C.green }}>+${Math.floor(totalAmount)}</span>
            </div>
          );
        })()}

        {/* Cost items */}
        {costItems.map((item, i) => {
          const delay = 58 + i * 10;
          const opacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: "clamp" });
          const amount = interpolate(frame, [delay + 5, delay + 20], [0, Math.abs(item.value)], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={`c${i}`} style={{ opacity, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
              <span style={{ fontSize: 18, color: C.textSecondary }}>{item.label}</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: C.red }}>-${Math.floor(amount)}</span>
            </div>
          );
        })}

        {/* Divider */}
        <div style={{ height: 2.5, background: `linear-gradient(90deg, ${C.violet}, ${C.cyan})`, width: `${dividerWidth}%`, borderRadius: 2, margin: "14px 0" }} />

        {/* Net profit */}
        <div style={{ opacity: profitOpacity, transform: `scale(${profitScale})`, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: `${C.green}12`, border: `1px solid ${C.green}28`, borderRadius: 16 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: C.text }}>Net Profit</span>
          <span style={{ fontSize: 34, fontWeight: 800, color: C.green }}>+${Math.floor(profitValue)}</span>
        </div>
      </div>

      {/* ROI badge */}
      <div style={{ position: "absolute", bottom: 130, right: 160, opacity: roiOpacity, transform: `scale(${roiScale})`, background: `linear-gradient(135deg, ${C.green}, ${C.cyan})`, padding: "14px 32px", borderRadius: 50, boxShadow: `0 0 35px ${C.green}45` }}>
        <span style={{ fontSize: 24, fontWeight: 800, color: "white" }}>
          ROI: {Math.floor(interpolate(frame, [roiDelay, roiDelay + 18], [0, 26.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}%
        </span>
      </div>
    </AbsoluteFill>
  );
};
