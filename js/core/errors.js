/* ============================================================
   VAGGO · core/errors.js
   Hierarquia de exceções (em Java: class ... extends Exception).
   O "code" é traduzido pela classe I18n na hora de exibir.
   ============================================================ */

class VaggoError extends Error {
  constructor(code, detail = null) {
    super(code);
    this.name = new.target.name; // nome da subclasse concreta
    this.code = code;
    this.detail = detail;
  }
}

/** Dado inválido informado pelo usuário (campo vazio, e-mail errado...). */
class ValidationError extends VaggoError {}

/** Falha de autenticação (login incorreto, sessão ausente). */
class AuthError extends VaggoError {}

/** Usuário autenticado, mas sem permissão para a ação. */
class PermissionError extends VaggoError {}
