# The Number Theory Scrapbook

A multi-page, single-file-app website for learning Number Theory.

## File Structure

```
number-theory-scrapbook/
├── index.html      ← Main HTML (all screens/sections)
├── style.css       ← All styles (dark theme, cards, quadrant layout, etc.)
├── app.js          ← Navigation logic, topic data, glossary filtering
├── paper.pdf       ← (ADD YOUR OWN) Research paper for the "More" section
└── README.md       ← This file
```

## Sections

| Screen | Nav Label | Description |
|---|---|---|
| `home` | Home | Overview, Founding Fathers portraits, overview placeholders |
| `learn` | Learn | Syllabus with clickable topic cards |
| `topic-detail` | — | 4-quadrant layout (Theory / Visualization / Practice / Application) |
| `glossary` | Glossary | Searchable, categorized term cards |
| `mysteries` | Mysteries | Gallery-style unsolved conjecture exhibit |
| `more` | More | PDF viewer for your research paper |
| `references` | References | Textbooks, courses, websites |
| `about` | About | About you, email, notebook pages, motivation |

## How to Add Your Content

### 1. Home Page
Open `index.html` and search for `[ Your overview content goes here ]` style placeholders — replace them with your text.

### 2. Topic Pages (4-Quadrant Layout)
Each topic's content is rendered by `openTopic()` in `app.js`.  
For each topic ID (e.g. `'euclidean'`), find the matching `case` in `openTopic()` and replace the `innerHTML` strings for:
- `td-theory` — LaTeX theory (use `$...$` or `$$...$$` for KaTeX)
- `td-viz` — diagram HTML or image tag
- `td-practice` — problem blocks
- `td-application` — application paragraph + tags

### 3. Glossary
In `index.html`, each `.glossary-card` has:
- `.glossary-term` — the term name (already set)
- `.glossary-def` — your definition (replace placeholder)
- `.glossary-latex` — the LaTeX formula (already set; adjust as needed)

To add more terms, copy a `.glossary-card` block and set the `data-category` attribute to one of:
`foundations` | `congruences` | `functions` | `primes` | `advanced`

### 4. Mysteries Gallery
In `index.html`, each `.mystery-frame` has a `.mystery-name`, `.mystery-year`, and `.mystery-desc` — fill in the placeholders.
Change the `.mystery-status` class from `UNSOLVED` to `PARTIAL` or `SOLVED` as appropriate.

### 5. Research Paper (More)
- Place your PDF file in this folder as `paper.pdf`
- In `index.html`, uncomment the `<iframe>` block inside `#more` and delete the placeholder block.

### 6. About Page
Fill in your name, email, and the paragraph placeholder sections.
For notebook images, replace the `.notebook-page` divs with `<img>` tags pointing to your scanned pages.

### 7. References
Replace every `[ ... ]` placeholder in the `#references` section.

## KaTeX Usage
Use standard LaTeX delimiters anywhere in the HTML:
- Inline: `$a \equiv b \pmod{n}$`
- Display: `$$\zeta(s) = \sum_{n=1}^{\infty} \frac{1}{n^s}$$`

KaTeX renders automatically on page load and on every screen switch.

## Deploying to GitHub Pages
1. Push this entire folder to a GitHub repository.
2. Go to **Settings → Pages → Source → main branch / root**.
3. Your site will be live at `https://yourusername.github.io/repo-name/`.

No build step needed — this is plain HTML/CSS/JS.
