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
  'references', 'qa'
];

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
  'references': 'nav-references',
  'qa': 'nav-home'
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

  // Init Q&A when that screen is opened
  if (id === 'qa') _initQa();
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
   ABOUT MODAL
───────────────────────────────────────────────────────────── */
function toggleAboutModal() {
  const modal   = document.getElementById('about-modal');
  const overlay = document.getElementById('about-modal-overlay');
  if (!modal || !overlay) return;
  const open = modal.classList.toggle('open');
  overlay.classList.toggle('open', open);
}

/* ─────────────────────────────────────────────────────────────
   COMMUNITY Q&A HUB
   Backend: Firebase Authentication + Firestore
   ─────────────────────────────────────────────────────────────
   SETUP INSTRUCTIONS
   ══════════════════
   1. Go to https://console.firebase.google.com and create a project.
   2. Enable Authentication → Email/Password sign-in method.
   3. Enable Firestore Database (start in production mode).
   4. In Firestore, create two top-level collections:
        - "inquiries"
        - "suggestions"
      Each document will have: { title, body, authorName, authorUid,
        createdAt, section, replies: [] }
   5. Set Firestore security rules:
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /{collection}/{docId} {
              allow read: if true;
              allow create: if request.auth != null;
              allow update: if request.auth != null
                && (resource.data.authorUid == request.auth.uid
                    || request.resource.data.diff(resource.data).affectedKeys()
                       .hasOnly(['replies']));
              allow delete: if request.auth != null
                && resource.data.authorUid == request.auth.uid;
            }
          }
        }
   6. Register a Web App in your Firebase project and copy the config
      object below, replacing the placeholder values.
   7. Add the Firebase SDK script tags to the <head> of index.html:
        <script type="module">
          import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
          import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
          import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
          window._firebaseApp  = initializeApp(firebaseConfig);
          window._firebaseAuth = getAuth(window._firebaseApp);
          window._firebaseDb   = getFirestore(window._firebaseApp);
        </script>
───────────────────────────────────────────────────────────── */

// ── Firebase config — replace with your project's values ──────
const firebaseConfig = {
  apiKey:            "AIzaSyCWzd5VYmiUehwCHlB_2yUU0xte9VMPEXU",
  authDomain:        "number-theory-scrapbook.firebaseapp.com",
  projectId:         "number-theory-scrapbook",
  storageBucket:     "number-theory-scrapbook.firebasestorage.app",
  messagingSenderId: "1063124692508",
  appId:             "1:1063124692508:web:c9f553e75b60c0ce1c39d9"
};

// ── Runtime state ──────────────────────────────────────────────
let _qaCurrentUser    = null;
let _qaCurrentSection = 'inquiries';
let _qaUnsubscribers  = {};

// ── Firebase helpers (lazy-loaded after SDK is available) ──────
function _getAuth()      { return window._firebaseAuth || null; }
function _getDb()        { return window._firebaseDb   || null; }

// ── Called when the Q&A screen is first shown ──────────────────
function _initQa() {
  const auth = _getAuth();
  if (!auth) {
    _renderQaNoBackend();
    return;
  }
  // Listen for auth state
  auth.onAuthStateChanged(user => {
    _qaCurrentUser = user;
    _renderQaAuthBar();
  });
  // Load current section
  _loadQaSection(_qaCurrentSection);
}

function _renderQaNoBackend() {
  const bar = document.getElementById('qa-auth-bar');
  if (bar) bar.innerHTML = `<p class="qa-notice">Firebase is not yet configured. Follow the setup instructions in <code>app.js</code> under the Q&A section.</p>`;
}

function _renderQaAuthBar() {
  const label   = document.getElementById('qa-user-label');
  const btnArea = document.querySelector('.qa-auth-btns');
  if (!label || !btnArea) return;
  if (_qaCurrentUser) {
    label.textContent = `Signed in as ${_qaCurrentUser.displayName || _qaCurrentUser.email}`;
    btnArea.innerHTML = `<button class="btn btn-ghost" onclick="_qaSignOut()">Sign Out</button>`;
  } else {
    label.textContent = 'You are browsing as a guest.';
    btnArea.innerHTML = `
      <button class="btn btn-outline" onclick="showQaModal('login')">Sign In</button>
      <button class="btn btn-primary" onclick="showQaModal('register')">Create Account</button>
    `;
  }
  // Show/hide post buttons based on auth
  document.querySelectorAll('.qa-post-btn').forEach(btn => {
    btn.style.display = _qaCurrentUser ? '' : 'none';
  });
}

