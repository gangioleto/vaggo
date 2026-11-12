/* ============================================================
   VAGGO · ui/App.js — controlador da interface
   Liga a plataforma (regras) às telas (Views): rotas, cabeçalho,
   rodapé e tratamento central de cliques e formulários.
   ============================================================ */

class App {
  static #ROUTES = Object.freeze(['inicio', 'vagas', 'profissionais', 'painel', 'projeto']);
  static #NAV = Object.freeze([
    { route: 'inicio', key: 'nav.home', icon: 'home' },
    { route: 'vagas', key: 'nav.jobs', icon: 'briefcase' },
    { route: 'profissionais', key: 'nav.pros', icon: 'users' },
    { route: 'painel', key: 'nav.dash', icon: 'user' },
    { route: 'projeto', key: 'nav.project', icon: 'cube' },
  ]);

  #views;
  #dialogs;
  #lastRoute = null;

  constructor(platform, i18n) {
    this.platform = platform;
    this.i18n = i18n;
    this.#dialogs = new Dialogs(this);
    // Todas são View: o App trata qualquer uma do mesmo jeito.
    this.#views = new Map([
      ['inicio', new HomeView(this)],
      ['vagas', new JobsView(this)],
      ['profissionais', new ProfessionalsView(this)],
      ['painel', new DashboardView(this)],
      ['projeto', new ProjectView(this)],
    ]);
  }

  get route() {
    const hash = window.location.hash.replace('#', '');
    return App.#ROUTES.includes(hash) ? hash : 'inicio';
  }

  get view() { return this.#views.get(this.route); }

  start() {
    Theme.restore();
    UI.setLang(this.i18n.lang);
    document.documentElement.lang = this.i18n.lang === 'pt' ? 'pt-BR' : 'en';

    window.addEventListener('hashchange', () => this.render());
    document.addEventListener('click', (event) => this.#onClick(event));
    document.addEventListener('submit', (event) => this.#onSubmit(event));
    document.addEventListener('input', (event) => this.#onInput(event));
    // Clique fora da janela fecha o modal.
    document.getElementById('modal').addEventListener('click', (event) => {
      if (event.target === event.currentTarget) UI.closeModal();
    });
    // Quando os dados mudam, a tela atual é redesenhada sem animar de novo.
    this.platform.subscribe(() => this.render({ instant: true }));

    this.render();
    Dropdown.watch(); // troca os <select> nativos pelo dropdown estilizado
    Motion.watchHeader(document.querySelector('.topbar'));
  }

  // ---------- desenho ----------
  render({ instant = false } = {}) {
    const route = this.route;
    const changed = route !== this.#lastRoute;
    const main = document.getElementById('main');

    this.#renderHeader();
    main.classList.toggle('is-static', instant || !changed);
    main.innerHTML = this.view.render();
    this.#renderFooter();

    if (changed) {
      this.#lastRoute = route;
      window.scrollTo(0, 0);
      main.classList.remove('is-entering');
      void main.offsetWidth; // reinicia a animação de entrada
      main.classList.add('is-entering');
    }
    const quiet = instant || !changed;
    Motion.reveal(main, { instant: quiet });
    Motion.reveal(document.getElementById('footer'), { instant: true });
    if (!quiet) Motion.countUp(main);
    Motion.watchVideo(main);
  }

  #renderHeader() {
    const t = (k, v) => this.i18n.t(k, v);
    const user = this.platform.currentUser;
    const route = this.route;

    document.getElementById('nav').innerHTML = App.#NAV.map((item) => `
      <a href="#${item.route}" class="nav__link" ${item.route === route ? 'aria-current="page"' : ''}>
        ${UI.icon(item.icon, 20)}<span>${UI.esc(t(item.key))}</span>
      </a>`).join('');

    const langSwitch = `
      <div class="lang" role="group" aria-label="Idioma / Language">
        ${I18n.LANGS.map((code) => `
          <button class="lang__btn ${code === this.i18n.lang ? 'is-on' : ''}" data-action="setLang" data-lang="${code}"
            aria-pressed="${code === this.i18n.lang}">${code.toUpperCase()}</button>`).join('')}
      </div>`;

    const dark = Theme.isDark;
    const themeLabel = t(dark ? 'theme.toLight' : 'theme.toDark');
    const themeSwitch = `
      <button class="iconbtn" data-action="toggleTheme" aria-label="${UI.esc(themeLabel)}" title="${UI.esc(themeLabel)}" aria-pressed="${dark}">
        ${UI.icon(dark ? 'sun' : 'moon', 20)}
      </button>`;

    const account = user ? `
      <a class="userchip" href="#painel" title="${UI.esc(user.name)}">
        ${UI.avatar(user, 'sm')}<span>${UI.esc(user.name.split(' ')[0])}</span>
      </a>
      <button class="iconbtn" data-action="logout" aria-label="${UI.esc(t('auth.logout'))}" title="${UI.esc(t('auth.logout'))}">${UI.icon('logout', 20)}</button>` : `
      <button class="btn btn--ghost btn--sm hide-sm" data-action="openAuth" data-mode="login">${UI.esc(t('auth.login'))}</button>
      <button class="btn btn--primary btn--sm" data-action="openAuth" data-mode="register">${UI.esc(t('auth.create'))}</button>`;

    document.getElementById('actions').innerHTML = langSwitch + themeSwitch + account;
    document.querySelector('.skip').textContent = t('skip');
  }

  #renderFooter() {
    const t = (k, v) => this.i18n.t(k, v);
    document.getElementById('footer').innerHTML = `
      <div class="wrap footer__in">
        <div class="footer__brand">
          <img src="assets/logo-full-white.png" alt="VAGGO" width="164" height="40" loading="lazy">
          <p>${UI.esc(t('footer.tag'))}</p>
        </div>
        <nav class="footer__nav" aria-label="Footer">
          ${App.#NAV.map((item) => `<a href="#${item.route}">${UI.esc(t(item.key))}</a>`).join('')}
        </nav>
        <div class="footer__meta">
          <p>${UI.esc(t('footer.note'))}</p>
          <p class="mono">${UI.esc(t('footer.storage', { where: this.platform.storageLabel }))}</p>
          <button class="btn btn--line btn--sm" data-action="resetDemo">${UI.icon('refresh', 16)}<span>${UI.esc(t('footer.reset'))}</span></button>
        </div>
      </div>`;
  }

  /** Abre uma das buscas ('vagas' ou 'profissionais') já filtrada. */
  goToSearch(route, filter) {
    this.#views.get(route).setFilter(filter);
    if (this.route === route) this.render({ instant: true });
    else window.location.hash = route;
  }

  // ---------- eventos ----------
  #onClick(event) {
    const el = event.target.closest('[data-action]');
    if (!el) return;
    const name = el.dataset.action;
    // POLIMORFISMO: primeiro a tela atual, depois as ações globais.
    const handler = this.view.actions[name] ?? this.#actions[name];
    if (handler) this.#guard(() => handler(el));
  }

  #onSubmit(event) {
    const form = event.target.closest('form[data-form]');
    if (!form) return;
    event.preventDefault();
    const name = form.dataset.form;
    const handler = this.view.forms[name] ?? this.#forms[name];
    if (handler) this.#guard(() => handler(form, new FormData(form)), form);
  }

  #onInput(event) {
    const el = event.target.closest('[data-filter]');
    if (el) this.view.onFilter(el);
  }

  /** Executa a ação e transforma erros do domínio em mensagens para a pessoa. */
  #guard(run, form = null) {
    try {
      run();
    } catch (error) {
      if (!(error instanceof VaggoError)) throw error;
      const message = this.i18n.error(error);
      if (form) UI.formError(form, message);
      else UI.toast(message, 'bad');
    }
  }

  get #actions() {
    const t = (k, v) => this.i18n.t(k, v);
    return {
      closeModal: () => UI.closeModal(),
      openJob: (el) => this.#dialogs.job(el.dataset.id),
      openProfessional: (el) => this.#dialogs.professional(el.dataset.id),
      openAuth: (el) => this.#dialogs.auth(el.dataset.mode, el.dataset.role),
      editProfile: () => this.#dialogs.editProfile(),
      openPostJob: () => this.#dialogs.postJob(),

      // Troca o tema com uma transição suave, quando o navegador oferece.
      toggleTheme: () => {
        const apply = () => { Theme.toggle(); this.#renderHeader(); };
        if (document.startViewTransition && !Motion.reduced) document.startViewTransition(apply);
        else apply();
      },

      setLang: (el) => {
        this.i18n.lang = el.dataset.lang;
        UI.setLang(this.i18n.lang);
        document.documentElement.lang = this.i18n.lang === 'pt' ? 'pt-BR' : 'en';
        this.render({ instant: true });
      },

      demoLogin: (el) => {
        const email = el.dataset.role === 'employer' ? SeedData.DEMO_EMPLOYER : SeedData.DEMO_PROFESSIONAL;
        const user = this.platform.login(email, SeedData.DEMO_PASSWORD);
        this.#afterLogin(user);
      },

      logout: () => {
        this.platform.logout();
        UI.toast(t('toast.logout'));
      },

      withdraw: (el) => {
        this.platform.withdraw(el.dataset.id);
        UI.toast(t('toast.withdrawn'));
        if (el.dataset.job) this.#dialogs.job(el.dataset.job); // atualiza a janela aberta
      },

      decide: (el) => {
        const accept = el.dataset.accept === '1';
        this.platform.decide(el.dataset.id, accept);
        UI.toast(t(accept ? 'toast.accepted' : 'toast.rejected'));
      },

      closeJob: (el) => {
        this.platform.closeJob(el.dataset.id);
        UI.toast(t('toast.closed'));
      },

      reopenJob: (el) => {
        this.platform.reopenJob(el.dataset.id);
        UI.toast(t('toast.reopened'));
      },

      // Ação destrutiva: pede um segundo clique para confirmar.
      resetDemo: (el) => {
        if (el.dataset.armed !== '1') {
          el.dataset.armed = '1';
          el.querySelector('span').textContent = t('footer.resetConfirm');
          setTimeout(() => {
            if (!el.isConnected) return;
            el.dataset.armed = '0';
            el.querySelector('span').textContent = t('footer.reset');
          }, 4000);
          return;
        }
        this.platform.resetDemo();
        UI.toast(t('toast.reset'));
      },
    };
  }

  get #forms() {
    const t = (k, v) => this.i18n.t(k, v);
    return {
      login: (_form, data) => {
        const user = this.platform.login(data.get('email'), data.get('password'));
        this.#afterLogin(user);
      },

      register: (_form, data) => {
        const user = this.platform.register({
          ...App.#profileData(data),
          type: data.get('type'),
          email: data.get('email'),
          password: data.get('password'),
        });
        this.#afterLogin(user);
      },

      saveProfile: (_form, data) => {
        const user = this.platform.currentUser;
        const all = App.#profileData(data);
        // Só envia os campos que existem para o tipo do usuário logado.
        const allowed = user instanceof Professional
          ? ['name', 'phone', 'city', 'categories', 'availability', 'experienceYears', 'bio']
          : ['name', 'phone', 'city', 'employerType', 'about'];
        this.platform.updateProfile(Object.fromEntries(allowed.map((field) => [field, all[field]])));
        UI.closeModal();
        UI.toast(t('toast.saved'));
      },

      postJob: (_form, data) => {
        this.platform.postJob({
          title: data.get('title'),
          description: data.get('description'),
          category: data.get('category'),
          city: data.get('city'),
          contractType: data.get('contractType'),
          schedule: data.get('schedule'),
          pay: data.get('pay'),
          payPeriod: data.get('payPeriod'),
        });
        UI.closeModal();
        UI.toast(t('toast.posted'));
      },

      apply: (_form, data) => {
        const jobId = data.get('jobId');
        this.platform.apply(jobId, data.get('message'));
        UI.toast(t('toast.applied'));
        this.#dialogs.job(jobId); // mostra o status "Em análise"
      },
    };
  }

  static #profileData(data) {
    return {
      name: data.get('name'),
      phone: data.get('phone') ?? '',
      city: data.get('city'),
      categories: data.getAll('categories'),
      availability: data.getAll('availability'),
      experienceYears: Number(data.get('experienceYears') || 0),
      bio: data.get('bio') ?? '',
      employerType: data.get('employerType') ?? 'family',
      about: data.get('about') ?? '',
    };
  }

  #afterLogin(user) {
    UI.closeModal();
    UI.toast(this.i18n.t('toast.welcome', { name: user.name.split(' ')[0] }));
    if (this.route === 'inicio') window.location.hash = 'painel';
  }
}

// ---------- inicialização ----------
document.addEventListener('DOMContentLoaded', () => {
  const app = new App(new VaggoPlatform(), new I18n());
  app.start();
  window.vaggo = app; // disponível no console para a apresentação
});
