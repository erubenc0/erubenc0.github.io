/* ═══════════════════════════════════════════════════════════
   The Number Theory Scrapbook — app.js
═══════════════════════════════════════════════════════════ */

// ─── SCREENS ──────────────────────────────────────────────────
const ALL_SCREENS = [
  'home','founder-detail','learn',
  'topic-theory','topic-practice','topic-application',
  'glossary','mysteries',
  'mystery-theory','mystery-results',
  'more','references','about'
];

const NAV_MAP = {
  'home':'nav-home','founder-detail':'nav-home',
  'learn':'nav-learn','topic-theory':'nav-learn',
  'topic-practice':'nav-learn','topic-application':'nav-learn',
  'glossary':'nav-glossary',
  'mysteries':'nav-mysteries','mystery-theory':'nav-mysteries','mystery-results':'nav-mysteries',
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

  // Re-render KaTeX on the newly visible screen
  if (window.renderMathInElement && target) {
    setTimeout(() => renderMathInElement(target, {
      delimiters:[
        {left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false},
        {left:'\\(',right:'\\)',display:false},{left:'\\[',right:'\\]',display:true}
      ], throwOnError:false
    }), 60);
  }

  // Hide the global show-btn whenever screen changes
  // (it will re-show if needed by a quadrant on this screen)
  hideShowBtn();
}

// ─── HIDE / SHOW QUADRANT ─────────────────────────────────────
// When a panel is hidden, a floating "Show [panel name]" button
// appears in the bottom-right so the user can always restore it.

let _hiddenQuadrant = null;   // tracks currently-hidden quadrant id
let _hiddenGrid     = null;   // tracks which grid it belongs to

function toggleQuadrant(quadrantId, gridId) {
  const q    = document.getElementById(quadrantId);
  const grid = document.getElementById(gridId);
  if (!q || !grid) return;

  const alreadyHidden = q.classList.contains('hidden');

  if (alreadyHidden) {
    // Restore
    q.classList.remove('hidden');
    grid.classList.remove('one-visible');
    _hiddenQuadrant = null;
    _hiddenGrid     = null;
    hideShowBtn();
  } else {
    // Prevent hiding the last visible panel
    const siblings = Array.from(grid.querySelectorAll('.quadrant'));
    const otherVisible = siblings.some(s => s.id !== quadrantId && !s.classList.contains('hidden'));
    if (!otherVisible) return;

    // Hide this one
    q.classList.add('hidden');
    grid.classList.add('one-visible');
    _hiddenQuadrant = quadrantId;
    _hiddenGrid     = gridId;

    // Show the floating restore button
    const label = q.querySelector('.q-label span') ? q.querySelector('.q-label span').textContent : 'Panel';
    showShowBtn('Show: ' + label.trim());
  }
}

function restoreHiddenPanel() {
  if (_hiddenQuadrant && _hiddenGrid) {
    toggleQuadrant(_hiddenQuadrant, _hiddenGrid);
  }
}

function showShowBtn(label) {
  const btn = document.getElementById('global-show-btn');
  btn.textContent = label;
  btn.classList.add('visible');
}
function hideShowBtn() {
  const btn = document.getElementById('global-show-btn');
  if (btn) btn.classList.remove('visible');
}

function _resetQuadrants() {
  // Reset all hide states when opening a new topic / mystery
  _hiddenQuadrant = null;
  _hiddenGrid     = null;
  hideShowBtn();
  document.querySelectorAll('.quadrant').forEach(q => q.classList.remove('hidden'));
  document.querySelectorAll('.two-col').forEach(g  => g.classList.remove('one-visible'));
}

