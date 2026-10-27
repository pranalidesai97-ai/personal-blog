/*
 * Site behaviour. You normally don't need to edit this file:
 * settings live in config.js and the list of essays in posts.js.
 */
(function () {
  "use strict";

  var config = window.SITE_CONFIG || {};
  var html = document.documentElement;
  // Relative path from the current page back to the site root, e.g. "../../".
  var root = html.getAttribute("data-root") || "";

  var posts = (window.POSTS || []).slice().sort(function (a, b) {
    return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
  });

  /* ---------- Helpers ---------- */

  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Parse "YYYY-MM-DD" as a local date so it never shifts by a day.
  function parseDate(iso) {
    var parts = String(iso).split("-");
    return new Date(+parts[0], (+parts[1] || 1) - 1, +parts[2] || 1);
  }

  var dateFormatter;
  try {
    dateFormatter = new Intl.DateTimeFormat(config.dateLocale || "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  } catch (e) {
    dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }

  function formatDate(iso) {
    return dateFormatter.format(parseDate(iso));
  }

  function postUrl(post) {
    return root + "articles/" + encodeURIComponent(post.slug) + "/";
  }

  // A cover is a file in the essay's folder, or a full web address.
  function coverUrl(post) {
    if (!post.cover) return "";
    return /^(https?:)?\/\//.test(post.cover) ? post.cover : postUrl(post) + post.cover;
  }

  function topicUrl(topic) {
    return root + "articles/?topic=" + slugify(topic);
  }

  function postMeta(post) {
    var meta = '<time datetime="' + escapeHTML(post.date) + '">' + escapeHTML(formatDate(post.date)) + "</time>";
    if (post.readingTime) {
      meta += '<span class="meta-sep" aria-hidden="true">·</span>' + escapeHTML(post.readingTime) + " min read";
    }
    return meta;
  }

  function placeholderBadge(post) {
    return post.placeholder ? '<span class="badge">Placeholder</span>' : "";
  }

  function card(post) {
    var cover = coverUrl(post);
    return (
      '<li class="card' + (cover ? " has-cover" : "") + '">' +
        (cover
          ? '<div class="card-cover"><img src="' + escapeHTML(cover) + '" alt="' + escapeHTML(post.coverAlt || "") + '" loading="lazy"></div>'
          : "") +
        '<div class="card-body">' +
          '<p class="labels"><span class="label label--marker">' + escapeHTML(post.topic) + "</span>" + placeholderBadge(post) + "</p>" +
          '<h3 class="card-title"><a href="' + escapeHTML(postUrl(post)) + '">' + escapeHTML(post.title) + "</a></h3>" +
          '<p class="card-excerpt">' + escapeHTML(post.excerpt) + "</p>" +
          '<p class="meta">' + postMeta(post) + "</p>" +
        "</div>" +
      "</li>"
    );
  }

  /* ---------- Every page: name, title, byline, footer ---------- */

  // The 404 page sets a <base> tag, which would make "#section" links point
  // at the home page. Keep them on the current page instead.
  function fixHashLinks() {
    if (!document.querySelector("base")) return;
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.setAttribute("href", window.location.pathname + window.location.search + a.getAttribute("href"));
    });
  }

  function applyConfig() {
    var siteName = config.siteName;
    if (siteName) {
      document.querySelectorAll("[data-site-name]").forEach(function (el) {
        el.textContent = siteName;
      });
      var pageTitle = html.getAttribute("data-page-title");
      document.title = pageTitle ? pageTitle + " — " + siteName : siteName;
    }
    if (config.tagline) {
      document.querySelectorAll("[data-site-tagline]").forEach(function (el) {
        el.textContent = config.tagline;
      });
    }
    // Article byline: shown only when an author name is set in config.js.
    if (config.author) {
      document.querySelectorAll("[data-byline]").forEach(function (el) {
        var name = el.querySelector("[data-site-author]");
        if (name) name.textContent = config.author;
        el.hidden = false;
      });
    }
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function renderSocial() {
    var links = (config.social || []).filter(function (link) {
      return link && link.url;
    });
    document.querySelectorAll("[data-social-links]").forEach(function (list) {
      // A block wraps the list and its heading; it may hold a fallback message.
      var block = list.closest("[data-social-block]") || list;
      var fallback = block.querySelector("[data-social-empty]");
      if (!links.length) {
        list.hidden = true;
        if (fallback) {
          fallback.hidden = false;
          block.hidden = false;
        } else {
          block.hidden = true;
        }
        return;
      }
      if (fallback) fallback.hidden = true;
      block.hidden = false;
      list.innerHTML = links
        .map(function (link) {
          var external = !/^mailto:/i.test(link.url);
          return (
            '<li><a href="' + escapeHTML(link.url) + '"' +
            (external ? ' rel="me noopener" target="_blank"' : "") +
            ">" + escapeHTML(link.label) + "</a></li>"
          );
        })
        .join("");
      list.hidden = false;
    });
  }

  /* ---------- Home page ---------- */

  function renderTopicLinks() {
    var list = document.querySelector("[data-topic-list]");
    if (!list) return;
    list.innerHTML = (config.topics || [])
      .map(function (topic) {
        return '<li><a class="chip" href="' + escapeHTML(topicUrl(topic)) + '">' + escapeHTML(topic) + "</a></li>";
      })
      .join("");
  }

  // Point the "Read the latest essay" button at the newest essay.
  function linkLatest() {
    if (!posts.length) return;
    document.querySelectorAll("[data-latest-link]").forEach(function (a) {
      a.setAttribute("href", postUrl(posts[0]));
    });
  }

  function renderFeatured() {
    var target = document.querySelector("[data-featured]");
    if (!target) return null;
    var featured = posts.filter(function (p) { return p.featured; })[0] || posts[0];
    if (!featured) {
      target.innerHTML = '<p class="empty-state">The first essay is being written.</p>';
      return null;
    }
    var cover = coverUrl(featured);
    target.innerHTML =
      '<article class="feature' + (cover ? " has-cover" : "") + '">' +
        (cover
          ? '<a class="feature-cover" href="' + escapeHTML(postUrl(featured)) + '" tabindex="-1" aria-hidden="true">' +
            '<img src="' + escapeHTML(cover) + '" alt="' + escapeHTML(featured.coverAlt || "") + '"></a>'
          : "") +
        '<div class="feature-body">' +
          '<p class="labels"><a class="label label--marker" href="' + escapeHTML(topicUrl(featured.topic)) + '">' +
            escapeHTML(featured.topic) + "</a>" + placeholderBadge(featured) + "</p>" +
          '<h3 class="feature-title"><a href="' + escapeHTML(postUrl(featured)) + '">' + escapeHTML(featured.title) + "</a></h3>" +
          '<p class="feature-excerpt">' + escapeHTML(featured.excerpt) + "</p>" +
          '<p class="meta">' + postMeta(featured) + "</p>" +
          '<a class="text-link" href="' + escapeHTML(postUrl(featured)) + '">Read the essay <span aria-hidden="true">→</span></a>' +
        "</div>" +
      "</article>";
    return featured;
  }

  // Latest essays, not repeating the featured one. If there are no others
  // yet, the whole section is hidden rather than showing an empty box.
  function renderLatest(exclude) {
    var target = document.querySelector("[data-latest]");
    if (!target) return;
    var limit = parseInt(target.getAttribute("data-latest"), 10) || 6;
    var latest = posts.filter(function (p) { return p !== exclude; }).slice(0, limit);
    var section = target.closest("[data-latest-section]");
    if (!latest.length) {
      if (section) section.hidden = true;
      return;
    }
    target.innerHTML = latest.map(card).join("");
    if (section) section.hidden = false;
  }

  /* ---------- Essays archive ---------- */

  function renderArchive() {
    var target = document.querySelector("[data-archive]");
    if (!target) return;
    var filterBar = document.querySelector("[data-archive-filter]");
    var status = document.querySelector("[data-archive-status]");

    // Topics from config.js, plus any used in posts.js but missing there.
    var topics = (config.topics || []).slice();
    posts.forEach(function (p) {
      if (p.topic && topics.indexOf(p.topic) === -1) topics.push(p.topic);
    });

    function topicFromSlug(slug) {
      return topics.filter(function (t) { return slugify(t) === slug; })[0] || null;
    }

    var active = topicFromSlug(new URLSearchParams(window.location.search).get("topic"));

    function draw() {
      var visible = active ? posts.filter(function (p) { return p.topic === active; }) : posts;

      if (filterBar) {
        filterBar.hidden = !posts.length;
        filterBar.innerHTML = [null].concat(topics)
          .map(function (topic) {
            return (
              '<button type="button" class="chip" data-topic="' + escapeHTML(topic ? slugify(topic) : "") +
              '" aria-pressed="' + (topic === active) + '">' + escapeHTML(topic || "All essays") + "</button>"
            );
          })
          .join("");
      }

      if (status) {
        status.innerHTML = active
          ? "Showing essays filed under <strong>" + escapeHTML(active) + "</strong>."
          : "";
        status.hidden = !active;
      }

      if (!visible.length) {
        target.innerHTML = active
          ? '<p class="empty-state">Nothing filed under ' + escapeHTML(active) + ' yet. <a href="./">See all essays</a>.</p>'
          : '<p class="empty-state">No essays have been published yet. The first one is being written.</p>';
        return;
      }

      var years = [];
      var byYear = {};
      visible.forEach(function (post) {
        var year = String(post.date).slice(0, 4);
        if (!byYear[year]) {
          byYear[year] = [];
          years.push(year);
        }
        byYear[year].push(post);
      });

      target.innerHTML = years
        .map(function (year) {
          return (
            '<section class="archive-year" aria-labelledby="year-' + year + '">' +
              '<h2 class="archive-year-label" id="year-' + year + '">' + year + "</h2>" +
              '<ol class="card-grid">' + byYear[year].map(card).join("") + "</ol>" +
            "</section>"
          );
        })
        .join("");
    }

    if (filterBar) {
      filterBar.addEventListener("click", function (event) {
        var button = event.target.closest("button[data-topic]");
        if (!button) return;
        active = topicFromSlug(button.getAttribute("data-topic"));
        var url = active ? "?topic=" + slugify(active) : window.location.pathname;
        window.history.replaceState(null, "", url);
        draw();
      });
    }

    draw();
  }

  /* ---------- Article page ---------- */

  function enhanceArticle() {
    var slug = html.getAttribute("data-slug");
    if (!slug) return;

    // Reading time, if the article doesn't state one.
    var readingEl = document.querySelector("[data-reading-time]");
    var body = document.querySelector(".prose");
    if (readingEl && !readingEl.textContent.trim() && body) {
      var words = body.textContent.trim().split(/\s+/).length;
      readingEl.textContent = Math.max(1, Math.round(words / 230)) + " min read";
    }

    // Related essays: same topic first, then the most recent others.
    var related = document.querySelector("[data-related]");
    var current = posts.filter(function (p) { return p.slug === slug; })[0];
    if (related) {
      var others = posts.filter(function (p) { return p.slug !== slug; });
      var picks = current
        ? others.filter(function (p) { return p.topic === current.topic; })
            .concat(others.filter(function (p) { return p.topic !== current.topic; }))
        : others;
      picks = picks.slice(0, 3);
      var list = related.querySelector("[data-related-list]");
      if (picks.length && list) {
        list.innerHTML = picks.map(card).join("");
        related.hidden = false;
      }
    }

    // Reading progress bar.
    var bar = document.querySelector("[data-progress]");
    var article = document.querySelector(".article");
    if (bar && article) {
      var ticking = false;
      var update = function () {
        var rect = article.getBoundingClientRect();
        var total = rect.height - window.innerHeight;
        var progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
        bar.style.transform = "scaleX(" + progress + ")";
        ticking = false;
      };
      var onScroll = function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(update);
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      update();
    }
  }

  /* ---------- Run ---------- */

  fixHashLinks();
  applyConfig();
  renderSocial();
  renderTopicLinks();
  linkLatest();
  renderLatest(renderFeatured());
  renderArchive();
  enhanceArticle();
})();
