/* ═══════════════════════════════════════════════════════
   The Number Theory Scrapbook — app.js
═══════════════════════════════════════════════════════ */

// ─── Screen list ──────────────────────────────────────────────
const ALL_SCREENS = [
  'home','learn',
  'topic-theory','topic-practice','topic-application',
  'glossary','mysteries','mystery-detail',
  'more','references','about'
];

const NAV_MAP = {
  'home':'nav-home',
  'learn':'nav-learn','topic-theory':'nav-learn',
  'topic-practice':'nav-learn','topic-application':'nav-learn',
  'glossary':'nav-glossary',
  'mysteries':'nav-mysteries','mystery-detail':'nav-mysteries',
  'more':'nav-more','references':'nav-references','about':'nav-about'
};

function showScreen(id) {
  ALL_SCREENS.forEach(s => {
    const el = document.getElementById(s);
    if (el) el.classList.remove('active');
  });
  const target = document.getElementById(id);
  if (target) { target.classList.add('active'); window.scrollTo({top:0,behavior:'smooth'}); }

  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const navId = NAV_MAP[id];
  if (navId) { const n = document.getElementById(navId); if (n) n.classList.add('active'); }

  // Re-render KaTeX
  if (window.renderMathInElement && target) {
    setTimeout(() => renderMathInElement(target,{
      delimiters:[
        {left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false},
        {left:'\\(',right:'\\)',display:false},{left:'\\[',right:'\\]',display:true}
      ],throwOnError:false
    }), 60);
  }
}

// ─── QUADRANT HIDE / EXPAND ───────────────────────────────────
function toggleQuadrant(quadrantId, gridId) {
  const q = document.getElementById(quadrantId);
  const grid = document.getElementById(gridId);
  if (!q || !grid) return;

  const isHidden = q.classList.contains('hidden');

  if (isHidden) {
    // Unhide
    q.classList.remove('hidden');
    grid.classList.remove('one-visible');
    q.querySelector('.hide-btn').textContent = 'Hide';
  } else {
    // Hide — check if sibling is already hidden (don't allow hiding both)
    const siblings = grid.querySelectorAll('.quadrant');
    const otherVisible = Array.from(siblings).some(s => s.id !== quadrantId && !s.classList.contains('hidden'));
    if (!otherVisible) return; // don't hide the last visible panel

    q.classList.add('hidden');
    grid.classList.add('one-visible');
    q.querySelector('.hide-btn').textContent = 'Show';
  }
}

// ─── TOPICS ───────────────────────────────────────────────────
const TOPICS = [
  { id:'divisibility', unit:'Unit I — Foundations',
    title:'Divisibility &amp; the Division Algorithm',
    discoverer:'Roots in Ancient Greek mathematics; formalized by Euclid, c. 300 BCE' },
  { id:'gcd', unit:'Unit I — Foundations',
    title:'Greatest Common Divisor',
    discoverer:'Euclid, c. 300 BCE' },
  { id:'euclidean', unit:'Unit I — Foundations',
    title:'The Euclidean Algorithm',
    discoverer:'Euclid, c. 300 BCE' },
  { id:'primes', unit:'Unit I — Foundations',
    title:'Prime Numbers &amp; Unique Factorization',
    discoverer:'Euclid (infinitely many primes); Gauss (FTA formalization)' },
  { id:'congruences', unit:'Unit II — Congruences &amp; Modular Arithmetic',
    title:'Congruences',
    discoverer:'Carl Friedrich Gauss, Disquisitiones Arithmeticae (1801)' },
  { id:'linear-cong', unit:'Unit II — Congruences &amp; Modular Arithmetic',
    title:'Linear Congruences',
    discoverer:'Attributed to Gauss and earlier Islamic mathematicians' },
  { id:'crt', unit:'Unit II — Congruences &amp; Modular Arithmetic',
    title:'The Chinese Remainder Theorem',
    discoverer:'Sunzi Suanjing, c. 3rd–5th century CE; generalized by Gauss' },
  { id:'euler-fermat', unit:'Unit II — Congruences &amp; Modular Arithmetic',
    title:"Euler's &amp; Fermat's Theorems",
    discoverer:'Pierre de Fermat (1640); Leonhard Euler (generalization, 1763)' },
  { id:'phi', unit:'Unit III — Arithmetic Functions',
    title:"Euler's Totient Function φ(n)",
    discoverer:'Leonhard Euler, 1763' },
  { id:'mobius', unit:'Unit III — Arithmetic Functions',
    title:'The Möbius Function &amp; Inversion',
    discoverer:'August Ferdinand Möbius, 1832' },
  { id:'dirichlet', unit:'Unit III — Arithmetic Functions',
    title:'Dirichlet Series &amp; Convolution',
    discoverer:'Peter Gustav Lejeune Dirichlet, c. 1837' },
  { id:'quad-res', unit:'Unit IV — Quadratic Residues &amp; Reciprocity',
    title:'Quadratic Residues',
    discoverer:'Studied by Euler and Legendre; systematized by Gauss' },
  { id:'legendre', unit:'Unit IV — Quadratic Residues &amp; Reciprocity',
    title:'The Legendre Symbol',
    discoverer:'Adrien-Marie Legendre, 1798' },
  { id:'quad-rec', unit:'Unit IV — Quadratic Residues &amp; Reciprocity',
    title:'The Law of Quadratic Reciprocity',
    discoverer:'Conjectured by Euler &amp; Legendre; first proved by Gauss (1796)' },
  { id:'pnt', unit:'Unit V — Analytic &amp; Advanced Topics',
    title:'The Prime Number Theorem',
    discoverer:'Conjectured by Gauss &amp; Legendre; proved by Hadamard &amp; de la Vallée Poussin (1896)' },
  { id:'riemann', unit:'Unit V — Analytic &amp; Advanced Topics',
    title:'The Riemann Zeta Function',
    discoverer:'Bernhard Riemann, 1859' },
  { id:'diophantine', unit:'Unit V — Analytic &amp; Advanced Topics',
    title:'Diophantine Equations',
    discoverer:'Diophantus of Alexandria, c. 3rd century CE' },
  { id:'cryptography', unit:'Unit V — Analytic &amp; Advanced Topics',
    title:'Number Theory in Cryptography',
    discoverer:'RSA: Rivest, Shamir, Adleman (1977)' },
];

