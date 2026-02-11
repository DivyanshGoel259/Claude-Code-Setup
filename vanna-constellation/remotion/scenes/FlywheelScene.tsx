import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "../colors";

const DURATION = 150; // 5s at 30fps

const nodes = [
  {
    label: "Traders Borrow\n10x",
    angle: -90,
    color: COLORS.violet,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Utilization ↑\nLender APY ↑",
    angle: 0,
    color: COLORS.red,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
  {
    label: "More Lenders\nJoin",
    angle: 90,
    color: COLORS.cyan,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    label: "Rates ↓\nMore Borrowing",
    angle: 180,
    color: COLORS.purple,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
        <polyline points="16 17 22 17 22 11" />
      </svg>
    ),
  },
];

export const FlywheelScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const RADIUS = 180;
  const CENTER = 400;

  // Scene fade in/out
  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [DURATION - 20, DURATION], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sceneFade = fadeIn * fadeOut;

  // Structure (0-20)
  const structureOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const structureScale = spring({ frame, fps, config: { damping: 14, stiffness: 80 }, durationInFrames: 24 });

  // Particle (20-140, continuous)
  const particleAngle = interpolate(frame, [20, 140], [-90, -90 + 540], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const particleRad = (particleAngle * Math.PI) / 180;
  const particleX = CENTER + RADIUS * Math.cos(particleRad);
  const particleY = CENTER + RADIUS * Math.sin(particleRad);
  const particleOpacity = interpolate(frame, [20, 26], [0, 1], { extrapolateRight: "clamp" });

  // Center metrics
  const utilization = interpolate(frame, [20, 70, 100, 140], [45, 72, 72, 45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lenderAPY = interpolate(frame, [20, 70, 100, 140], [8, 15, 15, 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const titleOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

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
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.violet}12, transparent 70%)`, filter: "blur(80px)" }} />

      <div style={{ position: "absolute", top: 60, opacity: titleOpacity, fontSize: 14, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" as const, color: COLORS.violet }}>
        Protocol Flywheel
      </div>

      <div style={{ position: "absolute", width: 800, height: 800, opacity: structureOpacity, transform: `scale(${structureScale})` }}>
        {/* Ring */}
        <svg width="800" height="800" style={{ position: "absolute" }}>
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke={`${COLORS.violet}25`} strokeWidth="2" strokeDasharray="8 6" />
          {nodes.map((_, i) => {
            const startRad = ((nodes[i].angle + 25) * Math.PI) / 180;
            const endAngle = nodes[(i + 1) % nodes.length].angle;
            const endRad = ((endAngle - 25 + (endAngle <= nodes[i].angle ? 360 : 0)) * Math.PI) / 180;
            const sx = CENTER + (RADIUS + 30) * Math.cos(startRad);
            const sy = CENTER + (RADIUS + 30) * Math.sin(startRad);
            const ex = CENTER + (RADIUS + 30) * Math.cos(endRad);
            const ey = CENTER + (RADIUS + 30) * Math.sin(endRad);
            return <line key={`a${i}`} x1={sx} y1={sy} x2={ex} y2={ey} stroke={`${nodes[i].color}30`} strokeWidth="1.5" markerEnd={`url(#ah${i})`} />;
          })}
          <defs>
            {nodes.map((n, i) => (
              <marker key={i} id={`ah${i}`} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill={`${n.color}50`} />
              </marker>
            ))}
          </defs>
        </svg>

        {/* Center hub */}
        <div style={{ position: "absolute", left: CENTER - 55, top: CENTER - 55, width: 110, height: 110, borderRadius: "50%", background: COLORS.surface, border: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <span style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1 }}>UTIL</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.violet }}>{Math.floor(utilization)}%</span>
          <span style={{ fontSize: 9, color: COLORS.textMuted }}>APY {lenderAPY.toFixed(1)}%</span>
        </div>

        {/* Nodes */}
        {nodes.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const nx = CENTER + RADIUS * Math.cos(rad);
          const ny = CENTER + RADIUS * Math.sin(rad);
          const angleDiff = Math.abs(((particleAngle - node.angle + 180) % 360) - 180);
          const isHighlighted = angleDiff < 30 && frame > 20;
          const nodeSpring = spring({ frame: Math.max(0, frame - i * 5), fps, config: { damping: 12, stiffness: 100 }, durationInFrames: 20 });
          return (
            <div key={i} style={{ position: "absolute", left: nx - 60, top: ny - 40, width: 120, transform: `scale(${nodeSpring * (isHighlighted ? 1.08 : 1)})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${node.color}${isHighlighted ? "25" : "15"}`, border: `1.5px solid ${node.color}${isHighlighted ? "60" : "30"}`, display: "flex", alignItems: "center", justifyContent: "center", color: node.color, boxShadow: isHighlighted ? `0 0 20px ${node.color}40` : "none" }}>
                {node.icon}
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: isHighlighted ? COLORS.text : COLORS.textSecondary, textAlign: "center" as const, lineHeight: 1.3, whiteSpace: "pre-line" as const }}>{node.label}</span>
            </div>
          );
        })}

        {/* Traveling particle */}
        <div style={{ position: "absolute", left: particleX - 6, top: particleY - 6, width: 12, height: 12, borderRadius: "50%", background: COLORS.violet, boxShadow: `0 0 16px ${COLORS.violet}, 0 0 40px ${COLORS.violet}80`, opacity: particleOpacity }} />
      </div>
    </AbsoluteFill>
  );
};
