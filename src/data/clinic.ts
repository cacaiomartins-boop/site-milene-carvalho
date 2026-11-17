// Todo o conteúdo do site fica aqui. Os componentes só leem este arquivo.
// Trechos com "TODO" são dados que ainda precisam ser confirmados com a Milene.
// Textos com *asteriscos* viram itálico na cor de destaque.

export const clinic = {
  name: "Milene Carvalho",
  firstName: "Milene",
  role: "Psicóloga",
  roleClinical: "Psicóloga clínica",
  // TODO: confirmar com a Milene. No Doctoralia aparece "CRP DF 31630" (DF = CRP-01).
  registry: "CRP 01/31630",
  registryVerifyUrl: "https://cadastro.cfp.org.br/",
  councilName: "CRP",
  // TODO: confirmar. Este é o telefone que aparece no Doctoralia (ligado à Migrapsi).
  whatsapp: "5561992576262",
  whatsappDisplay: "(61) 99257-6262",
  email: "", // TODO (opcional)
  instagram: "", // TODO: ela quer um Instagram só dela; o da Migrapsi não foi usado
  doctoraliaUrl: "https://www.doctoralia.com.br/perfil/milene-carvalho-2",
  siteUrl: "", // TODO: domínio (ela vai descobrir com a sócia onde está registrado)
  city: "Brasília",
  uf: "DF",
  district: "Asa Norte",
  street: "SCN Quadra 1, Bloco E",
  building: "Ed. Central Park", // TODO: confirmar sala (Doctoralia mostra "Salas 1809 a 1910")
  cep: "70740-610",
  placeName: "Ed. Central Park",
  addressLine: "SCN Quadra 1, Bloco E · Ed. Central Park · Asa Norte · Brasília-DF · CEP 70740-610",
  mapQuery: "Edifício Central Park, SCN Quadra 1 Bloco E, Asa Norte, Brasília, DF, 70740-610",
  mapStreetLabel: "SCN · Quadra 1",
  mapAvenueLabel: "Brasília · DF",
  hours: "Atendimento com hora marcada. Dias e horários combinados pelo WhatsApp.", // TODO: horários reais
  tagline: "Mente em ordem. *Vida com mais leveza.*",
  heroPhoto: "/img/milene-hero.webp",
  aboutPhoto: "/img/milene-sobre.webp",
  rating: { value: "5,0", count: 23 },
};