// ── Tab switching ───────────────────────────────────────────────
function showQaTab(section) {
  _qaCurrentSection = section;
  document.getElementById('qa-panel-inquiries').style.display  = section === 'inquiries'  ? '' : 'none';
  document.getElementById('qa-panel-suggestions').style.display = section === 'suggestions' ? '' : 'none';
  document.getElementById('qa-tab-inquiries').classList.toggle('active',  section === 'inquiries');
  document.getElementById('qa-tab-suggestions').classList.toggle('active', section === 'suggestions');
  _loadQaSection(section);
}

// ── Load posts from Firestore ───────────────────────────────────
function _loadQaSection(section) {
  const db = _getDb();
  if (!db) return;

  // Unsubscribe previous listener for this section
  if (_qaUnsubscribers[section]) { _qaUnsubscribers[section](); }

  const listEl = document.getElementById(`qa-thread-list-${section}`);
  if (!listEl) return;
  listEl.innerHTML = `<div class="qa-loading">Loading…</div>`;

  import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js').then(({ collection, query, orderBy, onSnapshot }) => {
    const q = query(collection(db, section), orderBy('createdAt', 'desc'));
    _qaUnsubscribers[section] = onSnapshot(q, snapshot => {
      if (snapshot.empty) {
        listEl.innerHTML = `<div class="qa-empty">No posts yet. Be the first!</div>`;
        return;
      }
      listEl.innerHTML = '';
      snapshot.forEach(doc => {
        listEl.appendChild(_buildThreadCard(doc.id, doc.data(), section));
      });
    }, err => {
      listEl.innerHTML = `<div class="qa-error">Could not load posts: ${err.message}</div>`;
    });
  });
}

function _buildThreadCard(id, data, section) {
  const div = document.createElement('div');
  div.className = 'qa-thread';
  div.id = `thread-${id}`;
  const date = data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : '';
  div.innerHTML = `
    <div class="qa-thread-header">
      <div class="qa-thread-title">${_escHtml(data.title)}</div>
      <div class="qa-thread-meta">${_escHtml(data.authorName || 'Anonymous')} · ${date}</div>
    </div>
    <div class="qa-thread-body">${_escHtml(data.body)}</div>
    <div class="qa-replies" id="replies-${id}">
      ${(data.replies || []).map(r => `
        <div class="qa-reply">
          <span class="qa-reply-author">${_escHtml(r.authorName || 'Anonymous')}</span>
          <span class="qa-reply-text">${_escHtml(r.body)}</span>
        </div>`).join('')}
    </div>
    ${_qaCurrentUser ? `
      <div class="qa-reply-form">
        <input class="qa-input" id="reply-input-${id}" placeholder="Write a reply…" />
        <button class="btn btn-outline qa-reply-btn" onclick="_submitReply('${id}','${section}')">Reply</button>
      </div>` : `<div class="qa-sign-in-prompt">
        <a onclick="showQaModal('login')" style="cursor:pointer;color:var(--maroon-light);">Sign in to reply</a>
      </div>`}
  `;
  return div;
}

// ── Submit new post ─────────────────────────────────────────────
function _submitPost(section) {
  if (!_qaCurrentUser) { showQaModal('login'); return; }
  const db    = _getDb();
  const title = document.getElementById('qa-post-title')?.value.trim();
  const body  = document.getElementById('qa-post-body')?.value.trim();
  if (!title || !body) { alert('Please fill in both fields.'); return; }

  import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js').then(({ collection, addDoc, serverTimestamp }) => {
    addDoc(collection(db, section), {
      title, body, replies: [],
      authorName: _qaCurrentUser.displayName || _qaCurrentUser.email,
      authorUid:  _qaCurrentUser.uid,
      createdAt:  serverTimestamp(),
      section
    }).then(() => closeQaModal()).catch(err => alert('Error posting: ' + err.message));
  });
}

