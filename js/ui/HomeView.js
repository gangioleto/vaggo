/* ============================================================
   VAGGO · ui/HomeView.js — página inicial
   O topo conversa com dois públicos. A pessoa escolhe
   "Quero contratar" ou "Procuro trabalho" e o título, o
   formulário e os cartões do corredor 3D mudam para o lado dela
   (profissionais para quem contrata, vagas para quem procura).
   ============================================================ */

class HomeView extends View {
  /** Público selecionado no topo: 'employer' ou 'professional'. */
  #audience = 'employer';
  /** Serviço aberto no guia. */
  #guide = 'nanny';

  // Quem aparece em cada versão do topo e nos cartões de serviço.
  static #SHOWCASE = Object.freeze([
    { category: 'nanny', person: 'usr_maria' },
    { category: 'cleaner', person: 'usr_joana' },
    { category: 'caregiver', person: 'usr_luciana' },
    { category: 'gardener', person: 'usr_sebastiao' },
  ]);

  get #greeting() {
    const hour = new Date().getHours();
    if (hour < 12) return this.t('home.hello.morning');
    if (hour < 18) return this.t('home.hello.afternoon');
    return this.t('home.hello.evening');
  }

  /** Parte de cima do topo: saudação, escolha do público, título e texto. */
  #stageTop(swapped = false) {
    const aud = this.#audience;
    const audBtn = (value) => `
      <button class="aud__btn ${aud === value ? 'is-on' : ''}" data-action="setAudience" data-audience="${value}" aria-pressed="${aud === value}">
        ${UI.icon(value === 'employer' ? 'briefcase' : 'user', 18)}${UI.esc(this.t(`home.aud.${value}`))}
      </button>`;
    return `
      <div class="stage__top ${swapped ? 'is-swapped' : ''}" id="stage-top">
        <p class="stage__hello fade-up">${UI.esc(this.#greeting)}</p>
        <div class="aud fade-up" style="--d:.06s" role="group" aria-label="${UI.esc(this.t('home.aud.label'))}">
          ${audBtn('employer')}${audBtn('professional')}
        </div>
        <h1 class="display lines">
          <span class="line"><span>${UI.esc(this.t('home.h1a'))}</span></span>
          <span class="line"><span class="accent swap">${UI.esc(this.t(`home.h1b.${aud}`))}</span></span>
        </h1>
        <p class="stage__lead fade-up swap" style="--d:.24s">${UI.esc(this.t(`home.lead.${aud}`))}</p>
      </div>`;
  }

  /** Parte de baixo do topo: a pergunta que leva à busca. */
  #stageBottom(swapped = false) {
    const aud = this.#audience;
    return `
      <div class="stage__bottom ${swapped ? 'is-swapped' : ''}" id="stage-bottom">
        <form class="ask fade-up swap" style="--d:.34s" data-form="heroAsk">
          ${UI.select({ id: 'ask-category', name: 'category', label: this.t(`home.ask.${aud}`),
            options: UI.enumOptions(Category), empty: this.t('filter.allCategories') })}
          ${UI.select({ id: 'ask-city', name: 'city', label: this.t('home.ask.city'),
            options: UI.cityOptions(), empty: this.t('filter.allCities') })}
          <button class="btn btn--ink btn--lg" type="submit">${UI.esc(this.t('home.ask.go'))}${UI.icon('arrow', 18)}</button>
        </form>
      </div>`;
  }

  /**
   * Corredor 3D. Cada cartão tem duas faces: um profissional (para quem
   * quer contratar) e uma vaga (para quem procura trabalho). Trocar o
   * público só troca a face visível — o movimento não é interrompido.
   */
  #corridor() {
    const lang = this.lang;
    const pros = this.platform.searchProfessionals();
    const jobs = this.platform.searchJobs();
    const brand = (kind) => `<div class="cface cface--${kind} cface--brand"><img src="assets/logo-symbol-white.png" alt=""></div>`;

    const proFace = (pro) => (pro ? `
      <div class="cface cface--pro" style="--pc-bg:${Portrait.bgFor(pro.id)}">
        ${Portrait.svg(pro.id)}
        <span class="cface__tag"><b>${UI.esc(pro.name.split(' ')[0])}</b><span>${UI.esc(Enums.byId(Category, pro.categories[0])[lang])}</span></span>
      </div>` : brand('pro'));

    const jobFace = (job) => {
      if (!job) return brand('job');
      const cat = Enums.byId(Category, job.category);
      return `
        <div class="cface cface--job">
          <span class="cface__icon">${UI.icon(cat.icon, 20)}</span>
          <span class="cface__cat">${UI.esc(cat[lang])}</span>
          <b class="cface__title">${UI.esc(UI.pick(job.title))}</b>
          <span class="cface__meta">${UI.icon('pin', 14)}${UI.esc(job.city)}</span>
          <span class="cface__pay">${UI.esc(UI.money(job.pay, job.payPeriod))}</span>
        </div>`;
    };

    return Corridor.html((index, side) => {
      // o trilho esquerdo começa em outro ponto da lista, para não espelhar os mesmos rostos
      const k = side === 'left' ? index + 4 : index;
      return proFace(pros.length ? pros[k % pros.length] : null) + jobFace(jobs.length ? jobs[k % jobs.length] : null);
    });
  }

  #stage() {
    return `
      <div class="stage" id="stage" data-audience="${this.#audience}">
        ${this.#stageTop()}
        <div class="stage__gap" aria-hidden="true">${this.#corridor()}</div>
        ${this.#stageBottom()}
      </div>`;
  }

  #showcase() {
    const lang = this.lang;
    const perCategory = this.platform.jobsPerCategory();
    return HomeView.#SHOWCASE.map(({ category, person }) => {
      const cat = Enums.byId(Category, category);
      return `
        <button class="svc reveal" style="--pc-bg:${Portrait.bgFor(person)}" data-action="goCategory" data-id="${cat.id}">
          <span class="svc__text">
            <span class="svc__name">${UI.esc(cat[lang])}</span>
            <span class="svc__line">${UI.esc(this.t(`home.svc.${cat.id}`))}</span>
            <span class="svc__link">${UI.esc(this.t('home.cats.count', { n: perCategory[cat.id] ?? 0 }))}${UI.icon('arrow', 16)}</span>
          </span>
          <span class="svc__art">${Portrait.svg(person)}</span>
        </button>`;
    }).join('');
  }

  #tiles() {
    const tiles = [
      { key: 'match', href: '#vagas', art: `
          <span class="mini-ring"><svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="none" stroke-width="5" class="ring__track"/><circle cx="24" cy="24" r="20" fill="none" stroke-width="5" stroke-linecap="round" stroke-dasharray="125.7" stroke-dashoffset="25" transform="rotate(-90 24 24)" class="mini-ring__bar"/></svg><b>80<small>%</small></b></span>
          <ul class="mini-list"><li class="is-hit">${UI.icon('check', 14)}${UI.esc(this.t('filter.category'))}</li><li class="is-hit">${UI.icon('check', 14)}${UI.esc(this.t('filter.city'))}</li><li>${UI.icon('x', 14)}${UI.esc(this.t('filter.contract'))}</li></ul>` },
      { key: 'status', href: '#painel', art: `
          <div class="mini-stack">${UI.pill(ApplicationStatus.PENDING)}${UI.pill(ApplicationStatus.ACCEPTED)}${UI.pill(ApplicationStatus.REJECTED)}</div>` },
      { key: 'privacy', href: '#profissionais', art: `
          <div class="mini-contact">${UI.icon('lock', 18)}<span>(11) 9••••-••••</span></div>` },
      { key: 'place', href: '#vagas', art: `
          <div class="mini-icons">${['home', 'baby', 'heart', 'chef', 'leaf', 'car'].map((i) => `<span>${UI.icon(i, 18)}</span>`).join('')}</div>` },
    ];
    return tiles.map((tile) => `
      <article class="ftile reveal">
        <div class="ftile__art" aria-hidden="true">${tile.art}</div>
        <h3>${UI.esc(this.t(`home.tile.${tile.key}.t`))}</h3>
        <p>${UI.esc(this.t(`home.tile.${tile.key}.d`))}</p>
        <a class="textlink" href="${tile.href}">${UI.esc(this.t(`home.tile.${tile.key}.a`))}${UI.icon('arrow', 16)}</a>
      </article>`).join('');
  }

  /** Painel do guia: descrição do serviço + números reais da plataforma. */
  #guidePanel(swapped = false) {
    const lang = this.lang;
    const cat = Enums.byId(Category, this.#guide);
    const guide = ServiceGuide.for(cat.id);
    const jobs = this.platform.searchJobs({ category: cat.id });
    const pros = this.platform.searchProfessionals({ category: cat.id });
    const pays = [...new Set(jobs.map((job) => UI.money(job.pay, job.payPeriod)))].slice(0, 2);
    const face = pros[0];

    return `
      <div class="guide__panel ${swapped ? 'is-swapped' : ''}" id="guide-panel">
        <div class="guide__art" style="--pc-bg:${face ? Portrait.bgFor(face.id) : 'var(--blue-soft)'}">
          ${face ? Portrait.svg(face.id) : UI.icon(cat.icon, 72)}
          ${face ? `<span class="guide__face"><b>${UI.esc(face.name)}</b><span>${UI.esc(face.describe(lang))}</span></span>` : ''}
        </div>
        <div class="guide__body">
          <h3>${UI.esc(cat[lang])}</h3>
          <p class="guide__sum">${UI.esc(UI.pick(guide.summary))}</p>

          <h4 class="h-sm">${UI.esc(this.t('home.guide.includes'))}</h4>
          <ul class="guide__list">
            ${guide.includes.map((item) => `<li>${UI.icon('check', 17)}<span>${UI.esc(UI.pick(item))}</span></li>`).join('')}
          </ul>

          <dl class="guide__stats">
            <div><dt>${UI.esc(this.t('home.guide.jobs', { n: jobs.length }))}</dt><dd>${jobs.length}</dd></div>
            <div><dt>${UI.esc(this.t('home.guide.pros', { n: pros.length }))}</dt><dd>${pros.length}</dd></div>
            <div><dt>${UI.esc(this.t('home.guide.pay'))}</dt><dd class="is-text">${UI.esc(pays.length ? pays.join(' · ') : this.t('home.guide.noPay'))}</dd></div>
          </dl>

          <div class="guide__tips">
            <div class="tip"><b>${UI.icon('briefcase', 16)}${UI.esc(this.t('home.guide.hire'))}</b><p>${UI.esc(UI.pick(guide.hire))}</p></div>
            <div class="tip"><b>${UI.icon('user', 16)}${UI.esc(this.t('home.guide.work'))}</b><p>${UI.esc(UI.pick(guide.work))}</p></div>
          </div>

          <div class="guide__cta">
            <button class="btn btn--primary" data-action="guideGo" data-route="profissionais">${UI.esc(this.t('home.guide.seePros'))}${UI.icon('arrow', 16)}</button>
            <button class="btn btn--ghost" data-action="guideGo" data-route="vagas">${UI.esc(this.t('home.guide.seeJobs'))}${UI.icon('arrow', 16)}</button>
          </div>
        </div>
      </div>`;
  }

  #guideTabs() {
    const lang = this.lang;
    return Enums.list(Category).filter((c) => ServiceGuide.for(c.id)).map((c) => `
      <button class="guide__tab ${c.id === this.#guide ? 'is-on' : ''}" data-action="setGuide" data-id="${c.id}" aria-pressed="${c.id === this.#guide}">
        ${UI.icon(c.icon, 20)}<span>${UI.esc(c[lang])}</span>
      </button>`).join('');
  }

  render() {
    const stats = this.platform.stats();
    const latest = this.platform.searchJobs().slice(0, 3);
    const lang = this.lang;
    const categories = Enums.list(Category);

    // Atalhos de serviço: cada um leva à busca já filtrada.
    const perCategory = this.platform.jobsPerCategory();
    const shortcuts = (hidden) => categories.map((c) => `
      <button class="schip" data-action="goCategory" data-id="${c.id}" ${hidden ? 'tabindex="-1"' : ''}>
        ${UI.icon(c.icon, 17)}${UI.esc(c[lang])}<em>${UI.esc(this.t('home.cats.count', { n: perCategory[c.id] ?? 0 }))}</em>
      </button>`).join('');
    const faces = this.platform.searchProfessionals().slice(0, 5).map((pro) => UI.avatar(pro, 'lg')).join('');

    const steps = (prefix) => [1, 2, 3].map((n) => `
      <li class="step reveal">
        <span class="step__n">${n}</span>
        <div>
          <h4>${UI.esc(this.t(`${prefix}.s${n}.t`))}</h4>
          <p>${UI.esc(this.t(`${prefix}.s${n}.d`))}</p>
        </div>
      </li>`).join('');

    return `
      <section class="hero">
        <div class="hero__bleed">${this.#stage()}</div>
        <div class="wrap">
          <div class="pulse fade-up" style="--d:.45s">
            <dl class="pulse__top">
              <div class="pulse__cell">
                <span class="pulse__faces" aria-hidden="true">${faces}</span>
                <div><dd data-count="${stats.professionals}">${stats.professionals}</dd><dt>${UI.esc(this.t('home.pulse.pros'))}</dt></div>
              </div>
              <div class="pulse__cell">
                <span class="pulse__icon" aria-hidden="true">${UI.icon('briefcase', 26)}</span>
                <div><dd data-count="${stats.openJobs}">${stats.openJobs}</dd><dt>${UI.esc(this.t('home.pulse.jobs'))}</dt></div>
              </div>
              <div class="pulse__cell">
                <span class="pulse__icon" aria-hidden="true">${UI.icon('pin', 26)}</span>
                <div><dd data-count="${stats.cities}">${stats.cities}</dd><dt>${UI.esc(this.t('home.fact.cities'))}</dt></div>
              </div>
            </dl>
            <div class="pulse__row">
              <span class="pulse__label">${UI.esc(this.t('home.pulse.goto'))}</span>
              <div class="pulse__scroll">
                <div class="pulse__track">
                  <div class="pulse__set">${shortcuts(false)}</div>
                  <div class="pulse__set" aria-hidden="true">${shortcuts(true)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="wrap">
          <header class="section__head section__head--big reveal">
            <h2>${UI.esc(this.t('home.cats.title'))}</h2>
            <p>${UI.esc(this.t('home.cats.sub'))}</p>
          </header>
          <div class="svc-row">${this.#showcase()}</div>
          <div class="svc-all reveal">
            <span>${UI.esc(this.t('home.cats.all'))}</span>
            ${categories.map((c) => `<button class="chipbtn" data-action="goCategory" data-id="${c.id}">${UI.icon(c.icon, 16)}${UI.esc(c[lang])}</button>`).join('')}
          </div>
        </div>
      </section>

      <section class="section section--tint">
        <div class="wrap">
          <header class="section__head section__head--big reveal">
            <h2>${UI.esc(this.t('home.tiles.title'))}</h2>
            <p>${UI.esc(this.t('home.tiles.sub'))}</p>
          </header>
          <div class="ftiles">${this.#tiles()}</div>
        </div>
      </section>

      <section class="section">
        <div class="wrap">
          <div class="filmband reveal">
            <div class="filmband__copy">
              <p class="eyebrow eyebrow--light">${UI.esc(this.t('home.film.eyebrow'))}</p>
              <h2>${UI.esc(this.t('home.film.title'))}</h2>
              <p>${UI.esc(this.t('home.film.sub'))}</p>
              <a class="btn btn--light btn--lg" href="#projeto">${UI.esc(this.t('home.film.cta'))}${UI.icon('arrow', 18)}</a>
            </div>
            <video class="film__video" src="assets/video/hero-${lang}.mp4" poster="assets/video/hero-poster.jpg"
              autoplay muted loop playsinline preload="metadata" aria-label="${UI.esc(this.t('home.filmAlt'))}"></video>
          </div>
        </div>
      </section>

      <section class="section section--tint">
        <div class="wrap">
          <header class="section__head section__head--big reveal">
            <h2>${UI.esc(this.t('home.guide.title'))}</h2>
            <p>${UI.esc(this.t('home.guide.sub'))}</p>
          </header>
          <div class="guide reveal">
            <div class="guide__nav" role="group" aria-label="${UI.esc(this.t('home.cats.all'))}">${this.#guideTabs()}</div>
            ${this.#guidePanel()}
          </div>
          <p class="guide__law reveal">${UI.icon('shield', 22)}<span><b>${UI.esc(this.t('home.guide.lawTitle'))}</b> ${UI.esc(this.t('home.guide.law'))}</span></p>
        </div>
      </section>

      <section class="section">
        <div class="wrap">
          <header class="section__head section__head--big reveal">
            <h2>${UI.esc(this.t('home.how.title'))}</h2>
            <p>${UI.esc(this.t('home.how.sub'))}</p>
          </header>
          <div class="how">
            <div class="how__col">
              <h3 class="how__who">${UI.icon('briefcase', 20)}${UI.esc(this.t('home.how.emp'))}</h3>
              <ol class="steps">${steps('home.how.emp')}</ol>
            </div>
            <div class="how__col">
              <h3 class="how__who">${UI.icon('user', 20)}${UI.esc(this.t('home.how.pro'))}</h3>
              <ol class="steps">${steps('home.how.pro')}</ol>
            </div>
          </div>
        </div>
      </section>

      <section class="section section--tint">
        <div class="wrap">
          <header class="section__head section__head--row reveal">
            <div>
              <h2>${UI.esc(this.t('home.latest.title'))}</h2>
              <p>${UI.esc(this.t('home.latest.sub'))}</p>
            </div>
            <a class="btn btn--ghost" href="#vagas">${UI.esc(this.t('home.latest.all'))}${UI.icon('arrow', 16)}</a>
          </header>
          <div class="grid">${latest.map((job) => Cards.job(this.app, job)).join('')}</div>
        </div>
      </section>

      <section class="cta">
        <div class="wrap cta__in reveal">
          <img class="cta__logo" src="assets/logo-symbol-white.png" alt="" width="120" height="95">
          <h2>${UI.esc(this.t('home.cta.title'))}</h2>
          <p>${UI.esc(this.t('home.cta.sub'))}</p>
          <div class="cta__actions">
            <button class="btn btn--primary btn--lg" data-action="openAuth" data-mode="register" data-role="professional">${UI.esc(this.t('home.cta.pro'))}</button>
            <button class="btn btn--light btn--lg" data-action="openAuth" data-mode="register" data-role="employer">${UI.esc(this.t('home.cta.emp'))}</button>
          </div>
        </div>
      </section>`;
  }

  get actions() {
    return {
      goCategory: (el) => this.app.goToSearch('vagas', { category: el.dataset.id }),

      // Guia de serviços: troca só o painel.
      setGuide: (el) => {
        if (el.dataset.id === this.#guide) return;
        this.#guide = el.dataset.id;
        document.getElementById('guide-panel').outerHTML = this.#guidePanel(true);
        document.querySelectorAll('.guide__tab').forEach((tab) => {
          const on = tab.dataset.id === this.#guide;
          tab.classList.toggle('is-on', on);
          tab.setAttribute('aria-pressed', String(on));
        });
      },
      guideGo: (el) => this.app.goToSearch(el.dataset.route, { category: this.#guide }),

      // Troca o público do topo sem redesenhar a página inteira.
      setAudience: (el) => {
        if (el.dataset.audience === this.#audience) return;
        this.#audience = el.dataset.audience;
        const stage = document.getElementById('stage');
        if (!stage) return;
        stage.dataset.audience = this.#audience; // os cartões do corredor trocam de face por CSS
        document.getElementById('stage-top').outerHTML = this.#stageTop(true);
        document.getElementById('stage-bottom').outerHTML = this.#stageBottom(true);
        document.querySelector(`#stage-top .aud__btn[data-audience="${this.#audience}"]`)?.focus({ preventScroll: true });
      },
    };
  }

  get forms() {
    return {
      // Contratante procura profissionais; profissional procura vagas.
      heroAsk: (_form, data) => {
        const filter = { category: data.get('category') ?? '', city: data.get('city') ?? '' };
        this.app.goToSearch(this.#audience === 'employer' ? 'profissionais' : 'vagas', filter);
      },
    };
  }
}
