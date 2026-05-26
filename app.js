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
  'references', 'qa', 'about', 'login', 'register', 'profile', 'post-composer'
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
  'qa': 'nav-qa', 'login': 'nav-qa', 'register': 'nav-qa',
  'profile': 'nav-qa', 'post-composer': 'nav-qa',
  'about': 'nav-about'
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

  // Screen-specific hooks
  if (id === 'qa')      { _initQa(); }
  if (id === 'profile') { _renderProfile(); }
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
   ABOUT — now a standalone screen; no modal needed
───────────────────────────────────────────────────────────── */
// (about screen is navigated to via showScreen('about') from the ⓘ button)

/* ═══════════════════════════════════════════════════════════════
   COMMUNITY Q&A HUB — Firebase Auth + Firestore
   ═══════════════════════════════════════════════════════════════

   SECURITY — ENVIRONMENT VARIABLES
   ══════════════════════════════════
   NEVER commit your Firebase config to GitHub. Instead:
   1. Create a file named "firebase-config.js" in your project root.
   2. Add it to .gitignore immediately (echo "firebase-config.js" >> .gitignore).
   3. Paste your config into that file:
        window._fbConfig = {
          apiKey:            "YOUR_API_KEY",
          authDomain:        "YOUR_PROJECT.firebaseapp.com",
          projectId:         "YOUR_PROJECT_ID",
          storageBucket:     "YOUR_PROJECT.appspot.com",
          messagingSenderId: "YOUR_SENDER_ID",
          appId:             "YOUR_APP_ID"
        };
   4. In index.html <head>, load it BEFORE the Firebase init script:
        <script src="firebase-config.js"></script>
   5. Then initialise Firebase using window._fbConfig:
        <script type="module">
          import { initializeApp }  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
          import { getAuth }        from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
          import { getFirestore }   from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
          const app = initializeApp(window._fbConfig);
          window._firebaseAuth = getAuth(app);
          window._firebaseDb   = getFirestore(app);
        </script>
   6. Since firebase-config.js is gitignored, deploy it manually to
      GitHub Pages via Settings → Pages or use a CI secret.

   FIRESTORE COLLECTIONS
   ══════════════════════
   - "inquiries"    → user questions
   - "suggestions"  → site improvement ideas
   - "users"        → profile data per UID

   Document shape (inquiries / suggestions):
     { title, body, authorUid, authorName, authorColor, authorBadges,
       createdAt (Timestamp), upvotes: [], replies: [] }

   Reply shape (inside replies array):
     { body, authorUid, authorName, authorColor, authorBadges,
       createdAt (ISO string) }

   User document (users/{uid}):
     { username, email, color, title, equippedBadges, profileFrame,
       avatarFrame, photoURL, postCount, isCreator, customCosmetics,
       achievements: { piParadox, allKnowing, mysterious, sigma } }

   FIRESTORE SECURITY RULES
   ═════════════════════════
   Paste these in the Firebase console → Firestore → Rules tab:

   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {

       match /inquiries/{id} {
         allow read: if true;
         allow create: if request.auth != null;
         allow update: if request.auth != null
           && (resource.data.authorUid == request.auth.uid
               || request.resource.data.diff(resource.data)
                  .affectedKeys().hasOnly(['replies','upvotes']));
         allow delete: if request.auth != null
           && (resource.data.authorUid == request.auth.uid
               || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isCreator == true);
       }

       match /suggestions/{id} {
         allow read: if true;
         allow create: if request.auth != null;
         allow update: if request.auth != null
           && (resource.data.authorUid == request.auth.uid
               || request.resource.data.diff(resource.data)
                  .affectedKeys().hasOnly(['replies','upvotes']));
         allow delete: if request.auth != null
           && (resource.data.authorUid == request.auth.uid
               || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isCreator == true);
       }

       match /users/{uid} {
         allow read: if true;
         allow create: if request.auth != null && request.auth.uid == uid;
         allow update: if request.auth != null && request.auth.uid == uid;
       }

       match /usernames/{username} {
         allow read: if true;
         allow create: if request.auth != null;
       }
     }
   }
═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────── */

// ── Hardcode your Firebase UID here to grant creator status ────
// Find your UID in Firebase console → Authentication → Users
const CREATOR_UID = 'qCIjKE5moCftGuY8JzRPq5DAUE12';