// ── Submit reply ────────────────────────────────────────────────
function _submitReply(docId, section) {
  if (!_qaCurrentUser) { showQaModal('login'); return; }
  const db    = _getDb();
  const input = document.getElementById(`reply-input-${docId}`);
  const body  = input?.value.trim();
  if (!body) return;

  import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js').then(({ doc, updateDoc, arrayUnion }) => {
    updateDoc(doc(db, section, docId), {
      replies: arrayUnion({
        body,
        authorName: _qaCurrentUser.displayName || _qaCurrentUser.email,
        authorUid:  _qaCurrentUser.uid,
        createdAt:  new Date().toISOString()
      })
    }).then(() => { if (input) input.value = ''; })
      .catch(err => alert('Error replying: ' + err.message));
  });
}

// ── Auth modal ──────────────────────────────────────────────────
function showQaModal(mode, section) {
  const overlay = document.getElementById('qa-modal-overlay');
  const modal   = document.getElementById('qa-modal');
  const content = document.getElementById('qa-modal-content');
  if (!modal || !content) return;

  if (mode === 'register') {
    content.innerHTML = `
      <div class="qa-modal-title">Create Account</div>
      <p class="qa-modal-sub">An account lets you post questions and suggestions. Browsing is always free — no account needed.</p>
      <input class="qa-input" id="qa-reg-name"  placeholder="Display name" />
      <input class="qa-input" id="qa-reg-email" placeholder="Email" type="email" />
      <input class="qa-input" id="qa-reg-pass"  placeholder="Password (6+ characters)" type="password" />
      <div class="qa-modal-actions">
        <button class="btn btn-primary" onclick="_qaRegister()">Create Account</button>
        <button class="btn btn-ghost"   onclick="showQaModal('login')">Already have an account? Sign In</button>
      </div>
      <div class="qa-modal-error" id="qa-auth-error"></div>
    `;
  } else if (mode === 'login') {
    content.innerHTML = `
      <div class="qa-modal-title">Sign In</div>
      <input class="qa-input" id="qa-login-email" placeholder="Email" type="email" />
      <input class="qa-input" id="qa-login-pass"  placeholder="Password" type="password" />
      <div class="qa-modal-actions">
        <button class="btn btn-primary" onclick="_qaLogin()">Sign In</button>
        <button class="btn btn-ghost"   onclick="showQaModal('register')">New here? Create Account</button>
      </div>
      <div class="qa-modal-error" id="qa-auth-error"></div>
    `;
  } else if (mode === 'post') {
    const sec = section || _qaCurrentSection;
    const label = sec === 'inquiries' ? 'Question' : 'Suggestion';
    content.innerHTML = `
      <div class="qa-modal-title">Post a ${label}</div>
      <input class="qa-input" id="qa-post-title" placeholder="${label} title…" />
      <textarea class="qa-input qa-textarea" id="qa-post-body" placeholder="Describe your ${label.toLowerCase()} in detail…" rows="5"></textarea>
      <div class="qa-modal-actions">
        <button class="btn btn-primary" onclick="_submitPost('${sec}')">Post</button>
        <button class="btn btn-ghost"   onclick="closeQaModal()">Cancel</button>
      </div>
    `;
  }

  overlay.classList.add('open');
  modal.classList.add('open');
}

function closeQaModal() {
  document.getElementById('qa-modal-overlay')?.classList.remove('open');
  document.getElementById('qa-modal')?.classList.remove('open');
}

function _qaRegister() {
  const auth  = _getAuth();
  const name  = document.getElementById('qa-reg-name')?.value.trim();
  const email = document.getElementById('qa-reg-email')?.value.trim();
  const pass  = document.getElementById('qa-reg-pass')?.value;
  const errEl = document.getElementById('qa-auth-error');
  if (!name || !email || !pass) { if(errEl) errEl.textContent = 'All fields required.'; return; }

  import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js').then(({ createUserWithEmailAndPassword, updateProfile }) => {
    createUserWithEmailAndPassword(auth, email, pass)
      .then(cred => updateProfile(cred.user, { displayName: name }))
      .then(() => closeQaModal())
      .catch(err => { if(errEl) errEl.textContent = err.message; });
  });
}

function _qaLogin() {
  const auth  = _getAuth();
  const email = document.getElementById('qa-login-email')?.value.trim();
  const pass  = document.getElementById('qa-login-pass')?.value;
  const errEl = document.getElementById('qa-auth-error');

  import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js').then(({ signInWithEmailAndPassword }) => {
    signInWithEmailAndPassword(auth, email, pass)
      .then(() => closeQaModal())
      .catch(err => { if(errEl) errEl.textContent = err.message; });
  });
}

