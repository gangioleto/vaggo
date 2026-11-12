/* ============================================================
   VAGGO · ui/ListViews.js — telas de busca
   SearchView (abstrata) concentra o que as duas buscas têm em
   comum; JobsView e ProfessionalsView só dizem O QUE listar.
   ============================================================ */

class SearchView extends View {
  filter = {};

  constructor(app) {
    super(app);
    if (new.target === SearchView) throw new TypeError('SearchView é abstrata.');
    this.filter = this.emptyFilter();
  }

  // ---- pontos que as subclasses implementam ----
  emptyFilter() { throw new Error('Método abstrato: emptyFilter'); }
  get key() { throw new Error('Método abstrato: key'); }
  fields() { throw new Error('Método abstrato: fields'); }
  results() { throw new Error('Método abstrato: results'); }
  card(_item) { throw new Error('Método abstrato: card'); }
  emptyState() { throw new Error('Método abstrato: emptyState'); }

  setFilter(filter) {
    this.filter = { ...this.emptyFilter(), ...filter };
  }

  get #isFiltered() {
    return Object.values(this.filter).some((v) => v !== '');
  }

  #list() {
    const items = this.results();
    return {
      count: this.t(`${this.key}.count`, { n: items.length }),
      html: items.length ? items.map((item) => this.card(item)).join('') : this.emptyState(),
    };
  }

  render() {
    const list = this.#list();
    return `
      <section class="page">
        <div class="wrap">
          <header class="page__head">
            <h1>${UI.esc(this.t(`${this.key}.title`))}</h1>
            <p>${UI.esc(this.t(`${this.key}.sub`))}</p>
          </header>
          <form class="filters" data-form="filters" role="search">
            ${this.fields()}
            <button class="btn btn--ghost" type="button" data-action="clearFilters" id="${this.key}-clear" ${this.#isFiltered ? '' : 'hidden'}>
              ${UI.icon('x', 16)}${UI.esc(this.t('filter.clear'))}
            </button>
          </form>
          <p class="result-count" id="${this.key}-count" aria-live="polite">${UI.esc(list.count)}</p>
          <div class="grid" id="${this.key}-list">${list.html}</div>
        </div>
      </section>`;
  }

  /** Atualiza só a lista — os campos de filtro mantêm o foco. */
  #updateResults() {
    const list = this.#list();
    const host = document.getElementById(`${this.key}-list`);
    if (!host) return;
    document.getElementById('main').classList.add('is-static'); // não repete animações a cada tecla
    host.innerHTML = list.html;
    document.getElementById(`${this.key}-count`).textContent = list.count;
    document.getElementById(`${this.key}-clear`).hidden = !this.#isFiltered;
    Motion.reveal(host, { instant: true });
  }

  onFilter(element) {
    this.filter[element.dataset.filter] = element.value;
    this.#updateResults();
  }

  get actions() {
    return {
      clearFilters: () => {
        this.filter = this.emptyFilter();
        this.app.render({ instant: true });
      },
    };
  }

  get forms() {
    return { filters: () => {} }; // Enter não recarrega a página
  }

  textField(placeholderKey) {
    return `
      <div class="field field--search">
        <label for="${this.key}-text">${UI.esc(this.t('filter.text'))}</label>
        <span class="field__icon">${UI.icon('search', 18)}</span>
        <input id="${this.key}-text" type="search" data-filter="text" value="${UI.esc(this.filter.text)}"
          placeholder="${UI.esc(this.t(placeholderKey))}" autocomplete="off">
      </div>`;
  }
}

/** Busca de vagas. */
class JobsView extends SearchView {
  get key() { return 'jobs'; }
  emptyFilter() { return { text: '', category: '', city: '', contract: '' }; }

  fields() {
    return `
      ${this.textField('jobs.placeholder')}
      ${UI.select({ id: 'jobs-category', name: 'category', label: this.t('filter.category'), value: this.filter.category,
        options: UI.enumOptions(Category), empty: this.t('filter.allCategories'), attrs: 'data-filter="category"' })}
      ${UI.select({ id: 'jobs-city', name: 'city', label: this.t('filter.city'), value: this.filter.city,
        options: UI.cityOptions(), empty: this.t('filter.allCities'), attrs: 'data-filter="city"' })}
      ${UI.select({ id: 'jobs-contract', name: 'contract', label: this.t('filter.contract'), value: this.filter.contract,
        options: UI.enumOptions(ContractType), empty: this.t('filter.allContracts'), attrs: 'data-filter="contract"' })}`;
  }

  results() { return this.platform.searchJobs(this.filter); }
  card(job) { return Cards.job(this.app, job); }

  emptyState() {
    return Cards.empty('search', this.t('jobs.empty.t'), this.t('jobs.empty.d'));
  }
}

/** Busca de profissionais. */
class ProfessionalsView extends SearchView {
  get key() { return 'pros'; }
  emptyFilter() { return { text: '', category: '', city: '' }; }

  fields() {
    return `
      ${this.textField('pros.placeholder')}
      ${UI.select({ id: 'pros-category', name: 'category', label: this.t('filter.category'), value: this.filter.category,
        options: UI.enumOptions(Category), empty: this.t('filter.allCategories'), attrs: 'data-filter="category"' })}
      ${UI.select({ id: 'pros-city', name: 'city', label: this.t('filter.city'), value: this.filter.city,
        options: UI.cityOptions(), empty: this.t('filter.allCities'), attrs: 'data-filter="city"' })}`;
  }

  results() { return this.platform.searchProfessionals(this.filter); }
  card(pro) { return Cards.professional(this.app, pro); }

  emptyState() {
    return Cards.empty('users', this.t('pros.empty.t'), this.t('pros.empty.d'));
  }
}
