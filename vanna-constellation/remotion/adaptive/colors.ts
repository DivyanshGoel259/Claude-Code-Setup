/** Adaptive color palette – works against both light & dark host themes.
 *  Uses a deep indigo-violet background so the video looks like an
 *  intentional branded element rather than a "dark box".
 */

export const C = {
  // Backgrounds
  bg: "#151030",
  surface: "#1E1845",
  surfaceLight: "#2A2460",
  border: "rgba(255,255,255,0.14)",

  // Brand
  violet: "#8B5CF6",
  red: "#FF6B6B",
  cyan: "#34D8D8",
  green: "#34D399",
  pink: "#F472B6",
  purple: "#A78BFA",

  // Text – slightly brighter than dark-only version
  text: "#FFFFFF",
  textMuted: "rgba(255,255,255,0.55)",
  textSecondary: "rgba(255,255,255,0.82)",
};

export const FONT =
  "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif";

export const FONT_IMPORT =
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
