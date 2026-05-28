// ─────────────────────────────────────────────────────────────────────────────
// GHC 2026 — Stories carousel v1
// ─────────────────────────────────────────────────────────────────────────────
  (function() {
    let carouselInited = false;

    function initCarousel() {
      if (carouselInited) return;

      const track = document.querySelector('.stories-track');
      const dots  = document.querySelectorAll('.carousel-dot');
      const cards = document.querySelectorAll('.story-card');
      const total = cards.length;
      let idx = 0;
      let timer;
      if (!track || !total) return;
      carouselInited = true;

      function go(n) {
        idx = (n + total) % total;
        track.style.transform = 'translateX(-' + (idx * 100) + '%)';
        Array.prototype.forEach.call(dots, function(d, i) { d.classList.toggle('active', i === idx); });
      }

      function start() {
        clearInterval(timer);
        timer = setInterval(function() { go(idx + 1); }, 15000);
      }

      const prevBtn = document.querySelector('.carousel-prev');
      const nextBtn = document.querySelector('.carousel-next');
      if (prevBtn) prevBtn.addEventListener('click', function() { go(idx - 1); start(); });
      if (nextBtn) nextBtn.addEventListener('click', function() { go(idx + 1); start(); });
      Array.prototype.forEach.call(dots, function(d, i) {
        d.addEventListener('click', function() { go(i); start(); });
      });

      start();
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initCarousel, { once: true });
      window.addEventListener("load", initCarousel, { once: true });
    } else {
      initCarousel();
    }
  })();
