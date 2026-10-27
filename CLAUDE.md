# The Quiet Argument: instructions for Claude

This repository is a public essay publication built by GitHub Pages (Jekyll) from
`main`. The owner manages it from an Android tablet by asking Claude to publish or
edit essays. Follow `PUBLISHING-GUIDE.md`; the rules below are the non-negotiables.

## How the site works

- Essays: `_essays/<slug>.md` (Markdown + front matter). The file name is the permanent
  URL: `/articles/<slug>/`. Template: `_templates/essay.md`.
- Essay images: `assets/images/essays/<slug>/`, referenced by file name only
  (`cover: "cover.jpg"`, `{% include figure.html src="photo.jpg" alt="…" caption="…" %}`).
- Site settings, topics, social links: `_config.yml`. Layouts: `_layouts/`, partials: `_includes/`.
- Home page, archive, related essays, sitemap, and all SEO/social tags are generated
  from front matter. Never hand-edit lists or meta tags.
- Internal links in templates and essays must use `{{ '/path/' | relative_url }}`
  (the site lives under `/personal-blog/`).
- Merging to `main` publishes. GitHub Pages rebuilds in about 1–2 minutes.

## Rules for publishing and editing

1. **Work on a branch, never commit directly to `main`.** Publishing happens when the
   owner merges the pull request. Never merge unless the owner explicitly asks in the
   current conversation.
2. **Drafts stay private until the owner says "publish".** The repository and its pull
   requests are public. Prepare and preview locally; push only when asked to publish.
   Never commit drafts, notes, or anything marked private.
3. **Never rename or delete a published essay file** (that breaks its URL) unless the
   owner explicitly asks. Edits change the existing file; never create a second copy.
4. **Never change `date` on a published essay.** For a meaningful revision (new section,
   changed argument, corrected fact) set `updated:` to today. Typos, grammar, images,
   captions, alt text, and SEO fields do not need `updated`.
5. **Category** must be one of the topics in `_config.yml`, spelled exactly.
6. **Featured essay:** exactly one essay should have `featured: true`. When changing it,
   remove the flag from the old one.
7. **Placeholders:** content marked `placeholder: true` must never be presented as real.
   Do not write essays, quotes, facts, statistics, credits, or biography for the owner.
   You may polish their text when asked; flag any factual claim you can't verify.
8. **Images:** resize to at most 2000 px on the long side and compress (target under
   500 KB; JPEG quality ~82) before committing. Lowercase-hyphenated file names. Every
   image needs meaningful `alt` text (ask the owner if unsure what it shows). Never
   invent image credits or claim usage rights without evidence from the owner.
9. **Never commit secrets** (tokens, passwords, API keys, `.env` files).
10. **Don't change the design** (colours, fonts, layouts, CSS) unless asked.

## Before pushing any change

```bash
tools/build.sh --against origin/main   # build like GitHub Pages + run all checks
```

Fix every ERROR. Then preview and show the owner screenshots before publishing
significant changes (new essays, new sections, image changes, featured changes):

```bash
python3 tools/preview_server.py &      # serves _site at http://127.0.0.1:4000/personal-blog/
node tools/screenshots.js articles/<slug>/ --out <scratchpad>/preview
```

Send the phone and tablet screenshots to the owner. In the reply, list the files
changed, the essay's URL (`https://pranalidesai97-ai.github.io/personal-blog/articles/<slug>/`),
and what still needs their decision.

## After the owner merges

GitHub Pages runs a "pages build and deployment" workflow. If you can, check that the
run succeeded. Don't claim the live site is updated unless you verified it; this
sandbox may not be able to reach github.io.
