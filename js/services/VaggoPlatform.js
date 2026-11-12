/* ============================================================
   VAGGO · services/VaggoPlatform.js
   Fachada do sistema: a interface (UI) só conversa com esta classe.
   Aqui ficam as regras de negócio — quem pode publicar, quem pode
   se candidatar, quem pode aceitar ou recusar.
   ============================================================ */

class VaggoPlatform {
  static #KEYS = Object.freeze({
    users: 'vaggo.v1.users',
    jobs: 'vaggo.v1.jobs',
    applications: 'vaggo.v1.applications',
    session: 'vaggo.v1.session',
  });

  #storage;
  #users;
  #jobs;
  #applications;
  #currentUserId = null;
  #listeners = new Set();

  constructor(storage = StorageAdapter.detect()) {
    this.#storage = storage;
    this.#open();
    if (this.#users.size === 0) this.#seed();
    const session = this.#storage.read(VaggoPlatform.#KEYS.session);
    if (session && this.#users.find(session.userId)) this.#currentUserId = session.userId;
  }

  #open() {
    const K = VaggoPlatform.#KEYS;
    this.#users = new Repository(K.users, this.#storage, (d) => UserFactory.create(d));
    this.#jobs = new Repository(K.jobs, this.#storage, (d) => new Job(d));
    this.#applications = new Repository(K.applications, this.#storage, (d) => new Application(d));
  }

  #seed() {
    const data = SeedData.build();
    data.users.forEach((u) => this.#users.save(u));
    data.jobs.forEach((j) => this.#jobs.save(j));
    data.applications.forEach((a) => this.#applications.save(a));
  }

  // ---------- observadores: a UI é avisada quando algo muda ----------
  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  #notify() {
    this.#listeners.forEach((listener) => listener());
  }

  get storageLabel() { return this.#storage.label; }

  // ---------- sessão ----------
  get currentUser() {
    return this.#currentUserId ? this.#users.find(this.#currentUserId) : null;
  }

  #requireUser() {
    const user = this.currentUser;
    if (!user) throw new AuthError('login_required');
    return user;
  }

  #startSession(user) {
    this.#currentUserId = user.id;
    this.#storage.write(VaggoPlatform.#KEYS.session, { userId: user.id });
    this.#notify();
    return user;
  }

  register(data) {
    const email = String(data.email ?? '').trim().toLowerCase();
    if (this.#users.where((u) => u.email === email).length > 0) {
      throw new ValidationError('email_taken');
    }
    const user = UserFactory.create(data); // Professional ou Employer
    this.#users.save(user);
    return this.#startSession(user);
  }

  login(email, password) {
    const clean = String(email ?? '').trim().toLowerCase();
    const user = this.#users.where((u) => u.email === clean)[0];
    if (!user || !user.checkPassword(password)) throw new AuthError('login_invalid');
    return this.#startSession(user);
  }

  logout() {
    this.#currentUserId = null;
    this.#storage.remove(VaggoPlatform.#KEYS.session);
    this.#notify();
  }

  /** Atualiza o perfil do usuário logado usando os setters (que validam). */
  updateProfile(changes) {
    const user = this.#requireUser();
    const before = user.toJSON();
    try {
      for (const [field, value] of Object.entries(changes)) {
        if (field in user && field !== 'id' && field !== 'role') user[field] = value;
      }
    } catch (error) {
      // desfaz alterações parciais se algum campo for inválido
      this.#users.save(UserFactory.create(before));
      throw error;
    }
    this.#users.save(user);
    this.#notify();
    return user;
  }

  // ---------- consultas ----------
  user(id) { return this.#users.find(id); }
  job(id) { return this.#jobs.find(id); }

  searchJobs(filter = {}, { includeClosed = false } = {}) {
    const me = this.currentUser;
    const list = this.#jobs.where((job) => (includeClosed || job.isOpen) && job.matches(filter));
    // POLIMORFISMO: canApply() responde diferente para Professional e Employer.
    if (me?.canApply()) {
      return list.sort((a, b) =>
        MatchScore.between(me, b).total - MatchScore.between(me, a).total || b.createdAt - a.createdAt);
    }
    return list.sort((a, b) => b.createdAt - a.createdAt);
  }

  searchProfessionals({ text = '', category = '', city = '' } = {}) {
    const words = Job.normalize(text).split(/\s+/).filter(Boolean);
    return this.#users
      .where((u) => u instanceof Professional)
      .filter((p) => !category || p.offers(category))
      .filter((p) => !city || p.city === city)
      .filter((p) => {
        const haystack = Job.normalize(`${p.name} ${p.bio} ${p.city} ${p.describe('pt')} ${p.describe('en')}`);
        return words.every((w) => haystack.includes(w));
      })
      .sort((a, b) => b.experienceYears - a.experienceYears);
  }

  jobsOf(employerId) {
    return this.#jobs.where((j) => j.employerId === employerId).sort((a, b) => b.createdAt - a.createdAt);
  }

  applicationsOf(professionalId) {
    return this.#applications
      .where((a) => a.professionalId === professionalId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  applicationsFor(jobId) {
    return this.#applications.where((a) => a.jobId === jobId).sort((a, b) => b.createdAt - a.createdAt);
  }

  /** Candidatura ativa do profissional nesta vaga (ou null). */
  applicationBy(professionalId, jobId) {
    return this.#applications
      .where((a) => a.professionalId === professionalId && a.jobId === jobId)
      .sort((a, b) => b.createdAt - a.createdAt)[0] ?? null;
  }

  stats() {
    const openJobs = this.#jobs.where((j) => j.isOpen);
    return {
      openJobs: openJobs.length,
      professionals: this.#users.where((u) => u instanceof Professional).length,
      employers: this.#users.where((u) => u instanceof Employer).length,
      cities: new Set(openJobs.map((j) => j.city)).size,
    };
  }

  /** Quantas vagas abertas existem em cada categoria. */
  jobsPerCategory() {
    const count = {};
    this.#jobs.where((j) => j.isOpen).forEach((j) => { count[j.category] = (count[j.category] ?? 0) + 1; });
    return count;
  }

  // ---------- ações do contratante ----------
  postJob(data) {
    const user = this.#requireUser();
    if (!user.canPostJobs()) throw new PermissionError('only_employers_post');
    const job = new Job({ ...data, employerId: user.id });
    this.#jobs.save(job);
    this.#notify();
    return job;
  }

  #ownedJob(jobId) {
    const user = this.#requireUser();
    const job = this.#jobs.find(jobId);
    if (!job) throw new ValidationError('job_not_found');
    if (job.employerId !== user.id) throw new PermissionError('not_job_owner');
    return job;
  }

  closeJob(jobId) {
    const job = this.#ownedJob(jobId);
    job.close();
    this.#jobs.save(job);
    this.#notify();
  }

  reopenJob(jobId) {
    const job = this.#ownedJob(jobId);
    job.reopen();
    this.#jobs.save(job);
    this.#notify();
  }

  /** Aceita (true) ou recusa (false) uma candidatura recebida. */
  decide(applicationId, accept) {
    const application = this.#applications.find(applicationId);
    if (!application) throw new ValidationError('application_invalid');
    this.#ownedJob(application.jobId); // garante que a vaga é do usuário logado
    if (accept) application.accept(); else application.reject();
    this.#applications.save(application);
    this.#notify();
    return application;
  }

  // ---------- ações do profissional ----------
  apply(jobId, message = '') {
    const user = this.#requireUser();
    if (!user.canApply()) throw new PermissionError('only_professionals_apply');
    const job = this.#jobs.find(jobId);
    if (!job) throw new ValidationError('job_not_found');
    if (!job.isOpen) throw new ValidationError('job_closed');
    const previous = this.applicationBy(user.id, jobId);
    if (previous?.isActive) throw new ValidationError('already_applied');
    const application = new Application({ jobId, professionalId: user.id, message });
    this.#applications.save(application);
    this.#notify();
    return application;
  }

  withdraw(applicationId) {
    const user = this.#requireUser();
    const application = this.#applications.find(applicationId);
    if (!application || application.professionalId !== user.id) throw new PermissionError('not_your_application');
    application.withdraw();
    this.#applications.save(application);
    this.#notify();
  }

  matchFor(job, professional = this.currentUser) {
    return professional instanceof Professional ? MatchScore.between(professional, job) : null;
  }

  /** Apaga tudo e recarrega os dados de demonstração. */
  resetDemo() {
    this.#users.clear();
    this.#jobs.clear();
    this.#applications.clear();
    this.#storage.remove(VaggoPlatform.#KEYS.session);
    this.#currentUserId = null;
    this.#open();
    this.#seed();
    this.#notify();
  }
}
