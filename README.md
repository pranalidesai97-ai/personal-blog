# The Quiet Argument

*Same questions. Different angles.*

An independent publication of essays on business, human behaviour, relationships, money,
personal growth, and everyday life.

The site is plain HTML, CSS, and a little vanilla JavaScript. There is no build step,
framework, database, backend, or paid service. It's hosted free on GitHub Pages at
**https://pranalidesai97-ai.github.io/personal-blog/**.

---

## What's in the folder

```
index.html                     Home: hero, topics, featured essay, latest essays
articles/index.html            Essays archive (grouped by year, filter by topic)
articles/a-sample-essay/       Sample essay (PLACEHOLDER: replace or delete it)
articles/_template/index.html  Blank essay to copy for each new essay
about/index.html               About the publication, plus an optional author note
404.html                       "Page not found" page
assets/js/posts.js             ← The list of essays (edit when you publish)
assets/js/config.js            ← Publication name, description, optional byline, social links
assets/css/style.css           Design: colours and fonts are set at the very top
assets/js/main.js              Builds the lists and small touches (no need to edit)
assets/img/favicon.svg         Browser-tab icon
.nojekyll                      Tells GitHub Pages to publish the files as they are
```

Day to day, you'll only touch **`posts.js`** and the essay files.

---

## Editing from an Android tablet

Everything can be done in the GitHub website, using Chrome on your tablet. No apps or
software needed.

**Tip:** in Chrome, tap ⋮ → **Desktop site** for the full GitHub editor. It's much
easier to use than the mobile layout.

### Edit an existing file

1. Open **github.com/pranalidesai97-ai/personal-blog** and tap through to the file.
2. Tap the **pencil icon** (Edit this file).
3. Make your change, then tap **Commit changes…** → **Commit changes**.
4. The live site updates about one to two minutes later. Progress shows under the
   **Actions** tab.

### Publish a new essay

1. Open `articles/_template/index.html`, tap the **copy raw file** icon, and copy
   everything.
2. Go back to the `articles` folder, tap **Add file → Create new file**, and type the name
   `your-essay-slug/index.html`. Typing the `/` creates the folder. Use lowercase letters,
   numbers, and hyphens only, e.g. `the-cost-of-convenience/index.html`.
3. Paste the template, then change everything marked **EDIT**:
   - the title (in four places: `data-page-title`, `<title>`, `og:title`, and the `<h1>`)
   - `data-slug="…"`, which must match the folder name
   - the description, topic, introduction, and date
   - the essay text, between `START OF ESSAY TEXT` and `END OF ESSAY TEXT`
   - delete the line `<meta name="robots" content="noindex">`
4. Commit the new file.
5. Open **`assets/js/posts.js`**, add an entry at the top of the list, and commit:

   ```js
   {
     slug: "the-cost-of-convenience",
     title: "The Cost of Convenience",
     excerpt: "One or two sentences that make someone want to read it.",
     date: "2026-11-03",
     topic: "Money",
     readingTime: 7
   },
   ```

   Keep the comma between entries. The home page, the archive, and "Related essays"
   update automatically. Add `featured: true` to pin an essay as the featured one;
   otherwise the newest essay is featured.

**Drafts:** an essay that has a folder but no entry in `posts.js` is unlisted. It isn't
shown anywhere on the site, but you can open it by its address to proofread on the live
site before you add it to `posts.js`.

### Add a cover image (optional)

1. Open the essay's folder on GitHub and tap **Add file → Upload files**. Upload an image
   named, for example, `cover.jpg`. Landscape images around 1600 × 1067 px work best;
   keep files under about 500 KB so pages stay fast.
2. In `posts.js`, add `cover: "cover.jpg", coverAlt: "Short description of the image"` to
   that essay's entry. The image then appears on its card.
3. To show it at the top of the essay too, remove the comment markers around the
   `<figure class="article-cover">` block in the essay's `index.html`.

Use only images you have the rights to: your own photos, or freely licensed ones.

### Writing the essay text

Inside the essay text area, use these simple HTML tags:

