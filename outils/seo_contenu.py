# -*- coding: utf-8 -*-
"""Contenu des pages indexables de Generally.

Chaque page a un sujet principal unique et répond à une intention de recherche
identifiée. Les questions montrées sont réelles, extraites de la banque.
"""
import io, os

BASE = (r'C:/Users/admin/AppData/Local/Temp/claude/'
        r'C--Users-admin-Desktop-jeu/14c7c987-0ac9-441f-b81f-71d4b6e4a587/scratchpad/seo_pages.py')
exec(compile(io.open(BASE, encoding='utf-8').read(), BASE, 'exec'))

TOTAL = len(QUESTIONS)
crees = []


def liste_questions(qs):
    return '<ul class="questions">\n      %s\n    </ul>' % '\n      '.join(bloc_question(q) for q in qs)


# =============================================================== /quiz/ (hub)
tuiles = []
PAGES_CAT = {'histoire': 'histoire/', 'geographie': 'geographie/', 'sciences': 'sciences/'}
for cle, meta in CATEGORIES.items():
    n = compte(cle)
    lien = PAGES_CAT.get(cle, '../?quiz=' + cle)
    tuiles.append(
        '<a class="tuile" href="%s" style="--c:%s">'
        '<span class="pastille" aria-hidden="true">%s</span>'
        '<b>%s</b><em>%d questions</em></a>'
        % (lien, meta['couleur'], meta['nom'][0], meta['nom'], n))

corps = """
    <div class="carte">
      <p>Generally réunit <b>%d questions de culture générale</b> en français, réparties
      en huit thèmes. Chaque question est accompagnée d’une explication : l’objectif
      n’est pas seulement de savoir si l’on avait juste, mais de comprendre pourquoi.</p>
      <p>Les quiz sont gratuits, sans inscription et sans publicité. Ils se jouent
      directement dans le navigateur, seul ou jusqu’à quatre joueurs sur le même écran.</p>
    </div>

    <h2>Les huit thèmes</h2>
    <div class="grille">%s</div>

    <h2>Trois niveaux de difficulté</h2>
    <p>Chaque thème propose trois niveaux. Le niveau facile porte sur des repères
    largement partagés, le niveau moyen demande un peu de précision, le niveau expert
    s’adresse à ceux qui connaissent déjà le sujet.</p>
    <div class="chiffres">
      <div class="chiffre"><b>%d</b><span>questions faciles</span></div>
      <div class="chiffre"><b>%d</b><span>questions moyennes</span></div>
      <div class="chiffre"><b>%d</b><span>questions expertes</span></div>
    </div>

    <h2>Neuf façons de répondre</h2>
    <p>Un quiz de culture générale se limite souvent au choix multiple. Generally
    propose aussi de cliquer un pays sur une carte du monde, de placer une ville à
    l’endroit exact, de remettre des événements dans l’ordre, de dater un fait sur une
    frise, d’estimer un ordre de grandeur ou de désigner une planète du système solaire.</p>
%s
    <h2>Pour aller plus loin</h2>
    <ul class="liens">
      <li><a href="culture-generale/">Quiz de culture générale : comment ça marche</a></li>
      <li><a href="../questions/culture-generale-avec-reponses/">Questions de culture générale avec réponses</a></li>
      <li><a href="../guides/comment-ameliorer-sa-culture-generale/">Comment améliorer sa culture générale</a></li>
    </ul>
""" % (TOTAL, '\n        '.join(tuiles),
       compte(niveau=1), compte(niveau=2), compte(niveau=3),
       appel('Essayez tout de suite',
             'Une partie dure une dizaine de questions. Aucune inscription n’est demandée.',
             '../', 'Jouer à Generally'))

crees.append(page(
    os.path.join('quiz', 'index.html'),
    'Quiz de culture générale par thème — Generally',
    'Huit thèmes de quiz : histoire, géographie, sciences, sport, arts, astronomie, '
    'politique et géopolitique. %d questions gratuites avec réponses expliquées.' % TOTAL,
    'Quiz de culture générale par thème',
    corps,
    [('Accueil', '../'), ('Quiz', '')],
    '../',
    chapo='Choisissez un thème et lancez une partie. Toutes les questions sont '
          'gratuites, expliquées, et accessibles sans inscription.'))


# =================================================== /quiz/culture-generale/
exemples = liste_questions(choisir(None, 12, graine=11))

