/* ============================================================
   VAGGO · ui/Corridor.js
   "Corredor" de cartões em 3D do topo da página inicial.

   Dois trilhos de cartões vêm do fundo da tela em direção a quem
   olha. A perspectiva faz o trabalho: conforme o cartão avança
   (eixo z), ele cresce E se afasta do centro ao mesmo tempo.

   Adaptado para JavaScript puro a partir de um componente React
   ("image stream hero"). Três cuidados do original foram mantidos:
     1. a profundidade cresce em proporção constante (geométrica),
        para os cartões vizinhos nunca se separarem;
     2. os trilhos abrem rápido no começo e depois seguram (fan);
     3. o cartão nasce do outro lado do eixo e some já fora da tela,
        então nenhum "pulo" aparece.

   Todas as medidas usam a variável CSS --u (uma fração da largura
   do painel), por isso o corredor se ajusta a qualquer tela.
   ============================================================ */

class Corridor {
  static PATH = Object.freeze({
    perspective: 30,   // força da perspectiva
    cardWidth: 18,
    cardHeight: 25,
    birthHeight: 2.6,  // altura aparente quando o cartão nasce
    exitHeight: 46,    // altura aparente quando sai da tela
    railBirth: -11,    // negativo: nasce do outro lado do eixo
    railExit: 44,
    fan: 3.3,          // > 1: abre cedo e depois segura
    turnBirth: 6,      // giro (graus) no nascimento
    turnExit: 28,      // giro na saída
    stops: 24,         // pontos usados para desenhar a curva
  });

  static CARDS = 9;    // cartões por trilho
  static SPEED = 22;   // segundos para um cartão atravessar o corredor

  static #unit(value) {
    return `calc(var(--u) * ${value.toFixed(2)})`;
  }

  /** Amostra a curva e devolve os @keyframes de um trilho (dir: 1 direita, -1 esquerda). */
  static #keyframes(dir, name) {
    const p = Corridor.PATH;
    const steps = [];
    for (let s = 0; s <= p.stops; s += 1) {
      const u = s / p.stops;
      const scale = (p.birthHeight / p.cardHeight) * Math.pow(p.exitHeight / p.birthHeight, u);
      const z = p.perspective * (1 - 1 / scale);
      const rail = p.railExit - (p.railExit - p.railBirth) * Math.pow(1 - u, p.fan);
      const turn = p.turnBirth + (p.turnExit - p.turnBirth) * u;
      steps.push(`${(u * 100).toFixed(2)}%{transform:translate3d(${Corridor.#unit(dir * rail)},0,${Corridor.#unit(z)}) rotateY(${(-dir * turn).toFixed(2)}deg)}`);
    }
    return `@keyframes ${name}{${steps.join('')}}`;
  }

  /**
   * HTML do corredor.
   * @param {(index: number, side: 'right'|'left') => string} face  conteúdo de cada cartão
   */
  static html(face) {
    const css = Corridor.#keyframes(1, 'corridor-right') + Corridor.#keyframes(-1, 'corridor-left');
    const rail = (side) => Array.from({ length: Corridor.CARDS }, (_, i) => {
      // atraso negativo: o corredor já aparece cheio no primeiro quadro
      const delay = -(i * Corridor.SPEED) / Corridor.CARDS;
      return `<div class="ccard" style="animation-name:corridor-${side};animation-delay:${delay.toFixed(2)}s">${face(i, side)}</div>`;
    }).join('');

    return `
      <style>${css}</style>
      <div class="corridor" style="--speed:${Corridor.SPEED}s">
        <div class="corridor__space">${rail('right')}${rail('left')}</div>
      </div>`;
  }
}
