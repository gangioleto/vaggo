/* ============================================================
   VAGGO · ui/ProjectView.js — "O Projeto"
   Apresenta os cinco itens pedidos na Project Proposal:
   0 Integrantes · 1 Nome/Logo · 2 Inovação · 3 Funcionalidades
   · 4 Conceitos de POO com base nas funcionalidades.
   ============================================================ */

class ProjectView extends View {
  static TEAM = Object.freeze([
    { name: 'Arthur Cortez de Azevedo', ra: '2606317' },
    { name: 'Gabriel dos Santos Rodrigues Angioleto', ra: '2601619' },
    { name: 'César Amarez Zotovici', ra: '2614117' },
    { name: 'Leonardo Gabriel de Lima Costa', ra: '2527941' },
    { name: 'Cauã Olaia Ferrari', ra: '2603820' },
  ]);

  static PALETTE = Object.freeze([
    { hex: '#3A49F8', pt: 'Azul principal', en: 'Primary blue', notePt: 'Confiança, tecnologia e oportunidade.', noteEn: 'Trust, technology and opportunity.' },
    { hex: '#1E2432', pt: 'Grafite', en: 'Graphite', notePt: 'Seriedade, estabilidade e segurança.', noteEn: 'Seriousness, stability and safety.' },
    { hex: '#F5F6FA', pt: 'Off white', en: 'Off white', notePt: 'Leveza, clareza e acessibilidade.', noteEn: 'Lightness, clarity and accessibility.' },
  ]);

  /** Atalho: escolhe o texto no idioma atual. */
  #L(pt, en) { return UI.esc(this.lang === 'pt' ? pt : en); }