// ─── TOPICS ───────────────────────────────────────────────────
const TOPICS = [
  { id:'divisibility',  unit:'Unit I — Foundations',
    title:'Divisibility &amp; the Division Algorithm',
    discoverer:'Roots in Ancient Greek mathematics; formalized by Euclid, c. 300 BCE' },
  { id:'gcd',           unit:'Unit I — Foundations',
    title:'Greatest Common Divisor',
    discoverer:'Euclid, c. 300 BCE' },
  { id:'euclidean',     unit:'Unit I — Foundations',
    title:'The Euclidean Algorithm',
    discoverer:'Euclid, c. 300 BCE' },
  { id:'primes',        unit:'Unit I — Foundations',
    title:'Prime Numbers &amp; Unique Factorization',
    discoverer:'Euclid (infinitely many primes); Gauss (FTA formalization)' },
  { id:'congruences',   unit:'Unit II — Congruences &amp; Modular Arithmetic',
    title:'Congruences',
    discoverer:'Carl Friedrich Gauss, Disquisitiones Arithmeticae (1801)' },
  { id:'linear-cong',   unit:'Unit II — Congruences &amp; Modular Arithmetic',
    title:'Linear Congruences',
    discoverer:'Attributed to Gauss and earlier Islamic mathematicians' },
  { id:'crt',           unit:'Unit II — Congruences &amp; Modular Arithmetic',
    title:'The Chinese Remainder Theorem',
    discoverer:'Sunzi Suanjing, c. 3rd–5th century CE; generalized by Gauss' },
  { id:'euler-fermat',  unit:'Unit II — Congruences &amp; Modular Arithmetic',
    title:"Euler's &amp; Fermat's Theorems",
    discoverer:'Pierre de Fermat (1640); Leonhard Euler (generalization, 1763)' },
  { id:'phi',           unit:'Unit III — Arithmetic Functions',
    title:"Euler's Totient Function φ(n)",
    discoverer:'Leonhard Euler, 1763' },
  { id:'mobius',        unit:'Unit III — Arithmetic Functions',
    title:'The Möbius Function &amp; Inversion',
    discoverer:'August Ferdinand Möbius, 1832' },
  { id:'dirichlet',     unit:'Unit III — Arithmetic Functions',
    title:'Dirichlet Series &amp; Convolution',
    discoverer:'Peter Gustav Lejeune Dirichlet, c. 1837' },
  { id:'quad-res',      unit:'Unit IV — Quadratic Residues &amp; Reciprocity',
    title:'Quadratic Residues',
    discoverer:'Studied by Euler and Legendre; systematized by Gauss' },
  { id:'legendre',      unit:'Unit IV — Quadratic Residues &amp; Reciprocity',
    title:'The Legendre Symbol',
    discoverer:'Adrien-Marie Legendre, 1798' },
  { id:'quad-rec',      unit:'Unit IV — Quadratic Residues &amp; Reciprocity',
    title:'The Law of Quadratic Reciprocity',
    discoverer:'Conjectured by Euler &amp; Legendre; first proved by Gauss (1796)' },
  { id:'pnt',           unit:'Unit V — Analytic &amp; Advanced Topics',
    title:'The Prime Number Theorem',
    discoverer:'Conjectured by Gauss &amp; Legendre; proved by Hadamard &amp; de la Vallée Poussin (1896)' },
  { id:'riemann-zeta',  unit:'Unit V — Analytic &amp; Advanced Topics',
    title:'The Riemann Zeta Function',
    discoverer:'Bernhard Riemann, 1859' },
  { id:'diophantine',   unit:'Unit V — Analytic &amp; Advanced Topics',
    title:'Diophantine Equations',
    discoverer:'Diophantus of Alexandria, c. 3rd century CE' },
  { id:'cryptography',  unit:'Unit V — Analytic &amp; Advanced Topics',
    title:'Number Theory in Cryptography',
    discoverer:'RSA: Rivest, Shamir, Adleman (1977)' },
];

let currentTopicIdx = 0;

