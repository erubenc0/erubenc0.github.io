/* ═══════════════════════════════════════════════════════════
   The Number Theory Scrapbook — app.js
═══════════════════════════════════════════════════════════ */

// ─── SCREENS ──────────────────────────────────────────────────
const ALL_SCREENS = [
  'home','founder-detail','learn','unit-title','unit-complete',
  'topic-theory','topic-viz','topic-steps','topic-problems','topic-application',
  'glossary','mysteries',
  'mystery-conjecture','mystery-viz','mystery-results','mystery-matters',
  'more','references','about'
];

const NAV_MAP = {
  'home':'nav-home','founder-detail':'nav-home',
  'learn':'nav-learn','unit-title':'nav-learn','unit-complete':'nav-learn',
  'topic-theory':'nav-learn','topic-viz':'nav-learn',
  'topic-steps':'nav-learn','topic-problems':'nav-learn','topic-application':'nav-learn',
  'glossary':'nav-glossary',
  'mysteries':'nav-mysteries',
  'mystery-conjecture':'nav-mysteries','mystery-viz':'nav-mysteries',
  'mystery-results':'nav-mysteries','mystery-matters':'nav-mysteries',
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

  if (window.renderMathInElement && target) {
    setTimeout(() => renderMathInElement(target, {
      delimiters:[
        {left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false},
        {left:'\\(',right:'\\)',display:false},{left:'\\[',right:'\\]',display:true}
      ], throwOnError:false
    }), 60);
  }

  hideShowBtn();
}

// ─── HIDE / SHOW PANEL ────────────────────────────────────────
let _hiddenQuadrant = null;
let _hiddenGrid     = null;

function toggleQuadrant(quadrantId, gridId) {
  const q    = document.getElementById(quadrantId);
  const grid = document.getElementById(gridId);
  if (!q || !grid) return;
  const alreadyHidden = q.classList.contains('hidden');
  if (alreadyHidden) {
    q.classList.remove('hidden'); grid.classList.remove('one-visible');
    _hiddenQuadrant = null; _hiddenGrid = null; hideShowBtn();
  } else {
    const siblings = Array.from(grid.querySelectorAll('.quadrant'));
    const otherVisible = siblings.some(s => s.id !== quadrantId && !s.classList.contains('hidden'));
    if (!otherVisible) return;
    q.classList.add('hidden'); grid.classList.add('one-visible');
    _hiddenQuadrant = quadrantId; _hiddenGrid = gridId;
    const label = q.querySelector('.q-label span') ? q.querySelector('.q-label span').textContent : 'Panel';
    showShowBtn('Show: ' + label.trim());
  }
}

function restoreHiddenPanel() {
  if (_hiddenQuadrant && _hiddenGrid) toggleQuadrant(_hiddenQuadrant, _hiddenGrid);
}
function showShowBtn(label) {
  const btn = document.getElementById('global-show-btn');
  btn.textContent = label; btn.classList.add('visible');
}
function hideShowBtn() {
  const btn = document.getElementById('global-show-btn');
  if (btn) btn.classList.remove('visible');
}

// ─── UNIT & TOPIC DATA ────────────────────────────────────────
/*
  UNITS structure:
    Each unit has a name, subtitle, and array of topics.
    Each topic has: id, number, name, discoverer.

  HOW TO ADD CONTENT:
    Fill in topic content inside the _loadTopicContent() function below.
    Find the matching topic id and replace the placeholder innerHTML strings.
*/

