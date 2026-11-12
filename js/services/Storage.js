/* ============================================================
   VAGGO · services/Storage.js
   ABSTRAÇÃO: StorageAdapter faz o papel de uma "interface" Java.
   O resto do sistema só conhece read/write/remove — não sabe
   (nem precisa saber) onde os dados ficam guardados.
   ============================================================ */

class StorageAdapter {
  constructor() {
    if (new.target === StorageAdapter) {
      throw new TypeError('StorageAdapter é abstrata.');
    }
  }

  read(key) { throw new Error('Método abstrato: read'); }
  write(key, value) { throw new Error('Método abstrato: write'); }
  remove(key) { throw new Error('Método abstrato: remove'); }
  get label() { throw new Error('Método abstrato: label'); }

  /** Escolhe a melhor implementação disponível no navegador. */
  static detect() {
    try {
      const probe = '__vaggo_probe__';
      window.localStorage.setItem(probe, '1');
      window.localStorage.removeItem(probe);
      return new LocalStorageAdapter();
    } catch {
      return new MemoryStorageAdapter();
    }
  }
}

/** Guarda os dados no navegador: continuam lá depois de fechar a página. */
class LocalStorageAdapter extends StorageAdapter {
  read(key) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? null : JSON.parse(raw);
    } catch {
      return null;
    }
  }

  write(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* armazenamento cheio ou bloqueado: o app segue funcionando em memória */
    }
  }

  remove(key) {
    try { window.localStorage.removeItem(key); } catch { /* ignora */ }
  }

  get label() { return 'localStorage'; }
}

/** Guarda os dados só enquanto a página está aberta (plano B e testes). */
class MemoryStorageAdapter extends StorageAdapter {
  #data = new Map();

  read(key) {
    return this.#data.has(key) ? JSON.parse(this.#data.get(key)) : null;
  }

  write(key, value) {
    this.#data.set(key, JSON.stringify(value));
  }

  remove(key) {
    this.#data.delete(key);
  }

  get label() { return 'memory'; }
}

/**
 * Repositório genérico (Java: class Repository<T>).
 * Guarda entidades por id e persiste a cada alteração.
 */
class Repository {
  #key;
  #storage;
  #revive;
  #items = new Map();

  /**
   * @param {string} key           chave no armazenamento
   * @param {StorageAdapter} storage
   * @param {(data: object) => object} revive  transforma JSON em objeto do domínio
   */
  constructor(key, storage, revive) {
    this.#key = key;
    this.#storage = storage;
    this.#revive = revive;
    this.#load();
  }

  #load() {
    const rows = this.#storage.read(this.#key) ?? [];
    for (const row of rows) {
      try {
        const entity = this.#revive(row);
        this.#items.set(entity.id, entity);
      } catch {
        /* registro corrompido: ignorado */
      }
    }
  }

  #persist() {
    this.#storage.write(this.#key, [...this.#items.values()].map((e) => e.toJSON()));
  }

  get size() { return this.#items.size; }
  all() { return [...this.#items.values()]; }
  find(id) { return this.#items.get(id) ?? null; }
  where(predicate) { return this.all().filter(predicate); }

  /** Insere ou atualiza. */
  save(entity) {
    this.#items.set(entity.id, entity);
    this.#persist();
    return entity;
  }

  clear() {
    this.#items.clear();
    this.#storage.remove(this.#key);
  }
}
