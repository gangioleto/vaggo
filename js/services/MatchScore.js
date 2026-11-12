/* ============================================================
   VAGGO · services/MatchScore.js
   INOVAÇÃO PROPOSTA: nota de compatibilidade (0 a 100) entre
   um profissional e uma vaga, sempre com a explicação do porquê.

   Critérios e pesos:
     - categoria do serviço ........ 50 pontos
     - cidade ...................... 30 pontos
     - tipo de contrato ............ 20 pontos
   ============================================================ */

class MatchScore {
  static WEIGHTS = Object.freeze({ category: 50, city: 30, contract: 20 });

  #parts;

  constructor(professional, job) {
    const W = MatchScore.WEIGHTS;
    this.#parts = Object.freeze([
      Object.freeze({ id: 'category', max: W.category, hit: professional.offers(job.category) }),
      Object.freeze({ id: 'city',     max: W.city,     hit: professional.city === job.city }),
      Object.freeze({ id: 'contract', max: W.contract, hit: professional.isAvailableFor(job.contractType) }),
    ]);
  }

  /** Detalhamento: [{ id, max, hit }] */
  get parts() { return this.#parts; }

  get total() {
    return this.#parts.reduce((sum, part) => sum + (part.hit ? part.max : 0), 0);
  }

  /** Faixa usada para a cor do indicador. */
  get level() {
    if (this.total >= 80) return 'high';
    if (this.total >= 50) return 'mid';
    return 'low';
  }

  static between(professional, job) {
    return new MatchScore(professional, job);
  }
}
