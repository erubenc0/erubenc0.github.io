/* ═══════════════════════════════════════════════════════════
   The Number Theory Scrapbook — app.js
═══════════════════════════════════════════════════════════ */

// ─── All screen IDs ───────────────────────────────────────────
const ALL_SCREENS = [
  'home', 'learn', 'topic-detail',
  'glossary', 'mysteries', 'mystery-detail',
  'more', 'references', 'about'
];

// Maps screen → nav link id
const NAV_MAP = {
  'home':           'nav-home',
  'learn':          'nav-learn',
  'topic-detail':   'nav-learn',
  'glossary':       'nav-glossary',
  'mysteries':      'nav-mysteries',
  'mystery-detail': 'nav-mysteries',
  'more':           'nav-more',
  'references':     'nav-references',
  'about':          'nav-about',
};

function showScreen(id) {
  ALL_SCREENS.forEach(s => {
    const el = document.getElementById(s);
    if (el) el.classList.remove('active');
  });

  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update nav active state
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const navId = NAV_MAP[id];
  if (navId) {
    const navEl = document.getElementById(navId);
    if (navEl) navEl.classList.add('active');
  }

  // Re-render KaTeX on the newly visible screen
  if (window.renderMathInElement && target) {
    setTimeout(() => {
      renderMathInElement(target, {
        delimiters: [
          { left: '$$', right: '$$', display: true  },
          { left: '$',  right: '$',  display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true  },
        ],
        throwOnError: false
      });
    }, 60);
  }
}

// ─── Topic list (ordered, for Next Topic) ────────────────────
// Each entry: { id, unit, title, discoverer }
// Add content to each topic inside openTopic() below.

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

let currentTopicIndex = 0;

function openTopic(id, index) {
  currentTopicIndex = index;
  const t = TOPICS[index] || TOPICS.find(x => x.id === id) || {};

  document.getElementById('td-unit').textContent      = t.unit       || '';
  document.getElementById('td-title').innerHTML       = t.title      || id;
  document.getElementById('td-discoverer').innerHTML  =
    'Discovered / Developed by: ' + (t.discoverer || '—');

  // ── Replace each innerHTML below with your real content ────────
  //    Use $...$ for inline KaTeX, $$...$$ for display math.

  document.getElementById('td-theory').innerHTML = `
    <div class="latex-block">
      [ LaTeX / KaTeX theory for <strong>${t.title || id}</strong> goes here ]
    </div>
  `;

  document.getElementById('td-viz').innerHTML = `
    <div class="viz-area">[ Visualization / diagram for ${t.title || id} ]</div>
  `;

  document.getElementById('td-practice').innerHTML = `
    <div class="problem-block">
      <div class="problem-q">Problem 1: [ Problem statement ]</div>
      <div class="problem-s">Solution: [ Solution ]</div>
    </div>
    <div class="problem-block">
      <div class="problem-q">Problem 2: [ Problem statement ]</div>
      <div class="problem-s">Solution: [ Solution ]</div>
    </div>
    <div class="problem-block">
      <div class="problem-q">Problem 3: [ Problem statement ]</div>
      <div class="problem-s">Solution: [ Solution ]</div>
    </div>
  `;

  document.getElementById('td-application').innerHTML = `
    <div class="ph" style="min-height:80px;">[ Real-world applications for ${t.title || id} ]</div>
    <div style="margin-top:1rem;">
      <span class="app-tag">[ Tag 1 ]</span>
      <span class="app-tag">[ Tag 2 ]</span>
      <span class="app-tag">[ Tag 3 ]</span>
    </div>
  `;

  // Update Next Topic button label
  const nextBtn = document.getElementById('next-topic-btn');
  if (currentTopicIndex < TOPICS.length - 1) {
    const next = TOPICS[currentTopicIndex + 1];
    nextBtn.textContent = 'Next: ' + next.title.replace(/&amp;/g,'&') + ' →';
    nextBtn.style.display = '';
  } else {
    nextBtn.textContent = 'Back to Syllabus';
    nextBtn.onclick = () => showScreen('learn');
  }

  showScreen('topic-detail');
}

