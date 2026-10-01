# -*- coding: utf-8 -*-
"""Génère les pages de contenu indexables de Generally.

Principe : tout le contenu factuel vient de la vraie banque de questions. Rien
n'est inventé pour remplir une page. Les questions affichées sont de vraies
questions du jeu, avec leur vraie réponse et leur vraie explication.

Les types « carte » (cliquer un pays, placer un point) sont volontairement
écartés de ces pages : ils ne se lisent pas en texte. On garde les types qui
font du contenu lisible : QCM, vrai/faux, remise dans l'ordre, frise, ordre
de grandeur, système solaire.

Le script est rejouable : relancer régénère les pages à partir de la banque.
"""
import io, json, os, random, html

RACINE = r'C:\Users\admin\Desktop\jeu'
BANQUE = (r'C:/Users/admin/AppData/Local/Temp/claude/'
          r'C--Users-admin-Desktop-jeu/14c7c987-0ac9-441f-b81f-71d4b6e4a587/scratchpad/banque.json')
SITE = 'https://mystarten.github.io/Generally-'

os.chdir(RACINE)
QUESTIONS = json.load(io.open(BANQUE, encoding='utf-8'))

TYPES_LISIBLES = {'qcm', 'vrai_faux', 'chronologie', 'frise', 'grandeur', 'planete'}

CATEGORIES = {
    'geographie':   {'nom': 'Géographie',      'couleur': '#3ECF9B'},
    'geopolitique': {'nom': 'Géopolitique',    'couleur': '#4EA3F5'},
    'politique':    {'nom': 'Politique',       'couleur': '#A2578F'},
    'histoire':     {'nom': 'Histoire',        'couleur': '#E8875A'},
    'astronomie':   {'nom': 'Astronomie',      'couleur': '#8B7BE8'},
    'sciences':     {'nom': 'Sciences',        'couleur': '#2FC7C7'},
    'arts':         {'nom': 'Arts & culture',  'couleur': '#F27BA9'},
    'sport':        {'nom': 'Sport',           'couleur': '#7CBF3F'},
}
NIVEAUX = {1: 'Facile', 2: 'Moyen', 3: 'Expert'}


def e(t):
    return html.escape(str(t), quote=True)


# ---------------------------------------------------------------- réponses
def texte_reponse(q):
    """Rend la bonne réponse sous forme lisible, selon le type."""
    t = q['type']
    if t == 'qcm':
        return e(q['choix'][q['reponse']])
    if t == 'vrai_faux':
        return 'Vrai' if q['reponse'] else 'Faux'
    if t == 'planete':
        return e(q['reponse'])
    if t == 'frise':
        a = q['reponse']
        return e('%d av. J.-C.' % abs(a)) if a < 0 else e(str(a))
    if t == 'grandeur':
        n = q['reponse']
        if n >= 1e9:
            v = '%s milliards' % ('%g' % (n / 1e9)).replace('.', ',')
        elif n >= 1e6:
            v = '%s millions' % ('%g' % (n / 1e6)).replace('.', ',')
        elif n >= 1000:
            v = '{:,}'.format(int(n)).replace(',', '\u202f')
        else:
            v = ('%g' % n).replace('.', ',')
        return e(v + (' ' + q['unite'] if q.get('unite') else ''))
    return ''


def bloc_question(q):
    """Une question affichée : énoncé, bonne réponse, explication."""
    out = ['<li>']
    out.append('<span class="q">%s</span>' % e(q['question']))
    if q['type'] == 'chronologie':
        out.append('<span class="r"><b>Ordre exact :</b></span><ol>')
        for c in q['choix']:
            out.append('<li>%s</li>' % e(c))
        out.append('</ol>')
    else:
        out.append('<span class="r"><b>Réponse :</b> %s</span>' % texte_reponse(q))
    if q.get('explication'):
        out.append('<span class="e">%s</span>' % e(q['explication']))
    out.append('</li>')
    return '\n      '.join(out)


