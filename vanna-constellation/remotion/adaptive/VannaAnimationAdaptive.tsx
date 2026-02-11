import { AbsoluteFill, Sequence } from "remotion";
import { BorrowScene } from "./BorrowScene";
import { ComposabilityScene } from "./ComposabilityScene";
import { HedgeScene } from "./HedgeScene";
import { ProfitScene } from "./ProfitScene";
import { FlywheelScene } from "./FlywheelScene";
import { FinaleScene } from "./FinaleScene";
import { FONT_IMPORT } from "./colors";

/**
 * Vanna Protocol Animation — Adaptive (light + dark theme)
 *
 * Deep indigo background, larger fonts, bigger flywheel.
 * 800×800 | 30 fps | 29 s (870 frames)
 */

export const VannaAnimationAdaptive: React.FC = () => {
  return (
    <AbsoluteFill>
      <style>{`@import url('${FONT_IMPORT}');`}</style>

      <Sequence from={0} durationInFrames={120} name="Borrow">
        <BorrowScene />
      </Sequence>

      <Sequence from={120} durationInFrames={180} name="Composability">
        <ComposabilityScene />
      </Sequence>

      <Sequence from={300} durationInFrames={150} name="Hedge">
        <HedgeScene />
      </Sequence>

      <Sequence from={450} durationInFrames={150} name="Profit">
        <ProfitScene />
      </Sequence>

      <Sequence from={600} durationInFrames={150} name="Flywheel">
        <FlywheelScene />
      </Sequence>

      <Sequence from={750} durationInFrames={120} name="Finale">
        <FinaleScene />
      </Sequence>
    </AbsoluteFill>
  );
};