corps = """
    <div class="carte">
      <p><b>Generally est un quiz de culture générale gratuit</b>, en français, qui réunit
      %d questions réparties en huit thèmes et trois niveaux. Il se joue dans le
      navigateur, sans inscription, sans publicité et sans téléchargement.</p>
      <p>Sa particularité : <b>chaque question est suivie d’une explication</b>. Vous ne
      repartez pas seulement avec un score, mais avec une information que vous pouvez
      retenir.</p>
    </div>

    <h2>Comment fonctionne le quiz</h2>
    <p>Une partie classique enchaîne dix questions tirées du thème et du niveau choisis.
    Un chronomètre tourne pour chaque question : répondre vite rapporte davantage, mais
    le temps accordé dépend du type de question, afin qu’une question de carte ne soit
    pas pénalisée par le temps nécessaire pour viser.</p>
    <p>Après chaque réponse, la bonne solution apparaît avec son explication. En fin de
    partie, un récapitulatif rassemble les questions manquées : c’est ce récapitulatif
    qui fait la différence entre un divertissement et un outil d’apprentissage.</p>

    <h2>Les trois niveaux</h2>
    <ul class="liens">
      <li><b>Facile</b> — des repères largement partagés : capitales connues, grandes
      dates, notions de base. %d questions.</li>
      <li><b>Moyen</b> — il faut un peu de précision : mécanismes, dates exactes,
      vocabulaire spécialisé. %d questions.</li>
      <li><b>Expert</b> — pour ceux qui connaissent déjà le sujet. %d questions.</li>
    </ul>
    <p>Un quatrième réglage, « mixte », panache les trois niveaux.</p>

    <h2>Les huit thèmes</h2>
    <p>Histoire, géographie, sciences, astronomie, arts et culture, sport, politique et
    géopolitique. Le mode « tout mélangé » tire dans les huit, de façon équilibrée :
    une catégorie plus fournie ne sort pas plus souvent qu’une autre.</p>
    <ul class="liens">
      <li><a href="../histoire/">Quiz histoire</a></li>
      <li><a href="../geographie/">Quiz géographie</a></li>
      <li><a href="../sciences/">Quiz sciences</a></li>
      <li><a href="../">Voir les huit thèmes</a></li>
    </ul>

    <h2>Neuf types de questions</h2>
    <p>Au-delà du choix multiple et du vrai ou faux, Generally demande aussi de :</p>
    <ul class="liens">
      <li>cliquer un pays sur une carte du monde interactive ;</li>
      <li>placer une ville à son emplacement exact, la note dépendant de la distance ;</li>
      <li>remettre quatre événements dans l’ordre chronologique ;</li>
      <li>dater un fait en faisant glisser un curseur sur une frise ;</li>
      <li>estimer un ordre de grandeur sur une échelle logarithmique ;</li>
      <li>désigner une planète du système solaire.</li>
    </ul>
    <p>Cette variété a une raison pédagogique : reconnaître une bonne réponse parmi
    quatre est beaucoup plus facile que de la retrouver soi-même. Les formats ouverts
    demandent un effort de rappel plus exigeant, et donc plus efficace.</p>

    <h2>Comment progresser</h2>
    <p>Trois outils du jeu servent directement la progression :</p>
    <ul class="liens">
      <li><b>La révision</b> rejoue les questions que vous avez manquées, plutôt que
      d’en tirer de nouvelles au hasard.</li>
      <li><b>Le défi du jour</b> propose dix questions identiques pour tout le monde,
      renouvelées chaque jour, avec une série de jours consécutifs à entretenir.</li>
      <li><b>La maîtrise par thème</b> indique, pour chaque catégorie, combien de
      questions vous avez déjà réussi au moins une fois.</li>
    </ul>
    <p>Pour une méthode détaillée, voir le guide
    <a href="../../guides/comment-ameliorer-sa-culture-generale/">comment améliorer
    sa culture générale</a>.</p>

    <h2>Douze questions pour se faire une idée</h2>
    <p>Voici un échantillon réel, tiré des huit thèmes et des trois niveaux.</p>
%s
%s
    <h2>Questions fréquentes</h2>
    <div class="faq">
      <details><summary>Le quiz est-il vraiment gratuit ?</summary>
      <p>Oui. Aucune inscription, aucun compte, aucune publicité, aucun paiement.
      Les scores sont enregistrés dans votre navigateur et ne quittent pas votre
      ordinateur.</p></details>
      <details><summary>Faut-il créer un compte ?</summary>
      <p>Non. La progression, les succès et le palmarès sont stockés localement.
      En contrepartie, ils ne vous suivent pas d’un appareil à l’autre.</p></details>
      <details><summary>Peut-on jouer à plusieurs ?</summary>
      <p>Oui, de deux façons : jusqu’à quatre joueurs sur le même écran, au tour par
      tour ou au buzzer ; ou en ligne, en créant un salon et en partageant un code
      d’invitation à des amis qui jouent depuis leur propre ordinateur.</p></details>
      <details><summary>Le jeu fonctionne-t-il hors connexion ?</summary>
      <p>Oui. Une fois la page chargée, tout est disponible localement, y compris la
      carte du monde. Seul le mode en ligne demande une connexion.</p></details>
    </div>
""" % (TOTAL, compte(niveau=1), compte(niveau=2), compte(niveau=3), exemples,
       appel('Lancer une partie',
             'Dix questions, trois minutes, aucune inscription.',
             '../../', 'Jouer maintenant'))