// ── Milestone tiers ────────────────────────────────────────────
const MILESTONES = [
  { posts: 5,   title: 'Prime',            color: null,    frame: null,         avatarFrame: null,       badge: null, images: true },
  { posts: 15,  title: 'Computist',        color: null,    frame: null,         avatarFrame: null,       badge: null, images: true },
  { posts: 25,  title: 'Community Mentor', color: 'blue',  frame: null,         avatarFrame: null,       badge: null, images: true },
  { posts: 40,  title: "Euler's Disciple", color: null,    frame: null,         avatarFrame: null,       badge: 'e',  images: true },
  { posts: 50,  title: 'Gauss Incarnate',  color: 'red',   frame: null,         avatarFrame: null,       badge: null, images: true },
  { posts: 75,  title: 'The Proofreader',  color: 'red',   frame: 'red',        avatarFrame: null,       badge: '∞',  images: true },
  { posts: 100, title: 'The Professor',    color: 'gold',  frame: 'gold',       avatarFrame: 'gold',     badge: null, images: true },
];

// ── Secret achievements ────────────────────────────────────────
const SECRET_ACHIEVEMENTS = {
  piParadox:   { label: 'The Pi Paradox',  badge: 'π',  frame: 'circle' },
  allKnowing:  { label: 'All Knowing',     badge: '💡', frame: null     },
  mysterious:  { label: 'Mysterious',      badge: '?',  frame: null     },
  sigma:       { label: 'Sigma',           badge: '😎', frame: null     },
};

// ── Unlockable text colors ─────────────────────────────────────
const COLOR_OPTIONS = {
  white:  { label: 'White',       value: '#f0ebe3', unlocksAt: 0   },
  blue:   { label: 'Blue',        value: '#5b8dd9', unlocksAt: 25  },
  red:    { label: 'Red',         value: '#c0504d', unlocksAt: 50  },
  gold:   { label: 'Gold',        value: '#c9a84c', unlocksAt: 100 },
  purple: { label: 'Purple',      value: '#9b59b6', unlocksAt: -1  }, // creator only
};

/* ─────────────────────────────────────────────────────────────
   RUNTIME STATE
───────────────────────────────────────────────────────────── */
let _currentUser     = null;   // Firebase Auth user object
let _currentProfile  = null;   // Firestore user document data
let _currentSection  = 'inquiries';
let _composerSection = 'inquiries';
let _qaUnsubs        = {};
let _prevScreen      = 'qa';

function _getAuth() { return window._firebaseAuth || null; }
function _getDb()   { return window._firebaseDb   || null; }

/* ─────────────────────────────────────────────────────────────
   GLOBAL AUTH LISTENER — runs once on page load
───────────────────────────────────────────────────────────── */
function _bootAuth() {
  const auth = _getAuth();
  if (!auth) return;
  auth.onAuthStateChanged(async user => {
    _currentUser = user;
    if (user) {
      _currentProfile = await _loadProfile(user.uid);
      // Check "All Knowing" achievement if cached in localStorage
      _checkCachedAllKnowing(user.uid);
    } else {
      _currentProfile = null;
    }
    _updateNavForAuth();
    _refreshQaAuthBar();
  });
}

function _updateNavForAuth() {
  const profileBtn = document.getElementById('nav-profile-btn');
  if (profileBtn) profileBtn.style.display = _currentUser ? 'flex' : 'none';
}

/* ─────────────────────────────────────────────────────────────
   PROFILE HELPERS
───────────────────────────────────────────────────────────── */
async function _loadProfile(uid) {
  const db = _getDb();
  if (!db) return null;
  try {
    const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
  } catch { return null; }
}

async function _saveProfile(uid, data) {
  const db = _getDb();
  if (!db) return;
  const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
  await setDoc(doc(db, 'users', uid), data, { merge: true });
}

function _isCreator(uid) {
  return uid === CREATOR_UID;
}

function _getEffectiveColor(profile) {
  if (!profile) return COLOR_OPTIONS.white.value;
  if (_isCreator(profile.uid || _currentUser?.uid)) return '#9b59b6';
  const key = profile.color || 'white';
  return COLOR_OPTIONS[key]?.value || COLOR_OPTIONS.white.value;
}

function _computeUnlockedMilestone(postCount) {
  let current = null;
  for (const m of MILESTONES) {
    if (postCount >= m.posts) current = m;
  }
  return current;
}

function _canUseColor(colorKey, profile) {
  if (!profile) return false;
  const uid = profile.uid || _currentUser?.uid;
  if (_isCreator(uid)) return true;
  if (profile.customCosmetics?.includes(colorKey)) return true;
  const opt = COLOR_OPTIONS[colorKey];
  if (!opt || opt.unlocksAt < 0) return false;
  return (profile.postCount || 0) >= opt.unlocksAt;
}

/* ─────────────────────────────────────────────────────────────
   AUTH BACK NAVIGATION
───────────────────────────────────────────────────────────── */
function _authBack() {
  showScreen(_prevScreen || 'qa');
}

