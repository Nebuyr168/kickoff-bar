/*
 * À lancer après chaque modification de js/data.js :   node tools/build.js
 * Écrit en dur dans index.html le contenu (soirs, planning, FAQ) et les données
 * structurées pour les moteurs de recherche, puis met à jour sitemap.xml et robots.txt.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const racine = path.join(__dirname, "..");
const lire = (f) => fs.readFileSync(path.join(racine, f), "utf8");
const ecrire = (f, c) => fs.writeFileSync(path.join(racine, f), c);

const ctx = { window: {} };
vm.runInNewContext(lire("js/data.js"), ctx);
const D = ctx.window.KICKOFF;
const R = require("../js/render.js");

const URL_SITE = D.site.url.replace(/\/$/, "");
const I = D.infos;
const DESCRIPTION = "Bar à soirées à thème" + (I.ville ? " à " + I.ville : "") + ", du mardi au samedi : karaoké, blind test, soirées musicales, jeudis étudiants, vendredis à dress code et grosses soirées du samedi.";

/* ---------- Données structurées (schema.org) ---------- */
const bar = {
  "@type": "BarOrPub",
  "@id": URL_SITE + "/#bar",
  name: "KickOff Bar",
  url: URL_SITE + "/",
  image: URL_SITE + "/images/og.jpg",
  description: DESCRIPTION
};
const adresseConnue = Boolean(I.adresse && I.ville);
if (adresseConnue) {
  bar.address = { "@type": "PostalAddress", streetAddress: [I.adresse, I.complement].filter(Boolean).join(", "), postalCode: I.codePostal || undefined, addressLocality: I.ville, addressCountry: "FR" };
}
if (I.latitude && I.longitude) {
  bar.geo = { "@type": "GeoCoordinates", latitude: I.latitude, longitude: I.longitude };
  bar.hasMap = "https://www.google.com/maps/search/?api=1&query=" + I.latitude + "%2C" + I.longitude;
}
if (I.telephone) bar.telephone = I.telephone;
if (I.email) bar.email = I.email;
const reseaux = [I.instagram, I.facebook].filter(Boolean);
if (reseaux.length) bar.sameAs = reseaux;
if (I.heureOuverture && I.heureFermeture) {
  bar.openingHoursSpecification = [{
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: I.heureOuverture,
    closes: I.heureFermeture
  }];
}

const graphe = [
  { "@type": "WebSite", "@id": URL_SITE + "/#site", name: "KickOff Bar", url: URL_SITE + "/", inLanguage: "fr-FR" },
  bar,
  { "@type": "FAQPage", "@id": URL_SITE + "/#faq",
    mainEntity: D.faq.map((f) => ({ "@type": "Question", name: R.typo(f.q), acceptedAnswer: { "@type": "Answer", text: R.typo(f.r) } })) }
];

// Les soirées ne sont déclarées comme événements que si l'adresse est renseignée (obligatoire pour Google).
if (adresseConnue) {
  D.semaines.forEach((sem) => sem.soirees.forEach((s, i) => {
    if (s.style === "ferme") return;
    graphe.push({
      "@type": "Event",
      name: s.titre + (s.detail ? " — " + s.detail : ""),
      description: D.soirs[i].jour + " " + D.soirs[i].nom + " au KickOff Bar.",
      startDate: R.iso(R.dateOf(sem.mardi, i)) + (I.heureOuverture ? "T" + I.heureOuverture : ""),
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      image: URL_SITE + "/images/og.jpg",
      location: { "@type": "Place", name: "KickOff Bar", address: bar.address },
      organizer: { "@id": bar["@id"] }
    });
  }));
}

const jsonLd = JSON.stringify({ "@context": "https://schema.org", "@graph": graphe }).replace(/</g, "\\u003c");

const head = [
  `<link rel="canonical" href="${URL_SITE}/">`,
  `<meta property="og:url" content="${URL_SITE}/">`,
  `<meta property="og:image" content="${URL_SITE}/images/og.jpg">`,
  `<meta property="og:image:width" content="1200">`,
  `<meta property="og:image:height" content="630">`,
  `<meta name="twitter:card" content="summary_large_image">`,
  `<meta name="twitter:image" content="${URL_SITE}/images/og.jpg">`,
  `<script type="application/ld+json">${jsonLd}</script>`
].join("\n  ");

/* ---------- Injection dans index.html ---------- */
let html = lire("index.html");
function injecter(nom, contenu) {
  const re = new RegExp("(<!-- build:" + nom + " -->)[\\s\\S]*?(<!-- /build:" + nom + " -->)");
  if (!re.test(html)) throw new Error("Repère introuvable dans index.html : " + nom);
  html = html.replace(re, (m, a, b) => a + "\n" + contenu + "\n" + b);
}
injecter("head", "  " + head);
injecter("soirs", R.soirs(D));
injecter("planning", R.planning(D));
injecter("faq", R.faq(D));
ecrire("index.html", html);

/* ---------- sitemap.xml et robots.txt ---------- */
const aujourdHui = R.iso(new Date());
ecrire("sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${URL_SITE}/</loc>\n    <lastmod>${aujourdHui}</lastmod>\n  </url>\n</urlset>\n`);
ecrire("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${URL_SITE}/sitemap.xml\n`);

console.log("OK — index.html, sitemap.xml et robots.txt mis à jour (" + graphe.length + " entités schema.org" + (adresseConnue ? "" : ", événements en attente de l'adresse") + ").");
