/* ==========================================================================
   Orust Stugstäd – script.js
   1) Mobilmeny  2) Diskret parallax på molnen  3) Städguiden (enkät i
   kontaktformuläret)  4) Kontaktformulär (skickas till Formspree)
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

  /* ---------- 2) Diskret parallax på molnen ----------
     Respekterar prefers-reduced-motion: om det är satt körs ingen JS-parallax
     alls (CSS-driftanimationen för moln stängs redan av separat i styles.css).
     Parallaxen sätter "transform", medan driftanimationen i CSS använder den
     fristående "translate"-egenskapen – de påverkar inte varandra. */
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

  /* ---------- 3) STÄDGUIDEN ----------
     Stegvis enkät inbyggd i kontaktformuläret: vilken typ av städ, hur stor
     yta, valfria tillägg – och till sist kontaktuppgifter. Räknar ihop ett
     uppskattat pris och skriver en sammanfattning till det dolda fältet
     "serviceSummary" så den följer med när formuläret skickas in.

     Progressiv förbättring: utan JS visas alla steg samtidigt (ett vanligt
     långt formulär, fortfarande skickbart med normal HTML5-validering).
     Klassen "js-ready" – och därmed stegvisningen – sätts bara här. */
  var quizForm = document.getElementById('contactForm');
  var resetQuiz = null;

  if (quizForm) {
    var steps = Array.prototype.slice.call(quizForm.querySelectorAll('.quiz-step'));
    var progressBar = document.getElementById('quizProgressBar');
    var stepLabel = document.getElementById('quizStepLabel');
    var summaryEl = document.getElementById('quizSummary');
    var summaryInput = document.getElementById('serviceSummary');
    var order = ['1', '2a', '3', '4'];
    var currentIndex = 0;

    var getStepEl = function (stepNum) {
      return quizForm.querySelector('.quiz-step[data-step="' + stepNum + '"]');
    };

    /* Bytesstäd och Storstäd har olika storleks-/prisnivåer (steg "2a"
       respektive "2b") men i övrigt samma flöde – båda går nu igenom en
       storleksfråga, bara med olika priser bakom kulisserna. */
    var computeOrder = function () {
      var serviceType = quizForm.querySelector('input[name="serviceType"]:checked');
      if (serviceType && serviceType.value === 'Storstäd') {
        return ['1', '2b', '3', '4'];
      }
      return ['1', '2a', '3', '4'];
    };

    var formatKr = function (n) {
      return n.toLocaleString('sv-SE') + ' kr';
    };

    var renderSummary = function () {
      if (!summaryEl) { return; }

      var serviceTypeEl = quizForm.querySelector('input[name="serviceType"]:checked');
      var sizeEl = quizForm.querySelector('input[name="size"]:checked');
      var addonEls = Array.prototype.slice.call(quizForm.querySelectorAll('input[name="addon"]:checked'));

      if (!serviceTypeEl) {
        summaryEl.innerHTML = '';
        if (summaryInput) { summaryInput.value = ''; }
        return;
      }

      var serviceType = serviceTypeEl.value;
      var basePrice = sizeEl ? (parseInt(sizeEl.getAttribute('data-price'), 10) || 0) : 0;
      var serviceLabel = sizeEl ? serviceType + ' – ' + sizeEl.value.replace(/\s*\(.*\)$/, '') : serviceType;

      var akut = addonEls.some(function (el) { return el.hasAttribute('data-akut'); });
      var extras = addonEls.filter(function (el) { return !el.hasAttribute('data-akut'); });
      var extrasTotal = extras.reduce(function (sum, el) {
        return sum + (parseInt(el.getAttribute('data-price'), 10) || 0);
      }, 0);

      var subtotal = akut ? Math.round(basePrice * 1.3) : basePrice;
      var total = subtotal + extrasTotal;

      var addonNames = addonEls.map(function (el) { return el.value.replace(/\s*\(.*\)$/, ''); });

      summaryEl.innerHTML =
        '<strong>' + serviceLabel + '</strong><br>' +
        (addonNames.length ? 'Tillägg: ' + addonNames.join(', ') + '<br>' : '') +
        'Uppskattat pris: <strong>' + formatKr(total) + '</strong>' +
        '<span class="quiz-summary-note">Uppskattning – vi bekräftar exakt pris när vi ser adressen.</span>';

      if (summaryInput) {
        var lines = ['Typ av städ: ' + serviceType];
        if (sizeEl) { lines.push('Storlek: ' + sizeEl.value); }
        if (addonEls.length) { lines.push('Tillägg: ' + addonEls.map(function (el) { return el.value; }).join(', ')); }
        lines.push('Uppskattat pris: ' + formatKr(total));
        summaryInput.value = lines.join(' | ');
      }
    };

    var showStep = function () {
      var stepNum = order[currentIndex];

      steps.forEach(function (step) { step.classList.remove('is-active'); });
      var stepEl = getStepEl(stepNum);
      if (!stepEl) { return; }
      stepEl.classList.add('is-active');

      if (progressBar) {
        progressBar.style.width = Math.round(((currentIndex + 1) / order.length) * 100) + '%';
      }
      if (stepLabel) {
        stepLabel.textContent = 'Steg ' + (currentIndex + 1) + ' av ' + order.length;
      }

      if (stepNum === '4') {
        renderSummary();
      }

      var legend = stepEl.querySelector('legend');
      if (legend) {
        legend.setAttribute('tabindex', '-1');
        legend.focus({ preventScroll: true });
      }
    };

    var validateStep = function (stepNum) {
      var stepEl = getStepEl(stepNum);
      // OBS: "required" sätts (per HTML-konvention) bara på det FÖRSTA
      // alternativet i varje radiogrupp, inte på alla. Måste därför läsa in
      // alla radioknappar i gruppen (inte bara de med [required]) för att
      // avgöra om något av dem är ikryssat – annars godkänns bara det
      // allra första alternativet i varje grupp.
      var allRadios = Array.prototype.slice.call(stepEl.querySelectorAll('input[type="radio"]'));
      var requiredNames = {};

      allRadios.forEach(function (radio) {
        if (radio.required) { requiredNames[radio.name] = true; }
      });

      return Object.keys(requiredNames).every(function (name) {
        return allRadios.some(function (radio) { return radio.name === name && radio.checked; });
      });
    };

    quizForm.querySelectorAll('.quiz-next').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var stepNum = order[currentIndex];
        if (!validateStep(stepNum)) {
          var firstRequired = getStepEl(stepNum).querySelector('input[required]');
          if (firstRequired) { firstRequired.focus(); }
          return;
        }
        order = computeOrder();
        if (currentIndex < order.length - 1) {
          currentIndex += 1;
          showStep();
        }
      });
    });

    quizForm.querySelectorAll('.quiz-back').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (currentIndex > 0) {
          currentIndex -= 1;
          showStep();
        }
      });
    });

    resetQuiz = function () {
      order = ['1', '2a', '3', '4'];
      currentIndex = 0;
      showStep();
    };

    quizForm.noValidate = true; // egen stegvis validering (validateStep) ersätter native validering
    quizForm.classList.add('js-ready');
    showStep();
  }

  /* ---------- 4) KONTAKTFORMULÄR ----------
     Skickas till Formspree via fetch() (Accept: application/json) i stället
     för en vanlig sidladdning, så vi kan visa resultatet direkt på samma
     sida utan att navigera bort från Städguiden. action-attributet i
     index.html pekar redan på rätt Formspree-URL och används som reserv om
     JS inte skulle köras.

     Utöver Formspree skickas samtidigt en gratis push-notis direkt från
     sajten via ntfy.sh (inget konto, ingen Zapier-mellanhand – bara en vanlig
     webbförfrågan). TODO: byt NTFY_TOPIC nedan mot ert eget, hemliga
     ämnesnamn (samma som ni prenumererar på i ntfy-appen). Ämnesnamn på
     ntfy.sh är offentliga om man känner till dem, så välj något som inte
     går att gissa – annars kan i princip vem som helst skicka notiser dit. */
  var NTFY_TOPIC = 'oruststugstad-bokning-7x2k';

  var notifyNtfy = function (formEl) {
    var name = (formEl.querySelector('#name') || {}).value || '';
    var phone = (formEl.querySelector('#phone') || {}).value || '';
    var summary = (formEl.querySelector('#serviceSummary') || {}).value || '';
    var message = 'Namn: ' + name + '\nTelefon: ' + phone + (summary ? '\n' + summary : '');

    fetch('https://ntfy.sh/' + NTFY_TOPIC, {
      method: 'POST',
      body: message,
      // OBS: HTTP-headervärden får bara innehålla ISO-8859-1-tecken. Ett
      // "–" (halvt tankstreck) orsakade en TypeError här tidigare trots att
      // å/ä/ö är okej – därför vanligt bindestreck i titeln, inte tankstreck.
      headers: { 'Title': 'Ny forfragan - Orust Stugstad' }
    }).catch(function () {
      // Tyst fel: en missad push-notis ska aldrig störa själva bokningen –
      // Formspree-mailet är alltid den pålitliga huvudvägen.
    });
  };

  var status = document.getElementById('formStatus');
  var submitBtn = quizForm ? quizForm.querySelector('button[type="submit"]') : null;

  if (quizForm && status) {
    quizForm.addEventListener('submit', function (event) {
      event.preventDefault();

      if (submitBtn) { submitBtn.disabled = true; }
      status.textContent = 'Skickar…';

      fetch(quizForm.action, {
        method: 'POST',
        body: new FormData(quizForm),
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          status.textContent = 'Tack! Din förfrågan är mottagen – vi hör av oss så snart vi kan.';
          notifyNtfy(quizForm);
          quizForm.reset();
          if (resetQuiz) { resetQuiz(); }
        } else {
          status.textContent = 'Något gick fel när förfrågan skulle skickas. Ring eller maila oss gärna direkt istället.';
        }
      }).catch(function () {
        status.textContent = 'Något gick fel när förfrågan skulle skickas. Ring eller maila oss gärna direkt istället.';
      }).finally(function () {
        if (submitBtn) { submitBtn.disabled = false; }
      });
    });
  }
})();
