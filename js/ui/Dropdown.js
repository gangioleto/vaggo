/* ============================================================
   VAGGO · ui/Dropdown.js
   Dropdown estilizado no lugar do <select> nativo.

   O <select> continua na página (escondido): é ele quem guarda o
   valor e participa dos formulários, então o resto do sistema não
   muda. Esta classe só desenha um botão e uma lista por cima e
   mantém os dois sincronizados.

   Teclado: Enter/Espaço/setas abrem; setas, Home e End navegam;
   letras pulam para a opção; Enter escolhe; Esc fecha.
   ============================================================ */

class Dropdown {
  static #open = null;         // só um dropdown aberto por vez
  static #counter = 0;
  static #CHEVRON = '<svg class="dd__chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  static #CHECK = '<svg class="dd-opt__check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  #select;
  #button;
  #list = null;
  #active = -1;
  #typed = '';
  #typedAt = 0;
  #onOutside = (event) => {
    if (!this.#list?.contains(event.target) && !this.#button.contains(event.target)) this.close();
  };
  #onMove = (event) => {
    if (this.#list?.contains(event.target)) return; // rolagem dentro da própria lista
    this.#place();
  };

  constructor(select) {
    this.#select = select;
    Dropdown.#counter += 1;
    const uid = `dd-${Dropdown.#counter}`;

    select.dataset.dd = uid;
    select.classList.add('dd-native');
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');

    const label = select.id ? document.querySelector(`label[for="${select.id}"]`) : null;
    if (label && !label.id) label.id = `${uid}-label`;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'dd';
    button.id = `${uid}-btn`;
    button.setAttribute('role', 'combobox');
    button.setAttribute('aria-haspopup', 'listbox');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', `${uid}-list`);
    if (label) button.setAttribute('aria-labelledby', `${label.id} ${button.id}`);
    button.innerHTML = `<span class="dd__value"></span>${Dropdown.#CHEVRON}`;
    select.after(button);
    this.#button = button;
    this.#sync();

    button.addEventListener('click', () => (this.isOpen ? this.close() : this.open()));
    button.addEventListener('keydown', (event) => this.#onKey(event));
    select.addEventListener('change', () => this.#sync());
    // clicar no rótulo leva o foco ao botão, não ao <select> escondido
    label?.addEventListener('click', (event) => { event.preventDefault(); button.focus(); });
  }

  get isOpen() { return this.#list !== null; }
  get #options() { return [...this.#select.options]; }
  get #uid() { return this.#select.dataset.dd; }

  /** Copia para o botão o texto da opção escolhida no <select>. */
  #sync() {
    const option = this.#select.selectedOptions[0];
    this.#button.querySelector('.dd__value').textContent = option ? option.textContent : '';
  }

  open() {
    if (this.isOpen) return;
    Dropdown.#open?.close();
    Dropdown.#open = this;

    const list = document.createElement('ul');
    list.className = 'dd-list';
    list.id = `${this.#uid}-list`;
    list.setAttribute('role', 'listbox');
    list.tabIndex = -1;
    list.innerHTML = this.#options.map((option, index) => `
      <li class="dd-opt" role="option" id="${this.#uid}-opt-${index}" data-index="${index}" aria-selected="${option.selected}">
        <span>${UI.esc(option.textContent)}</span>${Dropdown.#CHECK}
      </li>`).join('');
    list.addEventListener('click', (event) => {
      const item = event.target.closest('.dd-opt');
      if (item) this.#choose(Number(item.dataset.index));
    });
    list.addEventListener('pointermove', (event) => {
      const item = event.target.closest('.dd-opt');
      if (item) this.#setActive(Number(item.dataset.index), false);
    });

    // Dentro de uma janela (dialog) a lista precisa ficar dentro dela para aparecer por cima.
    (this.#button.closest('dialog') ?? document.body).append(list);
    this.#list = list;
    this.#place();
    this.#setActive(Math.max(this.#select.selectedIndex, 0));

    this.#button.setAttribute('aria-expanded', 'true');
    this.#button.classList.add('is-open');
    requestAnimationFrame(() => list.classList.add('is-open')); // dispara a transição de entrada

    document.addEventListener('pointerdown', this.#onOutside, true);
    window.addEventListener('scroll', this.#onMove, true);
    window.addEventListener('resize', this.#onMove);
  }

  close({ focus = false } = {}) {
    if (!this.isOpen) return;
    const list = this.#list;
    this.#list = null;
    this.#active = -1;
    if (Dropdown.#open === this) Dropdown.#open = null;

    this.#button.setAttribute('aria-expanded', 'false');
    this.#button.removeAttribute('aria-activedescendant');
    this.#button.classList.remove('is-open');
    document.removeEventListener('pointerdown', this.#onOutside, true);
    window.removeEventListener('scroll', this.#onMove, true);
    window.removeEventListener('resize', this.#onMove);

    list.classList.remove('is-open'); // transição de saída, depois remove
    setTimeout(() => list.remove(), 140);
    if (focus) this.#button.focus({ preventScroll: true });
  }

  /** Posiciona a lista junto ao botão; abre para cima se faltar espaço embaixo. */
  #place() {
    const list = this.#list;
    if (!list || !this.#button.isConnected) { this.close(); return; }
    const rect = this.#button.getBoundingClientRect();
    const viewportW = document.documentElement.clientWidth;
    const viewportH = window.innerHeight;
    if (rect.bottom < 0 || rect.top > viewportH) { this.close(); return; }

    // no celular a barra de abas fixa ocupa a base da tela
    const nav = document.getElementById('nav');
    const navH = nav && getComputedStyle(nav).position === 'fixed' ? nav.offsetHeight : 0;
    const gap = 6;
    const below = viewportH - navH - rect.bottom - gap - 10;
    const above = rect.top - gap - 10;
    const wanted = Math.min(list.scrollHeight, 336);
    const up = below < Math.min(wanted, 180) && above > below;

    const width = Math.max(rect.width, 250);
    const left = Math.min(Math.max(rect.left, 8), viewportW - width - 8);
    list.style.width = `${width}px`;
    list.style.left = `${left}px`;
    list.style.maxHeight = `${Math.max(Math.min(336, up ? above : below), 120)}px`;
    list.style.top = up ? 'auto' : `${rect.bottom + gap}px`;
    list.style.bottom = up ? `${viewportH - rect.top + gap}px` : 'auto';
    list.classList.toggle('dd-list--up', up);
  }

  #setActive(index, scroll = true) {
    if (!this.#list) return;
    const items = this.#list.children;
    const next = Math.min(Math.max(index, 0), items.length - 1);
    items[this.#active]?.classList.remove('is-active');
    this.#active = next;
    const item = items[next];
    if (!item) return;
    item.classList.add('is-active');
    this.#button.setAttribute('aria-activedescendant', item.id);
    if (scroll) item.scrollIntoView({ block: 'nearest' });
  }

  #choose(index) {
    const changed = this.#select.selectedIndex !== index;
    this.#select.selectedIndex = index;
    this.#sync();
    this.close({ focus: true });
    if (changed) {
      // avisa o resto do app exatamente como um <select> nativo faria
      this.#select.dispatchEvent(new Event('input', { bubbles: true }));
      this.#select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  #onKey(event) {
    const { key } = event;
    if (!this.isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) { event.preventDefault(); this.open(); }
      return;
    }
    const last = this.#options.length - 1;
    const moves = { ArrowDown: this.#active + 1, ArrowUp: this.#active - 1, Home: 0, End: last };
    if (key in moves) { event.preventDefault(); this.#setActive(moves[key]); return; }
    if (key === 'Enter' || key === ' ') { event.preventDefault(); this.#choose(this.#active); return; }
    if (key === 'Escape') { event.preventDefault(); event.stopPropagation(); this.close({ focus: true }); return; }
    if (key === 'Tab') { this.close(); return; }
    if (key.length === 1) this.#typeAhead(key);
  }

  /** Digitar letras pula para a primeira opção que começa com elas. */
  #typeAhead(char) {
    const now = Date.now();
    this.#typed = now - this.#typedAt > 600 ? char : this.#typed + char;
    this.#typedAt = now;
    const wanted = Job.normalize(this.#typed);
    const index = this.#options.findIndex((option) => Job.normalize(option.textContent).startsWith(wanted));
    if (index >= 0) this.#setActive(index);
  }

  // ---------- ligação com a página ----------
  /** Transforma todos os <select> ainda nativos dentro de root. */
  static enhance(root = document) {
    root.querySelectorAll('select:not([data-dd])').forEach((select) => new Dropdown(select));
  }

  /** Observa a página: telas e janelas novas ganham o dropdown sozinhas. */
  static watch() {
    Dropdown.enhance();
    let queued = false;
    new MutationObserver(() => {
      if (queued) return;
      queued = true;
      queueMicrotask(() => {
        queued = false;
        if (Dropdown.#open && !Dropdown.#open.#button.isConnected) Dropdown.#open.close();
        Dropdown.enhance();
      });
    }).observe(document.body, { childList: true, subtree: true });
  }
}
