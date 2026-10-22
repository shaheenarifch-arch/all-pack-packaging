/* All Pack — navigation, reveal-on-scroll, footer year and the mailto contact form. */
(function () {
  'use strict';

  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); toggle.focus();
      }
    });
  }

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Contact form: validate, then open the visitor's email app with the brief filled in
  var form = document.getElementById('contact-form');
  if (form) {
    var err = document.getElementById('form-error');
    var ok = document.getElementById('form-success');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.name, email = form.elements.email, msg = form.elements.message;
      var bad = [];
      if (!name.value.trim()) bad.push(name);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) bad.push(email);
      if (!msg.value.trim()) bad.push(msg);
      [name, email, msg].forEach(function (f) { f.setAttribute('aria-invalid', bad.indexOf(f) >= 0 ? 'true' : 'false'); });
      if (bad.length) { err.hidden = false; ok.hidden = true; bad[0].focus(); return; }
      err.hidden = true;
      var v = function (n) { return (form.elements[n] && form.elements[n].value || '').trim(); };
      var body = 'Name: ' + v('name') + '\nEmail: ' + v('email') + '\nCompany: ' + v('company') +
        '\nPackaging type: ' + v('type') + '\nQuantity: ' + v('qty') + '\nTarget launch: ' + v('date') +
        '\n\n' + v('message');
      var subject = 'Packaging enquiry' + (v('company') ? ' from ' + v('company') : '');
      window.location.href = 'mailto:hello@allpack.co?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      ok.hidden = false; ok.focus();
    });
  }
})();