  #sectionHead(number, pt, en, subPt, subEn) {
    return `
      <header class="psec__head reveal">
        <span class="psec__n">${number}</span>
        <div>
          <h2>${this.#L(pt, en)}</h2>
          <p>${this.#L(subPt, subEn)}</p>
        </div>
      </header>`;
  }

  render() {
    return `
      <section class="pcover">
        <div class="wrap pcover__in">
          <p class="eyebrow eyebrow--light">Project Proposal · Centro Universitário Padre Anchieta</p>
          <h1 class="display lines">
            <span class="line"><span>VAGGO</span></span>
          </h1>
          <p class="pcover__sub fade-up" style="--d:.2s">${this.#L(
            'Conectando profissionais de serviços domésticos e contratantes.',
            'Connecting domestic service professionals and employers.')}</p>
          <dl class="pcover__meta fade-up" style="--d:.3s">
            <div><dt>${this.#L('Curso', 'Course')}</dt><dd>${this.#L('Engenharia de Software', 'Software Engineering')}</dd></div>
            <div><dt>${this.#L('Turma', 'Class')}</dt><dd>A</dd></div>
            <div><dt>${this.#L('Disciplinas', 'Subjects')}</dt><dd>${this.#L('Programação Orientada a Objetos e Professional English', 'Object-Oriented Programming and Professional English')}</dd></div>
          </dl>
        </div>
      </section>

      <div class="wrap project">
        ${this.#team()}
        ${this.#brand()}
        ${this.#innovation()}
        ${this.#features()}
        ${this.#oop()}
      </div>`;
  }

  // ---------- 0 · integrantes ----------
  #team() {
    return `
      <section class="psec">
        ${this.#sectionHead(0, 'Integrantes', 'Team members', 'Nome completo e RA de cada integrante.', 'Full name and student ID (RA) of each member.')}
        <ul class="team">
          ${ProjectView.TEAM.map((m) => {
            const parts = m.name.split(' ');
            const initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            return `
              <li class="member reveal">
                <span class="avatar avatar--lg avatar--blue" aria-hidden="true">${initials}</span>
                <div><b>${UI.esc(m.name)}</b><span class="mono">RA ${m.ra}</span></div>
              </li>`;
          }).join('')}
        </ul>
      </section>`;
  }

  // ---------- 1 · nome e logo ----------
  #brand() {
    const versions = [
      { src: 'assets/logo-symbol.png', pt: 'Abstrata (símbolo)', en: 'Abstract (symbol)', w: 277, h: 219 },
      { src: 'assets/logo-wordmark.png', pt: 'Nominativa (nome)', en: 'Wordmark (name)', w: 496, h: 95 },
      { src: 'assets/logo-full.png', pt: 'Mista (símbolo + nome)', en: 'Combined (symbol + name)', w: 533, h: 130 },
    ];
    const meanings = [
      { pt: 'Letra V', en: 'Letter V', dPt: 'Identidade, direção e confiança.', dEn: 'Identity, direction and trust.' },
      { pt: 'Conexão', en: 'Connection', dPt: 'A órbita azul integra contratantes e profissionais, com agilidade e segurança.', dEn: 'The blue orbit brings employers and professionals together, quickly and safely.' },
      { pt: 'A como casa', en: 'A as a house', dPt: 'A letra A com uma porta representa o lar, o cuidado e os serviços do dia a dia.', dEn: 'The letter A with a door stands for the home, care and everyday services.' },
    ];
    return `
      <section class="psec">
        ${this.#sectionHead(1, 'Nome e logo', 'Name and logo',
          'As três versões da marca, o significado de cada elemento e a paleta de cores.',
          'The three versions of the brand, the meaning of each element and the colour palette.')}
        <div class="logos">
          ${versions.map((v) => `
            <figure class="logo-card reveal">
              <div class="logo-card__art"><img src="${v.src}" alt="VAGGO — ${this.#L(v.pt, v.en)}" width="${v.w}" height="${v.h}" loading="lazy"></div>
              <figcaption>${this.#L(v.pt, v.en)}</figcaption>
            </figure>`).join('')}
        </div>
        <div class="brand-notes">
          <ul class="meanings">
            ${meanings.map((m) => `<li class="reveal"><b>${this.#L(m.pt, m.en)}</b><span>${this.#L(m.dPt, m.dEn)}</span></li>`).join('')}
          </ul>
          <ul class="palette">
            ${ProjectView.PALETTE.map((c) => `
              <li class="reveal">
                <button class="swatch" style="--c:${c.hex}" data-action="copyHex" data-hex="${c.hex}" aria-label="${this.#L('Copiar', 'Copy')} ${c.hex}"></button>
                <div><b>${this.#L(c.pt, c.en)}</b><span class="mono">${c.hex}</span><small>${this.#L(c.notePt, c.noteEn)}</small></div>
              </li>`).join('')}
          </ul>
        </div>
      </section>`;
  }

  // ---------- 2 · inovação ----------
  #innovation() {
    const items = [
      { icon: 'home', pt: 'Um só lugar, feito para o serviço doméstico', en: 'One place, built for domestic work',
        dPt: 'Hoje a contratação acontece por indicação, grupos e redes sociais. O VAGGO reúne vagas e perfis da área em um ambiente organizado, com categorias próprias do setor.',
        dEn: 'Today hiring happens through referrals, groups and social networks. VAGGO gathers jobs and profiles from this field in one organised place, with categories specific to the sector.' },
      { icon: 'target', pt: 'Compatibilidade explicada', en: 'A match score that explains itself',
        dPt: 'Cada vaga recebe uma nota de 0 a 100 para o profissional, calculada por serviço (50), cidade (30) e tipo de contrato (20). A pessoa vê a nota e o motivo de cada ponto.',
        dEn: 'Each job gets a 0–100 score for the professional, based on service (50), city (30) and contract type (20). People see the score and the reason behind every point.' },
      { icon: 'eye', pt: 'Candidatura com status visível', en: 'Applications with a visible status',
        dPt: 'O profissional acompanha cada candidatura — em análise, aceita ou recusada — em vez de esperar uma resposta que nunca chega.',
        dEn: 'Professionals follow every application — under review, accepted or declined — instead of waiting for an answer that never comes.' },
      { icon: 'shield', pt: 'Contato protegido', en: 'Protected contact details',
        dPt: 'Telefone e e-mail do profissional só aparecem para contratantes cadastrados, reduzindo a exposição de dados pessoais.',
        dEn: 'A professional\'s phone and e-mail are shown only to registered employers, reducing exposure of personal data.' },
    ];
    return `
      <section class="psec">
        ${this.#sectionHead(2, 'Inovação proposta', 'Proposed innovation',
          'O que o VAGGO faz de diferente do processo informal de hoje.',
          'What VAGGO does differently from today\'s informal process.')}
        <div class="innov">
          ${items.map((it) => `
            <article class="innov__item reveal">
              <span class="innov__icon">${UI.icon(it.icon, 24)}</span>
              <h3>${this.#L(it.pt, it.en)}</h3>
              <p>${this.#L(it.dPt, it.dEn)}</p>
            </article>`).join('')}
        </div>
      </section>`;
  }

  // ---------- 3 · funcionalidades ----------
  #features() {
    const groups = [
      { pt: 'Para profissionais', en: 'For professionals', icon: 'user', items: [
        ['Criar perfil com serviços, experiência e disponibilidade', 'Create a profile with services, experience and availability', 'Professional'],
        ['Buscar vagas por texto, serviço, cidade e contrato', 'Search jobs by text, service, city and contract', 'Job.matches()'],
        ['Ver a compatibilidade com cada vaga', 'See the match score for each job', 'MatchScore'],
        ['Candidatar-se com mensagem e acompanhar o status', 'Apply with a message and track the status', 'Application'],
        ['Retirar uma candidatura em análise', 'Withdraw an application under review', 'Application.withdraw()'],
      ] },
      { pt: 'Para contratantes', en: 'For employers', icon: 'briefcase', items: [
        ['Cadastrar-se como família, pessoa física ou empresa', 'Register as a family, individual or company', 'Employer'],
        ['Publicar, encerrar e reabrir vagas', 'Publish, close and reopen jobs', 'Job'],
        ['Buscar profissionais por serviço e cidade', 'Search professionals by service and city', 'VaggoPlatform'],
        ['Receber candidaturas com nota de compatibilidade', 'Receive applications with their match score', 'MatchScore'],
        ['Aceitar ou recusar candidaturas', 'Accept or decline applications', 'Application.accept()'],
      ] },
      { pt: 'Para todos', en: 'For everyone', icon: 'users', items: [
        ['Cadastro e login com validação dos dados', 'Sign-up and login with data validation', 'User'],
        ['Painel diferente para cada tipo de usuário', 'A different dashboard for each user type', 'Panel'],
        ['Dados salvos no navegador entre as visitas', 'Data saved in the browser between visits', 'Repository'],
        ['Interface em português e inglês', 'Interface in Portuguese and English', 'I18n'],
      ] },
    ];
    return `
      <section class="psec">
        ${this.#sectionHead(3, 'Funcionalidades do aplicativo', 'App features',
          'Tudo o que aparece aqui funciona neste protótipo. Ao lado, a classe responsável.',
          'Everything listed here works in this prototype. Next to each item, the class behind it.')}
        <div class="feats">
          ${groups.map((g) => `
            <div class="feats__col reveal">
              <h3>${UI.icon(g.icon, 20)}${this.#L(g.pt, g.en)}</h3>
              <ul>${g.items.map(([pt, en, cls]) => `<li><span>${this.#L(pt, en)}</span><code>${UI.esc(cls)}</code></li>`).join('')}</ul>
            </div>`).join('')}
        </div>
      </section>`;
  }

  // ---------- 4 · POO ----------
  #oop() {
    const concepts = [
      { icon: 'lock', pt: 'Encapsulamento', en: 'Encapsulation',
        featPt: 'Funcionalidade: cadastro e login seguros', featEn: 'Feature: safe sign-up and login',
        dPt: 'Os dados ficam em campos privados (#). A senha nunca sai da classe User, e o status da candidatura só muda pelos métodos accept(), reject() e withdraw().',
        dEn: 'Data lives in private fields (#). The password never leaves the User class, and an application\'s status only changes through accept(), reject() and withdraw().',
        code: `class User {
  #passwordHash;               // private

  set email(value) {           // setter valida
    if (!value.includes('@'))
      throw new ValidationError('email_invalid');
    this.#email = value;
  }
  checkPassword(plain) {
    return User.hash(plain) === this.#passwordHash;
  }
}` },
      { icon: 'branch', pt: 'Herança', en: 'Inheritance',
        featPt: 'Funcionalidade: dois tipos de conta', featEn: 'Feature: two account types',
        dPt: 'Professional e Employer herdam de User nome, e-mail, cidade e senha, e acrescentam só o que é próprio de cada um.',
        dEn: 'Professional and Employer inherit name, e-mail, city and password from User, adding only what is specific to each.',
        code: `class Professional extends User {
  #categories;
  #experienceYears;

  constructor(data) {
    super(data);               // construtor de User
    this.categories = data.categories;
  }
}

class Employer extends User { /* ... */ }` },
      { icon: 'cube', pt: 'Abstração', en: 'Abstraction',
        featPt: 'Funcionalidade: salvar os dados', featEn: 'Feature: saving data',
        dPt: 'User, View, Panel e StorageAdapter são classes abstratas: definem o que deve existir, sem dizer como. O sistema salva dados sem saber se é no localStorage ou em memória.',
        dEn: 'User, View, Panel and StorageAdapter are abstract classes: they define what must exist, not how. The system saves data without knowing whether it goes to localStorage or memory.',
        code: `class StorageAdapter {          // "interface"
  constructor() {
    if (new.target === StorageAdapter)
      throw new TypeError('abstract');
  }
  read(key)  { throw new Error('abstract'); }
  write(key, value) { throw new Error('abstract'); }
}

class LocalStorageAdapter extends StorageAdapter { }
class MemoryStorageAdapter extends StorageAdapter { }` },
      { icon: 'shapes', pt: 'Polimorfismo', en: 'Polymorphism',
        featPt: 'Funcionalidade: painel e permissões por perfil', featEn: 'Feature: dashboard and permissions per profile',
        dPt: 'O mesmo método responde de formas diferentes. A plataforma pergunta user.canApply() sem saber o tipo do usuário, e cada tela implementa o seu render().',
        dEn: 'The same method answers differently. The platform asks user.canApply() without knowing the user type, and each screen implements its own render().',
        code: `// User:          canApply() { return false; }
// Professional:  canApply() { return true;  }

apply(jobId) {
  const user = this.currentUser;
  if (!user.canApply())        // sem if de tipo
    throw new PermissionError('only_professionals_apply');
}

view.render();   // HomeView, JobsView, DashboardView...` },
    ];

    const javaRows = [
      ['abstract class User', 'if (new.target === User) throw …'],
      ['private String name;', '#name;'],
      ['public String getName()', 'get name()'],
      ['class Professional extends User', 'class Professional extends User'],
      ['super(name, email);', 'super(data);'],
      ['@Override', this.lang === 'pt' ? 'método redefinido na subclasse' : 'method redefined in the subclass'],
      ['interface StorageAdapter', this.lang === 'pt' ? 'classe abstrata StorageAdapter' : 'abstract class StorageAdapter'],
      ['enum Category { NANNY, … }', 'Object.freeze({ NANNY: … })'],
      ['throw new ValidationException()', 'throw new ValidationError()'],
      ['Repository<T>', 'new Repository(key, storage, revive)'],
    ];

    return `
      <section class="psec">
        ${this.#sectionHead(4, 'Conceitos de POO nas funcionalidades', 'OOP concepts behind the features',
          'Os quatro pilares, cada um ligado a uma funcionalidade real do app.',
          'The four pillars, each tied to a real feature of the app.')}

        <div class="concepts">
          ${concepts.map((c) => `
            <article class="concept reveal">
              <div class="concept__text">
                <span class="concept__icon">${UI.icon(c.icon, 22)}</span>
                <h3>${this.#L(c.pt, c.en)}</h3>
                <p class="concept__feat">${this.#L(c.featPt, c.featEn)}</p>
                <p>${this.#L(c.dPt, c.dEn)}</p>
              </div>
              <pre class="code" tabindex="0"><code>${UI.esc(c.code)}</code></pre>
            </article>`).join('')}
        </div>

        <h3 class="psec__h3 reveal">${this.#L('Diagrama de classes', 'Class diagram')}</h3>
        <div class="diagram reveal">${ProjectView.#diagram(this.lang)}</div>

        <h3 class="psec__h3 reveal">${this.#L('De Java para JavaScript', 'From Java to JavaScript')}</h3>
        <p class="muted reveal">${this.#L(
          'O protótipo roda no navegador, mas segue os mesmos princípios vistos em Java na disciplina.',
          'The prototype runs in the browser but follows the same principles studied in Java in class.')}</p>
        <div class="table-wrap reveal">
          <table class="jtable">
            <thead><tr><th>Java</th><th>JavaScript (VAGGO)</th></tr></thead>
            <tbody>${javaRows.map(([java, js]) => `<tr><td><code>${UI.esc(java)}</code></td><td><code>${UI.esc(js)}</code></td></tr>`).join('')}</tbody>
          </table>
        </div>
      </section>`;
  }

  static #diagram(lang) {
    const box = (x, y, w, h, name, lines = [], stereotype = '') => `
      <g>
        <rect class="d-box" x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/>
        ${stereotype ? `<text class="d-stereo" x="${x + w / 2}" y="${y + 18}" text-anchor="middle">«${stereotype}»</text>` : ''}
        <text class="d-name" x="${x + w / 2}" y="${y + (stereotype ? 37 : 26)}" text-anchor="middle">${name}</text>
        ${lines.map((line, i) => `<text class="d-line" x="${x + 12}" y="${y + (stereotype ? 58 : 48) + i * 17}">${line}</text>`).join('')}
      </g>`;
    const has = lang === 'pt' ? 'publica' : 'posts';
    const sends = lang === 'pt' ? 'envia' : 'sends';
    const to = lang === 'pt' ? 'para' : 'for';
    const manages = lang === 'pt' ? 'gerencia' : 'manages';
    const uses = lang === 'pt' ? 'usa' : 'uses';
    return `
      <svg viewBox="0 0 960 450" role="img" aria-label="${lang === 'pt' ? 'Diagrama de classes do VAGGO' : 'VAGGO class diagram'}">
        <defs>
          <marker id="d-tri" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" orient="auto-start-reverse">
            <path class="d-tri" d="M1 1L11 6L1 11z"/>
          </marker>
        </defs>

        <!-- herança -->
        <path class="d-rel" d="M160 160V136H320V114" marker-end="url(#d-tri)"/>
        <path class="d-rel" d="M480 160V136H320"/>
        <path class="d-rel" d="M752 384V370H810V358" marker-end="url(#d-tri)"/>
        <path class="d-rel" d="M867 384V370H810"/>
        <!-- associações -->
        <path class="d-rel" d="M160 238V310"/>
        <path class="d-rel" d="M480 238V310"/>
        <path class="d-rel" d="M260 349H380"/>
        <path class="d-rel d-rel--dash" d="M700 59H420"/>
        <path class="d-rel d-rel--dash" d="M810 98V160"/>
        <path class="d-rel d-rel--dash" d="M810 238V286"/>

        <text class="d-label" x="168" y="279">1 ${sends} *</text>
        <text class="d-label" x="488" y="279">1 ${has} *</text>
        <text class="d-label" x="320" y="341" text-anchor="middle">* ${to} 1</text>
        <text class="d-label" x="560" y="51" text-anchor="middle">${manages}</text>
        <text class="d-label" x="818" y="134">${uses}</text>
        <text class="d-label" x="818" y="269">${uses}</text>

        ${box(220, 20, 200, 94, 'User', ['# name, email, city', '+ describe()  + canApply()'], 'abstract')}
        ${box(60, 160, 200, 78, 'Professional', ['# categories, experience', '+ offers(category)'])}
        ${box(380, 160, 200, 78, 'Employer', ['# employerType, about', '+ canPostJobs()'])}
        ${box(60, 310, 200, 78, 'Application', ['# status, message', '+ accept()  + reject()'])}
        ${box(380, 310, 200, 78, 'Job', ['# title, pay, status', '+ matches(filter)'])}
        ${box(700, 20, 220, 78, 'VaggoPlatform', ['+ register()  + login()', '+ postJob()  + apply()'])}
        ${box(700, 160, 220, 78, 'Repository', ['+ save(entity)', '+ find(id)  + where(fn)'])}
        ${box(700, 286, 220, 70, 'StorageAdapter', ['+ read()  + write()'], 'abstract')}
        ${box(700, 384, 105, 46, 'LocalStorage')}
        ${box(815, 384, 105, 46, 'Memory')}
      </svg>`;
  }

  get actions() {
    return {
      copyHex: async (el) => {
        try {
          await navigator.clipboard.writeText(el.dataset.hex);
          UI.toast(this.t('toast.copied', { v: el.dataset.hex }));
        } catch {
          UI.toast(el.dataset.hex);
        }
      },
    };
  }
}
