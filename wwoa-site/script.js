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

  var contactInbox = "contact@wahajwelfare.org";
  var formAction = "https://formsubmit.co/" + contactInbox;
  var form = document.querySelector('#contact-form');
  var formNote = document.querySelector('#form-note');
  var contactThanksShown = false;
  var contactThanksEn = "Thank you — your message has been sent. We will be in touch soon.";
  var contactSendingEn = "Sending your message…";

  function queryFlag(name) {
    try { return new URLSearchParams(window.location.search).get(name) === "1"; }
    catch (e) { return false; }
  }

  function returnUrl(flag) {
    return window.location.origin + window.location.pathname + "?" + flag + "=1";
  }

  function setHidden(targetForm, name, value) {
    var input = targetForm.querySelector('[name="' + name + '"]');
    if (input) input.value = value;
  }

  function honeyFilled(targetForm) {
    var honey = targetForm.querySelector('[name="_honey"]');
    return !!(honey && honey.value);
  }

  function mailtoSubmit(subject, fields) {
    var body = Object.keys(fields).map(function (key) {
      return key + ": " + (fields[key] || "");
    }).join("\n");
    window.location.href = "mailto:" + contactInbox +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  }

  function wireMailForm(targetForm, options) {
    if (!targetForm) return;
    targetForm.setAttribute("action", formAction);
    targetForm.setAttribute("method", "POST");
    targetForm.addEventListener("submit", function (e) {
      if (honeyFilled(targetForm)) {
        e.preventDefault();
        return;
      }
      if (window.location.protocol === "file:") {
        e.preventDefault();
        mailtoSubmit(options.subject, options.fields());
        return;
      }
      setHidden(targetForm, "_next", returnUrl(options.flag));
      setHidden(targetForm, "_url", window.location.href);
      if (options.note) options.note.textContent = options.sending;
    });
  }

  wireMailForm(form, {
    subject: "WWOA contact form message",
    flag: "sent",
    note: formNote,
    sending: contactSendingEn,
    fields: function () {
      return {
        Name: form.name.value,
        Email: form.email.value,
        Message: form.message.value
      };
    }
  });

  /* ===================== Join with us modal ===================== */
  var joinModal = document.querySelector('#join-modal');
  var joinForm = document.querySelector('#join-form');
  var joinNote = document.querySelector('#join-form-note');
  var joinThanksShown = false;
  var joinThanksEn = "Thank you — your application has been sent. We will be in touch soon.";
  var joinSendingEn = "Sending your application…";

  function openJoinModal() {
    if (!joinModal) return;
    joinModal.hidden = false;
    document.body.classList.add('modal-open');
    var first = joinModal.querySelector('input:not([type="hidden"]):not([name="_honey"])');
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

  wireMailForm(joinForm, {
    subject: "WWOA membership application",
    flag: "joined",
    note: joinNote,
    sending: joinSendingEn,
    fields: function () {
      return {
        "First name": joinForm.firstName.value,
        "Last name": joinForm.lastName.value,
        "Father's name": joinForm.fatherName.value,
        Phone: joinForm.phone.value,
        Email: joinForm.email.value,
        "City / Province": joinForm.city.value,
        Help: joinForm.help.value
      };
    }
  });

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
    if (contactThanksShown && formNote) {
      formNote.textContent = (isFa && dict['contact.thanks']) ? dict['contact.thanks'] : contactThanksEn;
    }

    try { localStorage.setItem('wwoa_lang', lang); } catch (e) {}
  }

  var savedLang = 'en';
  try { savedLang = localStorage.getItem('wwoa_lang') || 'en'; } catch (e) {}
  applyLang(savedLang);

  if (queryFlag("joined") && joinModal) {
    joinThanksShown = true;
    openJoinModal();
    if (joinNote) {
      joinNote.textContent = (document.documentElement.getAttribute('lang') === 'fa' && dict['join.thanks'])
        ? dict['join.thanks']
        : joinThanksEn;
    }
  }
  if (queryFlag("sent") && formNote) {
    contactThanksShown = true;
    formNote.textContent = (document.documentElement.getAttribute('lang') === 'fa' && dict['contact.thanks'])
      ? dict['contact.thanks']
      : contactThanksEn;
  }

  var langBtn = document.querySelector('#lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('lang') === 'fa' ? 'fa' : 'en';
      applyLang(current === 'fa' ? 'en' : 'fa');
    });
  }

  var aseelOrg = "organization_01M0PSYGAQQCZ6XDWA9TCK3YZN";

  function openAseelDonate() {
    if (document.getElementById("aidos-donation-iframe")) return;
    var wrapper = document.createElement("div");
    wrapper.id = "aidos-iframe-wrapper";
    wrapper.style.cssText = "position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.6);";
    var iframe = document.createElement("iframe");
    iframe.id = "aidos-donation-iframe";
    iframe.src = "https://aseelapp.co/popup/?organization=" + encodeURIComponent(aseelOrg);
    iframe.allow = "payment *; autoplay *; clipboard-read; clipboard-write";
    iframe.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100dvh;border:none;z-index:9999;background:transparent;";
    document.documentElement.style.setProperty("overflow", "hidden", "important");
    document.documentElement.style.setProperty("overscroll-behavior-y", "none", "important");
    wrapper.appendChild(iframe);
    document.body.appendChild(wrapper);
  }

  document.querySelectorAll(".js-aseel-donate").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      openAseelDonate();
    });
  });
});
