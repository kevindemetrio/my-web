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

  /* ---- CURSOR ---- */
  var cur = document.getElementById('cur');
  var curf = document.getElementById('curf');
  var mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
  });

  function animCursor() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    curf.style.left = fx + 'px';
    curf.style.top  = fy + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();

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
    var spans = hbg.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
  window.closeMob = closeMob;

  hbg.addEventListener('click', function() {
    open = !open;
    mob.classList.toggle('open', open);
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

  /* ---- PRODUCTS ACCORDION ---- */
  var pitems = document.querySelectorAll('[data-pi]');
  pitems.forEach(function(item) {
    item.addEventListener('click', function() {
      if (item.classList.contains('open')) return;
      pitems.forEach(function(i) { i.classList.remove('open'); });
      item.classList.add('open');
    });
  });

  /* ---- CONTACT FORM ---- */
  var cform = document.getElementById('cform');
  var formOk = document.getElementById('formOk');
  if (cform) {
    cform.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = cform.querySelector('button[type="submit"]');
      btn.textContent = 'Enviando...'; btn.disabled = true;
      setTimeout(function() {
        cform.style.display = 'none';
        formOk.classList.add('show');
      }, 1200);
    });
  }

  /* ---- NEWSLETTER FORM ---- */
  var nlform = document.getElementById('nlform');
  var nlOk = document.getElementById('nlOk');
  if (nlform) {
    nlform.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = nlform.querySelector('button');
      btn.textContent = 'Hecho!'; btn.disabled = true;
      nlOk.classList.add('show');
    });
  }

  /* ---- SERVICE CARD TILT ---- */
  document.querySelectorAll('.svc-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = 'translateY(-4px) rotateX('+(y*-5)+'deg) rotateY('+(x*5)+'deg)';
    });
    card.addEventListener('mouseleave', function() { card.style.transform = ''; });
  });

  document.getElementById("cform").addEventListener("submit", async function(e) {
  e.preventDefault();

  const formData = new FormData(this);

  try {
    await fetch("https://denajerautomation.app.n8n.cloud/webhook-test/form-submission", {
      method: "POST",
      body: formData
    });

    document.getElementById("formOk").classList.add("show");
    this.reset();

  } catch (error) {
    alert("Error enviando el formulario");
    console.error(error);
  }
});

})();