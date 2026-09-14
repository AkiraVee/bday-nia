(function(){
  // ---- set your secret 6-digit password here ----
  const PASSWORD = "091409"; // 6 digits, no spaces, no letters, no punctuation

  const dotsEl   = document.getElementById('dots');
  if (!dotsEl) return; // this page has no password pad (e.g. memory.html)
  const dots     = Array.from(dotsEl.querySelectorAll('.dot'));
  const pad      = document.getElementById('pad');
  const card     = document.getElementById('card');
  const errorEl  = document.getElementById('errorToast');
  const celebrate= document.getElementById('celebrate');
  const backspace= document.getElementById('backspace');

  let input = "";

  function renderDots(){
    dots.forEach((d,i)=> d.classList.toggle('filled', i < input.length));
  }

  function showError(){
    dotsEl.classList.add('shake');
    errorEl.classList.add('show');
    setTimeout(()=>{
      dotsEl.classList.remove('shake');
    }, 460);
    setTimeout(()=>{
      errorEl.classList.remove('show');
      input = "";
      renderDots();
    }, 1300);
  }

  function unlock(){
    card.classList.add('unlocked');
    card.style.transform = "rotate(-1deg) scale(1.04)";
    card.style.opacity = "0";
    launchConfetti();
    setTimeout(()=>{
      celebrate.classList.add('show');
    }, 350);
    setTimeout(()=>{
      document.body.classList.add('page-exit');
    }, 1900);
    setTimeout(()=>{
      window.location.href = "calendar.html";
    }, 2200);
  }

  function addDigit(n){
    if (input.length >= 6) return;
    input += n;
    renderDots();
    if (input.length === 6){
      setTimeout(()=>{
        if (input === PASSWORD){
          unlock();
        } else {
          showError();
        }
      }, 180);
    }
  }

  pad.addEventListener('click', (e)=>{
    const btn = e.target.closest('.key');
    if (!btn) return;

    // ripple
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
    ripple.style.left = (e.clientX - rect.left - rect.width/2) + 'px';
    ripple.style.top  = (e.clientY - rect.top - rect.height/2) + 'px';
    btn.appendChild(ripple);
    setTimeout(()=> ripple.remove(), 500);

    addDigit(btn.dataset.num);
  });

  backspace.addEventListener('click', ()=>{
    input = input.slice(0, -1);
    renderDots();
  });

  document.addEventListener('keydown', (e)=>{
    if (e.key >= '0' && e.key <= '9') addDigit(e.key);
    if (e.key === 'Backspace') { input = input.slice(0,-1); renderDots(); }
  });

  function launchConfetti(){
    const colors = ['#ff8fab','#ff5c8a','#ffd8e6','#ffffff','#e8437a'];
    for (let i=0;i<60;i++){
      const c = document.createElement('div');
      c.className = 'confetti';
      c.style.left = Math.random()*100 + 'vw';
      c.style.width = (5+Math.random()*6) + 'px';
      c.style.height = (8+Math.random()*10) + 'px';
      c.style.background = colors[Math.floor(Math.random()*colors.length)];
      c.style.animationDuration = (2.2 + Math.random()*2) + 's';
      c.style.animationDelay = (Math.random()*0.6) + 's';
      celebrate.appendChild(c);
      setTimeout(()=> c.remove(), 5000);
    }
  }
})();

(function(){
  const nextBtn = document.getElementById('nextBtn');
  if (!nextBtn) return;

  nextBtn.addEventListener('click', ()=>{
    window.location.href = "main_menu.html";
  });
})();

