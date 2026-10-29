import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleCheck,
  Crosshair,
  Layers3,
  Minus,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  X,
} from "lucide-react";
import Header from "./components/Header";
import {
  Brand,
  Button,
  Reveal,
  SectionHeading,
  SectionTag,
} from "./components/UI";
import WaveField from "./components/WaveField";
import {
  ContentVisual,
  FunnelVisual,
  StrategyVisual,
  TrafficVisual,
} from "./components/Visuals";
import LeadForm from "./components/LeadForm";

const painPoints = [
  "Paga por cliques e recebe contatos que nunca respondem.",
  "Recebe relatório bonito, mas não sabe quanto virou venda.",
  "O comercial reclama que os leads são ruins.",
  "Todo mês é uma surpresa, ninguém sabe quanto vai entrar.",
];
const strategy = [
  {
    title: "Atrair:",
    text: "campanhas que falam com quem decide a compra.",
    icon: Target,
  },
  {
    title: "Qualificar:",
    text: "afastamos curiosos e aproximamos quem está pronto.",
    icon: Layers3,
  },
  {
    title: "Converter:",
    text: "processo afinado para transformar lead em reunião.",
    icon: CircleCheck,
  },
];
const services = [
  {
    title: "Tráfego pago",
    text: "Anúncios no Google e no Meta focados em lead qualificado, otimizados toda semana.",
    icon: Crosshair,
    visual: TrafficVisual,
  },
  {
    title: "Conteúdo e autoridade",
    text: "Posts, vídeos e materiais que colocam sua empresa como referência no mercado.",
    icon: Sparkles,
    visual: ContentVisual,
  },
  {
    title: "Funil e automação",
    text: "Páginas, e-mails e fluxos que esquentam o lead antes de ele falar com o seu time.",
    icon: Layers3,
    visual: FunnelVisual,
  },
];
const steps = [
  ["Diagnóstico.", "Entendemos seu negócio, seu cliente e suas metas."],
  [
    "Plano sob medida.",
    "Montamos a estratégia e o investimento ideal para o seu momento.",
  ],
  ["Execução.", "Colocamos as campanhas no ar e acompanhamos de perto."],
  [
    "Otimização.",
    "Reunião mensal, relatório simples e ajustes para escalar o que funciona.",
  ],
];
const cases = [
  {
    name: "Indústria de embalagens:",
    result: "de 8 para 31 reuniões por mês em 5 meses.",
    number: "31",
    unit: "reuniões por mês",
    visual: "bars",
  },
  {
    name: "Software de gestão:",
    result: "custo por lead qualificado 47% menor em 90 dias.",
    number: "−47%",
    unit: "no custo por lead qualificado",
    visual: "line",
  },
  {
    name: "Consultoria financeira:",
    result: "faturamento 2,3x maior em 8 meses.",
    number: "2,3×",
    unit: "mais faturamento",
    visual: "curve",
  },
];
const testimonials = [
  [
    "Antes eu recebia relatório com gráfico. Hoje recebo reunião marcada na agenda do meu time.",
    "Mariana Alves",
    "Diretora Comercial",
    "MA",
  ],
  [
    "Em três meses, nosso custo por lead caiu quase pela metade.",
    "Rafael Moura",
    "Sócio-fundador",
    "RM",
  ],
  [
    "Transparência total. Sei exatamente onde cada real foi investido.",
    "Cláudia Nogueira",
    "CEO",
    "CN",
  ],
];
const questions = [
  [
    "Em quanto tempo vejo resultado?",
    "As primeiras oportunidades costumam aparecer entre a 2ª e a 4ª semana. A escala vem a partir do terceiro mês.",
  ],
  [
    "Quanto preciso investir em anúncios?",
    "Depende do seu mercado e da sua meta. Definimos o valor ideal no diagnóstico.",
  ],
  [
    "Tem contrato de fidelidade?",
    "O contrato inicial é de 3 meses. Depois disso, a renovação é mensal.",
  ],
  [
    "Como acompanho o trabalho?",
    "Você recebe um painel online e uma reunião mensal para ver os números e os próximos passos.",
  ],
];