/* ─────────────────────────────────────────────────────────────
   LOGIN SCREEN
───────────────────────────────────────────────────────────── */
function _doLogin() {
  const auth  = _getAuth();
  const email = document.getElementById('login-email')?.value.trim();
  const pass  = document.getElementById('login-pass')?.value;
  const errEl = document.getElementById('login-error');
  if (!auth) { if(errEl) errEl.textContent = 'Firebase not configured.'; return; }
  if (!email || !pass) { if(errEl) errEl.textContent = 'Email and password required.'; return; }
  if(errEl) errEl.textContent = '';

  import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js').then(({ signInWithEmailAndPassword }) => {
    signInWithEmailAndPassword(auth, email, pass)
      .then(() => showScreen('qa'))
      .catch(err => { if(errEl) errEl.textContent = _friendlyAuthError(err.code); });
  });
}

/* ─────────────────────────────────────────────────────────────
   REGISTER SCREEN
───────────────────────────────────────────────────────────── */
async function _doRegister() {
  const auth     = _getAuth();
  const db       = _getDb();
  const username = document.getElementById('reg-username')?.value.trim();
  const email    = document.getElementById('reg-email')?.value.trim();
  const pass     = document.getElementById('reg-pass')?.value;
  const errEl    = document.getElementById('reg-error');
  if(errEl) errEl.textContent = '';

  // Validate username
  if (!username || !email || !pass) { if(errEl) errEl.textContent = 'All fields required.'; return; }
  if (/[\s]/.test(username)) { if(errEl) errEl.textContent = 'Username cannot contain spaces.'; return; }
  if (/\p{Emoji}/u.test(username) && !_isCreator('pending')) {
    if(errEl) errEl.textContent = 'Emoji are not allowed in usernames.'; return;
  }
  if (username.length > 24) { if(errEl) errEl.textContent = 'Username must be 24 characters or fewer.'; return; }

  // Check username uniqueness
  if (db) {
    try {
      const { doc, getDoc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
      const unameSnap = await getDoc(doc(db, 'usernames', username.toLowerCase()));
      if (unameSnap.exists()) { if(errEl) errEl.textContent = 'That username is already taken.'; return; }
    } catch { /* proceed */ }
  }

  import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js').then(({ createUserWithEmailAndPassword, updateProfile }) => {
    createUserWithEmailAndPassword(auth, email, pass)
      .then(async cred => {
        await updateProfile(cred.user, { displayName: username });
        const isCreator = _isCreator(cred.user.uid);
        // Save profile to Firestore
        if (db) {
          const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
          await setDoc(doc(db, 'users', cred.user.uid), {
            username, email, color: 'white', title: '',
            equippedBadges: [], profileFrame: null, avatarFrame: null,
            photoURL: null, postCount: 0,
            isCreator, customCosmetics: isCreator ? Object.keys(COLOR_OPTIONS) : [],
            achievements: { piParadox: false, allKnowing: false, mysterious: false, sigma: false }
          });
          // Reserve username
          await setDoc(doc(db, 'usernames', username.toLowerCase()), { uid: cred.user.uid });
        }
        showScreen('qa');
      })
      .catch(err => { if(errEl) errEl.textContent = _friendlyAuthError(err.code); });
  });
}

function _friendlyAuthError(code) {
  const map = {
    'auth/email-already-in-use': 'That email is already registered.',
    'auth/invalid-email':        'Please enter a valid email address.',
    'auth/weak-password':        'Password must be at least 6 characters.',
    'auth/user-not-found':       'No account found with that email.',
    'auth/wrong-password':       'Incorrect password.',
    'auth/invalid-credential':   'Invalid email or password.',
    'auth/too-many-requests':    'Too many attempts. Please try again later.',
  };
  return map[code] || 'An error occurred. Please try again.';
}

/* ─────────────────────────────────────────────────────────────
   Q&A HUB
───────────────────────────────────────────────────────────── */
function _initQa() {
  const auth = _getAuth();
  const db   = _getDb();
  if (!auth || !db) { _renderQaNoBackend(); return; }
  _refreshQaAuthBar();
  _loadQaSection('inquiries');
  _loadQaSection('suggestions');
}

function _renderQaNoBackend() {
  const bar = document.getElementById('qa-auth-bar');
  if (bar) bar.innerHTML = `<span class="qa-notice">Firebase is not yet configured. See setup instructions in <code>app.js</code>.</span>`;
}

