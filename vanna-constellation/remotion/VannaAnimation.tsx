import { AbsoluteFill, Sequence } from "remotion";
import { BorrowScene } from "./scenes/BorrowScene";
import { ComposabilityScene } from "./scenes/ComposabilityScene";
import { HedgeScene } from "./scenes/HedgeScene";
import { ProfitScene } from "./scenes/ProfitScene";
import { FlywheelScene } from "./scenes/FlywheelScene";
import { FinaleScene } from "./scenes/FinaleScene";
import { FONT_IMPORT } from "./colors";

/**
 * Vanna Protocol Animation
 * "Leverage Anything & Anywhere without getting liquidated"
 *
 * 800x800 | 30fps | 29 seconds (870 frames)
 *
 * Scene 1: Borrow      0-120    (0-4s)    $1K → $10K leverage
 * Scene 2: Compose      120-300  (4-10s)   Split into 3 strategies
 * Scene 3: Hedge        300-450  (10-15s)  Long + Short = Zero Risk
 * Scene 4: Profit       450-600  (15-20s)  Profit breakdown
 * Scene 5: Flywheel     600-750  (20-25s)  Protocol flywheel
 * Scene 6: Finale       750-870  (25-29s)  Shield + Brand
 */

export const VannaAnimation: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Google Fonts */}
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
