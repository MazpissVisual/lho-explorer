(function () {
  var data = window.SITE_DATA || {};

  // Ikon dari sprite di index.html (id "i-<nama>")
  function icon(name) {
    return '<svg class="ui-icon" aria-hidden="true" focusable="false"><use href="#i-' + name + '"/></svg>';
  }

  // Alamat tiap menu. Beranda memakai "/" dan alamat lain berbentuk "/materi".
  // Server (vercel.json / serve.json) harus mengarahkan alamat-alamat ini ke index.html.
  var ROUTES = {
    'view-beranda': '/', 'view-tujuan': '/tujuan', 'view-video': '/video',
    'view-materi': '/materi', 'view-contoh': '/contoh', 'view-latihan': '/latihan'
  };
  var canRoute = !!(window.history && history.pushState) && location.protocol !== 'file:';

  function viewFromPath(path) {
    path = path.replace(/\/+$/, '') || '/';
    if (path === '/beranda') return 'view-beranda';
    for (var id in ROUTES) if (ROUTES[id] === path) return id;
    return null;
  }

  // Pindah menu (tampilan per bagian, seperti template sebelumnya)
  function navigateTo(viewId, fromHistory) {
    document.querySelectorAll('.app-view-section').forEach(function (s) {
      s.classList.toggle('active-view', s.id === viewId);
    });
    document.querySelectorAll('.nav-item-btn').forEach(function (b) {
      b.classList.toggle('active-nav', b.getAttribute('data-target-view') === viewId);
    });
    if (canRoute && !fromHistory && location.pathname !== ROUTES[viewId]) {
      history.pushState({ view: viewId }, '', ROUTES[viewId]);
    }
    window.scrollTo({ top: 0, behavior: fromHistory ? 'auto' : 'smooth' });
  }
  window.navigateTo = navigateTo;

  // Tombol Back/Forward browser
  window.addEventListener('popstate', function () {
    navigateTo(viewFromPath(location.pathname) || 'view-beranda', true);
  });

  document.querySelectorAll('[data-target-view]').forEach(function (btn) {
    btn.addEventListener('click', function () { navigateTo(btn.getAttribute('data-target-view')); });
  });

  document.querySelectorAll('.module-nav-card[role="button"]').forEach(function (card) {
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });
  });

  // Halaman awal dari alamat. Tautan lama berbentuk "/#materi" tetap dikenali lalu dirapikan jadi "/materi".
  var start = viewFromPath(location.pathname);
  var legacy = 'view-' + location.hash.replace('#', '');
  if (location.hash && document.getElementById(legacy)) start = legacy;
  start = start || 'view-beranda';
  navigateTo(start, true);
  if (canRoute) history.replaceState({ view: start }, '', ROUTES[start]);

  // Kartu latihan (link luar)
  var grid = document.getElementById('latihan-grid');
  (data.latihan || []).forEach(function (item) {
    var ready = item.url && item.url !== '#';
    var card = document.createElement('a');
    card.className = 'module-nav-card' + (ready ? '' : ' belum-siap');
    card.style.setProperty('--card-accent', item.warna);
    card.href = ready ? item.url : '#';
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.innerHTML =
      '<div><div class="module-card-icon">' + icon(item.ikon) + '</div>' +
      '<h3>' + item.judul + '</h3><p>' + item.deskripsi + '</p>' +
      (item.qr ? '<figure class="qr-box"><img src="' + item.qr + '" width="140" height="140" alt="Kode QR untuk ' + item.judul + '">' +
        '<figcaption>Pindai dengan HP atau klik kartu</figcaption></figure>' : '') + '</div>' +
      '<div class="module-card-footer"><span>' + (ready ? 'Kerjakan Sekarang ' + icon('arrow-right') : 'Segera hadir') + '</span></div>';
    if (!ready) card.addEventListener('click', function (e) { e.preventDefault(); });
    grid.appendChild(card);
  });

  // Video orientasi
  var box = document.getElementById('video-box');
  if (data.videoUrl) {
    if (/\.(mp4|webm)(\?|$)/i.test(data.videoUrl)) {
      box.innerHTML = '<video controls src="' + data.videoUrl + '"></video>';
    } else {
      box.innerHTML = '<iframe src="' + data.videoUrl + '" title="Video orientasi masalah" allowfullscreen ' +
        'referrerpolicy="strict-origin-when-cross-origin" ' +
        'allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"></iframe>';
    }
    if (data.videoWatchUrl) {
      var note = document.createElement('p');
      note.className = 'video-fallback';
      note.innerHTML = 'Video tidak tampil? <a href="' + data.videoWatchUrl + '" target="_blank" rel="noopener noreferrer">Buka di YouTube</a>';
      box.parentNode.insertBefore(note, box.nextSibling);
    }
  }

  // Materi: stepper per topik
  var panels = document.querySelectorAll('.materi-panel');
  var tabs = document.querySelectorAll('#materi-progress button');
  var prev = document.getElementById('materi-prev');
  var next = document.getElementById('materi-next');
  var counter = document.getElementById('materi-counter');
  var barFill = document.getElementById('materi-bar-fill');
  var step = 0;
  var last = panels.length - 1;

  // Atribut ARIA tab/tabpanel dan navigasi panah keyboard
  tabs.forEach(function (t, i) {
    t.id = 'tab-materi-' + i;
    t.setAttribute('aria-controls', 'panel-materi-' + i);
    t.setAttribute('aria-selected', i === 0);
    t.tabIndex = i === 0 ? 0 : -1;
    t.addEventListener('keydown', function (e) {
      var to = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: last }[e.key];
      if (to === undefined) return;
      e.preventDefault();
      showStep(to);
      tabs[step].focus();
    });
  });
  panels.forEach(function (p, i) {
    p.id = 'panel-materi-' + i;
    p.setAttribute('role', 'tabpanel');
    p.setAttribute('aria-labelledby', 'tab-materi-' + i);
  });

  function showStep(n) {
    var prevStep = step;
    step = Math.max(0, Math.min(last, n));
    var dir = step >= prevStep ? 'dir-next' : 'dir-prev';
    panels.forEach(function (p, i) {
      p.classList.remove('dir-next', 'dir-prev');
      p.classList.toggle('active', i === step);
      if (i === step && step !== prevStep) { void p.offsetWidth; p.classList.add(dir); }
    });
    barFill.style.width = ((step + 1) / panels.length * 100) + '%';
    tabs.forEach(function (t, i) {
      t.classList.toggle('active', i === step);
      t.classList.toggle('done', i < step);
      t.setAttribute('aria-selected', i === step);
      t.tabIndex = i === step ? 0 : -1;
    });
    counter.textContent = 'Topik ' + (step + 1) + ' dari ' + panels.length;
    prev.disabled = step === 0;
    next.querySelector('span').innerHTML = (step === last ? 'Lanjut ke Contoh Teks ' : 'Berikutnya ') + icon('arrow-right');
    var top = document.getElementById('view-materi').getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }
  tabs.forEach(function (t) {
    t.addEventListener('click', function () { showStep(Number(t.getAttribute('data-step'))); });
  });
  prev.addEventListener('click', function () { showStep(step - 1); });
  next.addEventListener('click', function () {
    if (step === last) navigateTo('view-contoh'); else showStep(step + 1);
  });
  prev.disabled = true;

  // Cek pemahaman mini (jawaban hanya tampil di layar, tidak disimpan)
  document.querySelectorAll('.cek').forEach(function (cek, n) {
    var answer = cek.getAttribute('data-answer');
    var fb = cek.querySelector('.cek-fb');
    var q = cek.querySelector('.cek-q');
    q.id = 'cek-q-' + n;
    cek.querySelector('.cek-opts').setAttribute('role', 'group');
    cek.querySelector('.cek-opts').setAttribute('aria-labelledby', q.id);
    cek.querySelectorAll('[data-opt]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var ok = btn.getAttribute('data-opt') === answer;
        btn.classList.remove('salah');
        void btn.offsetWidth;
        btn.classList.add(ok ? 'benar' : 'salah');
        fb.className = 'cek-fb ' + (ok ? 'benar' : 'salah');
        fb.innerHTML = ok ? icon('ok') + ' Benar! Kerja bagus.' : icon('no') + ' Belum tepat, coba lagi.';
        if (ok) cek.querySelectorAll('[data-opt]').forEach(function (b) { b.disabled = true; });
      });
    });
  });

  // Musik latar: dicoba otomatis saat halaman dibuka. Browser umumnya memblokir suara otomatis
  // sebelum ada interaksi, jadi bila diblokir musik dimulai pada ketukan/klik/tombol pertama.
  // Kalau pengguna menghentikannya lewat tombol, musik tidak dimulai lagi sendiri.
  var bgmBtn = document.getElementById('btn-bgm');
  var bgm = new Audio('assets/musik-latar.mp3');
  bgm.loop = true;
  bgm.volume = 0.25;
  bgm.preload = 'auto';
  var bgmWanted = false;
  var bgmStoppedByUser = false;

  function bgmUI(on) {
    bgmBtn.classList.toggle('bgm-active', on);
    bgmBtn.setAttribute('aria-pressed', on);
    var label = on ? 'Hentikan musik latar' : 'Putar musik latar';
    bgmBtn.title = label;
    bgmBtn.setAttribute('aria-label', label);
  }
  bgmBtn.addEventListener('click', function () {
    if (bgm.paused) {
      bgmStoppedByUser = false;
      startBgm();
    } else {
      bgmStoppedByUser = true;
      bgmWanted = false;
      bgm.pause();
      bgmUI(false);
    }
  });
  function startBgm() {
    bgmWanted = true;
    return bgm.play().then(function () { bgmUI(true); return true; })
      .catch(function () { bgmWanted = false; bgmUI(false); return false; });
  }
  function armFirstInteraction() {
    var events = ['click', 'keydown', 'touchend'];
    function onFirst(e) {
      if (bgmBtn.contains(e.target)) return; // klik pada tombol musik ditangani tombolnya sendiri
      if (bgmStoppedByUser) return;
      startBgm().then(function (ok) { if (ok) off(); });
    }
    function off() { events.forEach(function (ev) { document.removeEventListener(ev, onFirst, true); }); }
    events.forEach(function (ev) { document.addEventListener(ev, onFirst, true); });
  }
  // coba langsung; kalau diblokir, tunggu interaksi pertama
  startBgm().then(function (ok) { if (!ok) armFirstInteraction(); });
  bgm.addEventListener('error', function () {
    bgmBtn.disabled = true;
    bgmBtn.title = 'Musik latar tidak tersedia';
  });
  // jeda saat tab disembunyikan, lanjut kalau tadi memang diputar
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { if (!bgm.paused) bgm.pause(); }
    else if (bgmWanted) bgm.play().catch(function () {});
  });

  // Contoh teks: lapisan Struktur / Tersurat / Tersirat bisa dinyalakan sendiri-sendiri
  var teks = document.getElementById('teks-contoh');
  document.querySelectorAll('[data-layer]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var on = teks.classList.toggle('show-' + btn.getAttribute('data-layer'));
      btn.setAttribute('aria-pressed', on);
    });
  });
})();
