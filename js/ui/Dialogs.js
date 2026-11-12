/* ============================================================
   VAGGO · ui/Dialogs.js — conteúdo das janelas (modais)
   ============================================================ */

class Dialogs {
  #app;

  constructor(app) {
    this.#app = app;
  }

  get #platform() { return this.#app.platform; }
  get #lang() { return this.#app.i18n.lang; }
  #t(key, vars) { return this.#app.i18n.t(key, vars); }

  // ---------- vaga ----------
  job(jobId) {
    const job = this.#platform.job(jobId);
    if (!job) return;
    const employer = this.#platform.user(job.employerId);
    const contract = Enums.byId(ContractType, job.contractType);
    const score = this.#platform.matchFor(job);

    UI.openModal(`
      <div class="modal__body">
        <div class="row">
          ${UI.categoryChip(job.category)}
          ${job.isOpen ? '' : UI.pill(JobStatus.CLOSED)}
        </div>
        <h2 class="modal__title">${UI.esc(UI.pick(job.title))}</h2>
        <p class="muted">${UI.esc(employer.name)} · ${UI.esc(employer.describe(this.#lang))}</p>

        <ul class="meta meta--box">
          <li>${UI.icon('pin', 18)}<span><small>${UI.esc(this.#t('job.city'))}</small>${UI.esc(job.city)}</span></li>
          <li>${UI.icon('briefcase', 18)}<span><small>${UI.esc(this.#t('job.contract'))}</small>${UI.esc(UI.pick(contract))}</span></li>
          <li>${UI.icon('wallet', 18)}<span><small>${UI.esc(this.#t('job.pay'))}</small>${UI.esc(UI.money(job.pay, job.payPeriod))}</span></li>
          ${job.schedule ? `<li>${UI.icon('clock', 18)}<span><small>${UI.esc(this.#t('job.schedule'))}</small>${UI.esc(UI.pick(job.schedule))}</span></li>` : ''}
        </ul>

        <h3 class="h-sm">${UI.esc(this.#t('job.about'))}</h3>
        <p class="prose">${UI.esc(UI.pick(job.description))}</p>

        ${score ? this.#matchBlock(score) : ''}
        ${this.#jobAction(job)}
      </div>`);
  }

  #matchBlock(score) {
    return `
      <div class="match">
        ${UI.matchRing(score, 84)}
        <div class="match__info">
          <h3 class="h-sm">${UI.esc(this.#t('match.title'))}</h3>
          <ul class="match__parts">
            ${score.parts.map((part) => `
              <li class="${part.hit ? 'is-hit' : 'is-miss'}">
                ${UI.icon(part.hit ? 'check' : 'x', 16)}
                <span>${UI.esc(this.#t(`match.${part.id}.${part.hit ? 'hit' : 'miss'}`))}</span>
                <b>${part.hit ? `+${part.max}` : '0'}</b>
              </li>`).join('')}
          </ul>
        </div>
      </div>`;
  }

  /** O bloco de ação muda conforme quem está vendo a vaga. */
  #jobAction(job) {
    const user = this.#platform.currentUser;

    if (!user) {
      return `
        <div class="callout">
          <p>${UI.esc(this.#t('job.loginToApply'))}</p>
          <div class="row">
            <button class="btn btn--primary" data-action="openAuth" data-mode="register" data-role="professional">${UI.esc(this.#t('auth.create'))}</button>
            <button class="btn btn--ghost" data-action="openAuth" data-mode="login">${UI.esc(this.#t('auth.login'))}</button>
          </div>
        </div>`;
    }

    if (user.canApply()) {
      const existing = this.#platform.applicationBy(user.id, job.id);
      if (existing?.isActive) {
        return `
          <div class="callout">
            <p>${UI.esc(this.#t('job.applied', { when: UI.ago(existing.createdAt) }))} ${UI.pill(Enums.byId(ApplicationStatus, existing.status))}</p>
            ${existing.isPending ? `<button class="btn btn--ghost btn--sm" data-action="withdraw" data-id="${existing.id}" data-job="${job.id}">${UI.esc(this.#t('app.withdraw'))}</button>` : ''}
          </div>`;
      }
      if (!job.isOpen) return `<div class="callout"><p>${UI.esc(this.#t('job.closedNote'))}</p></div>`;
      return `
        <form class="apply" data-form="apply">
          <input type="hidden" name="jobId" value="${job.id}">
          ${UI.field({ id: 'apply-message', name: 'message', type: 'textarea', required: false,
            label: this.#t('job.message'), placeholder: this.#t('job.messagePh'), attrs: 'maxlength="500"' })}
          <button class="btn btn--primary btn--lg" type="submit">${UI.icon('send', 18)}${UI.esc(this.#t('job.apply'))}</button>
        </form>`;
    }

    if (job.employerId === user.id) {
      const total = this.#platform.applicationsFor(job.id).length;
      return `
        <div class="callout">
          <p>${UI.esc(this.#t('job.yours', { n: total }))}</p>
          <a class="btn btn--primary btn--sm" href="#painel" data-action="closeModal">${UI.esc(this.#t('job.manage'))}</a>
        </div>`;
    }

    return `<div class="callout"><p>${UI.esc(this.#t('job.employerNote'))}</p></div>`;
  }

  // ---------- perfil do profissional ----------
  professional(id) {
    const pro = this.#platform.user(id);
    if (!(pro instanceof Professional)) return;
    const viewer = this.#platform.currentUser;
    // Privacidade: contato só aparece para contratantes cadastrados (ou para o próprio).
    const canSeeContact = viewer && (viewer.canPostJobs() || viewer.id === pro.id);

    UI.openModal(`
      <div class="modal__body">
        <div class="pro__head pro__head--lg">
          ${UI.avatar(pro, 'xl')}
          <div>
            <h2 class="modal__title">${UI.esc(pro.name)}</h2>
            <p class="muted">${UI.esc(pro.describe(this.#lang))}</p>
            <p class="muted">${UI.icon('pin', 16)}${UI.esc(pro.city)}</p>
          </div>
        </div>

        <h3 class="h-sm">${UI.esc(this.#t('pro.services'))}</h3>
        <div class="chips">${pro.categories.map((c) => UI.categoryChip(c)).join('')}</div>

        <h3 class="h-sm">${UI.esc(this.#t('pro.availability'))}</h3>
        <div class="chips">${pro.availability.map((a) => `<span class="chip chip--plain">${UI.esc(UI.pick(Enums.byId(ContractType, a)))}</span>`).join('')}</div>

        ${pro.bio ? `<h3 class="h-sm">${UI.esc(this.#t('pro.about'))}</h3><p class="prose">${UI.esc(pro.bio)}</p>` : ''}

        <h3 class="h-sm">${UI.esc(this.#t('pro.contact'))}</h3>
        ${canSeeContact ? `
          <ul class="contact">
            ${pro.phone ? `<li>${UI.icon('phone', 18)}<span>${UI.esc(pro.phone)}</span></li>` : ''}
            <li>${UI.icon('send', 18)}<span>${UI.esc(pro.email)}</span></li>
          </ul>` : `
          <div class="callout callout--lock">
            <p>${UI.icon('lock', 18)}${UI.esc(this.#t('pro.contactLocked'))}</p>
            ${viewer ? '' : `<button class="btn btn--primary btn--sm" data-action="openAuth" data-mode="register" data-role="employer">${UI.esc(this.#t('home.cta.emp'))}</button>`}
          </div>`}
      </div>`);
  }

  // ---------- entrar / criar conta ----------
  auth(mode = 'login', role = 'professional') {
    const isLogin = mode === 'login';
    const tabs = `
      <div class="tabs" role="tablist">
        <button class="tab ${isLogin ? 'is-on' : ''}" role="tab" aria-selected="${isLogin}" data-action="openAuth" data-mode="login">${UI.esc(this.#t('auth.login'))}</button>
        <button class="tab ${isLogin ? '' : 'is-on'}" role="tab" aria-selected="${!isLogin}" data-action="openAuth" data-mode="register" data-role="${role}">${UI.esc(this.#t('auth.create'))}</button>
      </div>`;

    const login = `
      <form class="form" data-form="login">
        ${UI.field({ id: 'login-email', name: 'email', type: 'email', label: this.#t('f.email'), attrs: 'autocomplete="username"' })}
        ${UI.field({ id: 'login-password', name: 'password', type: 'password', label: this.#t('f.password'), attrs: 'autocomplete="current-password"' })}
        <button class="btn btn--primary btn--lg" type="submit">${UI.esc(this.#t('auth.login'))}</button>
      </form>
      <div class="demo">
        <p>${UI.esc(this.#t('auth.demo'))}</p>
        <div class="row">
          <button class="btn btn--soft btn--sm" data-action="demoLogin" data-role="professional">${UI.icon('user', 16)}${UI.esc(this.#t('auth.demoPro'))}</button>
          <button class="btn btn--soft btn--sm" data-action="demoLogin" data-role="employer">${UI.icon('briefcase', 16)}${UI.esc(this.#t('auth.demoEmp'))}</button>
        </div>
      </div>`;

    const register = `
      <form class="form auth-register" data-form="register">
        <fieldset class="roles">
          <legend>${UI.esc(this.#t('auth.iAm'))}</legend>
          <label class="role">
            <input type="radio" id="role-professional" name="type" value="professional" ${role === 'professional' ? 'checked' : ''}>
            <span>${UI.icon('user', 22)}<b>${UI.esc(this.#t('role.professional'))}</b><small>${UI.esc(this.#t('auth.proHint'))}</small></span>
          </label>
          <label class="role">
            <input type="radio" id="role-employer" name="type" value="employer" ${role === 'employer' ? 'checked' : ''}>
            <span>${UI.icon('briefcase', 22)}<b>${UI.esc(this.#t('role.employer'))}</b><small>${UI.esc(this.#t('auth.empHint'))}</small></span>
          </label>
        </fieldset>
        <div class="form__grid">
          ${UI.field({ id: 'reg-name', name: 'name', label: this.#t('f.name'), attrs: 'autocomplete="name"' })}
          ${UI.field({ id: 'reg-email', name: 'email', type: 'email', label: this.#t('f.email'), attrs: 'autocomplete="email"' })}
          ${UI.field({ id: 'reg-phone', name: 'phone', type: 'tel', required: false, label: this.#t('f.phone'), placeholder: '(11) 90000-0000', attrs: 'autocomplete="tel"' })}
          ${UI.select({ id: 'reg-city', name: 'city', label: this.#t('f.city'), options: UI.cityOptions(), value: 'Jundiaí' })}
          ${UI.field({ id: 'reg-password', name: 'password', type: 'password', label: this.#t('f.password'), hint: this.#t('f.passwordHint'), attrs: 'autocomplete="new-password" minlength="6"' })}
        </div>
        <div class="only-professional">${this.#professionalFields()}</div>
        <div class="only-employer">${this.#employerFields()}</div>
        <button class="btn btn--primary btn--lg" type="submit">${UI.esc(this.#t('auth.create'))}</button>
      </form>`;

    UI.openModal(`
      <div class="modal__body">
        ${UI.logo('modal__logo', 150, 37)}
        ${tabs}
        ${isLogin ? login : register}
      </div>`);
  }

  #professionalFields(pro = null) {
    return `
      ${UI.checks({ name: 'categories', legend: this.#t('f.categories'), options: UI.enumOptions(Category), values: pro?.categories ?? [] })}
      ${UI.checks({ name: 'availability', legend: this.#t('f.availability'), options: UI.enumOptions(ContractType), values: pro?.availability ?? [] })}
      ${UI.field({ id: 'f-experience', name: 'experienceYears', type: 'number', required: false, label: this.#t('f.experience'),
        value: pro?.experienceYears ?? 0, attrs: 'min="0" max="60" step="1"' })}
      ${UI.field({ id: 'f-bio', name: 'bio', type: 'textarea', required: false, label: this.#t('f.bio'),
        value: pro?.bio ?? '', placeholder: this.#t('f.bioPh'), attrs: 'maxlength="400"' })}`;
  }

  #employerFields(emp = null) {
    return `
      ${UI.select({ id: 'f-employer-type', name: 'employerType', label: this.#t('f.employerType'),
        options: UI.enumOptions(EmployerType), value: emp?.employerType ?? 'family' })}
      ${UI.field({ id: 'f-about', name: 'about', type: 'textarea', required: false, label: this.#t('f.about'),
        value: emp?.about ?? '', placeholder: this.#t('f.aboutPh'), attrs: 'maxlength="400"' })}`;
  }

  // ---------- editar perfil ----------
  editProfile() {
    const user = this.#platform.currentUser;
    if (!user) return;
    // POLIMORFISMO na interface: os campos extras dependem do tipo de usuário.
    const extra = user instanceof Professional ? this.#professionalFields(user) : this.#employerFields(user);
    UI.openModal(`
      <div class="modal__body">
        <h2 class="modal__title">${UI.esc(this.#t('profile.edit'))}</h2>
        <form class="form" data-form="saveProfile">
          <div class="form__grid">
            ${UI.field({ id: 'p-name', name: 'name', label: this.#t('f.name'), value: user.name })}
            ${UI.field({ id: 'p-phone', name: 'phone', type: 'tel', required: false, label: this.#t('f.phone'), value: user.phone })}
            ${UI.select({ id: 'p-city', name: 'city', label: this.#t('f.city'), options: UI.cityOptions(), value: user.city })}
          </div>
          ${extra}
          <button class="btn btn--primary btn--lg" type="submit">${UI.esc(this.#t('profile.save'))}</button>
        </form>
      </div>`);
  }

  // ---------- publicar vaga ----------
  postJob() {
    const user = this.#platform.currentUser;
    UI.openModal(`
      <div class="modal__body">
        <h2 class="modal__title">${UI.esc(this.#t('post.title'))}</h2>
        <p class="muted">${UI.esc(this.#t('post.sub'))}</p>
        <form class="form" data-form="postJob">
          ${UI.field({ id: 'j-title', name: 'title', label: this.#t('post.f.title'), placeholder: this.#t('post.f.titlePh'), attrs: 'minlength="5" maxlength="80"' })}
          <div class="form__grid">
            ${UI.select({ id: 'j-category', name: 'category', label: this.#t('filter.category'), options: UI.enumOptions(Category) })}
            ${UI.select({ id: 'j-city', name: 'city', label: this.#t('f.city'), options: UI.cityOptions(), value: user?.city ?? 'Jundiaí' })}
            ${UI.select({ id: 'j-contract', name: 'contractType', label: this.#t('filter.contract'), options: UI.enumOptions(ContractType) })}
            ${UI.field({ id: 'j-schedule', name: 'schedule', required: false, label: this.#t('job.schedule'), placeholder: this.#t('post.f.schedulePh') })}
            ${UI.field({ id: 'j-pay', name: 'pay', type: 'number', label: this.#t('post.f.pay'), attrs: 'min="1" step="0.01" inputmode="decimal"' })}
            ${UI.select({ id: 'j-period', name: 'payPeriod', label: this.#t('post.f.period'),
              options: Enums.list(PayPeriod).map((p) => ({ value: p.id, label: this.#t('post.f.per', { p: p[this.#lang] }) })) })}
          </div>
          ${UI.field({ id: 'j-description', name: 'description', type: 'textarea', label: this.#t('post.f.description'),
            placeholder: this.#t('post.f.descriptionPh'), attrs: 'minlength="20" maxlength="700"' })}
          <button class="btn btn--primary btn--lg" type="submit">${UI.esc(this.#t('post.submit'))}</button>
        </form>
      </div>`, { wide: true });
  }
}
