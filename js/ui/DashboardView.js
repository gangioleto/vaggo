/* ============================================================
   VAGGO · ui/DashboardView.js — painel do usuário
   POLIMORFISMO: o painel é escolhido pelo tipo do usuário.
   DashboardView não tem "if profissional / else contratante":
   ela pede o Panel registrado para o papel e chama render().
   ============================================================ */

class Panel {
  constructor(view, user) {
    if (new.target === Panel) throw new TypeError('Panel é abstrata.');
    this.view = view;
    this.user = user;
  }

  get platform() { return this.view.platform; }
  t(key, vars) { return this.view.t(key, vars); }

  /** Cabeçalho comum; cada painel informa o botão principal. */
  head(actionHtml) {
    const user = this.user;
    return `
      <header class="dash__head">
        ${UI.avatar(user, 'xl')}
        <div class="dash__who">
          <p class="eyebrow">${UI.esc(this.t(`role.${user.role}`))}</p>
          <h1>${UI.esc(user.name)}</h1>
          <p class="muted">${UI.esc(user.describe(this.view.lang))} · ${UI.esc(user.city)}</p>
        </div>
        <div class="dash__actions">
          <button class="btn btn--ghost" data-action="editProfile">${UI.icon('edit', 16)}${UI.esc(this.t('profile.edit'))}</button>
          ${actionHtml}
        </div>
      </header>`;
  }

  tiles(items) {
    return `<div class="tiles">${items.map(([value, label]) => `
      <div class="tile"><b>${value}</b><span>${UI.esc(label)}</span></div>`).join('')}</div>`;
  }

  render() { throw new Error('Método abstrato: render'); }
}

class ProfessionalPanel extends Panel {
  render() {
    const apps = this.platform.applicationsOf(this.user.id);
    const count = (status) => apps.filter((a) => a.status === status.id).length;
    const appliedIds = new Set(apps.filter((a) => a.isActive).map((a) => a.jobId));
    const recommended = this.platform.searchJobs().filter((j) => !appliedIds.has(j.id)).slice(0, 3);

    const rows = apps.map((app) => {
      const job = this.platform.job(app.jobId);
      const employer = this.platform.user(job.employerId);
      return `
        <li class="rowitem">
          <div class="rowitem__main">
            <button class="linklike" data-action="openJob" data-id="${job.id}">${UI.esc(UI.pick(job.title))}</button>
            <span class="muted">${UI.esc(employer.name)} · ${UI.esc(job.city)} · ${UI.esc(UI.ago(app.createdAt))}</span>
          </div>
          ${UI.pill(Enums.byId(ApplicationStatus, app.status))}
          ${app.isPending ? `<button class="btn btn--ghost btn--sm" data-action="withdraw" data-id="${app.id}">${UI.esc(this.t('app.withdraw'))}</button>` : ''}
        </li>`;
    }).join('');

    return `
      ${this.head(`<a class="btn btn--primary" href="#vagas">${UI.icon('search', 16)}${UI.esc(this.t('dash.pro.find'))}</a>`)}
      ${this.tiles([
        [apps.length, this.t('dash.pro.sent')],
        [count(ApplicationStatus.PENDING), this.t('dash.pro.pending')],
        [count(ApplicationStatus.ACCEPTED), this.t('dash.pro.accepted')],
      ])}
      <div class="dash__cols">
        <section class="block">
          <h2>${UI.esc(this.t('dash.pro.apps'))}</h2>
          ${apps.length ? `<ul class="rows">${rows}</ul>` : Cards.empty('send', this.t('dash.pro.empty.t'), this.t('dash.pro.empty.d'))}
        </section>
        <section class="block">
          <h2>${UI.esc(this.t('dash.pro.recommended'))}</h2>
          <p class="muted block__sub">${UI.esc(this.t('dash.pro.recommendedSub'))}</p>
          <div class="stack">${recommended.map((job) => Cards.job(this.view.app, job)).join('')}</div>
        </section>
      </div>`;
  }
}