schema_app = {
    "@context": "https://schema.org", "@type": "WebApplication",
    "name": "Generally", "url": SITE + "/",
    "applicationCategory": "GameApplication",
    "operatingSystem": "Tout navigateur web",
    "inLanguage": "fr",
    "description": "Jeu de culture générale gratuit en français réunissant %d questions "
                   "expliquées, réparties en huit thèmes et trois niveaux." % TOTAL,
    "offers": {"@type": "Offer", "price": "0", "priceCurrency": "EUR"}
}

crees.append(page(
    os.path.join('quiz', 'culture-generale', 'index.html'),
    'Quiz de culture générale gratuit — %d questions expliquées | Generally' % TOTAL,
    'Quiz de culture générale gratuit et sans inscription : %d questions en français, '
    'huit thèmes, trois niveaux, et une explication après chaque réponse.' % TOTAL,
    'Quiz de culture générale',
    corps,
    [('Accueil', '../../'), ('Quiz', '../'), ('Culture générale', '')],
    '../../',
    schemas=[schema_app],
    chapo='%d questions gratuites, en français, avec une explication après chaque '
          'réponse. Sans inscription et sans publicité.' % TOTAL))


# ============================================================ pages par thème
THEMES = {
    'histoire': {
        'titre': 'Quiz histoire',
        'h1': 'Quiz d’histoire',
        'intro': 'De l’Antiquité au XX<sup>e</sup> siècle : dates, personnages, '
                 'batailles, traités et grandes ruptures.',
        'couvre': [
            'l’Antiquité grecque, romaine et égyptienne',
            'le Moyen Âge européen et les grandes dynasties',
            'la Renaissance et les grandes découvertes',
            'la Révolution française et l’Empire',
            'les deux guerres mondiales',
            'les empires non européens : mongol, ottoman, inca, chinois',
        ],
        'mot': 'histoire', 'mot_de': 'l’histoire',
    },
    'geographie': {
        'titre': 'Quiz géographie',
        'h1': 'Quiz de géographie',
        'intro': 'Capitales, fleuves, sommets, déserts, océans et frontières, '
                 'avec une carte du monde cliquable.',
        'couvre': [
            'les capitales et les pays du monde',
            'les fleuves, les lacs et les océans',
            'les sommets, les chaînes de montagnes et les déserts',
            'les records géographiques : le plus grand, le plus profond, le plus haut',
            'les frontières, les enclaves et les détroits',
            'les repères de cartographie et les fuseaux horaires',
        ],
        'mot': 'géographie', 'mot_de': 'la géographie',
    },
    'sciences': {
        'titre': 'Quiz sciences',
        'h1': 'Quiz de sciences',
        'intro': 'Chimie, physique, biologie et histoire des sciences, '
                 'des unités de mesure aux grandes découvertes.',
        'couvre': [
            'la chimie : éléments, symboles, formules, états de la matière',
            'la physique : lumière, énergie, particules, thermodynamique',
            'la biologie : corps humain, génétique, évolution, classification',
            'les unités du Système international',
            'les grandes découvertes et ceux qui les ont faites',
            'les ordres de grandeur, de l’atome à la planète',
        ],
        'mot': 'sciences', 'mot_de': 'les sciences',
    },
}

