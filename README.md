# The Quiet Argument

*Same questions. Different angles.*

An independent publication of essays on business, human behaviour, relationships, money,
personal growth, and everyday life.

**Live site:** https://pranalidesai97-ai.github.io/personal-blog/

- **To publish or edit essays,** read **[PUBLISHING-GUIDE.md](PUBLISHING-GUIDE.md)**.
- **For Claude Code,** the working rules are in **[CLAUDE.md](CLAUDE.md)**.

---

## How it's built

The site uses GitHub Pages' built-in **Jekyll** (free; no server, database, paid service,
or API key). Every merge to `main` makes GitHub rebuild and republish the site in
about 1–2 minutes.

```
_essays/<slug>.md                 one Markdown file per essay → /articles/<slug>/
assets/images/essays/<slug>/      that essay's cover and inline images
_templates/essay.md               starting point for a new essay (not published)
_config.yml                       site name, description, topics, social links, SEO settings
_layouts/  _includes/             page templates (header, footer, cards, SEO tags, share buttons)
index.html                        home page (hero, topics, featured, latest, about band)
articles/index.html               essays archive with search and topic filters
about/index.html                  about page
404.html                          "page not found"
sitemap.xml                       generated sitemap
assets/css/style.css              design: palette and fonts are defined at the top
assets/js/main.js                 archive search/filter, share buttons, progress bar
assets/images/social/default.png  default link-preview image (1200 × 630)
tools/                            build, check, and preview tools (not published)
```

Home page lists, the archive, related essays, the sitemap, and every page's SEO and
social-preview tags are generated from essay metadata. Nothing is maintained by hand.

## Design

| Token | Colour | Used for |
| --- | --- | --- |
| `--ivory` | `#F8F3E8` | page background |
| `--cream` | `#FFFDF7` | cards and panels |
| `--charcoal` | `#292A27` | headlines, body text, navigation |
| `--grey` / `--grey-text` | `#77736B` / `#6C6860` | muted text (the darker one for small text, for contrast) |
| `--border` | `#DED5C4` | hairlines and borders |
| `--mustard` | `#E8AD00` | buttons, active links, rules, markers |
| `--lemon` | `#F7D84A` | highlights and small accents |

Fonts: **DM Serif Display** (headlines) and **Source Sans 3** (text), from Google Fonts.

## Build and preview on a computer

```bash
tools/build.sh                         # installs the GitHub Pages toolchain once, builds, runs checks
python3 tools/preview_server.py        # then open http://localhost:4000/personal-blog/
```

Or `bundle exec jekyll serve` and open http://localhost:4000/personal-blog/.

## GitHub Pages settings

**Settings → Pages:** Source **Deploy from a branch**, branch **main**, folder **/ (root)**.
The repository must be public for free GitHub Pages.
