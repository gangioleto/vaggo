/* ============================================================
   VAGGO · models/Employer.js
   HERANÇA: Employer É UM User (Java: class Employer extends User).
   ============================================================ */

class Employer extends User {
  #employerType;
  #about;

  constructor(data = {}) {
    super(data);
    this.employerType = data.employerType ?? EmployerType.FAMILY.id;
    this.about = data.about ?? '';
  }

  get employerType() { return this.#employerType; }
  set employerType(value) {
    if (!Enums.has(EmployerType, value)) throw new ValidationError('employer_type_invalid');
    this.#employerType = value;
  }

  get about() { return this.#about; }
  set about(value) {
    this.#about = String(value ?? '').trim().slice(0, 400);
  }

  // ---------- POLIMORFISMO: sobrescrita (@Override) ----------
  get role() { return 'employer'; }

  describe(lang = 'pt') {
    const type = Enums.byId(EmployerType, this.#employerType)[lang];
    return lang === 'pt' ? `${type} · contratante` : `${type} · employer`;
  }

  canPostJobs() { return true; }

  toJSON() {
    return {
      ...super.toJSON(),
      employerType: this.#employerType,
      about: this.#about,
    };
  }
}

UserFactory.register('employer', Employer);
