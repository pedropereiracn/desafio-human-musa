import pg from "pg";

const client = new pg.Client({
  host: "aws-0-us-west-2.pooler.supabase.com",
  port: 5432,
  database: "postgres",
  user: "postgres.dfuyqhhjwqfduyczmlkh",
  password: process.env.SUPABASE_DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

async function seed() {
  await client.connect();
  console.log("Connected — seeding demo data...");

  // ═══ CLIENTS ═══
  const clientsResult = await client.query(`
    INSERT INTO clients (name, segment, brand_voice, target_audience, platforms, preferred_formats, notes, color)
    VALUES
      ('Clínica Glow', 'Beleza & Estética', 'Aspiracional, elegante, empoderamento feminino. Nunca usa gírias ou linguagem informal demais.', 'Mulheres 25-45, classe AB, interessadas em skincare e procedimentos estéticos', '{"instagram"}', '{"reels","carrossel","stories"}', 'Foco em resultados antes/depois. Evitar claims médicos exagerados.', '#ec4899'),
      ('FitKitchen', 'Food & Fitness', 'Descontraída, motivacional, divertida. Usa emojis com moderação. Tom de "amigo fitness".', 'Jovens 20-35, vida ativa, buscam praticidade em alimentação saudável', '{"instagram","tiktok"}', '{"reels","stories"}', 'Sempre mostrar os pratos com visual apetitoso. Receitas rápidas performam melhor.', '#22c55e'),
      ('TechStart Academy', 'Educação & Tech', 'Didática, acessível, desmistificadora. Transforma conceitos complexos em linguagem simples.', 'Profissionais em transição de carreira 25-40, interessados em tech e programação', '{"instagram","tiktok"}', '{"reels","carrossel"}', 'Conteúdo educativo com dados concretos. Carrosséis de "roadmap" têm alto save rate.', '#6366f1')
    ON CONFLICT DO NOTHING
    RETURNING id, name
  `);

  const clientIds = clientsResult.rows;
  console.log("Clients:", clientIds.map((c) => c.name).join(", "));

  if (clientIds.length === 0) {
    console.log("Clients already exist — fetching IDs...");
    const existing = await client.query("SELECT id, name FROM clients ORDER BY created_at LIMIT 3");
    clientIds.push(...existing.rows);
  }

  const [glow, fitk, tech] = clientIds;

  // ═══ BRIEFS ═══
  await client.query(`
    INSERT INTO briefs (client_id, raw_briefing, decoded_result)
    VALUES
      ($1, 'Oi! Preciso de conteúdo pro Instagram da clínica pra março. Foco em limpeza de pele e harmonização. Público: mulheres AB 25-45. Tom elegante. Formato: reels e carrossel. Objetivo: gerar agendamentos.',
       '{"topic":"limpeza de pele e harmonização facial","platform":"instagram","format":"reels","tone":"elegante e aspiracional","audience":"Mulheres 25-45, classe AB","requirements":["Foco em resultados","CTA para agendamento","Visual premium"],"missingInfo":["Orçamento para ads","Período exato da campanha"],"clarificationQuestions":["Há promoção específica para março?","Podemos usar fotos reais de pacientes?"],"summary":"Campanha de conteúdo orgânico para Instagram focada em limpeza de pele e harmonização, targeting mulheres AB 25-45 com tom elegante e aspiracional."}'::jsonb),
      ($2, 'fala! precisa de conteudo pro tiktok e insta da fitkitchen essa semana, receitas rapidas, algo q viralize, tom descontraido, pode ser reels curtos de 15-30seg',
       '{"topic":"receitas rápidas saudáveis","platform":"tiktok","format":"reels","tone":"descontraído e divertido","audience":"Jovens 20-35, vida ativa","requirements":["Vídeos curtos 15-30s","Receitas com no máximo 5 ingredientes","Visual apetitoso"],"missingInfo":["Ingredientes disponíveis no estoque"],"clarificationQuestions":["Tem preferência por receitas doces ou salgadas?","Podemos usar trends do TikTok?"],"summary":"Conteúdo viral de receitas rápidas para TikTok e Instagram, formato reels curtos com tom descontraído."}'::jsonb)
    ON CONFLICT DO NOTHING
  `, [glow?.id, fitk?.id]);
  console.log("Briefs: 2 inserted");

  // ═══ COPY HISTORY ═══
  const copyItems = [
    {
      clientId: glow?.id,
      module: "musa",
      prompt: "limpeza de pele",
      result: {
        caption: "Sua pele merece mais do que uma rotina básica.\n\nA limpeza de pele profunda remove impurezas que nenhum sabonete alcança — e os resultados falam por si.\n\nAgende sua avaliação gratuita e descubra o protocolo ideal para a sua pele.",
        hashtags: ["#limpezadepele", "#skincare", "#estética", "#pelesaudável", "#cuidadoscomapele"],
        cta: "Link na bio → Agende sua avaliação gratuita",
        script: "[0-3s] Close no rosto — pele com textura\n[3-7s] Texto: Sua pele pedindo socorro?\n[7-15s] Time-lapse do procedimento\n[15-20s] Resultado final — pele luminosa\n[20-25s] CTA com swipe up",
        notes: "Usar trilha calma e premium. Evitar before/after muito agressivo.",
        hookVariations: ["3 sinais de que sua pele precisa de uma limpeza profissional", "O que acontece quando você faz limpeza de pele pela primeira vez", "Dermatologista reage à limpeza de pele viral"],
        engagementScore: 8,
      },
      copyType: "social",
      tone: "inspiracional",
      platform: "instagram",
    },
    {
      clientId: fitk?.id,
      module: "copy-lab",
      prompt: "receita de overnight oats fitness",
      result: {
        caption: "3 ingredientes. 5 minutos. Café da manhã de campeão.\n\nOvernight oats que até quem não sabe cozinhar consegue fazer:\n\nAveia + leite + frutas\nPrepara à noite, come de manhã\nSem desculpas\n\nSalva esse post e manda pra aquele amigo que vive pulando o café.",
        hashtags: ["#overnightoats", "#receitafitness", "#cafédamanhã", "#mealprep", "#fitfood"],
        cta: "Salva pra não esquecer",
        notes: "Formato vertical, close na preparação. Texto overlay com cada passo.",
        engagementScore: 9,
      },
      copyType: "social",
      tone: "casual",
      platform: "tiktok",
    },
    {
      clientId: tech?.id,
      module: "musa",
      prompt: "roadmap dev junior",
      result: {
        caption: "Você NÃO precisa de faculdade para ser dev. Mas precisa de um plano.\n\nEm 2025, o mercado tech contratou 45% mais juniors que em 2024.\n\nO segredo? Quem tinha portfólio + projetos reais saiu na frente.\n\nSwipe para ver o roadmap completo de 6 meses →",
        hashtags: ["#programação", "#devjunior", "#carreiratech", "#transicaodecarreira", "#roadmapdev"],
        cta: "Salva esse roadmap e começa hoje →",
        script: "Slide 1: Título impactante com dado\nSlide 2: Mês 1-2 — Fundamentos\nSlide 3: Mês 3-4 — Primeiro projeto\nSlide 4: Mês 5-6 — Portfólio + aplicações\nSlide 5: CTA + link",
        notes: "Carrossel com visual clean e dados concretos. Cada slide = 1 etapa clara.",
        hookVariations: ["O roadmap que me fez sair de garçom para dev em 6 meses", "Se eu começasse programação hoje, faria isso", "3 erros que todo dev junior comete (e como evitar)"],
        engagementScore: 9,
      },
      copyType: "social",
      tone: "casual",
      platform: "instagram",
    },
  ];

  for (const item of copyItems) {
    await client.query(
      `INSERT INTO copy_history (client_id, module, prompt, result, copy_type, tone, platform) VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7) ON CONFLICT DO NOTHING`,
      [item.clientId, item.module, item.prompt, JSON.stringify(item.result), item.copyType, item.tone, item.platform]
    );
  }
  console.log("Copy history: 3 inserted");

  // ═══ ACTIVITIES ═══
  await client.query(`
    INSERT INTO activities (type, title, client_id, module, created_at)
    VALUES
      ('client', 'Novo cliente: Clínica Glow', $1, 'Hub de Clientes', now() - interval '2 days'),
      ('client', 'Novo cliente: FitKitchen', $2, 'Hub de Clientes', now() - interval '2 days'),
      ('client', 'Novo cliente: TechStart Academy', $3, 'Hub de Clientes', now() - interval '1 day'),
      ('brief', 'Brief: limpeza de pele e harmonização', $1, 'Central de Briefs', now() - interval '1 day'),
      ('brief', 'Brief: receitas rápidas saudáveis', $2, 'Central de Briefs', now() - interval '20 hours'),
      ('search', 'Busca: "skincare routine" no instagram', $1, 'Musa Pipeline', now() - interval '18 hours'),
      ('copy', 'Copy: "Sua pele merece mais"', $1, 'Musa Pipeline', now() - interval '16 hours'),
      ('search', 'Busca: "receita fitness" no tiktok', $2, 'Musa Pipeline', now() - interval '12 hours'),
      ('copy', 'Copy Lab: overnight oats fitness', $2, 'Copy Lab', now() - interval '10 hours'),
      ('search', 'Busca: "roadmap dev" no instagram', $3, 'Musa Pipeline', now() - interval '6 hours'),
      ('copy', 'Copy: roadmap dev junior carrossel', $3, 'Musa Pipeline', now() - interval '4 hours')
    ON CONFLICT DO NOTHING
  `, [glow?.id, fitk?.id, tech?.id]);
  console.log("Activities: 11 inserted");

  // ═══ CALENDAR ═══
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const calendarData = [
    { clientId: glow?.id, title: "Reels: Antes/depois limpeza de pele", platform: "instagram", format: "reels", day: 3, status: "publicado" },
    { clientId: glow?.id, title: "Carrossel: 5 mitos sobre harmonização", platform: "instagram", format: "carrossel", day: 5, status: "publicado" },
    { clientId: fitk?.id, title: "Reels: Overnight oats em 30s", platform: "tiktok", format: "reels", day: 4, status: "publicado" },
    { clientId: fitk?.id, title: "Stories: Enquete — doce ou salgado?", platform: "instagram", format: "stories", day: 7, status: "publicado" },
    { clientId: tech?.id, title: "Carrossel: Roadmap Dev Junior 2025", platform: "instagram", format: "carrossel", day: 6, status: "publicado" },
    { clientId: glow?.id, title: "Reels: Rotina skincare noturna", platform: "instagram", format: "reels", day: 10, status: "agendado" },
    { clientId: fitk?.id, title: "Reels: 3 lanches pré-treino", platform: "tiktok", format: "reels", day: 11, status: "agendado" },
    { clientId: tech?.id, title: "Reels: POV primeiro commit", platform: "tiktok", format: "reels", day: 12, status: "agendado" },
    { clientId: glow?.id, title: "Post: Depoimento paciente", platform: "instagram", format: "post", day: 14, status: "agendado" },
    { clientId: fitk?.id, title: "Carrossel: Meal prep domingo", platform: "instagram", format: "carrossel", day: 15, status: "rascunho" },
    { clientId: tech?.id, title: "Carrossel: Git em 5 minutos", platform: "instagram", format: "carrossel", day: 16, status: "rascunho" },
    { clientId: glow?.id, title: "Reels: Trend adaptada skincare", platform: "instagram", format: "reels", day: 18, status: "rascunho" },
    { clientId: fitk?.id, title: "Stories: Bastidores da cozinha", platform: "instagram", format: "stories", day: 20, status: "rascunho" },
    { clientId: tech?.id, title: "Reels: Erros de junior vs senior", platform: "tiktok", format: "reels", day: 22, status: "rascunho" },
    { clientId: glow?.id, title: "Carrossel: Checklist pré-procedimento", platform: "instagram", format: "carrossel", day: 24, status: "rascunho" },
    { clientId: fitk?.id, title: "Reels: Wrap proteico 2 min", platform: "tiktok", format: "reels", day: 25, status: "rascunho" },
  ];

  for (const entry of calendarData) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(entry.day).padStart(2, "0")}`;
    await client.query(
      `INSERT INTO calendar_entries (client_id, title, platform, format, scheduled_date, status) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
      [entry.clientId, entry.title, entry.platform, entry.format, date, entry.status]
    );
  }
  console.log("Calendar: 16 entries inserted");

  // Summary
  const counts = await client.query(`
    SELECT
      (SELECT count(*) FROM clients) as clients,
      (SELECT count(*) FROM briefs) as briefs,
      (SELECT count(*) FROM copy_history) as copies,
      (SELECT count(*) FROM activities) as activities,
      (SELECT count(*) FROM calendar_entries) as calendar
  `);
  console.log("\n=== Database Summary ===");
  console.log(counts.rows[0]);

  await client.end();
  console.log("\nSeed complete!");
}

seed().catch((e) => {
  console.error("Seed failed:", e.message);
  process.exit(1);
});
