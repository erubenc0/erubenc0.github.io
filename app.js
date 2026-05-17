/* ═══════════════════════════════════════════════════════════════
   The Number Theory Scrapbook — app.js
   Matches index.html exactly. Do not rename IDs without updating both files.
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────────────
   SCREEN REGISTRY & NAVIGATION
───────────────────────────────────────────────────────────── */
const ALL_SCREENS = [
  'home', 'founder-detail',
  'learn', 'unit-title', 'topic-intro', 'unit0-panel', 'unit-complete', 'unit-test',
  'topic-theory', 'topic-viz', 'topic-intuition', 'topic-steps', 'topic-problems', 'topic-application',
  'glossary', 'proofs',
  'mysteries', 'mystery-conjecture', 'mystery-viz', 'mystery-results', 'mystery-matters',
  'more', 'references', 'about'
];

// Maps screen id → which nav link should be highlighted
const NAV_MAP = {
  'home': 'nav-home', 'founder-detail': 'nav-home',
  'learn': 'nav-learn', 'unit-title': 'nav-learn', 'topic-intro': 'nav-learn',
  'unit0-panel': 'nav-learn', 'unit-complete': 'nav-learn', 'unit-test': 'nav-learn',
  'topic-theory': 'nav-learn', 'topic-viz': 'nav-learn', 'topic-intuition': 'nav-learn',
  'topic-steps': 'nav-learn', 'topic-problems': 'nav-learn', 'topic-application': 'nav-learn',
  'glossary': 'nav-glossary',
  'proofs': 'nav-proofs',
  'mysteries': 'nav-mysteries',
  'mystery-conjecture': 'nav-mysteries', 'mystery-viz': 'nav-mysteries',
  'mystery-results': 'nav-mysteries', 'mystery-matters': 'nav-mysteries',
  'more': 'nav-more', 'references': 'nav-references', 'about': 'nav-about'
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

  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const navId = NAV_MAP[id];
  if (navId) {
    const navEl = document.getElementById(navId);
    if (navEl) navEl.classList.add('active');
  }

  // Re-render KaTeX on newly visible screen
  if (window.renderMathInElement && target) {
    setTimeout(() => {
      renderMathInElement(target, {
        delimiters: [
          { left: '$$', right: '$$', display: true  },
          { left: '$',  right: '$',  display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true  }
        ],
        throwOnError: false
      });
    }, 60);
  }
}

/* ─────────────────────────────────────────────────────────────
   LEARN — SUB-TABS (Syllabus / Feedback)
───────────────────────────────────────────────────────────── */
function showLearnTab(tab, btn) {
  document.getElementById('learn-syllabus').style.display = tab === 'syllabus' ? '' : 'none';
  document.getElementById('learn-feedback').style.display = tab === 'feedback' ? '' : 'none';

  // Toggle button styles
  document.getElementById('tab-syllabus').className = tab === 'syllabus' ? 'btn btn-primary' : 'btn btn-ghost';
  document.getElementById('tab-feedback').className  = tab === 'feedback'  ? 'btn btn-primary' : 'btn btn-ghost';

  if (tab === 'feedback') renderFeedback();
}

/* ─────────────────────────────────────────────────────────────
   PROOFS — SUB-TABS (My Proofs / Mistakes)
───────────────────────────────────────────────────────────── */
function showProofTab(tab, btn) {
  document.getElementById('proofs-tab-proofs').style.display   = tab === 'proofs'   ? '' : 'none';
  document.getElementById('proofs-tab-mistakes').style.display = tab === 'mistakes' ? '' : 'none';

  document.getElementById('proof-tab-proofs').className   = tab === 'proofs'   ? 'btn btn-primary' : 'btn btn-ghost';
  document.getElementById('proof-tab-mistakes').className  = tab === 'mistakes' ? 'btn btn-primary' : 'btn btn-ghost';
}

