/* ============================================================
   VAGGO · models/Job.js
   Uma vaga publicada por um Employer.
   title e description aceitam texto simples ou { pt, en }
   (os dados de demonstração vêm nos dois idiomas).
   ============================================================ */

class Job {
  #id;
  #employerId;
  #title;
  #description;
  #category;
  #city;
  #contractType;
  #pay;
  #payPeriod;
  #schedule;
  #status;
  #createdAt;

  constructor(data = {}) {
    if (!data.employerId) throw new ValidationError('employer_required');
    this.#id = data.id ?? IdGenerator.next('job');
    this.#employerId = data.employerId;
    this.#createdAt = data.createdAt ?? Date.now();
    this.#status = Enums.has(JobStatus, data.status) ? data.status : JobStatus.OPEN.id;

    this.title = data.title;
    this.description = data.description;
    this.category = data.category;
    this.city = data.city;
    this.contractType = data.contractType;
    this.pay = data.pay;
    this.payPeriod = data.payPeriod ?? PayPeriod.MONTH.id;
    this.schedule = data.schedule ?? '';
  }

  /** Normaliza texto simples ou bilíngue e valida o tamanho mínimo. */
  static #text(value, min, errorCode) {
    const clean = (s) => String(s ?? '').trim();
    if (value && typeof value === 'object') {
      const pair = { pt: clean(value.pt), en: clean(value.en || value.pt) };
      if (pair.pt.length < min) throw new ValidationError(errorCode);
      return Object.freeze(pair);
    }
    const text = clean(value);
    if (text.length < min) throw new ValidationError(errorCode);
    return text;
  }

  get id() { return this.#id; }
  get employerId() { return this.#employerId; }
  get createdAt() { return this.#createdAt; }
  get status() { return this.#status; }

  get title() { return this.#title; }
  set title(value) { this.#title = Job.#text(value, 5, 'title_short'); }

  get description() { return this.#description; }
  set description(value) { this.#description = Job.#text(value, 20, 'description_short'); }

  get schedule() { return this.#schedule; }
  set schedule(value) { this.#schedule = value ? Job.#text(value, 0, 'schedule_invalid') : ''; }

  get category() { return this.#category; }
  set category(value) {
    if (!Enums.has(Category, value)) throw new ValidationError('category_required');
    this.#category = value;
  }

  get city() { return this.#city; }
  set city(value) {
    if (!City.includes(value)) throw new ValidationError('city_invalid');
    this.#city = value;
  }

  get contractType() { return this.#contractType; }
  set contractType(value) {
    if (!Enums.has(ContractType, value)) throw new ValidationError('contract_invalid');
    this.#contractType = value;
  }

  get pay() { return this.#pay; }
  set pay(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount <= 0) throw new ValidationError('pay_invalid');
    this.#pay = Math.round(amount * 100) / 100;
  }

  get payPeriod() { return this.#payPeriod; }
  set payPeriod(value) {
    if (!Enums.has(PayPeriod, value)) throw new ValidationError('pay_invalid');
    this.#payPeriod = value;
  }

  get isOpen() { return this.#status === JobStatus.OPEN.id; }

  close() { this.#status = JobStatus.CLOSED.id; }
  reopen() { this.#status = JobStatus.OPEN.id; }

  /** Texto usado na busca (os dois idiomas juntos, sem acentos). */
  get searchText() {
    const flat = (v) => (typeof v === 'object' ? `${v.pt} ${v.en}` : v);
    const cat = Enums.byId(Category, this.#category);
    return Job.normalize(`${flat(this.#title)} ${flat(this.#description)} ${cat.pt} ${cat.en} ${this.#city}`);
  }

  static normalize(text) {
    return String(text ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  /** A vaga atende aos filtros informados? Filtro vazio = não filtra. */
  matches({ text = '', category = '', city = '', contract = '' } = {}) {
    if (category && category !== this.#category) return false;
    if (city && city !== this.#city) return false;
    if (contract && contract !== this.#contractType) return false;
    const words = Job.normalize(text).split(/\s+/).filter(Boolean);
    return words.every((word) => this.searchText.includes(word));
  }

  toJSON() {
    return {
      id: this.#id,
      employerId: this.#employerId,
      title: this.#title,
      description: this.#description,
      category: this.#category,
      city: this.#city,
      contractType: this.#contractType,
      pay: this.#pay,
      payPeriod: this.#payPeriod,
      schedule: this.#schedule,
      status: this.#status,
      createdAt: this.#createdAt,
    };
  }
}
