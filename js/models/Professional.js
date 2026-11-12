/* ============================================================
   VAGGO · models/Professional.js
   HERANÇA: Professional É UM User (Java: class Professional extends User).
   ============================================================ */

class Professional extends User {
  #categories;
  #experienceYears;
  #availability;
  #bio;

  constructor(data = {}) {
    super(data); // chama o construtor da superclasse
    this.categories = data.categories;
    this.experienceYears = data.experienceYears ?? 0;
    this.availability = data.availability;
    this.bio = data.bio ?? '';
  }

  // ---------- atributos próprios do profissional ----------
  get categories() { return [...this.#categories]; } // cópia: protege a lista interna
  set categories(value) {
    const list = [...new Set(value ?? [])].filter((id) => Enums.has(Category, id));
    if (list.length === 0) throw new ValidationError('category_required');
    this.#categories = list;
  }

  get experienceYears() { return this.#experienceYears; }
  set experienceYears(value) {
    const years = Number(value);
    if (!Number.isInteger(years) || years < 0 || years > 60) throw new ValidationError('experience_invalid');
    this.#experienceYears = years;
  }

  get availability() { return [...this.#availability]; }
  set availability(value) {
    const list = [...new Set(value ?? [])].filter((id) => Enums.has(ContractType, id));
    if (list.length === 0) throw new ValidationError('availability_required');
    this.#availability = list;
  }

  get bio() { return this.#bio; }
  set bio(value) {
    this.#bio = String(value ?? '').trim().slice(0, 400);
  }

  offers(categoryId) { return this.#categories.includes(categoryId); }
  isAvailableFor(contractId) { return this.#availability.includes(contractId); }

  // ---------- POLIMORFISMO: sobrescrita (@Override) ----------
  get role() { return 'professional'; }

  describe(lang = 'pt') {
    const main = Enums.byId(Category, this.#categories[0])[lang];
    const years = this.#experienceYears;
    const exp = lang === 'pt'
      ? (years === 0 ? 'iniciando na área' : `${years} ${years === 1 ? 'ano' : 'anos'} de experiência`)
      : (years === 0 ? 'starting out' : `${years} ${years === 1 ? 'year' : 'years'} of experience`);
    return `${main} · ${exp}`;
  }

  canApply() { return true; }

  toJSON() {
    return {
      ...super.toJSON(), // reaproveita a serialização de User
      categories: this.categories,
      experienceYears: this.#experienceYears,
      availability: this.availability,
      bio: this.#bio,
    };
  }
}

UserFactory.register('professional', Professional);
