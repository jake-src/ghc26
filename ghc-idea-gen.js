// ─────────────────────────────────────────────────────────────────────────────
// GHC 2026 — Fundraiser idea generator v1
// ─────────────────────────────────────────────────────────────────────────────
(function() {
const IDEAS = (typeof GHC_IDEAS !== 'undefined' && Array.isArray(GHC_IDEAS)) ? GHC_IDEAS : [];

  // Defense-in-depth HTML escaper for data interpolated into innerHTML.
  // Trust boundary today = anyone with push access to jake-src/ghc26.
  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, function(c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  let lastIndex = -1;

  function getRandomIndex() {
    let idx;
    do { const arr = new Uint32Array(1); crypto.getRandomValues(arr); idx = arr[0] % IDEAS.length; } while (idx === lastIndex && IDEAS.length > 1);
    return idx;
  }

  function renderIdea(idx) {
    const idea = IDEAS[idx];
    if (!idea) return;
    const starCount = Math.max(1, Math.min(5, Number(idea.difficulty) || 1));
    const starsHtml = '<span style="color:#F5C842;font-size:1em">★</span>'.repeat(starCount) + '<span style="color:#ddd;font-size:1em">☆</span>'.repeat(5 - starCount);
    const cleanLevelUp = (idea.levelUp || "").replace(/^level up:\s*/i, "");
    const card = document.getElementById("ideaCard");
    const typeEl = document.getElementById("ideaType");
    const titleEl = document.getElementById("ideaTitle");
    const sparkEl = document.getElementById("ideaSpark");
    if (!card || !typeEl || !titleEl || !sparkEl) return;
    let levelUp = card.querySelector(".idea-gen-levelup");
    lastIndex = idx;
    typeEl.innerHTML = '<span class="inspo-badge ' + escapeHtml(idea.badge) + '">' + escapeHtml(idea.type) + '</span><span class="idea-gen-stars">' + starsHtml + '</span>';
    titleEl.textContent = idea.title;
    sparkEl.textContent = idea.spark;
    if (!levelUp) {
      levelUp = document.createElement("div");
      levelUp.className = "idea-gen-levelup";
      card.appendChild(levelUp);
    }
    levelUp.innerHTML = '<span class="idea-gen-levelup-label">⭐️ Social Challenge</span>' + escapeHtml(cleanLevelUp);
  }

  function shuffleIdea() {
    const card = document.getElementById("ideaCard");
    if (!card) {
      renderIdea(getRandomIndex());
      return;
    }
    card.classList.add("fading");
    setTimeout(function() {
      renderIdea(getRandomIndex());
      card.classList.remove("fading");
    }, 220);
  }
  window.shuffleIdea = shuffleIdea;

  // Idea generator init — standalone, not coupled to share/modal setup
  (function() {
    let ideasInited = false;
    function _initIdeas() {
      if (ideasInited) return;
      if (!IDEAS || !IDEAS.length) return;
      ideasInited = true;
      renderIdea(getRandomIndex());
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", _initIdeas, { once: true });
      window.addEventListener("load", _initIdeas, { once: true });
    } else {
      _initIdeas();
    }
    setTimeout(function() {
      const titleEl = document.getElementById("ideaTitle");
      if (titleEl && titleEl.textContent.trim() === "Loading...") {
        titleEl.textContent = 'Loading... ';
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = 'Refresh page';
        link.setAttribute('style', 'font-size:0.78rem;font-weight:600;color:#C8102E;text-decoration:underline;text-underline-offset:2px;margin-left:6px;');
        link.addEventListener('click', function(e) { e.preventDefault(); location.reload(); });
        titleEl.appendChild(link);
      }
    }, 3000);
  })();
})();