function _qaSignOut() {
  const auth = _getAuth();
  if (auth) auth.signOut();
}

function _escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
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

  let theory   = `<div class="latex-block">Theory content for <strong>${name}</strong> goes here. To implement, locate <code>topic.id === '${topic.id}'</code> in <code>_loadTopicContent()</code> in <code>app.js</code> and set the <code>theory</code> variable.</div>`;

  let vizDiagram = `<div class="viz-area" style="min-height:420px;height:100%;">Diagram or chart for ${name} goes here. To implement, set the <code>vizDiagram</code> variable for this topic in <code>_loadTopicContent()</code> in <code>app.js</code>.</div>`;
  let vizDesc    = `Visualization description for ${name} goes here. To implement, set the <code>vizDesc</code> variable for this topic in <code>_loadTopicContent()</code> in <code>app.js</code>.`;

  let intuitionText   = `Personal interpretation of ${name} goes here. To implement, set <code>intuitionText</code> for this topic in <code>_loadTopicContent()</code> in <code>app.js</code>.`;
  let clickedFirst    = `What clicked first for ${name} goes here. To implement, set <code>clickedFirst</code> for this topic.`;
  let confusedBy      = `What was initially confusing about ${name} goes here. To implement, set <code>confusedBy</code> for this topic.`;
  let intuitionImages = []; // array of { src, alt } — passed to _initIntuitionGallery()

  let steps = `<div class="latex-block">Strategy content for ${name} goes here. To implement, set the <code>steps</code> variable for this topic in <code>_loadTopicContent()</code> in <code>app.js</code>. Use $...$ for inline math and $$...$$ for display math.</div>`;
  let problems = `
    <div class="problem-wrap">
      <div class="problem-q">Problem 1</div>
      <div class="problem-img-slot">Problem 1 image for ${name} goes here. To implement, set the <code>problems</code> variable for this topic in <code>_loadTopicContent()</code> in <code>app.js</code>.</div>
      <button class="problem-answer-toggle" onclick="toggleAnswer(this)">Show Answer</button>
      <div class="problem-answer-reveal">Answer goes here.</div>
    </div>
    <div class="problem-wrap">
      <div class="problem-q">Problem 2</div>
      <div class="problem-img-slot">Problem 2 image goes here.</div>
      <button class="problem-answer-toggle" onclick="toggleAnswer(this)">Show Answer</button>
      <div class="problem-answer-reveal">Answer goes here.</div>
    </div>
    <div class="problem-wrap">
      <div class="problem-q">Problem 3</div>
      <div class="problem-img-slot">Problem 3 image goes here.</div>
      <button class="problem-answer-toggle" onclick="toggleAnswer(this)">Show Answer</button>
      <div class="problem-answer-reveal">Answer goes here.</div>
    </div>
  `;
  let app = `
    <div class="ph" style="min-height:120px;margin-bottom:1.2rem;">Relevance content for ${name} goes here. To implement, set the <code>app</code> variable for this topic in <code>_loadTopicContent()</code> in <code>app.js</code>.</div>
    <div class="app-block"><h4>Field or Application</h4><p>Description goes here.</p></div>
    <div class="app-block"><h4>Field or Application</h4><p>Description goes here.</p></div>
    <div style="margin-top:1.2rem;">
      <span class="app-tag">Tag</span>
      <span class="app-tag">Tag</span>
      <span class="app-tag">Tag</span>
    </div>
  `;

  // ══════════════════════════════════════════════════════════════
  // ADD YOUR CONTENT PER TOPIC HERE
  // ══════════════════════════════════════════════════════════════
  // Example:
  // if (topic.id === 'topic-1-1') {
  //   theory = `<div class="latex-block">Your theory here. Use $...$ for inline math.</div>`;
  //   vizDiagram = `<img src="topic-1-1-diagram.jpg" style="width:100%;border-radius:var(--radius);">`;
  //   vizDesc    = `Description of the visualization.`;
  //   intuitionText = `Your personal interpretation.`;
  //   clickedFirst  = `What first made this click.`;
  //   confusedBy    = `What initially confused you.`;
  //   intuitionImages = [
  //     { src: 'notes-1-1-a.jpg', alt: 'Page 1 of notes' },
  //     { src: 'notes-1-1-b.jpg', alt: 'Page 2 of notes' },
  //   ];
  //   steps = `<div class="step-block"><div class="step-label">Step 1</div><div class="step-content">...</div></div>`;
  //   problems = `...`;
  //   app = `...`;
  // }
  // ══════════════════════════════════════════════════════════════

  // Inject theory
  document.getElementById('tt-content').innerHTML = theory;

  // Inject viz — two-column split
  document.getElementById('tv-content').innerHTML = `
    <div class="viz-split">
      <div class="viz-split-diagram">${vizDiagram}</div>
      <div class="viz-split-desc">
        <div class="viz-desc-label">About This Visualization</div>
        <div class="viz-desc-text">${vizDesc}</div>
      </div>
    </div>
  `;

  // Inject intuition — image left (gallery), interpretation right (matches viz layout)
  document.getElementById('ti-content').innerHTML = `
    <div class="viz-split">
      <div class="viz-split-diagram">
        <div class="intuition-gallery" style="height:100%;">
          <div class="intuition-gallery-frame" style="flex:1;">
            <div class="intuition-gallery-img" id="intuition-gallery-wrap"></div>
          </div>
          <div class="intuition-gallery-controls">
            <button class="intuition-gallery-btn" id="intuition-gallery-prev" onclick="intuitionGalleryMove(-1)" disabled>←</button>
            <span class="intuition-gallery-counter" id="intuition-gallery-counter">1 / 1</span>
            <button class="intuition-gallery-btn" id="intuition-gallery-next" onclick="intuitionGalleryMove(1)" disabled>→</button>
          </div>
        </div>
      </div>
      <div class="viz-split-desc">
        <div class="viz-desc-label">My Interpretation</div>
        <div class="viz-desc-text">${intuitionText}</div>
      </div>
    </div>
  `;
  _initIntuitionGallery(intuitionImages);

  // Inject remaining panels
  document.getElementById('ts-content').innerHTML = steps;
  document.getElementById('tp-content').innerHTML = problems;
  document.getElementById('ta-content').innerHTML = app;

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

  // ── Mystery content — set per index below ──────────────────────
  // if (idx === 0) {
  //   document.getElementById('mc-content').innerHTML = `<div class="latex-block">...</div>`;
  //   mvDiagram = `<img src="mystery0-diagram.jpg" style="width:100%;border-radius:var(--radius);">`;
  //   mvDesc    = `Description of the visualization for Mystery 1.`;
  //   document.getElementById('mr-content').innerHTML = `<div class="step-block">...</div>`;
  //   document.getElementById('mm-content').innerHTML = `<div class="ph">...</div>`;
  // }

  let mvDiagram = `<div class="viz-area" style="min-height:420px;height:100%;">Diagram or chart for Exhibit 0${idx + 1} goes here. To implement, set <code>mvDiagram</code> for <code>idx === ${idx}</code> in <code>openMystery()</code> in <code>app.js</code>.</div>`;
  let mvDesc    = `Visualization description for Exhibit 0${idx + 1} goes here. To implement, set <code>mvDesc</code> for <code>idx === ${idx}</code> in <code>openMystery()</code> in <code>app.js</code>.`;

  document.getElementById('mc-content').innerHTML = `<div class="latex-block">Formal statement for Exhibit 0${idx + 1} goes here. To implement, locate <code>mc-content</code> in <code>openMystery()</code> in <code>app.js</code>.</div>`;
  document.getElementById('mv-content').innerHTML = `
    <div class="viz-split">
      <div class="viz-split-diagram">${mvDiagram}</div>
      <div class="viz-split-desc">
        <div class="viz-desc-label">About This Visualization</div>
        <div class="viz-desc-text">${mvDesc}</div>
      </div>
    </div>
  `;
  document.getElementById('mr-content').innerHTML = `<div class="latex-block">Known results for Exhibit 0${idx + 1} go here. To implement, locate <code>mr-content</code> in <code>openMystery()</code> in <code>app.js</code>. Use $...$ for inline math and $$...$$ for display math.</div>`;
  document.getElementById('mm-content').innerHTML = `
    <div class="ph" style="min-height:120px;margin-bottom:1.2rem;">Relevance content for Exhibit 0${idx + 1} goes here. To implement, locate <code>mm-content</code> in <code>openMystery()</code> in <code>app.js</code>.</div>
    <div style="margin-top:1rem;"><span class="app-tag">Tag</span><span class="app-tag">Tag</span></div>
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