for cle, t in THEMES.items():
    meta = CATEGORIES[cle]
    n = compte(cle)
    qs = choisir(cle, 22, graine=23)
    autres = [(CATEGORIES[k]['nom'], ('../%s/' % k) if k in PAGES_CAT else ('../../?quiz=' + k))
              for k in CATEGORIES if k != cle]

    corps = """
    <div class="carte">
      <p>Le thème <b>%s</b> de Generally réunit <b>%d questions</b>, réparties sur trois
      niveaux. Chacune est suivie d’une explication, pour que le quiz apprenne quelque
      chose et pas seulement qu’il sanctionne.</p>
    </div>

    <div class="chiffres">
      <div class="chiffre"><b>%d</b><span>questions au total</span></div>
      <div class="chiffre"><b>%d</b><span>faciles</span></div>
      <div class="chiffre"><b>%d</b><span>moyennes</span></div>
      <div class="chiffre"><b>%d</b><span>expertes</span></div>
    </div>

    <h2>Ce que couvre le thème</h2>
    <ul class="liens">
      %s
    </ul>
%s
    <h2>%d questions de %s avec leurs réponses</h2>
    <p>Un échantillon réel du jeu, des trois niveaux. Les réponses et les explications
    sont visibles directement : vous pouvez vous tester, ou simplement lire.</p>
%s
    <h2>Les autres thèmes</h2>
    <ul class="liens">
      %s
    </ul>
    <p>Voir aussi la page générale
    <a href="../culture-generale/">quiz de culture générale</a> et le guide
    <a href="../../guides/comment-ameliorer-sa-culture-generale/">pour progresser
    durablement</a>.</p>
""" % (meta['nom'], n, n, compte(cle, 1), compte(cle, 2), compte(cle, 3),
       '\n      '.join('<li>%s</li>' % x for x in t['couvre']),
       appel('Jouer au quiz de %s' % t['mot'],
             'Dix questions tirées de ce thème, à votre niveau.',
             '../../?quiz=' + cle, 'Lancer le quiz'),
       len(qs), t['mot'], liste_questions(qs),
       '\n      '.join('<li><a href="%s">%s</a></li>' % (l, nom) for nom, l in autres))

    crees.append(page(
        os.path.join('quiz', cle, 'index.html'),
        '%s — %d questions avec réponses | Generally' % (t['titre'], n),
        '%s gratuit : %d questions en français sur %s, avec les réponses et une '
        'explication pour chacune.' % (t['titre'], n, t['mot_de']),
        t['h1'],
        corps,
        [('Accueil', '../../'), ('Quiz', '../'), (CATEGORIES[cle]['nom'], '')],
        '../../',
        chapo=t['intro']))


# ============================== /questions/culture-generale-avec-reponses/
groupes = []
for cle, meta in CATEGORIES.items():
    qs = choisir(cle, 5, graine=41)
    if not qs:
        continue
    groupes.append('<h3>%s</h3>\n%s' % (meta['nom'], liste_questions(qs)))

corps = """
    <div class="carte">
      <p>Voici <b>quarante questions de culture générale</b> réparties sur les huit
      thèmes de Generally, avec <b>la réponse et une explication</b> pour chacune.
      Elles sont tirées de la banque réelle du jeu, qui en compte %d.</p>
      <p>Vous pouvez les lire telles quelles, ou les utiliser pour interroger
      quelqu’un : les réponses figurent juste sous les questions.</p>
    </div>
%s
    <h2>Quarante questions avec leurs réponses</h2>
    %s

    <h2>Pour continuer</h2>
    <ul class="liens">
      <li><a href="../../quiz/culture-generale/">Le quiz complet, %d questions</a></li>
      <li><a href="../../quiz/histoire/">Questions d’histoire</a></li>
      <li><a href="../../quiz/geographie/">Questions de géographie</a></li>
      <li><a href="../../quiz/sciences/">Questions de sciences</a></li>
      <li><a href="../../guides/comment-ameliorer-sa-culture-generale/">Comment retenir
      ce que l’on apprend</a></li>
    </ul>
""" % (TOTAL,
       appel('Les mêmes questions, en jeu',
             'Avec le chronomètre, le score et la révision des questions manquées.',
             '../../', 'Jouer à Generally'),
       '\n    '.join(groupes), TOTAL)