function goNextTopic() {
  if (currentTopicIndex < TOPICS.length - 1) {
    const next = TOPICS[currentTopicIndex + 1];
    openTopic(next.id, currentTopicIndex + 1);
  } else {
    showScreen('learn');
  }
}

// ─── Mystery list ─────────────────────────────────────────────
const MYSTERIES = [
  { id:'mystery-1', eyebrow:'Exhibit 01 — Unsolved Mystery',
    title:'[ Conjecture Name ]',
    proposer:'Proposed by: [ Name, Year ]' },

  { id:'mystery-2', eyebrow:'Exhibit 02 — Unsolved Mystery',
    title:'[ Conjecture Name ]',
    proposer:'Proposed by: [ Name, Year ]' },
];

let currentMysteryIndex = 0;

function openMystery(id, index) {
  currentMysteryIndex = index;
  const m = MYSTERIES[index] || MYSTERIES.find(x => x.id === id) || {};

  document.getElementById('md-eyebrow').textContent   = m.eyebrow   || 'Unsolved Mystery';
  document.getElementById('md-title').innerHTML       = m.title     || id;
  document.getElementById('md-proposer').innerHTML    = m.proposer  || 'Proposed by: —';

  // ── Replace each innerHTML below with your real content ────────

  document.getElementById('md-theory').innerHTML = `
    <div class="latex-block">[ Formal statement of the conjecture — LaTeX goes here ]</div>
  `;

  document.getElementById('md-viz').innerHTML = `
    <div class="viz-area">[ Diagram or chart goes here ]</div>
  `;

  document.getElementById('md-known').innerHTML = `
    <div class="problem-block">
      <div class="problem-q">Result 1: [ Partial result or related theorem ]</div>
      <div class="problem-s">[ Explanation ]</div>
    </div>
    <div class="problem-block">
      <div class="problem-q">Result 2: [ Partial result or related theorem ]</div>
      <div class="problem-s">[ Explanation ]</div>
    </div>
  `;

  document.getElementById('md-significance').innerHTML = `
    <div class="ph" style="min-height:80px;">[ Why solving this would matter ]</div>
    <div style="margin-top:1rem;">
      <span class="app-tag">[ Tag 1 ]</span>
      <span class="app-tag">[ Tag 2 ]</span>
    </div>
  `;

  // Next mystery button
  const nextBtn = document.getElementById('next-mystery-btn');
  if (currentMysteryIndex < MYSTERIES.length - 1) {
    const next = MYSTERIES[currentMysteryIndex + 1];
    nextBtn.textContent = 'Next: ' + next.title + ' →';
    nextBtn.style.display = '';
  } else {
    nextBtn.textContent = 'Back to Gallery';
    nextBtn.onclick = () => showScreen('mysteries');
  }

  showScreen('mystery-detail');
}

function goNextMystery() {
  if (currentMysteryIndex < MYSTERIES.length - 1) {
    const next = MYSTERIES[currentMysteryIndex + 1];
    openMystery(next.id, currentMysteryIndex + 1);
  } else {
    showScreen('mysteries');
  }
}

// ─── Glossary filter ──────────────────────────────────────────
let activeCat = 'all';

function filterGlossary() {
  const q = (document.getElementById('glossary-search').value || '').toLowerCase();
  document.querySelectorAll('#glossary-grid .glossary-card').forEach(card => {
    const term = card.querySelector('.g-term').textContent.toLowerCase();
    const cat  = card.dataset.cat;
    const matchSearch = term.includes(q);
    const matchCat    = activeCat === 'all' || cat === activeCat;
    card.style.display = (matchSearch && matchCat) ? '' : 'none';
  });
}

function filterCategory(cat, btn) {
  activeCat = cat;
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  filterGlossary();
}

// ─── Mathematician image fallback ─────────────────────────────
// Triggered by onerror on each <img> in the HTML.
// The fallback monogram <div class="portrait-mono"> is shown instead.

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  showScreen('home');
});