def choisir(categorie=None, combien=20, graine=7):
    """Sélection stable et variée : on panache les niveaux et les types."""
    lot = [q for q in QUESTIONS
           if q['type'] in TYPES_LISIBLES
           and (categorie is None or q['categorie'] == categorie)
           and q.get('explication')]
    rnd = random.Random(graine)
    rnd.shuffle(lot)
    retenues, vus_types, par_niveau = [], {}, {1: 0, 2: 0, 3: 0}
    cible = max(1, combien // 3)
    for q in lot:
        if len(retenues) >= combien:
            break
        if par_niveau[q['niveau']] >= cible + 2 and len(retenues) < combien - 3:
            continue
        if vus_types.get(q['type'], 0) >= max(2, combien // 3):
            continue
        retenues.append(q)
        vus_types[q['type']] = vus_types.get(q['type'], 0) + 1
        par_niveau[q['niveau']] += 1
    for q in lot:
        if len(retenues) >= combien:
            break
        if q not in retenues:
            retenues.append(q)
    retenues.sort(key=lambda x: (x['niveau'], x['id']))
    return retenues[:combien]


# ------------------------------------------------------------------ gabarit
def page(chemin, titre, description, h1, corps, ariane, racine,
         schemas=None, chapo=''):
    url = SITE + '/' + chemin.replace('\\', '/').replace('index.html', '')
    url = url.rstrip('/') + '/'
    fil = []
    for i, (lib, lien) in enumerate(ariane):
        if lien:
            fil.append('<a href="%s">%s</a>' % (lien, e(lib)))
        else:
            fil.append(e(lib))
    fil_html = '<span>›</span>'.join(fil)

    miettes = {
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": lib,
             "item": (SITE + '/' + lien.replace('../', '').lstrip('./')) if lien else url}
            for i, (lib, lien) in enumerate(ariane)
        ]
    }
    blocs = [miettes] + (schemas or [])
    json_ld = '\n'.join(
        '<script type="application/ld+json">%s</script>' % json.dumps(b, ensure_ascii=False)
        for b in blocs)

    doc = """<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titre}</title>
<meta name="description" content="{description}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="article">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="Generally">
<meta property="og:title" content="{titre}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{site}/icones/icone-512.png">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#F5A623">
<link rel="icon" href="{racine}icones/icone-192.png" type="image/png">
<link rel="stylesheet" href="{racine}polices/polices.css">
<link rel="stylesheet" href="{racine}pages.css">
{json_ld}
</head>
<body>
<div class="enveloppe">

  <header class="tete">
    <a class="marque" href="{racine}">
      <img src="{racine}icones/icone-192.png" width="40" height="40"
           alt="Generally, jeu de culture générale">
      <span class="nom">General<span>ly</span></span>
    </a>
    <nav aria-label="Navigation principale">
      <a href="{racine}quiz/culture-generale/">Quiz</a>
      <a href="{racine}questions/culture-generale-avec-reponses/">Questions</a>
      <a href="{racine}guides/comment-ameliorer-sa-culture-generale/">Guide</a>
      <a href="{racine}">Jouer</a>
    </nav>
  </header>

  <nav class="ariane" aria-label="Fil d’Ariane">{fil}</nav>

  <main>
    <h1>{h1}</h1>
    {chapo}
{corps}
  </main>

  <footer class="pied">
    <nav aria-label="Pied de page">
      <a href="{racine}">Jouer à Generally</a>
      <a href="{racine}quiz/">Tous les quiz</a>
      <a href="{racine}quiz/culture-generale/">Quiz de culture générale</a>
      <a href="{racine}guides/comment-ameliorer-sa-culture-generale/">Améliorer sa culture générale</a>
    </nav>
    <p>Generally — jeu de culture générale gratuit, sans inscription et sans publicité.
       {total} questions en français, toutes accompagnées d’une explication.</p>
  </footer>

</div>
</body>
</html>
""".format(titre=e(titre), description=e(description), url=url, site=SITE,
           racine=racine, json_ld=json_ld, fil=fil_html, h1=h1,
           chapo=('<p class="chapo">%s</p>' % chapo) if chapo else '',
           corps=corps, total=len(QUESTIONS))

    dossier = os.path.dirname(chemin)
    if dossier and not os.path.isdir(dossier):
        os.makedirs(dossier)
    io.open(chemin, 'w', encoding='utf-8', newline='').write(doc)
    return chemin


def appel(texte_h2, texte_p, lien, libelle='Jouer maintenant'):
    return """
    <div class="appel">
      <h2>%s</h2>
      <p>%s</p>
      <a class="bouton" href="%s">%s</a>
    </div>""" % (texte_h2, texte_p, lien, libelle)


def compte(categorie=None, niveau=None, type_=None):
    return len([q for q in QUESTIONS
                if (categorie is None or q['categorie'] == categorie)
                and (niveau is None or q['niveau'] == niveau)
                and (type_ is None or q['type'] == type_)])


print('banque chargee :', len(QUESTIONS), 'questions')
