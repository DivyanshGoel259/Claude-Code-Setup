import { registerRoot, Composition, Folder } from "remotion";
import { VannaAnimation } from "./VannaAnimation";
import { VannaAnimationAdaptive } from "./adaptive/VannaAnimationAdaptive";

const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Existing hero animations */}
      <Folder name="Hero-Animations">
        <Composition
          id="VannaAnimation"
          component={VannaAnimation}
          durationInFrames={870}
          fps={30}
          width={800}
          height={800}
        />
        <Composition
          id="VannaAnimationAdaptive"
          component={VannaAnimationAdaptive}
          durationInFrames={870}
          fps={30}
          width={800}
          height={800}
        />
      </Folder>
    </>
  );
};

registerRoot(RemotionRoot);