function _refreshQaAuthBar() {
  const label   = document.getElementById('qa-user-label');
  const btnArea = document.getElementById('qa-auth-btns');
  if (!label || !btnArea) return;

  if (_currentUser && _currentProfile) {
    const isCreator = _isCreator(_currentUser.uid);
    const color     = _getEffectiveColor(_currentProfile);
    const milestone = _computeUnlockedMilestone(_currentProfile.postCount || 0);
    const titleStr  = isCreator ? '<span class="qa-tag-creator">Creator</span>' :
                     (milestone ? `<span class="qa-tag-title">${milestone.title}</span>` : '');
    label.innerHTML = `<span style="color:${color};font-weight:500;">${_escHtml(_currentProfile.username || _currentUser.displayName || 'User')}</span> ${titleStr}`;
    btnArea.innerHTML = `<button class="btn btn-ghost qa-btn-sm" onclick="_qaSignOut()">Sign Out</button>`;
  } else {
    label.textContent = 'Browsing as guest';
    btnArea.innerHTML = `
      <button class="btn btn-ghost qa-btn-sm" onclick="_setAuthBack();showScreen('login')">Sign In</button>
      <button class="btn btn-primary qa-btn-sm" onclick="_setAuthBack();showScreen('register')">Create Account</button>
    `;
  }

  // Post buttons
  ['inquiries','suggestions'].forEach(sec => {
    const authed = document.getElementById(`qa-post-btn-${sec}`);
    const guest  = document.getElementById(`qa-post-guest-${sec}`);
    if (authed) authed.style.display = _currentUser ? 'inline-flex' : 'none';
    if (guest)  guest.style.display  = _currentUser ? 'none' : 'inline-flex';
  });
}

function _setAuthBack() { _prevScreen = 'qa'; }

function _qaSignOut() {
  const auth = _getAuth();
  if (auth) auth.signOut().then(() => showScreen('qa'));
}

function showQaTab(section) {
  _currentSection = section;
  document.getElementById('qa-panel-inquiries').style.display   = section === 'inquiries'  ? '' : 'none';
  document.getElementById('qa-panel-suggestions').style.display  = section === 'suggestions' ? '' : 'none';
  document.getElementById('qa-tab-inquiries').classList.toggle('active',  section === 'inquiries');
  document.getElementById('qa-tab-suggestions').classList.toggle('active', section === 'suggestions');
}

/* ─────────────────────────────────────────────────────────────
   LOAD POSTS
───────────────────────────────────────────────────────────── */
function _loadQaSection(section) {
  const db = _getDb();
  if (!db) return;
  if (_qaUnsubs[section]) _qaUnsubs[section]();

  const listEl = document.getElementById(`qa-thread-list-${section}`);
  if (!listEl) return;
  listEl.innerHTML = `<div class="qa-loading">Loading…</div>`;

  import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js')
    .then(({ collection, query, orderBy, onSnapshot }) => {
      const q = query(collection(db, section), orderBy('createdAt', 'desc'));
      _qaUnsubs[section] = onSnapshot(q, snapshot => {
        if (snapshot.empty) { listEl.innerHTML = `<div class="qa-empty">No posts yet. Be the first.</div>`; return; }
        listEl.innerHTML = '';
        snapshot.forEach(d => listEl.appendChild(_buildThread(d.id, d.data(), section)));
      }, err => { listEl.innerHTML = `<div class="qa-error">Could not load posts: ${err.message}</div>`; });
    });
}

/* ─────────────────────────────────────────────────────────────
   BUILD THREAD CARD
───────────────────────────────────────────────────────────── */
function _buildThread(id, data, section) {
  const div = document.createElement('div');
  div.className = 'qa-thread';
  div.id = `thread-${id}`;

  const isCreatorPost = _isCreator(data.authorUid);
  const authorColor   = isCreatorPost ? '#9b59b6' : (data.authorColor || COLOR_OPTIONS.white.value);
  const creatorTag    = isCreatorPost ? `<span class="qa-tag-creator">Creator</span>` : '';
  const titleTag      = data.authorTitle ? `<span class="qa-tag-title">${_escHtml(data.authorTitle)}</span>` : '';
  const badges        = (data.authorBadges || []).map(b => `<span class="qa-badge">${_escHtml(b)}</span>`).join('');

  const dt = data.createdAt ? _formatDatetime(data.createdAt.seconds * 1000) : '';

  const canDelete = _currentUser && (_isCreator(_currentUser.uid) || _currentUser.uid === data.authorUid);
  const deleteBtn = canDelete ? `<button class="qa-delete-btn" onclick="_deletePost('${id}','${section}')" title="Delete post">✕</button>` : '';

  const upvoteCount = (data.upvotes || []).length;
  const hasUpvoted  = _currentUser && (data.upvotes || []).includes(_currentUser.uid);
  const upvoteBtn   = `<button class="qa-upvote-btn ${hasUpvoted ? 'qa-upvoted' : ''}" onclick="_toggleUpvote('${id}','${section}')">▲ ${upvoteCount}</button>`;

  const repliesHtml = (data.replies || []).map(r => _buildReplyHtml(r, id, section)).join('');

  const replyArea = _currentUser
    ? `<div class="qa-reply-form">
         <input class="qa-reply-input" id="reply-input-${id}" placeholder="Write a reply…"/>
         <button class="btn btn-ghost qa-btn-sm" onclick="_submitReply('${id}','${section}')">Reply</button>
       </div>`
    : `<div class="qa-sign-in-prompt"><a onclick="_setAuthBack();showScreen('login')">Sign in to reply</a></div>`;

  div.innerHTML = `
    <div class="qa-thread-top">
      <div class="qa-thread-author">
        <span class="qa-author-name" style="color:${authorColor};">${_escHtml(data.authorName || 'Unknown')}</span>
        ${creatorTag}${titleTag}${badges}
      </div>
      <div class="qa-thread-actions">${upvoteBtn}${deleteBtn}</div>
    </div>
    <div class="qa-thread-title">${_escHtml(data.title)}</div>
    <div class="qa-thread-body">${_escHtml(data.body)}</div>
    <div class="qa-thread-datetime">${dt}</div>
    <div class="qa-replies-list" id="replies-${id}">${repliesHtml}</div>
    ${replyArea}
  `;
  return div;
}

