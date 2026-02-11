import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT } from "./colors";

const DURATION = 180;

const strategies = [
  {
    label: "ETH Spot",
    amount: 4000,
    badges: ["No Funding Rate"],
    color: C.cyan,
    icon: (
      <svg
        width="38"
        height="38"
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
    x: -220,
    y: 100,
  },
  {
    label: "ETH Short Perp",
    amount: 4000,
    badges: ["Hedge Position", "Leverage Over Leverage"],
    color: C.red,
    icon: (
      <svg
        width="38"
        height="38"
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
    x: 0,
    y: 170,
  },
  {
    label: "Yield Farm",
    amount: 2000,
    badges: ["Extra APY"],
    color: C.green,
    icon: (
      <svg
        width="38"
        height="38"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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

  const fadeIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [DURATION - 20, DURATION], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneFade = fadeIn * fadeOut;

  const orbOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const orbPulse = interpolate(frame, [0, 25], [1, 1.1], {
    extrapolateRight: "clamp",
  });
  const pathProgress = interpolate(frame, [25, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const orbFade = interpolate(frame, [35, 55], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
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
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.violet}18, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 70,
          opacity: titleOpacity,
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 3,
          textTransform: "uppercase" as const,
          color: C.violet,
        }}
      >
        Composable Leverage
      </div>

      {/* Central orb — positioned absolutely so coords are predictable */}
      <div
        style={{
          position: "absolute",
          left: 400 - 35,
          top: 200 - 35,
          width: 70,
          height: 70,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${C.violet}, ${C.red})`,
          boxShadow: `0 0 35px ${C.violet}60`,
          opacity: orbOpacity * orbFade,
          transform: `scale(${orbPulse})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img
            src={staticFile("icons/vanna-icon.png")}
            style={{ width: 32, height: 32, objectFit: "contain" }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 245,
          left: 0,
          right: 0,
          textAlign: "center" as const,
          opacity: orbOpacity * orbFade,
          fontSize: 26,
          fontWeight: 700,
          color: C.text,
        }}
      >
        $10,000 Borrowed
      </div>

      {/* Connecting lines — from orb center (400,200) to card icon centers */}
      <svg
        width="800"
        height="800"
        style={{ position: "absolute", top: 0, left: 0 }}
        viewBox="0 0 800 800"
      >
        {strategies.map((s, i) => {
          const startX = 400;
          const startY = 200;
          const endX = 400 + s.x;
          const endY = 200 + s.y;
          const pathLength = Math.sqrt(
            (endX - startX) ** 2 + (endY - startY) ** 2,
          );
          const dashOffset = interpolate(pathProgress, [0, 1], [pathLength, 0]);
          return (
            <line
              key={i}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke={`${s.color}60`}
              strokeWidth="2.5"
              strokeDasharray={pathLength}
              strokeDashoffset={dashOffset}
            />
          );
        })}
      </svg>

      {/* Strategy cards — icon center aligned to line endpoint */}
      {strategies.map((s, i) => {
        const cardDelay = 50 + i * 14;
        const cardScale = spring({
          frame: Math.max(0, frame - cardDelay),
          fps,
          config: { damping: 12, stiffness: 100 },
          durationInFrames: 24,
        });
        const cardOpacity = interpolate(
          frame,
          [cardDelay, cardDelay + 12],
          [0, 1],
          { extrapolateRight: "clamp" },
        );
        const amountStart = cardDelay + 14;
        const amount = interpolate(
          frame,
          [amountStart, amountStart + 28],
          [0, s.amount],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const badgeDelay = 100 + i * 14;
        const badgeOpacity = interpolate(
          frame,
          [badgeDelay, badgeDelay + 12],
          [0, 1],
          { extrapolateRight: "clamp" },
        );
        const badgeY = interpolate(
          frame,
          [badgeDelay, badgeDelay + 12],
          [8, 0],
          { extrapolateRight: "clamp" },
        );

        // icon is 74x74, card content hangs below icon center
        const iconCenterX = 400 + s.x;
        const iconCenterY = 200 + s.y;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: iconCenterX - 95,
              top: iconCenterY - 37,
              opacity: cardOpacity,
              transform: `scale(${cardScale})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 190,
              gap: 10,
            }}
          >
            <div
              style={{
                width: 74,
                height: 74,
                borderRadius: 20,
                background: `${s.color}20`,
                border: `1.5px solid ${s.color}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: s.color,
              }}
            >
              {s.icon}
            </div>
            <span style={{ fontSize: 17, fontWeight: 700, color: C.text }}>
              {s.label}
            </span>
            <span
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: s.color,
                fontFamily: FONT,
              }}
            >
              ${Math.floor(amount).toLocaleString()}
            </span>
            {s.badges.map((badge, bi) => (
              <div
                key={bi}
                style={{
                  opacity: badgeOpacity,
                  transform: `translateY(${badgeY}px)`,
                  background: `${s.color}18`,
                  border: `1px solid ${s.color}35`,
                  padding: "5px 14px",
                  borderRadius: 50,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={s.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: s.color,
                    whiteSpace: "nowrap",
                  }}
                >
                  {badge}
                </span>
              </div>
            ))}
          </div>
        );
      })}

      {/* Particle dots */}
      {strategies.map((s, i) => {
        const particleStart = 70 + i * 12;
        const t = interpolate(
          frame,
          [particleStart, particleStart + 50],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const px = interpolate(t, [0, 1], [400, 400 + s.x]);
        const py = interpolate(t, [0, 1], [200, 200 + s.y]);
        return (
          <div
            key={`p${i}`}
            style={{
              position: "absolute",
              left: px - 5,
              top: py - 5,
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: s.color,
              boxShadow: `0 0 14px ${s.color}`,
              opacity: t > 0 && t < 1 ? 1 : 0,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
