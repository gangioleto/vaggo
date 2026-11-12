/* ============================================================
   VAGGO · ui/UI.js
   Utilitários estáticos de interface: ícones, formatação,
   janela modal, avisos (toasts) e pedaços de HTML reutilizados.
   ============================================================ */

class UI {
  static #ICONS = Object.freeze({
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 019.5 4a7 7 0 1010.5 10.5z"/>',
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    sparkle: '<path d="M11 3l1.9 5.1L18 10l-5.1 1.9L11 17l-1.9-5.1L4 10l5.1-1.9z"/><path d="M18.5 15.5v5M16 18h5"/>',
    baby: '<circle cx="12" cy="12.5" r="7.5"/><path d="M9 14.5c.8 1 1.8 1.5 3 1.5s2.2-.5 3-1.5"/><path d="M9.5 11h.01M14.5 11h.01"/><path d="M12 5c-1.2.2-1.8 1.2-1.3 2.2"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z"/>',
    chef: '<path d="M7 14h10v5.5H7z"/><path d="M7 14a4 4 0 01-.5-7.9 4.5 4.5 0 0111 0A4 4 0 0117 14"/>',
    leaf: '<path d="M5 19C5 11 10 6 19 5c0 9-5 14-13 14"/><path d="M5 19c3-5 6-8 10-10"/>',
    car: '<path d="M4 16v-3l2-5h12l2 5v3"/><path d="M3 16h18v2.5H3z"/><path d="M7 13h.01M17 13h.01"/>',
    shirt: '<path d="M8 4L3 7l2 4 2-1v10h10V10l2 1 2-4-5-3a4 4 0 01-8 0z"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    wallet: '<path d="M4 7h15a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1z"/><path d="M4 7V6a1 1 0 011-1h11"/><path d="M16 13h.01"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    user: '<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20a7.5 7.5 0 0115 0"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 19a6 6 0 0112 0"/><path d="M16 5.2a3.2 3.2 0 010 5.6M17.5 14.2A6 6 0 0121 19"/>',
    briefcase: '<rect x="3.5" y="7.5" width="17" height="12" rx="2"/><path d="M9 7.5v-2h6v2"/><path d="M3.5 13h17"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    logout: '<path d="M10 4H5v16h5"/><path d="M14 8l4 4-4 4M18 12H9"/>',
    shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
    branch: '<circle cx="12" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/><path d="M12 7v5M6 17v-2a3 3 0 013-3h6a3 3 0 013 3v2"/>',
    shapes: '<circle cx="7.5" cy="16.5" r="3.5"/><rect x="13" y="13" width="7" height="7" rx="1"/><path d="M12 3l4 7H8z"/>',
    cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
    send: '<path d="M20 4L3 11l7 3 3 7z"/><path d="M20 4L10 14"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
    phone: '<path d="M6 3h4l1.5 5-2.5 1.5a11 11 0 005.5 5.5L16 12.5l5 1.5v4a2 2 0 01-2 2A16 16 0 014 5a2 2 0 012-2z"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    refresh: '<path d="M20 11a8 8 0 10-2.3 6"/><path d="M20 5v6h-6"/>',
  });

  static #lang = 'pt';
  static setLang(lang) { UI.#lang = lang; }

  /** Escapa texto do usuário antes de colocar no HTML (evita XSS). */
  static esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (ch) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
    ));
  }

  static icon(name, size = 20) {
    const body = UI.#ICONS[name] ?? '';
    return `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }

  /** Logo completa nas duas versões; o CSS mostra a do tema atual. */
  static logo(className, width, height) {
    return `<img class="logo-l ${className}" src="assets/logo-full.png" alt="VAGGO" width="${width}" height="${height}">`
      + `<img class="logo-d ${className}" src="assets/logo-full-white.png" alt="VAGGO" width="${width}" height="${height}">`;
  }

  /** Escolhe o texto no idioma atual: aceita string ou { pt, en }. */
  static pick(value) {
    if (value && typeof value === 'object') return value[UI.#lang] ?? value.pt ?? '';
    return value ?? '';
  }

  static money(amount, periodId) {
    const locale = UI.#lang === 'pt' ? 'pt-BR' : 'en-US';
    const value = new Intl.NumberFormat(locale, {
      style: 'currency', currency: 'BRL', maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
    const period = Enums.byId(PayPeriod, periodId);
    return period ? `${value}/${period[UI.#lang]}` : value;
  }

  /** "há 3 dias" / "3 days ago" */
  static ago(timestamp) {
    const locale = UI.#lang === 'pt' ? 'pt-BR' : 'en';
    const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    const minutes = Math.round((timestamp - Date.now()) / 60000);
    if (Math.abs(minutes) < 1) return UI.#lang === 'pt' ? 'agora mesmo' : 'just now';
    if (Math.abs(minutes) < 60) return formatter.format(minutes, 'minute');
    const hours = Math.round(minutes / 60);
    if (Math.abs(hours) < 24) return formatter.format(hours, 'hour');
    return formatter.format(Math.round(hours / 24), 'day');
  }

  static avatar(user, size = 'md') {
    const file = Portrait.fileFor(user.id);
    if (file) {
      return `<span class="avatar avatar--${size} avatar--photo" style="background:${Portrait.bgFor(user.id)}" aria-hidden="true"><img src="${file}" alt="" width="704" height="704" loading="lazy"></span>`;
    }
    const tone = user.role === 'employer' ? 'ink' : 'blue';
    return `<span class="avatar avatar--${size} avatar--${tone}" aria-hidden="true">${UI.esc(user.initials)}</span>`;
  }

  static pill(enumItem) {
    return `<span class="pill pill--${enumItem.tone}">${UI.esc(enumItem[UI.#lang])}</span>`;
  }

  static categoryChip(categoryId) {
    const cat = Enums.byId(Category, categoryId);
    return `<span class="chip">${UI.icon(cat.icon, 15)}${UI.esc(cat[UI.#lang])}</span>`;
  }

  /** Anel de compatibilidade (SVG). */
  static matchRing(score, size = 52) {
    if (!score) return '';
    const r = 20;
    const circ = 2 * Math.PI * r;
    const offset = circ * (1 - score.total / 100);
    return `<span class="ring ring--${score.level}" style="--size:${size}px" title="Match ${score.total}%">
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle class="ring__track" cx="24" cy="24" r="${r}" fill="none" stroke-width="5"/>
        <circle class="ring__bar" cx="24" cy="24" r="${r}" fill="none" stroke-width="5" stroke-linecap="round"
          stroke-dasharray="${circ.toFixed(1)}" style="--offset:${offset.toFixed(1)};--circ:${circ.toFixed(1)}" transform="rotate(-90 24 24)"/>
      </svg>
      <b>${score.total}<small>%</small></b>
    </span>`;
  }

  // ---------- campos de formulário ----------
  static field({ id, name, label, type = 'text', value = '', required = true, placeholder = '', hint = '', attrs = '' }) {
    const control = type === 'textarea'
      ? `<textarea id="${id}" name="${name}" rows="4" placeholder="${UI.esc(placeholder)}" ${required ? 'required' : ''} ${attrs}>${UI.esc(value)}</textarea>`
      : `<input id="${id}" name="${name}" type="${type}" value="${UI.esc(value)}" placeholder="${UI.esc(placeholder)}" ${required ? 'required' : ''} ${attrs}>`;
    return `<div class="field"><label for="${id}">${UI.esc(label)}</label>${control}${hint ? `<small>${UI.esc(hint)}</small>` : ''}</div>`;
  }

  static select({ id, name, label, options, value = '', empty = null, attrs = '' }) {
    const opts = (empty !== null ? [`<option value="">${UI.esc(empty)}</option>`] : [])
      .concat(options.map((o) => `<option value="${UI.esc(o.value)}" ${o.value === value ? 'selected' : ''}>${UI.esc(o.label)}</option>`));
    return `<div class="field">${label ? `<label for="${id}">${UI.esc(label)}</label>` : ''}<select id="${id}" name="${name}" ${attrs}>${opts.join('')}</select></div>`;
  }

  static checks({ name, legend, options, values = [] }) {
    return `<fieldset class="checks"><legend>${UI.esc(legend)}</legend><div class="checks__list">${options.map((o, i) => `
      <label class="check"><input type="checkbox" id="${name}-${i}" name="${name}" value="${UI.esc(o.value)}" ${values.includes(o.value) ? 'checked' : ''}><span>${UI.esc(o.label)}</span></label>`).join('')}</div></fieldset>`;
  }

  static enumOptions(enumObject) {
    return Enums.list(enumObject).map((item) => ({ value: item.id, label: item[UI.#lang] }));
  }

  static cityOptions() {
    return City.map((city) => ({ value: city, label: city }));
  }

  // ---------- modal ----------
  static get #dialog() { return document.getElementById('modal'); }

  static openModal(html, { wide = false } = {}) {
    const dialog = UI.#dialog;
    dialog.classList.toggle('modal--wide', wide);
    dialog.innerHTML = `<button class="modal__close" data-action="closeModal" aria-label="Fechar / Close">${UI.icon('x', 20)}</button>${html}`;
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
  }

  static closeModal() {
    const dialog = UI.#dialog;
    if (dialog.open) dialog.close();
  }

  static get modalOpen() { return UI.#dialog.open; }

  // ---------- toast ----------
  static toast(message, tone = 'ok') {
    const host = document.getElementById('toasts');
    const el = document.createElement('div');
    el.className = `toast toast--${tone}`;
    el.innerHTML = `${UI.icon(tone === 'bad' ? 'x' : 'check', 18)}<span>${UI.esc(message)}</span>`;
    host.append(el);
    requestAnimationFrame(() => el.classList.add('is-in'));
    setTimeout(() => {
      el.classList.remove('is-in');
      setTimeout(() => el.remove(), 260);
    }, 3200);
  }

  /** Mostra a mensagem de erro dentro do formulário. */
  static formError(form, message) {
    let box = form.querySelector('.form-error');
    if (!box) {
      box = document.createElement('p');
      box.className = 'form-error';
      box.setAttribute('role', 'alert');
      form.prepend(box);
    }
    box.textContent = message;
  }
}
