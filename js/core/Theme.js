/* ============================================================
   VAGGO · core/Theme.js
   Tema claro/escuro. A escolha fica salva no navegador e é
   aplicada no <html data-theme="..."> — o CSS faz o resto,
   trocando apenas os valores das variáveis de cor.
   ============================================================ */

class Theme {
  static #STORAGE_KEY = 'vaggo.theme';
  static #META = Object.freeze({ light: '#F5F6FA', dark: '#11141C' });

  static get current() {
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  }

  static get isDark() { return Theme.current === 'dark'; }

  static set(theme) {
    const value = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = value;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', Theme.#META[value]);
    try { window.localStorage.setItem(Theme.#STORAGE_KEY, value); } catch { /* sem armazenamento */ }
    return value;
  }

  static toggle() {
    return Theme.set(Theme.isDark ? 'light' : 'dark');
  }

  /** Lê a escolha salva (o index.html já aplica antes de pintar a página). */
  static restore() {
    let saved = null;
    try { saved = window.localStorage.getItem(Theme.#STORAGE_KEY); } catch { /* ignora */ }
    Theme.set(saved === 'dark' ? 'dark' : 'light');
  }
}
