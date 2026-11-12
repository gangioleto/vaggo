/* ============================================================
   VAGGO · core/I18n.js
   Internacionalização: cada chave tem o texto em [português, inglês].
   "{n}" e outros marcadores são trocados por valores.
   "singular|plural" escolhe a forma certa quando há {n}.
   ============================================================ */

class I18n {
  static LANGS = Object.freeze(['pt', 'en']);
  static #STORAGE_KEY = 'vaggo.lang';

  static #TEXTS = Object.freeze({
    // navegação
    'nav.home': ['Início', 'Home'],
    'nav.jobs': ['Vagas', 'Jobs'],
    'nav.pros': ['Profissionais', 'Professionals'],
    'nav.dash': ['Painel', 'Dashboard'],
    'nav.project': ['O Projeto', 'The Project'],
    'skip': ['Pular para o conteúdo', 'Skip to content'],

    // papéis
    'role.professional': ['Profissional', 'Professional'],
    'role.employer': ['Contratante', 'Employer'],

    // início
    'home.hello.morning': ['Bom dia! Como podemos ajudar hoje?', 'Good morning! How can we help today?'],
    'home.hello.afternoon': ['Boa tarde! Como podemos ajudar hoje?', 'Good afternoon! How can we help today?'],
    'home.hello.evening': ['Boa noite! Como podemos ajudar hoje?', 'Good evening! How can we help today?'],
    'home.aud.label': ['Como você quer usar o VAGGO', 'How you want to use VAGGO'],
    'home.aud.employer': ['Quero contratar', 'I want to hire'],
    'home.aud.professional': ['Procuro trabalho', 'I am looking for work'],
    'home.h1a': ['Conectando você', 'Connecting you'],
    'home.h1b.employer': ['ao profissional ideal.', 'to the right professional.'],
    'home.h1b.professional': ['à vaga ideal.', 'to the right job.'],
    'home.lead.employer': [
      'Babás, diaristas, cuidadores e outros profissionais da sua região, com serviços, experiência e disponibilidade no perfil.',
      'Nannies, cleaners, caregivers and other professionals in your region, with services, experience and availability on their profile.'],
    'home.lead.professional': [
      'Vagas de serviço doméstico perto de você, com horário e remuneração informados antes da candidatura.',
      'Domestic service jobs near you, with schedule and pay shown before you apply.'],
    'home.ask.employer': ['De qual serviço você precisa?', 'Which service do you need?'],
    'home.ask.professional': ['Qual serviço você oferece?', 'Which service do you offer?'],
    'home.ask.city': ['Onde?', 'Where?'],
    'home.ask.go': ['Continuar', 'Continue'],
    'home.tag.match': ['compatível com a sua vaga', 'match for your job'],
    'home.tag.accepted': ['Candidatura aceita', 'Application accepted'],
    'home.cats.title': ['Para cada cuidado, uma pessoa de confiança.', 'For every kind of care, someone you can trust.'],
    'home.cats.sub': ['Escolha um serviço e veja as vagas abertas agora.', 'Pick a service and see the jobs open right now.'],
    'home.cats.all': ['Todos os serviços', 'All services'],
    'home.svc.nanny': ['Quem cuida das crianças enquanto você trabalha.', 'Someone to care for the children while you work.'],
    'home.svc.cleaner': ['A casa em ordem, no dia que você combinar.', 'A tidy home, on the day you agree.'],
    'home.svc.caregiver': ['Companhia e cuidado para quem cuidou de você.', 'Company and care for those who cared for you.'],
    'home.svc.gardener': ['Jardins e áreas verdes sempre bem tratados.', 'Gardens and green areas kept in good shape.'],
    'home.tiles.title': ['Contratar e ser contratado, sem adivinhação.', 'Hiring and getting hired, without guesswork.'],
    'home.tiles.sub': ['Quatro coisas que o VAGGO faz diferente.', 'Four things VAGGO does differently.'],
    'home.tile.match.t': ['Compatibilidade explicada', 'A match score that explains itself'],
    'home.tile.match.d': ['Uma nota de 0 a 100 mostra o quanto vaga e profissional combinam, e por quê.', 'A 0–100 score shows how well job and professional fit, and why.'],
    'home.tile.match.a': ['Ver vagas', 'See jobs'],
    'home.tile.status.t': ['Resposta à vista', 'Answers in plain sight'],
    'home.tile.status.d': ['Cada candidatura mostra se está em análise, aceita ou recusada.', 'Each application shows whether it is under review, accepted or declined.'],
    'home.tile.status.a': ['Abrir meu painel', 'Open my dashboard'],
    'home.tile.privacy.t': ['Contato protegido', 'Protected contact details'],
    'home.tile.privacy.d': ['Telefone e e-mail do profissional só aparecem para contratantes cadastrados.', 'A professional\'s phone and e-mail are shown only to registered employers.'],
    'home.tile.privacy.a': ['Conhecer profissionais', 'Meet professionals'],
    'home.tile.place.t': ['Tudo em um só lugar', 'Everything in one place'],
    'home.tile.place.d': ['Vagas e perfis do serviço doméstico reunidos, em vez de espalhados em grupos e indicações.', 'Domestic service jobs and profiles together, instead of scattered across groups and referrals.'],
    'home.tile.place.a': ['Explorar vagas', 'Explore jobs'],
    'home.film.eyebrow': ['Em 8 segundos', 'In 8 seconds'],
    'home.film.title': ['Veja a conexão acontecer.', 'Watch the connection happen.'],
    'home.film.sub': ['Uma família publica a vaga, uma profissional compatível se candidata e a resposta aparece no painel.', 'A family posts the job, a matching professional applies and the answer shows up on the dashboard.'],
    'home.film.cta': ['Conhecer o projeto', 'About the project'],
    'home.guide.title': ['Entenda cada serviço antes de combinar.', 'Understand each service before you agree.'],
    'home.guide.sub': ['O que cada trabalho costuma incluir e o que vale combinar, para quem contrata e para quem trabalha.', 'What each job usually includes and what is worth agreeing on, for those who hire and those who work.'],
    'home.guide.includes': ['Costuma incluir', 'Usually includes'],
    'home.guide.jobs': ['vaga aberta|vagas abertas', 'open job|open jobs'],
    'home.guide.pros': ['profissional|profissionais', 'professional|professionals'],
    'home.guide.pay': ['Remuneração nas vagas abertas', 'Pay in the open jobs'],
    'home.guide.noPay': ['Sem vagas abertas agora', 'No open jobs right now'],
    'home.guide.hire': ['Para quem contrata', 'If you are hiring'],
    'home.guide.work': ['Para quem trabalha', 'If you do the work'],
    'home.guide.seePros': ['Ver profissionais', 'See professionals'],
    'home.guide.seeJobs': ['Ver vagas', 'See jobs'],
    'home.guide.lawTitle': ['Bom saber.', 'Good to know.'],
    'home.guide.law': [
      'Pela Lei Complementar 150/2015, quem trabalha mais de 2 dias por semana na mesma casa é empregado doméstico, com registro em carteira e jornada de até 8 horas por dia e 44 por semana. A escala 12x36 precisa de acordo por escrito. Informação geral, que não substitui orientação profissional.',
      'Under Brazil\'s Complementary Law 150/2015, anyone working more than 2 days a week for the same household is a domestic employee, with a registered work card and up to 8 hours a day and 44 a week. A 12x36 schedule needs a written agreement. General information, not professional advice.'],
    'theme.toDark': ['Mudar para o tema escuro', 'Switch to dark theme'],
    'theme.toLight': ['Mudar para o tema claro', 'Switch to light theme'],
    'home.pulse.pros': ['profissionais na região', 'professionals in the region'],
    'home.pulse.jobs': ['vagas abertas agora', 'jobs open now'],
    'home.pulse.goto': ['Ir direto para', 'Go straight to'],
    'home.fact.jobs': ['vagas abertas', 'open jobs'],
    'home.fact.pros': ['profissionais', 'professionals'],
    'home.fact.cities': ['cidades com vagas', 'cities with jobs'],
    'home.filmAlt': [
      'Animação: um contratante e uma profissional são conectados com 100% de compatibilidade e a candidatura é aceita.',
      'Animation: an employer and a professional are connected with a 100% match and the application is accepted.'],
    'home.cats.count': ['{n} vaga|{n} vagas', '{n} job|{n} jobs'],
    'home.how.title': ['Como funciona', 'How it works'],
    'home.how.sub': ['Três passos para cada lado da contratação.', 'Three steps for each side of hiring.'],
    'home.how.pro': ['Para profissionais', 'For professionals'],
    'home.how.pro.s1.t': ['Crie seu perfil', 'Create your profile'],
    'home.how.pro.s1.d': ['Informe seus serviços, sua experiência e quando pode trabalhar.', 'List your services, your experience and when you can work.'],
    'home.how.pro.s2.t': ['Encontre vagas compatíveis', 'Find matching jobs'],
    'home.how.pro.s2.d': ['As vagas aparecem ordenadas pela compatibilidade com o seu perfil.', 'Jobs are sorted by how well they match your profile.'],
    'home.how.pro.s3.t': ['Candidate-se e acompanhe', 'Apply and follow up'],
    'home.how.pro.s3.d': ['Envie sua candidatura e veja o status de cada uma no painel.', 'Send your application and track each status on your dashboard.'],
    'home.how.emp': ['Para contratantes', 'For employers'],
    'home.how.emp.s1.t': ['Publique a vaga', 'Post the job'],
    'home.how.emp.s1.d': ['Descreva o serviço, a cidade, o horário e a remuneração.', 'Describe the service, city, schedule and pay.'],
    'home.how.emp.s2.t': ['Receba candidaturas', 'Receive applications'],
    'home.how.emp.s2.d': ['Cada candidato chega com perfil completo e nota de compatibilidade.', 'Each candidate arrives with a full profile and a match score.'],
    'home.how.emp.s3.t': ['Escolha com segurança', 'Choose with confidence'],
    'home.how.emp.s3.d': ['Aceite ou recuse com um clique. O profissional vê a resposta no painel dele.', 'Accept or decline in one click. The professional sees the answer on their dashboard.'],
    'home.latest.title': ['Vagas recentes', 'Latest jobs'],
    'home.latest.sub': ['As últimas oportunidades publicadas na região.', 'The most recent opportunities posted in the region.'],
    'home.latest.all': ['Ver todas', 'See all'],
    'home.cta.title': ['Sua próxima conexão começa aqui.', 'Your next connection starts here.'],
    'home.cta.sub': ['Crie sua conta em menos de um minuto.', 'Create your account in under a minute.'],
    'home.cta.pro': ['Sou profissional', 'I am a professional'],
    'home.cta.emp': ['Quero contratar', 'I want to hire'],