function openTopic(id, idx) {
  currentTopicIdx = idx;
  const t = TOPICS[idx];
  _resetQuadrants();

  const clean = t.title.replace(/&amp;/g, '&');

  // Headers — theory screen
  document.getElementById('tt-unit').textContent        = t.unit;
  document.getElementById('tt-title').innerHTML         = t.title;
  document.getElementById('tt-discoverer').innerHTML    = 'Discovered / developed by: ' + t.discoverer;
  // Practice screen
  document.getElementById('tp-unit').textContent        = t.unit;
  document.getElementById('tp-title').innerHTML         = t.title + ' — Practice';
  // Application screen
  document.getElementById('ta-unit').textContent        = t.unit;
  document.getElementById('ta-title').innerHTML         = t.title + ' — Relevance';

  // ── Content — replace placeholders below with your real LaTeX / content ──

  document.getElementById('tt-theory-content').innerHTML = `
    <div class="latex-block">[ LaTeX theory for <strong>${clean}</strong> goes here ]</div>
  `;
  document.getElementById('tt-viz-content').innerHTML = `
    <div class="viz-area">[ Visualization / diagram for ${clean} ]</div>
  `;
  document.getElementById('tp-steps-content').innerHTML = `
    <div class="step-block"><div class="step-label">Step 1</div><div class="step-content">[ Step-by-step LaTeX guide ]</div></div>
    <div class="step-block"><div class="step-label">Step 2</div><div class="step-content">[ Continue steps ]</div></div>
    <div class="step-block"><div class="step-label">Step 3</div><div class="step-content">[ Continue steps ]</div></div>
  `;
  document.getElementById('tp-problems-content').innerHTML = `
    <div class="problem-wrap"><div class="problem-q">Problem 1: [ Problem statement ]</div><input class="problem-input" type="text" placeholder="Your answer…"/></div>
    <div class="problem-wrap"><div class="problem-q">Problem 2: [ Problem statement ]</div><input class="problem-input" type="text" placeholder="Your answer…"/></div>
    <div class="problem-wrap"><div class="problem-q">Problem 3: [ Problem statement ]</div><input class="problem-input" type="text" placeholder="Your answer…"/></div>
  `;
  document.getElementById('ta-app-content').innerHTML = `
    <div class="ph" style="min-height:120px;">[ Real-world applications for ${clean} ]</div>
  `;
  document.getElementById('ta-examples-content').innerHTML = `
    <div class="app-block"><h4>[ Field / Application ]</h4><p>[ Description ]</p></div>
    <div class="app-block"><h4>[ Field / Application ]</h4><p>[ Description ]</p></div>
    <div style="margin-top:1rem;"><span class="app-tag">[ Tag ]</span><span class="app-tag">[ Tag ]</span><span class="app-tag">[ Tag ]</span></div>
  `;

  showScreen('topic-theory');
}

function goToPractice()    { showScreen('topic-practice'); }
function goToApplication() { showScreen('topic-application'); }

// ─── MYSTERIES ────────────────────────────────────────────────
const MYSTERIES = [
  { eyebrow:'Exhibit 01 — Unsolved Mystery',
    title:'[ Conjecture Name ]',
    proposer:'Proposed by: [ Name, Year ]' },
  { eyebrow:'Exhibit 02 — Unsolved Mystery',
    title:'[ Conjecture Name ]',
    proposer:'Proposed by: [ Name, Year ]' },
  { eyebrow:'Exhibit 03 — Unsolved Mystery',
    title:'[ Conjecture Name ]',
    proposer:'Proposed by: [ Name, Year ]' },
];

let currentMysteryIdx = 0;

function openMystery(idx) {
  currentMysteryIdx = idx;
  const m = MYSTERIES[idx];
  _resetQuadrants();

  // Both screens share the same data
  ['mt','mr'].forEach(prefix => {
    const eyEl = document.getElementById(prefix + '-eyebrow');
    const ttEl = document.getElementById(prefix + '-title');
    if (eyEl) eyEl.textContent = m.eyebrow;
    if (ttEl) ttEl.innerHTML   = m.title;
  });
  const propEl = document.getElementById('mt-proposer');
  if (propEl) propEl.innerHTML = m.proposer;

  // ── Mystery content — replace placeholders below ──
  document.getElementById('mt-conjecture-content').innerHTML = `
    <div class="latex-block">[ Formal LaTeX statement of the conjecture ]</div>
  `;
  document.getElementById('mt-viz-content').innerHTML = `
    <div class="viz-area">[ Diagram or chart ]</div>
  `;
  document.getElementById('mr-known-content').innerHTML = `
    <div class="step-block"><div class="step-label">Result 1</div><div class="step-content">[ Partial result or related theorem ]</div></div>
    <div class="step-block"><div class="step-label">Result 2</div><div class="step-content">[ Partial result or related theorem ]</div></div>
  `;
  document.getElementById('mr-significance-content').innerHTML = `
    <div class="ph" style="min-height:80px;">[ Why solving this would matter ]</div>
    <div style="margin-top:1rem;"><span class="app-tag">[ Tag ]</span><span class="app-tag">[ Tag ]</span></div>
  `;

  showScreen('mystery-theory');
}

