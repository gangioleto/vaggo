/* ============================================================
   VAGGO · ui/View.js
   View é a classe ABSTRATA de todas as telas. O App só chama
   view.render() — cada tela responde do seu jeito (POLIMORFISMO).
   ============================================================ */

class View {
  constructor(app) {
    if (new.target === View) throw new TypeError('View é abstrata.');
    this.app = app;
  }

  get platform() { return this.app.platform; }
  get lang() { return this.app.i18n.lang; }
  t(key, vars) { return this.app.i18n.t(key, vars); }

  /** @returns {string} HTML da tela */
  render() { throw new Error('Método abstrato: render'); }

  /** Ações de clique próprias da tela: { nome: (elemento) => void } */
  get actions() { return {}; }
  /** Formulários próprios da tela: { nome: (form, FormData) => void } */
  get forms() { return {}; }
  /** Chamado quando um campo com data-filter muda. */
  onFilter(_element) {}
}

/** Cartões reutilizados por várias telas. */
class Cards {
  static job(app, job, { showStatus = false } = {}) {
    const t = (k, v) => app.i18n.t(k, v);
    const employer = app.platform.user(job.employerId);
    const contract = Enums.byId(ContractType, job.contractType);
    const score = app.platform.matchFor(job);
    return `
      <article class="card job reveal">
        <div class="job__top">
          ${UI.categoryChip(job.category)}
          ${showStatus ? UI.pill(Enums.byId(JobStatus, job.status)) : ''}
          ${score ? UI.matchRing(score, 46) : ''}
        </div>
        <h3 class="job__title">${UI.esc(UI.pick(job.title))}</h3>
        <p class="job__emp">${UI.esc(employer?.name ?? '')}</p>
        <ul class="meta">
          <li>${UI.icon('pin', 16)}${UI.esc(job.city)}</li>
          <li>${UI.icon('clock', 16)}${UI.esc(UI.pick(contract))}</li>
          <li>${UI.icon('wallet', 16)}<b>${UI.esc(UI.money(job.pay, job.payPeriod))}</b></li>
        </ul>
        <div class="job__foot">
          <span class="muted">${UI.esc(UI.ago(job.createdAt))}</span>
          <button class="btn btn--soft btn--sm" data-action="openJob" data-id="${job.id}">
            ${UI.esc(t('job.view'))}${UI.icon('arrow', 16)}
          </button>
        </div>
      </article>`;
  }

  static professional(app, pro) {
    const t = (k, v) => app.i18n.t(k, v);
    return `
      <article class="card pro reveal">
        <div class="pro__head">
          ${UI.avatar(pro, 'lg')}
          <div>
            <h3 class="pro__name">${UI.esc(pro.name)}</h3>
            <p class="muted">${UI.esc(pro.describe(app.i18n.lang))}</p>
          </div>
        </div>
        <div class="chips">${pro.categories.map((c) => UI.categoryChip(c)).join('')}</div>
        <p class="pro__bio">${UI.esc(pro.bio)}</p>
        <div class="job__foot">
          <span class="muted">${UI.icon('pin', 16)}${UI.esc(pro.city)}</span>
          <button class="btn btn--soft btn--sm" data-action="openProfessional" data-id="${pro.id}">
            ${UI.esc(t('pro.view'))}${UI.icon('arrow', 16)}
          </button>
        </div>
      </article>`;
  }

  static empty(icon, title, text, actionHtml = '') {
    return `
      <div class="empty">
        <span class="empty__icon">${UI.icon(icon, 26)}</span>
        <h3>${UI.esc(title)}</h3>
        <p>${UI.esc(text)}</p>
        ${actionHtml}
      </div>`;
  }
}
