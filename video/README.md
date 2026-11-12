# VAGGO · animação do topo (Remotion)

Código-fonte do vídeo exibido na página inicial (`assets/video/hero-pt.mp4` e `hero-en.mp4`).

```bash
npm install
npx remotion studio                # pré-visualizar e editar
npx remotion render HeroPT ../assets/video/hero-pt.mp4 --scale=0.75
npx remotion render HeroEN ../assets/video/hero-en.mp4 --scale=0.75
```

A animação fica em `src/Composition.tsx`: 240 quadros a 30 fps (8 s), em loop.
