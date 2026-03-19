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
  var swipeL = document.getElementById('swipeLeft');
  var swipeR = document.getElementById('swipeRight');
  var carWrap = document.querySelector('.carousel-wrap');
  var cards = track.querySelectorAll('.pcard');
  var currentIdx = 0;
  var isMobileCarousel = false;

  function checkMobileCarousel() {
    isMobileCarousel = window.innerWidth <= 1024;
  }
  checkMobileCarousel();
  window.addEventListener('resize', function() {
    checkMobileCarousel();
    if (!isMobileCarousel) {
      positionDesktop(currentIdx);
    } else {
      track.style.transform = '';
      cards.forEach(function(c) { c.classList.remove('dimmed'); });
      updateSwipeHints();
    }
  });

  /* --- DESKTOP MODE: transform-based centering --- */
  function positionDesktop(idx) {
    if (isMobileCarousel || !cards.length) return;
    currentIdx = idx;

    var card = cards[idx];
    var trackRect = track.getBoundingClientRect();
    var wrapRect = carWrap.getBoundingClientRect();

    // Calculate offset to center the active card
    var cardW = card.offsetWidth;
    var gap = 24;
    var totalBefore = 0;
    for (var i = 0; i < idx; i++) {
      totalBefore += cards[i].offsetWidth + gap;
    }
    var centerOffset = (wrapRect.width / 2) - (cardW / 2) - totalBefore;
    track.style.transform = 'translateX(' + centerOffset + 'px)';

    // Dim non-active cards
    cards.forEach(function(c, i) {
      c.classList.toggle('dimmed', i !== idx);
    });

    // Update arrows
    carLeft.classList.toggle('hidden', idx === 0);
    carRight.classList.toggle('hidden', idx === cards.length - 1);

    // Update dots
    dots.forEach(function(d, i) {
      d.classList.toggle('active', i === idx);
    });
  }

  carLeft.addEventListener('click', function() {
    if (currentIdx > 0) positionDesktop(currentIdx - 1);
  });
  carRight.addEventListener('click', function() {
    if (currentIdx < cards.length - 1) positionDesktop(currentIdx + 1);
  });
  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() {
      if (!isMobileCarousel) {
        positionDesktop(i);
      } else {
        // Scroll to card in mobile
        cards[i].scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' });
      }
    });
  });

  /* --- MOBILE MODE: native scroll + swipe hints --- */
  function updateSwipeHints() {
    if (!isMobileCarousel) return;
    var scrollLeft = track.scrollLeft;
    var maxScroll = track.scrollWidth - track.clientWidth;

    swipeL.style.opacity = scrollLeft <= 10 ? '0' : '';
    swipeR.style.opacity = scrollLeft >= maxScroll - 10 ? '0' : '';

    // Update dots based on scroll position
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
    dots.forEach(function(d, i) {
      d.classList.toggle('active', i === closestIdx);
    });
  }

  track.addEventListener('scroll', updateSwipeHints);

  // Keyboard support
  carWrap.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft' && currentIdx > 0) positionDesktop(currentIdx - 1);
    if (e.key === 'ArrowRight' && currentIdx < cards.length - 1) positionDesktop(currentIdx + 1);
  });

  // Init
  if (!isMobileCarousel) {
    positionDesktop(0);
  } else {
    updateSwipeHints();
  }

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