    // filtros
    'filter.text': ['Buscar', 'Search'],
    'filter.category': ['Serviço', 'Service'],
    'filter.city': ['Cidade', 'City'],
    'filter.contract': ['Contrato', 'Contract'],
    'filter.allCategories': ['Todos os serviços', 'All services'],
    'filter.allCities': ['Toda a região', 'Whole region'],
    'filter.allContracts': ['Todos os contratos', 'All contracts'],
    'filter.clear': ['Limpar filtros', 'Clear filters'],

    // vagas
    'jobs.title': ['Vagas abertas', 'Open jobs'],
    'jobs.sub': ['Filtre por serviço, cidade e tipo de contrato.', 'Filter by service, city and contract type.'],
    'jobs.count': ['{n} vaga encontrada|{n} vagas encontradas', '{n} job found|{n} jobs found'],
    'jobs.placeholder': ['Ex.: babá, limpeza, Vinhedo', 'E.g. nanny, cleaning, Vinhedo'],
    'jobs.empty.t': ['Nenhuma vaga com esses filtros', 'No jobs match these filters'],
    'jobs.empty.d': ['Tente outra cidade ou remova um filtro.', 'Try another city or remove a filter.'],
    'job.view': ['Ver vaga', 'View job'],
    'job.city': ['Cidade', 'City'],
    'job.contract': ['Contrato', 'Contract'],
    'job.pay': ['Remuneração', 'Pay'],
    'job.schedule': ['Horário', 'Schedule'],
    'job.about': ['Sobre a vaga', 'About the job'],
    'job.loginToApply': ['Crie sua conta de profissional para se candidatar a esta vaga.', 'Create a professional account to apply for this job.'],
    'job.applied': ['Você se candidatou {when}.', 'You applied {when}.'],
    'job.closedNote': ['Esta vaga foi encerrada e não recebe novas candidaturas.', 'This job is closed and no longer accepts applications.'],
    'job.message': ['Mensagem para o contratante (opcional)', 'Message to the employer (optional)'],
    'job.messagePh': ['Conte por que você é uma boa escolha para esta vaga.', 'Say why you are a good fit for this job.'],
    'job.apply': ['Enviar candidatura', 'Send application'],
    'job.yours': ['Esta vaga é sua. {n} candidatura recebida.|Esta vaga é sua. {n} candidaturas recebidas.', 'This is your job. {n} application received.|This is your job. {n} applications received.'],
    'job.manage': ['Gerenciar no painel', 'Manage on dashboard'],
    'job.employerNote': ['Você está em uma conta de contratante. Só profissionais podem se candidatar.', 'You are using an employer account. Only professionals can apply.'],

