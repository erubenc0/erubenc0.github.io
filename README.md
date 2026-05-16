# The Number Theory Scrapbook — Editor's Guide

## File Overview

```
number-theory-scrapbook/
├── index.html      All screens and HTML structure
├── style.css       All visual styling
├── app.js          All JavaScript: navigation, content loading, flashcards, tests, progress
├── paper.pdf       ADD YOUR OWN — research paper shown in the "More" screen
├── gauss.jpg       ADD YOUR OWN — portrait of Gauss (used on Home + Founder screen)
├── fermat.jpg      ADD YOUR OWN — portrait of Fermat
├── euler.jpg       ADD YOUR OWN — portrait of Euler
├── riemann.jpg     ADD YOUR OWN — portrait of Riemann
└── README.md       This file
```

---

## Deploying to GitHub Pages

1. Push this entire folder to a GitHub repository.
2. Go to **Settings → Pages → Source → Deploy from branch → main / root**.
3. Your site will be live at `https://yourusername.github.io/repo-name/`.

No build tools required. Plain HTML, CSS, and JavaScript.

---

## How to Edit Content

### 1. Home Page — Overview Sections
Open `index.html`. Find the three `.overview-block` divs. Replace the inner `.ph` div with your text:
```html
<!-- Before -->
<div class="ph">[ Your content goes here ]</div>

<!-- After -->
<p>Number theory is the study of the integers...</p>
```

To add your images to the right column, replace the `.overview-img` div:
```html
<!-- Before -->
<div class="overview-img">[ Image placeholder ]</div>

<!-- After -->
<div class="overview-img"><img src="your-image.jpg" alt="description"></div>
```

---

### 2. Portrait Images (Founding Fathers)
Wikipedia hotlinking is blocked by browsers. Download the four portraits locally:
- Save as `gauss.jpg`, `fermat.jpg`, `euler.jpg`, `riemann.jpg` in the project folder.
- The `<img src="...">` tags already point to these filenames — no code change needed.
- The styled monogram letter (G, F, E, R) shows as a fallback until the files are present.

---

### 3. Founder Detail Pages
In `app.js`, find the `FOUNDERS` object. Fill in each founder's content:
```js
gauss: {
  name: 'Carl Friedrich Gauss', years: '1777 – 1855', imgSrc: 'gauss.jpg',
  backstory:   'Your backstory text here.',
  discoveries: 'Your discoveries text here.',
  impact:      'Your impact text here.',
  legacy:      'Your legacy text here.',
},
```

---

### 4. Unit 0 — History and Philosophy
Open `index.html`. Find the `<div id="unit0-content">` section inside `#unit0-panel`.
Replace the inner `.latex-block` div with your text. You can use LaTeX math:
```html
<div id="unit0-content">
  <p style="font-family:'Inter',sans-serif;font-size:.88rem;line-height:1.85;color:rgba(255,255,255,0.62);">
    Your historical text goes here. Use $a \mid b$ for inline math.
  </p>
</div>
```

---

### 5. Unit Cards — Descriptions
In `app.js`, find the `UNITS` array. Edit the `desc` field for each unit:
```js
{ idx: 0, name: 'Unit 1', title: 'The Foundations of Integers',
  desc: 'Your description of Unit 1 here.',
  topics: [ ... ]
}
```

---

### 6. Topic Content (Theory, Visualization, My Intuition, Strategy, Practice, Relevance)
In `app.js`, find the `_loadTopicContent()` function. Scroll to the section marked:
```
// ADD YOUR CONTENT PER TOPIC HERE
```
Add an `if` block for each topic id:
```js
if (topic.id === 'pythagorean') {
  theory = `<div class="latex-block">
    A Pythagorean triple $(a,b,c)$ satisfies $$a^2 + b^2 = c^2$$
    where $a,b,c$ are positive integers.
  </div>`;

  viz = `<img src="pythagorean-diagram.jpg" style="width:100%;border-radius:6px;">`;

  intuition = `
    <div class="intuition-block">
      <div class="intuition-label">My Interpretation</div>
      <div class="intuition-text">I think of Pythagorean triples as...</div>
    </div>
    <div class="intuition-block" style="margin-top:1rem;">
      <div class="intuition-label">Personal Notes</div>
      <div class="intuition-note-area">
        <img src="notes-pythagorean.jpg" style="width:100%;border-radius:4px;">
      </div>
    </div>
  `;

  steps = `
    <div class="step-block">
      <div class="step-label">Step 1</div>
      <div class="step-content">Set $m > n > 0$ with $\gcd(m,n) = 1$ and $m \not\equiv n \pmod{2}$.</div>
    </div>
    <div class="step-block">
      <div class="step-label">Step 2</div>
      <div class="step-content">Then $a = m^2 - n^2$, $b = 2mn$, $c = m^2 + n^2$ is a primitive triple.</div>
    </div>
  `;

  problems = `
    <div class="problem-wrap">
      <div class="problem-q">Problem 1: Find all primitive triples with $c < 20$.</div>
      <input class="problem-input" type="text" placeholder="Your answer…"/>
      <button class="problem-answer-toggle" onclick="toggleAnswer(this)">Show Answer</button>
      <div class="problem-answer-reveal">$(3,4,5)$, $(5,12,13)$, $(8,15,17)$</div>
    </div>
  `;

  app = `
    <div class="app-block">
      <h4>Architecture</h4>
      <p>Used since ancient Egypt to construct right angles in buildings.</p>
    </div>
    <span class="app-tag">Architecture</span>
    <span class="app-tag">Surveying</span>
  `;
}
```
You can use `$...$` for inline math and `$$...$$` for display math anywhere in these strings.

