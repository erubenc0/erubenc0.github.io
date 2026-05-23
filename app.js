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
  'learn', 'unit-title', 'topic-intro', 'unit0-panel', 'unit-complete',
  'topic-theory', 'topic-viz', 'topic-intuition', 'topic-steps', 'topic-problems', 'topic-application',
  'proofs',
  'mysteries', 'mystery-conjecture', 'mystery-viz', 'mystery-results', 'mystery-matters',
  'archive', 'references', 'about'
];

// Maps screen id → which nav link should be highlighted
const NAV_MAP = {
  'home': 'nav-home', 'founder-detail': 'nav-home',
  'learn': 'nav-learn', 'unit-title': 'nav-learn', 'topic-intro': 'nav-learn',
  'unit0-panel': 'nav-learn', 'unit-complete': 'nav-learn',
  'topic-theory': 'nav-learn', 'topic-viz': 'nav-learn', 'topic-intuition': 'nav-learn',
  'topic-steps': 'nav-learn', 'topic-problems': 'nav-learn', 'topic-application': 'nav-learn',
  'proofs': 'nav-proofs',
  'mysteries': 'nav-mysteries',
  'mystery-conjecture': 'nav-mysteries', 'mystery-viz': 'nav-mysteries',
  'mystery-results': 'nav-mysteries', 'mystery-matters': 'nav-mysteries',
  'references': 'nav-references', 'about': 'nav-about'
};