    // compatibilidade
    'match.title': ['Compatibilidade com o seu perfil', 'Match with your profile'],
    'match.category.hit': ['Você oferece este serviço', 'You offer this service'],
    'match.category.miss': ['Este serviço não está no seu perfil', 'This service is not on your profile'],
    'match.city.hit': ['A vaga é na sua cidade', 'The job is in your city'],
    'match.city.miss': ['A vaga é em outra cidade', 'The job is in another city'],
    'match.contract.hit': ['O contrato combina com sua disponibilidade', 'The contract fits your availability'],
    'match.contract.miss': ['O contrato não está na sua disponibilidade', 'The contract is not in your availability'],

    // profissionais
    'pros.title': ['Profissionais', 'Professionals'],
    'pros.sub': ['Conheça quem oferece serviços domésticos na região.', 'Meet the people offering domestic services in the region.'],
    'pros.count': ['{n} profissional encontrado|{n} profissionais encontrados', '{n} professional found|{n} professionals found'],
    'pros.placeholder': ['Ex.: cuidadora, jardinagem', 'E.g. caregiver, gardening'],
    'pros.empty.t': ['Nenhum profissional com esses filtros', 'No professionals match these filters'],
    'pros.empty.d': ['Tente outro serviço ou outra cidade.', 'Try another service or city.'],
    'pro.view': ['Ver perfil', 'View profile'],
    'pro.services': ['Serviços', 'Services'],
    'pro.availability': ['Disponibilidade', 'Availability'],
    'pro.about': ['Sobre', 'About'],
    'pro.contact': ['Contato', 'Contact'],
    'pro.contactLocked': ['Telefone e e-mail aparecem apenas para contratantes cadastrados.', 'Phone and e-mail are shown only to registered employers.'],

