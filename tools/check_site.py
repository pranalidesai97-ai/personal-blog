#!/usr/bin/env python3
"""Pre-publish checks for The Quiet Argument.

Usage (from the repository root):

    python3 tools/check_site.py                       # check essays and images
    python3 tools/check_site.py --built _site         # also check the built site's links
    python3 tools/check_site.py --against origin/main # also compare with the live branch

--against catches the mistakes that matter most when editing published
essays: a changed publication date, a renamed (URL-breaking) essay file,
or a deleted essay.

Exit code 1 if any ERROR is found. WARNINGs are worth reading but don't block.
Needs only the Python standard library plus PyYAML (pip install pyyaml).
"""
import argparse
import datetime as dt
import os
import re
import subprocess
import sys
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote

try:
    import yaml
except ImportError:
    sys.exit("PyYAML is needed: pip install pyyaml")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ESSAYS = os.path.join(ROOT, "_essays")
IMAGES = os.path.join(ROOT, "assets", "images", "essays")
SLUG_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
FIGURE_RE = re.compile(r"\{%\s*include\s+figure\.html\s+[^%]*?src=\"([^\"]+)\"")
FIGURE_ALT_RE = re.compile(r"\{%\s*include\s+figure\.html\b([^%]*)%\}")
IMAGE_FIELDS = ("cover", "social_image")
REQUIRED = ("title", "excerpt", "category", "date")
WARN_BYTES = 500 * 1024
ERROR_BYTES = 2 * 1024 * 1024

errors, warnings = [], []


def error(msg):
    errors.append(msg)


def warn(msg):
    warnings.append(msg)


def split_front_matter(text, name):
    if not text.startswith("---"):
        error(f"{name}: must start with a '---' front matter block")
        return {}, text
    parts = text.split("\n---", 2)
    if len(parts) < 2:
        error(f"{name}: front matter is not closed with '---'")
        return {}, text
    try:
        data = yaml.safe_load(parts[0][3:]) or {}
    except yaml.YAMLError as exc:
        error(f"{name}: front matter is not valid YAML ({exc.__class__.__name__}). Check quotes and colons.")
        return {}, ""
    body = parts[1].split("\n", 1)[1] if "\n" in parts[1] else ""
    return data, body


def as_date(value):
    if isinstance(value, dt.datetime):
        return value.date()
    if isinstance(value, dt.date):
        return value
    return None


def load_config():
    with open(os.path.join(ROOT, "_config.yml"), encoding="utf-8") as fh:
        return yaml.safe_load(fh)


def check_essays(topics):
    essays = {}
    if not os.path.isdir(ESSAYS):
        warn("_essays/ folder not found: the site has no essays")
        return essays
    titles = {}
    featured = []
    for fname in sorted(os.listdir(ESSAYS)):
        if not fname.endswith(".md"):
            if not fname.startswith("."):
                warn(f"_essays/{fname}: not a .md file, ignored")
            continue
        slug = fname[:-3]
        name = f"_essays/{fname}"
        if not SLUG_RE.match(slug):
            error(f"{name}: file name must be lowercase letters, numbers, and single hyphens")
        with open(os.path.join(ESSAYS, fname), encoding="utf-8") as fh:
            data, body = split_front_matter(fh.read(), name)
        essays[slug] = data

        for field in REQUIRED:
            if not data.get(field):
                error(f"{name}: missing required field '{field}'")
        if data.get("category") and data["category"] not in topics:
            error(f"{name}: category '{data['category']}' is not one of the topics in _config.yml: {', '.join(topics)}")

        date, updated = as_date(data.get("date")), as_date(data.get("updated"))
        if data.get("date") and not date:
            error(f"{name}: date must look like 2026-11-03 (no quotes)")
        if date and date > dt.date.today():
            warn(f"{name}: date {date} is in the future")
        if data.get("updated"):
            if not updated:
                error(f"{name}: updated must look like 2026-11-03 (no quotes)")
            elif date and updated < date:
                error(f"{name}: updated ({updated}) is earlier than date ({date})")

        title = str(data.get("title", "")).strip().lower()
        if title:
            if title in titles:
                error(f"{name}: same title as _essays/{titles[title]}.md (duplicate essay?)")
            titles[title] = slug
        if data.get("featured"):
            featured.append(slug)
        if data.get("placeholder"):
            warn(f"{name}: is marked as placeholder content")

        if re.search(r"^# ", body, re.M):
            warn(f"{name}: uses a '# ' heading; the title is already the main heading, so use '## ' for sections")

        folder = os.path.join(IMAGES, slug)
        wanted = [(field, data[field]) for field in IMAGE_FIELDS if data.get(field)]
        wanted += [("figure", src) for src in FIGURE_RE.findall(body)]
        for field, src in wanted:
            path = os.path.join(folder, str(src))
            if not os.path.isfile(path):
                error(f"{name}: {field} image not found at assets/images/essays/{slug}/{src}")
        if data.get("cover") and not data.get("cover_alt"):
            warn(f"{name}: has a cover but no cover_alt (describe the image for screen readers)")
        for args in FIGURE_ALT_RE.findall(body):
            if "alt=" not in args:
                error(f"{name}: a figure include has no alt text: {{% include figure.html{args}%}}")
    if len(featured) > 1:
        warn(f"several essays are featured ({', '.join(featured)}); the newest of them is shown")
    return essays


