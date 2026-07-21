/* ==========================================================================
   Orust Stugstäd – script.js
   1) Mobilmeny  2) Diskret parallax på kullarna  3) Kontaktformulär (placeholder)
   ========================================================================== */

(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1) Mobilmeny ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 2) Diskret parallax på kullarna ----------
     Respekterar prefers-reduced-motion: om det är satt körs ingen JS-parallax
     alls (CSS-animationerna för moln stängs redan av separat i styles.css). */
  if (!reducedMotion) {
    var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));

    if (parallaxEls.length) {
      var ticking = false;

      var updateParallax = function () {
        var viewportCenter = window.innerHeight / 2;

        parallaxEls.forEach(function (el) {
          var speed = parseFloat(el.getAttribute('data-parallax')) || 0.05;
          var rect = el.getBoundingClientRect();
          var distanceFromCenter = rect.top + rect.height / 2 - viewportCenter;
          var offset = distanceFromCenter * -speed;
          el.style.transform = 'translateY(' + offset.toFixed(1) + 'px)';
        });

        ticking = false;
      };

      window.addEventListener('scroll', function () {
        if (!ticking) {
          window.requestAnimationFrame(updateParallax);
          ticking = true;
        }
      }, { passive: true });

      updateParallax();
    }
  }

  /* ---------- 3) KONTAKTFORMULÄR ----------
     Just nu visas bara ett tack-meddelande lokalt i webbläsaren – inget
     skickas någonstans. När formuläret är kopplat till Formspree (se TODO
     i index.html, sök på "Koppla formuläret") ska blocket nedan tas bort
     så att formuläret får posta som vanligt till action-URL:en. */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');

  if (form && status) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      status.textContent = 'Tack! Din förfrågan är mottagen (demo – formuläret är ännu inte kopplat till mail).';
      form.reset();
    });
  }
})();