    // conta
    'auth.login': ['Entrar', 'Log in'],
    'auth.create': ['Criar conta', 'Create account'],
    'auth.logout': ['Sair', 'Log out'],
    'auth.iAm': ['Quero usar o VAGGO como', 'I want to use VAGGO as a'],
    'auth.proHint': ['Procuro trabalho', 'I am looking for work'],
    'auth.empHint': ['Quero contratar', 'I want to hire'],
    'auth.demo': ['Só quer conhecer? Entre com uma conta de demonstração.', 'Just looking around? Use a demo account.'],
    'auth.demoPro': ['Entrar como profissional', 'Enter as professional'],
    'auth.demoEmp': ['Entrar como contratante', 'Enter as employer'],
    'f.name': ['Nome completo', 'Full name'],
    'f.email': ['E-mail', 'E-mail'],
    'f.phone': ['Telefone', 'Phone'],
    'f.city': ['Cidade', 'City'],
    'f.password': ['Senha', 'Password'],
    'f.passwordHint': ['Mínimo de 6 caracteres.', 'At least 6 characters.'],
    'f.categories': ['Serviços que você oferece', 'Services you offer'],
    'f.availability': ['Disponibilidade', 'Availability'],
    'f.experience': ['Anos de experiência', 'Years of experience'],
    'f.bio': ['Sobre você', 'About you'],
    'f.bioPh': ['Cursos, referências, o que você faz de melhor.', 'Courses, references, what you do best.'],
    'f.employerType': ['Você contrata como', 'You hire as a'],
    'f.about': ['Sobre a casa ou empresa', 'About the home or company'],
    'f.aboutPh': ['Ex.: casal com duas crianças, casa térrea.', 'E.g. couple with two children, single-storey house.'],
    'profile.edit': ['Editar perfil', 'Edit profile'],
    'profile.save': ['Salvar alterações', 'Save changes'],

    // publicar vaga
    'post.title': ['Publicar vaga', 'Post a job'],
    'post.sub': ['Quanto mais clara a descrição, melhores as candidaturas.', 'The clearer the description, the better the applications.'],
    'post.f.title': ['Título da vaga', 'Job title'],
    'post.f.titlePh': ['Ex.: Diarista para apartamento de dois quartos', 'E.g. Cleaner for a two-bedroom flat'],
    'post.f.schedulePh': ['Ex.: Segunda a sexta, das 8h às 17h', 'E.g. Monday to Friday, 8 am to 5 pm'],
    'post.f.pay': ['Remuneração (R$)', 'Pay (R$)'],
    'post.f.period': ['Pago por', 'Paid per'],
    'post.f.per': ['Por {p}', 'Per {p}'],
    'post.f.description': ['Descrição', 'Description'],
    'post.f.descriptionPh': ['Tarefas, requisitos, benefícios.', 'Tasks, requirements, benefits.'],
    'post.submit': ['Publicar vaga', 'Post job'],