/* ─────────────────────────────────────────────────────────────
   UNIT & TOPIC DATA
   ─────────────────────────────────────────────────────────────
   HOW TO ADD YOUR CONTENT
   ═══════════════════════
   1. Find the matching topic id in _loadTopicContent() below.
   2. Replace the placeholder strings for theory, viz, intuition,
      steps, problems, and app with your real content.
   3. Use $...$ for inline KaTeX and $$...$$ for display math.
   4. For images, use: <img src="filename.jpg" style="width:100%;border-radius:6px;">
   5. For steps, copy the .step-block template.
   6. For problems, copy the .problem-wrap template.
───────────────────────────────────────────────────────────── */
const UNITS = [
  // Unit 0 is handled separately (single reading panel, no topics)
  {
    idx: 0,
    name: 'Unit 1',
    title: 'The Foundations of Integers',
    desc: '[ Add a brief description of Unit 1 here. ]',
    topics: [
      { id: 'pythagorean', num: '1.1', name: 'Pythagorean Triples',              discoverer: 'Ancient Greek mathematics; Pythagoras, c. 570 BCE' },
      { id: 'divisibility', num: '1.2', name: 'Divisibility',                    discoverer: 'Euclid, c. 300 BCE' },
      { id: 'gcd',          num: '1.3', name: 'The Greatest Common Divisor',     discoverer: 'Euclid, c. 300 BCE' },
      { id: 'euclidean',    num: '1.4', name: 'The Euclidean Algorithm',          discoverer: 'Euclid, c. 300 BCE' },
    ]
  },
  {
    idx: 1,
    name: 'Unit 2',
    title: 'Primes and Unique Factorization',
    desc: '[ Add a brief description of Unit 2 here. ]',
    topics: [
      { id: 'fta',        num: '2.1', name: 'The Fundamental Theorem of Arithmetic', discoverer: 'Euclid; formalized by Gauss (1801)' },
      { id: 'prime-dist', num: '2.2', name: 'Distribution of Primes',                discoverer: 'Euclid (infinitude); Gauss &amp; Legendre (density)' },
      { id: 'pnt',        num: '2.3', name: 'The Prime Number Theorem',              discoverer: 'Proved by Hadamard &amp; de la Vallée Poussin (1896)' },
    ]
  },
  {
    idx: 2,
    name: 'Unit 3',
    title: 'Congruences and Modular Arithmetic',
    desc: '[ Add a brief description of Unit 3 here. ]',
    topics: [
      { id: 'linear-cong', num: '3.1', name: 'Linear Congruences',        discoverer: 'Carl Friedrich Gauss, Disquisitiones Arithmeticae (1801)' },
      { id: 'fermats-lit', num: '3.2', name: "Fermat's Little Theorem",   discoverer: 'Pierre de Fermat (1640)' },
      { id: 'carmichael',  num: '3.3', name: 'Carmichael Numbers',        discoverer: 'Robert Carmichael (1910)' },
    ]
  },
  {
    idx: 3,
    name: 'Unit 4',
    title: "Euler's Totient and RSA Cryptography",
    desc: '[ Add a brief description of Unit 4 here. ]',
    topics: [
      { id: 'phi',       num: '4.1', name: "Euler's Phi Function $\\varphi(n)$", discoverer: 'Leonhard Euler (1763)' },
      { id: 'euler-thm', num: '4.2', name: "Euler's Theorem",                    discoverer: 'Leonhard Euler (1763)' },
      { id: 'rsa',       num: '4.3', name: 'Public Key Encryption (RSA)',         discoverer: 'Rivest, Shamir, Adleman (1977)' },
    ]
  },
  {
    idx: 4,
    name: 'Unit 5',
    title: 'Powers, Roots, and Indices',
    desc: '[ Add a brief description of Unit 5 here. ]',
    topics: [
      { id: 'prim-roots', num: '5.1', name: 'Primitive Roots',                discoverer: 'Leonhard Euler; Gauss (Disquisitiones, 1801)' },
      { id: 'disc-log',   num: '5.2', name: 'The Discrete Logarithm Problem', discoverer: 'Formalized in modern cryptography context, 1970s' },
    ]
  },
  {
    idx: 5,
    name: 'Unit 6',
    title: 'Quadratic Reciprocity',
    desc: '[ Add a brief description of Unit 6 here. ]',
    topics: [
      { id: 'quad-res',  num: '6.1', name: 'Quadratic Residues',                discoverer: 'Studied by Euler and Legendre; Gauss' },
      { id: 'legendre',  num: '6.2', name: 'The Legendre Symbol',               discoverer: 'Adrien-Marie Legendre (1798)' },
      { id: 'quad-rec',  num: '6.3', name: 'The Law of Quadratic Reciprocity',  discoverer: 'First proved by Gauss (1796)' },
    ]
  },
  {
    idx: 6,
    name: 'Unit 7',
    title: 'Sums of Squares and Diophantine Equations',
    desc: '[ Add a brief description of Unit 7 here. ]',
    topics: [
      { id: 'gaussian',  num: '7.1', name: 'Gaussian Integers',              discoverer: 'Carl Friedrich Gauss (1832)' },
      { id: 'sums-sq',   num: '7.2', name: 'Sums of Two and Four Squares',   discoverer: 'Fermat (2 squares); Lagrange (4 squares, 1770)' },
      { id: 'pell',      num: '7.3', name: "Pell's Equation",                discoverer: 'Brahmaguputa (7th century CE); Euler named it' },
    ]
  },
  {
    idx: 7,
    name: 'Unit 8',
    title: 'Advanced Landscapes',
    desc: '[ Add a brief description of Unit 8 here. ]',
    topics: [
      { id: 'cont-frac', num: '8.1', name: 'Continued Fractions',                 discoverer: 'Studied by Euler, Lagrange, and others' },
      { id: 'elliptic',  num: '8.2', name: 'Elliptic Curves',                     discoverer: '19th century; Weierstrass formulation' },
      { id: 'descent',   num: '8.3', name: "Descent and Fermat's Last Theorem",   discoverer: "Fermat's method; proved by Wiles (1995)" },
    ]
  },
];

/* ─── Progress persistence (localStorage) ──────────────────── */
// Stores: { unitIdx: topicIdx } — the last topic started per unit
// topicIdx = -1 means unit not started, 999 means unit complete

function _saveProgress(unitIdx, topicIdx) {
  try {
    const prog = JSON.parse(localStorage.getItem('nts_progress') || '{}');
    prog[unitIdx] = topicIdx;
    localStorage.setItem('nts_progress', JSON.stringify(prog));
  } catch (_) {}
}

function _loadProgress() {
  try {
    return JSON.parse(localStorage.getItem('nts_progress') || '{}');
  } catch (_) { return {}; }
}

function _unitProgress(unitIdx) {
  // Returns { topicIdx, pct }
  // topicIdx = -1: not started
  // topicIdx = 0..n-1: in progress
  // topicIdx = n: content done, test not taken
  // topicIdx = n+1: test taken — fully complete (100%)
  const prog = _loadProgress();
  const saved = prog[unitIdx];
  const unit  = UNITS[unitIdx];
  if (saved === undefined || saved < 0) return { topicIdx: -1, pct: 0 };
  if (saved >= unit.topics.length + 1) return { topicIdx: unit.topics.length + 1, pct: 100 };
  if (saved === unit.topics.length)    return { topicIdx: unit.topics.length, pct: 99 };
  return {
    topicIdx: saved,
    pct: Math.round((saved / unit.topics.length) * 99)  // max 99 until test taken
  };
}

/* ─── Test results persistence ──────────────────────────────── */
function _saveTestResult(unitIdx, result) {
  // result = { score, total, answers: [{ q, userAnswer, correct }] }
  try {
    const all = JSON.parse(localStorage.getItem('nts_tests') || '{}');
    all[unitIdx] = result;
    localStorage.setItem('nts_tests', JSON.stringify(all));
  } catch (_) {}
}