function _buildReplyHtml(r, postId, section) {
  const isCreatorReply = _isCreator(r.authorUid);
  const color          = isCreatorReply ? '#9b59b6' : (r.authorColor || COLOR_OPTIONS.white.value);
  const creatorTag     = isCreatorReply ? `<span class="qa-tag-creator">Creator</span>` : '';
  const titleTag       = r.authorTitle ? `<span class="qa-tag-title">${_escHtml(r.authorTitle)}</span>` : '';
  const badges         = (r.authorBadges || []).map(b => `<span class="qa-badge">${_escHtml(b)}</span>`).join('');
  const dt             = r.createdAt ? _formatDatetime(new Date(r.createdAt).getTime()) : '';
  const canDel         = _currentUser && (_isCreator(_currentUser.uid) || _currentUser.uid === r.authorUid);
  const delBtn         = canDel ? `<button class="qa-delete-btn qa-delete-reply-btn" onclick="_deleteReply('${postId}','${section}',this)" data-uid="${_escHtml(r.authorUid)}" data-body="${_escHtml(r.body)}">✕</button>` : '';

  return `
    <div class="qa-reply">
      <div class="qa-reply-header">
        <span class="qa-author-name" style="color:${color};">${_escHtml(r.authorName || 'Unknown')}</span>
        ${creatorTag}${titleTag}${badges}
        <span class="qa-reply-datetime">${dt}</span>
        ${delBtn}
      </div>
      <div class="qa-reply-body">${_escHtml(r.body)}</div>
    </div>
  `;
}

function _formatDatetime(ms) {
  const d = new Date(ms);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    + ' at '
    + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/* ─────────────────────────────────────────────────────────────
   POST COMPOSER SCREEN
───────────────────────────────────────────────────────────── */
function _requireAuthToPost(section) {
  if (!_currentUser) { _prevScreen = 'qa'; showScreen('register'); return; }
  _composerSection = section;
  const eyebrow = document.getElementById('composer-eyebrow');
  const title   = document.getElementById('composer-title');
  const input   = document.getElementById('composer-title-input');
  const body    = document.getElementById('composer-body');
  const err     = document.getElementById('composer-error');
  if (eyebrow) eyebrow.textContent = section === 'inquiries' ? 'Inquiries' : 'Suggestions';
  if (title)   title.textContent   = section === 'inquiries' ? 'Post a Question' : 'Post a Suggestion';
  if (input)   input.value = '';
  if (body)    body.value  = '';
  if (err)     err.textContent = '';
  showScreen('post-composer');
}

function _submitPost() {
  if (!_currentUser) { showScreen('login'); return; }
  const db    = _getDb();
  const title = document.getElementById('composer-title-input')?.value.trim();
  const body  = document.getElementById('composer-body')?.value.trim();
  const errEl = document.getElementById('composer-error');
  if (!title || !body) { if(errEl) errEl.textContent = 'Please fill in both fields.'; return; }
  if (!db) { if(errEl) errEl.textContent = 'Firebase not configured.'; return; }

  const now  = new Date();
  const hour = now.getHours(), min = now.getMinutes();
  const isPiTime = (hour === 3 || hour === 15) && min === 14;

  import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js').then(async ({ collection, addDoc, serverTimestamp, doc, updateDoc, increment }) => {
    const profile  = _currentProfile || {};
    const isCreator = _isCreator(_currentUser.uid);
    const milestone = _computeUnlockedMilestone((profile.postCount || 0) + 1);

    // Check sigma achievement
    const hasSigma = /sigma|σ/i.test(body);

    // Check mysterious achievement
    const isMystery = document.getElementById('mysteries')?.classList.contains('active') || false;

    await addDoc(collection(db, _composerSection), {
      title, body,
      authorUid:    _currentUser.uid,
      authorName:   profile.username || _currentUser.displayName || 'User',
      authorColor:  isCreator ? 'purple' : (profile.color || 'white'),
      authorTitle:  isCreator ? '' : (milestone?.title || profile.title || ''),
      authorBadges: profile.equippedBadges || [],
      createdAt:    serverTimestamp(),
      upvotes:      [],
      replies:      [],
      section:      _composerSection
    });

    // Increment post count
    const newCount = (profile.postCount || 0) + 1;
    const updates  = { postCount: increment(1) };
    if (isPiTime && !profile.achievements?.piParadox) { updates['achievements.piParadox'] = true; }
    if (hasSigma  && !profile.achievements?.sigma)    { updates['achievements.sigma']    = true; }
    if (isMystery && !profile.achievements?.mysterious){ updates['achievements.mysterious'] = true; }
    if (milestone) { updates.title = milestone.title; }
    if (milestone?.color  && !_isCreator(_currentUser.uid)) { updates.color = milestone.color; }
    if (milestone?.badge  && !(profile.equippedBadges||[]).includes(milestone.badge)) {
      updates.equippedBadges = [...(profile.equippedBadges||[]), milestone.badge];
    }
    await updateDoc(doc(db, 'users', _currentUser.uid), updates);
    _currentProfile = await _loadProfile(_currentUser.uid);

    showScreen('qa');
  }).catch(err => { const errEl = document.getElementById('composer-error'); if(errEl) errEl.textContent = err.message; });
}