---

### 7. Topic Intro Images
Each topic intro screen has an image slot. To add your image, find the intro html in `_showTopicIntro()` in `app.js`:
```js
document.getElementById('topic-intro-content').innerHTML = `
  <div class="topic-intro-eyebrow">...</div>
  <h1 class="topic-intro-heading">...</h1>
  <div class="topic-intro-img">
    <img src="topic-pythagorean.jpg" alt="Pythagorean Triples">
  </div>
`;
```
Replace the placeholder `div` with an `<img>` tag pointing to your file.

---

### 8. Adding More Topics to a Unit
In `app.js`, add a new entry to the relevant unit's `topics` array:
```js
{ id: 'my-new-topic', num: '1.5', name: 'My New Topic', discoverer: 'Name (Year)' },
```
Then add an `if (topic.id === 'my-new-topic') { ... }` block in `_loadTopicContent()`.

---

### 9. Unit Test Questions
In `app.js`, find the `UNIT_TESTS` object. Add your questions for each unit:
```js
0: [ // Unit 1 (index 0 in UNITS array)
  { q: 'Find $\\gcd(48, 18)$ using the Euclidean Algorithm.', answer: '6' },
  { q: 'State the Division Algorithm.', answer: '' },  // '' = manually graded
],
```
- If `answer` is non-empty, answers are auto-checked (case-insensitive, trimmed).
- If `answer` is `''`, the question is marked "Manually graded" in Feedback.

---

### 10. Flashcard Glossary
In `app.js`, find the `FLASHCARDS` array. Fill in the `def` field for each card:
```js
{ unit:'Unit 1 — Foundations', term:'Divisibility',
  def: 'We say $a$ divides $b$, written $a \\mid b$, if there exists an integer $k$ such that $b = ak$.',
  latex: '$a \\mid b$',
  cat: 'foundations' },
```
To add a new card, copy any entry and append it. Set `cat` to one of:
`foundations` | `congruences` | `functions` | `primes` | `advanced`

---

### 11. Mysteries Gallery
In `index.html`, edit the three `.mystery-frame` cards (name, year, description).
In `app.js`, edit the `MYSTERIES` array (title and proposer shown in panel headers).
To add content to each mystery's 4 panels, find the `// ── Mystery content` section in `openMystery()` and add your `if (idx === 0) { ... }` blocks.

---

### 12. Proofs Section
Open `index.html`. Find `#proofs`.
- **My Proofs tab**: edit the `.proof-card` blocks. Replace `.proof-body` text with your proof writeup. Replace `.proof-img-slot` divs with `<img>` tags.
- **Mistakes tab**: edit the `.mistake-card` blocks. Replace text in `.intuition-text.ph` with your explanations. Replace `.proof-img-slot` divs with `<img>` tags.

To add another proof or mistake, copy the relevant block and paste it below, then update the content.

---

### 13. Research Paper
1. Place your PDF in the project folder as `paper.pdf`.
2. In `index.html`, find the `#more` section. Delete the `.pdf-viewer-area` block that contains `.pdf-ph`.
3. Uncomment the `<iframe>` block directly below it:
```html
<div class="pdf-viewer-area">
  <iframe src="paper.pdf" title="Research Paper"></iframe>
</div>
```

---

### 14. About Page
In `index.html`, find `#about`. Fill in:
- `.about-name` — your name
- `.about-role` — your title / year / school
- `.about-email` — your email address
- The `.ph` placeholder divs in `.about-main`
- Notebook images: replace each `.notebook-page` div with `<img src="pageN.jpg">`

---

## KaTeX Math Rendering

Use standard LaTeX delimiters anywhere in HTML or injected content:
- **Inline:** `$a \equiv b \pmod{n}$`
- **Display:** `$$\zeta(s) = \sum_{n=1}^{\infty} \frac{1}{n^s}$$`

KaTeX re-renders automatically on every screen transition.
When writing LaTeX inside JavaScript template literals, escape backslashes: `\\frac`, `\\pmod`, `\\mathbb{Z}`.

---

## Progress and Test Data

Progress and test scores are saved to the browser's `localStorage` under two keys:
- `nts_progress` — `{ unitIndex: topicIndex }` — last topic reached per unit
- `nts_tests` — `{ unitIndex: { score, total, answers } }` — test results

This data persists between sessions in the same browser. It is **not** shared across devices.
To reset all progress and scores, run this in the browser console:
```js
localStorage.removeItem('nts_progress');
localStorage.removeItem('nts_tests');
location.reload();
```

---

## Adding a New Screen

1. Add a `<section class="screen" id="my-screen">` block in `index.html`.
2. Add `'my-screen'` to the `ALL_SCREENS` array in `app.js`.
3. Add `'my-screen': 'nav-link-id'` to `NAV_MAP` in `app.js`.
4. Call `showScreen('my-screen')` from any button or link.
