# The Number Theory Scrapbook

A personal, single-page web application for presenting an independent study of elementary number theory. The site combines structured learning units, handwritten notebook documentation, unsolved mystery exhibits, and a curated archive — built entirely in vanilla HTML, CSS, and JavaScript.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Site Architecture](#site-architecture)
- [Adding Your Content](#adding-your-content)
  - [Units and Topics](#units-and-topics)
  - [Flashcard Glossary](#flashcard-glossary)
  - [Founders](#founders)
  - [Proofs](#proofs)
  - [Unsolved Mysteries](#unsolved-mysteries)
  - [Archive & Exhibition Hall](#archive--exhibition-hall)
  - [References](#references)
  - [About](#about)
  - [Welcome Modal](#welcome-modal)
- [Navigation](#navigation)
- [Mathematics Rendering](#mathematics-rendering)
- [Local Storage](#local-storage)
- [Deep Linking into the Archive](#deep-linking-into-the-archive)
- [Images](#images)
- [Extending the Site](#extending-the-site)

---

## Project Structure

```
project/
├── index.html       # All screens and markup
├── app.js           # All logic, data, and screen transitions
├── style.css        # All styling and design tokens
├── README.md        # This file
└── [your images]    # Place all image files in this same folder
```

There is no build step. Open `index.html` directly in a browser, or serve the folder with any static file server.

---

## Getting Started

1. Clone or download the project folder.
2. Place your image files in the same directory as `index.html`.
3. Open `index.html` in a browser — no installation required.

To serve locally (optional, avoids certain browser image restrictions):

```bash
# Python 3
python3 -m http.server 8080

# Node.js (if npx is available)
npx serve .
```

Then visit `http://localhost:8080`.

---

## Site Architecture

The site is a **single-page application (SPA)**. Only one `<section>` is visible at a time, controlled by the `showScreen(id)` function in `app.js`. Every screen has a corresponding `id` attribute in `index.html`.

### Screen Registry

All valid screen IDs are listed in the `ALL_SCREENS` array at the top of `app.js`. Every new screen you add must be registered there.

```js
const ALL_SCREENS = [
  'home', 'founder-detail',
  'learn', 'unit-title', 'topic-intro', ...
];
```

### Navigating Between Screens

```js
showScreen('screenId');              // navigate to a screen
showScreen('archive', 'exhibit-id'); // navigate to archive and highlight a specific exhibit
```

### Nav Highlighting

The `NAV_MAP` object in `app.js` maps each screen ID to the nav link that should be highlighted when that screen is active. If you add a new top-level screen, add an entry here.

---

## Adding Your Content

### Units and Topics

Unit and topic metadata lives in the `UNITS` array in `app.js`. Each unit object has the following shape:

```js
{
  idx: 0,               // zero-based index; must match position in array
  name: 'Unit 1',       // short label shown in cards and headers
  title: 'Unit 1',      // longer title shown on the unit title screen
  desc: '...',          // description shown on the unit card in the syllabus
  topics: [
    { id: 'topic-1-1', num: '1.1', name: 'Topic 1.1', discoverer: '' },
    ...
  ]
}
```

**Topic content** (theory, visualization, intuition, steps, problems, relevance) is populated inside `_loadTopicContent(id)` in `app.js`. Locate that function and find the `switch` or `if` block matching the topic `id`, then set each section's `innerHTML`. Use `$...$` for inline LaTeX and `$$...$$` for display math.

---

### Flashcard Glossary

Flashcards are defined in the `FLASHCARDS` array in `app.js`. Each card has this shape:

```js
{
  unit:      'Unit 1',          // label shown at the top of the front face
  term:      'Term 1.1',        // bold term on the front face
  latex:     '$a \\mid b$',     // optional LaTeX formula shown on the back; use '' to omit
  cat:       'unit-1',          // category string (currently unused for filtering)
  formal:    '...',             // Formal Definition section on the back
  intuition: '...',             // Intuitive Translation section on the back
  example:   '...',             // Sandbox Example section on the back
}
```

To add a card, append a new object to the array. To reorder cards, reorder the objects. The counter and progress bar update automatically.

---

### Founders

The four founder portrait cards on the Home screen call `openFounder(key)` on click. The keys are `'gauss'`, `'fermat'`, `'euler'`, and `'riemann'`. Content for each founder is set inside the `openFounder()` function in `app.js` — locate the matching `case` block and set the `innerHTML` of these elements:

| Element ID               | Content                          |
|--------------------------|----------------------------------|
| `founder-name`           | Full name                        |
| `founder-years`          | Birth and death years            |
| `founder-backstory`      | Backstory paragraph(s)           |
| `founder-discoveries`    | Key discoveries                  |
| `founder-impact`         | Overall impact                   |
| `founder-legacy`         | Legacy and influence             |

For the portrait image, set `src` on the `#founder-img` element and call `.style.display = 'block'` on it (it is hidden by default until a valid image loads).

---

### Proofs

Proof content lives directly in `index.html` inside `#proofs`. There are two tabs — **My Proofs** and **Mistakes and Corrections** — toggled by `showProofTab()`.

**To edit a proof**, locate the relevant `.proof-card` block and update:
- `.proof-card-title` — theorem name
- First `.proof-body` — written explanation
- Second `.proof-body` — full proof writeup (LaTeX renders automatically)
- `.proof-img-slot` elements — replace each with `<img src="your-file.jpg">`

**To add a proof**, copy an entire `.proof-card` block and paste it before the closing `</div>` of `#proofs-tab-proofs`.

**To edit a mistake**, locate the relevant `.mistake-card` block and update the title, image slots, and explanation text in each `.mistake-two-col` column.

---

### Unsolved Mysteries

Mystery gallery cards are in `index.html` inside `.mystery-grid`. Each card calls `openMystery(index)` on click.

The detail content for each mystery (conjecture, visualization, known results, relevance) is set inside `openMystery(idx)` in `app.js`. Locate the matching index and set the `innerHTML` of:

| Element ID    | Screen              | Content                        |
|---------------|---------------------|--------------------------------|
| `mc-content`  | The Conjecture      | Formal LaTeX statement         |
| `mv-content`  | Visualization       | Diagram, chart, or interactive |
| `mr-content`  | Known Results       | Partial results and progress   |
| `mm-content`  | Relevance           | Why solving it matters         |

The navigation flow through mystery panels is:
**The Conjecture → Visualization → Known Results → Relevance**

---

### Archive & Exhibition Hall

The archive is organized into **unit groups**. Each group (`data-group="unit-1"`, etc.) contains exactly three exhibit cards displayed side by side.

**To fill in an exhibit card**, locate its `id` in `index.html` (e.g., `id="exhibit-unit-1-p1"`) and update:

| Element               | Content                                                   |
|-----------------------|-----------------------------------------------------------|
| `.exhibit-img-slot`   | Replace with `<img src="your-scan.jpg">`                  |
| `.exhibit-caption`    | Short descriptive caption beneath the image               |
| `.plaque-object-title`| Exhibit title (e.g., "Unit 1, Page 1")                    |
| `.plaque-note`        | Curatorial note describing the page's mathematical content|

**Clicking an image** opens a lightbox. This works automatically — no additional code needed once a real `<img>` is in place.

**To link to a specific exhibit from inside a learning unit**, use:

```html
<button class="exhibit-eye-btn" onclick="showScreen('archive', 'exhibit-unit-3-p1')">
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="12" cy="12" rx="10" ry="6"/>
    <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none"/>
  </svg>
  View in Archive
</button>
```

This navigates to the archive, filters to the correct unit, scrolls the card into view, and briefly highlights it.

---

### References

All reference content is in `index.html` inside `#references`. Locate the relevant `.ref-item` block and update `.ref-title`, `.ref-meta`, and `.ref-desc` directly in the HTML. To add a reference, copy a `.ref-item` block and paste it within the appropriate `.ref-section`.

---

### About

About section content is in `index.html` inside `#about`. Update the following elements directly in the HTML:

| Element          | Content                    |
|------------------|----------------------------|
| `.about-avatar`  | Single initial or monogram |
| `.about-name`    | Your full name             |
| `.about-role`    | Title, year, institution   |
| `.about-email`   | Contact email              |
| `.about-main .ph`| The four text sections     |

---

### Welcome Modal

The welcome modal (`#help-modal`) appears **automatically on the very first visit** and never again automatically. It re-opens any time the user clicks the `?` button in the navbar.

This is controlled by the `nts_welcome_seen` key in `localStorage`. To reset it during development (force the modal to show again), run in the browser console:

```js
localStorage.removeItem('nts_welcome_seen');
```

To edit the modal content, locate `id="help-modal"` in `index.html` and update the `.help-modal-body` div. You can place text, `<img>` tags, and any standard HTML inside it.

---

## Navigation

The navbar links are centered using `position:absolute; left:50%; transform:translateX(-50%)` on the `.nav-links-center` class. The brand (left) and icon group (right) remain in place via `flex-shrink:0`.

The two icon buttons in the top-right corner are:
- **Paper icon** — opens the Archive & Exhibition Hall (`showScreen('archive')`)
- **? icon** — opens/closes the welcome modal (`toggleHelp()`)

---

## Mathematics Rendering

LaTeX is rendered by [KaTeX](https://katex.org/) loaded from CDN. It runs automatically on page load and re-runs each time a new screen becomes active.

- Inline math: `$...$` or `\(...\)`
- Display math: `$$...$$` or `\[...\]`

Use these delimiters anywhere in content strings set via `innerHTML`, directly in `index.html`, or inside flashcard fields in `app.js`.

---

## Local Storage

The site uses `localStorage` for two purposes:

| Key               | Type    | Purpose                                              |
|-------------------|---------|------------------------------------------------------|
| `nts_progress`    | JSON    | Tracks which topic the user last reached per unit    |
| `nts_welcome_seen`| String  | Records that the welcome modal has been shown once   |

All storage calls are wrapped in `try/catch` so the site degrades gracefully if `localStorage` is unavailable (e.g., in certain private browsing modes).

To clear all site data in the browser console:

```js
localStorage.removeItem('nts_progress');
localStorage.removeItem('nts_welcome_seen');
```

---

## Deep Linking into the Archive

`showScreen()` accepts an optional second argument for the archive:

```js
showScreen('archive', 'exhibit-unit-3-p1');
```

When called with a target ID, the function:
1. Navigates to the archive screen
2. Fires the correct unit filter button
3. Scrolls the target exhibit card into view
4. Applies a brief highlight pulse animation to the card

The target must be a valid `id` attribute on an `.exhibit-case` element in `index.html`.

---

## Images

All images should be placed in the same directory as `index.html`. Reference them by filename only (no path prefix needed):

```html
<img src="notebook-u1-p1.jpg" alt="Unit 1, Page 1">
```

Recommended image types and sizes:

| Location              | Recommended aspect ratio | Notes                            |
|-----------------------|--------------------------|----------------------------------|
| Archive exhibit scans | 3:4 (portrait)           | Matches the `.exhibit-frame` CSS |
| Proof images          | 3:2 (landscape)          | Matches `.proof-img-slot`        |
| Topic intro images    | 4:3                      | Matches `.topic-intro-img`       |
| Founder portraits     | 1:1 or 4:5               | Cropped to top in CSS            |
| Home overview images  | 16:7 (wide)              | Matches `.overview-img`          |

All `<img>` elements in topic intros should include `style="width:100%;border-radius:var(--radius);"` for consistent styling.

---

## Extending the Site

**To add a new unit**, append a new object to the `UNITS` array in `app.js`, following the existing shape. Progress tracking and syllabus card rendering are automatic.

**To add a new mystery**, add a new `.mystery-frame` card to `.mystery-grid` in `index.html` and add a corresponding `case` block inside `openMystery()` in `app.js`.

**To add a new top-level screen**, add a `<section class="screen" id="your-id">` in `index.html`, register the ID in `ALL_SCREENS` in `app.js`, and optionally add an entry to `NAV_MAP` if it should highlight a nav link.

**To add a nav link**, add a `<li><a id="nav-your-id" onclick="showScreen('your-id')">Label</a></li>` to the `<ul class="nav-links nav-links-center">` in `index.html`.
