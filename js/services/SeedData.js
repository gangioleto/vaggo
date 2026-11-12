/* ============================================================
   VAGGO · services/SeedData.js
   Dados FICTÍCIOS de demonstração (pessoas e vagas inventadas),
   carregados na primeira vez que o app abre.
   Contas de teste — senha de todas: demo1234
     profissional: maria@vaggo.demo
     contratante:  andrade@vaggo.demo
   ============================================================ */

class SeedData {
  static DEMO_PASSWORD = 'demo1234';
  static DEMO_PROFESSIONAL = 'maria@vaggo.demo';
  static DEMO_EMPLOYER = 'andrade@vaggo.demo';

  static build() {
    const DAY = 24 * 60 * 60 * 1000;
    const ago = (days) => Date.now() - Math.round(days * DAY);
    const password = SeedData.DEMO_PASSWORD;

    const employers = [
      new Employer({ id: 'usr_andrade', name: 'Família Andrade', email: SeedData.DEMO_EMPLOYER, phone: '(11) 90000-0101',
        city: 'Jundiaí', employerType: 'family', password, createdAt: ago(40),
        about: 'Casal com duas crianças (3 e 6 anos) no bairro Eloy Chaves.' }),
      new Employer({ id: 'usr_helena', name: 'Helena Vasconcelos', email: 'helena@vaggo.demo', phone: '(11) 90000-0102',
        city: 'Vinhedo', employerType: 'individual', password, createdAt: ago(31),
        about: 'Procuro apoio para os cuidados diários da minha mãe, de 82 anos.' }),
      new Employer({ id: 'usr_residencial', name: 'Residencial Serra do Japi', email: 'serra@vaggo.demo', phone: '(11) 90000-0103',
        city: 'Jundiaí', employerType: 'company', password, createdAt: ago(25),
        about: 'Condomínio residencial com áreas verdes e 48 unidades.' }),
    ];

    const professionals = [
      new Professional({ id: 'usr_maria', name: 'Maria Aparecida Souza', email: SeedData.DEMO_PROFESSIONAL, phone: '(11) 90000-0201',
        city: 'Jundiaí', categories: ['nanny', 'housekeeper'], experienceYears: 8, availability: ['full_time', 'part_time'], password, createdAt: ago(38),
        bio: 'Babá com curso de primeiros socorros infantis. Trabalhei seis anos com a mesma família e tenho referências.' }),
      new Professional({ id: 'usr_joana', name: 'Joana Ribeiro', email: 'joana@vaggo.demo', phone: '(11) 90000-0202',
        city: 'Várzea Paulista', categories: ['cleaner', 'laundry'], experienceYears: 12, availability: ['daily', 'temporary'], password, createdAt: ago(35),
        bio: 'Diarista detalhista, levo meus próprios produtos quando combinado. Atendo casas e apartamentos.' }),
      new Professional({ id: 'usr_sebastiao', name: 'Sebastião Oliveira', email: 'sebastiao@vaggo.demo', phone: '(11) 90000-0203',
        city: 'Itupeva', categories: ['gardener'], experienceYears: 15, availability: ['daily', 'part_time', 'temporary'], password, createdAt: ago(30),
        bio: 'Jardinagem, poda e manutenção de gramados. Tenho equipamento próprio.' }),
      new Professional({ id: 'usr_luciana', name: 'Luciana Ferraz', email: 'luciana@vaggo.demo', phone: '(11) 90000-0204',
        city: 'Vinhedo', categories: ['caregiver'], experienceYears: 6, availability: ['full_time', 'part_time'], password, createdAt: ago(22),
        bio: 'Técnica de enfermagem e cuidadora de idosos. Experiência com mobilidade reduzida e rotina de medicação.' }),
      new Professional({ id: 'usr_rosangela', name: 'Rosângela Pinto', email: 'rosangela@vaggo.demo', phone: '(11) 90000-0205',
        city: 'Jundiaí', categories: ['cook', 'housekeeper'], experienceYears: 20, availability: ['full_time'], password, createdAt: ago(18),
        bio: 'Cozinha caseira e cardápios para a semana. Experiência com restrições alimentares.' }),
      new Professional({ id: 'usr_carlos', name: 'Carlos Eduardo Lima', email: 'carlos@vaggo.demo', phone: '(11) 90000-0206',
        city: 'Campo Limpo Paulista', categories: ['driver'], experienceYears: 9, availability: ['full_time', 'part_time'], password, createdAt: ago(12),
        bio: 'Motorista particular, CNH categoria D. Transporte escolar e de familiares com pontualidade.' }),
      new Professional({ id: 'usr_bruna', name: 'Bruna Martins', email: 'bruna@vaggo.demo', phone: '(11) 90000-0207',
        city: 'Louveira', categories: ['nanny'], experienceYears: 2, availability: ['part_time', 'temporary'], password, createdAt: ago(6),
        bio: 'Estudante de Pedagogia. Cuido de crianças a partir de 2 anos, com atividades e apoio na lição de casa.' }),
    ];

    const jobs = [
      new Job({ id: 'job_baba', employerId: 'usr_andrade', category: 'nanny', city: 'Jundiaí', contractType: 'full_time',
        pay: 2400, payPeriod: 'month', createdAt: ago(2),
        title: { pt: 'Babá para duas crianças', en: 'Nanny for two children' },
        schedule: { pt: 'Segunda a sexta, das 7h30 às 17h', en: 'Monday to Friday, 7:30 am to 5 pm' },
        description: {
          pt: 'Cuidar de duas crianças de 3 e 6 anos: preparar o café da manhã, levar à escola e acompanhar as atividades da tarde. Registro em carteira e vale-transporte.',
          en: 'Care for two children aged 3 and 6: prepare breakfast, take them to school and supervise afternoon activities. Formal contract and transport allowance.' } }),
      new Job({ id: 'job_diarista', employerId: 'usr_andrade', category: 'cleaner', city: 'Jundiaí', contractType: 'daily',
        pay: 190, payPeriod: 'day', createdAt: ago(5),
        title: { pt: 'Diarista para casa de três quartos', en: 'Cleaner for a three-bedroom house' },
        schedule: { pt: 'Toda quinta-feira, 8 horas', en: 'Every Thursday, 8 hours' },
        description: {
          pt: 'Limpeza completa de casa térrea com três quartos e dois banheiros. Produtos e equipamentos fornecidos. Almoço no local.',
          en: 'Full cleaning of a single-storey house with three bedrooms and two bathrooms. Products and equipment provided. Lunch included.' } }),
      new Job({ id: 'job_cuidadora', employerId: 'usr_helena', category: 'caregiver', city: 'Vinhedo', contractType: 'full_time',
        pay: 2900, payPeriod: 'month', createdAt: ago(1),
        title: { pt: 'Cuidadora de idosa com mobilidade reduzida', en: 'Caregiver for an elderly woman with reduced mobility' },
        schedule: { pt: 'Escala 12x36, período diurno', en: '12 hours on, 36 off, day shift' },
        description: {
          pt: 'Acompanhar uma senhora de 82 anos: higiene, alimentação, medicação nos horários e caminhadas curtas. Desejável curso de cuidador ou técnico de enfermagem.',
          en: 'Support an 82-year-old woman: hygiene, meals, medication on schedule and short walks. A caregiver or nursing technician course is desirable.' } }),
      new Job({ id: 'job_cozinheira', employerId: 'usr_helena', category: 'cook', city: 'Vinhedo', contractType: 'part_time',
        pay: 1500, payPeriod: 'month', createdAt: ago(8),
        title: { pt: 'Cozinheira para almoço de segunda a sexta', en: 'Cook for weekday lunches' },
        schedule: { pt: 'Segunda a sexta, das 9h às 13h', en: 'Monday to Friday, 9 am to 1 pm' },
        description: {
          pt: 'Preparar o almoço para três pessoas, com cardápio de baixo teor de sódio. Organização da cozinha ao final do período.',
          en: 'Prepare lunch for three people following a low-sodium menu. Tidy the kitchen at the end of the shift.' } }),
      new Job({ id: 'job_jardineiro', employerId: 'usr_residencial', category: 'gardener', city: 'Jundiaí', contractType: 'part_time',
        pay: 1700, payPeriod: 'month', createdAt: ago(3),
        title: { pt: 'Jardineiro para áreas comuns do condomínio', en: 'Gardener for shared condominium areas' },
        schedule: { pt: 'Três manhãs por semana', en: 'Three mornings a week' },
        description: {
          pt: 'Manutenção de gramados, canteiros e cercas vivas das áreas comuns. Equipamentos fornecidos pelo condomínio.',
          en: 'Maintenance of lawns, flower beds and hedges in shared areas. Equipment provided by the condominium.' } }),
      new Job({ id: 'job_motorista', employerId: 'usr_residencial', category: 'driver', city: 'Jundiaí', contractType: 'temporary',
        pay: 32, payPeriod: 'hour', createdAt: ago(4),
        title: { pt: 'Motorista para transporte de moradores idosos', en: 'Driver for elderly residents' },
        schedule: { pt: 'Terças e sextas, por 3 meses', en: 'Tuesdays and Fridays, for 3 months' },
        description: {
          pt: 'Levar moradores idosos a consultas e compras na região central de Jundiaí. Necessária CNH categoria B ou superior e experiência comprovada.',
          en: 'Drive elderly residents to appointments and shopping in central Jundiaí. Category B licence or higher and proven experience required.' } }),
      new Job({ id: 'job_passadeira', employerId: 'usr_andrade', category: 'laundry', city: 'Várzea Paulista', contractType: 'daily',
        pay: 150, payPeriod: 'day', createdAt: ago(9),
        title: { pt: 'Passadeira quinzenal', en: 'Fortnightly ironing' },
        schedule: { pt: 'Sábados alternados, 6 horas', en: 'Every other Saturday, 6 hours' },
        description: {
          pt: 'Lavar e passar as roupas da família na casa dos avós, em Várzea Paulista. Ferro a vapor e tábua no local.',
          en: 'Wash and iron the family laundry at the grandparents\' house in Várzea Paulista. Steam iron and board available.' } }),
      new Job({ id: 'job_domestica', employerId: 'usr_helena', category: 'housekeeper', city: 'Louveira', contractType: 'full_time',
        pay: 2100, payPeriod: 'month', createdAt: ago(6),
        title: { pt: 'Empregada doméstica para casa de campo', en: 'Housekeeper for a country house' },
        schedule: { pt: 'Segunda a sexta, das 8h às 16h', en: 'Monday to Friday, 8 am to 4 pm' },
        description: {
          pt: 'Limpeza, organização e cuidado com as roupas de uma casa de campo em Louveira. Registro em carteira desde o primeiro dia.',
          en: 'Cleaning, tidying and laundry care for a country house in Louveira. Formal contract from day one.' } }),
    ];

    const applications = [
      new Application({ id: 'app_1', jobId: 'job_diarista', professionalId: 'usr_joana', createdAt: ago(4),
        message: 'Tenho quinta-feira livre e moro perto. Posso começar na próxima semana.' }),
      new Application({ id: 'app_2', jobId: 'job_baba', professionalId: 'usr_bruna', createdAt: ago(1.5),
        message: 'Curso Pedagogia e adoro trabalhar com crianças dessa idade.' }),
      new Application({ id: 'app_3', jobId: 'job_cozinheira', professionalId: 'usr_maria', createdAt: ago(7),
        status: 'rejected', decidedAt: ago(6), message: 'Tenho disponibilidade no período da manhã.' }),
      new Application({ id: 'app_4', jobId: 'job_cuidadora', professionalId: 'usr_luciana', createdAt: ago(0.6),
        message: 'Sou técnica de enfermagem e já trabalhei em escala 12x36.' }),
      new Application({ id: 'app_5', jobId: 'job_jardineiro', professionalId: 'usr_sebastiao', createdAt: ago(2),
        status: 'accepted', decidedAt: ago(1), message: 'Tenho equipamento próprio, se precisar.' }),
    ];

    return { users: [...employers, ...professionals], jobs, applications };
  }
}
