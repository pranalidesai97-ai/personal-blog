/*
 * Site behaviour. You normally don't need to edit this file —
 * site settings live in config.js and the article list in posts.js.
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

  /* ---------- Site-wide: name, title, footer ---------- */

  function applyConfig() {
    var siteName = config.siteName;
    if (siteName) {
      document.querySelectorAll("[data-site-name]").forEach(function (el) {
        el.textContent = siteName;
      });
      var pageTitle = html.getAttribute("data-page-title");
      document.title = pageTitle ? pageTitle + " — " + siteName : siteName;
    }
    if (config.author) {
      document.querySelectorAll("[data-site-author]").forEach(function (el) {
        el.textContent = config.author;
      });
    }
    if (config.tagline) {
      document.querySelectorAll("[data-site-tagline]").forEach(function (el) {
        el.textContent = config.tagline;
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

  function renderTopics() {
    var list = document.querySelector("[data-topic-list]");
    if (!list) return;
    list.innerHTML = (config.topics || [])
      .map(function (topic) {
        return '<li><a href="' + escapeHTML(topicUrl(topic)) + '">' + escapeHTML(topic) + "</a></li>";
      })
      .join("");
  }

  function renderFeatured() {
    var target = document.querySelector("[data-featured]");
    if (!target) return null;
    var featured = posts.filter(function (p) { return p.featured; })[0] || posts[0];
    if (!featured) {
      target.innerHTML = '<p class="empty-state">The first essay is on its way.</p>';
      return null;
    }
    target.innerHTML =
      '<article class="featured-card">' +
        '<p class="eyebrow">' +
          '<a href="' + escapeHTML(topicUrl(featured.topic)) + '">' + escapeHTML(featured.topic) + "</a>" +
          placeholderBadge(featured) +
        "</p>" +
        '<h2 class="featured-title"><a href="' + escapeHTML(postUrl(featured)) + '">' + escapeHTML(featured.title) + "</a></h2>" +
        '<p class="featured-excerpt">' + escapeHTML(featured.excerpt) + "</p>" +
        '<p class="post-meta">' + postMeta(featured) + "</p>" +
        '<a class="read-link" href="' + escapeHTML(postUrl(featured)) + '">Read the essay <span aria-hidden="true">→</span></a>' +
      "</article>";
    return featured;
  }

  function renderLatest(exclude) {
    var target = document.querySelector("[data-latest]");
    if (!target) return;
    var limit = parseInt(target.getAttribute("data-latest"), 10) || 6;
    var latest = posts.filter(function (p) { return p !== exclude; }).slice(0, limit);
    if (!latest.length) {
      target.innerHTML =
        '<p class="empty-state">More essays are on the way. In the meantime, the ' +
        '<a href="' + escapeHTML(root) + 'articles/">archive</a> collects everything published so far.</p>';
      return;
    }
    target.innerHTML =
      '<ol class="post-list">' +
      latest
        .map(function (post) {
          return (
            '<li class="post-row">' +
              '<p class="post-row-meta">' + postMeta(post) + "</p>" +
              '<div class="post-row-body">' +
                '<p class="eyebrow"><a href="' + escapeHTML(topicUrl(post.topic)) + '">' + escapeHTML(post.topic) + "</a>" + placeholderBadge(post) + "</p>" +
                '<h3 class="post-row-title"><a href="' + escapeHTML(postUrl(post)) + '">' + escapeHTML(post.title) + "</a></h3>" +
                '<p class="post-row-excerpt">' + escapeHTML(post.excerpt) + "</p>" +
              "</div>" +
            "</li>"
          );
        })
        .join("") +
      "</ol>";
  }

  /* ---------- Archive page ---------- */

  function card(post) {
    return (
      '<li class="card">' +
        '<p class="eyebrow">' + escapeHTML(post.topic) + placeholderBadge(post) + "</p>" +
        '<h3 class="card-title"><a href="' + escapeHTML(postUrl(post)) + '">' + escapeHTML(post.title) + "</a></h3>" +
        '<p class="card-excerpt">' + escapeHTML(post.excerpt) + "</p>" +
        '<p class="post-meta">' + postMeta(post) + "</p>" +
      "</li>"
    );
  }

  function renderArchive() {
    var target = document.querySelector("[data-archive]");
    if (!target) return;
    var filterBar = document.querySelector("[data-archive-filter]");
    var status = document.querySelector("[data-archive-status]");

    // Topics that actually have articles, in the order given in config.js.
    var knownTopics = (config.topics || []).slice();
    posts.forEach(function (p) {
      if (p.topic && knownTopics.indexOf(p.topic) === -1) knownTopics.push(p.topic);
    });
    var usedTopics = knownTopics.filter(function (t) {
      return posts.some(function (p) { return p.topic === t; });
    });

    function topicFromSlug(slug) {
      return knownTopics.filter(function (t) { return slugify(t) === slug; })[0] || null;
    }

    var params = new URLSearchParams(window.location.search);
    var active = topicFromSlug(params.get("topic"));

    function draw() {
      var visible = active ? posts.filter(function (p) { return p.topic === active; }) : posts;

      if (filterBar) {
        if (usedTopics.length > 1) {
          filterBar.hidden = false;
          filterBar.innerHTML = [null].concat(usedTopics)
            .map(function (topic) {
              var pressed = topic === active;
              return (
                '<button type="button" class="chip" data-topic="' + escapeHTML(topic ? slugify(topic) : "") + '" aria-pressed="' + pressed + '">' +
                escapeHTML(topic || "All") + "</button>"
              );
            })
            .join("");
        } else {
          filterBar.hidden = true;
        }
      }

      if (status) {
        status.innerHTML = active
          ? "Filed under <strong>" + escapeHTML(active) + '</strong> · <a href="./">View all essays</a>'
          : "";
        status.hidden = !active;
      }

      if (!visible.length) {
        target.innerHTML = active
          ? '<p class="empty-state">Nothing filed under ' + escapeHTML(active) + ' yet. <a href="./">See all essays</a>.</p>'
          : '<p class="empty-state">No essays have been published yet.</p>';
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

    // Previous / next links, from posts.js.
    var nav = document.querySelector("[data-article-nav]");
    var index = posts.findIndex(function (p) { return p.slug === slug; });
    if (nav && index !== -1) {
      var newer = posts[index - 1];
      var older = posts[index + 1];
      var parts = [];
      if (older) {
        parts.push(
          '<a class="article-nav-link" href="' + escapeHTML(postUrl(older)) + '" rel="prev">' +
          '<span class="eyebrow">Previous essay</span><span class="article-nav-title">' + escapeHTML(older.title) + "</span></a>"
        );
      }
      if (newer) {
        parts.push(
          '<a class="article-nav-link article-nav-next" href="' + escapeHTML(postUrl(newer)) + '" rel="next">' +
          '<span class="eyebrow">Next essay</span><span class="article-nav-title">' + escapeHTML(newer.title) + "</span></a>"
        );
      }
      if (parts.length) {
        nav.innerHTML = parts.join("");
        nav.hidden = false;
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

  // The 404 page sets a <base> tag, which would make "#section" links point
  // at the home page. Keep them on the current page instead.
  function fixHashLinks() {
    if (!document.querySelector("base")) return;
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.setAttribute("href", window.location.pathname + window.location.search + a.getAttribute("href"));
    });
  }

  /* ---------- Run ---------- */

  fixHashLinks();
  applyConfig();
  renderSocial();
  renderTopics();
  renderLatest(renderFeatured());
  renderArchive();
  enhanceArticle();
})();