function _loadTestResults() {
  try {
    return JSON.parse(localStorage.getItem('nts_tests') || '{}');
  } catch (_) { return {}; }
}

/* ─────────────────────────────────────────────────────────────
   RENDER UNIT CARDS on the Learn screen
───────────────────────────────────────────────────────────── */
function renderUnitCards() {
  const container = document.getElementById('unit-cards-container');
  if (!container) return;
  container.innerHTML = '';

  // Unit 0 card (no progress bar — single reading screen)
  const u0 = document.createElement('div');
  u0.className = 'unit-card';
  u0.onclick = () => showScreen('unit0-panel');
  u0.innerHTML = `
    <div class="unit-card-number">Unit 0</div>
    <div class="unit-card-title">History and Philosophy</div>
    <div class="unit-card-topics">An introduction to the story and spirit of number theory before the mathematics begins.</div>
    <span class="unit-card-arrow">→</span>
  `;
  container.appendChild(u0);

  // Units 1–8
  UNITS.forEach((unit, i) => {
    const { topicIdx, pct } = _unitProgress(i);
    const isStarted  = topicIdx >= 0;
    const isComplete = topicIdx >= unit.topics.length;

    const card = document.createElement('div');
    card.className = 'unit-card';
    card.onclick = () => openUnit(i);

    // topicIdx === topics.length   → content done, test pending
    // topicIdx === topics.length+1  → fully complete (test taken)
    const testComplete = topicIdx >= unit.topics.length + 1;
    const contentDone  = topicIdx >= unit.topics.length;
    const resumeHtml = testComplete
      ? `<span class="resume-badge">Complete ✓</span>`
      : contentDone
        ? `<span class="resume-badge">Test Pending</span>`
        : isStarted
          ? `<span class="resume-badge">Resume: ${unit.topics[topicIdx]?.num || ''} ${unit.topics[topicIdx]?.name || ''}</span>`
          : '';

    card.innerHTML = `
      <div class="unit-card-number">${unit.name}</div>
      <div class="unit-card-title">${unit.title}</div>
      <div class="unit-card-topics">${unit.topics.map(t => t.name.replace(/<[^>]+>/g,'')).join(' · ')}</div>
      <div class="unit-progress-wrap">
        <div class="unit-progress-label">
          <span>Progress</span>
          <span>${pct}%</span>
        </div>
        <div class="unit-progress-track">
          <div class="unit-progress-fill" style="width:${pct}%"></div>
        </div>
      </div>
      ${resumeHtml}
      <span class="unit-card-arrow">→</span>
    `;
    container.appendChild(card);
  });
}

/* ─────────────────────────────────────────────────────────────
   UNIT FLOW
───────────────────────────────────────────────────────────── */
let currentUnitIdx  = 0;
let currentTopicIdx = 0;

function openUnit(unitIdx) {
  currentUnitIdx = unitIdx;
  const unit = UNITS[unitIdx];

  // Check for saved progress — resume from where they left off
  const { topicIdx: savedTopic } = _unitProgress(unitIdx);
  const resumeIdx = (savedTopic >= 0 && savedTopic < unit.topics.length) ? savedTopic : 0;

  // Build the unit title card
  const prog = _unitProgress(unitIdx);
  const topicsHtml = unit.topics.map((t, i) => {
    const isDone = i < prog.topicIdx;
    return `
      <div class="unit-topic-row" style="cursor:pointer;" onclick="jumpToTopic(${unitIdx},${i})" title="Jump to ${t.name}">
        <span class="unit-topic-num">${t.num}</span>
        <span class="unit-topic-name unit-topic-link">${t.name}</span>
        <span class="unit-topic-done ${isDone ? 'complete' : ''}">${isDone ? '✓' : ''}</span>
      </div>`;
  }).join('');

  document.getElementById('unit-title-content').innerHTML = `
    <div class="unit-title-eyebrow">${unit.name} of 8</div>
    <h1 class="unit-title-heading">${unit.title}</h1>
    <p class="unit-title-sub">${unit.desc}</p>
    <div class="unit-topics-list">${topicsHtml}</div>
  `;

  // If they have progress, offer to resume
  const beginBtn = document.getElementById('unit-begin-btn');
  if (beginBtn) {
    if (savedTopic >= 0 && savedTopic < unit.topics.length) {
      beginBtn.textContent = `Resume at ${unit.topics[resumeIdx].num} →`;
      beginBtn.onclick = () => {
        currentTopicIdx = resumeIdx;
        _showTopicIntro(unitIdx, resumeIdx);
      };
    } else if (savedTopic >= unit.topics.length) {
      beginBtn.textContent = 'Review Unit →';
      beginBtn.onclick = () => {
        currentTopicIdx = 0;
        _loadTopicContent(unitIdx, 0);
        _showTopicIntro(unitIdx, 0);
      };
    } else {
      beginBtn.textContent = 'Begin Unit →';
      beginBtn.onclick = startUnit;
    }
  }

  showScreen('unit-title');
}

function startUnit() {
  currentTopicIdx = 0;
  _showTopicIntro(currentUnitIdx, 0);
}

// Jump directly to a topic from the unit overview list
function jumpToTopic(unitIdx, topicIdx) {
  currentUnitIdx  = unitIdx;
  currentTopicIdx = topicIdx;
  _loadTopicContent(unitIdx, topicIdx);
  _showTopicIntro(unitIdx, topicIdx);
}