const UNITS = [
  {
    name: 'Unit 1',
    title: 'The Foundations of Integers',
    desc: '[ Add a brief description of Unit 1 here. ]',
    topics: [
      { id:'pythagorean', num:'1.1', name:'Pythagorean Triples',                 discoverer:'Ancient Greek mathematics; Pythagoras, c. 570 BCE' },
      { id:'divisibility',num:'1.2', name:'Divisibility',                         discoverer:'Euclid, c. 300 BCE' },
      { id:'gcd',         num:'1.3', name:'The Greatest Common Divisor (GCD)',    discoverer:'Euclid, c. 300 BCE' },
      { id:'euclidean',   num:'1.4', name:'The Euclidean Algorithm',              discoverer:'Euclid, c. 300 BCE' },
    ]
  },
  {
    name: 'Unit 2',
    title: 'Primes and Unique Factorization',
    desc: '[ Add a brief description of Unit 2 here. ]',
    topics: [
      { id:'fta',         num:'2.1', name:'The Fundamental Theorem of Arithmetic', discoverer:'Euclid; formalized by Gauss (1801)' },
      { id:'prime-dist',  num:'2.2', name:'Distribution of Primes',                discoverer:'Euclid (infinitude); Gauss &amp; Legendre (density)' },
      { id:'pnt',         num:'2.3', name:'The Prime Number Theorem',              discoverer:'Proved by Hadamard &amp; de la Vallée Poussin (1896)' },
    ]
  },
  {
    name: 'Unit 3',
    title: 'Congruences and Modular Arithmetic',
    desc: '[ Add a brief description of Unit 3 here. ]',
    topics: [
      { id:'congruences',  num:'3.1', name:'Linear Congruences',         discoverer:'Carl Friedrich Gauss, Disquisitiones Arithmeticae (1801)' },
      { id:'fermats-lit',  num:'3.2', name:"Fermat's Little Theorem",    discoverer:'Pierre de Fermat (1640)' },
      { id:'carmichael',   num:'3.3', name:'Carmichael Numbers',         discoverer:'Robert Carmichael (1910)' },
    ]
  },
  {
    name: 'Unit 4',
    title: "Euler's Totient and RSA Cryptography",
    desc: '[ Add a brief description of Unit 4 here. ]',
    topics: [
      { id:'phi',         num:'4.1', name:"Euler's Phi Function $\\varphi(n)$", discoverer:'Leonhard Euler (1763)' },
      { id:'euler-thm',   num:'4.2', name:"Euler's Theorem",                    discoverer:'Leonhard Euler (1763)' },
      { id:'rsa',         num:'4.3', name:'Public Key Encryption (RSA)',         discoverer:'Rivest, Shamir, Adleman (1977)' },
    ]
  },
  {
    name: 'Unit 5',
    title: 'Powers, Roots, and Indices',
    desc: '[ Add a brief description of Unit 5 here. ]',
    topics: [
      { id:'prim-roots',  num:'5.1', name:'Primitive Roots',               discoverer:'Leonhard Euler; Gauss (Disquisitiones, 1801)' },
      { id:'disc-log',    num:'5.2', name:'The Discrete Logarithm Problem', discoverer:'Formalized in modern cryptography context, 1970s' },
    ]
  },
  {
    name: 'Unit 6',
    title: 'Quadratic Reciprocity',
    desc: '[ Add a brief description of Unit 6 here. ]',
    topics: [
      { id:'quad-res',    num:'6.1', name:'Quadratic Residues',                   discoverer:'Studied by Euler and Legendre; Gauss' },
      { id:'legendre',    num:'6.2', name:'The Legendre Symbol',                  discoverer:'Adrien-Marie Legendre (1798)' },
      { id:'quad-rec',    num:'6.3', name:'The Law of Quadratic Reciprocity',     discoverer:'First proved by Gauss (1796)' },
    ]
  },
  {
    name: 'Unit 7',
    title: 'Sums of Squares and Diophantine Equations',
    desc: '[ Add a brief description of Unit 7 here. ]',
    topics: [
      { id:'gaussian',    num:'7.1', name:'Gaussian Integers',                    discoverer:'Carl Friedrich Gauss (1832)' },
      { id:'sums-sq',     num:'7.2', name:'Sums of Two and Four Squares',         discoverer:'Fermat (2 squares); Lagrange (4 squares, 1770)' },
      { id:'pell',        num:'7.3', name:"Pell's Equation",                      discoverer:'Brahmaguputa (7th century CE); Euler named it' },
    ]
  },
  {
    name: 'Unit 8',
    title: 'Advanced Landscapes',
    desc: '[ Add a brief description of Unit 8 here. ]',
    topics: [
      { id:'cont-frac',   num:'8.1', name:'Continued Fractions',                  discoverer:'Studied by Euler, Lagrange, and others' },
      { id:'elliptic',    num:'8.2', name:'Elliptic Curves',                      discoverer:'19th century; modern formulation by Weierstrass' },
      { id:'descent',     num:'8.3', name:"Descent and Fermat's Last Theorem",    discoverer:"Fermat's method; proved by Wiles (1995)" },
    ]
  },
];

