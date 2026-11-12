/* ============================================================
   VAGGO · core/ServiceGuide.js
   Guia de serviços: o que cada trabalho costuma incluir e uma
   dica para cada lado da contratação. Textos em { pt, en }.
   ============================================================ */

class ServiceGuide {
  static #DATA = Object.freeze({
    housekeeper: {
      summary: { pt: 'Cuida da rotina completa da casa, com presença fixa na semana.', en: 'Looks after the whole household routine, on fixed days every week.' },
      includes: [
        { pt: 'Limpeza e organização dos cômodos', en: 'Cleaning and tidying every room' },
        { pt: 'Lavar e passar roupas', en: 'Washing and ironing clothes' },
        { pt: 'Preparo de refeições simples', en: 'Preparing simple meals' },
        { pt: 'Compras e pequenas tarefas do dia a dia', en: 'Shopping and small daily errands' },
      ],
      hire: { pt: 'Liste as tarefas esperadas e os dias de trabalho antes de publicar a vaga.', en: 'List the expected tasks and working days before posting the job.' },
      work: { pt: 'Diga no perfil se você cozinha e quais tarefas prefere assumir.', en: 'Say on your profile whether you cook and which tasks you prefer.' },
    },
    cleaner: {
      summary: { pt: 'Faz a limpeza por diária, nos dias combinados.', en: 'Cleans on a per-day basis, on the days you agree.' },
      includes: [
        { pt: 'Limpeza completa de casa ou apartamento', en: 'Full cleaning of a house or flat' },
        { pt: 'Banheiros, cozinha e área de serviço', en: 'Bathrooms, kitchen and laundry area' },
        { pt: 'Troca de roupas de cama', en: 'Changing bed linen' },
        { pt: 'Faxina pesada, quando combinada', en: 'Deep cleaning, when agreed' },
      ],
      hire: { pt: 'Informe o tamanho do imóvel e se os produtos ficam por sua conta.', en: 'State the size of the home and whether you provide the products.' },
      work: { pt: 'Deixe claro o valor da diária e as cidades que você atende.', en: 'Make your daily rate and the cities you cover clear.' },
    },
    nanny: {
      summary: { pt: 'Acompanha as crianças em casa, com atenção à rotina e à segurança.', en: 'Cares for children at home, with attention to routine and safety.' },
      includes: [
        { pt: 'Alimentação, banho e sono', en: 'Meals, bath time and sleep' },
        { pt: 'Brincadeiras e atividades para a idade', en: 'Play and age-appropriate activities' },
        { pt: 'Levar e buscar na escola', en: 'School drop-off and pick-up' },
        { pt: 'Apoio na lição de casa', en: 'Help with homework' },
      ],
      hire: { pt: 'Combine por escrito os horários, a rotina e quem pode buscar as crianças.', en: 'Agree in writing on hours, routine and who may pick the children up.' },
      work: { pt: 'Cursos de primeiros socorros e referências valorizam o seu perfil.', en: 'First-aid courses and references strengthen your profile.' },
    },
    caregiver: {
      summary: { pt: 'Apoia a pessoa idosa nas atividades do dia, com respeito e paciência.', en: 'Supports an elderly person through the day, with respect and patience.' },
      includes: [
        { pt: 'Higiene e alimentação', en: 'Hygiene and meals' },
        { pt: 'Medicação nos horários prescritos', en: 'Medication at the prescribed times' },
        { pt: 'Companhia, caminhadas e estímulo', en: 'Company, walks and stimulation' },
        { pt: 'Acompanhamento em consultas', en: 'Going along to appointments' },
      ],
      hire: { pt: 'Descreva o grau de autonomia da pessoa e a escala desejada.', en: 'Describe how independent the person is and the schedule you need.' },
      work: { pt: 'Informe sua formação e a experiência com mobilidade reduzida.', en: 'Mention your training and experience with reduced mobility.' },
    },
    cook: {
      summary: { pt: 'Prepara as refeições da casa e cuida da organização da cozinha.', en: 'Prepares the household meals and keeps the kitchen organised.' },
      includes: [
        { pt: 'Almoço e jantar do dia a dia', en: 'Everyday lunch and dinner' },
        { pt: 'Cardápio da semana', en: 'Weekly menu planning' },
        { pt: 'Marmitas e congelados', en: 'Packed meals and freezer portions' },
        { pt: 'Limpeza e organização da cozinha', en: 'Cleaning and organising the kitchen' },
      ],
      hire: { pt: 'Avise sobre restrições alimentares e quantas pessoas comem em casa.', en: 'Mention dietary restrictions and how many people eat at home.' },
      work: { pt: 'Conte que tipos de cozinha você domina e se monta cardápios.', en: 'Say which cuisines you master and whether you plan menus.' },
    },
    gardener: {
      summary: { pt: 'Mantém jardins, gramados e áreas verdes saudáveis.', en: 'Keeps gardens, lawns and green areas healthy.' },
      includes: [
        { pt: 'Corte de grama', en: 'Lawn mowing' },
        { pt: 'Poda de arbustos e cercas vivas', en: 'Pruning shrubs and hedges' },
        { pt: 'Plantio e adubação', en: 'Planting and fertilising' },
        { pt: 'Limpeza de canteiros', en: 'Clearing flower beds' },
      ],
      hire: { pt: 'Informe o tamanho da área e se há equipamentos no local.', en: 'State the size of the area and whether equipment is available.' },
      work: { pt: 'Diga se você tem equipamento próprio e com que frequência atende.', en: 'Say whether you bring your own equipment and how often you can come.' },
    },
    driver: {
      summary: { pt: 'Conduz a família e resolve os deslocamentos da rotina.', en: 'Drives the family and handles the routine trips.' },
      includes: [
        { pt: 'Transporte escolar e de familiares', en: 'School runs and family transport' },
        { pt: 'Idas a consultas e compras', en: 'Trips to appointments and shopping' },
        { pt: 'Entregas e pequenos serviços na rua', en: 'Deliveries and small errands' },
        { pt: 'Cuidados básicos com o veículo', en: 'Basic care of the vehicle' },
      ],
      hire: { pt: 'Informe os trajetos mais comuns e os horários de saída.', en: 'Share the usual routes and departure times.' },
      work: { pt: 'Destaque a categoria da sua CNH e o tempo de habilitação.', en: 'Highlight your licence category and how long you have held it.' },
    },
    laundry: {
      summary: { pt: 'Lava, passa e organiza as roupas da casa.', en: 'Washes, irons and organises the household laundry.' },
      includes: [
        { pt: 'Lavar e separar por tipo de tecido', en: 'Washing and sorting by fabric' },
        { pt: 'Passar camisas, roupas sociais e de cama', en: 'Ironing shirts, formal wear and bed linen' },
        { pt: 'Dobrar e guardar', en: 'Folding and putting away' },
        { pt: 'Cuidado com peças delicadas', en: 'Care for delicate items' },
      ],
      hire: { pt: 'Diga a quantidade média de roupas e se há ferro a vapor.', en: 'Mention the usual amount of laundry and whether there is a steam iron.' },
      work: { pt: 'Informe se você atende por diária ou por quantidade de peças.', en: 'Say whether you charge per day or per number of items.' },
    },
  });

  /** Guia de uma categoria (ou null, se ela ainda não tiver texto). */
  static for(categoryId) {
    return ServiceGuide.#DATA[categoryId] ?? null;
  }
}