    // painel
    'app.withdraw': ['Retirar candidatura', 'Withdraw'],
    'dash.guest.t': ['Entre para ver o seu painel', 'Log in to see your dashboard'],
    'dash.guest.d': ['Profissionais acompanham candidaturas. Contratantes gerenciam vagas e candidatos.', 'Professionals track applications. Employers manage jobs and candidates.'],
    'dash.pro.find': ['Buscar vagas', 'Search jobs'],
    'dash.pro.sent': ['candidaturas enviadas', 'applications sent'],
    'dash.pro.pending': ['em análise', 'under review'],
    'dash.pro.accepted': ['aceitas', 'accepted'],
    'dash.pro.apps': ['Minhas candidaturas', 'My applications'],
    'dash.pro.empty.t': ['Você ainda não se candidatou', 'You have not applied yet'],
    'dash.pro.empty.d': ['Abra uma vaga e envie sua candidatura. Ela aparece aqui.', 'Open a job and send your application. It will show up here.'],
    'dash.pro.recommended': ['Vagas para você', 'Jobs for you'],
    'dash.pro.recommendedSub': ['As mais compatíveis com o seu perfil.', 'The best matches for your profile.'],
    'dash.emp.open': ['vagas abertas', 'open jobs'],
    'dash.emp.received': ['candidaturas recebidas', 'applications received'],
    'dash.emp.waiting': ['aguardando sua resposta', 'waiting for your answer'],
    'dash.emp.jobs': ['Minhas vagas', 'My jobs'],
    'dash.emp.empty.t': ['Você ainda não publicou vagas', 'You have not posted any jobs yet'],
    'dash.emp.empty.d': ['Publique a primeira e receba candidaturas aqui.', 'Post your first one and receive applications here.'],
    'dash.emp.noApps': ['Nenhuma candidatura recebida ainda.', 'No applications received yet.'],
    'dash.emp.close': ['Encerrar vaga', 'Close job'],
    'dash.emp.reopen': ['Reabrir vaga', 'Reopen job'],
    'dash.emp.accept': ['Aceitar', 'Accept'],
    'dash.emp.reject': ['Recusar', 'Decline'],

    // avisos
    'toast.welcome': ['Olá, {name}!', 'Hello, {name}!'],
    'toast.logout': ['Você saiu da conta.', 'You are logged out.'],
    'toast.applied': ['Candidatura enviada.', 'Application sent.'],
    'toast.withdrawn': ['Candidatura retirada.', 'Application withdrawn.'],
    'toast.accepted': ['Candidatura aceita.', 'Application accepted.'],
    'toast.rejected': ['Candidatura recusada.', 'Application declined.'],
    'toast.posted': ['Vaga publicada.', 'Job posted.'],
    'toast.closed': ['Vaga encerrada.', 'Job closed.'],
    'toast.reopened': ['Vaga reaberta.', 'Job reopened.'],
    'toast.saved': ['Perfil atualizado.', 'Profile updated.'],
    'toast.reset': ['Dados de demonstração restaurados.', 'Demo data restored.'],
    'toast.copied': ['{v} copiado.', '{v} copied.'],

    // rodapé
    'footer.tag': ['Conectando você ao profissional ideal.', 'Connecting you to the right professional.'],
    'footer.note': [
      'Protótipo acadêmico · Engenharia de Software · UniAnchieta. As pessoas e vagas exibidas são fictícias.',
      'Academic prototype · Software Engineering · UniAnchieta. The people and jobs shown are fictional.'],
    'footer.reset': ['Restaurar dados de demonstração', 'Restore demo data'],
    'footer.resetConfirm': ['Apagar tudo e restaurar?', 'Erase everything and restore?'],
    'footer.storage': ['Dados salvos em: {where}', 'Data saved in: {where}'],

