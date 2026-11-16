# KickOff Bar — site vitrine

Site statique (HTML, CSS, JavaScript), sans étape de build, publié avec GitHub Pages.

## Modifier le contenu

- **Infos pratiques et planning** : tout est dans `js/data.js`. Une valeur vide s'affiche « À compléter ».
- **Images du diaporama** : remplacer `images/slide-1.svg`, `slide-2.svg` et `slide-3.svg` par les vraies photos
  (format conseillé : 1600 × 900 px, JPG ou WebP), puis mettre à jour les trois `src` dans `index.html`.

## Référencement (SEO)

Après chaque modification de `js/data.js`, lancer :

```bash
node tools/build.js
```

Cette commande écrit le planning, la FAQ et les données structurées (schema.org) en dur dans `index.html`
pour les moteurs de recherche, et met à jour `sitemap.xml` et `robots.txt`.
Dès que l'adresse est renseignée, chaque soirée est aussi déclarée comme événement auprès de Google.

## Aperçu en local

```bash
python -m http.server 8080
```

Puis ouvrir http://localhost:8080.
