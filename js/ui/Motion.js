/* ============================================================
   VAGGO · ui/Motion.js — animações da interface
   Regras seguidas:
     - só transform e opacity (não mexe em layout);
     - curvas "ease-out" fortes, definidas no CSS (--ease-out);
     - o conteúdo nunca depende da animação para aparecer;
     - prefers-reduced-motion desliga os movimentos.
   ============================================================ */

class Motion {
  static #observer = null;
  static #counted = new WeakSet();

  static get reduced() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  static #ensureObserver() {
    if (Motion.#observer || !('IntersectionObserver' in window)) return;
    Motion.#observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        Motion.#observer.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  }

  /**
   * Revela os elementos .reveal quando entram na tela, em sequência
   * (cada irmão espera 60 ms a mais que o anterior).
   * instant = true mostra tudo sem animar (usado em re-renderizações).
   */
  static reveal(root, { instant = false } = {}) {
    Motion.#ensureObserver();
    const items = root.querySelectorAll('.reveal:not(.is-in)');
    const order = new Map();
    for (const el of items) {
      if (instant || Motion.reduced || !Motion.#observer) {
        el.classList.add('is-in', 'no-anim');
        continue;
      }
      const index = order.get(el.parentElement) ?? 0;
      order.set(el.parentElement, index + 1);
      el.style.setProperty('--i', Math.min(index, 6));
      Motion.#observer.observe(el);
    }
  }

  /** Conta de 0 até o número final (uma vez por elemento). */
  static countUp(root) {
    if (Motion.reduced) return;
    for (const el of root.querySelectorAll('[data-count]')) {
      if (Motion.#counted.has(el)) continue;
      Motion.#counted.add(el);
      const target = Number(el.dataset.count);
      if (!Number.isFinite(target) || target <= 0) continue;
      const duration = 900;
      const start = performance.now() + 450; // espera o texto do topo entrar
      const tick = (now) => {
        const p = Math.min(Math.max((now - start) / duration, 0), 1);
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      el.textContent = '0';
      requestAnimationFrame(tick);
    }
  }

  /** Sombra no cabeçalho depois que a página rola. */
  static watchHeader(header) {
    const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /** O vídeo do topo só toca enquanto está visível. */
  static watchVideo(root) {
    const video = root.querySelector('video.film__video');
    if (!video) return;
    if (Motion.reduced) {
      video.removeAttribute('autoplay');
      video.pause();
      video.controls = true;
      return;
    }
    if (!('IntersectionObserver' in window)) return;
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.2 }).observe(video);
  }
}
