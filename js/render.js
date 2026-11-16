/*
 * Génère le HTML du contenu (soirs, planning, FAQ) à partir de js/data.js.
 * Utilisé à la fois par le navigateur (js/main.js) et par tools/build.js,
 * qui écrit ce même HTML en dur dans index.html pour les moteurs de recherche.
 */
(function (root) {
  "use strict";

  var JOURS = ["mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  var MOIS_COURTS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

  // Typographie française : espace insécable avant ! ? : ; €
  function typo(s) {
    return String(s).replace(/ ([!?:;€])/g, " $1");
  }

  function esc(s) {
    return typo(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function dateOf(iso, plus) {
    var p = iso.split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2] + (plus || 0));
  }

  function iso(d) {
    function z(n) { return (n < 10 ? "0" : "") + n; }
    return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate());
  }

  function numJour(d) {
    return d.getDate() === 1 ? "1er" : String(d.getDate());
  }

  function cap(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function soirs(D) {
    return D.soirs.map(function (s) {
      return '<li class="soir"><span class="soir-jour">' + esc(s.jour) + "</span><h3>" + esc(s.nom) + "</h3><p>" + esc(s.texte) + "</p></li>";
    }).join("\n");
  }

  function planning(D) {
    return D.semaines.map(function (sem) {
      var cells = sem.soirees.map(function (s, i) {
        var d = dateOf(sem.mardi, i);
        return '<td class="soiree' + (s.style ? " s-" + s.style : "") + '" data-date="' + iso(d) +
          '" data-label="' + cap(JOURS[i]) + " " + numJour(d) + " " + MOIS_COURTS[d.getMonth()] + '">' +
          '<div class="soiree-txt"><strong>' + esc(s.titre) + "</strong>" +
          (s.detail ? "<span>" + esc(s.detail) + "</span>" : "") + "</div></td>";
      }).join("");
      return '<tr data-mardi="' + sem.mardi + '"><th class="num" scope="row" aria-label="Semaine ' + sem.n + '">' + sem.n +
        '</th><td class="periode">' + esc(sem.periode) + "</td>" + cells + "</tr>";
    }).join("\n");
  }

  function faq(D) {
    return D.faq.map(function (f) {
      return "<details><summary>" + esc(f.q) + "</summary><p>" + esc(f.r) + "</p></details>";
    }).join("\n");
  }

  var api = {
    JOURS: JOURS, MOIS: MOIS, typo: typo, dateOf: dateOf, iso: iso, numJour: numJour, cap: cap,
    soirs: soirs, planning: planning, faq: faq
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.KICKOFF_RENDER = api;
})(typeof window !== "undefined" ? window : this);
