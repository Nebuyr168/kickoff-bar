/*
 * KickOff Bar — contenu du site.
 * Tout ce qui change (infos pratiques, planning) se modifie ICI, sans toucher au reste.
 * Une valeur laissée vide ("") s'affiche « À compléter » sur le site.
 */
window.KICKOFF = {
  // Adresse publique du site (sans « / » final). À changer si un nom de domaine est ajouté.
  site: { url: "https://nebuyr168.github.io/kickoff-bar" },

  infos: {
    adresse: "105 rue Nationale",
    complement: "Passage du Cadran",
    codePostal: "49300",
    ville: "Cholet",
    latitude: 47.06231,   // position du repère sur la carte
    longitude: -0.87877,
    horaires: "17 h – 2 h",     // texte affiché, ex. "18 h – 1 h"
    heureOuverture: "17:00", // pour Google, format 24 h, ex. "18:00"
    heureFermeture: "02:00", // pour Google, format 24 h, ex. "01:00"
    telephone: "",      // ex. "02 00 00 00 00"
    email: "",          // ex. "contact@kickoffbar.fr"
    instagram: "https://www.instagram.com/kickoffbar.cholet49/",    // adresse complète du profil, ex. "https://www.instagram.com/…"
    facebook: ""        // adresse complète de la page
  },

  // Les cinq soirs de la semaine (ordre des colonnes du planning)
  soirs: [
    { jour: "Mardi",    nom: "Social & Fun",     texte: "Karaoké, blind tests, jeux et rencontres : la soirée idéale pour faire connaissance." },
    { jour: "Mercredi", nom: "Music Club",       texte: "Un style musical à l'honneur chaque semaine, du disco au rock en passant par le rap." },
    { jour: "Jeudi",    nom: "Student Night",    texte: "Les jeudis étudiants : animations et défis entre campus." },
    { jour: "Vendredi", nom: "Dress Code Party", texte: "Les vendredis à thème : dress code et concours." },
    { jour: "Samedi",   nom: "Big Party",        texte: "Les samedis événements : nos plus grosses soirées !" }
  ],

  // Questions fréquentes (à mettre à jour avec le planning)
  faq: [
    { q: "Où se trouve le KickOff Bar ?",
      r: "Le KickOff Bar se trouve au 105 rue Nationale, passage du Cadran, à Cholet (49300)." },
    { q: "Quels soirs le KickOff Bar propose-t-il des soirées ?",
      r: "Le KickOff Bar propose des soirées à thème du mardi au samedi : Social & Fun le mardi, Music Club le mercredi, Student Night le jeudi, Dress Code Party le vendredi et Big Party le samedi." },
    { q: "Quels sont les horaires du KickOff Bar ?",
      r: "Le KickOff Bar est ouvert du mardi au samedi, de 17 h à 2 h." },
    { q: "Quels sont les prix au KickOff Bar ?",
      r: "Les trois produits phares sont le punch à 4 €, la pinte de blonde à 5 € et le cocktail de la semaine à 6 €. Ils sont proposés avec ou sans alcool." },
    { q: "Y a-t-il des soirées étudiantes ?",
      r: "Oui, chaque jeudi : c'est la Student Night, avec des animations et des défis entre campus." },
    { q: "Quand ont lieu les soirées karaoké et blind test ?",
      r: "Le mardi, pendant les soirées Social & Fun : Karaoké Battle les 1er décembre et 5 janvier, Blind Test Battle le 8 décembre, Christmas Karaoké le 22 décembre, Music Bingo & Blind Test le 12 janvier." },
    { q: "Le bar est-il ouvert pendant les fêtes ?",
      r: "Le KickOff Bar est fermé pour Noël les jeudi 24 et vendredi 25 décembre 2026. Il fête le Nouvel An le jeudi 31 décembre avec la New Year Mega Party." }
  ],

  /*
   * Une ligne par semaine.
   *  - mardi   : date du mardi de la semaine (AAAA-MM-JJ), sert à calculer les dates de chaque soirée
   *  - periode : libellé affiché
   *  - soirees : 5 soirées, du mardi au samedi — { titre, detail, style }
   *    styles possibles : "ferme", "nouvel-an", "uv", "jungle", "chaude", "psy", "eau"
   */
  semaines: [
    { n: 1, mardi: "2026-12-01", periode: "Du 01/12 au 05/12", soirees: [
      { titre: "Karaoké Battle", detail: "Équipes vs équipes" },
      { titre: "Disco Fever", detail: "Années 80" },
      { titre: "Student Welcome Party" },
      { titre: "Back to the 2000's", detail: "Hits & nostalgie" },
      { titre: "UV Neon Party", detail: "Fluo & blacklight", style: "uv" }
    ]},
    { n: 2, mardi: "2026-12-08", periode: "Du 07/12 au 12/12", soirees: [
      { titre: "Blind Test Battle", detail: "Par équipes" },
      { titre: "Reggae & Dancehall Night" },
      { titre: "Campus Challenge", detail: "Défis entre écoles" },
      { titre: "Winter Beach Party", detail: "Ambiance tropicale" },
      { titre: "Jungle Party", detail: "Déco & ambiance sauvage", style: "jungle" }
    ]},
    { n: 3, mardi: "2026-12-15", periode: "Du 15/12 au 19/12", soirees: [
      { titre: "Speed Meeting & Icebreakers" },
      { titre: "Pop Culture Hits", detail: "De 2010 à aujourd'hui" },
      { titre: "Student Secret Santa" },
      { titre: "Chic & Choc Challenge", detail: "Concours du meilleur duo" },
      { titre: "Black & White Party" }
    ]},
    { n: 4, mardi: "2026-12-22", periode: "Du 22/12 au 26/12", soirees: [
      { titre: "Christmas Karaoké" },
      { titre: "Bass Night", detail: "Trance & DNB" },
      { titre: "Fermé pour Noël", style: "ferme" },
      { titre: "Fermé pour Noël", style: "ferme" },
      { titre: "Chaude", detail: "Christmas Afterparty", style: "chaude" }
    ]},
    { n: 5, mardi: "2026-12-29", periode: "Du 29/12 au 02/01", soirees: [
      { titre: "Afterwork & Friends" },
      { titre: "Latino & Shatta Party" },
      { titre: "New Year Mega Party", style: "nouvel-an" },
      { titre: "Retour dans les 2000's" },
      { titre: "Psy Trance Experience", style: "psy" }
    ]},
    { n: 6, mardi: "2027-01-05", periode: "Du 04/01 au 09/01", soirees: [
      { titre: "Karaoké Battle", detail: "Édition 2027" },
      { titre: "Rap FR vs US", detail: "Battle Hits" },
      { titre: "Back to Campus" },
      { titre: "Summer in January", detail: "Ambiance estivale" },
      { titre: "Underwater Neon Party", style: "eau" }
    ]},
    { n: 7, mardi: "2027-01-12", periode: "Du 12/01 au 16/01", soirees: [
      { titre: "Music Bingo & Blind Test" },
      { titre: "Rock & Metal Night" },
      { titre: "Inter-Campus Battle" },
      { titre: "Chic & Choc", detail: "Édition duo" },
      { titre: "Black & White Experience" }
    ]},
    { n: 8, mardi: "2027-01-19", periode: "Du 19/01 au 23/01", soirees: [
      { titre: "Speed Friending", detail: "Rencontres amicales" },
      { titre: "Hard Music Night" },
      { titre: "Student DJ Takeover" },
      { titre: "Movie & Series Characters", detail: "Viens déguisé !" },
      { titre: "Chaude", detail: "Winter Edition", style: "chaude" }
    ]},
    { n: 9, mardi: "2027-01-26", periode: "Du 26/01 au 31/01", soirees: [
      { titre: "Afterwork & Friends" },
      { titre: "80's Disco Classics" },
      { titre: "Campus All Stars" },
      { titre: "Y2K Retro Party", detail: "Années 2000" },
      { titre: "UV Mega Party", detail: "Final Edition", style: "uv" }
    ]}
  ]
};
