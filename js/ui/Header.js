/* ============================================================
   VAGGO · ui/Header.js — cabeçalho em "ilha flutuante"

   O cabeçalho é um objeto com estado próprio:
     - uma pílula desliza entre os itens do menu e acompanha o mouse;
     - ao rolar a página, a ilha ganha fundo de vidro e encolhe;
     - uma linha fina mostra quanto da página já foi lida;
     - os selos do menu mostram dados reais da plataforma.

   ENCAPSULAMENTO: a posição da pílula e o último idioma/tema
   ficam em campos privados; o App só chama render() e sync().
   ============================================================ */

class Header {
  /** Itens do menu (o rodapé usa a mesma lista). */
  static NAV = Object.freeze([
    { route: 'inicio', key: 'nav.home', icon: 'home' },
    { route: 'vagas', key: 'nav.jobs', icon: 'briefcase' },
    { route: 'profissionais', key: 'nav.pros', icon: 'users' },
    { route: 'painel', key: 'nav.dash', icon: 'user' },
    { route: 'projeto', key: 'nav.project', icon: 'cube' },
  ]);

  #app;
  #el;
  #nav;
  #actions;
  #progress;
  #pill = null;                            // { x, y, w, h } da última posição
  #last = { lang: null, dark: null };      // para animar só o que mudou
  #ticking = false;

  constructor(app) {
    this.#app = app;
    this.#el = document.querySelector('.topbar');
    this.#nav = document.getElementById('nav');
    this.#actions = document.getElementById('actions');
    this.#progress = this.#el.querySelector('.topbar__progress');
    this.#bind();
  }

  // ---------- eventos ----------
  #bind() {
    window.addEventListener('scroll', () => {
      if (this.#ticking) return;             // no máximo uma atualização por quadro
      this.#ticking = true;
      requestAnimationFrame(() => { this.#ticking = false; this.sync(); });
    }, { passive: true });
    window.addEventListener('resize', () => this.#movePill(this.#activeLink, { animate: false }));
    document.fonts?.ready.then(() => this.#movePill(this.#activeLink, { animate: false }));

    // A pílula acompanha o mouse e volta para a página atual ao sair.
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      this.#nav.addEventListener('pointerover', (event) => {
        const link = event.target.closest('.nav__link');
        if (link) this.#movePill(link, { remember: false });
      });
      this.#nav.addEventListener('pointerleave', () => this.#movePill(this.#activeLink));
    }

    // Quando a última letra termina de entrar, começa o ciclo contínuo da logo.
    const logo = this.#el.querySelector('.logo');
    const ready = () => logo.classList.add('is-ready');
    logo.querySelector('.logo__l:last-child').addEventListener('animationend', ready, { once: true });
    setTimeout(ready, 1800);                 // garantia (ex.: "reduzir movimento")
  }

  // ---------- pílula do menu ----------
  get #activeLink() {
    return this.#nav.querySelector('.nav__link[aria-current="page"]');
  }