(function(){
  // ---- floating background decor (shared across pages) ----
  const decor = document.getElementById('decor');
  if (!decor) return;

  const shapes = [
    // heart
    `<svg viewBox="0 0 24 24" width="34" height="34"><path fill="#ff8fab" d="M12 21s-7.5-4.6-10-9.3C.4 8.2 2.6 4.5 6.2 4.1c2-.2 3.8.9 4.8 2.6.1.2.4.2.5 0 1-1.7 2.8-2.8 4.8-2.6 3.6.4 5.8 4.1 4.2 7.6C19.5 16.4 12 21 12 21z"/></svg>`,
    // cherry pair
    `<svg viewBox="0 0 40 40" width="40" height="40"><circle cx="14" cy="28" r="7" fill="#e8437a"/><circle cx="28" cy="30" r="7" fill="#ff5c8a"/><path d="M16 22C16 12 24 6 30 5" stroke="#5a8f4a" stroke-width="2" fill="none"/><path d="M26 24C26 15 30 9 34 7" stroke="#5a8f4a" stroke-width="2" fill="none"/></svg>`,
    // small bow
    `<svg viewBox="0 0 40 26" width="34" height="22"><path d="M20 13c-4-7-17-9-18-2-1 6 9 8 18 2z" fill="#ffb8d2" stroke="#ff8fab"/><path d="M20 13c4-7 17-9 18-2 1 6-9 8-18 2z" fill="#ffb8d2" stroke="#ff8fab"/><circle cx="20" cy="13" r="3.6" fill="#ff8fab"/></svg>`,
    // ring/circle
    `<svg viewBox="0 0 20 20" width="14" height="14"><circle cx="10" cy="10" r="7" fill="none" stroke="#ff8fab" stroke-width="2"/></svg>`
  ];

  const total = 22;
  for (let i=0;i<total;i++){
    const el = document.createElement('div');
    el.className = 'deco';
    el.innerHTML = shapes[Math.floor(Math.random()*shapes.length)];
    const size = 0.6 + Math.random()*1.1;
    el.style.left = Math.random()*96 + '%';
    el.style.top  = Math.random()*94 + '%';
    el.style.transform = `scale(${size})`;
    el.style.setProperty('--r', (Math.random()*20-10)+'deg');
    el.style.animationDuration = (4 + Math.random()*4) + 's';
    el.style.animationDelay = (Math.random()*4) + 's';
    decor.appendChild(el);
  }
})();

(function(){
  // The modals open/close natively via anchor links + CSS :target,
  // so they work even if this script fails to load. This just adds
  // two conveniences: click-outside-to-close and Escape-to-close.

  function closeModal(){
    if (history.pushState){
      history.pushState('', document.title, window.location.pathname + window.location.search);
    } else {
      window.location.hash = '';
    }
  }

  document.querySelectorAll('.modal-overlay').forEach((overlay)=>{
    overlay.addEventListener('click', (e)=>{
      if (e.target === overlay) closeModal();
    });
  });

  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape') closeModal();
  });
})();

(function(){
  const list = document.getElementById('reasonsList');
  if (!list) return;

  // Placeholder reasons — swap this array out for the real 100
  // whenever you're ready. The list (and the scrollbar) will resize
  // automatically to however many entries you put here.
  const REASONS = Array.from({ length: 100 }, (_, i) =>
    `Placeholder reason ${i + 1} — waiting for the real one.`
  );

  REASONS.forEach((text, i)=>{
    const li = document.createElement('li');
    li.innerHTML = `<span class="num">${i + 1}.</span><span>${text}</span>`;
    list.appendChild(li);
  });
})();


/* Fits the fixed 1440x1024 "stage" canvas (used on the main menu,
   memory, and special-day pages) to whatever screen it's shown on.

   - On phones (<=700px wide) this script steps aside entirely and lets
     the plain stacked mobile layout in styles.css take over.
   - On everything else (tablets, laptops, desktops, ultra-wide
     monitors) it scales the canvas down — or up to 1:1, never beyond —
     so the whole scene fits the screen with no side-scrolling, and
     recalculates on resize / orientation change.

   Safe to include on any page: it silently does nothing if none of
   the known stage elements are present. */
