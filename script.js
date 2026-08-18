document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (i) {
        i.classList.remove('open');
        i.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  // Contact form (placeholder — no backend yet)
  var form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = document.querySelector('#form-note');
      if (note) {
        note.textContent = "Thank you — this form isn't connected to email yet. For now, please reach us directly at the email or phone number listed above.";
      }
    });
  }

  /* ===================== Join with us modal ===================== */
  var joinModal = document.querySelector('#join-modal');
  var joinForm = document.querySelector('#join-form');
  var joinNote = document.querySelector('#join-form-note');
  var joinThanksShown = false;
  var joinThanksEn = "Thank you — this is a sample form and is not connected to email yet. Please reach us by email or phone.";

  function openJoinModal() {
    if (!joinModal) return;
    joinModal.hidden = false;
    document.body.classList.add('modal-open');
    var first = joinModal.querySelector('input');
    if (first) first.focus();
  }

  function closeJoinModal() {
    if (!joinModal) return;
    joinModal.hidden = true;
    document.body.classList.remove('modal-open');
  }

  document.querySelectorAll('.js-open-join').forEach(function (btn) {
    btn.addEventListener('click', openJoinModal);
  });
  document.querySelectorAll('[data-close-modal]').forEach(function (el) {
    el.addEventListener('click', closeJoinModal);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && joinModal && !joinModal.hidden) closeJoinModal();
  });

  if (joinForm) {
    joinForm.addEventListener('submit', function (e) {
      e.preventDefault();
      joinThanksShown = true;
      if (joinNote) {
        var isFaNow = document.documentElement.getAttribute('lang') === 'fa';
        joinNote.textContent = (isFaNow && dict['join.thanks']) ? dict['join.thanks'] : joinThanksEn;
      }
    });
  }

  /* ===================== Language toggle (EN / Dari) ===================== */
  var dict = (window.WWOA_I18N && window.WWOA_I18N.fa) ? window.WWOA_I18N.fa : {};

  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    el.dataset.i18nEn = el.innerHTML;
  });

  function applyLang(lang) {
    var isFa = lang === 'fa';
    document.documentElement.setAttribute('lang', isFa ? 'fa' : 'en');
    document.documentElement.setAttribute('dir', isFa ? 'rtl' : 'ltr');
    document.body.classList.toggle('lang-fa', isFa);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (isFa && dict[key]) {
        el.innerHTML = dict[key];
      } else {
        el.innerHTML = el.dataset.i18nEn;
      }
    });

    var label = document.querySelector('#lang-toggle-label');
    if (label) label.textContent = isFa ? 'English' : 'دری';

    if (joinThanksShown && joinNote) {
      joinNote.textContent = (isFa && dict['join.thanks']) ? dict['join.thanks'] : joinThanksEn;
    }

    try { localStorage.setItem('wwoa_lang', lang); } catch (e) {}
  }

  var savedLang = 'en';
  try { savedLang = localStorage.getItem('wwoa_lang') || 'en'; } catch (e) {}
  applyLang(savedLang);

  var langBtn = document.querySelector('#lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('lang') === 'fa' ? 'fa' : 'en';
      applyLang(current === 'fa' ? 'en' : 'fa');
    });
  }
});