// ─── FOUNDING FATHERS ─────────────────────────────────────────
/*
  To add real content for each founder, find the matching key
  in FOUNDERS below and fill in the placeholder strings.
  For the portrait image, set imgSrc to the local filename,
  e.g. 'gauss.jpg' (file must be in your project folder).
*/
const FOUNDERS = {
  gauss: {
    name:    'Carl Friedrich Gauss',
    years:   '1777 – 1855',
    imgSrc:  'gauss.jpg',
    backstory:   '[ Your content goes here ]',
    discoveries: '[ Your content goes here ]',
    impact:      '[ Your content goes here ]',
    legacy:      '[ Your content goes here ]',
  },
  fermat: {
    name:    'Pierre de Fermat',
    years:   '1601 – 1665',
    imgSrc:  'fermat.jpg',
    backstory:   '[ Your content goes here ]',
    discoveries: '[ Your content goes here ]',
    impact:      '[ Your content goes here ]',
    legacy:      '[ Your content goes here ]',
  },
  euler: {
    name:    'Leonhard Euler',
    years:   '1707 – 1783',
    imgSrc:  'euler.jpg',
    backstory:   '[ Your content goes here ]',
    discoveries: '[ Your content goes here ]',
    impact:      '[ Your content goes here ]',
    legacy:      '[ Your content goes here ]',
  },
  riemann: {
    name:    'Bernhard Riemann',
    years:   '1826 – 1866',
    imgSrc:  'riemann.jpg',
    backstory:   '[ Your content goes here ]',
    discoveries: '[ Your content goes here ]',
    impact:      '[ Your content goes here ]',
    legacy:      '[ Your content goes here ]',
  },
};

function openFounder(key) {
  const f = FOUNDERS[key];
  if (!f) return;

  document.getElementById('founder-name').textContent    = f.name;
  document.getElementById('founder-years').textContent   = f.years;
  document.getElementById('founder-backstory').textContent   = f.backstory;
  document.getElementById('founder-discoveries').textContent = f.discoveries;
  document.getElementById('founder-impact').textContent      = f.impact;
  document.getElementById('founder-legacy').textContent      = f.legacy;

  // Portrait image
  const img = document.getElementById('founder-img');
  const placeholder = document.getElementById('founder-portrait-placeholder');
  img.src = f.imgSrc;
  img.alt = f.name;
  img.style.display = 'block';
  placeholder.style.display = 'none';
  // If image fails to load, fallback shows
  img.onerror = function() {
    img.style.display = 'none';
    placeholder.style.display = 'flex';
  };

  showScreen('founder-detail');
}