(function () {
  var STAGE_W = 1440;
  var STAGE_H = 1024;
  var MOBILE_BREAKPOINT = 700;
  var EDGE_PADDING = 24; // keeps the scaled canvas from touching the screen edge

  var configs = [
    { stageSelector: ".stage", bodyClass: "menu-body" },
    { stageSelector: ".special-stage", bodyClass: "special-body" }
  ];

  function clearInlineStyles(stage, body) {
    stage.style.transform = "";
    stage.style.transformOrigin = "";
    body.style.width = "";
    body.style.height = "";
    body.style.margin = "";
  }

  function fit() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var isPhone = vw <= MOBILE_BREAKPOINT;

    configs.forEach(function (cfg) {
      var stage = document.querySelector(cfg.stageSelector);
      var body = document.body;
      if (!stage || !body.classList.contains(cfg.bodyClass)) return;

      if (isPhone) {
        // Hand off to the CSS mobile stacked layout.
        clearInlineStyles(stage, body);
        return;
      }

      var scaleW = (vw - EDGE_PADDING) / STAGE_W;
      var scaleH = (vh - EDGE_PADDING) / STAGE_H;
      var scale = Math.min(1, scaleW, scaleH);

      stage.style.transformOrigin = "center center";
      stage.style.transform = "scale(" + scale + ")";
    });
  }

  fit();
  window.addEventListener("resize", fit);
  window.addEventListener("orientationchange", function () {
    // iOS reports the new innerWidth/Height a beat late after rotation.
    setTimeout(fit, 200);
  });
})();

/* Keeps the memory page's heading + scattered books fitting on screen
   with no scrolling, on any device size or orientation. Unlike the
   fixed-canvas fit() above, this measures the content's real (unscaled)
   size each time and only shrinks it — never enlarges past 1:1 — so it
   works whether the grid is showing 5 wide books or has wrapped down to
   2 per row on a narrow phone. Scaling from the default center origin
   keeps it visually centered, matching how the flex body already
   centers the unscaled box. */
(function () {
  var body = document.body;
  if (!body.classList.contains("memory-body")) return;

  var stage = document.querySelector(".mem-stage");
  if (!stage) return;

  var VIEWPORT_MARGIN = 16; // small breathing room so nothing touches the edge

  function fitMemory() {
    stage.style.transform = ""; // reset so measurements reflect natural size

    var bodyStyle = window.getComputedStyle(body);
    var paddingY = parseFloat(bodyStyle.paddingTop) + parseFloat(bodyStyle.paddingBottom);
    var paddingX = parseFloat(bodyStyle.paddingLeft) + parseFloat(bodyStyle.paddingRight);

    var naturalHeight = stage.scrollHeight;
    var naturalWidth = stage.scrollWidth;

    var availableHeight = window.innerHeight - paddingY - VIEWPORT_MARGIN;
    var availableWidth = window.innerWidth - paddingX - VIEWPORT_MARGIN;

    var scale = Math.min(1, availableHeight / naturalHeight, availableWidth / naturalWidth);

    if (scale < 1) {
      stage.style.transform = "scale(" + scale + ")";
    }
  }

  fitMemory();
  window.addEventListener("resize", fitMemory);
  window.addEventListener("orientationchange", function () {
    setTimeout(fitMemory, 200);
  });
})();