function showScreen(id, archiveTarget) {
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

  // Archive deep-link: filter + scroll + highlight a specific exhibit
  if (id === 'archive' && archiveTarget) {
    setTimeout(() => {
      const card = document.getElementById(archiveTarget);
      if (!card) return;
      const tag = card.getAttribute('data-tag') || 'unit-1';
      const filterBtn = document.querySelector(`.archive-filter-btn[onclick*="'${tag}'"]`);
      filterArchive(tag, filterBtn);
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.add('exhibit-highlight');
      setTimeout(() => card.classList.remove('exhibit-highlight'), 2200);
    }, 120);
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
   INTUITION IMAGE GALLERY
   Each topic's annotations section supports multiple images.
   Images are stored as an array in the topic data and cycled
   with prev/next arrows. Clicking an image opens the lightbox.
───────────────────────────────────────────────────────────── */
let _intuitionImages = [];   // array of { src, alt } for current topic
let _intuitionIdx    = 0;

function _initIntuitionGallery(images) {
  // images: array of objects { src: 'file.jpg', alt: 'caption' }
  // Call this when loading a topic's intuition panel.
  // Defaults to one placeholder if no images are provided.
  _intuitionImages = (images && images.length)
    ? images
    : [{ src: '', alt: 'Notes image goes here. To implement, pass an images array to _initIntuitionGallery() in app.js.' }];
  _intuitionIdx = 0;
  _renderIntuitionGallery();
}

function _renderIntuitionGallery() {
  const wrap    = document.getElementById('intuition-gallery-wrap');
  const counter = document.getElementById('intuition-gallery-counter');
  const prevBtn = document.getElementById('intuition-gallery-prev');
  const nextBtn = document.getElementById('intuition-gallery-next');
  if (!wrap) return;

  const img = _intuitionImages[_intuitionIdx];
  if (img.src) {
    wrap.innerHTML = `<img src="${img.src}" alt="${img.alt || ''}"
      style="width:100%;height:100%;object-fit:contain;cursor:zoom-in;border-radius:var(--radius);"
      onclick="_openIntuitionLightbox(${_intuitionIdx})">`;
  } else {
    wrap.innerHTML = `<div class="intuition-img-placeholder">${img.alt}</div>`;
  }

  if (counter) counter.textContent = `${_intuitionIdx + 1} / ${_intuitionImages.length}`;
  if (prevBtn)  prevBtn.disabled = _intuitionIdx === 0;
  if (nextBtn)  nextBtn.disabled = _intuitionIdx === _intuitionImages.length - 1;
}

function intuitionGalleryMove(dir) {
  _intuitionIdx = Math.max(0, Math.min(_intuitionImages.length - 1, _intuitionIdx + dir));
  _renderIntuitionGallery();
}

function _openIntuitionLightbox(idx) {
  const img    = _intuitionImages[idx];
  const wrap   = document.getElementById('lightbox-img-wrap');
  const capEl  = document.getElementById('lightbox-caption');
  const overlay = document.getElementById('lightbox-overlay');
  if (!wrap || !img.src) return;
  wrap.innerHTML = `<img src="${img.src}" alt="${img.alt || ''}">`;
  capEl.textContent = img.alt || '';
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/* ─────────────────────────────────────────────────────────────
   LEARN — SYLLABUS / GLOSSARY TOGGLE
───────────────────────────────────────────────────────────── */
function showLearnView(view) {
  const isSyllabus = view === 'syllabus';
  document.getElementById('learn-view-syllabus').style.display  = isSyllabus ? '' : 'none';
  document.getElementById('learn-view-glossary').style.display  = isSyllabus ? 'none' : '';
  document.getElementById('toggle-syllabus').classList.toggle('active',  isSyllabus);
  document.getElementById('toggle-glossary').classList.toggle('active', !isSyllabus);
  if (!isSyllabus) _renderCard();
}

/* ─────────────────────────────────────────────────────────────
   ARCHIVE — FILTER (group-based, no "All")
───────────────────────────────────────────────────────────── */
function filterArchive(tag, btn) {
  document.querySelectorAll('.archive-filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.exhibit-unit-group').forEach(group => {
    group.style.display = group.getAttribute('data-group') === tag ? '' : 'none';
  });
}

/* ─────────────────────────────────────────────────────────────
   LIGHTBOX
───────────────────────────────────────────────────────────── */
function openLightbox(frameEl) {
  const imgSlot  = frameEl.querySelector('.exhibit-img-slot');
  const caption  = frameEl.closest('.exhibit-case').querySelector('.exhibit-caption');
  const wrap     = document.getElementById('lightbox-img-wrap');
  const capEl    = document.getElementById('lightbox-caption');
  const overlay  = document.getElementById('lightbox-overlay');

  wrap.innerHTML = imgSlot ? imgSlot.innerHTML : '';
  capEl.textContent = caption ? caption.textContent : '';

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ─────────────────────────────────────────────────────────────
   HELP MODAL — shows automatically once on first visit only;
   re-opens any time the user clicks the ? button.
───────────────────────────────────────────────────────────── */
function toggleHelp() {
  const modal   = document.getElementById('help-modal');
  const overlay = document.getElementById('help-overlay');
  if (!modal || !overlay) return;
  const open = modal.classList.toggle('open');
  overlay.classList.toggle('open', open);
  if (!open) {
    try { localStorage.setItem('nts_welcome_seen', '1'); } catch(_) {}
  }
}

function _maybeShowWelcome() {
  try {
    if (localStorage.getItem('nts_welcome_seen')) return;
    localStorage.setItem('nts_welcome_seen', '1');
  } catch(_) {
    // localStorage unavailable (e.g. file:// protocol) — skip auto-show entirely
    return;
  }
  // Only reaches here on genuine first visit
  const modal   = document.getElementById('help-modal');
  const overlay = document.getElementById('help-overlay');
  if (modal && overlay) {
    modal.classList.add('open');
    overlay.classList.add('open');
  }
}

/* ─────────────────────────────────────────────────────────────
   LEARN — SYLLABUS ONLY (Feedback tab removed)
───────────────────────────────────────────────────────────── */

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
  {
    idx: 0, name: 'Unit 1', title: 'Unit 1',
    desc: 'Unit 1 description goes here. To implement, locate the <code>desc</code> field for Unit 1 in the <code>UNITS</code> array in <code>app.js</code>.',
    topics: [
      { id: 'topic-1-1', num: '1.1', name: 'Topic 1.1', discoverer: '' },
      { id: 'topic-1-2', num: '1.2', name: 'Topic 1.2', discoverer: '' },
      { id: 'topic-1-3', num: '1.3', name: 'Topic 1.3', discoverer: '' },
      { id: 'topic-1-4', num: '1.4', name: 'Topic 1.4', discoverer: '' },
      { id: 'topic-1-5', num: '1.5', name: 'Topic 1.5', discoverer: '' },
    ]
  },
  {
    idx: 1, name: 'Unit 2', title: 'Unit 2',
    desc: 'Unit 2 description goes here. To implement, locate the <code>desc</code> field for Unit 2 in the <code>UNITS</code> array in <code>app.js</code>.',
    topics: [
      { id: 'topic-2-1', num: '2.1', name: 'Topic 2.1', discoverer: '' },
      { id: 'topic-2-2', num: '2.2', name: 'Topic 2.2', discoverer: '' },
      { id: 'topic-2-3', num: '2.3', name: 'Topic 2.3', discoverer: '' },
      { id: 'topic-2-4', num: '2.4', name: 'Topic 2.4', discoverer: '' },
    ]
  },
  {
    idx: 2, name: 'Unit 3', title: 'Unit 3',
    desc: 'Unit 3 description goes here. To implement, locate the <code>desc</code> field for Unit 3 in the <code>UNITS</code> array in <code>app.js</code>.',
    topics: [
      { id: 'topic-3-1', num: '3.1', name: 'Topic 3.1', discoverer: '' },
      { id: 'topic-3-2', num: '3.2', name: 'Topic 3.2', discoverer: '' },
      { id: 'topic-3-3', num: '3.3', name: 'Topic 3.3', discoverer: '' },
      { id: 'topic-3-4', num: '3.4', name: 'Topic 3.4', discoverer: '' },
    ]
  },
  {
    idx: 3, name: 'Unit 4', title: 'Unit 4',
    desc: 'Unit 4 description goes here. To implement, locate the <code>desc</code> field for Unit 4 in the <code>UNITS</code> array in <code>app.js</code>.',
    topics: [
      { id: 'topic-4-1', num: '4.1', name: 'Topic 4.1', discoverer: '' },
      { id: 'topic-4-2', num: '4.2', name: 'Topic 4.2', discoverer: '' },
      { id: 'topic-4-3', num: '4.3', name: 'Topic 4.3', discoverer: '' },
      { id: 'topic-4-4', num: '4.4', name: 'Topic 4.4', discoverer: '' },
    ]
  },
  {
    idx: 4, name: 'Unit 5', title: 'Unit 5',
    desc: 'Unit 5 description goes here. To implement, locate the <code>desc</code> field for Unit 5 in the <code>UNITS</code> array in <code>app.js</code>.',
    topics: [
      { id: 'topic-5-1', num: '5.1', name: 'Topic 5.1', discoverer: '' },
      { id: 'topic-5-2', num: '5.2', name: 'Topic 5.2', discoverer: '' },
      { id: 'topic-5-3', num: '5.3', name: 'Topic 5.3', discoverer: '' },
      { id: 'topic-5-4', num: '5.4', name: 'Topic 5.4', discoverer: '' },
    ]
  },
  {
    idx: 5, name: 'Unit 6', title: 'Unit 6',
    desc: 'Unit 6 description goes here. To implement, locate the <code>desc</code> field for Unit 6 in the <code>UNITS</code> array in <code>app.js</code>.',
    topics: [
      { id: 'topic-6-1', num: '6.1', name: 'Topic 6.1', discoverer: '' },
      { id: 'topic-6-2', num: '6.2', name: 'Topic 6.2', discoverer: '' },
      { id: 'topic-6-3', num: '6.3', name: 'Topic 6.3', discoverer: '' },
      { id: 'topic-6-4', num: '6.4', name: 'Topic 6.4', discoverer: '' },
    ]
  },
  {
    idx: 6, name: 'Unit 7', title: 'Unit 7',
    desc: 'Unit 7 description goes here. To implement, locate the <code>desc</code> field for Unit 7 in the <code>UNITS</code> array in <code>app.js</code>.',
    topics: [
      { id: 'topic-7-1', num: '7.1', name: 'Topic 7.1', discoverer: '' },
      { id: 'topic-7-2', num: '7.2', name: 'Topic 7.2', discoverer: '' },
      { id: 'topic-7-3', num: '7.3', name: 'Topic 7.3', discoverer: '' },
      { id: 'topic-7-4', num: '7.4', name: 'Topic 7.4', discoverer: '' },
    ]
  },
  {
    idx: 7, name: 'Unit 8', title: 'Unit 8',
    desc: 'Unit 8 description goes here. To implement, locate the <code>desc</code> field for Unit 8 in the <code>UNITS</code> array in <code>app.js</code>.',
    topics: [
      { id: 'topic-8-1', num: '8.1', name: 'Topic 8.1', discoverer: '' },
      { id: 'topic-8-2', num: '8.2', name: 'Topic 8.2', discoverer: '' },
      { id: 'topic-8-3', num: '8.3', name: 'Topic 8.3', discoverer: '' },
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

    const resumeHtml = isStarted && !isComplete
          ? `<span class="resume-badge">Resume: ${unit.topics[topicIdx]?.num || ''} ${unit.topics[topicIdx]?.name || ''}</span>`
          : isComplete
          ? `<span class="resume-badge">Complete ✓</span>`
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
    <div class="topic-intro-body-row">
      <div class="topic-intro-img">
        [ Image for ${topic.name} — replace this div's contents with &lt;img src="topic-${topic.id}.jpg"&gt; ]
      </div>
      <div class="topic-intro-text-col">
        <div style="font-family:'Inter',sans-serif;font-size:.58rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--text-muted);margin-bottom:.6rem;">Overview</div>
        <div id="topic-overview-${topic.id}" class="topic-intro-overview">
          [ Add a brief overview of ${topic.name} here — 2–3 sentences introducing the topic before the student begins. ]
        </div>
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
      ${hasNext ? `<button class="btn btn-primary" onclick="openUnit(${currentUnitIdx + 1})">Next: ${nextUnit.name} →</button>` : ''}
    </div>
  `;
  showScreen('unit-complete');
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
   REQUIRED HTML STRUCTURE FOR #fc-card (in index.html):
   ══════════════════════════════════════════════════════════════
   <div class="fc-card-wrap">
     <div id="fc-card" class="fc-card" onclick="flipCard()">
       <!-- FRONT -->
       <div class="fc-face fc-face-front">
         <div id="fc-unit" class="fc-unit"></div>
         <div id="fc-term" class="fc-term"></div>
         <div class="fc-hint">Click to reveal ↓</div>
       </div>
       <!-- BACK -->
       <div class="fc-face fc-face-back">
         <div class="fc-back-section">
           <div class="fc-back-label">Formal Definition</div>
           <div id="fc-formal" class="fc-back-text"></div>
           <div id="fc-latex" class="fc-latex"></div>
         </div>
         <div class="fc-back-section">
           <div class="fc-back-label">Intuitive Translation</div>
           <div id="fc-intuition" class="fc-back-text"></div>
         </div>
         <div class="fc-back-section">
           <div class="fc-back-label">Sandbox Example</div>
           <div id="fc-example" class="fc-back-text"></div>
         </div>
       </div>
     </div>
   </div>
   ══════════════════════════════════════════════════════════════
   HOW TO ADD / EDIT FLASHCARDS
   ════════════════════════════
   Add objects to the FLASHCARDS array:
     { unit, term, latex, cat, formal, intuition, example }
   cat must be one of: foundations | congruences | functions | primes | advanced
   Use $...$ for inline LaTeX and $$...$$ for display math.
───────────────────────────────────────────────────────────── */
const FLASHCARDS = [
  { unit:'Unit 1', term:'Term 1.1', latex:'', cat:'unit-1',
    formal:'Formal definition goes here. To implement, locate this card in the <code>FLASHCARDS</code> array in <code>app.js</code> and set the <code>formal</code> field.',
    intuition:'Intuitive translation goes here. To implement, set the <code>intuition</code> field for this card in <code>app.js</code>.',
    example:'Sandbox example goes here. To implement, set the <code>example</code> field for this card in <code>app.js</code>.' },
  { unit:'Unit 1', term:'Term 1.2', latex:'', cat:'unit-1',
    formal:'Formal definition goes here.',
    intuition:'Intuitive translation goes here.',
    example:'Sandbox example goes here.' },
  { unit:'Unit 1', term:'Term 1.3', latex:'', cat:'unit-1',
    formal:'Formal definition goes here.',
    intuition:'Intuitive translation goes here.',
    example:'Sandbox example goes here.' },
  { unit:'Unit 1', term:'Term 1.4', latex:'', cat:'unit-1',
    formal:'Formal definition goes here.',
    intuition:'Intuitive translation goes here.',
    example:'Sandbox example goes here.' },
  { unit:'Unit 2', term:'Term 2.1', latex:'', cat:'unit-2',
    formal:'Formal definition goes here.',
    intuition:'Intuitive translation goes here.',
    example:'Sandbox example goes here.' },
  { unit:'Unit 2', term:'Term 2.2', latex:'', cat:'unit-2',
    formal:'Formal definition goes here.',
    intuition:'Intuitive translation goes here.',
    example:'Sandbox example goes here.' },
  { unit:'Unit 3', term:'Term 3.1', latex:'', cat:'unit-3',
    formal:'Formal definition goes here.',
    intuition:'Intuitive translation goes here.',
    example:'Sandbox example goes here.' },
  { unit:'Unit 3', term:'Term 3.2', latex:'', cat:'unit-3',
    formal:'Formal definition goes here.',
    intuition:'Intuitive translation goes here.',
    example:'Sandbox example goes here.' },
  { unit:'Unit 3', term:'Term 3.3', latex:'', cat:'unit-3',
    formal:'Formal definition goes here.',
    intuition:'Intuitive translation goes here.',
    example:'Sandbox example goes here.' },
  { unit:'Unit 4', term:'Term 4.1', latex:'', cat:'unit-4',
    formal:'Formal definition goes here.',
    intuition:'Intuitive translation goes here.',
    example:'Sandbox example goes here.' },
  { unit:'Unit 4', term:'Term 4.2', latex:'', cat:'unit-4',
    formal:'Formal definition goes here.',
    intuition:'Intuitive translation goes here.',
    example:'Sandbox example goes here.' },
  { unit:'Unit 4', term:'Term 4.3', latex:'', cat:'unit-4',
    formal:'Formal definition goes here.',
    intuition:'Intuitive translation goes here.',
    example:'Sandbox example goes here.' },
  { unit:'Unit 6', term:'Term 6.1', latex:'', cat:'unit-6',
    formal:'Formal definition goes here.',
    intuition:'Intuitive translation goes here.',
    example:'Sandbox example goes here.' },
  { unit:'Unit 6', term:'Term 6.2', latex:'', cat:'unit-6',
    formal:'Formal definition goes here.',
    intuition:'Intuitive translation goes here.',
    example:'Sandbox example goes here.' },
  { unit:'Unit 8', term:'Term 8.1', latex:'', cat:'unit-8',
    formal:'Formal definition goes here.',
    intuition:'Intuitive translation goes here.',
    example:'Sandbox example goes here.' },
  { unit:'Unit 8', term:'Term 8.2', latex:'', cat:'unit-8',
    formal:'Formal definition goes here.',
    intuition:'Intuitive translation goes here.',
    example:'Sandbox example goes here.' },
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

  // Front face
  document.getElementById('fc-unit').textContent = c.unit;
  document.getElementById('fc-term').textContent = c.term;

  // Back face — three sections
  const formalEl    = document.getElementById('fc-formal');
  const intuitionEl = document.getElementById('fc-intuition');
  const exampleEl   = document.getElementById('fc-example');
  const latexEl     = document.getElementById('fc-latex');

  if (formalEl)    formalEl.textContent    = c.formal    || '';
  if (intuitionEl) intuitionEl.textContent = c.intuition || '';
  if (exampleEl)   exampleEl.textContent   = c.example   || '';
  if (latexEl)     latexEl.textContent     = c.latex     || '';

  // Re-render KaTeX on back face
  const backFace = document.querySelector('#fc-card .fc-face-back');
  if (backFace && window.renderMathInElement) {
    setTimeout(() => {
      renderMathInElement(backFace, {
        delimiters: [{ left:'$$',right:'$$',display:true },{ left:'$',right:'$',display:false }],
        throwOnError: false
      });
    }, 30);
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

  // Show welcome modal on first visit only
  _maybeShowWelcome();

  // Render initial flashcard
  _renderCard();

  // Escape key closes lightbox or help modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeLightbox();
      const modal = document.getElementById('help-modal');
      if (modal && modal.classList.contains('open')) toggleHelp();
    }
  });

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
