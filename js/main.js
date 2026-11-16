(function () {
  "use strict";

  var D = window.KICKOFF;
  var JOURS = ["mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  var MOIS_COURTS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

  // Typographie française : espace insécable avant ! ? : ; €
  function typo(s) {
    return String(s).replace(/ ([!?:;€])/g, " $1");
  }

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = typo(txt);
    return e;
  }

  function dateOf(iso, plus) {
    var p = iso.split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2] + (plus || 0));
  }

  function numJour(d) {
    return d.getDate() === 1 ? "1er" : String(d.getDate());
  }

  function cap(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
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

  /* ---------- Les cinq soirs ---------- */
  var soirsBox = document.getElementById("soirs-liste");
  D.soirs.forEach(function (s) {
    var li = el("li", "soir");
    li.appendChild(el("span", "soir-jour", s.jour));
    li.appendChild(el("h3", null, s.nom));
    li.appendChild(el("p", null, s.texte));
    soirsBox.appendChild(li);
  });

  /* ---------- Planning ---------- */
  var tbody = document.getElementById("planning-corps");
  var prochaine = null; // première soirée à venir (hors fermetures)

  D.semaines.forEach(function (sem) {
    var tr = el("tr");
    var debut = dateOf(sem.mardi, -1); // lundi
    var fin = dateOf(sem.mardi, 5);    // dimanche
    var enCours = today >= debut && today <= fin;
    if (enCours) tr.className = "en-cours";

    var th = el("th", "num", String(sem.n));
    th.scope = "row";
    th.setAttribute("aria-label", "Semaine " + sem.n);
    tr.appendChild(th);

    var per = el("td", "periode", sem.periode);
    if (enCours) per.appendChild(el("span", "badge", "Cette semaine"));
    tr.appendChild(per);

    sem.soirees.forEach(function (s, i) {
      var d = dateOf(sem.mardi, i);
      var td = el("td", "soiree" + (s.style ? " s-" + s.style : ""));
      td.setAttribute("data-label", cap(JOURS[i]) + " " + numJour(d) + " " + MOIS_COURTS[d.getMonth()]);
      var wrap = el("div", "soiree-txt");
      wrap.appendChild(el("strong", null, s.titre));
      if (s.detail) wrap.appendChild(el("span", null, s.detail));
      td.appendChild(wrap);
      if (d < today) td.classList.add("passee");
      if (!prochaine && d >= today && s.style !== "ferme") {
        prochaine = { date: d, jour: i, soiree: s };
      }
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  /* ---------- Prochaine soirée ---------- */
  var box = document.getElementById("prochaine");
  if (prochaine) {
    var d = prochaine.date;
    var quand = d.getTime() === today.getTime()
      ? "Ce soir"
      : cap(JOURS[prochaine.jour]) + " " + numJour(d) + " " + MOIS[d.getMonth()];
    box.appendChild(el("p", "prochaine-sur", d.getTime() === today.getTime() ? "À ne pas manquer" : "Prochaine soirée"));
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
      cible.textContent = typo(valeur);
    }
  }

  var I = D.infos;
  remplir("info-adresse", [I.adresse, I.ville].filter(Boolean).join(", "));
  remplir("info-horaires", I.horaires);
  remplir("info-telephone", I.telephone, I.telephone && "tel:" + I.telephone.replace(/[^\d+]/g, ""));
  remplir("info-email", I.email, I.email && "mailto:" + I.email);
  remplir("info-instagram", I.instagram && "Instagram", I.instagram);
  remplir("info-facebook", I.facebook && "Facebook", I.facebook);

  document.getElementById("annee").textContent = String(new Date().getFullYear());
})();
