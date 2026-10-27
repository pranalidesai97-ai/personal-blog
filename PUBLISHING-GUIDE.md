# Publishing guide: The Quiet Argument

How to publish, edit, and maintain essays from an Android tablet using Claude Code
and GitHub. No paid services, no servers, no passwords beyond your GitHub account.

**Live site:** https://pranalidesai97-ai.github.io/personal-blog/

---

## 1. How it works (and who can change what)

```
You (tablet) ──► Claude Code ──► branch + pull request ──► you tap "Merge" ──► GitHub Pages rebuilds the site
```

- **Visitors can only read.** There is no upload button, editor, or login on the
  website. Nothing on the public site can change it.
- **Only your GitHub account can change the site.** Content lives in the repository;
  GitHub's own login (with two-factor authentication) protects it.
- **Every change to `main` republishes the site.** When a pull request is merged (or
  anything is committed to `main`), GitHub Pages automatically rebuilds the site. It
  takes about 1–2 minutes. You can watch it under the repository's **Actions** tab
  ("pages build and deployment").
- **If a build ever fails,** the live site keeps showing the previous version, and
  the failed run appears in red under **Actions**. Nothing breaks for readers.
- **Claude never publishes on its own.** Claude prepares changes on a separate branch
  and opens a pull request. Merging it is your decision. Claude only merges if you
  explicitly ask it to.

### Keep drafts private

The repository is **public** (free GitHub Pages requires it), and so are its pull
requests. Anything committed, even on a branch, can be read on GitHub. So:

- Keep drafts in your Claude conversation, your notes app, or Google Docs.
- Ask Claude for a **preview** first: it builds the site inside its own session and
  sends you screenshots, without pushing anything.
- Say **"publish"** only when the essay is ready to be public.
- Never put passwords, tokens, or private notes in the repository.

### Why there's no admin dashboard

A private web dashboard would need its own secure login (e.g. GitHub OAuth), a
server or third-party service to handle that login, and ongoing maintenance and
security updates. GitHub plus Claude Code already gives you editing, previews,
history, and undo with stronger security, at no cost. If you later want a visual
editor, it can be discussed, but it isn't needed.

---

## 2. Publish a new essay

1. Open **Claude Code** (the Claude app → Code, or claude.ai/code) with the
   **personal-blog** repository.
2. Send your essay. Paste the text, or attach a file (Word, PDF, text, or Markdown).
   Attach any images too (see section 5). Tell Claude:
   - the **category** (Business, Human behaviour, Relationships, Personal growth,
     Money, or Everyday observations)
   - the **title**, and optionally a **subtitle**
   - which image is the **cover**, plus a short description of each image
   - whether it should be the **featured** essay

   Example:
   > New essay for The Quiet Argument. Category: Money. Title: "The Price of a
   > Quiet Mind". Subtitle: "Why we pay extra to stop worrying." Use the attached
   > photo as the cover; it shows a closed umbrella by a café door. Make it the
   > featured essay. Show me a preview before publishing.
3. **Claude prepares it:** creates the essay file, resizes and places the images,
   suggests an excerpt and SEO description for your approval, builds the site exactly
   as GitHub does, runs the checks, and sends you **phone and tablet screenshots**.
