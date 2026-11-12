/* ============================================================
   VAGGO · models/Application.js
   Candidatura: liga um Professional a um Job.
   O status só muda pelos métodos accept/reject/withdraw —
   ninguém de fora consegue escrever "status = ..." direto.
   ============================================================ */

class Application {
  #id;
  #jobId;
  #professionalId;
  #message;
  #status;
  #createdAt;
  #decidedAt;

  constructor(data = {}) {
    if (!data.jobId || !data.professionalId) throw new ValidationError('application_invalid');
    this.#id = data.id ?? IdGenerator.next('app');
    this.#jobId = data.jobId;
    this.#professionalId = data.professionalId;
    this.#message = String(data.message ?? '').trim().slice(0, 500);
    this.#status = Enums.has(ApplicationStatus, data.status) ? data.status : ApplicationStatus.PENDING.id;
    this.#createdAt = data.createdAt ?? Date.now();
    this.#decidedAt = data.decidedAt ?? null;
  }

  get id() { return this.#id; }
  get jobId() { return this.#jobId; }
  get professionalId() { return this.#professionalId; }
  get message() { return this.#message; }
  get status() { return this.#status; }
  get createdAt() { return this.#createdAt; }
  get decidedAt() { return this.#decidedAt; }

  get isPending() { return this.#status === ApplicationStatus.PENDING.id; }
  /** Ativa = ainda conta como candidatura em andamento ou aprovada. */
  get isActive() {
    return this.#status === ApplicationStatus.PENDING.id || this.#status === ApplicationStatus.ACCEPTED.id;
  }

  // Regra de negócio: só uma candidatura "em análise" pode mudar de estado.
  #transition(nextStatus) {
    if (!this.isPending) throw new ValidationError('application_not_pending');
    this.#status = nextStatus.id;
    this.#decidedAt = Date.now();
  }

  accept() { this.#transition(ApplicationStatus.ACCEPTED); }
  reject() { this.#transition(ApplicationStatus.REJECTED); }
  withdraw() { this.#transition(ApplicationStatus.WITHDRAWN); }

  toJSON() {
    return {
      id: this.#id,
      jobId: this.#jobId,
      professionalId: this.#professionalId,
      message: this.#message,
      status: this.#status,
      createdAt: this.#createdAt,
      decidedAt: this.#decidedAt,
    };
  }
}
