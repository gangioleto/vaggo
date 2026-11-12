/* ============================================================
   VAGGO · models/User.js
   Classe ABSTRATA: representa qualquer pessoa cadastrada.

   Java equivalente:
     public abstract class User {
         private String name;            ->  #name
         public String getName()         ->  get name()
         public abstract String getRole();
     }
   ============================================================ */

class User {
  // ENCAPSULAMENTO: campos privados (#). Só a própria classe acessa.
  #id;
  #name;
  #email;
  #phone;
  #city;
  #passwordHash;
  #createdAt;

  constructor({ id, name, email, phone = '', city, password, passwordHash, createdAt } = {}) {
    // ABSTRAÇÃO: impede "new User()" — só as subclasses podem ser instanciadas.
    if (new.target === User) {
      throw new TypeError('User é uma classe abstrata. Use Professional ou Employer.');
    }
    this.#id = id ?? IdGenerator.next('usr');
    this.#createdAt = createdAt ?? Date.now();

    // Os setters validam os dados antes de guardar.
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.city = city;

    if (passwordHash) {
      this.#passwordHash = passwordHash; // vindo do armazenamento
    } else {
      this.changePassword(password);
    }
  }

  // ---------- getters e setters (com validação) ----------
  get id() { return this.#id; }
  get createdAt() { return this.#createdAt; }

  get name() { return this.#name; }
  set name(value) {
    const clean = String(value ?? '').trim().replace(/\s+/g, ' ');
    if (clean.length < 3) throw new ValidationError('name_short');
    this.#name = clean;
  }

  get email() { return this.#email; }
  set email(value) {
    const clean = String(value ?? '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) throw new ValidationError('email_invalid');
    this.#email = clean;
  }

  get phone() { return this.#phone; }
  set phone(value) {
    this.#phone = String(value ?? '').trim();
  }

  get city() { return this.#city; }
  set city(value) {
    if (!City.includes(value)) throw new ValidationError('city_invalid');
    this.#city = value;
  }

  /** Iniciais para o avatar: "Maria Aparecida Souza" -> "MS". */
  get initials() {
    const parts = this.#name.split(' ').filter((p) => p.length > 2);
    const first = parts[0] ?? this.#name;
    const last = parts.length > 1 ? parts[parts.length - 1] : '';
    return (first[0] + (last[0] ?? '')).toUpperCase();
  }

  // ---------- senha: nunca exposta para fora da classe ----------
  changePassword(plain) {
    if (String(plain ?? '').length < 6) throw new ValidationError('password_short');
    this.#passwordHash = User.hash(plain);
  }

  checkPassword(plain) {
    return User.hash(plain) === this.#passwordHash;
  }

  /**
   * Hash simples (djb2) apenas para o protótipo acadêmico.
   * Em produção a senha seria tratada no servidor com bcrypt/argon2.
   */
  static hash(plain) {
    let h = 5381;
    for (const ch of String(plain)) h = ((h << 5) + h + ch.codePointAt(0)) >>> 0;
    return h.toString(16);
  }

  // ---------- métodos ABSTRATOS: cada subclasse implementa ----------
  /** @returns {'professional'|'employer'} */
  get role() {
    throw new Error('Método abstrato: role');
  }

  /** Linha curta que descreve o usuário no idioma informado. */
  describe(lang) {
    throw new Error('Método abstrato: describe');
  }

  // ---------- comportamento padrão, sobrescrito por POLIMORFISMO ----------
  canApply() { return false; }
  canPostJobs() { return false; }

  /** Serialização para o armazenamento (JSON). */
  toJSON() {
    return {
      type: this.role,
      id: this.#id,
      name: this.#name,
      email: this.#email,
      phone: this.#phone,
      city: this.#city,
      passwordHash: this.#passwordHash,
      createdAt: this.#createdAt,
    };
  }
}

/**
 * Fábrica: recria o objeto certo (Professional ou Employer) a partir do JSON.
 * Cada subclasse se registra aqui — a fábrica não precisa conhecer nenhuma delas.
 */
class UserFactory {
  static #types = new Map();

  static register(role, userClass) {
    UserFactory.#types.set(role, userClass);
  }

  static create(data) {
    const UserClass = UserFactory.#types.get(data.type ?? data.role);
    if (!UserClass) throw new ValidationError('role_invalid');
    return new UserClass(data);
  }
}