    // erros (códigos lançados pelas classes do domínio)
    'err.name_short': ['Informe o nome completo (mínimo de 3 letras).', 'Enter the full name (at least 3 letters).'],
    'err.email_invalid': ['E-mail inválido. Confira o endereço.', 'Invalid e-mail. Check the address.'],
    'err.email_taken': ['Já existe uma conta com este e-mail. Entre nela ou use outro.', 'An account with this e-mail already exists. Log in or use another one.'],
    'err.city_invalid': ['Escolha uma cidade da lista.', 'Pick a city from the list.'],
    'err.password_short': ['A senha precisa ter pelo menos 6 caracteres.', 'The password needs at least 6 characters.'],
    'err.role_invalid': ['Escolha profissional ou contratante.', 'Choose professional or employer.'],
    'err.category_required': ['Marque pelo menos um serviço.', 'Select at least one service.'],
    'err.availability_required': ['Marque pelo menos um tipo de disponibilidade.', 'Select at least one availability option.'],
    'err.experience_invalid': ['Informe os anos de experiência com um número inteiro de 0 a 60.', 'Enter years of experience as a whole number from 0 to 60.'],
    'err.employer_type_invalid': ['Escolha como você contrata.', 'Choose how you hire.'],
    'err.employer_required': ['A vaga precisa de um contratante.', 'The job needs an employer.'],
    'err.title_short': ['O título precisa ter pelo menos 5 caracteres.', 'The title needs at least 5 characters.'],
    'err.description_short': ['Descreva a vaga com pelo menos 20 caracteres.', 'Describe the job in at least 20 characters.'],
    'err.schedule_invalid': ['Horário inválido.', 'Invalid schedule.'],
    'err.contract_invalid': ['Escolha o tipo de contrato.', 'Choose the contract type.'],
    'err.pay_invalid': ['Informe a remuneração com um valor maior que zero.', 'Enter a pay amount greater than zero.'],
    'err.application_invalid': ['Candidatura não encontrada.', 'Application not found.'],
    'err.application_not_pending': ['Esta candidatura já foi respondida.', 'This application has already been answered.'],
    'err.login_required': ['Entre na sua conta para continuar.', 'Log in to continue.'],
    'err.login_invalid': ['E-mail ou senha incorretos.', 'Wrong e-mail or password.'],
    'err.only_employers_post': ['Só contratantes podem publicar vagas.', 'Only employers can post jobs.'],
    'err.only_professionals_apply': ['Só profissionais podem se candidatar.', 'Only professionals can apply.'],
    'err.job_not_found': ['Vaga não encontrada.', 'Job not found.'],
    'err.job_closed': ['Esta vaga já foi encerrada.', 'This job is already closed.'],
    'err.not_job_owner': ['Esta vaga pertence a outro contratante.', 'This job belongs to another employer.'],
    'err.already_applied': ['Você já se candidatou a esta vaga.', 'You have already applied for this job.'],
    'err.not_your_application': ['Esta candidatura não é sua.', 'This application is not yours.'],
    'err.unknown': ['Algo deu errado. Tente de novo.', 'Something went wrong. Try again.'],
  });

  #lang = 'pt';

  constructor() {
    try {
      const saved = window.localStorage.getItem(I18n.#STORAGE_KEY);
      if (I18n.LANGS.includes(saved)) this.#lang = saved;
    } catch { /* sem armazenamento: fica em português */ }
  }

  get lang() { return this.#lang; }

  set lang(value) {
    if (!I18n.LANGS.includes(value)) return;
    this.#lang = value;
    try { window.localStorage.setItem(I18n.#STORAGE_KEY, value); } catch { /* ignora */ }
  }

  has(key) { return key in I18n.#TEXTS; }

  /** Traduz a chave. Chave desconhecida volta como está (facilita achar erros). */
  t(key, vars = {}) {
    const entry = I18n.#TEXTS[key];
    if (!entry) return key;
    let text = entry[I18n.LANGS.indexOf(this.#lang)];
    if (text.includes('|') && vars.n !== undefined) {
      const [one, many] = text.split('|');
      text = Number(vars.n) === 1 ? one : many;
    }
    return text.replace(/\{(\w+)\}/g, (_, name) => (name in vars ? vars[name] : `{${name}}`));
  }

  /** Mensagem amigável para um erro lançado pelo domínio. */
  error(error) {
    const key = `err.${error?.code}`;
    return this.has(key) ? this.t(key) : this.t('err.unknown');
  }

  /** Para testes: todas as chaves existentes. */
  static keys() { return Object.keys(I18n.#TEXTS); }
}
