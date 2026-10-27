/*
 * Small enhancements for The Quiet Argument. Pages are fully readable
 * without this file; it adds archive search and filtering, share buttons,
 * the reading-progress bar, and tidy handling of missing images.
 * Essays and lists themselves are built by GitHub Pages from _essays/.
 */
(function () {
  "use strict";

  /* ---------- Essays archive: search + topic filter ---------- */

  function setupArchive() {
    var tools = document.querySelector("[data-archive-tools]");
    var archive = document.querySelector("[data-archive]");
    if (!tools || !archive) return;

    var input = tools.querySelector("[data-archive-search]");
    var chips = Array.prototype.slice.call(tools.querySelectorAll("[data-topic]"));
    var status = tools.querySelector("[data-archive-status]");
    var empty = archive.querySelector("[data-archive-empty]");
    var cards = Array.prototype.slice.call(archive.querySelectorAll(".card"));
    var years = Array.prototype.slice.call(archive.querySelectorAll("[data-archive-year]"));

    var params = new URLSearchParams(window.location.search);
    var topic = params.get("topic") || "";
    var validTopic = chips.some(function (c) { return c.getAttribute("data-topic") === topic; });
    if (!validTopic) topic = "";
    input.value = params.get("q") || "";

    function topicName(slug) {
      var chip = chips.filter(function (c) { return c.getAttribute("data-topic") === slug; })[0];
      return chip ? chip.textContent : "";
    }

    function apply() {
      var words = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
      var shown = 0;

      cards.forEach(function (card) {
        var text = card.getAttribute("data-search") || "";
        var matchesTopic = !topic || card.getAttribute("data-topic") === topic;
        var matchesWords = words.every(function (w) { return text.indexOf(w) !== -1; });
        var visible = matchesTopic && matchesWords;
        card.hidden = !visible;
        if (visible) shown++;
      });

      years.forEach(function (year) {
        year.hidden = !year.querySelector(".card:not([hidden])");
      });

      chips.forEach(function (chip) {
        chip.setAttribute("aria-pressed", String(chip.getAttribute("data-topic") === topic));
      });

      var filtering = topic || words.length;
      if (empty) {
        empty.hidden = shown > 0;
        var emptyText = empty.querySelector("[data-archive-empty-text]");
        if (emptyText) {
          emptyText.textContent = topic && !words.length
            ? "Nothing published in " + topicName(topic) + " yet."
            : "No essays match your search.";
        }
      }
      if (status) {
        if (!filtering) {
          status.textContent = "";
        } else {
          var label = shown === 1 ? "1 essay" : shown + " essays";
          status.textContent = label + (topic ? " in " + topicName(topic) : "") +
            (words.length ? " matching “" + input.value.trim() + "”" : "") + ".";
        }
      }

      // Keep the address in sync so filtered views can be shared or bookmarked.
      var query = new URLSearchParams();
      if (topic) query.set("topic", topic);
      if (input.value.trim()) query.set("q", input.value.trim());
      var qs = query.toString();
      window.history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : ""));
    }

    input.addEventListener("input", apply);
    tools.addEventListener("click", function (event) {
      var chip = event.target.closest("[data-topic]");
      if (!chip) return;
      topic = chip.getAttribute("data-topic");
      apply();
    });
    var reset = archive.querySelector("[data-archive-reset]");
    if (reset) {
      reset.addEventListener("click", function () {
        topic = "";
        input.value = "";
        apply();
        input.focus();
      });
    }

    tools.hidden = false;
    apply();
  }

  /* ---------- Share buttons on essays ---------- */

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // Older browsers: copy via a temporary text field.
    return new Promise(function (resolve, reject) {
      var field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(field);
      if (ok) { resolve(); } else { reject(new Error("copy failed")); }
    });
  }

  function setupShare() {
    var box = document.querySelector("[data-share]");
    if (!box) return;
    var url = box.getAttribute("data-url");
    var title = box.getAttribute("data-title");
    var status = box.querySelector("[data-share-status]");
    var nativeButton = box.querySelector("[data-share-native]");
    var copyButton = box.querySelector("[data-share-copy]");
    var timer;

    function say(message) {
      status.textContent = message;
      window.clearTimeout(timer);
      timer = window.setTimeout(function () { status.textContent = ""; }, 5000);
    }

    function copyLink(successMessage) {
      copyText(url).then(
        function () { say(successMessage || "Link copied."); },
        function () { say("Couldn't copy automatically. The link is: " + url); }
      );
    }

    var canShare = typeof navigator.share === "function";
    if (!canShare) {
      // No share sheet on this device: the button copies the link instead.
      nativeButton.textContent = "Share";
    }

    nativeButton.addEventListener("click", function () {
      if (canShare) {
        navigator.share({ title: title, url: url }).catch(function (error) {
          if (error && error.name === "AbortError") return; // closed the share sheet
          copyLink("Sharing wasn't available, so the link was copied instead.");
        });
      } else {
        copyLink("Link copied. Paste it wherever you'd like to share it.");
      }
    });

    copyButton.addEventListener("click", function () { copyLink(); });
    box.hidden = false;
  }

  /* ---------- Reading progress bar ---------- */

  function setupProgress() {
    var bar = document.querySelector("[data-progress]");
    var article = document.querySelector(".article");
    if (!bar || !article) return;
    var ticking = false;
    function update() {
      var rect = article.getBoundingClientRect();
      var total = rect.height - window.innerHeight;
      var progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
      bar.style.transform = "scaleX(" + progress + ")";
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  /* ---------- Missing optional images ---------- */

  // If a cover or essay image fails to load, remove its frame rather than
  // showing a broken-image icon.
  function hideBrokenImage(img) {
    var frame = img.closest("[data-optional-image]");
    if (!frame) return;
    var card = frame.closest(".has-cover");
    if (card) card.classList.remove("has-cover");
    frame.remove();
  }

  document.addEventListener("error", function (event) {
    if (event.target && event.target.tagName === "IMG") hideBrokenImage(event.target);
  }, true);

  // Catch images that failed before this script ran.
  document.querySelectorAll("[data-optional-image] img").forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) hideBrokenImage(img);
  });

  setupArchive();
  setupShare();
  setupProgress();
})();