/* ─── Topic intro screen ──────────────────────────────────── */
function _showTopicIntro(unitIdx, topicIdx) {
  currentUnitIdx  = unitIdx;
  currentTopicIdx = topicIdx;
  const unit  = UNITS[unitIdx];
  const topic = unit.topics[topicIdx];

  document.getElementById('intro-progress-label').textContent =
    `Topic ${topicIdx + 1} of ${unit.topics.length}`;

  document.getElementById('topic-intro-content').innerHTML = `
    <div class="topic-intro-eyebrow">${unit.name} · ${topic.num}</div>
    <h1 class="topic-intro-heading">${topic.num}: ${topic.name}</h1>
    <div class="topic-intro-img">
      [ Image for ${topic.name} — replace this div's contents with &lt;img src="topic-${topic.id}.jpg"&gt; ]
    </div>
    <div style="margin-top:2rem;max-width:680px;">
      <div style="font-family:'Inter',sans-serif;font-size:.58rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--text-muted);margin-bottom:.6rem;">Overview</div>
      <div id="topic-overview-${topic.id}" style="font-family:'Inter',sans-serif;font-size:.88rem;font-weight:300;color:rgba(217,217,217,0.68);line-height:1.85;background:rgba(128,0,0,0.08);border:1px solid rgba(128,0,0,0.25);border-radius:6px;padding:1.2rem 1.5rem;">
        [ Add a brief overview of ${topic.name} here — 2–3 sentences introducing the topic before the student begins. ]
      </div>
    </div>
  `;

  showScreen('topic-intro');
}

// "← Back" on the intro screen
function introGoBack() {
  if (currentTopicIdx === 0) {
    showScreen('unit-title');
  } else {
    // Go back to the previous topic's application screen
    currentTopicIdx--;
    _loadTopicContent(currentUnitIdx, currentTopicIdx);
    showScreen('topic-application');
  }
}

// "Begin Learning →" on the intro screen
function beginLearning() {
  _loadTopicContent(currentUnitIdx, currentTopicIdx);
  _saveProgress(currentUnitIdx, currentTopicIdx);
  _renderStepDots('theory');
  showScreen('topic-theory');
}

/* ─── Load topic content into all 5 panels ─────────────────── */
function _loadTopicContent(unitIdx, topicIdx) {
  const unit  = UNITS[unitIdx];
  const topic = unit.topics[topicIdx];
  const eyebrow = `${unit.name} · ${topic.num}`;
  const name    = topic.name.replace(/\$[^$]+\$/g, '').replace(/&amp;/g, '&');

  // Set all headers
  const headers = [
    ['tt-eyebrow', 'tt-title', name],
    ['tv-eyebrow', 'tv-title', name],
    ['ti-eyebrow', 'ti-title', name + ' — My Intuition'],
    ['ts-eyebrow', 'ts-title', name + ' — Strategy'],
    ['tp-eyebrow', 'tp-title', name + ' — Practice'],
    ['ta-eyebrow', 'ta-title', name + ' — Relevance'],
  ];
  headers.forEach(([eyId, titId, titText]) => {
    const ey  = document.getElementById(eyId);
    const tit = document.getElementById(titId);
    if (ey)  ey.textContent  = eyebrow;
    if (tit) tit.innerHTML   = titText;
  });

  // Update Proceed button label on application screen
  const isLast    = topicIdx >= unit.topics.length - 1;
  const proceedBtn = document.getElementById('topic-proceed-btn');
  if (proceedBtn) {
    proceedBtn.textContent = isLast ? 'Finish Unit →' : 'Next Topic →';
  }

  // Inject content — replace the placeholder strings below with your real content.
  // Pattern: if (topic.id === 'your-id') { theory = `...`; viz = `...`; ... }

  let theory   = `<div class="latex-block">[ LaTeX theory for <strong>${name}</strong> goes here. ]</div>`;
  let viz      = `<div class="viz-area" style="min-height:400px;">[ Visualization / diagram for ${name} ]</div>`;
  let intuition = `
    <div class="intuition-block">
      <div class="intuition-label">My Interpretation</div>
      <div class="intuition-text ph">[ Your interpretation of ${name} goes here ]</div>
    </div>
    <div class="intuition-block" style="margin-top:1rem;">
      <div class="intuition-label">Personal Notes / Annotations</div>
      <div class="intuition-note-area">[ Upload a photo of your handwritten notes — replace with &lt;img src="notes-${topic.id}.jpg"&gt; ]</div>
    </div>
    <div class="intuition-block" style="margin-top:1rem;">
      <div class="intuition-label">What Clicked First</div>
      <div class="intuition-text ph">[ What helped this concept click for you? ]</div>
    </div>
    <div class="intuition-block" style="margin-top:1rem;">
      <div class="intuition-label">What Confused Me Initially</div>
      <div class="intuition-text ph">[ What confused you at first, and how did you work through it? ]</div>
    </div>
  `;
  let steps    = `
    <div class="step-block"><div class="step-label">Step 1</div><div class="step-content">[ Step-by-step LaTeX guide for ${name} ]</div></div>
    <div class="step-block"><div class="step-label">Step 2</div><div class="step-content">[ Continue steps ]</div></div>
    <div class="step-block"><div class="step-label">Step 3</div><div class="step-content">[ Continue steps ]</div></div>
  `;
  let problems = `
    <div class="problem-wrap">
      <div class="problem-q">Problem 1</div>
      <div class="problem-img-slot">[ Add your LaTeX-created problem image here — replace with &lt;img src="problem-${topic.id}-1.jpg"&gt; ]</div>
      <button class="problem-answer-toggle" onclick="toggleAnswer(this)">Show Answer</button>
      <div class="problem-answer-reveal">[ Answer ]</div>
    </div>
    <div class="problem-wrap">
      <div class="problem-q">Problem 2</div>
      <div class="problem-img-slot">[ Add your LaTeX-created problem image here — replace with &lt;img src="problem-${topic.id}-2.jpg"&gt; ]</div>
      <button class="problem-answer-toggle" onclick="toggleAnswer(this)">Show Answer</button>
      <div class="problem-answer-reveal">[ Answer ]</div>
    </div>
    <div class="problem-wrap">
      <div class="problem-q">Problem 3</div>
      <div class="problem-img-slot">[ Add your LaTeX-created problem image here — replace with &lt;img src="problem-${topic.id}-3.jpg"&gt; ]</div>
      <button class="problem-answer-toggle" onclick="toggleAnswer(this)">Show Answer</button>
      <div class="problem-answer-reveal">[ Answer ]</div>
    </div>
  `;
  let app = `
    <div class="ph" style="min-height:120px;margin-bottom:1.2rem;">[ Real-world applications for ${name} ]</div>
    <div class="app-block"><h4>[ Field or Application ]</h4><p>[ Description ]</p></div>
    <div class="app-block"><h4>[ Field or Application ]</h4><p>[ Description ]</p></div>
    <div style="margin-top:1.2rem;">
      <span class="app-tag">[ Tag ]</span>
      <span class="app-tag">[ Tag ]</span>
      <span class="app-tag">[ Tag ]</span>
    </div>
  `;

  // ══════════════════════════════════════════════════════════════
  // ADD YOUR CONTENT PER TOPIC HERE
  // ══════════════════════════════════════════════════════════════
  // Example:
  // if (topic.id === 'pythagorean') {
  //   theory = `<div class="latex-block">A Pythagorean triple $(a,b,c)$ satisfies $$a^2 + b^2 = c^2$$...</div>`;
  //   viz    = `<img src="pythagorean-diagram.jpg" style="width:100%;border-radius:6px;">`;
  //   steps  = `
  //     <div class="step-block"><div class="step-label">Step 1</div><div class="step-content">Set $a = m^2 - n^2$...</div></div>
  //   `;
  //   problems = `
  //     <div class="problem-wrap">
  //       <div class="problem-q">Problem 1: Find all primitive triples with $c < 20$.</div>
  //       <input class="problem-input" type="text" placeholder="Your answer…"/>
  //       <button class="problem-answer-toggle" onclick="toggleAnswer(this)">Show Answer</button>
  //       <div class="problem-answer-reveal">$(3,4,5)$, $(5,12,13)$, $(8,15,17)$</div>
  //     </div>
  //   `;
  //   app = `<div class="app-block"><h4>Architecture</h4><p>Used since ancient times to ensure right angles.</p></div>`;
  // }
  // ══════════════════════════════════════════════════════════════

  document.getElementById('tt-content').innerHTML    = theory;
  document.getElementById('tv-content').innerHTML    = viz;
  document.getElementById('ti-content').innerHTML    = intuition;
  document.getElementById('ts-content').innerHTML    = steps;
  document.getElementById('tp-content').innerHTML    = problems;
  document.getElementById('ta-content').innerHTML    = app;

  _renderStepDots('theory');
}