def check_images(essays):
    if not os.path.isdir(IMAGES):
        return
    for slug in sorted(os.listdir(IMAGES)):
        folder = os.path.join(IMAGES, slug)
        if not os.path.isdir(folder):
            continue
        if slug not in essays:
            warn(f"assets/images/essays/{slug}/ has no matching essay in _essays/")
        for fname in sorted(os.listdir(folder)):
            path = os.path.join(folder, fname)
            size = os.path.getsize(path)
            rel = f"assets/images/essays/{slug}/{fname}"
            if fname.startswith("."):
                continue
            if size > ERROR_BYTES:
                error(f"{rel} is {size // 1024} KB; resize/compress it (aim for under 500 KB)")
            elif size > WARN_BYTES:
                warn(f"{rel} is {size // 1024} KB; consider compressing it (aim for under 500 KB)")
            if not re.match(r"^[a-z0-9._-]+$", fname):
                warn(f"{rel}: use lowercase letters, numbers, and hyphens in image file names")


def check_against(ref, essays):
    """Compare essays with another branch (normally origin/main, the live site)."""
    try:
        listing = subprocess.run(
            ["git", "ls-tree", "--name-only", f"{ref}:_essays"],
            cwd=ROOT, capture_output=True, text=True, check=True,
        ).stdout.split()
    except subprocess.CalledProcessError:
        warn(f"could not read _essays/ from {ref} (fine if the live site has no essays yet)")
        return
    for fname in listing:
        if not fname.endswith(".md"):
            continue
        slug = fname[:-3]
        if slug not in essays:
            error(f"_essays/{fname} exists on {ref} but not here: deleting or renaming it breaks "
                  f"/articles/{slug}/. Only do this if removal was requested.")
            continue
        old_text = subprocess.run(
            ["git", "show", f"{ref}:_essays/{fname}"], cwd=ROOT, capture_output=True, text=True,
        ).stdout
        old, _ = split_front_matter(old_text, f"{ref}:_essays/{fname}")
        new = essays[slug]
        if as_date(old.get("date")) and as_date(old.get("date")) != as_date(new.get("date")):
            error(f"_essays/{fname}: publication date changed from {as_date(old.get('date'))} to "
                  f"{as_date(new.get('date'))}. Keep the original date; use 'updated' for revisions.")
        if old.get("updated") and not new.get("updated"):
            warn(f"_essays/{fname}: the 'updated' date was removed")
    new_slugs = sorted(set(essays) - {f[:-3] for f in listing})
    for slug in new_slugs:
        print(f"  new essay: /articles/{slug}/")


class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs, self.meta, self.canonical = [], {}, None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for key in ("href", "src"):
            if attrs.get(key) and tag in ("a", "img", "link", "script"):
                self.refs.append(attrs[key])
        if tag == "meta" and (attrs.get("property") or attrs.get("name")):
            self.meta[attrs.get("property") or attrs.get("name")] = attrs.get("content", "")
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href")


def check_built(site_dir, config):
    base = (config.get("baseurl") or "").rstrip("/")
    origin = (config.get("url") or "").rstrip("/")

    def resolve(ref, page_path):
        parsed = urlparse(ref)
        if parsed.scheme in ("mailto", "tel", "javascript", "data"):
            return None
        if parsed.netloc:
            if origin and ref.startswith(origin + base):
                path = parsed.path
            else:
                return None  # external link
        else:
            path = parsed.path
        if not path:
            return None
        if path.startswith("/"):
            if base and not path.startswith(base + "/") and path != base:
                return ("bad-base", path)
            path = path[len(base):]
            target = os.path.join(site_dir, unquote(path).lstrip("/"))
        else:
            target = os.path.join(os.path.dirname(page_path), unquote(path))
        if target.endswith("/") or os.path.isdir(target):
            target = os.path.join(target, "index.html")
        return ("ok", target)

    pages = 0
    for dirpath, _, files in os.walk(site_dir):
        for fname in files:
            if not fname.endswith(".html"):
                continue
            pages += 1
            page = os.path.join(dirpath, fname)
            rel = os.path.relpath(page, site_dir)
            parser = LinkParser()
            with open(page, encoding="utf-8") as fh:
                parser.feed(fh.read())
            for ref in parser.refs:
                result = resolve(ref, page)
                if not result:
                    continue
                kind, target = result
                if kind == "bad-base":
                    error(f"{rel}: link '{ref}' is missing the {base} prefix (use the relative_url filter)")
                elif not os.path.exists(target):
                    error(f"{rel}: broken link or image '{ref}'")
            noindex = "noindex" in parser.meta.get("robots", "")
            if not noindex and rel != "404.html":
                if not parser.canonical:
                    error(f"{rel}: no canonical URL")
                for key in ("description", "og:title", "og:description", "og:image", "og:url", "twitter:card"):
                    if not parser.meta.get(key):
                        error(f"{rel}: missing <meta {key}>")
            og_image = parser.meta.get("og:image")
            if og_image:
                result = resolve(og_image, page)
                if result and result[0] == "ok" and not os.path.exists(result[1]):
                    error(f"{rel}: social image not found: {og_image}")
    print(f"  checked {pages} built pages in {os.path.relpath(site_dir, ROOT)}/")


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--built", metavar="DIR", help="also check links in a built site (e.g. _site)")
    parser.add_argument("--against", metavar="REF", help="compare essays with a git ref (e.g. origin/main)")
    args = parser.parse_args()

    config = load_config()
    topics = config.get("topics") or []
    print("Checking The Quiet Argument…")
    essays = check_essays(topics)
    print(f"  {len(essays)} essay(s) in _essays/")
    check_images(essays)
    if args.against:
        check_against(args.against, essays)
    if args.built:
        check_built(os.path.join(ROOT, args.built), config)

    for msg in warnings:
        print(f"WARNING  {msg}")
    for msg in errors:
        print(f"ERROR    {msg}")
    if errors:
        print(f"\n{len(errors)} error(s). Fix these before publishing.")
        sys.exit(1)
    print("\nNo errors." + (f" {len(warnings)} warning(s) above." if warnings else ""))


if __name__ == "__main__":
    main()
