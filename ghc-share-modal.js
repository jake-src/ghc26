// ─────────────────────────────────────────────────────────────────────────────
// GHC 2026 — Share modal / fallback links v1
// ─────────────────────────────────────────────────────────────────────────────
(function() {
let donateShareModalInited = false;
let copiedTimer = null;
const shareTitle = "Grateful Hearts Campaign 2026 — Humanity in Action";
const shareText = "Help make a difference for Singaporeans in need. Support the Singapore Red Cross Grateful Hearts Campaign 2026.";
const MODAL_DATA = (typeof GHC_MODAL_DATA !== 'undefined') ? GHC_MODAL_DATA : {};

function getSharePageBtn()    { return document.getElementById("sharePageBtn"); }
function getShareFallbackRow(){ return document.getElementById("shareFallbackRow"); }
function getShareWhatsapp()   { return document.getElementById("shareWhatsapp"); }
function getShareTelegram()   { return document.getElementById("shareTelegram"); }
function getCopyShareLinkBtn(){ return document.getElementById("copyShareLinkBtn"); }
function getCopyShareConfirm(){ return document.getElementById("copyShareConfirm"); }
function getModalOverlay()    { return document.getElementById("modal-overlay"); }
function getModalContent()    { return document.getElementById("modal-content"); }
function getModalCloseBtn() {
  const modalOverlay = getModalOverlay();
  return modalOverlay ? modalOverlay.querySelector(".modal-close") : null;
}
function getHeroShareCta() { return document.getElementById("heroShareCta"); }

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return Promise.reject(new Error("Clipboard API not supported"));
}

function closeModal() {
  const modalOverlay = getModalOverlay();
  if (!modalOverlay) return;
  modalOverlay.classList.remove("is-open");
  document.body.style.overflow = "";
}

function openModal(modalId) {
  const modal = MODAL_DATA[modalId];
  const modalOverlay = getModalOverlay();
  const modalContent = getModalContent();
  if (!modal || !modalOverlay || !modalContent) return;

  modalContent.innerHTML = "";

  if (modal.img) {
    const img = document.createElement("img");
    img.className = "modal-img";
    img.src = modal.img;
    img.alt = modal.name;
    img.onerror = function() { this.style.display = "none"; };
    modalContent.appendChild(img);
  }

  const h3 = document.createElement("h3");
  h3.style.color = modal.colour;
  h3.textContent = modal.name;
  modalContent.appendChild(h3);

  const p = document.createElement("p");
  p.textContent = modal.body;
  modalContent.appendChild(p);

  modalOverlay.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function setupDonationTierButtons() {
  document.querySelectorAll(".donate-tier-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
      document.querySelectorAll(".donate-tier-btn").forEach(function(node) {
        node.classList.remove("is-selected");
      });
      btn.classList.add("is-selected");
    });
  });
}

function setupShareButton(sharePageBtn, heroShareCta) {
  if (heroShareCta && sharePageBtn) {
    heroShareCta.addEventListener("click", function() { sharePageBtn.click(); });
  }
  if (!sharePageBtn) return;
  sharePageBtn.addEventListener("click", function() {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({ title: shareTitle, text: shareText, url: shareUrl }).catch(function() {});
      return;
    }
    const shareFallbackRow = getShareFallbackRow();
    if (shareFallbackRow) {
      const encodedUrl = encodeURIComponent(shareUrl);
      const shareWhatsapp = getShareWhatsapp();
      const shareTelegram = getShareTelegram();
      if (shareWhatsapp) shareWhatsapp.href = "https://api.whatsapp.com/send?text=" + encodedUrl;
      if (shareTelegram) shareTelegram.href = "https://t.me/share/url?url=" + encodedUrl;
      shareFallbackRow.style.display = "flex";
    }
  });
}

function setupCopyLinkButton(copyShareLinkBtn) {
  if (!copyShareLinkBtn) return;
  copyShareLinkBtn.addEventListener("click", function() {
    const copyShareConfirm = getCopyShareConfirm();
    if (!copyShareConfirm) return;
    copyToClipboard(window.location.href).then(function() {
      copyShareConfirm.classList.add("is-visible");
      if (copiedTimer) clearTimeout(copiedTimer);
      copiedTimer = setTimeout(function() {
        copyShareConfirm.classList.remove("is-visible");
      }, 1400);
    }).catch(function() {});
  });
}

function setupServicePillModals() {
  document.querySelectorAll(".service-pill").forEach(function(btn) {
    btn.addEventListener("click", function() {
      openModal(btn.getAttribute("data-modal"));
    });
  });
}

function setupModalDismiss() {
  const modalCloseBtn = getModalCloseBtn();
  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
  const modalOverlay = getModalOverlay();
  if (modalOverlay) {
    modalOverlay.addEventListener("click", function(e) {
      if (e.target === modalOverlay) closeModal();
    });
  }
  document.addEventListener("keydown", function(e) {
    const overlay = getModalOverlay();
    if (e.key === "Escape" && overlay && overlay.classList.contains("is-open")) closeModal();
  });
}

function initDonateShareModal() {
  if (donateShareModalInited) return;
  donateShareModalInited = true;
  try {
    setupDonationTierButtons();
    setupShareButton(getSharePageBtn(), getHeroShareCta());
    setupCopyLinkButton(getCopyShareLinkBtn());
    setupServicePillModals();
    setupModalDismiss();
  } catch (err) {
    console.error("Donate/share/modal init failed:", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDonateShareModal, { once: true });
  window.addEventListener("load", initDonateShareModal, { once: true });
} else {
  initDonateShareModal();
}
})();