/* ─── Step dots (5 steps: theory, viz, intuition, strategy, practice, relevance) */
const STEP_SCREENS = ['topic-theory','topic-viz','topic-intuition','topic-steps','topic-problems','topic-application'];
const STEP_DOT_IDS = ['step-dots-theory','step-dots-viz','step-dots-intuition','step-dots-steps','step-dots-problems','step-dots-app'];

function _renderStepDots(activeStep) {
  const activeIdx = STEP_SCREENS.indexOf('topic-' + activeStep);
  STEP_DOT_IDS.forEach(dotId => {
    const el = document.getElementById(dotId);
    if (!el) return;
    el.innerHTML = STEP_SCREENS.map((_, k) => {
      const cls = k < activeIdx ? 'done' : k === activeIdx ? 'active' : '';
      return `<span class="step-dot ${cls}"></span>`;
    }).join('');
  });
}

// Step dot observers are registered in the DOMContentLoaded init block below.

/* ─── Proceed from application (end of a topic) ────────────── */
function proceedFromApplication() {
  const unit = UNITS[currentUnitIdx];
  const nextIdx = currentTopicIdx + 1;

  // Only advance saved progress forward — never overwrite a higher value
  const { topicIdx: savedTopic } = _unitProgress(currentUnitIdx);

  if (nextIdx < unit.topics.length) {
    currentTopicIdx = nextIdx;
    if (nextIdx > savedTopic) _saveProgress(currentUnitIdx, nextIdx);
    _showTopicIntro(currentUnitIdx, nextIdx);
  } else {
    // All topics done — mark as finished content (not yet tested)
    // Use topics.length as the "content complete" marker
    if (unit.topics.length > savedTopic) _saveProgress(currentUnitIdx, unit.topics.length);
    _showUnitComplete();
  }

  // Refresh unit cards to update progress bars
  renderUnitCards();
}

/* ─── Unit complete screen ──────────────────────────────────── */
function _showUnitComplete() {
  const unit    = UNITS[currentUnitIdx];
  const hasNext = currentUnitIdx < UNITS.length - 1;
  const nextUnit = hasNext ? UNITS[currentUnitIdx + 1] : null;

  document.getElementById('unit-complete-content').innerHTML = `
    <div class="unit-complete-icon">✦</div>
    <h1 class="unit-complete-heading">${unit.name} Complete</h1>
    <p class="unit-complete-body">You have finished all topics in <strong>${unit.title}</strong>.</p>
    <div class="unit-complete-actions">
      <button class="btn btn-outline" onclick="showScreen('learn')">← Back to Syllabus</button>
      <button class="btn btn-primary" onclick="openTest()">Take the Unit Test →</button>
      ${hasNext ? `<button class="btn btn-ghost" onclick="openUnit(${currentUnitIdx + 1})">Next: ${nextUnit.name} →</button>` : ''}
    </div>
  `;
  showScreen('unit-complete');
}

