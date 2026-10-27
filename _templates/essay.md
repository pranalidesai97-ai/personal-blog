---
# ESSAY TEMPLATE. Copy this file to _essays/your-essay-slug.md and fill it in.
# The file name (without .md) becomes the permanent address:
#   _essays/the-cost-of-convenience.md -> /articles/the-cost-of-convenience/
# Never rename a published essay's file: that would break its address.
# (This folder starts with "_", so the template itself is never published.)

# --- Required -------------------------------------------------------------
title: "Essay title"
excerpt: "One or two sentences for cards, lists, and search results."
category: "Business"        # one of the topics in _config.yml, spelled exactly
date: 2026-01-01            # first publication date; never change it after publishing

# --- Optional -------------------------------------------------------------
subtitle: "A sentence that introduces the essay, shown under the title."
# updated: 2026-02-01       # add when a meaningful revision is made (not for typo fixes)
# reading_time: 7           # minutes; leave out to calculate automatically

# Cover image: put the file in assets/images/essays/<your-essay-slug>/
# cover: "cover.jpg"
# cover_alt: "What the image shows, for people who can't see it."
# cover_caption: "Optional caption, including a photo credit if you have one."

# Search engines and social previews (optional)
# seo_title: "A different title for search results, if needed"
# description: "Meta description for search results (otherwise the excerpt is used)."
# social_image: "social.jpg" # 1200 × 630 image in the essay's image folder (otherwise the cover is used)

# featured: true            # show on the home page as the featured essay
# dropcap: false            # turn off the large first letter
# comments: false           # hide reactions and comments on this essay
---

Your opening paragraph. Write in plain text; leave a blank line between paragraphs.

## A section heading

Use **bold**, *italic*, and [links](https://example.com). Link to another essay like
this: [another essay]({{ '/articles/another-essay-slug/' | relative_url }}).

> A quotation goes on a line starting with ">".

- A bulleted list
- uses dashes

1. A numbered list
2. uses numbers

A line worth repeating, shown as a large pull quote.
{: .pullquote}

{% include figure.html src="photo.jpg" alt="Describe the image." caption="Optional caption." %}

---

### A smaller heading

A three-dash line above makes a section break.[^1]

[^1]: A footnote.