| You want | Write |
| --- | --- |
| Paragraph | `<p>Text</p>` |
| Section heading | `<h2>Heading</h2>` (or `<h3>` for a smaller one) |
| Bold / italic | `<strong>bold</strong>`, `<em>italic</em>` |
| Link | `<a href="https://…">text</a>` |
| Quotation | `<blockquote><p>Quoted text</p></blockquote>` |
| Pull quote | `<p class="pullquote">A line worth repeating</p>` |
| Lists | `<ul><li>…</li></ul>` or `<ol><li>…</li></ol>` |
| Section break | `<hr>` |
| Image | `<figure><img src="photo.jpg" alt="Description"><figcaption>Caption</figcaption></figure>` |

The sample essay uses every one of these, so it's a useful reference.

---

## Personalising the publication

### `assets/js/config.js`

- `siteName`: the publication name, shown in the header, footer, and browser tabs.
- `tagline`: the description in the footer.
- `author`: leave empty to publish without a byline, or add your name to show
  "By …" on every essay.
- `topics`: the six topics. An essay's `topic` in `posts.js` must match one exactly.
- `social`: add a `url` to show a link in the footer and on the About page; empty links
  stay hidden. For email use `mailto:you@example.com`.

### About page

`about/index.html` has two parts:
- the description of the publication (edit freely), and
- an optional **About the author** section, marked *Placeholder*. Write a short
  introduction to yourself there, or delete the whole `<section class="author-section">`
  to keep the page about the publication only.

### Colours and fonts

The top of **`assets/css/style.css`** holds every colour and font:

| Token | Colour | Used for |
| --- | --- | --- |
| `--ivory` | `#F8F3E8` | page background |
| `--cream` | `#FFFDF7` | cards and panels |
| `--charcoal` | `#292A27` | headlines, body text, navigation |
| `--grey` | `#77736B` | decorative and large text |
| `--grey-text` | `#6C6860` | small text such as dates (a touch darker than `--grey` so it stays readable on ivory) |
| `--border` | `#DED5C4` | hairlines and borders |
| `--mustard` | `#E8AD00` | buttons, active links, rules, category markers |
| `--lemon` | `#F7D84A` | highlights, the placeholder badge, link hover |

Mustard and lemon are too light to be readable as text on ivory, so the design uses them
only as fills, lines, and highlights, always with charcoal text.

Fonts are **DM Serif Display** (headlines, publication name) and **Source Sans 3**
(everything else), loaded free from Google Fonts. If they can't load, the site falls back
to Georgia and the device's system font.

---

## Previewing changes

**On the live site (easiest from a tablet):** commit on GitHub, wait one to two minutes,
then refresh **https://pranalidesai97-ai.github.io/personal-blog/**. If you still see the
old version, pull down to refresh or open the page in an incognito tab; browsers sometimes
cache the stylesheet.

**On a computer:** pages link to folders (like `about/`), so use a small local server
rather than double-clicking files:

```bash
cd personal-blog
python3 -m http.server 8000
```

Then open <http://localhost:8000>. The custom 404 page appears only on GitHub Pages;
locally you can view it at <http://localhost:8000/404.html>.

---

## Publishing with GitHub Pages

The site is published from the **`main`** branch. To set it up, or to check the settings:

1. In the repository, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose branch **`main`** and folder **`/ (root)`**, then tap **Save**.
4. The repository must be **public** for free GitHub Pages.

Every commit to `main` republishes the site automatically.

### If you rename the repository or use a custom domain

Links are relative, so the site works at any address. Only one line needs to change:
`SITE_BASE` near the top of **`404.html`**. Set it to `"/new-name/"` for a renamed
repository, or `"/"` for a custom domain.

---

## Notes

- **No tracking, no cookies.** The only outside request is to Google Fonts.
- **Accessibility:** every text colour meets WCAG AA contrast. The site also has a
  skip-to-content link, visible keyboard focus, tap targets sized for touch, and respects
  the reduced-motion setting.
- **Without JavaScript,** pages and essays still display. Only the automatic lists, social
  links, and the reading-progress bar need it.