/* ─────────────────────────────────────────────────────────────
   UNIT TEST
───────────────────────────────────────────────────────────── */
/*
  HOW TO ADD TEST QUESTIONS
  ══════════════════════════
  In the UNIT_TESTS object below, add questions for each unit index.
  Each question: { q: 'Question text', answer: 'Correct answer string' }
  Matching is case-insensitive and trims whitespace.
  Leave answer as '' to mark all as instructor-graded (no auto-check).
*/
const UNIT_TESTS = {
  0: [ // Unit 1
    { q: '[ Test question 1 for Unit 1 ]', answer: '' },
    { q: '[ Test question 2 for Unit 1 ]', answer: '' },
    { q: '[ Test question 3 for Unit 1 ]', answer: '' },
  ],
  1: [ // Unit 2
    { q: '[ Test question 1 for Unit 2 ]', answer: '' },
    { q: '[ Test question 2 for Unit 2 ]', answer: '' },
    { q: '[ Test question 3 for Unit 2 ]', answer: '' },
  ],
  2: [
    { q: '[ Test question 1 for Unit 3 ]', answer: '' },
    { q: '[ Test question 2 for Unit 3 ]', answer: '' },
    { q: '[ Test question 3 for Unit 3 ]', answer: '' },
  ],
  3: [
    { q: '[ Test question 1 for Unit 4 ]', answer: '' },
    { q: '[ Test question 2 for Unit 4 ]', answer: '' },
    { q: '[ Test question 3 for Unit 4 ]', answer: '' },
  ],
  4: [
    { q: '[ Test question 1 for Unit 5 ]', answer: '' },
    { q: '[ Test question 2 for Unit 5 ]', answer: '' },
    { q: '[ Test question 3 for Unit 5 ]', answer: '' },
  ],
  5: [
    { q: '[ Test question 1 for Unit 6 ]', answer: '' },
    { q: '[ Test question 2 for Unit 6 ]', answer: '' },
    { q: '[ Test question 3 for Unit 6 ]', answer: '' },
  ],
  6: [
    { q: '[ Test question 1 for Unit 7 ]', answer: '' },
    { q: '[ Test question 2 for Unit 7 ]', answer: '' },
    { q: '[ Test question 3 for Unit 7 ]', answer: '' },
  ],
  7: [
    { q: '[ Test question 1 for Unit 8 ]', answer: '' },
    { q: '[ Test question 2 for Unit 8 ]', answer: '' },
    { q: '[ Test question 3 for Unit 8 ]', answer: '' },
  ],
};

function openTest() {
  const unit = UNITS[currentUnitIdx];
  document.getElementById('test-unit-label').textContent = unit.name + ' Test';
  document.getElementById('test-title').textContent = unit.title;

  const questions = UNIT_TESTS[currentUnitIdx] || [];
  const container = document.getElementById('test-questions-container');
  container.innerHTML = questions.map((q, i) => `
    <div class="test-problem-wrap">
      <div class="test-problem-num">Question ${i + 1}</div>
      <div class="test-problem-q">${q.q}</div>
      <input class="test-problem-input" type="text" placeholder="Your answer…" data-index="${i}" autocomplete="off"/>
    </div>
  `).join('');

  showScreen('unit-test');
}

function confirmLeaveTest() {
  // Clear all inputs and return to unit-complete
  document.querySelectorAll('.test-problem-input').forEach(el => el.value = '');
  showScreen('unit-complete');
}

function submitTest() {
  const unit      = UNITS[currentUnitIdx];
  const questions = UNIT_TESTS[currentUnitIdx] || [];
  const inputs    = document.querySelectorAll('.test-problem-input');

  let correct = 0;
  const answers = questions.map((q, i) => {
    const userAnswer = (inputs[i]?.value || '').trim();
    const isCorrect  = q.answer
      ? userAnswer.toLowerCase() === q.answer.toLowerCase()
      : null; // null = manually graded
    if (isCorrect === true) correct++;
    return { q: q.q, userAnswer, correct: isCorrect };
  });

  const autoGraded = answers.filter(a => a.correct !== null);
  const result = {
    unitName: unit.name,
    unitTitle: unit.title,
    score: correct,
    total: autoGraded.length,
    answers
  };

  _saveTestResult(currentUnitIdx, result);

  // Mark unit as fully complete (test taken) = topics.length + 1
  _saveProgress(currentUnitIdx, unit.topics.length + 1);
  renderUnitCards();

  // Return to unit complete; feedback viewable via Feedback tab
  _showUnitComplete();
  alert('Test submitted! View your feedback in the Learn → Feedback tab.');
}