function Hero() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, reduced ? 0 : 100]);
  const entrance = (delay: number) => ({
    initial: reduced
      ? (false as const)
      : { opacity: 0, y: 20, filter: "blur(5px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
  });
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero-halo" aria-hidden="true" />
      <div className="hero-content container">
        <motion.div {...entrance(0.05)}>
          <SectionTag>MARKETING FEITO COM CABEÇA DE VENDAS</SectionTag>
        </motion.div>
        <motion.h1 id="hero-title" {...entrance(0.15)}>
          <span>Pare de gerar curiosos.</span> Comece a gerar vendas
          <br className="desktop-break" /> para o seu negócio.
        </motion.h1>
        <motion.p className="hero-description" {...entrance(0.3)}>
          A Agência V3 cuida do seu tráfego pago, do seu conteúdo e do seu funil
          para a sua empresa receber clientes qualificados todo mês.
        </motion.p>
        <motion.div className="hero-action" {...entrance(0.45)}>
          <Button>Quero meu diagnóstico gratuito</Button>
          <span>30 minutos, sem compromisso.</span>
        </motion.div>
      </div>
      <motion.div className="hero-landscape" style={{ y }} aria-hidden="true">
        <div className="light-column" />
        <div className="light-horizon" />
        <WaveField />
        <div className="monolith">
          <Brand compact />
        </div>
        <div className="monolith-reflection" />
      </motion.div>
      <a
        href="#empresas"
        className="hero-scroll"
        aria-label="Ver empresas que já crescem com a gente"
      >
        <ArrowDown size={14} aria-hidden="true" />
      </a>
      <span className="hero-coordinate" aria-hidden="true">
        V3 / CRESCIMENTO EM MOVIMENTO
      </span>
    </section>
  );
}

