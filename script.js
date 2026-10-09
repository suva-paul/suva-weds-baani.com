/* Suvankar & Sarbani — standalone wedding site logic. Edit data.js for content. */

(function () {
  var W = window.WEDDING;
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Petals ---------- */
  var petalChars = ["🌸", "💗", "✨", "🌷", "💍"];
  var petals = $("petals");
  for (var i = 0; i < 18; i++) {
    var s = document.createElement("span");
    s.className = "petal";
    s.textContent = petalChars[i % petalChars.length];
    s.style.left = Math.random() * 100 + "%";
    s.style.bottom = "-40px";
    s.style.animationDuration = 12 + Math.random() * 14 + "s";
    s.style.animationDelay = -Math.random() * 20 + "s";
    s.style.fontSize = 12 + Math.random() * 16 + "px";
    petals.appendChild(s);
  }

  /* ---------- Nav ---------- */
  var nav = $("nav"), navLinks = $("navLinks");
  $("navToggle").addEventListener("click", function () { navLinks.classList.toggle("open"); });
  navLinks.addEventListener("click", function (e) {
    if (e.target.tagName === "A") navLinks.classList.remove("open");
  });
  var onScroll = function () { nav.classList.toggle("solid", window.scrollY > 40); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Hero ---------- */
  $("heroKicker").textContent = W.hero.kicker;
  $("heroNames").textContent = W.couple.groom + " & " + W.couple.bride;
  $("heroImg").src = W.hero.image;
  /* $("heroSub").textContent = W.hero.subtitle; */
  $("heroTag").textContent = W.couple.tagline;
  $("footText").textContent = "ভালোবাসায় নির্মিত • নতুন অধ্যায়ের শুরু © শুভঙ্কর ২০২৬" ;

  /* ---------- Scratch card ---------- */
  $("scratchName").textContent = W.weddingLabel;
  $("scratchDay").textContent = W.weddingDayLabel;
  $("scratchDate-bn").textContent = W.weddingDateLabelbn;
  $("scratchDate-en").textContent = W.weddingDateLabelen;
  $("scratchVenue").textContent = W.wvenue.name + ", " + W.wvenue.address;
  var canvas = $("scratchCanvas"), ctx = canvas.getContext("2d"), scratching = false, cleared = false;
  function paintCover() {
    var r = canvas.getBoundingClientRect();
    canvas.width = r.width; canvas.height = r.height;
    var g = ctx.createLinearGradient(0, 0, r.width, r.height);
    g.addColorStop(0, "#c9a227"); g.addColorStop(0.5, "#f2e0a8"); g.addColorStop(1, "#b8901f");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = g; ctx.fillRect(0, 0, r.width, r.height);
    ctx.fillStyle = "rgba(80,55,10,0.65)";
    ctx.font = "500 14px 'Hind Siliguri', 'Noto Sans Bengali', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("এখানে স্ক্রাচ করুন", r.width / 2, r.height / 2);
    cleared = false;
    canvas.style.opacity = 1;
  }
  function scratchAt(e) {
    var r = canvas.getBoundingClientRect();
    var p = e.touches ? e.touches[0] : e;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(p.clientX - r.left, p.clientY - r.top, 24, 0, Math.PI * 2);
    ctx.fill();
  }
  function checkCleared() {
    if (cleared) return;
    var d = ctx.getImageData(0, 0, canvas.width, canvas.height).data, clear = 0;
    for (var i = 3; i < d.length; i += 40) if (d[i] === 0) clear++;
    if (clear / (d.length / 40) > 0.5) {
      cleared = true;
      canvas.style.transition = "opacity .6s ease";
      canvas.style.opacity = 0;
      toast("তারিখটি মনে রাখুন — " + W.weddingDateLabelen + " 💛");
    }
  }
  canvas.addEventListener("pointerdown", function (e) { scratching = true; scratchAt(e); });
  canvas.addEventListener("pointermove", function (e) { if (scratching) scratchAt(e); });
  ["pointerup", "pointerleave"].forEach(function (ev) {
    canvas.addEventListener(ev, function () { if (scratching) { scratching = false; checkCleared(); } });
  });
  $("scratchReset").addEventListener("click", function () { canvas.style.transition = "none"; paintCover(); });
  window.addEventListener("resize", function () { if (!cleared) paintCover(); });

  /* Always start with the scratch layer covering the card */
  canvas.style.opacity = "1";
  paintCover();
  /* Repaint once the Bengali webfont is ready, in case it loaded after first paint */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { if (!cleared) paintCover(); });
  }

  /* ---------- Family ---------- */
  $("familyGrid").innerHTML = W.family
    .map(function (f) {
      return (
        '<div class="family-card glass reveal">' +
          '<h3>' +
            '<svg class="family-icon" viewBox="0 0 24 24" aria-hidden="true">' +
              '<circle cx="9" cy="8" r="3"></circle>' +
              '<circle cx="17" cy="9" r="2.5"></circle>' +
              '<path d="M3.5 19c.5-3.5 2.5-5.5 5.5-5.5s5 2 5.5 5.5"></path>' +
              '<path d="M14 14c2.8-.1 5 1.7 5.5 4.5"></path>' +
            '</svg>' +
            '<span>' + f.side + '</span>' +
          '</h3>' +
          '<ul>' +
            f.members.map(function (m) {
              return (
                '<li>' +
                  '<span class="family-member-name">' + m.name + '</span>' +
                  '<small>' + m.role + '</small>' +
                '</li>'
              );
            }).join("") +
          '</ul>' +
        '</div>'
      );
    })
    .join("");

  /* ---------- Events ---------- */
  $("eventsList").innerHTML = W.events
    .map(function (e) {
      return (
        '<article class="event glass reveal"><img src="' + e.image + '" alt="' + e.name + '-এর ছবি" loading="lazy" />' +
        "<div><h3>" + e.name + "</h3>" +
        "<p>" + e.description + "</p>" +
        '<div class="meta">' +
          '<div class="event-meta-item">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true">' +
              '<rect x="4" y="5" width="16" height="15" rx="2"></rect>' +
              '<line x1="8" y1="3" x2="8" y2="7"></line>' +
              '<line x1="16" y1="3" x2="16" y2="7"></line>' +
              '<line x1="4" y1="9" x2="20" y2="9"></line>' +
            '</svg>' +
            '<span>' + e.date + '</span>' +
          '</div>' +

          '<div class="event-meta-item">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true">' +
              '<circle cx="12" cy="12" r="8.5"></circle>' +
              '<line x1="12" y1="7" x2="12" y2="12"></line>' +
              '<line x1="12" y1="12" x2="15.5" y2="14"></line>' +
            '</svg>' +
            '<span>' + e.time + '</span>' +
          '</div>' +

          '<div class="event-meta-item">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true">' +
              '<path d="M12 21c3.5-4.2 6.5-7.4 6.5-11A6.5 6.5 0 0 0 5.5 10c0 3.6 3 6.8 6.5 11z"></path>' +
              '<circle cx="12" cy="10" r="2.2"></circle>' +
            '</svg>' +
            '<span>' + e.venue + '</span>' +
          '</div>' +
        '</div>' + 
        "</div></article>"
      );
    })
    .join("");

  /* ---------- Venue ---------- */
  $("venueName").textContent = W.venue.name;
  $("venueAddress").textContent = W.venue.address;
  $("venueDir").href = W.venue.directions;
  $("venueMap").src = W.venue.mapsEmbed;

  /* ---------- Gallery + lightbox ---------- */
  /* $("galleryGrid").innerHTML = W.gallery
    .map(function (g, i) {
      return '<figure data-i="' + i + '"><img src="' + g.src + '" alt="' + g.caption + '" loading="lazy" /><figcaption>' + g.caption + "</figcaption></figure>";
    })
    .join("");
  var lb = $("lightbox"), lbImg = $("lbImg"), lbCap = $("lbCap"), cur = 0;
  function openLb(i) {
    cur = (i + W.gallery.length) % W.gallery.length;
    lbImg.src = W.gallery[cur].src;
    lbImg.alt = W.gallery[cur].caption;
    lbCap.textContent = W.gallery[cur].caption;
    lb.hidden = false;
  }
  $("galleryGrid").addEventListener("click", function (e) {
    var fig = e.target.closest("figure");
    if (fig) openLb(Number(fig.dataset.i));
  });
  $("lbClose").addEventListener("click", function () { lb.hidden = true; });
  $("lbPrev").addEventListener("click", function () { openLb(cur - 1); });
  $("lbNext").addEventListener("click", function () { openLb(cur + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) lb.hidden = true; });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") lb.hidden = true;
    if (e.key === "ArrowLeft") openLb(cur - 1);
    if (e.key === "ArrowRight") openLb(cur + 1);
  }); */

  /* ---------- Travel ---------- */
  $("travelGrid").innerHTML = W.travel
    .map(function (t) { return '<div class="card reveal"><h3>' + t.title + "</h3><p>" + t.detail + "</p></div>"; })
    .join("");

  /* ---------- Hashtag ---------- */
  $("hashtagText").textContent = W.couple.hashtag;
  $("copyHashtag").addEventListener("click", function () {
    var t = W.couple.hashtag;
    if (navigator.clipboard) navigator.clipboard.writeText(t);
    toast("হ্যাশট্যাগ কপি হয়েছে!");
  });

  /* ---------- Thank you ---------- */
  $("thanksTitle").textContent = W.thankYou.title;
  $("thanksBody").textContent = W.thankYou.body;
  $("thanksNames").textContent = W.couple.groom + " & " + W.couple.bride;
  $("thanksInfo").innerHTML = W.events[1].date + "<br><span>" + W.events[1].venue + "</span>";


  /* ---------- Storage helpers ---------- */
  function load(k) { try { return JSON.parse(localStorage.getItem(k) || "[]"); } catch (e) { return []; } }
  function save(k, v) { localStorage.setItem(k, JSON.stringify(v)); }

  /* ---------- RSVP ---------- */
  /* $("rsvpForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = new FormData(e.target);
    var obj = { at: new Date().toISOString() };
    f.forEach(function (v, k) {
      obj[k] = v;
    });

    var all = load("rsvps");
    all.push(obj);
    save("rsvps", all);
   
    var whatsappNumber = "919933018266";
    
    var whatsappMessage =
      "💐 সংবর্ধনার RSVP 💐\n\n" +
      "অতিথির নাম: " + obj.name + "\n" +
      "ফোন নম্বর: " + obj.phone + "\n" +
      "অতিথি সংখ্যা: " + obj.guests + "\n" +
      "উপস্থিতি: " + obj.attendance + "\n" +
      "বার্তা: " + (obj.message || "—");
    
    var whatsappURL = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(whatsappMessage);
    window.open(whatsappURL, "_blank");
    e.target.reset();
    toast("আপনার বার্তা হোয়াটসঅ্যাপে পাঠানোর জন্য প্রস্তুত 💗");
  }); */
  /* $("exportRsvp").addEventListener("click", function (e) {
    e.preventDefault();
    var all = load("rsvps");
    if (!all.length) return toast("No RSVPs saved yet.");
    var cols = ["at", "name", "phone", "guests", "attendance", "meal", "message"];
    var csv = [cols.join(",")]
      .concat(all.map(function (r) {
        return cols.map(function (c) { return '"' + String(r[c] || "").replace(/"/g, '""') + '"'; }).join(",");
      }))
      .join("\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "rsvps.csv";
    a.click();
  }); */

  /* ---------- Countdown ---------- */
  var target = new Date(W.weddingDateISO).getTime();
  $("cdSub").textContent = "'আমরা' চিরন্তন হওয়া পর্যন্ত";
  var units = [["দিন", 864e5], ["ঘণ্টা", 36e5], ["মিনিট", 6e4], ["সেকেন্ড", 1e3]];
  var grid = $("cdGrid");
  units.forEach(function (u) {
    grid.insertAdjacentHTML(
      "beforeend",
      '<div class="cd-box"><div class="cd-num" data-u="' + u[0] + '">0</div><div class="cd-lbl">' + u[0] + "</div></div>"
    );
  });
  function tick() {
    var diff = Math.max(0, target - Date.now());
    units.forEach(function (u) {
      var v = Math.floor(diff / u[1]);
      diff -= v * u[1];
      grid.querySelector('[data-u="' + u[0] + '"]').textContent = String(v).padStart(2, "0");
    });
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Toast ---------- */
  var toastEl = $("toast"), toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 2800);
  }

  /* ---------- Reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  
  /* ---------- Envelope intro / Proceed / Music ---------- */
  var envelope = $("envelope");
  var envelopeHint = $("envelopeHint");
  var heroMain = $("heroMain");
  var weddingMusic = $("weddingMusic");
  var envelopeOpened = false;

    function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;

    /* Play the envelope-opening animation (flap flips, seal fades) */
    envelope.classList.add("opened");
    if (envelopeHint) envelopeHint.classList.add("hide");

    /* After the animation has had time to play, reveal the photo hero AND the full website together */
    setTimeout(function () {
      envelope.style.display = "none";
      if (envelopeHint) envelopeHint.style.display = "none";
      if (heroMain) {
        heroMain.hidden = false;
        heroMain.classList.add("in");
      }

      document.body.classList.remove("pre-entry");
      setTimeout(function () { paintCover(); }, 100);

      /* Start wedding music */
      if (weddingMusic) {
        weddingMusic.volume = 0.30;
        var playPromise = weddingMusic.play();
        if (playPromise !== undefined) {
          playPromise.catch(function () {
            /* Browser prevented playback */
          });
        }
      }

      /* Scroll to the beginning of the website */
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 600);
  }

  if (envelope) {
    envelope.addEventListener("click", openEnvelope);
    envelope.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        openEnvelope();
      }
    });
  }

  var musicToggle = $("musicToggle");
  var weddingMusic = $("weddingMusic");

  if (musicToggle && weddingMusic) {
    musicToggle.addEventListener("click", function () {
      if (weddingMusic.paused) {
        weddingMusic.play();
        musicToggle.textContent = "🎵";
        musicToggle.setAttribute("aria-label", "গান থামান");
        musicToggle.classList.remove("paused");
      } else {
        weddingMusic.pause();
        musicToggle.textContent = "🔇";
        musicToggle.setAttribute("aria-label", "গান চালান");
        musicToggle.classList.add("paused");
      }
    });
  }
})();