/* ─────────────────────────────────────────────────────────────
   SUBMIT REPLY
───────────────────────────────────────────────────────────── */
function _submitReply(docId, section) {
  if (!_currentUser) { _prevScreen = 'qa'; showScreen('login'); return; }
  const db    = _getDb();
  const input = document.getElementById(`reply-input-${docId}`);
  const body  = input?.value.trim();
  if (!body || !db) return;

  const profile   = _currentProfile || {};
  const isCreator = _isCreator(_currentUser.uid);
  const milestone = _computeUnlockedMilestone(profile.postCount || 0);
  const hasSigma  = /sigma|σ/i.test(body);

  import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js').then(async ({ doc, updateDoc, arrayUnion, increment }) => {
    await updateDoc(doc(db, section, docId), {
      replies: arrayUnion({
        body,
        authorUid:    _currentUser.uid,
        authorName:   profile.username || _currentUser.displayName || 'User',
        authorColor:  isCreator ? 'purple' : (profile.color || 'white'),
        authorTitle:  isCreator ? '' : (milestone?.title || profile.title || ''),
        authorBadges: profile.equippedBadges || [],
        createdAt:    new Date().toISOString()
      })
    });
    if (hasSigma && !profile.achievements?.sigma) {
      await updateDoc(doc(db, 'users', _currentUser.uid), { 'achievements.sigma': true });
      _currentProfile = await _loadProfile(_currentUser.uid);
    }
    if (input) input.value = '';
  }).catch(console.error);
}

/* ─────────────────────────────────────────────────────────────
   UPVOTES
───────────────────────────────────────────────────────────── */
function _toggleUpvote(docId, section) {
  if (!_currentUser) { _prevScreen = 'qa'; showScreen('login'); return; }
  const db = _getDb();
  if (!db) return;
  import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js').then(async ({ doc, getDoc, updateDoc, arrayUnion, arrayRemove }) => {
    const ref  = doc(db, section, docId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const upvotes = snap.data().upvotes || [];
    if (upvotes.includes(_currentUser.uid)) {
      await updateDoc(ref, { upvotes: arrayRemove(_currentUser.uid) });
    } else {
      await updateDoc(ref, { upvotes: arrayUnion(_currentUser.uid) });
      // Check "Worthy Opinion" — 10+ upvotes
      if (snap.data().authorUid === _currentUser.uid && upvotes.length + 1 >= 10) {
        await updateDoc(doc(db, 'users', _currentUser.uid), { title: 'Worthy Opinion' });
      }
    }
  }).catch(console.error);
}

/* ─────────────────────────────────────────────────────────────
   DELETE
───────────────────────────────────────────────────────────── */
function _deletePost(docId, section) {
  if (!_currentUser) return;
  if (!_isCreator(_currentUser.uid)) {
    // Confirm own post delete
    if (!confirm('Delete your post?')) return;
  }
  const db = _getDb();
  if (!db) return;
  import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js').then(({ doc, deleteDoc }) => {
    deleteDoc(doc(db, section, docId));
  });
}