function Proof() {
  return (
    <section
      className="proof container"
      id="empresas"
      aria-labelledby="proof-title"
    >
      <Reveal>
        <h2 id="proof-title">Empresas que já crescem com a gente</h2>
      </Reveal>
      <div className="proof-grid">
        <Reveal delay={0.05}>
          <div className="proof-stat">
            <strong>
              +120<span>empresas</span>
            </strong>
            <p>atendidas desde 2018</p>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="proof-stat">
            <strong>
              <span>R$</span> 38 <span>milhões</span>
            </strong>
            <p>em vendas geradas para clientes</p>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="proof-stat">
            <strong>
              4,9 <span>de 5</span>
              <span className="stars" aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={11} fill="currentColor" />
                ))}
              </span>
            </strong>
            <p>na avaliação dos clientes</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="section problem-section" id="desafio">
      <div className="container problem-layout">
        <div>
          <SectionHeading
            number="01"
            label="O DESAFIO"
            align="left"
            title={
              <>
                Você investe em marketing,
                <br />
                mas os leads não vendem?
              </>
            }
          >
            Isso é mais comum do que parece. Veja se você se identifica:
          </SectionHeading>
          <Reveal>
            <p className="problem-conclusion">
              Marketing que não vira reunião é só custo.{" "}
              <span>A gente muda isso.</span>
            </p>
          </Reveal>
        </div>
        <div className="pain-list">
          {painPoints.map((point, i) => (
            <Reveal delay={i * 0.08} key={point}>
              <div className="pain-item">
                <span className="pain-icon">
                  <Minus size={15} aria-hidden="true" />
                </span>
                <p>{point}</p>
                <span className="pain-number">0{i + 1}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Strategy() {
  return (
    <section className="section strategy-section">
      <div className="container strategy-layout">
        <Reveal className="strategy-art">
          <StrategyVisual />
          <div className="art-caption">
            <span className="tiny-dot" />
            DO PRIMEIRO CONTATO À REUNIÃO
            <ArrowUpRight size={13} />
          </div>
        </Reveal>
        <div className="strategy-copy">
          <SectionHeading
            number="02"
            label="A NOSSA LÓGICA"
            align="left"
            title={
              <>
                Marketing feito com
                <br />
                cabeça de vendas
              </>
            }
          >
            Aqui o ponto de partida é a sua meta de faturamento, não o número de
            cliques. A gente descobre quem é o seu cliente ideal, cria campanhas
            para atrair esse perfil e acompanha cada lead até a reunião.
          </SectionHeading>
          <div className="strategy-list">
            {strategy.map(({ title, text, icon: Icon }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className="strategy-item">
                  <span className="small-icon">
                    <Icon size={18} strokeWidth={1.4} aria-hidden="true" />
                  </span>
                  <p>
                    <strong>{title}</strong> {text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="section services-section" id="solucoes">
      <div className="container">
        <SectionHeading
          number="03"
          label="SOLUÇÕES INTEGRADAS"
          title={
            <>
              O que fazemos
              <br />
              pela sua empresa
            </>
          }
        />
        <div className="service-grid">
          {services.map(({ title, text, icon: Icon, visual: Visual }, i) => (
            <Reveal delay={i * 0.1} key={title}>
              <article className="service-card">
                <Visual />
                <div className="service-card-copy">
                  <span className="service-icon">
                    <Icon size={17} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                <span className="card-corner" aria-hidden="true">
                  0{i + 1}
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="section process-section" id="como-funciona">
      <div className="container">
        <SectionHeading
          number="04"
          label="DA ESTRATÉGIA À EXECUÇÃO"
          title="Como funciona"
        />
        <ol className="process-grid">
          {steps.map(([title, text], i) => (
            <li key={title}>
              <Reveal delay={i * 0.1}>
                <div className="step-marker">
                  <span>0{i + 1}</span>
                  <div className="step-connector" />
                  <ArrowUpRight size={15} aria-hidden="true" />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        <Reveal className="process-action">
          <Button className="button-secondary">
            Começar pelo diagnóstico gratuito
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

function Results() {
  return (
    <section className="section results-section" id="resultados">
      <div className="container">
        <div className="results-heading">
          <SectionHeading
            number="05"
            label="IMPACTO REAL"
            align="left"
            title={
              <>
                Resultados que
                <br />
                aparecem no caixa
              </>
            }
          />
          <Reveal>
            <span className="results-heading-icon" aria-hidden="true">
              <ArrowUpRight strokeWidth={0.7} size={70} />
            </span>
          </Reveal>
        </div>
        <div className="results-grid">
          {cases.map((item, i) => (
            <Reveal delay={i * 0.1} key={item.name}>
              <article className="result-card">
                <div className="result-card-top">
                  <span>CASE / 0{i + 1}</span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </div>
                <strong className="result-number">{item.number}</strong>
                <span className="result-unit">{item.unit}</span>
                <div
                  className={`result-graph result-graph--${item.visual}`}
                  aria-hidden="true"
                >
                  {item.visual === "bars" ? (
                    Array.from({ length: 16 }, (_, n) => (
                      <span
                        key={n}
                        style={{ height: `${14 + (n / 15) ** 1.3 * 80}%` }}
                      />
                    ))
                  ) : (
                    <svg
                      viewBox="0 0 320 100"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d={
                          item.visual === "line"
                            ? "M0 15 30 20 50 15 75 39 100 32 125 49 150 42 180 69 205 62 235 80 260 76 290 90 320 91"
                            : "M0 95 C70 95 65 88 105 84 S170 71 200 59 260 30 320 5"
                        }
                        stroke="#b0b0b0"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                      />
                      <path
                        d={
                          item.visual === "line"
                            ? "M0 15 30 20 50 15 75 39 100 32 125 49 150 42 180 69 205 62 235 80 260 76 290 90 320 91V100H0Z"
                            : "M0 95 C70 95 65 88 105 84 S170 71 200 59 260 30 320 5V100H0Z"
                        }
                        fill="white"
                        opacity="0.025"
                      />
                    </svg>
                  )}
                </div>
                <div className="result-copy">
                  <h3>{item.name}</h3>
                  <p>{item.result}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="results-disclaimer">
          Os resultados variam de acordo com o mercado, a oferta e o
          investimento.
        </p>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="section testimonials-section">
      <div className="container">
        <SectionHeading
          number="06"
          label="QUEM CRESCE COM A V3"
          title="O que nossos clientes dizem"
        />
        <div className="testimonial-grid">
          {testimonials.map(([text, name, role, initials], i) => (
            <Reveal delay={i * 0.1} key={name}>
              <figure className="testimonial">
                <Quote size={25} strokeWidth={1} aria-hidden="true" />
                <blockquote>“{text}”</blockquote>
                <figcaption>
                  <span className="avatar" aria-hidden="true">
                    {initials}
                  </span>
                  <span>
                    <strong>{name}</strong>
                    <span>{role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const reasons = [
    "Meta de vendas, não de cliques.",
    "Relatórios em linguagem simples.",
    "Sem fidelidade abusiva.",
    "Time sênior no seu projeto.",
  ];
  return (
    <section className="section why-section">
      <div className="container">
        <div className="why-panel">
          <SectionHeading
            number="07"
            label="O JEITO V3"
            align="left"
            title={
              <>
                Por que a<br />
                Agência V3
              </>
            }
          />
          <div className="reasons-list">
            {reasons.map((reason, i) => (
              <Reveal delay={i * 0.08} key={reason}>
                <div className="reason">
                  <Check size={17} strokeWidth={1.5} aria-hidden="true" />
                  <p>{reason}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="why-watermark" aria-hidden="true">
            V3
          </div>
        </div>
      </div>
    </section>
  );
}

function Audience() {
  return (
    <section className="section audience-section">
      <div className="container">
        <SectionHeading
          number="08"
          label="CRESCER JUNTOS FAZ SENTIDO?"
          title="Para quem é"
        />
        <div className="audience-grid">
          <Reveal>
            <div className="audience-card">
              <div className="audience-card-heading">
                <span className="small-icon">
                  <Check size={18} aria-hidden="true" />
                </span>
                <span>Para quem é</span>
              </div>
              <ul>
                {[
                  "Empresas que vendem para outras empresas (B2B).",
                  "Quem já tem um time ou processo comercial, mesmo enxuto.",
                  "Quem quer crescer com previsibilidade.",
                ].map((text) => (
                  <li key={text}>
                    <Check size={14} aria-hidden="true" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="audience-card audience-card--muted">
              <h3 className="audience-card-heading">
                <span className="small-icon">
                  <X size={17} aria-hidden="true" />
                </span>
                Para quem não é
              </h3>
              <ul>
                {[
                  "Quem quer resultado garantido em poucos dias.",
                  "Quem não pretende investir em anúncios.",
                ].map((text) => (
                  <li key={text}>
                    <X size={14} aria-hidden="true" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="section faq-section" id="perguntas">
      <div className="container faq-layout">
        <SectionHeading
          number="09"
          label="SEM LETRAS MIÚDAS"
          align="left"
          title={
            <>
              Perguntas
              <br />
              frequentes
            </>
          }
        />
        <div className="faq-list">
          {questions.map(([question, answer], i) => (
            <Reveal delay={i * 0.05} key={question}>
              <details className="faq-item">
                <summary>
                  <h3>{question}</h3>
                  <ChevronDown size={18} aria-hidden="true" />
                </summary>
                <div className="faq-answer">
                  <p>{answer}</p>
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section
      className="section contact-section"
      id="diagnostico"
      aria-labelledby="contact-title"
    >
      <div className="contact-glow" aria-hidden="true" />
      <div className="container contact-layout">
        <Reveal className="contact-copy">
          <SectionTag>O PRÓXIMO PASSO É SEU</SectionTag>
          <h2 id="contact-title">
            Vamos transformar marketing em reuniões de vendas?
          </h2>
          <p>
            Agende um diagnóstico gratuito de 30 minutos. Vamos olhar o seu
            cenário e mostrar onde estão as maiores oportunidades. Mesmo que a
            gente não trabalhe junto, você sai com um plano de ação.
          </p>
          <div className="contact-signoff">
            <span className="contact-symbol">
              <Brand compact />
            </span>
            <span>
              30 minutos, sem compromisso.
              <span>
                <ShieldCheck size={13} aria-hidden="true" />
                Marketing feito com cabeça de vendas.
              </span>
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <LeadForm />
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <a
            href="#inicio"
            className="brand-link"
            aria-label="Agência V3 — voltar ao início"
          >
            <Brand />
          </a>
          <div className="footer-contact">
            <a href="mailto:contato@agenciav3.com.br">
              contato@agenciav3.com.br
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
            <span>(00) 00000-0000</span>
          </div>
          <a href="#inicio" className="back-top" aria-label="Voltar ao início">
            <ArrowUpRight size={20} aria-hidden="true" />
          </a>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Agência V3. Todos os direitos reservados.</p>
          <span>MARKETING & VENDAS</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Proof />
        <Problem />
        <Strategy />
        <Services />
        <Process />
        <Results />
        <Testimonials />
        <WhyUs />
        <Audience />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