// ─── FLASHCARD GLOSSARY ───────────────────────────────────────
/*
  Add your flashcard terms in the FLASHCARDS array below.
  Fields:
    unit  — e.g. "Unit I — Foundations"
    term  — the term name
    def   — your definition (plain text)
    latex — LaTeX notation string, e.g. "$a \\mid b$"
             Use "" if no formula needed.
    cat   — "foundations" | "congruences" | "functions" | "primes" | "advanced"
*/
const FLASHCARDS = [
  { unit:'Unit I — Foundations',    term:'Divisibility',             def:'[ Your definition ]', latex:'$a \\mid b$',                                      cat:'foundations' },
  { unit:'Unit I — Foundations',    term:'Integer',                  def:'[ Your definition ]', latex:'$\\mathbb{Z} = \\{\\ldots,-1,0,1,\\ldots\\}$',       cat:'foundations' },
  { unit:'Unit I — Foundations',    term:'Greatest Common Divisor',  def:'[ Your definition ]', latex:'$\\gcd(a,b)$',                                      cat:'foundations' },
  { unit:'Unit I — Foundations',    term:'Least Common Multiple',    def:'[ Your definition ]', latex:'$\\mathrm{lcm}(a,b)$',                              cat:'foundations' },
  { unit:'Unit I — Foundations',    term:'Prime Number',             def:'[ Your definition ]', latex:'$p \\in \\mathbb{P},\\; p > 1$',                    cat:'primes'      },
  { unit:'Unit I — Foundations',    term:'Composite Number',         def:'[ Your definition ]', latex:'$n = ab,\\; a,b > 1$',                              cat:'primes'      },
  { unit:'Unit II — Congruences',   term:'Congruence',               def:'[ Your definition ]', latex:'$a \\equiv b \\pmod{n}$',                           cat:'congruences' },
  { unit:'Unit II — Congruences',   term:'Residue Class',            def:'[ Your definition ]', latex:'$[a]_n = \\{a + kn : k \\in \\mathbb{Z}\\}$',       cat:'congruences' },
  { unit:'Unit II — Congruences',   term:'Modular Inverse',          def:'[ Your definition ]', latex:'$a \\cdot a^{-1} \\equiv 1 \\pmod{n}$',             cat:'congruences' },
  { unit:'Unit III — Arith. Fns',  term:"Euler's Totient Function", def:'[ Your definition ]', latex:'$\\varphi(n)=n\\prod_{p|n}\\left(1-\\tfrac{1}{p}\\right)$', cat:'functions' },
  { unit:'Unit III — Arith. Fns',  term:'Möbius Function',          def:'[ Your definition ]', latex:'$\\mu(n)\\in\\{-1,0,1\\}$',                         cat:'functions'   },
  { unit:'Unit III — Arith. Fns',  term:'Multiplicative Function',  def:'[ Your definition ]', latex:'$f(mn)=f(m)f(n),\\;\\gcd(m,n)=1$',                  cat:'functions'   },
  { unit:'Unit IV — Quad. Res.',    term:'Quadratic Residue',        def:'[ Your definition ]', latex:'$x^2\\equiv a\\pmod{p}$ has a solution',             cat:'advanced'    },
  { unit:'Unit IV — Quad. Res.',    term:'Legendre Symbol',          def:'[ Your definition ]', latex:'$\\left(\\dfrac{a}{p}\\right)\\in\\{-1,0,1\\}$',    cat:'advanced'    },
  { unit:'Unit V — Analytic',       term:'Riemann Zeta Function',    def:'[ Your definition ]', latex:'$\\zeta(s)=\\sum_{n=1}^{\\infty}\\frac{1}{n^s}$',   cat:'advanced'    },
  { unit:'Unit V — Analytic',       term:'Dirichlet Series',         def:'[ Your definition ]', latex:'$\\sum_{n=1}^{\\infty}\\frac{a_n}{n^s}$',           cat:'advanced'    },
];

let fcAll     = FLASHCARDS.slice();
let fcIdx     = 0;
let fcFlipped = false;

function setGlossaryCat(cat, btn) {
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  fcAll     = cat === 'all' ? FLASHCARDS.slice() : FLASHCARDS.filter(c => c.cat === cat);
  fcIdx     = 0;
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

  const latexEl = document.getElementById('fc-latex');
  latexEl.textContent = c.latex || '';
  if (c.latex && window.renderMathInElement) {
    renderMathInElement(latexEl, {
      delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],
      throwOnError:false
    });
  }

  document.getElementById('fc-counter').textContent = `Card ${fcIdx + 1} of ${fcAll.length}`;
  document.getElementById('fc-bar').style.width = ((fcIdx + 1) / fcAll.length * 100) + '%';
  document.getElementById('fc-prev').disabled = fcIdx === 0;
  document.getElementById('fc-next').disabled = fcIdx === fcAll.length - 1;
}

function flipCard() {
  fcFlipped = !fcFlipped;
  document.getElementById('fc-card').classList.toggle('flipped', fcFlipped);
}

function fcMove(dir) {
  fcIdx = Math.max(0, Math.min(fcAll.length - 1, fcIdx + dir));
  fcFlipped = false;
  document.getElementById('fc-card').classList.remove('flipped');
  _renderCard();
}

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  showScreen('home');
  _renderCard();
});
