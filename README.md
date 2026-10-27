# Personal blog

A minimal, editorial-style blog for essays on business, human behaviour, relationships,
personal growth, money, and everyday observations.

It is built with plain HTML, CSS, and a little vanilla JavaScript. There is no build step,
no framework, no database, no backend, and nothing to pay for. It runs on free GitHub Pages.

---

## What's in the folder

```
index.html                     Home page: introduction, featured essay, latest essays
about/index.html               About page
articles/index.html            Essays archive (cards grouped by year, filter by topic)
articles/a-sample-essay/       The sample article (PLACEHOLDER — replace or delete it)
articles/_template/            A blank article to copy when you write a new one
404.html                       "Page not found" page
assets/css/style.css           All styles; colours and fonts are set at the top
assets/js/config.js            Your name, tagline, topics, and social links
assets/js/posts.js             The list of articles
assets/js/main.js              Builds the lists and small interactive touches (no need to edit)
assets/img/favicon.svg         Browser-tab icon
.nojekyll                      Tells GitHub Pages to publish the files exactly as they are
```

---

## 1. Make it yours

### Your name, tagline, and social links

Open **`assets/js/config.js`** and edit:

- `siteName`: shown in the header, footer, and browser tab.
- `author`: shown in the footer and under articles.
- `tagline`: the line under your name in the footer.
- `social`: fill in the `url` for each link you want to show. Links with an empty
  url are hidden. Use `mailto:you@example.com` for email. You can add or remove
  entries, for example `{ label: "Threads", url: "https://..." }`.

The pages also contain "Your Name" as fallback text, used if JavaScript is off and in
link previews. To change it everywhere, find and replace `Your Name` across the
project (most code editors can do this: *Edit → Replace in Files*).

### Home page introduction

Edit the heading and paragraph inside `<section class="intro ...">` in **`index.html`**.

### About page

Replace the placeholder paragraphs in **`about/index.html`**, and delete the
`<aside class="notice">` box marked *PLACEHOLDER TEXT*.

### Colours and fonts

The variables at the top of **`assets/css/style.css`** control the colours, fonts,
and widths. Fonts come from Google Fonts, which is free and needs no key. To use
system fonts only, delete the `fonts.googleapis.com` lines from each page's `<head>`.

---

## 2. Write and edit articles

Each article lives in its own folder, so its address is clean:
`.../articles/your-article-slug/`.

### Add a new article

1. **Copy** the folder `articles/_template/` and rename the copy to your article's slug,
   e.g. `articles/the-cost-of-convenience/`. Use lowercase letters, numbers, and hyphens only.
2. **Edit** `index.html` in the new folder. Everything you need to change is marked `EDIT`:
   - the title (in `<title>`, the `og:title` meta tag, `data-page-title`, and the `<h1>`)
   - `data-slug="..."` at the top: must match the folder name
   - the description, topic, subtitle, and date
   - the article body inside `<div class="prose dropcap">`
   - delete the `<meta name="robots" content="noindex">` line
3. **List it** in `assets/js/posts.js` by adding an entry:

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

   The home page, archive, and "previous / next essay" links update automatically.
   Add `featured: true` to pin an article as the home page's featured essay; otherwise
   the newest article is featured.

### Writing the article body

Inside `<div class="prose">`, use ordinary HTML:

| You want | Write |
| --- | --- |
| Paragraph | `<p>Text</p>` |
| Section heading | `<h2>Heading</h2>` (or `<h3>` for a sub-heading) |
| Bold / italic | `<strong>bold</strong>`, `<em>italic</em>` |
| Link | `<a href="https://...">text</a>` |
| Quotation | `<blockquote><p>Quoted text</p></blockquote>` |
| Pull quote | `<p class="pullquote">A line worth repeating</p>` |
| Lists | `<ul><li>…</li></ul>` or `<ol><li>…</li></ol>` |
| Section break | `<hr>` (shows as ⁂) |
| Image | `<figure><img src="photo.jpg" alt="Description"><figcaption>Caption</figcaption></figure>` |

Put images in the article's own folder and refer to them by file name, as in the table.
The sample article shows all of these in use, including a footnote.

### Topics

Topics are listed in `config.js` (`topics`). An article's `topic` in `posts.js` should
match one of them exactly. Visitors can filter the archive by topic, and the topic
buttons on the home page link to those filtered views.

### Remove the sample article

Delete the folder `articles/a-sample-essay/`, remove its entry from `assets/js/posts.js`,
and remove its line from the `<noscript>` list in `articles/index.html`.

---

## 3. Preview on your computer

Pages link to folders (like `about/`), so preview through a small local web server.
Opening the files by double-clicking won't follow those links correctly.

**Option A: Python** (already installed on macOS and most Linux systems):

```bash
cd personal-blog
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser. Press `Ctrl+C` to stop.

**Option B: VS Code.** Install the free *Live Server* extension, open the folder, and click
**Go Live** in the status bar.

The custom 404 page only appears on GitHub Pages. Locally you can view it directly at
<http://localhost:8000/404.html>.

---

## 4. Publish on GitHub Pages (free)

These steps assume the repository is named **`personal-blog`**, so the site will be at
`https://YOUR-USERNAME.github.io/personal-blog/`.

1. **Get the files onto your default branch.** On GitHub, open the repository. If the
   site is on another branch, open a pull request from that branch into your default
   branch (usually `main`) and merge it. (If the repository has no `main` branch yet,
   merging the pull request, or pushing the branch as `main`, creates it.)
2. Go to **Settings → Pages** (in the left sidebar under *Code and automation*).
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Under **Branch**, choose **`main`** and folder **`/ (root)`**, then click **Save**.
5. Wait a minute or two. The Pages settings page shows the live address once the first
   deployment finishes. You can follow its progress under the **Actions** tab
   ("pages build and deployment").
6. Visit `https://YOUR-USERNAME.github.io/personal-blog/`.

From then on, every change you push or merge to `main` republishes the site automatically.

> **Free-plan note:** on a free GitHub account, Pages works for **public** repositories.
> Publishing from a private repository needs a paid plan.

### If you rename the repository or use a custom domain

All links are relative, so the site works at any address. **One** setting needs updating:
in **`404.html`**, change `SITE_BASE`:

- Renamed repository, e.g. `essays` → `var SITE_BASE = "/essays/";`
- A user site (`YOUR-USERNAME.github.io` repository) or a custom domain → `var SITE_BASE = "/";`

To use your own domain, add it under **Settings → Pages → Custom domain** and follow
GitHub's DNS instructions. No other files need to change.

---

## Notes

- **No tracking, no cookies.** The only outside requests are for Google Fonts.
- **Accessibility:** includes a skip-to-content link, keyboard focus styles, and a
  reduced-motion setting. Text colours meet WCAG AA contrast.
- **Without JavaScript,** articles and pages still display fully. Only the automatic
  lists (home, archive), social links, and the reading-progress bar need it.
