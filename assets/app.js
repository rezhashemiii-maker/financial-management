/* جزوه مدیریت مالی — اسکریپت مشترک: تم، فهرست فعال، دکمه بالا */
(function () {
  var KEY = 'fm-theme';

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function save(v) {
    try { localStorage.setItem(KEY, v); } catch (e) { /* بی‌خیال */ }
  }
  function current() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function apply(v) {
    document.documentElement.setAttribute('data-theme', v);
    var b = document.querySelector('.theme-btn');
    if (b) {
      b.textContent = v === 'dark' ? '☀' : '☾';
      b.setAttribute('aria-label', v === 'dark' ? 'حالت روشن' : 'حالت تاریک');
      b.setAttribute('title', v === 'dark' ? 'حالت روشن' : 'حالت تاریک');
    }
  }

  var saved = stored();
  if (saved === 'dark' || saved === 'light') apply(saved);

  document.addEventListener('DOMContentLoaded', function () {
    apply(current());

    var btn = document.querySelector('.theme-btn');
    if (btn) {
      btn.addEventListener('click', function () {
        var next = current() === 'dark' ? 'light' : 'dark';
        apply(next);
        save(next);
      });
    }

    /* --- فهرست: هایلایت بخش فعال --- */
    var links = Array.prototype.slice.call(document.querySelectorAll('.toc a[href^="#"]'));
    if (links.length) {
      var targets = links
        .map(function (a) {
          var el = document.getElementById(a.getAttribute('href').slice(1));
          return el ? { a: a, el: el } : null;
        })
        .filter(Boolean);

      var tick = function () {
        var y = window.scrollY + 120, cur = targets[0];
        for (var i = 0; i < targets.length; i++) {
          if (targets[i].el.offsetTop <= y) cur = targets[i];
        }
        links.forEach(function (a) { a.classList.remove('active'); });
        if (cur) cur.a.classList.add('active');
      };
      var raf = null;
      window.addEventListener('scroll', function () {
        if (raf) return;
        raf = requestAnimationFrame(function () { raf = null; tick(); });
      }, { passive: true });
      tick();
    }

    /* --- دکمه برگشت به بالا --- */
    var top = document.querySelector('.to-top');
    if (top) {
      top.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      window.addEventListener('scroll', function () {
        top.classList.toggle('show', window.scrollY > 600);
      }, { passive: true });
    }

    /* --- گزینهٔ درست فقط بعد از باز شدن پاسخ هایلایت شود --- */
    Array.prototype.forEach.call(document.querySelectorAll('.quiz details'), function (d) {
      var box = d.closest('.quiz');
      var sync = function () { if (box) box.classList.toggle('revealed', d.open); };
      d.addEventListener('toggle', sync);
      sync();
    });

    /* --- باز کردن همهٔ پاسخ‌ها (برای پرینت/مرور) --- */
    var openAll = document.querySelector('[data-open-all]');
    if (openAll) {
      openAll.addEventListener('click', function () {
        var ds = document.querySelectorAll('.quiz details');
        var anyClosed = Array.prototype.some.call(ds, function (d) { return !d.open; });
        Array.prototype.forEach.call(ds, function (d) { d.open = anyClosed; });
        openAll.textContent = anyClosed ? 'بستن همهٔ پاسخ‌ها' : 'باز کردن همهٔ پاسخ‌ها';
      });
    }
  });
})();
