# Outils de génération des pages SEO

Les pages de contenu (`/quiz/`, `/questions/`, `/guides/`) ne sont pas écrites à
la main : elles sont **générées à partir de la vraie banque de questions**, pour
que les compteurs, les exemples et les explications restent exacts après chaque
ajout de questions.

## Régénérer

1. Exporter la banque en JSON :

   ```
   node -e "global.window={};['geographie','geopolitique','politique','histoire','astronomie','sciences','arts','sport'].forEach(f=>require('./data/'+f+'.js'));require('fs').writeFileSync('outils/banque.json',JSON.stringify(global.window.QUESTIONS.map(q=>({id:q.id,categorie:q.categorie,niveau:q.niveau,type:q.type,question:q.question,choix:q.choix||null,reponse:q.reponse,explication:q.explication,unite:q.unite||null}))))"
   ```

2. Ajuster les deux chemins en tête de `seo_gabarit.py` et `seo_contenu.py`
   (`RACINE` et `BANQUE`), puis lancer :

   ```
   python outils/seo_contenu.py
   ```

## Ce que fait le générateur

- `seo_gabarit.py` : le gabarit HTML commun (entête, fil d'Ariane, données
  structurées, pied) et le rendu d'une question en texte lisible.
- `seo_contenu.py` : le contenu rédigé de chaque page, et la sélection des
  questions à montrer.

Les types « carte » (cliquer un pays, placer un point) sont volontairement
écartés : ils ne se lisent pas en texte.

Après régénération, penser à mettre à jour `sitemap.xml` si des pages ont été
ajoutées.
