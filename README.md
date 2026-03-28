# Musa — Referências de Conteúdo Viral com IA

## A Dor

Todo social media conhece essa rotina: o cliente manda um briefing vago pelo WhatsApp, você precisa criar conteúdo que engaje, mas antes disso passa **horas** rolando feed, salvando posts, tentando entender o que funciona naquele nicho. É trabalho braçal que consome tempo criativo.

## O Insight

Em conversa com profissionais de agência de marketing, ficou claro: **o gargalo não é criar conteúdo — é encontrar a referência certa e traduzir o briefing do cliente em algo acionável.** O processo de pesquisa + ideação + copywriting que leva horas poderia ser comprimido em minutos com a inteligência artificial certa.

## A Solução

**Musa** é um assistente de conteúdo que transforma briefings vagos em copy pronto para postar, usando um pipeline de 4 etapas com IA:

```
Briefing/Tema → Referências Virais → Ideias Criativas → Copy Pronto
```

### Como funciona o pipeline:

1. **Busca Inteligente** — Scraping de posts virais reais do Instagram e TikTok via Apify, ranqueados por engajamento
2. **Análise com IA** — Claude analisa cada referência: por que viralizou, padrões de hook, estrutura narrativa
3. **Ideação Criativa** — 5 ideias de conteúdo originais, cada uma com gancho, ângulo e formato definidos
4. **Copy de Produção** — Caption, hashtags, CTA e roteiro cena-a-cena prontos para gravar

### Dois modos de entrada:

- **Busca Rápida** — Digite um tema, escolha plataforma e formato
- **Decodificador de Briefing** — Cole o WhatsApp/email do cliente e a IA extrai tema, tom, público e formato automaticamente

## Quem Usa

**Persona:** Social media de agência ou freelancer que gerencia múltiplas contas.

**Momento:** Recebeu o briefing do cliente e precisa entregar a pauta de conteúdo da semana.

**Frequência:** Diária — cada conta/cliente é uma nova busca.

**Problema resolvido:** O que levava 2-3 horas (pesquisa + ideação + copy) agora leva 5 minutos.

## Tech Stack

| Camada | Tecnologia | Por quê |
|--------|-----------|---------|
| Frontend | Next.js 16 + React 19 | App Router, RSC, performance |
| Styling | Tailwind CSS 4 | Glassmorphism, aurora effects, zero deps extras |
| IA | Claude Sonnet 4 (Anthropic) | Análise, ideação e copywriting |
| Scraping | Apify Actors | Instagram & TikTok data em tempo real |
| Deploy | Vercel | Edge-optimized, zero config |

## Rodando Localmente

```bash
# Clone e instale
git clone <repo-url>
cd musa
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas chaves:
# ANTHROPIC_API_KEY=sk-ant-...
# APIFY_API_TOKEN=apify_api_...

# Rode
npm run dev
```

Acesse `http://localhost:3000`.

## Próximos Passos

- **Streaming de copy** — Texto aparecendo em tempo real enquanto a IA escreve
- **Histórico de buscas** — Salvar sessões anteriores para referência
- **Integração com calendário** — Agendar posts direto do Musa
- **Multi-idioma** — Suporte a inglês e espanhol para agências internacionais
- **Analytics preditivo** — Estimativa de performance baseada nos padrões das referências

---

Feito com IA para quem faz conteúdo. Powered by Claude AI.