function _deleteReply(postDocId, section, btn) {
  if (!_currentUser) return;
  const authorUid = btn.getAttribute('data-uid');
  const body      = btn.getAttribute('data-body');
  if (!_isCreator(_currentUser.uid) && authorUid !== _currentUser.uid) return;
  if (!confirm('Delete this reply?')) return;
  const db = _getDb();
  if (!db) return;
  import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js').then(async ({ doc, getDoc, updateDoc }) => {
    const ref  = doc(db, section, postDocId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const replies = (snap.data().replies || []).filter(r =>
      !(r.authorUid === authorUid && r.body === body)
    );
    await updateDoc(ref, { replies });
  });
}

/* ─────────────────────────────────────────────────────────────
   PROFILE SCREEN
───────────────────────────────────────────────────────────── */
async function _renderProfile() {
  const el = document.getElementById('profile-content');
  if (!el) return;
  if (!_currentUser) { el.innerHTML = `<div class="qa-empty">You must be signed in to view your profile.</div>`; return; }
  el.innerHTML = `<div class="qa-loading">Loading profile…</div>`;

  const profile   = _currentProfile || await _loadProfile(_currentUser.uid);
  if (!profile) { el.innerHTML = `<div class="qa-error">Profile not found.</div>`; return; }

  const uid        = _currentUser.uid;
  const isCreator  = _isCreator(uid);
  const postCount  = profile.postCount || 0;
  const milestone  = _computeUnlockedMilestone(postCount);
  const color      = _getEffectiveColor(profile);

  // Build milestone rows
  const milestonesHtml = MILESTONES.map(m => {
    const unlocked = postCount >= m.posts || isCreator;
    return `
      <div class="profile-milestone ${unlocked ? 'unlocked' : 'locked'}">
        <div class="profile-milestone-posts">${m.posts} posts</div>
        <div class="profile-milestone-title">${_escHtml(m.title)}</div>
        <div class="profile-milestone-perks">
          ${m.color  ? `<span class="profile-perk-chip">${m.color} text</span>` : ''}
          ${m.badge  ? `<span class="profile-perk-chip">Badge: ${m.badge}</span>` : ''}
          ${m.frame  ? `<span class="profile-perk-chip">${m.frame} frame</span>` : ''}
          ${m.avatarFrame ? `<span class="profile-perk-chip">${m.avatarFrame} avatar ring</span>` : ''}
        </div>
      </div>`;
  }).join('');

  // Build secret achievements
  const secretHtml = Object.entries(SECRET_ACHIEVEMENTS).map(([key, ach]) => {
    const earned = profile.achievements?.[key] || isCreator;
    return `
      <div class="profile-achievement ${earned ? 'unlocked' : 'locked'}">
        <div class="profile-achievement-badge">${_escHtml(ach.badge)}</div>
        <div class="profile-achievement-label">${_escHtml(ach.label)}</div>
        ${!earned ? `<div class="profile-achievement-secret">Secret — criteria hidden</div>` : ''}
      </div>`;
  }).join('');

  // Color picker (only show unlocked colors)
  const colorOptions = Object.entries(COLOR_OPTIONS).map(([key, opt]) => {
    const canUse = _canUseColor(key, {...profile, uid});
    return `<button class="profile-color-swatch ${canUse ? '' : 'locked-swatch'} ${profile.color === key ? 'selected-swatch' : ''}"
      style="background:${opt.value};" title="${opt.label}"
      ${canUse ? `onclick="_setColor('${key}')"` : 'disabled'}></button>`;
  }).join('');

  el.innerHTML = `
    <div class="profile-wrap">
      <div class="profile-header">
        <div class="profile-avatar" style="color:${color};border-color:${color};">${(_escHtml(profile.username||'?'))[0].toUpperCase()}</div>
        <div class="profile-header-info">
          <div class="profile-username" style="color:${color};">${_escHtml(profile.username || 'User')}
            ${isCreator ? `<span class="qa-tag-creator">Creator</span>` : ''}
          </div>
          <div class="profile-meta">${postCount} posts · ${milestone ? `<span class="qa-tag-title">${milestone.title}</span>` : 'No rank yet'}</div>
          <div class="profile-badges">${(profile.equippedBadges || []).map(b => `<span class="qa-badge">${b}</span>`).join('')}</div>
        </div>
      </div>

      <div class="profile-section-heading">Customize</div>
      <div class="profile-card">
        <div class="profile-field-label">Username</div>
        <div class="profile-field-row">
          <input class="auth-input profile-username-input" id="profile-username-input" value="${_escHtml(profile.username||'')}" placeholder="Username"/>
          <button class="btn btn-outline profile-save-btn" onclick="_saveUsername()">Save</button>
        </div>
        <div class="profile-error" id="profile-username-error"></div>

        <div class="profile-field-label" style="margin-top:1.2rem;">Comment Color</div>
        <div class="profile-color-row">${colorOptions}</div>
        <div class="profile-field-hint">Colors unlock at milestone post counts.</div>
      </div>

      <div class="profile-section-heading">Milestones</div>
      <div class="profile-milestones">${milestonesHtml}</div>

      <div class="profile-section-heading">Achievements</div>
      <div class="profile-achievements-grid">${secretHtml}</div>

      <div style="margin-top:2rem;">
        <button class="btn btn-ghost" onclick="_qaSignOut()">Sign Out</button>
      </div>
    </div>
  `;
}

