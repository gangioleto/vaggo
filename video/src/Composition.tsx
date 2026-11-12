import { loadFont } from "@remotion/fonts";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

loadFont({ family: "Outfit", url: staticFile("outfit.woff2"), weight: "100 900" });
loadFont({ family: "DM Sans", url: staticFile("dm-sans.woff2"), weight: "100 1000" });

// Paleta da marca VAGGO
const BLUE = "#3A49F8";
const INK = "#1E2432";
const OFF = "#F5F6FA";

const COPY = {
  pt: {
    employer: "CONTRATANTE",
    professional: "PROFISSIONAL",
    family: "Família Andrade",
    seeks: "procura Babá",
    pro: "Maria Aparecida",
    proLine: "Babá · 8 anos de experiência",
    chips: ["Babá", "Jundiaí", "Mensalista"],
    match: "COMPATIBILIDADE",
    accepted: "Candidatura aceita",
  },
  en: {
    employer: "EMPLOYER",
    professional: "PROFESSIONAL",
    family: "Andrade Family",
    seeks: "is looking for a Nanny",
    pro: "Maria Aparecida",
    proLine: "Nanny · 8 years of experience",
    chips: ["Nanny", "Jundiaí", "Full-time"],
    match: "MATCH SCORE",
    accepted: "Application accepted",
  },
};

const ease = Easing.bezier(0.23, 1, 0.32, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Card: React.FC<{
  frame: number;
  start: number;
  fromX: number;
  left: number;
  label: string;
  initials: string;
  title: string;
  line: string;
  chips: string[];
}> = ({ frame, start, fromX, left, label, initials, title, line, chips }) => {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top: 400,
        width: 430,
        height: 250,
        borderRadius: 28,
        background: OFF,
        padding: 30,
        boxSizing: "border-box",
        boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
        opacity: interpolate(frame, [start, start + 18], [0, 1], clamp),
        translate: interpolate(frame, [start, start + 30], [`${fromX}px 0px`, "0px 0px"], {
          ...clamp,
          easing: ease,
        }),
      }}
    >
      <div
        style={{
          fontFamily: "DM Sans",
          fontWeight: 700,
          fontSize: 17,
          letterSpacing: 3,
          color: BLUE,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 20 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            background: INK,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Outfit",
            fontWeight: 600,
            fontSize: 28,
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div>
          <div style={{ fontFamily: "Outfit", fontWeight: 600, fontSize: 31, color: INK, lineHeight: 1.1 }}>
            {title}
          </div>
          <div style={{ fontFamily: "DM Sans", fontSize: 20, color: "#4A5166", marginTop: 6 }}>{line}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        {chips.map((chip, i) => (
          <div
            key={chip}
            style={{
              fontFamily: "DM Sans",
              fontWeight: 600,
              fontSize: 18,
              color: BLUE,
              background: "#E4E7FF",
              padding: "8px 16px",
              borderRadius: 999,
              opacity: interpolate(frame, [start + 16 + i * 4, start + 30 + i * 4], [0, 1], clamp),
            }}
          >
            {chip}
          </div>
        ))}
      </div>
    </div>
  );
};