let currentUnitIdx  = 0;
let currentTopicIdx = 0;

// ─── UNIT FLOW ────────────────────────────────────────────────
function openUnit(unitIdx) {
  currentUnitIdx  = unitIdx;
  currentTopicIdx = 0;
  const u = UNITS[unitIdx];

  // Build unit title card
  const topicsHtml = u.topics.map(t =>
    `<div class="unit-topic-item">
      <span class="unit-topic-item-num">${t.num}</span>
      <span class="unit-topic-item-name">${t.name}</span>
    </div>`
  ).join('');

  document.getElementById('unit-title-content').innerHTML = `
    <div class="unit-title-eyebrow">${u.name} of 8</div>
    <h1 class="unit-title-heading">${u.title}</h1>
    <p class="unit-title-sub">${u.desc}</p>
    <div class="unit-topics-list">${topicsHtml}</div>
  `;

  showScreen('unit-title');
}

function startUnit() {
  currentTopicIdx = 0;
  _openTopic(currentUnitIdx, 0);
}

function _openTopic(unitIdx, topicIdx) {
  const u = UNITS[unitIdx];
  const t = u.topics[topicIdx];
  const eyebrow = `${u.name} · ${t.num}: ${t.name}`;
  const title   = t.name;
  const disc    = 'Discovered / developed by: ' + t.discoverer;

  // Set headers on all 5 screens
  [
    ['tt-eyebrow','tt-title',null],
    ['tv-eyebrow','tv-title',null],
    ['ts-eyebrow','ts-title', t.name + ' — Step-by-Step'],
    ['tp-eyebrow','tp-title', t.name + ' — Practice Problems'],
    ['ta-eyebrow','ta-title', t.name + ' — Relevance'],
  ].forEach(([eyId, titId, customTitle]) => {
    const ey  = document.getElementById(eyId);
    const tit = document.getElementById(titId);
    if (ey)  ey.textContent  = eyebrow;
    if (tit) tit.innerHTML   = customTitle || title;
  });

  document.getElementById('tt-discoverer').innerHTML = disc;

  // ── CONTENT — replace placeholders below with your real LaTeX ──
  // Find the topic by id and fill in each section.

  _loadTopicContent(t.id, t.name.replace(/\$[^$]*\$/g,''));

  // "Proceed" button on application screen — go to next topic or unit complete
  const isLastTopic = topicIdx >= u.topics.length - 1;
  const proceedBtn  = document.getElementById('topic-proceed-btn');
  if (proceedBtn) proceedBtn.textContent = isLastTopic ? 'Finish Unit →' : 'Next Topic →';

  showScreen('topic-theory');
}