async function _saveUsername() {
  const input  = document.getElementById('profile-username-input');
  const errEl  = document.getElementById('profile-username-error');
  const newName = input?.value.trim();
  if(errEl) errEl.textContent = '';
  if (!newName) { if(errEl) errEl.textContent = 'Username cannot be empty.'; return; }
  if (/[\s]/.test(newName)) { if(errEl) errEl.textContent = 'No spaces allowed.'; return; }

  const isCreator = _isCreator(_currentUser.uid);
  if (!isCreator && /\p{Emoji}/u.test(newName)) { if(errEl) errEl.textContent = 'Emoji not allowed.'; return; }
  if (newName.length > 24) { if(errEl) errEl.textContent = 'Max 24 characters.'; return; }

  const db = _getDb();
  if (!db) return;
  const { doc, getDoc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

  // Check uniqueness (skip if same as current)
  if (newName.toLowerCase() !== (_currentProfile?.username || '').toLowerCase()) {
    const snap = await getDoc(doc(db, 'usernames', newName.toLowerCase()));
    if (snap.exists()) { if(errEl) errEl.textContent = 'That username is taken.'; return; }
    // Release old username
    const { deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    if (_currentProfile?.username) {
      try { await deleteDoc(doc(db, 'usernames', _currentProfile.username.toLowerCase())); } catch{}
    }
    await setDoc(doc(db, 'usernames', newName.toLowerCase()), { uid: _currentUser.uid });
  }

  await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js').then(({ updateProfile }) =>
    updateProfile(_currentUser, { displayName: newName })
  );
  await setDoc(doc(db, 'users', _currentUser.uid), { username: newName }, { merge: true });
  _currentProfile = await _loadProfile(_currentUser.uid);
  if(errEl) errEl.textContent = '';
  _renderProfile();
}

async function _setColor(colorKey) {
  if (!_currentUser) return;
  const db = _getDb();
  if (!db) return;
  const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
  await setDoc(doc(db, 'users', _currentUser.uid), { color: colorKey }, { merge: true });
  _currentProfile = await _loadProfile(_currentUser.uid);
  _renderProfile();
}

/* ─────────────────────────────────────────────────────────────
   "ALL KNOWING" ACHIEVEMENT — triggered when all units complete
   Call this from your unit-complete logic.
───────────────────────────────────────────────────────────── */
async function _checkAllKnowing() {
  // Call this when a user completes the final unit.
  // If not logged in, cache the flag in localStorage to apply on next login.
  if (!_currentUser) {
    try { localStorage.setItem('nts_all_knowing_pending', '1'); } catch{}
    return;
  }
  const db = _getDb();
  if (!db || _currentProfile?.achievements?.allKnowing) return;
  const { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
  await updateDoc(doc(db, 'users', _currentUser.uid), { 'achievements.allKnowing': true });
  _currentProfile = await _loadProfile(_currentUser.uid);
}

function _checkCachedAllKnowing(uid) {
  try {
    if (localStorage.getItem('nts_all_knowing_pending') === '1') {
      localStorage.removeItem('nts_all_knowing_pending');
      _checkAllKnowing();
    }
  } catch{}
}

/* ─────────────────────────────────────────────────────────────
   UTILITY
───────────────────────────────────────────────────────────── */
function _escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
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
  showScreen('home');
  renderUnitCards();
  _maybeShowWelcome();
  _renderCard();

  // Boot Firebase auth listener as early as possible
  // (waits for window._firebaseAuth to be set by the SDK module script)
  if (window._firebaseAuth) {
    _bootAuth();
  } else {
    // SDK may not be ready yet — retry once it loads
    window.addEventListener('firebase-ready', _bootAuth, { once: true });
    setTimeout(_bootAuth, 1500); // fallback
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeLightbox();
      const modal = document.getElementById('help-modal');
      if (modal && modal.classList.contains('open')) toggleHelp();
    }
  });

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
