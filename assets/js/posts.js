/*
 * The list of published essays.
 *
 * The home page, the essays archive, and the "Related essays" at the end of
 * each article are all built from this list. Order doesn't matter: essays are
 * sorted by date automatically, newest first.
 *
 * To publish a new essay:
 *   1. Create articles/your-essay-slug/index.html (copy articles/_template/index.html).
 *   2. Add an entry below with the same slug.
 * An article that isn't listed here stays unlisted: it works by direct link
 * only, which is handy for drafts.
 *
 * Fields:
 *   slug         Folder name inside articles/ (lowercase letters, numbers, hyphens).
 *   title        Essay title.
 *   excerpt      One or two sentences for cards and lists.
 *   date         Publication date as "YYYY-MM-DD".
 *   topic        One of the topics in config.js, spelled exactly the same.
 *   readingTime  Minutes to read (optional).
 *   cover        Optional cover image: a file name inside the essay's folder,
 *                e.g. "cover.jpg". Leave it out for a text-only card.
 *   coverAlt     Short description of the cover image (for screen readers).
 *   featured     true to feature it on the home page (optional; otherwise the
 *                newest essay is featured).
 *   placeholder  true shows a "Placeholder" label (sample content only).
 *
 * Remember the comma between entries:  { ... },  { ... }
 */
window.POSTS = [
  {
    slug: "a-sample-essay",
    title: "On Noticing the Small Things",
    excerpt:
      "A placeholder essay that shows how writing looks on this site: headings, quotations, lists, and notes. Replace it with your own essay.",
    date: "2026-10-27",
    topic: "Everyday observations",
    readingTime: 5,
    featured: true,
    placeholder: true
  }
];