function _loadTopicContent(id, name) {
  /*
    ════════════════════════════════════════════════
    TO ADD YOUR CONTENT:
    Find the matching case below and replace the
    placeholder innerHTML strings with your real
    LaTeX / text / diagrams.

    theory  → LaTeX explanation
    viz     → diagram HTML, <img>, or SVG
    steps   → step-by-step .step-block elements
    problems→ .problem-wrap elements
    app     → application paragraphs + .app-block
    ════════════════════════════════════════════════
  */

  // Default placeholders — these show until you fill in real content
  let theory   = `<div class="latex-block">[ LaTeX theory for <strong>${name}</strong> goes here ]</div>`;
  let viz      = `<div class="viz-area" style="min-height:400px;">[ Visualization / diagram for ${name} ]</div>`;
  let steps    = `<div class="step-block"><div class="step-label">Step 1</div><div class="step-content">[ Step-by-step guide for ${name} ]</div></div><div class="step-block"><div class="step-label">Step 2</div><div class="step-content">[ Continue steps ]</div></div><div class="step-block"><div class="step-label">Step 3</div><div class="step-content">[ Continue steps ]</div></div>`;
  let problems = `<div class="problem-wrap"><div class="problem-q">Problem 1: [ Problem statement ]</div><input class="problem-input" type="text" placeholder="Your answer…"/></div><div class="problem-wrap"><div class="problem-q">Problem 2: [ Problem statement ]</div><input class="problem-input" type="text" placeholder="Your answer…"/></div><div class="problem-wrap"><div class="problem-q">Problem 3: [ Problem statement ]</div><input class="problem-input" type="text" placeholder="Your answer…"/></div>`;
  let app      = `<div class="ph" style="min-height:120px;margin-bottom:1.2rem;">[ Real-world applications for ${name} ]</div><div class="app-block"><h4>[ Field / Application ]</h4><p>[ Description ]</p></div><div class="app-block"><h4>[ Field / Application ]</h4><p>[ Description ]</p></div><div style="margin-top:1.2rem;"><span class="app-tag">[ Tag ]</span><span class="app-tag">[ Tag ]</span><span class="app-tag">[ Tag ]</span></div>`;

  // ── ADD YOUR CONTENT PER TOPIC BELOW ──
  // Example pattern:
  // if (id === 'pythagorean') {
  //   theory   = `<div class="latex-block">A Pythagorean triple satisfies $$a^2 + b^2 = c^2$$...</div>`;
  //   viz      = `<img src="pythagorean.png" style="width:100%;border-radius:6px;">`;
  //   steps    = `<div class="step-block">...</div>`;
  //   problems = `<div class="problem-wrap">...</div>`;
  //   app      = `<div class="app-block">...</div>`;
  // }

  document.getElementById('tt-content').innerHTML = theory;
  document.getElementById('tv-content').innerHTML = viz;
  document.getElementById('ts-content').innerHTML = steps;
  document.getElementById('tp-content').innerHTML = problems;
  document.getElementById('ta-content').innerHTML = app;
}

// Proceed buttons
function proceedFromTheory()   { showScreen('topic-viz');         }
function proceedFromViz()      { showScreen('topic-steps');       }
function proceedFromSteps()    { showScreen('topic-problems');    }
function proceedFromProblems() { showScreen('topic-application'); }

function proceedFromApplication() {
  const u = UNITS[currentUnitIdx];
  currentTopicIdx++;
  if (currentTopicIdx < u.topics.length) {
    _openTopic(currentUnitIdx, currentTopicIdx);
  } else {
    _showUnitComplete();
  }
}

function goTopicBack(from) {
  // Called by back button on theory screen
  const u = UNITS[currentUnitIdx];
  if (currentTopicIdx === 0) {
    showScreen('unit-title');
  } else {
    currentTopicIdx--;
    _openTopic(currentUnitIdx, currentTopicIdx);
    // Jump to the application screen of the previous topic
    showScreen('topic-application');
  }
}

function _showUnitComplete() {
  const u        = UNITS[currentUnitIdx];
  const hasNext  = currentUnitIdx < UNITS.length - 1;
  const nextUnit = hasNext ? UNITS[currentUnitIdx + 1] : null;

  document.getElementById('unit-complete-content').innerHTML = `
    <div class="unit-complete-icon">✦</div>
    <h1 class="unit-complete-heading">${u.name} Complete</h1>
    <p class="unit-complete-body">
      You have finished all topics in <strong>${u.title}</strong>.
    </p>
    <div class="unit-complete-actions">
      <button class="btn btn-outline" onclick="showScreen('learn')">← Back to Syllabus</button>
      ${hasNext ? `<button class="btn btn-primary" onclick="openUnit(${currentUnitIdx + 1})">Next: ${nextUnit.name} →</button>` : ''}
    </div>
  `;
  showScreen('unit-complete');
}

// ─── MYSTERIES ────────────────────────────────────────────────
const MYSTERIES = [
  { eyebrow:'Exhibit 01 — Unsolved Mystery', title:'[ Conjecture Name ]', proposer:'Proposed by: [ Name, Year ]' },
  { eyebrow:'Exhibit 02 — Unsolved Mystery', title:'[ Conjecture Name ]', proposer:'Proposed by: [ Name, Year ]' },
  { eyebrow:'Exhibit 03 — Unsolved Mystery', title:'[ Conjecture Name ]', proposer:'Proposed by: [ Name, Year ]' },
];

