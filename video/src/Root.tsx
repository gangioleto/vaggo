import { Composition } from "remotion";
import { VaggoHero } from "./Composition";

// Uma composição por idioma: o site troca o vídeo junto com o texto.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HeroPT"
        component={VaggoHero}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{ lang: "pt" as const }}
      />
      <Composition
        id="HeroEN"
        component={VaggoHero}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{ lang: "en" as const }}
      />
    </>
  );
};