export const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(clinic.mapQuery)}&output=embed`;
export const mapDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(clinic.mapQuery)}`;
export const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(clinic.mapQuery)}&navigate=yes`;

export const waMessages = {
  header: "gostaria de agendar uma conversa.",
  general: "gostaria de agendar um horário para terapia.",
  presencial: "gostaria de agendar um horário no consultório em Brasília.",
  online: "gostaria de saber como funciona a terapia online.",
  exterior: "moro fora do Brasil e gostaria de saber como funciona a terapia online.",
  duvida: "tenho uma dúvida antes de agendar:",
  espelho: "me reconheci em algumas daquelas frases e gostaria de conversar.",
  sobre: "gostaria de agendar minha primeira sessão.",
  processo: "gostaria de dar o primeiro passo e agendar uma conversa.",
  contato: "gostaria que você me chamasse.",
} as const;

export type WaKey = keyof typeof waMessages;

export function waLink(message: string) {
  const text = `Olá, ${clinic.firstName}! Vim pelo site e ${message}`;
  return `https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent(text)}`;
}
export function waKeyLink(key: WaKey) {
  return waLink(waMessages[key]);
}
export function waTopicLink(topic: string) {
  return waLink(`me identifiquei com o tema ${topic}. Gostaria de agendar um horário.`);
}

export const nav = [
  { label: "Sobre", href: "#sobre" },
  { label: "Como posso ajudar", href: "#como-ajudo", dropdown: true },
  { label: "Consultório", href: "#consultorio" },
  { label: "Dúvidas", href: "#duvidas" },
  { label: "Como funciona", href: "#processo", xlOnly: true },
];

// ---------- Hero ----------
export const hero = {
  eyebrow: ["TCC", "Adultos e casais", "Brasil e exterior"],
  title: "Mais clareza na mente, mais leveza *na vida.*",
  subtitle:
    "Psicoterapia cognitivo-comportamental para adultos que querem entender o que sentem e construir novos caminhos. Em Brasília ou online, de onde você estiver, no Brasil ou no exterior.",
  primary: "Começar meu processo",
  secondary: "Como funciona",
  credential: `${clinic.name} · ${clinic.registry}`,
  modality: "Presencial em Brasília e online",
  cue: "Você não precisa dar conta de tudo sozinho.",
};

// ---------- Espelho ----------
export const mirror = {
  title: "Talvez você se reconheça *em algumas destas frases.*",
  lines: [
    "Minha cabeça não desliga e eu vivo esperando o pior.",
    "Eu sei o que quero mudar, mas acabo repetindo os mesmos hábitos.",
    "Moro longe de casa e, às vezes, a saudade pesa mais do que eu admito.",
    "Sinto que preciso dar conta de tudo sem pedir ajuda.",
    "A vontade que tenho é de sumir.",
    "As brigas no meu relacionamento parecem sempre as mesmas.",
    "Meu corpo ou minha saúde mudaram minha rotina, e minha cabeça também sentiu.",
  ],
  closing:
    "Se alguma frase soou familiar, você não está exagerando e não precisa passar por isso sozinho. Conversar é o primeiro passo.",
  button: "Quero conversar sobre isso",
};

// ---------- Manifesto ----------
export const manifesto = {
  // TODO: Milene precisa aprovar este texto
  sentence:
    "Cuidar da mente é aprender a organizar o que se sente, com escuta, ética e respeito pela história de cada pessoa.",
  quote: "Como uma árvore que firma as raízes antes de crescer, a mudança começa por dentro.",
  values: ["Escutar", "Compreender", "Acolher", "Transformar"],
};

// ---------- Temas ----------
export interface Topic {
  slug: string;
  number: string;
  label: string;
  question: string;
  description: string;
  button: string;
  pageTitle: string;
  heroTitle: [string, string];
  intro: string;
  recognize: string[];
  paths: { title: string; text: string }[];
  approach: string;
  faq: { q: string; a: string }[];
  metaDescription: string;
}

export const topics: Topic[] = [
  {
    slug: "ansiedade",
    number: "01",
    label: "Ansiedade e estresse",
    question: "Sua mente *não desacelera?*",
    description:
      "Preocupação constante, tensão no corpo, medo de que algo dê errado. Na terapia, você entende esse ciclo e aprende a atravessá-lo com mais calma.",
    button: "Conversar sobre isso",
    pageTitle: "Ansiedade e estresse",
    heroTitle: ["Quando a mente corre,", "*o corpo cansa junto.*"],
    intro:
      "Ansiedade, estresse e baixa tolerância à frustração costumam andar juntos. A terapia cognitivo-comportamental ajuda você a identificar os pensamentos e hábitos que alimentam esse ciclo, com um passo de cada vez.",
    recognize: [
      "Penso em tudo que pode dar errado antes mesmo de acontecer.",
      "Sinto o corpo tenso, o coração acelerado ou o sono leve.",
      "Evito situações porque tenho medo de não dar conta.",
      "Qualquer imprevisto me tira do eixo.",
    ],
    paths: [
      { title: "Entender o ciclo", text: "Mapeamos como pensamentos, emoções e comportamentos se alimentam no seu dia a dia." },
      { title: "Ganhar recursos", text: "Você pratica estratégias concretas para lidar com a preocupação e com as reações do corpo." },
      { title: "Voltar a escolher", text: "Com mais clareza, fica mais fácil enfrentar o que antes era evitado, no seu ritmo." },
    ],
    approach:
      "Na TCC, o trabalho é estruturado e colaborativo: combinamos objetivos juntos, observamos o que acontece na sua rotina e testamos novas formas de pensar e agir. Sem pressa e sem julgamento.",
    faq: [
      { q: "Ansiedade tem tratamento?", a: "A psicoterapia é um dos caminhos mais estudados para lidar com a ansiedade. Não prometo prazos ou resultados, mas posso garantir um acompanhamento ético e cuidadoso. Quando necessário, trabalhamos em conjunto com o médico que acompanha você." },
      { q: "Preciso estar em crise para procurar ajuda?", a: "Não. Muita gente começa por sentir que está no limite, mas também há quem procure ajuda para se conhecer melhor e prevenir o desgaste." },
    ],
    metaDescription:
      "Terapia para ansiedade e estresse em Brasília e online com Milene Carvalho, psicóloga (TCC). Converse pelo WhatsApp.",
  },
  {
    slug: "depressao-e-autoestima",
    number: "02",
    label: "Depressão e autoestima",
    question: "Tudo pesa mais *do que deveria?*",
    description:
      "Desânimo, culpa, a sensação de que você nunca é suficiente. A terapia abre espaço para você entender o que sente e reconstruir a relação consigo mesmo.",
    button: "Quero cuidar de mim",
    pageTitle: "Depressão e autoestima",
    heroTitle: ["Quando o peso não passa,", "*você merece apoio.*"],
    intro:
      "Tristeza persistente, falta de energia e uma voz interna muito dura são sinais que merecem atenção. Aqui você encontra um espaço de escuta para compreender o que está acontecendo e reconstruir a confiança em si.",
    recognize: [
      "Perdi o interesse por coisas que antes me faziam bem.",
      "Me cobro demais e me elogio de menos.",
      "Sinto culpa ou vergonha com frequência.",
      "Acordo cansado, mesmo depois de dormir.",
    ],
    paths: [
      { title: "Acolher o que dói", text: "Primeiro, um lugar seguro para falar sem ser julgado." },
      { title: "Rever a voz interna", text: "Identificamos pensamentos automáticos que alimentam a autocrítica e construímos outros mais justos." },
      { title: "Retomar a rotina", text: "Pequenas ações, combinadas com você, ajudam a recuperar energia e sentido." },
    ],
    approach:
      "A TCC trabalha a relação entre pensamentos, emoções e comportamentos. O processo é construído a quatro mãos, respeitando o seu tempo e a sua história. Se houver necessidade, indico avaliação médica complementar.",
    faq: [
      { q: "Terapia substitui o acompanhamento médico?", a: "A psicoterapia pode caminhar junto com o acompanhamento médico, quando ele é necessário. Eu não prescrevo medicação; posso orientar quando perceber que uma avaliação médica seria importante." },
      { q: "E se eu não souber explicar o que sinto?", a: "Está tudo bem. Não é preciso chegar com as palavras prontas, vamos encontrá-las juntos ao longo das conversas." },
    ],
    metaDescription:
      "Terapia para depressão e baixa autoestima em Brasília e online com Milene Carvalho, psicóloga (TCC).",
  },
  {
    slug: "relacionamentos",
    number: "03",
    label: "Relacionamentos e casal",
    question: "As mesmas brigas *voltam sempre?*",
    description:
      "Conflitos de casal, separação, dependência emocional. Um espaço para olhar para a relação, e para o seu papel nela, com mais clareza.",
    button: "Conversar sobre isso",
    pageTitle: "Relacionamentos e casal",
    heroTitle: ["Mudam as pessoas,", "*e a história parece a mesma?*"],
    intro:
      "Relações trazem alegria e também desgaste. Seja individualmente ou em casal, a terapia ajuda a comunicar melhor, a entender padrões que se repetem e a atravessar decisões difíceis, como uma separação.",
    recognize: [
      "Discutimos sempre pelos mesmos motivos.",
      "Tenho dificuldade de dizer o que realmente sinto.",
      "Permaneço em relações que me machucam por medo de ficar sozinho.",
      "Estou passando por uma separação e não sei como seguir.",
    ],
    paths: [
      { title: "Olhar para os padrões", text: "Identificamos o que se repete e o que sustenta esses ciclos." },
      { title: "Comunicar melhor", text: "Você treina formas mais claras e gentis de se posicionar." },
      { title: "Decidir com consciência", text: "Seja para reconstruir, seja para encerrar, com mais segurança sobre o que você quer." },
    ],
    approach:
      "Atendo adultos individualmente e também casais. Em casal, o espaço é de escuta para os dois, de maneira imparcial. Pergunte pelo WhatsApp como funciona.",
    faq: [
      { q: "Vocês atendem casais?", a: "Sim. Também atendo casais e pessoas em processo de separação. Converse comigo pelo WhatsApp para combinarmos o formato." },
      { q: "Dependência emocional também é tratada?", a: "Sim. É um dos temas que acompanho, sempre com acolhimento e sem julgamentos." },
    ],
    metaDescription:
      "Terapia individual e de casal em Brasília e online com Milene Carvalho, psicóloga (TCC). Conflitos, separação e dependência emocional.",
  },
  {
    slug: "compulsoes-e-habitos",
    number: "04",
    label: "Compulsões e hábitos",
    question: "Você sabe o que quer mudar, *mas repete?*",
    description:
      "Compulsão alimentar, TOC, fobias, vícios em jogos ou pornografia. Entender o que sustenta o hábito é o primeiro passo para mudá-lo.",
    button: "Quero entender isso",
    pageTitle: "Compulsões e hábitos",
    heroTitle: ["Repetir não é falta de força.", "*Tem uma razão por trás.*"],
    intro:
      "Compulsão alimentar, TOC, fobias, vício em jogos ou pornografia costumam vir acompanhados de culpa e vergonha. Aqui o foco é compreender o que mantém esse comportamento, sem julgamentos.",
    recognize: [
      "Prometo que vou parar, mas acabo repetindo.",
      "Sinto culpa ou vergonha depois.",
      "Pensamentos ou rituais tomam muito do meu tempo.",
      "Escondo isso das pessoas próximas.",
    ],
    paths: [
      { title: "Sem julgamento", text: "Você pode falar abertamente sobre o que acontece e como se sente." },
      { title: "Mapear gatilhos", text: "Identificamos situações, pensamentos e emoções que antecedem o comportamento." },
      { title: "Construir alternativas", text: "Você pratica novas respostas, de forma gradual e combinada." },
    ],
    approach:
      "A TCC é uma das abordagens mais usadas para compulsões, TOC e fobias. O trabalho é gradual, com metas realistas e tarefas combinadas entre as sessões.",
    faq: [
      { q: "Tenho vergonha de falar sobre isso.", a: "É comum, e é por isso que o sigilo e a ausência de julgamento são a base do nosso trabalho." },
      { q: "Quanto tempo leva?", a: "Cada pessoa tem o seu ritmo. Não faço promessas de prazo, mas combinamos metas e revisamos o caminho juntos." },
    ],
    metaDescription:
      "Terapia para compulsão alimentar, TOC, fobias e vícios em Brasília e online com Milene Carvalho, psicóloga (TCC).",
  },
  {
    slug: "saude-e-doenca-cronica",
    number: "05",
    label: "Saúde e doença crônica",
    question: "Quando o corpo adoece, *a mente também sente?*",
    description:
      "Dor crônica, doença crônica, tratamento oncológico. Apoio psicológico para atravessar o cuidado com a saúde com mais suporte emocional.",
    button: "Conversar sobre isso",
    pageTitle: "Saúde e doença crônica",
    heroTitle: ["Cuidar do corpo", "*também é cuidar de como você se sente.*"],
    intro:
      "Conviver com uma dor persistente, uma doença crônica ou um tratamento oncológico mexe com a rotina, com os planos e com as emoções. A psicoterapia oferece um espaço para elaborar tudo isso.",
    recognize: [
      "Minha rotina mudou e eu ainda estou me adaptando.",
      "Tenho medo do futuro ou do resultado dos exames.",
      "Me sinto sozinho no meio do tratamento.",
      "A dor ou a doença afeta meu humor e meu sono.",
    ],
    paths: [
      { title: "Acolher o impacto", text: "Espaço para falar do medo, da raiva, da tristeza e do cansaço." },
      { title: "Lidar com os sintomas", text: "Estratégias para manejar a dor, o estresse e as preocupações do dia a dia." },
      { title: "Trabalhar em rede", text: "Quando fizer sentido, o cuidado psicológico caminha junto com a equipe de saúde." },
    ],
    approach:
      "Tenho experiência em ambiente hospitalar e em atenção a pacientes em atenção interdisciplinar. O acompanhamento é individual e respeita o seu momento de tratamento.",
    faq: [
      { q: "A terapia online serve para quem está em tratamento?", a: "Sim, muita gente prefere o online pela comodidade, especialmente em fases de cansaço ou de deslocamentos difíceis." },
      { q: "Vocês atendem familiares?", a: "Pergunte pelo WhatsApp. Posso orientar sobre o melhor formato para cada situação." },
    ],
    metaDescription:
      "Apoio psicológico para dor crônica, doenças crônicas e tratamento oncológico, em Brasília e online com Milene Carvalho.",
  },
  {
    slug: "brasileiros-no-exterior",
    number: "06",
    label: "Brasileiros no exterior",
    question: "Longe de casa, *mas não precisa estar sozinho.*",
    description:
      "Adaptação, saudade, identidade, o peso do processo de imigração. Terapia online em português, no seu fuso e no seu ritmo.",
    button: "Saber mais",
    pageTitle: "Brasileiros no exterior",
    heroTitle: ["Seu mundo mudou de lugar.", "*Seu cuidado pode acompanhar.*"],
    intro:
      "Viver em outro país traz oportunidades e também perdas: distância da família, burocracias, adaptação cultural, um idioma que não é o seu. Atendo brasileiros no exterior em português, por videochamada.",
    recognize: [
      "Sinto saudade, mas não sei com quem dividir.",
      "O processo de imigração me deixou exausto.",
      "Às vezes não me sinto parte de nenhum lugar.",
      "Quero conversar na minha língua, sem precisar traduzir o que sinto.",
    ],
    paths: [
      { title: "Falar na sua língua", text: "Português, com sensibilidade para a realidade de quem vive fora." },
      { title: "Atravessar a adaptação", text: "Espaço para elaborar mudanças, perdas, expectativas e pressões." },
      { title: "Construir pertencimento", text: "Fortalecer sua rede e a relação com a nova vida, sem perder suas raízes." },
    ],
    approach:
      "Tenho experiência no acompanhamento de brasileiros que vivem fora e no processo de imigração. O atendimento é online e segue as normas do Conselho Federal de Psicologia.",
    faq: [
      { q: "Posso fazer terapia morando em outro país?", a: "Sim, brasileiros no exterior podem ser atendidos online, conforme as normas do Conselho Federal de Psicologia. Chame pelo WhatsApp para combinarmos horários que funcionem no seu fuso." },
      { q: "Como funciona o fuso horário?", a: "Combinamos o melhor horário para você, considerando a diferença entre Brasília e o lugar onde você mora." },
    ],
    metaDescription:
      "Terapia online para brasileiros que moram no exterior, com Milene Carvalho, psicóloga (TCC). Atendimento em português.",
  },
  {
    slug: "terapia-online",
    number: "07",
    label: "Terapia online",
    question: "Cuidado de verdade, *de onde você estiver.*",
    description:
      "Videochamada em plataforma segura, com a mesma escuta e o mesmo sigilo do consultório. Para todo o Brasil e brasileiros no exterior.",
    button: "Saber sobre a terapia online",
    pageTitle: "Terapia online",
    heroTitle: ["A distância não muda", "*a qualidade do cuidado.*"],
    intro:
      "A terapia online permite que você faça terapia sem enfrentar trânsito, mesmo em dias corridos ou em outra cidade ou país. A escuta, o sigilo e o compromisso ético são os mesmos do consultório.",
    recognize: [
      "Moro em outra cidade ou país.",
      "Minha rotina é corrida e perder tempo no trânsito pesa.",
      "Me sinto mais à vontade em casa.",
      "Quero começar, mas não sei se vou me adaptar ao online.",
    ],
    paths: [
      { title: "Só precisa de um lugar reservado", text: "Um espaço tranquilo, boa conexão e fones de ouvido." },
      { title: "Plataforma segura", text: "A sessão acontece por videochamada, com o sigilo que a psicoterapia exige." },
      { title: "Todo o Brasil", text: "Atendimento para qualquer estado, e para brasileiros que moram fora." },
    ],
    approach:
      "Seguimos as normas do Conselho Federal de Psicologia para atendimento online. Se, ao longo do processo, perceber que o presencial é mais adequado, conversamos sobre isso.",
    faq: [
      { q: "A terapia online funciona?", a: "Sim. Ela é reconhecida pelo Conselho Federal de Psicologia e, para muitas pessoas, funciona tão bem quanto a presencial. Na primeira conversa avaliamos juntos se esse formato faz sentido para você." },
      { q: "Preciso de algum aplicativo?", a: "Combinamos a plataforma pelo WhatsApp. Geralmente basta um celular ou computador com câmera e internet." },
    ],
    metaDescription:
      "Terapia online para todo o Brasil e brasileiros no exterior com Milene Carvalho, psicóloga (TCC).",
  },
];

// ---------- Sobre ----------
export const about = {
  title: "Prazer, *eu sou a Milene.*",
  paragraphs: [
    "Sou psicóloga clínica, especialista em Terapia Cognitivo-Comportamental. Atendo adultos que estão passando por sofrimento emocional e procuram uma profissional experiente, ética e acolhedora.",
    "Tenho experiência clínica em saúde mental, com passagem pelo Hospital Professor Carvalho Luz e sou sócia diretora da Migrapsi Clínica de Gestão em Saúde. Também acompanho brasileiros que vivem no exterior e conheço os desafios do processo de imigração.",
    "Aqui, o espaço é de cuidado e escuta. Cada pessoa tem a sua história, e o trabalho respeita essas singularidades, com base em psicoterapia baseada em evidências.",
  ],
  facts: [
    { label: "Especialidade", value: "Terapia Cognitivo-Comportamental (TCC)" },
    { label: "Experiência", value: "Hospital Professor Carvalho Luz · Migrapsi Clínica de Gestão em Saúde" }, // TODO: confirmar nomes e períodos
    { label: "Abordagem", value: "Terapia Cognitivo-Comportamental (TCC)\nPsicoterapia baseada em evidências" },
  ],
  button: "Agendar minha primeira sessão",
  sealText: `PSICÓLOGA CLÍNICA · ${clinic.registry} · PRESENCIAL E ONLINE · `,
  statLabel: "avaliações com nota 5,0 no Doctoralia",
};

// ---------- Processo ----------
export const process = {
  title: "Começar pode ser *mais simples do que parece.*",
  intro:
    "Não é preciso chegar com tudo resolvido, nem saber o que dizer. Você manda uma mensagem e eu cuido do resto, com calma.",
  steps: [
    { title: "Uma mensagem", text: "Você me chama pelo WhatsApp e combinamos dia, horário e formato, presencial ou online." },
    { title: "A primeira sessão", text: "Sem pressa e sem julgamentos. Nos conhecemos, você conta o que te trouxe e eu explico como posso ajudar." },
    { title: "Um caminho sob medida", text: "Definimos juntos os objetivos do trabalho, respeitando o que faz sentido para você." },
    { title: "Sessões regulares", text: "Seguimos com encontros em uma frequência combinada, revisando o caminho ao longo do tempo." },
  ],
  closing: "Você decide, a cada passo, se e como quer seguir.",
  button: "Dar o primeiro passo",
};

// ---------- Consultório + online ----------
export const office = {
  title: "Um espaço de cuidado em Brasília, *ou onde você estiver.*",
  h3: "Consultório na Asa Norte",
  text: "Atendimento presencial com hora marcada, no Ed. Central Park, na SCN Quadra 1. Pergunte pelo WhatsApp sobre acesso e estacionamento.",
  chips: ["Atendimento com hora marcada"],
  onlineTitle: "Terapia online",
  onlineText:
    "A mesma escuta e o mesmo sigilo do consultório, por videochamada, no conforto de onde você estiver.",
  onlineItems: [
    "Videochamada em plataforma segura",
    "Basta um lugar reservado, boa conexão e fones de ouvido",
    "Atendimento para todo o Brasil, conforme as normas do conselho",
  ],
  abroadTitle: "Terapia online para brasileiros no exterior",
  abroadText: "Em português, com horários combinados conforme o seu fuso.",
};

// ---------- Avaliações (Doctoralia, textos públicos, só com iniciais) ----------
export const reviews = [
  { text: "Excelente profissional, muito atenciosa e dinâmica.", by: "E. O." },
  { text: "Psicóloga maravilhosa! Profissional excelente!", by: "M. D." },
  { text: "A consulta foi excelente, uma profissional incrível e muito humana, super indico.", by: "E." },
  { text: "A sessão foi conduzida de forma acolhedora. Milene demonstrou atenção, escuta e explicações didáticas, favorecendo a reflexão e o bem-estar emocional.", by: "J. F. R. J." },
  { text: "Excelente profissional! Dedicada, humana e atenciosa. Me senti à vontade e acolhida durante a consulta.", by: "J. J." },
  { text: "Excelente atendimento... amei minha consulta, me ajudou bastante, já me encontro animada para a próxima.", by: "K." },
  { text: "Profissional super acolhedora, simpática e competente. Recomendo.", by: "T. B. O. B." },
  { text: "Excelente atendimento. Muito atenciosa e competente. Estou amando a minha terapia. Me sinto melhor e mais capaz a cada dia.", by: "J. F." },
  { text: "Foi uma experiência muito positiva, marcada por acolhimento, escuta atenta, profissionalismo e sensibilidade.", by: "G. M. R. R." },
  { text: "Uma profissional de alto padrão, dedicada, empática. Gostei muito!", by: "J. N." },
];
export const reviewsTitle = "O cuidado, *nas palavras de quem já passou por aqui.*";
export const reviewsNote =
  "Trechos de avaliações públicas e verificadas no Doctoralia. Para preservar o sigilo, mostro apenas as iniciais.";

// ---------- FAQ ----------
export const faq = {
  title: "Antes de começar, *talvez você se pergunte…*",
  intro: "Se a sua dúvida não estiver aqui, é só me chamar. Respondo com prazer.",
  items: [
    { q: "Como é a primeira sessão?", a: "É uma conversa tranquila, sem pressa e sem julgamentos. Você conta o que te trouxe, eu faço algumas perguntas para entender o seu momento e explico como podemos trabalhar juntos." },
    { q: "Qual a duração e a frequência das sessões?", a: "Combinamos de acordo com o seu caso e a sua rotina. Na primeira sessão conversamos sobre isso e definimos juntos o melhor formato." },
    { q: "A terapia online funciona?", a: "Sim. É um formato reconhecido pelo Conselho Federal de Psicologia e, para muitas pessoas, funciona tão bem quanto o presencial. Você só precisa de um lugar reservado, boa conexão e fones de ouvido." },
    { q: "Meu atendimento é sigiloso?", a: "Sim. O sigilo é um dever ético da profissão. O que é conversado nas sessões fica entre nós." },
    { q: "Quanto custa? Vocês aceitam convênio?", a: "Atendo de forma particular. Os valores e as formas de pagamento são informados pelo WhatsApp, de maneira reservada." },
    { q: "Preciso estar em crise para começar?", a: "Não. Há quem comece em um momento difícil e há quem procure a terapia para se conhecer melhor, prevenir adoecimento e recaídas ou tomar uma decisão importante." },
    { q: "O que é a Terapia Cognitivo-Comportamental (TCC)?", a: "É uma abordagem baseada em evidências que investiga a relação entre pensamentos, emoções e comportamentos. O trabalho é estruturado e colaborativo, com objetivos combinados e sessões estruturadas e, às vezes, atividades entre as sessões." },
    { q: "Você atende casais?", a: "Sim. Também atendo casais. Converse comigo pelo WhatsApp para combinarmos o formato." },
    { q: "Moro fora do Brasil. Posso fazer terapia com você?", a: "Sim. Atendo brasileiros no exterior de forma online, conforme as normas do Conselho Federal de Psicologia. Combinamos horários que funcionem no seu fuso." },
    { q: "Onde fica o consultório?", a: "Na Asa Norte, em Brasília, no Ed. Central Park (SCN Quadra 1, Bloco E). Pelo WhatsApp passo todos os detalhes de acesso e estacionamento." },
  ],
};

// ---------- Contato final / rodapé ----------
export const finalCta = {
  title: "Dar o primeiro passo *pode ser só uma mensagem.*",
  text: "Me conte, em poucas palavras, o que você está buscando. Respondo pelo WhatsApp e combinamos o melhor horário para você.",
  button: "Enviar uma mensagem",
  line: `WhatsApp ${clinic.whatsappDisplay} · Atendimento com hora marcada`,
  cardTitle: "Prefere que eu te chame?",
  cardText: "Deixe seu nome e a sua preferência. Eu retorno pelo WhatsApp.",
};

export const emergency = "Em situação de emergência, ligue 188 (CVV) ou 192 (SAMU).";

export const privacyText = [
  {
    h: "Quais dados são coletados",
    p: "Este site não usa cadastro nem coleta informações de saúde. O formulário de contato pede apenas o seu nome e preferências de atendimento, e serve só para abrir uma conversa no WhatsApp. Nada é gravado em servidores do site.",
  },
  {
    h: "WhatsApp",
    p: "Ao clicar nos botões, você é levado ao WhatsApp, que tem a sua própria política de privacidade. As mensagens enviadas por lá ficam sujeitas a essas regras.",
  },
  {
    h: "Mapas",
    p: "O mapa interativo só é carregado quando você clica em “Ver mapa interativo”. Nesse momento, o Google Maps recebe os dados padrão de acesso, conforme a política do Google.",
  },
  {
    h: "Seus direitos (LGPD)",
    p: "Você pode pedir informações, correção ou exclusão de qualquer dado que tenha me enviado, escrevendo pelo WhatsApp. O sigilo profissional é mantido conforme o Código de Ética Profissional do Psicólogo.",
  },
];

export const footerTopics = topics.map((t) => ({ label: t.label, slug: t.slug }));
