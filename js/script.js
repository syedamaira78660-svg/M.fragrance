(function () {
  var WHATSAPP_NUMBER = '923342978354';

  // Build WhatsApp links from data-wa-text so the number lives in one place.
  document.querySelectorAll('[data-wa-text]').forEach(function (el) {
    var message = el.getAttribute('data-wa-text');
    el.setAttribute(
      'href',
      'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message)
    );
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
  });

  // Mobile nav toggle
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- Animation ----------
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  function showEverythingInstantly() {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in-view'); });
    document.querySelectorAll('.rail-dot').forEach(function (el) {
      el.style.opacity = 1; el.style.transform = 'none';
    });
    var wa = document.querySelector('.wa-float');
    if (wa) { wa.style.opacity = 1; wa.style.transform = 'none'; }
  }

  if (!hasGSAP || prefersReducedMotion) {
    showEverythingInstantly();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Hero: a single orchestrated entrance on load. The bottled scent "unveils" itself
  // the way a print ad would: eyebrow, name, signature, tagline, then the call to action.
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .fromTo('.hero-feather', { opacity: 0, scale: 0.92 }, { opacity: 0.14, scale: 1, duration: 1.8, ease: 'power2.out' }, 0)
    .fromTo('.hero .eyebrow', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.1)
    .fromTo('.hero-title', { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.22)
    .fromTo('.hero-title .script', { y: 14, opacity: 0, rotate: -8 }, { y: 0, opacity: 1, rotate: -2, duration: 0.7, ease: 'back.out(1.6)' }, 0.6)
    .fromTo('.hero-tagline', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.75)
    .fromTo('.hero-copy', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.86)
    .fromTo('.hero-actions', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.96)
    .fromTo('.hero-badge', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 1.08)
    .to('.wa-float', { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }, 1.3);

  // Subtle parallax on the ambient feather as the hero scrolls away.
  gsap.to('.hero-feather', {
    yPercent: 18,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
  });

  // Product cards sit in a staggered "shelf" via CSS transform (odd/even offset) plus a
  // CSS hover lift — both use the transform property, so the reveal here only fades
  // opacity in, leaving those transforms untouched.
  ScrollTrigger.batch('.scent-card.reveal', {
    start: 'top 88%',
    once: true,
    onEnter: function (batch) {
      gsap.to(batch, { opacity: 1, duration: 0.7, ease: 'power2.out', stagger: 0.12 });
    }
  });

  // Everything else that carries .reveal (outside the hero and outside the product
  // cards) gets the standard fade-up, batched so neighbors stagger together.
  var otherReveals = gsap.utils.toArray('.reveal').filter(function (el) {
    return !el.closest('.hero') && !el.classList.contains('scent-card');
  });
  ScrollTrigger.batch(otherReveals, {
    start: 'top 85%',
    once: true,
    onEnter: function (batch) {
      gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.12 });
    }
  });

  // Color rail dots pop in like little wax-seal stamps.
  ScrollTrigger.batch('.rail-dot', {
    start: 'top 90%',
    once: true,
    onEnter: function (batch) {
      gsap.to(batch, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2.5)', stagger: 0.08 });
    }
  });
})();