/* ─────────────────────────────────────────────────────────────
   FEEDBACK RENDER
───────────────────────────────────────────────────────────── */
function renderFeedback() {
  const results   = _loadTestResults();
  const container = document.getElementById('feedback-container');
  if (!container) return;

  const keys = Object.keys(results);
  if (keys.length === 0) {
    container.innerHTML = `<p style="font-family:'Inter',sans-serif;font-size:.78rem;font-weight:300;color:var(--text-muted);">No tests completed yet. Complete a unit and take the test to see your feedback here.</p>`;
    return;
  }

  container.innerHTML = keys.map(unitIdx => {
    const r = results[unitIdx];
    const autoGraded = r.answers.filter(a => a.correct !== null);
    const scoreText  = autoGraded.length > 0
      ? `${r.score} / ${autoGraded.length} auto-graded correct`
      : 'Manually graded — no auto-score';

    const rows = r.answers.map((a, i) => {
      const statusClass = a.correct === true ? 'feedback-correct' : a.correct === false ? 'feedback-wrong' : 'feedback-empty';
      const statusText  = a.correct === true ? '✓ Correct' : a.correct === false ? '✗ Incorrect' : '— Manual';
      return `
        <tr>
          <td>${i + 1}</td>
          <td>${a.q}</td>
          <td>${a.userAnswer || '<em style="color:var(--text-muted)">No answer</em>'}</td>
          <td class="${statusClass}">${statusText}</td>
        </tr>
      `;
    }).join('');

    return `
      <div class="feedback-unit-block">
        <div class="feedback-unit-heading">${r.unitName} — ${r.unitTitle}</div>
        <div class="feedback-card">
          <div class="feedback-card-header">
            <span class="feedback-card-title">Test Results</span>
            <span class="feedback-score">${scoreText}</span>
          </div>
          <table class="feedback-table">
            <thead><tr><th>#</th><th>Question</th><th>Your Answer</th><th>Result</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
  }).join('');
}

/* ─────────────────────────────────────────────────────────────
   MYSTERIES
───────────────────────────────────────────────────────────── */
/*
  HOW TO ADD MYSTERY CONTENT
  ═══════════════════════════
  Add entries to the MYSTERIES array.
  The openMystery() function injects content into the 4 panel screens.
  Replace the placeholder innerHTML strings for each mystery index.
*/
const MYSTERIES = [
  { eyebrow: 'Exhibit 01 — Unsolved Mystery', title: '[ Conjecture Name ]', proposer: 'Proposed by: [ Name, Year ]' },
  { eyebrow: 'Exhibit 02 — Unsolved Mystery', title: '[ Conjecture Name ]', proposer: 'Proposed by: [ Name, Year ]' },
  { eyebrow: 'Exhibit 03 — Unsolved Mystery', title: '[ Conjecture Name ]', proposer: 'Proposed by: [ Name, Year ]' },
];

let currentMysteryIdx = 0;

function openMystery(idx) {
  currentMysteryIdx = idx;
  const m = MYSTERIES[idx];

  ['mc', 'mv', 'mr', 'mm'].forEach(prefix => {
    const eyEl = document.getElementById(prefix + '-eyebrow');
    const ttEl = document.getElementById(prefix + '-title');
    if (eyEl) eyEl.textContent = m.eyebrow;
    if (ttEl) ttEl.innerHTML   = m.title;
  });

  // ── Mystery content — replace placeholders below ──────────────
  // if (idx === 0) {
  //   document.getElementById('mc-content').innerHTML = `<div class="latex-block">...</div>`;
  //   document.getElementById('mv-content').innerHTML = `<img src="mystery0-viz.jpg" ...>`;
  //   document.getElementById('mr-content').innerHTML = `<div class="step-block">...</div>`;
  //   document.getElementById('mm-content').innerHTML = `<div class="ph">...</div>`;
  // }

  document.getElementById('mc-content').innerHTML = `<div class="latex-block">[ Formal LaTeX statement for Exhibit 0${idx + 1} ]</div>`;
  document.getElementById('mv-content').innerHTML = `<div class="viz-area" style="min-height:400px;">[ Diagram or chart for Exhibit 0${idx + 1} ]</div>`;
  document.getElementById('mr-content').innerHTML = `
    <div class="step-block"><div class="step-label">Result 1</div><div class="step-content">[ Partial result or related theorem ]</div></div>
    <div class="step-block"><div class="step-label">Result 2</div><div class="step-content">[ Partial result or related theorem ]</div></div>
  `;
  document.getElementById('mm-content').innerHTML = `
    <div class="ph" style="min-height:120px;margin-bottom:1.2rem;">[ Why solving this would matter ]</div>
    <div style="margin-top:1rem;"><span class="app-tag">[ Tag ]</span><span class="app-tag">[ Tag ]</span></div>
  `;

  showScreen('mystery-conjecture');
}

/* ─────────────────────────────────────────────────────────────
   FOUNDING FATHERS
───────────────────────────────────────────────────────────── */
/*
  HOW TO ADD FOUNDER CONTENT
  ═══════════════════════════
  Fill in the fields below for each founder.
  Set imgSrc to the local filename (e.g. 'gauss.jpg') — file must be
  in the same folder as index.html.
*/
const FOUNDERS = {
  gauss: {
    name: 'Carl Friedrich Gauss', years: '1777 – 1855', imgSrc: 'gauss.jpg',
    backstory: '[ Your content ]', discoveries: '[ Your content ]',
    impact: '[ Your content ]',   legacy: '[ Your content ]',
  },
  fermat: {
    name: 'Pierre de Fermat', years: '1601 – 1665', imgSrc: 'fermat.jpg',
    backstory: '[ Your content ]', discoveries: '[ Your content ]',
    impact: '[ Your content ]',   legacy: '[ Your content ]',
  },
  euler: {
    name: 'Leonhard Euler', years: '1707 – 1783', imgSrc: 'euler.jpg',
    backstory: '[ Your content ]', discoveries: '[ Your content ]',
    impact: '[ Your content ]',   legacy: '[ Your content ]',
  },
  riemann: {
    name: 'Bernhard Riemann', years: '1826 – 1866', imgSrc: 'riemann.jpg',
    backstory: '[ Your content ]', discoveries: '[ Your content ]',
    impact: '[ Your content ]',   legacy: '[ Your content ]',
  },
};

function openFounder(key) {
  const f = FOUNDERS[key];
  if (!f) return;

  document.getElementById('founder-name').textContent        = f.name;
  document.getElementById('founder-years').textContent       = f.years;
  document.getElementById('founder-backstory').textContent   = f.backstory;
  document.getElementById('founder-discoveries').textContent = f.discoveries;
  document.getElementById('founder-impact').textContent      = f.impact;
  document.getElementById('founder-legacy').textContent      = f.legacy;

  const img = document.getElementById('founder-img');
  const ph  = document.getElementById('founder-portrait-placeholder');
  img.src   = f.imgSrc;
  img.alt   = f.name;
  img.style.display = 'block';
  ph.style.display  = 'none';
  img.onerror = () => { img.style.display = 'none'; ph.style.display = 'flex'; };

  showScreen('founder-detail');
}

/* ─────────────────────────────────────────────────────────────
   PRACTICE ANSWER TOGGLE
───────────────────────────────────────────────────────────── */
function toggleAnswer(btn) {
  const reveal = btn.nextElementSibling;
  if (!reveal) return;
  const isOpen = reveal.classList.contains('visible');
  reveal.classList.toggle('visible', !isOpen);
  btn.classList.toggle('open', !isOpen);
  btn.textContent = isOpen ? 'Show Answer' : 'Hide Answer';
}

/* ─────────────────────────────────────────────────────────────
   FLASHCARD GLOSSARY
   ─────────────────────────────────────────────────────────────
   HOW TO ADD / EDIT FLASHCARDS
   ════════════════════════════
   Add objects to the FLASHCARDS array:
     { unit, term, def, latex, cat }
   cat must be one of: foundations | congruences | functions | primes | advanced
   For latex, use standard LaTeX strings: "$a \\mid b$"
   Use "" for latex if no formula is needed.
───────────────────────────────────────────────────────────── */
const FLASHCARDS = [
  { unit:'Unit 1 — Foundations',  term:'Divisibility',            def:'[ Your definition ]', latex:'$a \\mid b$',                                            cat:'foundations' },
  { unit:'Unit 1 — Foundations',  term:'Integer',                 def:'[ Your definition ]', latex:'$\\mathbb{Z}=\\{\\ldots,-1,0,1,\\ldots\\}$',              cat:'foundations' },
  { unit:'Unit 1 — Foundations',  term:'Greatest Common Divisor', def:'[ Your definition ]', latex:'$\\gcd(a,b)$',                                            cat:'foundations' },
  { unit:'Unit 1 — Foundations',  term:'Least Common Multiple',   def:'[ Your definition ]', latex:'$\\mathrm{lcm}(a,b)$',                                    cat:'foundations' },
  { unit:'Unit 2 — Primes',       term:'Prime Number',            def:'[ Your definition ]', latex:'$p\\in\\mathbb{P},\\;p>1$',                               cat:'primes'      },
  { unit:'Unit 2 — Primes',       term:'Composite Number',        def:'[ Your definition ]', latex:'$n=ab,\\;a,b>1$',                                         cat:'primes'      },
  { unit:'Unit 3 — Congruences',  term:'Congruence',              def:'[ Your definition ]', latex:'$a\\equiv b\\pmod{n}$',                                   cat:'congruences' },
  { unit:'Unit 3 — Congruences',  term:'Residue Class',           def:'[ Your definition ]', latex:'$[a]_n=\\{a+kn:k\\in\\mathbb{Z}\\}$',                    cat:'congruences' },
  { unit:'Unit 3 — Congruences',  term:'Modular Inverse',         def:'[ Your definition ]', latex:'$a\\cdot a^{-1}\\equiv 1\\pmod{n}$',                      cat:'congruences' },
  { unit:'Unit 4 — Euler / RSA',  term:"Euler's Totient Function",def:'[ Your definition ]', latex:'$\\varphi(n)=n\\prod_{p|n}\\!\\left(1-\\tfrac{1}{p}\\right)$', cat:'functions' },
  { unit:'Unit 4 — Euler / RSA',  term:"Euler's Theorem",         def:'[ Your definition ]', latex:'$a^{\\varphi(n)}\\equiv 1\\pmod{n}$',                     cat:'functions'   },
  { unit:'Unit 4 — Euler / RSA',  term:'Multiplicative Function', def:'[ Your definition ]', latex:'$f(mn)=f(m)f(n),\\;\\gcd(m,n)=1$',                        cat:'functions'   },
  { unit:'Unit 6 — Quad. Rec.',   term:'Quadratic Residue',       def:'[ Your definition ]', latex:'$x^2\\equiv a\\pmod{p}$ has a solution',                  cat:'advanced'    },
  { unit:'Unit 6 — Quad. Rec.',   term:'Legendre Symbol',         def:'[ Your definition ]', latex:'$\\left(\\dfrac{a}{p}\\right)\\in\\{-1,0,1\\}$',         cat:'advanced'    },
  { unit:'Unit 8 — Advanced',     term:'Riemann Zeta Function',   def:'[ Your definition ]', latex:'$\\zeta(s)=\\sum_{n=1}^{\\infty}\\frac{1}{n^s}$',         cat:'advanced'    },
  { unit:'Unit 8 — Advanced',     term:'Dirichlet Series',        def:'[ Your definition ]', latex:'$\\sum_{n=1}^{\\infty}\\frac{a_n}{n^s}$',                 cat:'advanced'    },
];

let fcAll     = FLASHCARDS.slice(); // all cards in order, no categories
let fcIdx     = 0;
let fcFlipped = false;

function setGlossaryCat(cat, btn) {
  // Categories removed — all cards shown in order
  fcAll     = FLASHCARDS.slice();
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
      delimiters: [{ left:'$$',right:'$$',display:true },{ left:'$',right:'$',display:false }],
      throwOnError: false
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

/* ─────────────────────────────────────────────────────────────
   INIT
───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Boot the home screen
  showScreen('home');

  // Populate unit cards
  renderUnitCards();

  // Render initial flashcard
  _renderCard();

  // Watch each learning panel for activation and update step dots accordingly
  STEP_SCREENS.forEach((screenId, i) => {
    const screen = document.getElementById(screenId);
    if (!screen) return;
    const obs = new MutationObserver(() => {
      if (screen.classList.contains('active')) {
        STEP_DOT_IDS.forEach(dotId => {
          const el = document.getElementById(dotId);
          if (!el) return;
          el.innerHTML = STEP_SCREENS.map((_, k) => {
            const cls = k < i ? 'done' : k === i ? 'active' : '';
            return `<span class="step-dot ${cls}"></span>`;
          }).join('');
        });
      }
    });
    obs.observe(screen, { attributes: true, attributeFilter: ['class'] });
  });
});
