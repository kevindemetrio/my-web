(function() {

  /* ---- THEME ---- */
  var html = document.documentElement;
  var themeBtn = document.getElementById('themeBtn');

  // Read saved theme
  var saved;
  try { saved = localStorage.getItem('ap-theme'); } catch(e) {}
  if (saved) html.setAttribute('data-theme', saved);

  themeBtn.addEventListener('click', function() {
    var cur = html.getAttribute('data-theme');
    var next = cur === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    try { localStorage.setItem('ap-theme', next); } catch(e) {}
  });

  /* ---- CURSOR (skip on touch devices) ---- */
  var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  var curEl = document.getElementById('cur');
  var curfEl = document.getElementById('curf');

  if (!isTouchDevice) {
    var mx = 0, my = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', function(e) {
      mx = e.clientX; my = e.clientY;
      curEl.style.left = mx + 'px';
      curEl.style.top  = my + 'px';
    });

    function animCursor() {
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      curfEl.style.left = fx + 'px';
      curfEl.style.top  = fy + 'px';
      requestAnimationFrame(animCursor);
    }
    animCursor();
  }

  /* ---- NAVBAR SCROLL ---- */
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function() {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });

  /* ---- HAMBURGER ---- */
  var hbg = document.getElementById('hbg');
  var mob = document.getElementById('mob');
  var open = false;

  function closeMob() {
    open = false;
    mob.classList.remove('open');
    hbg.setAttribute('aria-expanded', 'false');
    var spans = hbg.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
  window.closeMob = closeMob;

  hbg.addEventListener('click', function() {
    open = !open;
    mob.classList.toggle('open', open);
    hbg.setAttribute('aria-expanded', open ? 'true' : 'false');
    var spans = hbg.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  /* ---- SCROLL REVEAL ---- */
  var revEls = document.querySelectorAll('.reveal');

  if (window.IntersectionObserver) {
    var ro = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('on');
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
    revEls.forEach(function(el) { ro.observe(el); });
  } else {
    revEls.forEach(function(el) { el.classList.add('on'); });
  }

  /* ---- COUNTERS ---- */
  var cnts = document.querySelectorAll('[data-to]');
  if (window.IntersectionObserver && cnts.length) {
    var co = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = +el.getAttribute('data-to');
        var start = null;
        function tick(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / 1500, 1);
          var ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(ease * target);
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        co.unobserve(el);
      });
    }, { threshold: 0.5 });
    cnts.forEach(function(c) { co.observe(c); });
  }

  /* ---- PRODUCTS CAROUSEL ---- */
  var track = document.getElementById('carouselTrack');
  var dots = document.querySelectorAll('.car-dot');
  var carLeft = document.getElementById('carLeft');
  var carRight = document.getElementById('carRight');
  var carWrap = document.querySelector('.carousel-wrap');
  var cards = track.querySelectorAll('.pcard');

  function updateCarousel() {
    if (!track || !cards.length) return;

    var scrollLeft = track.scrollLeft;
    var maxScroll = track.scrollWidth - track.clientWidth;

    // Update fade edges
    if (scrollLeft <= 10) {
      carWrap.classList.add('at-start');
    } else {
      carWrap.classList.remove('at-start');
    }
    if (scrollLeft >= maxScroll - 10) {
      carWrap.classList.add('at-end');
    } else {
      carWrap.classList.remove('at-end');
    }

    // Update arrows
    carLeft.classList.toggle('hidden', scrollLeft <= 10);
    carRight.classList.toggle('hidden', scrollLeft >= maxScroll - 10);

    // Update dots — find closest card to center
    var center = scrollLeft + track.clientWidth / 2;
    var closestIdx = 0;
    var closestDist = Infinity;
    cards.forEach(function(card, i) {
      var cardCenter = card.offsetLeft + card.offsetWidth / 2;
      var dist = Math.abs(center - cardCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });
    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === closestIdx);
    });
  }

  // Scroll to card by index
  function scrollToCard(idx) {
    if (!cards[idx]) return;
    var card = cards[idx];
    var cardCenter = card.offsetLeft + card.offsetWidth / 2;
    var trackCenter = track.clientWidth / 2;
    track.scrollTo({ left: cardCenter - trackCenter, behavior: 'smooth' });
  }

  track.addEventListener('scroll', updateCarousel);

  carLeft.addEventListener('click', function() {
    // Find current active dot index and go to previous
    var activeIdx = 0;
    dots.forEach(function(d, i) { if (d.classList.contains('active')) activeIdx = i; });
    scrollToCard(Math.max(0, activeIdx - 1));
  });

  carRight.addEventListener('click', function() {
    var activeIdx = 0;
    dots.forEach(function(d, i) { if (d.classList.contains('active')) activeIdx = i; });
    scrollToCard(Math.min(cards.length - 1, activeIdx + 1));
  });

  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() { scrollToCard(i); });
  });

  // Initial state
  carWrap.classList.add('at-start');
  updateCarousel();

  /* ---- CONTACT FORM (single handler — sends to n8n webhook) ---- */
  var cform = document.getElementById('cform');
  var formOk = document.getElementById('formOk');

  if (cform) {
    cform.addEventListener('submit', async function(e) {
      e.preventDefault();

      var btn = cform.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.textContent = 'Enviando...';
      btn.disabled = true;

      var formData = new FormData(cform);

      try {
        await fetch('https://denajerautomation.app.n8n.cloud/webhook-test/form-submission', {
          method: 'POST',
          body: formData
        });

        cform.style.display = 'none';
        formOk.classList.add('show');
        cform.reset();
      } catch (error) {
        console.error('Error enviando el formulario:', error);
        btn.textContent = originalText;
        btn.disabled = false;
        // Optionally show an inline error instead of alert
        var errorMsg = document.createElement('p');
        errorMsg.textContent = 'Hubo un error al enviar. Inténtalo de nuevo.';
        errorMsg.style.cssText = 'color:var(--red);font-size:.82rem;text-align:center;margin-top:8px;';
        errorMsg.className = 'form-error-msg';
        // Remove previous error if any
        var prev = cform.querySelector('.form-error-msg');
        if (prev) prev.remove();
        cform.appendChild(errorMsg);
      }
    });
  }

  /* ---- SERVICE CARD TILT (skip on touch) ---- */
  if (!isTouchDevice) {
    document.querySelectorAll('.svc-card').forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = 'translateY(-4px) rotateX('+(y*-5)+'deg) rotateY('+(x*5)+'deg)';
      });
      card.addEventListener('mouseleave', function() { card.style.transform = ''; });
    });
  }

})();