4. **Review the preview.** Ask for any changes ("shorten the excerpt", "use the other
   photo as the cover").
5. When you're happy, say **"Publish it."** Claude pushes the branch and opens a pull
   request.
6. **Merge it:** open the pull request link → scroll down → **Merge pull request** →
   **Confirm merge**. (Tip: in Chrome, ⋮ → **Desktop site** shows the full GitHub
   layout.)
7. After 1–2 minutes the essay is live at
   `https://pranalidesai97-ai.github.io/personal-blog/articles/<slug>/`, and it appears
   on the home page and in the archive automatically.

**The slug** (the essay's address) is made from the title, e.g.
`the-price-of-a-quiet-mind`. It is permanent: it won't change even if you later edit
the title, so links people have shared keep working. Ask Claude for a specific slug
if you prefer.

---

## 3. Essay metadata

Each essay is one file, `_essays/<slug>.md`. The top section (between the `---`
lines) is the metadata; the rest is the essay. Claude fills this in for you; this is
for reference.

```yaml
---
title: "The Price of a Quiet Mind"
subtitle: "Why we pay extra to stop worrying."
excerpt: "One or two sentences for cards, lists, and search results."
category: "Money"
date: 2026-11-03
cover: "cover.jpg"
cover_alt: "A closed umbrella leaning against a café door."
featured: true
---
```

| Field | Required? | What it does |
| --- | --- | --- |
| `title` | yes | The essay's title. |
| `excerpt` | yes | Summary on cards, in the archive and search, and the default description for search engines and social previews. |
| `category` | yes | One of the six topics, spelled exactly. |
| `date` | yes | First publication date, `YYYY-MM-DD`. **Never changes after publishing.** |
| `subtitle` | no | Introduction shown under the title. |
| `updated` | no | Date of a meaningful revision; shown as "Updated …" (section 6). |
| `reading_time` | no | Minutes. Calculated automatically if left out. |
| `cover` | no | Cover image file name (in the essay's image folder). Shown on the essay and its card. |
| `cover_alt` | with a cover | Description of the cover for people using screen readers. |
| `cover_caption` | no | Caption under the cover, e.g. a photo credit you have permission to use. |
| `seo_title` | no | A different title for search results and the browser tab. |
| `description` | no | A different summary for search results and social previews (otherwise `excerpt`). |
| `social_image` | no | A 1200 × 630 image for link previews (otherwise the cover, otherwise the site's default card). |
| `featured` | no | `true` puts it in the home page's Featured slot. |
| `dropcap` | no | `false` turns off the large first letter. |
| `comments` | no | `false` hides reactions and comments on this essay (section 10). |
| `placeholder` | no | Marks sample content: shows a "Placeholder" label, hides it from search engines. |

---

## 4. Writing format (Markdown)

You can simply send plain text and let Claude format it. For reference:

| You want | Write |
| --- | --- |
| Paragraph | text, with a blank line between paragraphs |
| Section heading | `## Heading` (`###` for a sub-heading; the title is the only top-level heading) |
| Bold / italic | `**bold**`, `*italic*` |
| External link | `[text](https://example.com)` |
| Link to another essay | `[text]({{ '/articles/other-essay-slug/' \| relative_url }})` |
| Quotation | a line starting with `> ` |
| Bulleted / numbered list | lines starting with `- ` or `1. ` |
| Pull quote | a paragraph followed by a line `{: .pullquote}` |
| Section break | a line with `---` |
| Footnote | `text[^1]` and, at the end, `[^1]: The note.` |
| Image | see section 5 |

The template, `_templates/essay.md`, shows every one of these.

---

## 5. Images

### Where images go

Each essay has its own image folder, named after its slug:

```
assets/images/essays/the-price-of-a-quiet-mind/
    cover.jpg
    cafe-door.jpg
    receipt.jpg
```

- **Cover:** `cover: "cover.jpg"` in the metadata.
- **Inside the essay:**

  ```
  {% include figure.html src="cafe-door.jpg" alt="An umbrella against a café door in the rain." caption="Optional caption." %}
  ```

  Add `wide=true` to make an image slightly wider than the text on large screens.
  Use as many images as you like.

### Sizes

| Image | Recommended size | Aim for |
| --- | --- | --- |
| Cover | 1600 × 900 px (landscape, 16:9) | under 400 KB |
| Inside the essay | 1200–1600 px wide | under 300 KB |
| Social image (optional) | 1200 × 630 px | under 300 KB |

Phone photos are usually far larger (3–8 MB). **Claude resizes and compresses them
automatically** before publishing, and the checks refuse anything over 2 MB. Images
scale to fit every screen and load only when the reader scrolls to them. If an
optional image ever goes missing, its space collapses neatly instead of showing a
broken icon.

### Alt text and captions

- **Alt text** describes what the image shows, for people who can't see it:
  "A closed umbrella leaning against a café door". It's not "image" or "photo".
  Every image needs it.
- **Captions** are optional and visible to everyone.
- **Only use images you have the right to use:** your own photos, or images whose
  licence allows it. Put any required credit in the caption. Claude won't invent
  credits or assume permission.

### Uploading images from the tablet

**Easiest: attach them to your message to Claude** (the paperclip/attachment button
in Claude Code). Say which essay they belong to and what each one shows. Claude
handles naming, resizing, placement, and alt text (for you to confirm).

**Alternative: through the GitHub website**
1. Open the repository in Chrome → `assets` → `images` → `essays` → the essay's folder.
   (If the folder doesn't exist yet, ask Claude to create it, or use the option
   above.)
2. Tap **Add file → Upload files**, choose the image from your gallery.
3. Choose **Create a new branch** (not "commit directly to main"), then **Propose
   changes**.
4. Tell Claude the file name and where it should appear. Claude adds it to the essay
   on that branch (resizing it if needed).

---

## 6. Editing a published essay

Ask Claude in plain words. For example:

- "In *The Price of a Quiet Mind*, fix the typo in the third paragraph."
- "Clarify the paragraph that starts 'Most insurance…'. Show me the before and after."
- "Add a new section called 'What we're really buying' after the second section:" (then paste it)
- "Replace the cover with the attached photo. It shows a rainy street at dusk."
- "Add alt text and captions to the images in the friendship essay."
- "Change the figure in the second paragraph from 40% to 35%." (give the source)
- "Improve the SEO title and description of the money essay."
- "Make *Small Firms, Long Memories* the featured essay."

### The editing rules Claude follows

- **The URL never changes.** The same file is edited; no duplicate essay is created,
  even if the title changes.
- **The publication date never changes.**
- **`updated` is set only for meaningful revisions:** a new section, a changed
  argument, or a corrected fact. Typos, grammar, images, captions, alt text, and SEO
  fields don't count. You can always ask Claude to add or skip it.
- **Nothing else changes.** Other essays and the design are left alone.
- **Before publishing,** Claude tells you which files changed and, for significant
  edits, sends preview screenshots. Publishing is the same pull request → **Merge**
  step as in section 2.

An automatic check backs this up: before anything is pushed, it compares the essays
with the live site and blocks a changed publication date, a renamed or deleted essay,
a missing image, a missing alt text, an unknown category, or a duplicate title.

### Removing an essay

Ask Claude explicitly ("delete the essay *X*"). Its address will stop working, so
it's usually better to keep published essays.

---

## 7. Featured essay, home page, and archive

All lists are built automatically from the essays, newest first:

- **Home page:** the **featured essay** (the one with `featured: true`, otherwise the
  newest), the **latest essays** (up to six, not repeating the featured one), and
  "Read the latest essay", which always points to the newest essay.
- **Essays archive:** every essay grouped by year, with **search** (title, summary,
  and topic, updating as you type) and **topic filters**.
- **Related essays** at the end of each essay: same topic first, then the newest others.

To change the featured essay, ask Claude: "Make *X* the featured essay." Claude moves
the flag so only one essay is featured.

### While there is only one essay

The home page heads it **"The first essay"** instead of "Featured essay", and the
"Latest essays" and "Related essays" sections stay hidden (they would only repeat it).
All of this switches automatically when the second essay is published.

---

## 8. Search engines and social previews

### What's already in place

Every page has a unique title, meta description, canonical URL, Open Graph and X
(Twitter) card tags, and a preview image. Essays also include publication and
updated dates and structured data (schema.org `BlogPosting`). A sitemap is
generated automatically at
**https://pranalidesai97-ai.github.io/personal-blog/sitemap.xml** (placeholder essays
are left out).

**This does not mean the site is indexed.** Search engines decide when, or whether,
to include pages. Registering the site with them helps.

### Google Search Console (free, about 10 minutes, one-time)

1. Go to **search.google.com/search-console** and sign in.
2. **Add property** → choose **URL prefix** → enter
   `https://pranalidesai97-ai.github.io/personal-blog/`.
3. Choose the **HTML tag** verification method. Copy only the code inside
   `content="…"`.
4. Ask Claude: "Add this Google verification code: …" (it goes in `_config.yml` as
   `google_site_verification`). Merge the pull request and wait 2 minutes.
5. Back in Search Console, tap **Verify**.
6. Open **Sitemaps**, enter `sitemap.xml`, and tap **Submit**.
7. Optional: **URL inspection** → paste a new essay's address → **Request indexing**.

Indexing usually takes days to weeks. **Bing Webmaster Tools** can import your
Search Console setup in one step.

### About robots.txt

A `robots.txt` file only works at the root of a domain
(`pranalidesai97-ai.github.io/robots.txt`). This site lives in a sub-folder
(`/personal-blog/`), where search engines ignore it, so none is included. The
sitemap above (submitted through Search Console) and per-page `noindex` tags do
that job instead.

### Social previews

When you share an essay link on WhatsApp, LinkedIn, X, or Facebook, the preview
shows the essay's title, description, and image (social image → cover → the site's
default card). These apps cache previews. If an old preview appears after an edit,
LinkedIn's **Post Inspector** can refresh it; others usually update within a few days.

---

## 9. Sharing essays

Every essay ends with:
- **Share…**: opens your device's share sheet (WhatsApp, email, etc.) where the
  browser supports it, including Chrome on Android. Elsewhere it copies the link.
- **Copy link**: copies the essay's permanent address.

A short message confirms whether the link was copied or shared.

---

## 10. Comments and reactions (giscus)

Each essay can end with a **Comments** section powered by
[giscus](https://giscus.app): free, open source, no ads, no tracking, no API key.
Comments and reactions are stored as **GitHub Discussions in this repository**, so
they persist, and you moderate them on GitHub. Readers sign in with a GitHub
account to react or comment; anyone can read them.

- **One discussion per essay**, matched by the essay's address (`pathname`), e.g.
  `/personal-blog/articles/should-a-company-eventually-outgrow-its-founder/`.
  giscus creates it automatically on the first reaction or comment.
- **Reactions** (👍 ❤️ 🎉 and others) appear above the comments and count for the
  essay as a whole.
- The widget uses the site's ivory, mustard, and charcoal colours and Source Sans 3
  (`assets/css/giscus-theme.css`).
- To turn comments off for one essay, add `comments: false` to its metadata.

### One-time setup (about 10 minutes)

The section stays hidden until these steps are done and the values are added.

1. **Install the giscus app:** open **github.com/apps/giscus** → **Install** →
   **Only select repositories** → choose **personal-blog** → **Install**.
2. **Turn on Discussions:** repository **Settings → General → Features** → tick
   **Discussions**.
3. **Create a category for comments:** open the repository's **Discussions** tab →
   the pencil icon next to **Categories** → **New category**. Name it
   **Comments**, choose the **Announcement** format (so only you and giscus can start
   discussions; readers can still reply), then **Create**.
4. **Get the values:** open **giscus.app** in Chrome. Under **Repository** enter
   `pranalidesai97-ai/personal-blog` (it should say *all criteria met*). Under
   **Page ↔ Discussions Mapping** choose **Discussion title contains page
   `pathname`**. Under **Discussion Category** choose **Comments**.
5. In the **Enable giscus** box further down the page, find these three values and
   send them to Claude (or paste the whole snippet):
   - `data-repo-id="R_…"`
   - `data-category="Comments"`
   - `data-category-id="DIC_…"`

   Claude puts them in `_config.yml` under `giscus:` and opens a pull request; after
   you merge it, the Comments section appears on every essay.

These IDs are not secret (they appear in the page source of every site using
giscus), but they must be copied exactly: never guessed.

### Moderating comments

Everything happens in the repository's **Discussions** tab on GitHub (also in the
GitHub mobile app). Each essay's discussion is titled with its address.

| To… | Do this on the comment or discussion |
| --- | --- |
| Get notified of new comments | Repository → **Watch** → **Custom** → tick **Discussions**. |
| Reply as the author | Reply on the essay itself, or in the discussion on GitHub. |
| Edit or delete a comment | The comment's **⋯** menu → **Edit** or **Delete**. |
| Hide a comment (spam, abuse, off-topic) | **⋯** → **Hide** → choose a reason. It's collapsed for readers but kept. |
| Stop new comments on an essay | Open its discussion → right sidebar → **Lock conversation**. |
| Block someone | Open their GitHub profile → **Block or report**, or your GitHub **Settings → Moderation → Blocked users**. |
| Calm a busy thread | Repository **Settings → Moderation options → Interaction limits** (temporary limits, e.g. only past contributors). |

Deleting a whole discussion removes that essay's comments and reactions. Prefer
hiding or locking.

---

## 11. Without Claude: quick fixes on GitHub

For a tiny fix (a typo) you can edit directly on GitHub:
1. Open `_essays/` → the essay → the **pencil icon**.
2. Edit the text. **Don't touch the `date` line or the file name.**
3. **Commit changes…** → **Create a new branch** → **Propose changes** → **Create pull
   request** → **Merge**.

If something looks wrong afterwards, open **Actions**. A red run means the build
failed and the previous version is still live. Ask Claude to look at it.

---

## 12. Troubleshooting

| Problem | What to do |
| --- | --- |
| Change merged but the site looks the same | Wait 2 minutes; check **Actions** for a green "pages build and deployment" run; reload in an incognito tab. |
| Red ❌ run under **Actions** | The previous version is still live. Ask Claude: "The Pages build failed, please fix it." |
| An essay is missing from the home page | The home page shows the featured essay plus the six newest others; older essays are in the archive. Otherwise ask Claude to run the checks. |
| Essays in the wrong order | Order comes from each essay's `date`. A mistyped date (e.g. next year) puts an essay first; the checks warn about future dates. |
| Old link preview on WhatsApp/LinkedIn | Previews are cached by those apps; see section 8. |
| Site shows the wrong design entirely | Check **Settings → Pages**: source **Deploy from a branch**, branch **main**, folder **/ (root)**. |

---

## For Claude (technical summary)

Build and check exactly as GitHub Pages does: `tools/build.sh --against origin/main`.
Preview: `python3 tools/preview_server.py` then `node tools/screenshots.js articles/<slug>/`.
Rules: see `CLAUDE.md`.
