import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT } from "./colors";

const DURATION = 150;

const nodes = [
  {
    label: "Traders Borrow\n10x",
    angle: -90,
    color: C.violet,
    icon: (
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
    color: C.red,
    icon: (
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
  {
    label: "More Lenders\nJoin",
    angle: 90,
    color: C.cyan,
    icon: (
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    label: "Borrow Rate ↓\nMore Borrowing",
    angle: 180,
    color: C.purple,
    icon: (
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
        <polyline points="16 17 22 17 22 11" />
      </svg>
    ),
  },
];

export const FlywheelScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bigger flywheel radius
  const RADIUS = 230;
  const CENTER = 400;

  const fadeIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [DURATION - 20, DURATION], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneFade = fadeIn * fadeOut;

  const structureOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
  });
  const structureScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80 },
    durationInFrames: 24,
  });

  const particleAngle = interpolate(frame, [20, 140], [-90, -90 + 540], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const particleRad = (particleAngle * Math.PI) / 180;
  const particleX = CENTER + RADIUS * Math.cos(particleRad);
  const particleY = CENTER + RADIUS * Math.sin(particleRad);
  const particleOpacity = interpolate(frame, [20, 26], [0, 1], {
    extrapolateRight: "clamp",
  });

  const utilization = interpolate(frame, [20, 70, 100, 140], [45, 72, 72, 45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lenderAPY = interpolate(frame, [20, 70, 100, 140], [8, 15, 15, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleOpacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
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
          width: 550,
          height: 550,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.violet}14, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 50,
          opacity: titleOpacity,
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 3,
          textTransform: "uppercase" as const,
          color: C.violet,
        }}
      >
        Protocol Flywheel
      </div>

      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          opacity: structureOpacity,
          transform: `scale(${structureScale})`,
        }}
      >
        {/* Ring */}
        <svg width="800" height="800" style={{ position: "absolute" }}>
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke={`${C.violet}30`}
            strokeWidth="2.5"
            strokeDasharray="10 7"
          />
          {nodes.map((_, i) => {
            const startRad = ((nodes[i].angle + 25) * Math.PI) / 180;
            const endAngle = nodes[(i + 1) % nodes.length].angle;
            const endRad =
              ((endAngle - 25 + (endAngle <= nodes[i].angle ? 360 : 0)) *
                Math.PI) /
              180;
            const sx = CENTER + (RADIUS + 35) * Math.cos(startRad);
            const sy = CENTER + (RADIUS + 35) * Math.sin(startRad);
            const ex = CENTER + (RADIUS + 35) * Math.cos(endRad);
            const ey = CENTER + (RADIUS + 35) * Math.sin(endRad);
            return (
              <line
                key={`a${i}`}
                x1={sx}
                y1={sy}
                x2={ex}
                y2={ey}
                stroke={`${nodes[i].color}35`}
                strokeWidth="2"
                markerEnd={`url(#ah${i})`}
              />
            );
          })}
          <defs>
            {nodes.map((n, i) => (
              <marker
                key={i}
                id={`ah${i}`}
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill={`${n.color}55`} />
              </marker>
            ))}
          </defs>
        </svg>

        {/* Center hub – bigger */}
        <div
          style={{
            position: "absolute",
            left: CENTER - 70,
            top: CENTER - 70,
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: C.surface,
            border: `1.5px solid ${C.border}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <span
            style={{ fontSize: 13, color: C.textMuted, letterSpacing: 1.5 }}
          >
            Utilization Rate
          </span>
          <span style={{ fontSize: 28, fontWeight: 800, color: C.violet }}>
            {Math.floor(utilization)}%
          </span>
          <span style={{ fontSize: 12, color: C.textMuted }}>
            APY {lenderAPY.toFixed(1)}%
          </span>
        </div>

        {/* Nodes – bigger */}
        {nodes.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const nx = CENTER + RADIUS * Math.cos(rad);
          const ny = CENTER + RADIUS * Math.sin(rad);
          const angleDiff = Math.abs(
            ((particleAngle - node.angle + 180) % 360) - 180,
          );
          const isHighlighted = angleDiff < 30 && frame > 20;
          const nodeSpring = spring({
            frame: Math.max(0, frame - i * 5),
            fps,
            config: { damping: 12, stiffness: 100 },
            durationInFrames: 20,
          });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: nx - 70,
                top: ny - 48,
                width: 140,
                transform: `scale(${nodeSpring * (isHighlighted ? 1.08 : 1)})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 16,
                  background: `${node.color}${isHighlighted ? "28" : "18"}`,
                  border: `1.5px solid ${node.color}${isHighlighted ? "65" : "35"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: node.color,
                  boxShadow: isHighlighted
                    ? `0 0 24px ${node.color}45`
                    : "none",
                }}
              >
                {node.icon}
              </div>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: isHighlighted ? C.text : C.textSecondary,
                  textAlign: "center" as const,
                  lineHeight: 1.35,
                  whiteSpace: "pre-line" as const,
                }}
              >
                {node.label}
              </span>
            </div>
          );
        })}

        {/* Traveling particle */}
        <div
          style={{
            position: "absolute",
            left: particleX - 7,
            top: particleY - 7,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: C.violet,
            boxShadow: `0 0 20px ${C.violet}, 0 0 45px ${C.violet}80`,
            opacity: particleOpacity,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