(function () {
  /* ---------------------------------------------------------------
     EDIT ME: your real songs go here.
     - title / artist : shown in the mini player, the full player,
       and the playlist
     - src            : path to the actual audio file. Drop your
       files into an assets/audio/ folder next to your HTML and
       point each src at the matching filename (any browser-playable
       format works — mp3, m4a, ogg, wav).
     - cover          : path to the album art shown in the big player
       panel and next to each row in the playlist. Drop cover images
       into an assets/covers/ folder. Optional — leave it out (or set
       to "") and the plain music-note icon is shown instead.
     Add, remove, or reorder entries freely; everything below adapts
     automatically to however many songs are in this list.
  --------------------------------------------------------------- */
  var SONGS = [
    { title: "Last Night on Earth", artist: "Green Day", src: "assets/audio/last_night_on_earth.mp3", cover: "assets/covers/last_night_album_cover.jpg" },
    { title: "About You", artist: "The 1975", src: "assets/audio/about_you.mp3", cover: "assets/covers/about_you_album_cover.jpg" },
    { title: "Balisong", artist: "Rico Blanco", src: "assets/audio/balisong.mp3", cover: "assets/covers/balisong_album_cover.jpg" },
    { title: "Can't Help Falling in Love", artist: "Elvis Presley", src: "assets/audio/cant_help_falling_in_love.mp3", cover: "assets/covers/cant_help_album_Cover.jpg" },
    { title: "Magnolia", artist: "Magnolia Celebration", src: "assets/audio/magnolia.mp3", cover: "assets/covers/magnolia_album_cover.jpg" }
  ];

  var STORAGE_KEY = "specialday-track-index";
  var VOLUME_STORAGE_KEY = "specialday-volume";

  // localStorage throws in some contexts (Safari private browsing,
  // sandboxed iframes, cookies-disabled setups) — never let that take
  // the whole player down, just fall back to an in-memory value.
  function safeGetStored() {
    try { return localStorage.getItem(STORAGE_KEY); }
    catch (e) { return null; }
  }
  function safeSetStored(value) {
    try { localStorage.setItem(STORAGE_KEY, value); }
    catch (e) { /* ignore — track choice just won't persist this session */ }
  }

  var audio = document.getElementById("player-audio");
  var playerPanel = document.querySelector(".player-panel");
  var playlistPanel = document.querySelector(".playlist-panel");
  if (!audio || (!playerPanel && !playlistPanel)) return; // not a player page

  // album.html is the dedicated full player; everywhere else (e.g. a
  // compact mini player embedded on another page) a playlist click
  // should hand off to album.html instead of trying to play in place.
  var onAlbumPage = document.body.classList.contains("album-body");

  var playBtn = document.querySelector(".player-play");
  var prevBtn = document.querySelector(".player-prev");
  var nextBtn = document.querySelector(".player-next");
  var titleEl = document.querySelector(".player-title");
  var artistEl = document.querySelector(".player-artist");
  var curTimeEl = document.querySelector(".player-time-current");
  var durTimeEl = document.querySelector(".player-time-duration");
  var progressBar = document.querySelector(".player-progress-bar");
  var progressFill = document.querySelector(".player-progress-fill");
  var listEl = document.querySelector(".playlist-list");
  var coverImg = document.querySelector(".player-cover-img");
  var artPanel = document.querySelector(".album-art-large") || document.querySelector(".player-art");
  var volumeBtn = document.querySelector(".volume-btn");
  var volumeSlider = document.querySelector(".volume-slider");

  var current = parseInt(safeGetStored(), 10);
  if (isNaN(current) || current < 0 || current >= SONGS.length) current = 0;

  function formatTime(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function markPlayingRow() {
    if (!listEl) return;
    var rows = listEl.querySelectorAll(".playlist-item");
    rows.forEach(function (row, i) {
      row.classList.toggle("playing", i === current);
    });
  }

  function renderPlaylist() {
    if (!listEl) return;
    listEl.innerHTML = "";
    SONGS.forEach(function (song, i) {
      var li = document.createElement("li");
      li.className = "playlist-item" + (i === current ? " playing" : "");
      var thumb = song.cover ? '<img class="playlist-thumb" src="' + song.cover + '" alt="">' : "";
      li.innerHTML =
        '<span class="playlist-num">' + (i + 1) + "</span>" +
        thumb +
        '<span class="playlist-info">' +
        '<span class="playlist-song-title">' + song.title + "</span>" +
        '<span class="playlist-song-artist">' + song.artist + "</span>" +
        "</span>";
      // On the full album page, switch tracks right where you are.
      // Anywhere else (a compact mini player), hand off to album.html.
      li.addEventListener("click", function () {
        current = i;
        safeSetStored(current);
        if (onAlbumPage) {
          loadSong(current, true);
        } else {
          goToAlbum();
        }
      });
      listEl.appendChild(li);
    });
  }

  function updatePlayIcon() {
    if (!playBtn) return;
    playBtn.classList.toggle("is-playing", !audio.paused && !audio.ended);
  }

  function updateCoverArt(song) {
    if (!coverImg || !artPanel) return;
    if (song.cover) {
      coverImg.src = song.cover;
      artPanel.classList.add("has-cover");
    } else {
      coverImg.src = "";
      artPanel.classList.remove("has-cover");
    }
  }

  function fillSlider(slider, percent) {
    slider.style.background =
      "linear-gradient(to right, #fff " + percent + "%, rgba(255,255,255,0.3) " + percent + "%)";
  }

  function updateVolumeUI() {
    if (!volumeBtn && !volumeSlider) return;
    var muted = audio.muted || audio.volume === 0;
    if (volumeBtn) volumeBtn.classList.toggle("is-muted", muted);
    if (volumeSlider) {
      var percent = audio.muted ? 0 : audio.volume * 100;
      volumeSlider.value = percent;
      fillSlider(volumeSlider, percent);
    }
  }

  (function setupVolume() {
    if (!volumeSlider && !volumeBtn) return;

    var storedVolume = null;
    try { storedVolume = localStorage.getItem(VOLUME_STORAGE_KEY); } catch (e) { /* ignore */ }
    var initial = parseFloat(storedVolume);
    if (isNaN(initial) || initial < 0 || initial > 100) initial = 80;

    audio.volume = initial / 100;
    audio.muted = false;
    updateVolumeUI();

    if (volumeSlider) {
      volumeSlider.addEventListener("input", function (e) {
        e.stopPropagation();
        var value = parseFloat(volumeSlider.value);
        audio.muted = false;
        audio.volume = value / 100;
        try { localStorage.setItem(VOLUME_STORAGE_KEY, value); } catch (err) { /* ignore */ }
        updateVolumeUI();
      });
      volumeSlider.addEventListener("click", function (e) { e.stopPropagation(); });
    }

    if (volumeBtn) {
      volumeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        audio.muted = !audio.muted;
        updateVolumeUI();
      });
    }
  })();

  function loadSong(index, autoplay) {
    current = index;
    var song = SONGS[current];
    audio.src = song.src;
    if (titleEl) titleEl.textContent = song.title;
    if (artistEl) artistEl.textContent = song.artist;
    if (curTimeEl) curTimeEl.textContent = "0:00";
    if (durTimeEl) durTimeEl.textContent = "0:00";
    if (progressFill) progressFill.style.width = "0%";
    updateCoverArt(song);
    safeSetStored(current);
    markPlayingRow();

    if (autoplay) {
      audio.play().catch(function () {
        /* file missing, or the browser blocked autoplay — fail quietly */
      });
    }
    updatePlayIcon();
  }

  function playPause() {
    if (!audio.src) loadSong(current, false);
    if (audio.paused) {
      audio.play().catch(function () {});
    } else {
      audio.pause();
    }
  }

  function prevSong() {
    loadSong((current - 1 + SONGS.length) % SONGS.length, true);
  }

  function nextSong() {
    loadSong((current + 1) % SONGS.length, true);
  }

  function goToAlbum() {
    window.location.href = "album.html";
  }

  if (playBtn) playBtn.addEventListener("click", function (e) { e.stopPropagation(); playPause(); });
  if (prevBtn) prevBtn.addEventListener("click", function (e) { e.stopPropagation(); prevSong(); });
  if (nextBtn) nextBtn.addEventListener("click", function (e) { e.stopPropagation(); nextSong(); });

  if (progressBar) {
    progressBar.addEventListener("click", function (e) {
      e.stopPropagation();
      if (!audio.duration) return;
      var rect = progressBar.getBoundingClientRect();
      var ratio = (e.clientX - rect.left) / rect.width;
      audio.currentTime = ratio * audio.duration;
    });
  }

  // If a compact mini player is ever embedded on another page (one with
  // a .player-panel wrapper), clicking the card anywhere that isn't one
  // of the controls above (they already stopped propagation) hands off
  // to the full player on album.html. No page currently uses this, but
  // it's kept ready for a future mini-player.
  if (playerPanel) {
    playerPanel.addEventListener("click", goToAlbum);
  }

  audio.addEventListener("timeupdate", function () {
    if (curTimeEl) curTimeEl.textContent = formatTime(audio.currentTime);
    if (progressFill && audio.duration) {
      progressFill.style.width = (audio.currentTime / audio.duration) * 100 + "%";
    }
  });
  audio.addEventListener("loadedmetadata", function () {
    if (durTimeEl) durTimeEl.textContent = formatTime(audio.duration);
  });
  audio.addEventListener("play", updatePlayIcon);
  audio.addEventListener("pause", updatePlayIcon);
  audio.addEventListener("ended", nextSong);

  renderPlaylist();
  // Load the stored (or first) track's info and cover art immediately so
  // the page never looks blank — but never autoplay on page load. Audio
  // only starts when the person taps play, taps a playlist row, or uses
  // prev/next, all of which pass autoplay=true themselves.
  loadSong(current, false);
})();