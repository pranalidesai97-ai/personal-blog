/*
 * The list of published articles.
 *
 * The home page, the essays archive, and the "previous / next" links at the
 * bottom of each article are all built from this list. Order does not
 * matter — articles are sorted by date automatically (newest first).
 *
 * To publish a new article:
 *   1. Copy the folder articles/_template/ to articles/your-article-slug/
 *   2. Write the article in articles/your-article-slug/index.html
 *   3. Add an entry below with the same slug.
 *
 * Fields:
 *   slug         Folder name inside articles/ (lowercase, hyphens, no spaces).
 *   title        Article title.
 *   excerpt      One or two sentences shown on cards and lists.
 *   date         Publication date as "YYYY-MM-DD".
 *   topic        One of the topics listed in config.js.
 *   readingTime  Minutes to read (optional).
 *   featured     true to show it as the featured essay on the home page
 *                (optional; if none is featured, the newest article is used).
 *   placeholder  true adds a "Placeholder" label (only for the sample article).
 */
window.POSTS = [
  {
    slug: "a-sample-essay",
    title: "On Noticing the Small Things",
    excerpt:
      "A placeholder essay that shows how articles look on this site — headings, quotations, lists, and notes. Replace it with your own writing.",
    date: "2026-10-27",
    topic: "Everyday observations",
    readingTime: 5,
    featured: true,
    placeholder: true
  }
];