export const VaggoHero: React.FC<{ lang: "pt" | "en" }> = ({ lang }) => {
  const frame = useCurrentFrame();
  const t = COPY[lang];

  // Anel de compatibilidade
  const R = 92;
  const CIRC = 2 * Math.PI * R;
  const progress = interpolate(frame, [138, 184], [0, 1], { ...clamp, easing: Easing.bezier(0.77, 0, 0.175, 1) });
  // Linhas que ligam os dois cartões ao anel
  const LINK = 260;
  const linkDraw = interpolate(frame, [104, 138], [LINK, 0], { ...clamp, easing: ease });

  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      {/* brilho azul de fundo */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 78%, rgba(58,73,248,0.38), rgba(58,73,248,0) 55%)`,
          opacity: interpolate(frame, [90, 150, 214, 236], [0, 1, 1, 0], clamp),
        }}
      />

      <AbsoluteFill
        style={{
          opacity: interpolate(frame, [214, 236], [1, 0], clamp),
        }}
      >
        {/* Símbolo: o V entra, a órbita azul é desenhada, depois sobe */}
        <div
          style={{
            position: "absolute",
            left: 540 - 277 / 2,
            top: 540 - 219 / 2,
            width: 277,
            height: 219,
            translate: interpolate(frame, [48, 80], ["0px 0px", "0px -360px"], {
              ...clamp,
              easing: Easing.bezier(0.77, 0, 0.175, 1),
            }),
            scale: interpolate(frame, [0, 26, 48, 80], [1.9, 2.2, 2.2, 0.95], {
              ...clamp,
              easing: [ease, Easing.linear, Easing.bezier(0.77, 0, 0.175, 1)],
            }),
          }}
        >
          <Img
            src={staticFile("v-white.png")}
            style={{
              position: "absolute",
              inset: 0,
              opacity: interpolate(frame, [0, 16], [0, 1], clamp),
            }}
          />
          <Img
            src={staticFile("swoosh.png")}
            style={{
              position: "absolute",
              inset: 0,
              clipPath: `inset(0 ${interpolate(frame, [12, 44], [100, 0], { ...clamp, easing: ease })}% 0 0)`,
            }}
          />
        </div>

        <Card
          frame={frame}
          start={62}
          fromX={-120}
          left={80}
          label={t.employer}
          initials="FA"
          title={t.family}
          line={t.seeks}
          chips={t.chips}
        />
        <Card
          frame={frame}
          start={74}
          fromX={120}
          left={570}
          label={t.professional}
          initials="MA"
          title={t.pro}
          line={t.proLine}
          chips={t.chips}
        />

        {/* Ligação entre os cartões e o anel */}
        <svg width={1080} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path
            d="M 295 650 C 295 790, 380 820, 448 820"
            fill="none"
            stroke={BLUE}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={LINK}
            strokeDashoffset={linkDraw}
          />
          <path
            d="M 785 650 C 785 790, 700 820, 632 820"
            fill="none"
            stroke={BLUE}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={LINK}
            strokeDashoffset={linkDraw}
          />
          <g opacity={interpolate(frame, [126, 140], [0, 1], clamp)}>
            <circle cx={540} cy={820} r={R} fill={INK} stroke="rgba(255,255,255,0.14)" strokeWidth={14} />
            <circle
              cx={540}
              cy={820}
              r={R}
              fill="none"
              stroke={BLUE}
              strokeWidth={14}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - progress)}
              transform="rotate(-90 540 820)"
            />
          </g>
        </svg>

        <div
          style={{
            position: "absolute",
            left: 440,
            top: 776,
            width: 200,
            textAlign: "center",
            fontFamily: "Outfit",
            fontWeight: 600,
            fontSize: 62,
            color: "white",
            fontVariantNumeric: "tabular-nums",
            opacity: interpolate(frame, [130, 142], [0, 1], clamp),
          }}
        >
          {Math.round(progress * 100)}
          <span style={{ fontSize: 30, color: "rgba(255,255,255,0.7)" }}>%</span>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 940,
            textAlign: "center",
            fontFamily: "DM Sans",
            fontWeight: 700,
            fontSize: 17,
            letterSpacing: 4,
            color: "rgba(255,255,255,0.6)",
            opacity: interpolate(frame, [140, 156], [0, 1], clamp),
          }}
        >
          {t.match}
        </div>

        {/* Selo final */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 986,
            display: "flex",
            justifyContent: "center",
            opacity: interpolate(frame, [186, 198], [0, 1], clamp),
            scale: interpolate(frame, [186, 204], [0.94, 1], { ...clamp, easing: ease }),
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "white",
              color: INK,
              fontFamily: "Outfit",
              fontWeight: 600,
              fontSize: 26,
              padding: "12px 26px 12px 14px",
              borderRadius: 999,
            }}
          >
            <svg width={36} height={36} viewBox="0 0 36 36">
              <circle cx={18} cy={18} r={18} fill="#12805C" />
              <path d="M10 18.5l5.5 5.5L26 13" fill="none" stroke="white" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t.accepted}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