crees.append(page(
    os.path.join('questions', 'culture-generale-avec-reponses', 'index.html'),
    'Questions de culture générale avec réponses — 40 exemples | Generally',
    '40 questions de culture générale avec les réponses et une explication pour '
    'chacune, réparties sur huit thèmes : histoire, géographie, sciences, sport, arts.',
    'Questions de culture générale avec réponses',
    corps,
    [('Accueil', '../../'), ('Questions', '')],
    '../../',
    chapo='Quarante questions tirées du jeu, avec la bonne réponse et son explication. '
          'À lire, ou à poser autour de vous.'))


# ============= /guides/comment-ameliorer-sa-culture-generale/
FAQ = [
    ('Combien de temps faut-il pour voir une différence ?',
     'Il n’existe pas de délai garanti : cela dépend du point de départ et de la '
     'régularité. Ce que l’on sait en revanche, c’est que quelques minutes par jour '
     'produisent plus d’effet qu’une longue session hebdomadaire, parce que les '
     'révisions espacées résistent mieux à l’oubli.'),
    ('Vaut-il mieux lire ou se tester ?',
     'Les deux, mais pas dans n’importe quel ordre. Relire un texte donne une '
     'impression de maîtrise trompeuse : tout semble familier. Essayer de retrouver '
     'l’information de mémoire est plus inconfortable, et c’est précisément pour cela '
     'que c’est plus efficace. Lisez pour découvrir, testez-vous pour retenir.'),
    ('Que faut-il connaître en culture générale ?',
     'Il n’existe pas de programme officiel. En pratique, les repères qui reviennent '
     'le plus souvent sont les grandes dates de l’histoire, les capitales et la '
     'géographie physique, les notions scientifiques de base, les œuvres et les '
     'auteurs majeurs, et le fonctionnement des institutions. Generally organise ses '
     'questions selon ces huit familles.'),
    ('Comment retenir ce que l’on vient d’apprendre ?',
     'En y revenant à intervalles croissants plutôt qu’en bloc. Une information revue '
     'le lendemain, puis quelques jours plus tard, puis une semaine après, tient '
     'beaucoup mieux que la même information relue cinq fois d’affilée. C’est le rôle '
     'de la fonction de révision du jeu, qui rejoue les questions manquées.'),
    ('Les quiz suffisent-ils à se cultiver ?',
     'Non, et ce serait malhonnête de le prétendre. Un quiz travaille le rappel de '
     'faits isolés. Il ne remplace ni un livre, ni un documentaire, ni une '
     'conversation : ceux-ci apportent le contexte et les liens entre les faits. '
     'Le quiz est un excellent complément, pas un substitut.'),
]