function openMystery(idx) {
  const m = MYSTERIES[idx];

  ['mc','mv','mr','mm'].forEach(prefix => {
    const ey = document.getElementById(prefix + '-eyebrow');
    const tt = document.getElementById(prefix + '-title');
    if (ey) ey.textContent = m.eyebrow;
    if (tt) tt.innerHTML   = m.title;
  });
  const propEl = document.getElementById('mc-proposer');
  if (propEl) propEl.innerHTML = m.proposer;

  // ── Mystery content — replace placeholders below ──
  document.getElementById('mc-content').innerHTML =
    `<div class="latex-block">[ Formal LaTeX statement of the conjecture ]</div>`;
  document.getElementById('mv-content').innerHTML =
    `<div class="viz-area" style="min-height:400px;">[ Diagram or chart ]</div>`;
  document.getElementById('mr-content').innerHTML =
    `<div class="step-block"><div class="step-label">Result 1</div><div class="step-content">[ Partial result or related theorem ]</div></div><div class="step-block"><div class="step-label">Result 2</div><div class="step-content">[ Partial result or related theorem ]</div></div>`;
  document.getElementById('mm-content').innerHTML =
    `<div class="ph" style="min-height:120px;margin-bottom:1.2rem;">[ Why solving this would matter ]</div><div style="margin-top:1rem;"><span class="app-tag">[ Tag ]</span><span class="app-tag">[ Tag ]</span></div>`;

  showScreen('mystery-conjecture');
}

// ─── FOUNDING FATHERS ─────────────────────────────────────────
/*
  Fill in the content fields below for each founder.
  Set imgSrc to the local filename (e.g. 'gauss.jpg').
  File must be placed in the project folder.
*/
const FOUNDERS = {
  gauss:   { name:'Carl Friedrich Gauss', years:'1777 – 1855', imgSrc:'gauss.jpg',
             backstory:'[ Your content ]', discoveries:'[ Your content ]', impact:'[ Your content ]', legacy:'[ Your content ]' },
  fermat:  { name:'Pierre de Fermat',     years:'1601 – 1665', imgSrc:'fermat.jpg',
             backstory:'[ Your content ]', discoveries:'[ Your content ]', impact:'[ Your content ]', legacy:'[ Your content ]' },
  euler:   { name:'Leonhard Euler',       years:'1707 – 1783', imgSrc:'euler.jpg',
             backstory:'[ Your content ]', discoveries:'[ Your content ]', impact:'[ Your content ]', legacy:'[ Your content ]' },
  riemann: { name:'Bernhard Riemann',     years:'1826 – 1866', imgSrc:'riemann.jpg',
             backstory:'[ Your content ]', discoveries:'[ Your content ]', impact:'[ Your content ]', legacy:'[ Your content ]' },
};

function openFounder(key) {
  const f = FOUNDERS[key];
  if (!f) return;
  document.getElementById('founder-name').textContent       = f.name;
  document.getElementById('founder-years').textContent      = f.years;
  document.getElementById('founder-backstory').textContent  = f.backstory;
  document.getElementById('founder-discoveries').textContent= f.discoveries;
  document.getElementById('founder-impact').textContent     = f.impact;
  document.getElementById('founder-legacy').textContent     = f.legacy;

  const img = document.getElementById('founder-img');
  const ph  = document.getElementById('founder-portrait-placeholder');
  img.src = f.imgSrc; img.alt = f.name; img.style.display = 'block'; ph.style.display = 'none';
  img.onerror = () => { img.style.display = 'none'; ph.style.display = 'flex'; };

  showScreen('founder-detail');
}

