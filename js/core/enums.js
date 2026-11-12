/* ============================================================
   VAGGO · core/enums.js
   Constantes do domínio (em Java seriam "enum").
   Object.freeze impede alteração, como um enum de verdade.
   Cada item tem rótulo em português (pt) e inglês (en).
   ============================================================ */

const Category = Object.freeze({
  HOUSEKEEPER: Object.freeze({ id: 'housekeeper', icon: 'home',    pt: 'Empregada(o) doméstica(o)', en: 'Housekeeper' }),
  CLEANER:     Object.freeze({ id: 'cleaner',     icon: 'sparkle', pt: 'Diarista',                  en: 'House cleaner' }),
  NANNY:       Object.freeze({ id: 'nanny',       icon: 'baby',    pt: 'Babá',                      en: 'Nanny' }),
  CAREGIVER:   Object.freeze({ id: 'caregiver',   icon: 'heart',   pt: 'Cuidador(a) de idosos',     en: 'Elderly caregiver' }),
  COOK:        Object.freeze({ id: 'cook',        icon: 'chef',    pt: 'Cozinheira(o)',             en: 'Cook' }),
  GARDENER:    Object.freeze({ id: 'gardener',    icon: 'leaf',    pt: 'Jardineiro(a)',             en: 'Gardener' }),
  DRIVER:      Object.freeze({ id: 'driver',      icon: 'car',     pt: 'Motorista particular',      en: 'Private driver' }),
  LAUNDRY:     Object.freeze({ id: 'laundry',     icon: 'shirt',   pt: 'Passadeira',                en: 'Ironing and laundry' }),
});

const ContractType = Object.freeze({
  FULL_TIME: Object.freeze({ id: 'full_time', pt: 'Mensalista',   en: 'Full-time' }),
  DAILY:     Object.freeze({ id: 'daily',     pt: 'Por diária',   en: 'Per day' }),
  PART_TIME: Object.freeze({ id: 'part_time', pt: 'Meio período', en: 'Part-time' }),
  TEMPORARY: Object.freeze({ id: 'temporary', pt: 'Temporário',   en: 'Temporary' }),
});

const PayPeriod = Object.freeze({
  MONTH: Object.freeze({ id: 'month', pt: 'mês',  en: 'month' }),
  DAY:   Object.freeze({ id: 'day',   pt: 'dia',  en: 'day' }),
  HOUR:  Object.freeze({ id: 'hour',  pt: 'hora', en: 'hour' }),
});

const EmployerType = Object.freeze({
  FAMILY:     Object.freeze({ id: 'family',     pt: 'Família',        en: 'Family' }),
  INDIVIDUAL: Object.freeze({ id: 'individual', pt: 'Pessoa física',  en: 'Individual' }),
  COMPANY:    Object.freeze({ id: 'company',    pt: 'Empresa',        en: 'Company' }),
});

const ApplicationStatus = Object.freeze({
  PENDING:   Object.freeze({ id: 'pending',   tone: 'warn', pt: 'Em análise', en: 'Under review' }),
  ACCEPTED:  Object.freeze({ id: 'accepted',  tone: 'ok',   pt: 'Aceita',     en: 'Accepted' }),
  REJECTED:  Object.freeze({ id: 'rejected',  tone: 'bad',  pt: 'Recusada',   en: 'Declined' }),
  WITHDRAWN: Object.freeze({ id: 'withdrawn', tone: 'mute', pt: 'Retirada',   en: 'Withdrawn' }),
});

const JobStatus = Object.freeze({
  OPEN:   Object.freeze({ id: 'open',   tone: 'ok',   pt: 'Aberta',    en: 'Open' }),
  CLOSED: Object.freeze({ id: 'closed', tone: 'mute', pt: 'Encerrada', en: 'Closed' }),
});

/** Cidades atendidas pelo protótipo (região de Jundiaí - SP). */
const City = Object.freeze([
  'Jundiaí', 'Várzea Paulista', 'Campo Limpo Paulista', 'Itupeva',
  'Louveira', 'Vinhedo', 'Cabreúva', 'Itatiba',
]);

/** Utilitário estático para consultar os "enums" (como Enum.valueOf em Java). */
class Enums {
  static list(enumObject) {
    return Object.values(enumObject);
  }

  static byId(enumObject, id) {
    return Object.values(enumObject).find((item) => item.id === id) ?? null;
  }

  static has(enumObject, id) {
    return Enums.byId(enumObject, id) !== null;
  }
}

/** Gera identificadores únicos para as entidades. */
class IdGenerator {
  static #counter = 0;

  static next(prefix) {
    IdGenerator.#counter += 1;
    const stamp = Date.now().toString(36);
    const seq = IdGenerator.#counter.toString(36).padStart(3, '0');
    const rand = Math.floor(Math.random() * 1296).toString(36).padStart(2, '0');
    return `${prefix}_${stamp}${seq}${rand}`;
  }
}
