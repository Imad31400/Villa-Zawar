/* Villa Zawar — interactions natives et accessibles. Aucune dépendance. */
(() => {
  'use strict';
  const doc = document;
  const config = window.VILLA_ZAWAR_CONFIG || {};
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = doc.querySelector('.site-header');
  const nav = doc.querySelector('#main-nav');
  const toggle = doc.querySelector('.menu-toggle');
  let menuReturnFocus = null;

  // Header fixe et menu mobile, avec fermeture Escape et confinement du focus.
  const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 28);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  function closeMenu(restoreFocus = true) {
    if (!nav || !toggle || toggle.getAttribute('aria-expanded') !== 'true') return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Ouvrir le menu');
    nav.classList.remove('is-open');
    doc.body.classList.remove('no-scroll');
    if (restoreFocus && menuReturnFocus) menuReturnFocus.focus();
  }
  function openMenu() {
    if (!nav || !toggle) return;
    menuReturnFocus = toggle;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fermer le menu');
    nav.classList.add('is-open');
    doc.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  }
  toggle?.addEventListener('click', () => {
    if (toggle.getAttribute('aria-expanded') === 'true') closeMenu();
    else openMenu();
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu(false)));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) closeMenu(false);
  });
  doc.addEventListener('keydown', ev => {
    if (ev.key === 'Escape') closeMenu();
    if (ev.key !== 'Tab' || toggle?.getAttribute('aria-expanded') !== 'true') return;
    const focusable = [toggle, ...nav.querySelectorAll('a:not([hidden])')];
    const index = focusable.indexOf(doc.activeElement);
    if (ev.shiftKey && index === 0) { ev.preventDefault(); focusable[focusable.length - 1].focus(); }
    else if (!ev.shiftKey && index === focusable.length - 1) { ev.preventDefault(); focusable[0].focus(); }
  });
  doc.querySelectorAll('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });

  // Les sections restent visibles sans JS / avec animations réduites.
  if (!reducedMotion && 'IntersectionObserver' in window) {
    doc.documentElement.classList.add('js-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -45px 0px', threshold: 0.08 });
    doc.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // Visionneuse d'images, navigable au clavier, focus restauré à la fermeture.
  const galleryItems = [...doc.querySelectorAll('[data-gallery]')];
  const lightbox = doc.querySelector('#lightbox');
  const fullImage = lightbox?.querySelector('.lightbox__image');
  const caption = lightbox?.querySelector('.lightbox__caption');
  const counter = lightbox?.querySelector('.lightbox__counter');
  let galleryIndex = 0;
  let previousFocus = null;
  let lightboxIsOpen = false;
  function showGallery(index) {
    if (!galleryItems.length || !fullImage || !lightbox) return;
    galleryIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[galleryIndex];
    fullImage.src = item.dataset.full;
    fullImage.alt = item.dataset.alt || 'Photographie de Villa Zawar';
    if (caption) caption.textContent = item.dataset.caption || '';
    if (counter) counter.textContent = `${galleryIndex + 1} / ${galleryItems.length}`;
  }
  function openLightbox(index) {
    if (!lightbox) return;
    closeMenu(false);
    previousFocus = doc.activeElement;
    lightboxIsOpen = true;
    showGallery(index);
    lightbox.setAttribute('aria-hidden', 'false');
    doc.body.classList.add('no-scroll');
    lightbox.querySelector('.lightbox__close')?.focus();
  }
  function closeLightbox() {
    if (!lightboxIsOpen || !lightbox) return;
    lightboxIsOpen = false;
    lightbox.setAttribute('aria-hidden', 'true');
    doc.body.classList.remove('no-scroll');
    fullImage.removeAttribute('src');
    previousFocus?.focus();
  }
  galleryItems.forEach((item, idx) => item.addEventListener('click', () => openLightbox(idx)));
  lightbox?.querySelector('.lightbox__close')?.addEventListener('click', closeLightbox);
  lightbox?.querySelector('.lightbox__prev')?.addEventListener('click', () => showGallery(galleryIndex - 1));
  lightbox?.querySelector('.lightbox__next')?.addEventListener('click', () => showGallery(galleryIndex + 1));
  lightbox?.addEventListener('click', ev => { if (ev.target === lightbox) closeLightbox(); });
  doc.addEventListener('keydown', ev => {
    if (!lightboxIsOpen) return;
    if (ev.key === 'Escape') { ev.preventDefault(); closeLightbox(); }
    else if (ev.key === 'ArrowLeft') { ev.preventDefault(); showGallery(galleryIndex - 1); }
    else if (ev.key === 'ArrowRight') { ev.preventDefault(); showGallery(galleryIndex + 1); }
    else if (ev.key === 'Tab') {
      const buttons = [...lightbox.querySelectorAll('button')];
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (ev.shiftKey && doc.activeElement === first) { ev.preventDefault(); last.focus(); }
      else if (!ev.shiftKey && doc.activeElement === last) { ev.preventDefault(); first.focus(); }
    }
  });

  // Formulaires statiques : validation locale, envoi uniquement si Netlify activé.
  // Aucune réservation n'est confirmée, seul un message de demande est transmis.
  const pad = n => String(n).padStart(2, '0');
  const dateIso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = dateIso(new Date());
  const addDay = str => {
    const [year, month, day] = str.split('-').map(Number);
    const d = new Date(year, month - 1, day + 1);
    return dateIso(d);
  };
  const netlifyOrigin = window.location.hostname.endsWith('.netlify.app') || window.location.hostname.endsWith('.netlify.com');
  const formsEnabled = config.formsProvider === 'netlify' && (config.formsEnabled === true || netlifyOrigin);
  function setError(field, msg) {
    if (!field) return;
    const error = field.closest('.form-field')?.querySelector('.form-field__error');
    if (error) error.textContent = msg || '';
    if (msg) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  }
  function status(form, msg, state = 'info') {
    const target = form.querySelector('[data-form-status]');
    if (!target) return;
    target.textContent = msg;
    target.dataset.state = state;
  }
  function validate(form) {
    let valid = true;
    let firstInvalid = null;
    const fields = [...form.querySelectorAll('input:not([type=hidden]):not([type=checkbox]),select,textarea')];
    fields.forEach(field => {
      if (field.closest('.honeypot')) return;
      let msg = '';
      const v = field.value.trim();
      if (field.required && !v) msg = 'Ce champ est obligatoire.';
      else if (field.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = 'Indiquez une adresse e-mail valide.';
      else if (field.type === 'date' && v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) msg = 'Indiquez une date valide.';
      else if (field.name === 'voyageurs' && v && (!Number.isInteger(Number(v)) || Number(v) < 1 || Number(v) > 8)) msg = 'Choisissez de 1 à 8 voyageurs.';
      else if (field.name === 'arrivee' && v && v < today) msg = 'La date d’arrivée ne peut pas être passée.';
      const arrival = form.elements.namedItem('arrivee');
      if (field.name === 'depart' && v && arrival?.value && v <= arrival.value) msg = 'Le départ doit être après l’arrivée.';
      setError(field, msg);
      if (msg) { valid = false; firstInvalid ||= field; }
    });
    const privacy = form.querySelector('[name="consentement"]');
    if (privacy && !privacy.checked) { valid = false; firstInvalid ||= privacy; }
    if (!valid) {
      status(form, 'Vérifiez les champs signalés et acceptez la politique de confidentialité.', 'error');
      firstInvalid?.focus();
    }
    return valid;
  }
  doc.querySelectorAll('form[data-site-form]').forEach(form => {
    const arrival = form.elements.namedItem('arrivee');
    const departure = form.elements.namedItem('depart');
    if (arrival) arrival.min = today;
    if (departure) departure.min = addDay(today);
    arrival?.addEventListener('change', () => {
      departure.min = arrival.value ? addDay(arrival.value) : addDay(today);
      if (departure.value && departure.value < departure.min) departure.value = '';
    });
    form.querySelectorAll('input,select,textarea').forEach(input => {
      const clear = () => {
        setError(input, '');
        const target = form.querySelector('[data-form-status]');
        if (target?.dataset.state === 'error') status(form, '');
      };
      input.addEventListener('input', clear);
      input.addEventListener('change', clear);
    });
    form.addEventListener('submit', async ev => {
      ev.preventDefault();
      if (!validate(form)) return;
      if (!formsEnabled) {
        status(form, 'L’envoi n’est pas encore activé sur cet hébergement. Le propriétaire doit configurer Netlify Forms avant de recevoir des demandes. Aucune donnée n’a été transmise.', 'info');
        return;
      }
      const submit = form.querySelector('[type="submit"]');
      if (submit?.disabled) return;
      if (submit) { submit.disabled = true; submit.setAttribute('aria-busy', 'true'); }
      status(form, 'Envoi de votre demande en cours…', 'info');
      try {
        const params = new URLSearchParams(new FormData(form));
        params.set('form-name', form.getAttribute('name'));
        const response = await fetch('/', {
          method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString()
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        form.reset();
        if (arrival) arrival.min = today;
        if (departure) departure.min = addDay(today);
        status(form, form.dataset.siteForm === 'disponibilite'
          ? 'Votre demande de disponibilité a été transmise. L’équipe vous répondra après vérification : votre séjour n’est pas encore confirmé.'
          : 'Votre message a été transmis. L’équipe vous répondra dès que possible.', 'success');
      } catch (err) {
        status(form, 'L’envoi a échoué. Vos informations sont conservées : veuillez réessayer un peu plus tard.', 'error');
      } finally {
        if (submit) { submit.disabled = false; submit.removeAttribute('aria-busy'); }
      }
    });
  });
})();