let currentTopicIdx = 0;

function _setTopicHeaders(t, idx) {
  // Theory screen
  document.getElementById('tt-unit').textContent    = t.unit;
  document.getElementById('tt-title').innerHTML     = t.title;
  document.getElementById('tt-discoverer').innerHTML = 'Discovered / developed by: ' + t.discoverer;

  // Practice screen
  document.getElementById('tp-unit').textContent  = t.unit;
  document.getElementById('tp-title').innerHTML   = t.title + ' — Practice';

  // Application screen
  document.getElementById('ta-unit').textContent  = t.unit;
  document.getElementById('ta-title').innerHTML   = t.title + ' — Application';

  // Next topic button labels
  const hasNext = idx < TOPICS.length - 1;
  const nextLabel = hasNext
    ? 'Next Topic: ' + TOPICS[idx+1].title.replace(/&amp;/g,'&').substring(0,30) + (TOPICS[idx+1].title.length > 30 ? '…' : '') + ' →'
    : 'Back to Syllabus';

  ['tt-next-btn','ta-next-btn','ta-next-row-btn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = nextLabel;
  });
}

function _resetQuadrants() {
  // Reset all hide states when opening a new topic
  document.querySelectorAll('.quadrant').forEach(q => {
    q.classList.remove('hidden');
    const hb = q.querySelector('.hide-btn');
    if (hb) hb.textContent = 'Hide';
  });
  document.querySelectorAll('.two-col').forEach(g => g.classList.remove('one-visible'));
}

function openTopic(id, idx) {
  currentTopicIdx = idx;
  const t = TOPICS[idx];
  _resetQuadrants();
  _setTopicHeaders(t, idx);

  // ── Fill content below — replace placeholders with your real LaTeX/content ──

  document.getElementById('tt-theory-content').innerHTML = `
    <div class="latex-block">[ LaTeX theory for <strong>${t.title.replace(/&amp;/g,'&')}</strong> goes here ]</div>
  `;
  document.getElementById('tt-viz-content').innerHTML = `
    <div class="viz-area">[ Visualization for ${t.title.replace(/&amp;/g,'&')} goes here ]</div>
  `;
  document.getElementById('tp-steps-content').innerHTML = `
    <div class="step-block"><div class="step-label">Step 1</div><div class="step-content">[ LaTeX step-by-step guide goes here ]</div></div>
    <div class="step-block"><div class="step-label">Step 2</div><div class="step-content">[ Continue your steps ]</div></div>
    <div class="step-block"><div class="step-label">Step 3</div><div class="step-content">[ Continue your steps ]</div></div>
  `;
  document.getElementById('tp-problems-content').innerHTML = `
    <div class="problem-wrap"><div class="problem-q">Problem 1: [ Problem statement ]</div><input class="problem-input" type="text" placeholder="Your answer…"/></div>
    <div class="problem-wrap"><div class="problem-q">Problem 2: [ Problem statement ]</div><input class="problem-input" type="text" placeholder="Your answer…"/></div>
    <div class="problem-wrap"><div class="problem-q">Problem 3: [ Problem statement ]</div><input class="problem-input" type="text" placeholder="Your answer…"/></div>
  `;
  document.getElementById('ta-app-content').innerHTML = `
    <div class="ph" style="min-height:120px;">[ Real-world applications for ${t.title.replace(/&amp;/g,'&')} ]</div>
  `;
  document.getElementById('ta-examples-content').innerHTML = `
    <div class="app-block"><h4>[ Field or Application ]</h4><p>[ Description ]</p></div>
    <div class="app-block"><h4>[ Field or Application ]</h4><p>[ Description ]</p></div>
    <div style="margin-top:1rem;"><span class="app-tag">[ Tag ]</span><span class="app-tag">[ Tag ]</span><span class="app-tag">[ Tag ]</span></div>
  `;

  showScreen('topic-theory');
}

