/* ============================================================
   The Number Theory Scrapbook — app.js
   ============================================================ */

// ── Screen navigation ──────────────────────────────────────────
const SCREENS = ['home','learn','topic-detail','glossary','mysteries','more','references','about'];

function showScreen(id) {
  SCREENS.forEach(s => {
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
  const navMap = {
    home: 'nav-home', learn: 'nav-learn', 'topic-detail': 'nav-learn',
    glossary: 'nav-glossary', mysteries: 'nav-mysteries',
    more: 'nav-more', references: 'nav-references', about: 'nav-about'
  };
  const navId = navMap[id];
  if (navId) {
    const navEl = document.getElementById(navId);
    if (navEl) navEl.classList.add('active');
  }

  // Re-render KaTeX after content switches
  if (window.renderMathInElement) {
    setTimeout(() => {
      renderMathInElement(document.getElementById(id), {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$',  right: '$',  display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false
      });
    }, 50);
  }
}

// ── Topic data ─────────────────────────────────────────────────
// Each key maps to the topic ID used in openTopic().
// Fill in your content in each field — leave the placeholders
// until you're ready to add real material.

const TOPICS = {
  divisibility: {
    unit: 'Unit I — Foundations',
    title: 'Divisibility &amp; the Division Algorithm',
    discoverer: 'Roots in Ancient Greek mathematics; formalized by Euclid (c. 300 BCE)',
  },
  gcd: {
    unit: 'Unit I — Foundations',
    title: 'Greatest Common Divisor',
    discoverer: 'Euclid, c. 300 BCE',
  },
  euclidean: {
    unit: 'Unit I — Foundations',
    title: 'The Euclidean Algorithm',
    discoverer: 'Euclid, c. 300 BCE',
  },
  primes: {
    unit: 'Unit I — Foundations',
    title: 'Prime Numbers &amp; Unique Factorization',
    discoverer: 'Euclid (infinitely many primes, c. 300 BCE); Gauss (FTA formalization)',
  },
  congruences: {
    unit: 'Unit II — Congruences &amp; Modular Arithmetic',
    title: 'Congruences',
    discoverer: 'Carl Friedrich Gauss, Disquisitiones Arithmeticae (1801)',
  },
  'linear-congruences': {
    unit: 'Unit II — Congruences &amp; Modular Arithmetic',
    title: 'Linear Congruences',
    discoverer: 'Attributed to Gauss and earlier Islamic mathematicians',
  },
  crt: {
    unit: 'Unit II — Congruences &amp; Modular Arithmetic',
    title: 'The Chinese Remainder Theorem',
    discoverer: 'Sunzi Suanjing, c. 3rd–5th century CE; generalized by Gauss',
  },
  'euler-fermat': {
    unit: 'Unit II — Congruences &amp; Modular Arithmetic',
    title: 'Euler\'s &amp; Fermat\'s Theorems',
    discoverer: 'Pierre de Fermat (1640); Leonhard Euler (generalization, 1763)',
  },
  phi: {
    unit: 'Unit III — Arithmetic Functions',
    title: "Euler's Totient Function φ(n)",
    discoverer: 'Leonhard Euler, 1763',
  },
  mobius: {
    unit: 'Unit III — Arithmetic Functions',
    title: 'The Möbius Function &amp; Inversion',
    discoverer: 'August Ferdinand Möbius, 1832',
  },
  dirichlet: {
    unit: 'Unit III — Arithmetic Functions',
    title: 'Dirichlet Series &amp; Convolution',
    discoverer: 'Peter Gustav Lejeune Dirichlet, c. 1837',
  },
  'quad-res': {
    unit: 'Unit IV — Quadratic Residues &amp; Reciprocity',
    title: 'Quadratic Residues',
    discoverer: 'Studied by Euler and Legendre; systematized by Gauss',
  },
  legendre: {
    unit: 'Unit IV — Quadratic Residues &amp; Reciprocity',
    title: 'The Legendre Symbol',
    discoverer: 'Adrien-Marie Legendre, 1798',
  },
  'quadratic-reciprocity': {
    unit: 'Unit IV — Quadratic Residues &amp; Reciprocity',
    title: 'The Law of Quadratic Reciprocity',
    discoverer: 'Conjectured by Euler &amp; Legendre; first proved by Gauss (1796)',
  },
  'prime-theorem': {
    unit: 'Unit V — Analytic &amp; Advanced Topics',
    title: 'The Prime Number Theorem',
    discoverer: 'Conjectured by Gauss &amp; Legendre; proved by Hadamard &amp; de la Vallée Poussin (1896)',
  },
  riemann: {
    unit: 'Unit V — Analytic &amp; Advanced Topics',
    title: 'The Riemann Zeta Function',
    discoverer: 'Bernhard Riemann, 1859',
  },
  diophantine: {
    unit: 'Unit V — Analytic &amp; Advanced Topics',
    title: 'Diophantine Equations',
    discoverer: 'Diophantus of Alexandria, c. 3rd century CE',
  },
  cryptography: {
    unit: 'Unit V — Analytic &amp; Advanced Topics',
    title: 'Number Theory in Cryptography',
    discoverer: 'RSA: Rivest, Shamir, Adleman (1977); foundations in classical NT',
  },
};

function openTopic(id) {
  const data = TOPICS[id] || {};

  document.getElementById('td-unit').textContent      = data.unit        || '';
  document.getElementById('td-title').innerHTML       = data.title       || 'Topic';
  document.getElementById('td-discoverer').innerHTML  = 'Discovered / Developed by: ' + (data.discoverer || '—');

  // Placeholders — you will replace the innerHTML of each quadrant
  // with your real content as you develop the site.

  document.getElementById('td-theory').innerHTML = `
    <div class="content-placeholder" style="min-height:200px;">
      [ LaTeX / KaTeX theory for <strong>${data.title || id}</strong> goes here ]
    </div>
  `;

  document.getElementById('td-viz').innerHTML = `
    <div class="viz-area">[ Visualization / diagram for ${data.title || id} goes here ]</div>
  `;

  document.getElementById('td-practice').innerHTML = `
    <div class="problem-block">
      <div class="problem-q">Problem 1: [ Add problem statement here ]</div>
      <div class="problem-s"><em>Solution:</em> [ Add solution here ]</div>
    </div>
    <div class="problem-block">
      <div class="problem-q">Problem 2: [ Add problem statement here ]</div>
      <div class="problem-s"><em>Solution:</em> [ Add solution here ]</div>
    </div>
    <div class="problem-block">
      <div class="problem-q">Problem 3: [ Add problem statement here ]</div>
      <div class="problem-s"><em>Solution:</em> [ Add solution here ]</div>
    </div>
  `;

  document.getElementById('td-application').innerHTML = `
    <div class="content-placeholder" style="min-height:200px;">
      [ Real-world applications for ${data.title || id} go here ]
    </div>
  `;

  showScreen('topic-detail');
}

// ── Glossary filtering ─────────────────────────────────────────
let currentCategory = 'all';

function filterGlossary() {
  const query = document.getElementById('glossary-search').value.toLowerCase();
  const cards  = document.querySelectorAll('#glossary-grid .glossary-card');
  cards.forEach(card => {
    const term = card.querySelector('.glossary-term').textContent.toLowerCase();
    const cat  = card.dataset.category;
    const matchesSearch = term.includes(query);
    const matchesCat    = currentCategory === 'all' || cat === currentCategory;
    card.style.display  = (matchesSearch && matchesCat) ? '' : 'none';
  });
}

function filterByCategory(cat, btn) {
  currentCategory = cat;
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  filterGlossary();
}

// ── Init ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  showScreen('home');
});
