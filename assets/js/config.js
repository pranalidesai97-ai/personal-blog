/*
 * Site settings for The Quiet Argument.
 *
 * Changes here appear on every page: the publication name in the header and
 * footer, the browser-tab titles, the footer description, and social links.
 */
window.SITE_CONFIG = {
  // The publication's name.
  siteName: "The Quiet Argument",

  // Short description shown in the footer.
  tagline:
    "Essays on business, human behaviour, relationships, money, and the details of everyday life.",

  // Optional. Add your name (e.g. "Jane Smith") to show "By Jane Smith" on
  // every article. Leave it empty ("") to publish without a byline.
  author: "",

  // Date format. "en-GB" gives "27 October 2026"; "en-US" gives "October 27, 2026".
  dateLocale: "en-GB",

  // The topics. Each article in posts.js uses one of these names exactly.
  topics: [
    "Business",
    "Human behaviour",
    "Relationships",
    "Personal growth",
    "Money",
    "Everyday observations"
  ],

  // Social links, shown in the footer and on the About page.
  // Leave a url empty ("") to hide that link. For email use "mailto:you@example.com".
  social: [
    { label: "Email", url: "" },
    { label: "LinkedIn", url: "" },
    { label: "Instagram", url: "" },
    { label: "Substack", url: "" }
  ]
};