function goToPractice()     { showScreen('topic-practice'); }
function goToApplication()  { showScreen('topic-application'); }

function goNextTopic(fromScreen) {
  if (currentTopicIdx < TOPICS.length - 1) {
    openTopic(TOPICS[currentTopicIdx+1].id, currentTopicIdx+1);
  } else {
    showScreen('learn');
  }
}

// ─── MYSTERIES ────────────────────────────────────────────────
const MYSTERIES = [
  { eyebrow:'Exhibit 01 — Unsolved Mystery',
    title:'[ Conjecture Name ]',
    proposer:'Proposed by: [ Name, Year ]' },
  { eyebrow:'Exhibit 02 — Unsolved Mystery',
    title:'[ Conjecture Name ]',
    proposer:'Proposed by: [ Name, Year ]' },
];

let currentMysteryIdx = 0;

function openMystery(idx) {
  currentMysteryIdx = idx;
  const m = MYSTERIES[idx];
  _resetQuadrants();

  document.getElementById('md-eyebrow').textContent   = m.eyebrow;
  document.getElementById('md-title').innerHTML       = m.title;
  document.getElementById('md-proposer').innerHTML    = m.proposer;

  const hasNext = idx < MYSTERIES.length - 1;
  ['md-next-btn','md-next-row-btn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = hasNext ? 'Next Mystery →' : 'Back to Gallery';
  });

  document.getElementById('md-theory-content').innerHTML = `
    <div class="latex-block">[ Formal statement of the conjecture in LaTeX ]</div>
  `;
  document.getElementById('md-viz-content').innerHTML = `
    <div class="viz-area">[ Diagram or chart goes here ]</div>
  `;
  document.getElementById('md-known-content').innerHTML = `
    <div class="step-block"><div class="step-label">Result 1</div><div class="step-content">[ Partial result or related theorem ]</div></div>
    <div class="step-block"><div class="step-label">Result 2</div><div class="step-content">[ Partial result or related theorem ]</div></div>
  `;
  document.getElementById('md-significance-content').innerHTML = `
    <div class="ph" style="min-height:100px;">[ Why solving this would matter ]</div>
    <div style="margin-top:1rem;"><span class="app-tag">[ Tag ]</span><span class="app-tag">[ Tag ]</span></div>
  `;

  showScreen('mystery-detail');
}

function goNextMystery() {
  if (currentMysteryIdx < MYSTERIES.length - 1) {
    openMystery(currentMysteryIdx + 1);
  } else {
    showScreen('mysteries');
  }
}