class EmployerPanel extends Panel {
  render() {
    const jobs = this.platform.jobsOf(this.user.id);
    const allApps = jobs.flatMap((job) => this.platform.applicationsFor(job.id));

    const blocks = jobs.map((job) => {
      const apps = this.platform.applicationsFor(job.id);
      return `
        <article class="jobblock">
          <header class="jobblock__head">
            <div>
              <div class="row">${UI.categoryChip(job.category)}${UI.pill(Enums.byId(JobStatus, job.status))}</div>
              <h3><button class="linklike" data-action="openJob" data-id="${job.id}">${UI.esc(UI.pick(job.title))}</button></h3>
              <p class="muted">${UI.esc(job.city)} · ${UI.esc(UI.money(job.pay, job.payPeriod))} · ${UI.esc(UI.ago(job.createdAt))}</p>
            </div>
            <button class="btn btn--ghost btn--sm" data-action="${job.isOpen ? 'closeJob' : 'reopenJob'}" data-id="${job.id}">
              ${UI.esc(this.t(job.isOpen ? 'dash.emp.close' : 'dash.emp.reopen'))}
            </button>
          </header>
          ${apps.length ? `<ul class="applicants">${apps.map((app) => this.#applicant(app, job)).join('')}</ul>`
            : `<p class="muted jobblock__none">${UI.esc(this.t('dash.emp.noApps'))}</p>`}
        </article>`;
    }).join('');

    return `
      ${this.head(`<button class="btn btn--primary" data-action="openPostJob">${UI.icon('plus', 16)}${UI.esc(this.t('post.title'))}</button>`)}
      ${this.tiles([
        [jobs.filter((j) => j.isOpen).length, this.t('dash.emp.open')],
        [allApps.length, this.t('dash.emp.received')],
        [allApps.filter((a) => a.isPending).length, this.t('dash.emp.waiting')],
      ])}
      <section class="block block--flat">
        <h2>${UI.esc(this.t('dash.emp.jobs'))}</h2>
        ${jobs.length ? blocks : Cards.empty('briefcase', this.t('dash.emp.empty.t'), this.t('dash.emp.empty.d'),
          `<button class="btn btn--primary" data-action="openPostJob">${UI.esc(this.t('post.title'))}</button>`)}
      </section>`;
  }

  #applicant(app, job) {
    const pro = this.platform.user(app.professionalId);
    const score = this.platform.matchFor(job, pro);
    return `
      <li class="applicant">
        ${UI.avatar(pro, 'md')}
        <div class="applicant__main">
          <button class="linklike" data-action="openProfessional" data-id="${pro.id}">${UI.esc(pro.name)}</button>
          <span class="muted">${UI.esc(pro.describe(this.view.lang))} · ${UI.esc(pro.city)}</span>
          ${app.message ? `<blockquote>${UI.esc(app.message)}</blockquote>` : ''}
        </div>
        ${UI.matchRing(score, 46)}
        <div class="applicant__actions">
          ${app.isPending ? `
            <button class="btn btn--ok btn--sm" data-action="decide" data-id="${app.id}" data-accept="1">${UI.icon('check', 16)}${UI.esc(this.t('dash.emp.accept'))}</button>
            <button class="btn btn--ghost btn--sm" data-action="decide" data-id="${app.id}" data-accept="0">${UI.esc(this.t('dash.emp.reject'))}</button>`
            : UI.pill(Enums.byId(ApplicationStatus, app.status))}
        </div>
      </li>`;
  }
}

class DashboardView extends View {
  // Registro papel -> painel. Um novo tipo de usuário só precisa se registrar aqui.
  static #panels = new Map([
    ['professional', ProfessionalPanel],
    ['employer', EmployerPanel],
  ]);

  render() {
    const user = this.platform.currentUser;
    if (!user) {
      return `
        <section class="page"><div class="wrap">
          ${Cards.empty('lock', this.t('dash.guest.t'), this.t('dash.guest.d'), `
            <div class="row row--center">
              <button class="btn btn--primary" data-action="openAuth" data-mode="login">${UI.esc(this.t('auth.login'))}</button>
              <button class="btn btn--ghost" data-action="openAuth" data-mode="register">${UI.esc(this.t('auth.create'))}</button>
            </div>`)}
        </div></section>`;
    }
    const PanelClass = DashboardView.#panels.get(user.role);
    return `<section class="page"><div class="wrap dash">${new PanelClass(this, user).render()}</div></section>`;
  }
}
