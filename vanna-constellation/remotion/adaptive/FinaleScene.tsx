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

const DURATION = 120;

export const FinaleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Collapse (0-14)
  const collapseScale = interpolate(frame, [0, 14], [1, 0], {
    extrapolateRight: "clamp",
  });
  const collapseOpacity = interpolate(frame, [0, 10], [0.5, 0], {
    extrapolateRight: "clamp",
  });

  // Shield (12-30)
  const shieldScale = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { damping: 8, stiffness: 120 },
    durationInFrames: 22,
  });
  const shieldOpacity = interpolate(frame, [12, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Checkmark (25-38)
  const checkProgress = interpolate(frame, [25, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const checkLength = 22;

  // Heading (38-50)
  const headingOpacity = interpolate(frame, [38, 44], [0, 1], {
    extrapolateRight: "clamp",
  });
  const headingY = interpolate(frame, [38, 48], [15, 0], {
    extrapolateRight: "clamp",
  });

  // Subheading (50-65)
  const subheadingOpacity = interpolate(frame, [50, 56], [0, 1], {
    extrapolateRight: "clamp",
  });
  const subheadingY = interpolate(frame, [50, 60], [12, 0], {
    extrapolateRight: "clamp",
  });

  // Checkmark after subheading
  const checkBadgeOpacity = interpolate(frame, [62, 68], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Logo (60-72)
  const logoOpacity = interpolate(frame, [60, 70], [0, 1], {
    extrapolateRight: "clamp",
  });
  const logoY = interpolate(frame, [60, 70], [15, 0], {
    extrapolateRight: "clamp",
  });

  // Tagline (68-78)
  const taglineOpacity = interpolate(frame, [68, 76], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Fade to black (100-120)
  const fadeToBlack = interpolate(frame, [100, DURATION], [0, 1], {
    extrapolateLeft: "clamp",
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
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.violet}22, ${C.cyan}12, transparent 70%)`,
          filter: "blur(50px)",
          opacity: shieldOpacity,
        }}
      />

      {/* Collapsing particles */}
      {[0, 90, 180, 270].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const dist = 170 * collapseScale;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 400 + dist * Math.cos(rad) - 7,
              top: 400 + dist * Math.sin(rad) - 7,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: [C.violet, C.red, C.cyan, C.purple][i],
              opacity: collapseOpacity,
              boxShadow: `0 0 12px ${[C.violet, C.red, C.cyan, C.purple][i]}`,
            }}
          />
        );
      })}

      {/* Shield */}
      <div
        style={{
          opacity: shieldOpacity,
          transform: `scale(${shieldScale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        <div
          style={{
            width: 160,
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img
            src={staticFile("icons/vanna-white.png")}
            style={{ height: 70, objectFit: "contain" }}
          />
        </div>

        {/* Heading */}
        <div
          style={{
            opacity: headingOpacity,
            transform: `translateY(${headingY}px)`,
            textAlign: "center" as const,
          }}
        >
          <span
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: C.text,
              letterSpacing: -0.5,
            }}
          >
            Leverage, Without Getting Liquidated
          </span>
        </div>

        {/* Subheading */}
        {/* <div
          style={{
            opacity: subheadingOpacity,
            transform: `translateY(${subheadingY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: C.textSecondary,
              letterSpacing: 0.5,
            }}
          >
            Without Getting Liquidated
          </span>
          <span
            style={{ opacity: checkBadgeOpacity, fontSize: 26, color: C.cyan }}
          >
            &#x2713;
          </span>
        </div> */}

        <span
          style={{
            opacity: taglineOpacity,
            fontSize: 17,
            fontWeight: 500,
            color: C.textMuted,
            letterSpacing: 2.5,
          }}
        >
          Composable Credit Infrastructure
        </span>
      </div>

      {/* Fade to black */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: C.bg,
          opacity: fadeToBlack,
          pointerEvents: "none" as const,
        }}
      />
    </AbsoluteFill>
  );
};