// ─── FLASHCARD GLOSSARY ───────────────────────────────────────
/*
  Add your terms to the FLASHCARDS array.
    unit  — e.g. "Unit 1 — Foundations"
    term  — the term name
    def   — your definition (plain text)
    latex — LaTeX string, e.g. "$a \\mid b$"  (use "" if none)
    cat   — "foundations" | "congruences" | "functions" | "primes" | "advanced"
*/
const FLASHCARDS = [
  { unit:'Unit 1 — Foundations',    term:'Divisibility',             def:'[ Your definition ]', latex:'$a \\mid b$',                                           cat:'foundations' },
  { unit:'Unit 1 — Foundations',    term:'Integer',                  def:'[ Your definition ]', latex:'$\\mathbb{Z} = \\{\\ldots,-1,0,1,\\ldots\\}$',           cat:'foundations' },
  { unit:'Unit 1 — Foundations',    term:'Greatest Common Divisor',  def:'[ Your definition ]', latex:'$\\gcd(a,b)$',                                           cat:'foundations' },
  { unit:'Unit 1 — Foundations',    term:'Least Common Multiple',    def:'[ Your definition ]', latex:'$\\mathrm{lcm}(a,b)$',                                   cat:'foundations' },
  { unit:'Unit 2 — Primes',         term:'Prime Number',             def:'[ Your definition ]', latex:'$p \\in \\mathbb{P},\\; p > 1$',                         cat:'primes'      },
  { unit:'Unit 2 — Primes',         term:'Composite Number',         def:'[ Your definition ]', latex:'$n = ab,\\; a,b > 1$',                                   cat:'primes'      },
  { unit:'Unit 3 — Congruences',    term:'Congruence',               def:'[ Your definition ]', latex:'$a \\equiv b \\pmod{n}$',                                cat:'congruences' },
  { unit:'Unit 3 — Congruences',    term:'Residue Class',            def:'[ Your definition ]', latex:'$[a]_n = \\{a + kn : k \\in \\mathbb{Z}\\}$',            cat:'congruences' },
  { unit:'Unit 3 — Congruences',    term:'Modular Inverse',          def:'[ Your definition ]', latex:'$a \\cdot a^{-1} \\equiv 1 \\pmod{n}$',                  cat:'congruences' },
  { unit:'Unit 4 — Euler / RSA',    term:"Euler's Totient Function", def:'[ Your definition ]', latex:'$\\varphi(n)=n\\prod_{p|n}\\left(1-\\tfrac{1}{p}\\right)$', cat:'functions' },
  { unit:'Unit 4 — Euler / RSA',    term:"Euler's Theorem",          def:'[ Your definition ]', latex:'$a^{\\varphi(n)} \\equiv 1 \\pmod{n}$',                  cat:'functions'   },
  { unit:'Unit 4 — Euler / RSA',    term:'Multiplicative Function',  def:'[ Your definition ]', latex:'$f(mn)=f(m)f(n),\\;\\gcd(m,n)=1$',                       cat:'functions'   },
  { unit:'Unit 6 — Quad. Rec.',     term:'Quadratic Residue',        def:'[ Your definition ]', latex:'$x^2\\equiv a\\pmod{p}$ has a solution',                  cat:'advanced'    },
  { unit:'Unit 6 — Quad. Rec.',     term:'Legendre Symbol',          def:'[ Your definition ]', latex:'$\\left(\\dfrac{a}{p}\\right)\\in\\{-1,0,1\\}$',         cat:'advanced'    },
  { unit:'Unit 8 — Advanced',       term:'Riemann Zeta Function',    def:'[ Your definition ]', latex:'$\\zeta(s)=\\sum_{n=1}^{\\infty}\\frac{1}{n^s}$',        cat:'advanced'    },
  { unit:'Unit 8 — Advanced',       term:'Dirichlet Series',         def:'[ Your definition ]', latex:'$\\sum_{n=1}^{\\infty}\\frac{a_n}{n^s}$',                cat:'advanced'    },
];

let fcAll     = FLASHCARDS.filter(c => c.cat === 'foundations');
let fcIdx     = 0;
let fcFlipped = false;
let fcActiveCat = 'foundations';

function setGlossaryCat(cat, btn) {
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  fcActiveCat = cat;
  fcAll   = cat === 'all' ? FLASHCARDS.slice() : FLASHCARDS.filter(c => c.cat === cat);
  fcIdx   = 0; fcFlipped = false;
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