// ─── FLASHCARD GLOSSARY ───────────────────────────────────────
/*
  To add your terms: fill in each object in FLASHCARDS below.
  Fields:
    unit  — e.g. "Unit I — Foundations"
    term  — the term name
    def   — the definition (plain text or HTML)
    latex — the KaTeX/LaTeX string, e.g. "$a \\mid b$"  (use "" to leave blank)
    cat   — category key: "foundations" | "congruences" | "functions" | "primes" | "advanced"
*/
const FLASHCARDS = [
  { unit:'Unit I — Foundations',     term:'Divisibility',             def:'[ Your definition ]', latex:'$a \\mid b$',                               cat:'foundations' },
  { unit:'Unit I — Foundations',     term:'Integer',                  def:'[ Your definition ]', latex:'$\\mathbb{Z} = \\{\\ldots,-1,0,1,\\ldots\\}$', cat:'foundations' },
  { unit:'Unit I — Foundations',     term:'Greatest Common Divisor',  def:'[ Your definition ]', latex:'$\\gcd(a,b)$',                               cat:'foundations' },
  { unit:'Unit I — Foundations',     term:'Least Common Multiple',    def:'[ Your definition ]', latex:'$\\mathrm{lcm}(a,b)$',                        cat:'foundations' },
  { unit:'Unit I — Foundations',     term:'Prime Number',             def:'[ Your definition ]', latex:'$p \\in \\mathbb{P},\\; p > 1$',              cat:'primes' },
  { unit:'Unit I — Foundations',     term:'Composite Number',         def:'[ Your definition ]', latex:'$n = ab,\\; a,b > 1$',                        cat:'primes' },
  { unit:'Unit II — Congruences',    term:'Congruence',               def:'[ Your definition ]', latex:'$a \\equiv b \\pmod{n}$',                     cat:'congruences' },
  { unit:'Unit II — Congruences',    term:'Residue Class',            def:'[ Your definition ]', latex:'$[a]_n = \\{a + kn : k \\in \\mathbb{Z}\\}$', cat:'congruences' },
  { unit:'Unit II — Congruences',    term:'Modular Inverse',          def:'[ Your definition ]', latex:'$a \\cdot a^{-1} \\equiv 1 \\pmod{n}$',       cat:'congruences' },
  { unit:'Unit III — Arith. Fns',   term:"Euler's Totient Function", def:'[ Your definition ]', latex:'$\\varphi(n)=n\\prod_{p|n}\\!\\left(1-\\tfrac{1}{p}\\right)$', cat:'functions' },
  { unit:'Unit III — Arith. Fns',   term:'Möbius Function',          def:'[ Your definition ]', latex:'$\\mu(n)\\in\\{-1,0,1\\}$',                   cat:'functions' },
  { unit:'Unit III — Arith. Fns',   term:'Multiplicative Function',  def:'[ Your definition ]', latex:'$f(mn)=f(m)f(n),\\;\\gcd(m,n)=1$',            cat:'functions' },
  { unit:'Unit IV — Quad. Res.',     term:'Quadratic Residue',        def:'[ Your definition ]', latex:'$x^2\\equiv a\\pmod{p}$ has a solution',       cat:'advanced' },
  { unit:'Unit IV — Quad. Res.',     term:'Legendre Symbol',          def:'[ Your definition ]', latex:'$\\left(\\dfrac{a}{p}\\right)\\in\\{-1,0,1\\}$', cat:'advanced' },
  { unit:'Unit V — Analytic',        term:'Riemann Zeta Function',    def:'[ Your definition ]', latex:'$\\zeta(s)=\\displaystyle\\sum_{n=1}^{\\infty}\\frac{1}{n^s}$', cat:'advanced' },
  { unit:'Unit V — Analytic',        term:'Dirichlet Series',         def:'[ Your definition ]', latex:'$\\displaystyle\\sum_{n=1}^{\\infty}\\frac{a_n}{n^s}$', cat:'advanced' },
];

let fcAll     = FLASHCARDS.slice();   // current filtered set
let fcIdx     = 0;
let fcFlipped = false;

function setGlossaryCat(cat, btn) {
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  fcAll   = cat === 'all' ? FLASHCARDS.slice() : FLASHCARDS.filter(c => c.cat === cat);
  fcIdx   = 0;
  fcFlipped = false;
  document.getElementById('fc-card').classList.remove('flipped');
  _renderCard();
}

function _renderCard() {
  if (!fcAll.length) return;
  const c = fcAll[fcIdx];

  document.getElementById('fc-unit').textContent = c.unit;
  document.getElementById('fc-term').textContent = c.term;
  document.getElementById('fc-def').textContent  = c.def;

  // Render LaTeX in the latex field
  const latexEl = document.getElementById('fc-latex');
  latexEl.textContent = c.latex || '';
  if (c.latex && window.renderMathInElement) {
    renderMathInElement(latexEl, {
      delimiters:[
        {left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}
      ],throwOnError:false
    });
  }

  // Counter + progress
  document.getElementById('fc-counter').textContent = `Card ${fcIdx+1} of ${fcAll.length}`;
  const pct = ((fcIdx+1)/fcAll.length)*100;
  document.getElementById('fc-bar').style.width = pct + '%';

  // Arrow states
  document.getElementById('fc-prev').disabled = fcIdx === 0;
  document.getElementById('fc-next').disabled = fcIdx === fcAll.length - 1;
}

function flipCard() {
  fcFlipped = !fcFlipped;
  document.getElementById('fc-card').classList.toggle('flipped', fcFlipped);
}

function fcMove(dir) {
  fcIdx = Math.max(0, Math.min(fcAll.length-1, fcIdx + dir));
  fcFlipped = false;
  document.getElementById('fc-card').classList.remove('flipped');
  _renderCard();
}

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  showScreen('home');
  _renderCard();
});
