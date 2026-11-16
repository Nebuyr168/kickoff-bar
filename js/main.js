(function () {
  "use strict";

  var D = window.KICKOFF;
  var R = window.KICKOFF_RENDER;

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = R.typo(txt);
    return e;
  }

  var today = new Date();
  today.setHours(0, 0, 0, 0);

  /* ---------- Menu mobile ---------- */
  var burger = document.querySelector(".burger");
  var nav = document.getElementById("nav");
  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      nav.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Diaporama ---------- */
  (function () {
    var root = document.querySelector(".hero");
    var slides = Array.prototype.slice.call(root.querySelectorAll(".slide"));
    var dots = Array.prototype.slice.call(root.querySelectorAll(".dot"));
    var toggle = root.querySelector(".hero-toggle");
    var current = 0;
    var timer = null;
    var playing = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function show(i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        var on = k === current;
        s.classList.toggle("active", on);
        s.setAttribute("aria-hidden", String(!on));
        s.querySelectorAll("a").forEach(function (a) { a.tabIndex = on ? 0 : -1; });
      });
      dots.forEach(function (d, k) {
        if (k === current) d.setAttribute("aria-current", "true");
        else d.removeAttribute("aria-current");
      });
    }

    function stop() { clearInterval(timer); timer = null; }
    function start() {
      stop();
      if (playing) timer = setInterval(function () { show(current + 1); }, 6000);
    }
    function refreshToggle() {
      toggle.setAttribute("aria-label", playing ? "Mettre le diaporama en pause" : "Relancer le diaporama");
      toggle.classList.toggle("paused", !playing);
    }

    root.querySelector(".prev").addEventListener("click", function () { show(current - 1); start(); });
    root.querySelector(".next").addEventListener("click", function () { show(current + 1); start(); });
    dots.forEach(function (d, k) {
      d.addEventListener("click", function () { show(k); start(); });
    });
    toggle.addEventListener("click", function () {
      playing = !playing;
      refreshToggle();
      start();
    });
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });

    show(0);
    refreshToggle();
    start();
  })();

  /* ---------- Contenu issu de data.js (toujours à jour, même sans build) ---------- */
  document.getElementById("soirs-liste").innerHTML = R.soirs(D);
  document.getElementById("faq-liste").innerHTML = R.faq(D);
  var tbody = document.getElementById("planning-corps");
  tbody.innerHTML = R.planning(D);

  /* ---------- Planning : semaine en cours et soirées passées ---------- */
  tbody.querySelectorAll("tr").forEach(function (tr) {
    var mardi = tr.getAttribute("data-mardi");
    if (today >= R.dateOf(mardi, -1) && today <= R.dateOf(mardi, 5)) { // du lundi au dimanche
      tr.classList.add("en-cours");
      tr.querySelector(".periode").appendChild(el("span", "badge", "Cette semaine"));
    }
    tr.querySelectorAll(".soiree").forEach(function (td) {
      if (R.dateOf(td.getAttribute("data-date")) < today) td.classList.add("passee");
    });
  });

  /* ---------- Prochaine soirée (hors fermetures) ---------- */
  var prochaine = null;
  D.semaines.forEach(function (sem) {
    sem.soirees.forEach(function (s, i) {
      var d = R.dateOf(sem.mardi, i);
      if (!prochaine && d >= today && s.style !== "ferme") prochaine = { date: d, jour: i, soiree: s };
    });
  });

  var box = document.getElementById("prochaine");
  if (prochaine) {
    var d = prochaine.date;
    var ceSoir = d.getTime() === today.getTime();
    var quand = ceSoir ? "Ce soir" : R.cap(R.JOURS[prochaine.jour]) + " " + R.numJour(d) + " " + R.MOIS[d.getMonth()];
    box.appendChild(el("p", "prochaine-sur", ceSoir ? "À ne pas manquer" : "Prochaine soirée"));
    box.appendChild(el("p", "prochaine-date", quand));
    box.appendChild(el("p", "prochaine-titre", prochaine.soiree.titre));
    var sous = D.soirs[prochaine.jour].nom + (prochaine.soiree.detail ? " · " + prochaine.soiree.detail : "");
    box.appendChild(el("p", "prochaine-detail", sous));
  } else {
    box.appendChild(el("p", "prochaine-sur", "Programmation"));
    box.appendChild(el("p", "prochaine-titre", "La prochaine programmation arrive bientôt."));
  }

  /* ---------- Infos pratiques ---------- */
  function remplir(id, valeur, lien) {
    var cible = document.getElementById(id);
    if (!cible) return;
    cible.textContent = "";
    if (!valeur) {
      cible.appendChild(el("span", "todo", "À compléter"));
    } else if (lien) {
      var a = el("a", null, valeur);
      a.href = lien;
      if (/^https?:/.test(lien)) { a.target = "_blank"; a.rel = "noopener"; }
      cible.appendChild(a);
    } else {
      cible.textContent = R.typo(valeur);
    }
  }

  var I = D.infos;
  remplir("info-adresse", [I.adresse, [I.codePostal, I.ville].filter(Boolean).join(" ")].filter(Boolean).join(", "));
  remplir("info-horaires", I.horaires);
  remplir("info-telephone", I.telephone, I.telephone && "tel:" + I.telephone.replace(/[^\d+]/g, ""));
  remplir("info-email", I.email, I.email && "mailto:" + I.email);
  remplir("info-instagram", I.instagram && "Instagram", I.instagram);
  remplir("info-facebook", I.facebook && "Facebook", I.facebook);

  document.getElementById("annee").textContent = String(new Date().getFullYear());
})();