corps = """
    <div class="carte">
      <p><b>La réponse courte :</b> lisez régulièrement et sur des sujets variés, mais
      surtout <b>testez-vous</b> au lieu de relire, et <b>espacez vos révisions</b>
      dans le temps. Ces deux habitudes font plus de différence que le volume de
      lecture.</p>
    </div>

    <h2>Pourquoi relire ne suffit pas</h2>
    <p>C’est la méthode la plus répandue, et la moins efficace. Relire un texte produit
    un sentiment de familiarité qu’on confond facilement avec de la connaissance : les
    mots semblent évidents parce qu’on vient de les voir, pas parce qu’on saurait les
    retrouver demain.</p>
    <p>Essayer de restituer une information de mémoire est nettement plus inconfortable.
    C’est aussi ce qui la fixe. En psychologie cognitive, ce phénomène est connu sous le
    nom d’<b>effet de test</b> : l’acte de récupérer un souvenir renforce ce souvenir
    davantage qu’une exposition passive supplémentaire.</p>

    <h2>Espacer plutôt que masser</h2>
    <p>Réviser cinq fois le même soir donne de bien moins bons résultats que réviser
    cinq fois réparties sur deux semaines, à temps total égal. C’est l’<b>effet
    d’espacement</b>. L’oubli partiel entre deux révisions n’est pas un problème à
    éviter : c’est lui qui rend la révision suivante utile.</p>
    <p>En pratique : mieux vaut dix minutes chaque jour qu’une heure le dimanche.</p>

    <h2>Une méthode en cinq points</h2>
    <h3>1. Fixer un rendez-vous court et quotidien</h3>
    <p>Dix minutes à heure fixe valent mieux qu’une intention vague. Un rituel court
    survit aux semaines chargées, une longue session non.</p>

    <h3>2. Varier les domaines</h3>
    <p>La culture générale est par définition transversale. Alterner histoire,
    géographie, sciences et arts dans une même session est plus efficace que de traiter
    un domaine en bloc : l’alternance oblige le cerveau à identifier de quoi il s’agit
    avant de répondre, ce qui est précisément la difficulté en situation réelle.</p>

    <h3>3. Se tromper, puis comprendre pourquoi</h3>
    <p>Une erreur suivie immédiatement de la bonne réponse et de son explication est
    une des situations d’apprentissage les plus favorables. C’est la raison pour
    laquelle chaque question de Generally est accompagnée d’une explication plutôt que
    d’un simple « faux ».</p>

    <h3>4. Revenir sur ses erreurs</h3>
    <p>Tirer de nouvelles questions au hasard est agréable mais peu rentable : vous
    reverrez surtout ce que vous savez déjà. Rejouer spécifiquement ce que vous avez
    manqué concentre l’effort là où il manque.</p>

    <h3>5. Ancrer dans du contexte</h3>
    <p>Un fait isolé s’oublie, un fait relié tient. Quand une question vous intéresse,
    prenez trois minutes pour lire l’article correspondant ailleurs. Le quiz sert alors
    de point d’entrée, pas de destination.</p>
%s
    <h2>Utiliser Generally dans cette logique</h2>
    <ul class="liens">
      <li><b>Le défi du jour</b> installe le rendez-vous quotidien : dix questions,
      les mêmes pour tout le monde, avec une série de jours consécutifs à tenir.</li>
      <li><b>La révision</b> rejoue uniquement les questions que vous avez manquées.</li>
      <li><b>Le mode « tout mélangé »</b> alterne les huit thèmes, de façon équilibrée.</li>
      <li><b>La maîtrise par thème</b> montre où vous en êtes et ce que vous négligez.</li>
    </ul>

    <h2>Par où commencer</h2>
    <ul class="liens">
      <li><a href="../../quiz/culture-generale/">Le quiz de culture générale, pour situer son niveau</a></li>
      <li><a href="../../quiz/histoire/">Quiz d’histoire</a></li>
      <li><a href="../../quiz/geographie/">Quiz de géographie</a></li>
      <li><a href="../../quiz/sciences/">Quiz de sciences</a></li>
      <li><a href="../../questions/culture-generale-avec-reponses/">Quarante questions avec réponses, à lire</a></li>
    </ul>

    <h2>Questions fréquentes</h2>
    <div class="faq">
      %s
    </div>
""" % (appel('Mettre la méthode en pratique',
             'Le défi du jour prend trois minutes et installe l’habitude.',
             '../../?lancer=defi', 'Commencer le défi du jour'),
       '\n      '.join(
           '<details><summary>%s</summary><p>%s</p></details>' % (e(q), e(r))
           for q, r in FAQ))

schema_article = {
    "@context": "https://schema.org", "@type": "Article",
    "headline": "Comment améliorer sa culture générale ?",
    "inLanguage": "fr",
    "description": "Une méthode fondée sur deux principes : se tester plutôt que "
                   "relire, et espacer ses révisions.",
    "mainEntityOfPage": SITE + "/guides/comment-ameliorer-sa-culture-generale/",
    "publisher": {"@type": "Organization", "name": "Generally", "url": SITE + "/"}
}
schema_faq = {
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": [
        {"@type": "Question", "name": q,
         "acceptedAnswer": {"@type": "Answer", "text": r}}
        for q, r in FAQ
    ]
}

crees.append(page(
    os.path.join('guides', 'comment-ameliorer-sa-culture-generale', 'index.html'),
    'Comment améliorer sa culture générale ? La méthode | Generally',
    'Se tester plutôt que relire, espacer ses révisions : une méthode en cinq points '
    'pour améliorer sa culture générale, et les outils pour l’appliquer.',
    'Comment améliorer sa culture générale ?',
    corps,
    [('Accueil', '../../'), ('Guides', ''), ('Améliorer sa culture générale', '')],
    '../../',
    schemas=[schema_article, schema_faq],
    chapo='Lire aide, mais se tester aide davantage. Voici pourquoi, et comment '
          's’y prendre concrètement.'))


print('\npages generees :')
for c in crees:
    print('  ', c.replace('\\', '/'), '(%d octets)' % os.path.getsize(c))
