// ─────────────────────────────────────────────────────────────────────────────
// GHC 2026 — Scroll reveal / IntersectionObserver v1
// ─────────────────────────────────────────────────────────────────────────────
(function(){
  try {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    function revealNow(el) {
      el.classList.add('is-visible');
    }

    function revealAllNow() {
      for (const el of els) revealNow(el);
    }

    function revealHashTarget() {
      if (!window.location.hash) return;
      let hashTarget = null;
      try {
        hashTarget = document.querySelector(window.location.hash);
      } catch (_) {
        hashTarget = null;
      }
      if (!hashTarget) return;
      const revealParent = typeof hashTarget.closest === 'function' ? hashTarget.closest('[data-reveal]') : null;
      if (revealParent) revealNow(revealParent);
    }

    function initObserver() {
      if (!('IntersectionObserver' in window)) {
        revealAllNow();
        return;
      }
      const io = new IntersectionObserver(function(entries) {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        }
      }, { threshold: 0.01, rootMargin: '0px 0px -8% 0px' });
      for (const el of els) {
        if (!el.classList.contains('is-visible')) io.observe(el);
      }
      setTimeout(function() {
        for (const el of document.querySelectorAll('[data-reveal]')) {
          el.style.opacity = '1';
          el.style.transform = 'none';
          el.style.transition = 'none';
        }
      }, 900);
    }

    // Baseline safety: never leave content hidden if observers fail.
    revealAllNow();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', revealAllNow, { once: true });
    }
    window.addEventListener('load', revealAllNow, { once: true });

    revealHashTarget();
    initObserver();

  } catch (err) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-reveal]'), function(el) {
      el.classList.add('is-visible');
    });
    console.error('Reveal init failed:', err);
  }
})();