  #movePill(link, { animate = true, remember = true, from = null } = {}) {
    const pill = this.#nav.querySelector('.nav__pill');
    if (!pill || !link) return;
    const next = { x: link.offsetLeft, y: link.offsetTop, w: link.offsetWidth, h: link.offsetHeight };
    const apply = (p) => {
      pill.style.width = `${p.w}px`;
      pill.style.height = `${p.h}px`;
      pill.style.transform = `translate(${p.x}px, ${p.y}px)`;
    };
    if (!animate || from || Motion.reduced) {
      pill.style.transition = 'none';
      apply(animate && from && !Motion.reduced ? from : next);
      void pill.offsetWidth;                 // fixa a posição inicial antes de animar
      pill.style.transition = '';
    }
    apply(next);
    pill.classList.add('is-on');
    if (remember) this.#pill = next;
  }

  // ---------- rolagem ----------
  /** Atualiza o estado "rolado" e a linha de progresso. Chamado a cada tela nova. */
  sync() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    this.#el.classList.toggle('is-scrolled', y > 12);
    this.#progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    this.#progress.classList.toggle('is-off', max < 600); // páginas curtas não precisam
  }

  // ---------- desenho ----------
  #badges(user) {
    const platform = this.#app.platform;
    const t = (key) => this.#app.i18n.t(key);
    const open = platform.stats().openJobs;
    // POLIMORFISMO: só quem pode publicar vagas tem candidaturas a responder.
    const waiting = user?.canPostJobs()
      ? platform.jobsOf(user.id).flatMap((job) => platform.applicationsFor(job.id)).filter((a) => a.isPending).length
      : 0;
    return {
      vagas: open ? `<b class="nav__badge" title="${open} ${UI.esc(t('home.fact.jobs'))}">${open}</b>` : '',
      painel: waiting ? `<b class="nav__badge nav__badge--alert" title="${waiting} ${UI.esc(t('dash.emp.waiting'))}">${waiting}</b>` : '',
    };
  }

  render() {
    const { platform, i18n, route } = this.#app;
    const t = (key, vars) => i18n.t(key, vars);
    const user = platform.currentUser;
    const dark = Theme.isDark;
    const badges = this.#badges(user);

    // menu
    this.#nav.innerHTML = '<span class="nav__pill" aria-hidden="true"></span>' + Header.NAV.map((item) => `
      <a href="#${item.route}" class="nav__link" ${item.route === route ? 'aria-current="page"' : ''}>
        ${UI.icon(item.icon, 20)}<span>${UI.esc(t(item.key))}</span>${badges[item.route] ?? ''}
      </a>`).join('');
    this.#movePill(this.#activeLink, { from: this.#pill, animate: this.#pill !== null });

    // preferências: idioma + tema em uma só cápsula
    const langMoved = this.#last.lang !== null && this.#last.lang !== i18n.lang;
    const themeMoved = this.#last.dark !== null && this.#last.dark !== dark;
    const themeLabel = t(dark ? 'theme.toLight' : 'theme.toDark');
    const prefs = `
      <div class="prefs">
        <div class="lang ${langMoved ? 'lang--moved' : ''}" data-lang="${i18n.lang}" role="group" aria-label="Idioma / Language">
          <span class="lang__thumb" aria-hidden="true"></span>
          ${I18n.LANGS.map((code) => `
            <button class="lang__btn ${code === i18n.lang ? 'is-on' : ''}" data-action="setLang" data-lang="${code}"
              aria-pressed="${code === i18n.lang}">${code.toUpperCase()}</button>`).join('')}
        </div>
        <span class="prefs__sep" aria-hidden="true"></span>
        <button class="themebtn ${themeMoved ? 'themebtn--moved' : ''}" data-action="toggleTheme" aria-label="${UI.esc(themeLabel)}" title="${UI.esc(themeLabel)}" aria-pressed="${dark}">
          ${UI.icon(dark ? 'sun' : 'moon', 18)}
        </button>
      </div>`;

    // conta
    const account = user ? `
      <a class="userchip" href="#painel" title="${UI.esc(user.name)}">
        ${UI.avatar(user, 'sm')}
        <span class="userchip__text"><b>${UI.esc(user.name.split(' ')[0])}</b><small>${UI.esc(t(`role.${user.role}`))}</small></span>
      </a>
      <button class="iconbtn iconbtn--round" data-action="logout" aria-label="${UI.esc(t('auth.logout'))}" title="${UI.esc(t('auth.logout'))}">${UI.icon('logout', 18)}</button>` : `
      <button class="btn btn--quiet btn--sm hide-sm" data-action="openAuth" data-mode="login">${UI.esc(t('auth.login'))}</button>
      <button class="btn btn--primary btn--sm btn--cta" data-action="openAuth" data-mode="register">${UI.esc(t('auth.create'))}${UI.icon('arrow', 16)}</button>`;

    this.#actions.innerHTML = prefs + account;
    this.#last = { lang: i18n.lang, dark };
    document.querySelector('.skip').textContent = t('skip');
  }
}
