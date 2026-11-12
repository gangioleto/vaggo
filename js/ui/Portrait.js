/* ============================================================
   VAGGO · ui/Portrait.js
   Retratos ilustrados das pessoas da plataforma.
   As pessoas de demonstração usam desenhos feitos à mão da
   coleção Open Peeps (Pablo Stanley, licença CC0), guardados em
   assets/people. Qualquer outro usuário recebe um retrato simples
   montado a partir de um "visual" (Look) calculado pelo id:
   tom de pele, cabelo, roupa e cor de fundo.
   ============================================================ */

class Portrait {
  static #SKIN = Object.freeze(['#F4D3B8', '#E2B08A', '#C58A62', '#9A6646', '#6F452E']);
  static #HAIR = Object.freeze(['#1F1714', '#3B2A22', '#6A4630', '#A9A39C', '#C98B4E']);
  static #SHIRT = Object.freeze(['#3A49F8', '#1E2432', '#FFFFFF', '#F2A65A', '#2F8F6B']);
  static #BG = Object.freeze(['#DDE1FF', '#FFE6C7', '#D6F0E4', '#FBDDE0', '#E9E2FF']);
  static #STYLES = Object.freeze(['bun', 'long', 'short', 'curly', 'beard']);

  // skin, hair, style, shirt, bg — índices das listas acima
  static #LOOKS = Object.freeze({
    usr_maria:       { skin: 2, hair: 0, style: 'bun',   shirt: 0, bg: 1 },
    usr_joana:       { skin: 3, hair: 0, style: 'curly', shirt: 2, bg: 2 },
    usr_sebastiao:   { skin: 1, hair: 3, style: 'beard', shirt: 4, bg: 0 },
    usr_luciana:     { skin: 0, hair: 2, style: 'long',  shirt: 0, bg: 3 },
    usr_rosangela:   { skin: 4, hair: 3, style: 'bun',   shirt: 3, bg: 4 },
    usr_carlos:      { skin: 2, hair: 1, style: 'short', shirt: 1, bg: 2 },
    usr_bruna:       { skin: 1, hair: 4, style: 'long',  shirt: 2, bg: 0 },
    usr_andrade:     { skin: 1, hair: 1, style: 'short', shirt: 2, bg: 4 },
    usr_helena:      { skin: 0, hair: 3, style: 'curly', shirt: 1, bg: 1 },
    usr_residencial: { skin: 3, hair: 0, style: 'beard', shirt: 0, bg: 3 },
  });

  // Desenhos prontos (assets/people/<arquivo>.svg)
  static #FILES = Object.freeze({
    usr_maria: 'maria', usr_joana: 'joana', usr_sebastiao: 'sebastiao', usr_luciana: 'luciana',
    usr_rosangela: 'rosangela', usr_carlos: 'carlos', usr_bruna: 'bruna',
    usr_andrade: 'andrade', usr_helena: 'helena',
  });

  /** Caminho do desenho pronto da pessoa, ou null se ela não tiver um. */
  static fileFor(id) {
    const file = Portrait.#FILES[id];
    return file ? `assets/people/${file}.svg` : null;
  }

  /** Visual da pessoa: o definido, ou um calculado pelo id (sempre o mesmo). */
  static lookFor(id) {
    if (Portrait.#LOOKS[id]) return Portrait.#LOOKS[id];
    let h = 7;
    for (const ch of String(id)) h = (h * 31 + ch.codePointAt(0)) >>> 0;
    const pick = (list, shift) => (h >>> shift) % list.length;
    return {
      skin: pick(Portrait.#SKIN, 0),
      hair: pick(Portrait.#HAIR, 3),
      style: Portrait.#STYLES[pick(Portrait.#STYLES, 6)],
      shirt: pick(Portrait.#SHIRT, 9),
      bg: pick(Portrait.#BG, 12),
    };
  }

  static bgFor(id) {
    return Portrait.#BG[Portrait.lookFor(id).bg];
  }

  static #hairBack(style, color) {
    if (style === 'long') {
      return `<path fill="${color}" d="M33 58C33 34 46 25 60 25s27 9 27 33v40q0 7-7 7H40q-7 0-7-7z"/>`;
    }
    if (style === 'curly') {
      return `<g fill="${color}"><circle cx="38" cy="52" r="10"/><circle cx="82" cy="52" r="10"/><circle cx="36" cy="66" r="8"/><circle cx="84" cy="66" r="8"/></g>`;
    }
    return '';
  }

  static #hairFront(style, color) {
    const cap = `<path fill="${color}" d="M37 55C35 33 48 27 60 27s25 6 23 28c-3-10-11-16-23-16s-20 6-23 16z"/>`;
    switch (style) {
      case 'bun':
        return `<circle fill="${color}" cx="60" cy="23" r="9"/>${cap}`;
      case 'curly':
        return `<g fill="${color}"><circle cx="43" cy="40" r="10"/><circle cx="53" cy="32" r="11"/><circle cx="66" cy="31" r="11"/><circle cx="77" cy="39" r="10"/></g>`;
      case 'beard':
        return `${cap}<path fill="${color}" d="M39 60c0 22 11 30 21 30s21-8 21-30c-3 11-11 15-21 15s-18-4-21-15z"/>`;
      default:
        return cap; // long e short usam a mesma franja
    }
  }

  /** HTML do retrato. O fundo fica por conta de quem usa (bgFor). */
  static svg(id, { title = '' } = {}) {
    const file = Portrait.fileFor(id);
    if (file) {
      return `<img class="portrait portrait--img" src="${file}" alt="${UI.esc(title)}" width="704" height="704" loading="lazy" decoding="async">`;
    }
    const look = Portrait.lookFor(id);
    const skin = Portrait.#SKIN[look.skin];
    const hair = Portrait.#HAIR[look.hair];
    const shirt = Portrait.#SHIRT[look.shirt];
    const shade = 'rgba(30,36,50,.14)';
    const a11y = title ? `role="img" aria-label="${UI.esc(title)}"` : 'aria-hidden="true"';
    return `
      <svg class="portrait" viewBox="0 0 120 140" preserveAspectRatio="xMidYMax slice" ${a11y}>
        ${Portrait.#hairBack(look.style, hair)}
        <path fill="${shirt}" d="M12 140c0-30 22-44 48-44s48 14 48 44z"/>
        <path fill="${skin}" d="M51 76h18v20c0 5-4 9-9 9s-9-4-9-9z"/>
        <path fill="${shade}" d="M51 84c5 4 13 4 18 0v6c-5 4-13 4-18 0z"/>
        <ellipse fill="${skin}" cx="60" cy="58" rx="22" ry="26"/>
        ${Portrait.#hairFront(look.style, hair)}
        <circle fill="#1E2432" cx="52" cy="59" r="1.9"/>
        <circle fill="#1E2432" cx="68" cy="59" r="1.9"/>
        <path fill="none" stroke="#1E2432" stroke-width="1.9" stroke-linecap="round" d="M53.5 68q6.5 5.5 13 0"/>
      </svg>`;
  }
}
