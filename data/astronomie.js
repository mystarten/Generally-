/* =============================================================================
   ASTRONOMIE — 70 questions
   Conventions identiques à data/geographie.js.
   planete : reponse = nom exact de la planète parmi
             Mercure, Vénus, Terre, Mars, Jupiter, Saturne, Uranus, Neptune.
   ============================================================================= */
window.QUESTIONS = window.QUESTIONS || [];
window.QUESTIONS.push(...[

/* ------------------------------- NIVEAU 1 --------------------------------- */
{
  id: "ast-001", categorie: "astronomie", niveau: 1, type: "planete",
  question: "Cliquez sur la planète la plus proche du Soleil.",
  reponse: "Mercure",
  explication: "Une année y dure 88 jours terrestres, mais une journée solaire complète en dure 176 : elle tourne très lentement sur elle-même."
},
{
  id: "ast-002", categorie: "astronomie", niveau: 1, type: "planete",
  question: "Cliquez sur la planète surnommée « la planète rouge ».",
  reponse: "Mars",
  explication: "Sa couleur vient de l'oxyde de fer de son sol : Mars est littéralement couverte de rouille."
},
{
  id: "ast-003", categorie: "astronomie", niveau: 1, type: "qcm",
  question: "Combien de planètes compte le système solaire ?",
  choix: ["8", "9", "7", "10"],
  reponse: 0,
  explication: "Huit depuis 2006, quand l'Union astronomique internationale a reclassé Pluton en planète naine."
},
{
  id: "ast-004", categorie: "astronomie", niveau: 1, type: "vrai_faux",
  question: "Pluton est toujours considérée comme une planète à part entière.",
  reponse: false,
  explication: "Elle ne « nettoie » pas son orbite des autres corps : c'est ce critère de 2006 qui l'a fait basculer chez les planètes naines."
},
{
  id: "ast-005", categorie: "astronomie", niveau: 1, type: "planete",
  question: "Cliquez sur la plus grosse planète du système solaire.",
  reponse: "Jupiter",
  explication: "Elle est deux fois et demie plus massive que toutes les autres planètes réunies."
},
{
  id: "ast-006", categorie: "astronomie", niveau: 1, type: "qcm",
  question: "Quelle est l'étoile la plus proche de la Terre ?",
  choix: ["Le Soleil", "Proxima Centauri", "Sirius", "l'étoile Polaire"],
  reponse: 0,
  explication: "À 150 millions de km, soit 270 000 fois plus près que la deuxième, Proxima Centauri."
},
{
  id: "ast-007", categorie: "astronomie", niveau: 1, type: "vrai_faux",
  question: "La Lune se rapproche lentement de la Terre.",
  reponse: false,
  explication: "Elle s'en éloigne, de 3,8 cm par an, mesurés au laser grâce aux réflecteurs posés par les missions Apollo."
},
{
  id: "ast-008", categorie: "astronomie", niveau: 1, type: "planete",
  question: "Cliquez sur la planète dont les anneaux sont les plus spectaculaires.",
  reponse: "Saturne",
  explication: "Larges de 280 000 km mais épais de quelques dizaines de mètres seulement : à l'échelle, plus fins qu'une feuille de papier."
},
{
  id: "ast-009", categorie: "astronomie", niveau: 1, type: "qcm",
  question: "Qui a marché le premier sur la Lune ?",
  choix: ["Neil Armstrong", "Buzz Aldrin", "Youri Gagarine", "Michael Collins"],
  reponse: 0,
  explication: "Le 21 juillet 1969 à 2 h 56 UTC ; Aldrin l'a rejoint dix-neuf minutes plus tard, Collins est resté en orbite."
},
{
  id: "ast-010", categorie: "astronomie", niveau: 1, type: "chronologie",
  question: "Classez ces étapes de la conquête spatiale.",
  choix: [
    "Lancement de Spoutnik 1",
    "Youri Gagarine, premier homme dans l'espace",
    "Premiers pas sur la Lune",
    "Mise en orbite du télescope Hubble"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1957, 1961, 1969, 1990. Douze ans seulement séparent la première bille métallique en orbite des premiers pas lunaires."
},
{
  id: "ast-011", categorie: "astronomie", niveau: 1, type: "qcm",
  question: "Combien de temps la lumière du Soleil met-elle à atteindre la Terre ?",
  choix: ["Environ 8 minutes", "Environ 8 secondes", "Environ 1 heure", "Instantanément"],
  reponse: 0,
  explication: "8 minutes 20 : le Soleil que l'on voit est toujours celui d'il y a huit minutes."
},
{
  id: "ast-012", categorie: "astronomie", niveau: 1, type: "planete",
  question: "Cliquez sur la planète la plus chaude du système solaire.",
  reponse: "Vénus",
  explication: "465 °C en surface, plus que Mercure pourtant plus proche du Soleil : son atmosphère de CO2 piège la chaleur."
},
{
  id: "ast-013", categorie: "astronomie", niveau: 1, type: "qcm",
  question: "Dans quelle galaxie se trouve le système solaire ?",
  choix: ["La Voie lactée", "Andromède", "Le Grand Nuage de Magellan", "Le Triangle"],
  reponse: 0,
  explication: "Nous sommes dans un bras périphérique, à 26 000 années-lumière du centre, et nous en faisons le tour en 230 millions d'années."
},
{
  id: "ast-014", categorie: "astronomie", niveau: 1, type: "vrai_faux",
  question: "Le son ne se propage pas dans le vide de l'espace.",
  reponse: true,
  explication: "Le son a besoin d'un milieu matériel ; les explosions sonores des films spatiaux sont une licence poétique."
},
{
  id: "ast-015", categorie: "astronomie", niveau: 1, type: "vrai_faux",
  question: "Mars possède une seule lune.",
  reponse: false,
  explication: "Elle en a deux, Phobos et Deimos. Phobos se rapproche de la planète et finira par s'y écraser ou se disloquer."
},

/* ------------------------------- NIVEAU 2 --------------------------------- */
{
  id: "ast-016", categorie: "astronomie", niveau: 2, type: "planete",
  question: "Cliquez sur la planète dont la rotation sur elle-même est la plus lente.",
  reponse: "Vénus",
  explication: "243 jours terrestres pour un tour sur elle-même, contre 225 pour une orbite : son jour dure plus longtemps que son année."
},
{
  id: "ast-017", categorie: "astronomie", niveau: 2, type: "qcm",
  question: "Quel est le plus grand volcan connu du système solaire ?",
  choix: ["Olympus Mons", "Le Mauna Kea", "Maat Mons", "Le mont Everest"],
  reponse: 0,
  explication: "Sur Mars, 22 km de haut et large comme la France : sans tectonique des plaques, le point chaud a empilé la lave au même endroit."
},
{
  id: "ast-018", categorie: "astronomie", niveau: 2, type: "vrai_faux",
  question: "Vénus tourne sur elle-même dans le sens inverse de la plupart des planètes.",
  reponse: true,
  explication: "Sa rotation est rétrograde : sur Vénus, le Soleil se lève à l'ouest et se couche à l'est."
},
{
  id: "ast-019", categorie: "astronomie", niveau: 2, type: "planete",
  question: "Cliquez sur la planète qui a été prédite par le calcul avant d'être observée.",
  reponse: "Neptune",
  explication: "Urbain Le Verrier a déduit sa position des perturbations d'Uranus ; l'observatoire de Berlin l'a trouvée en 1846 à un degré près."
},
{
  id: "ast-020", categorie: "astronomie", niveau: 2, type: "qcm",
  question: "Qu'est-ce qu'une année-lumière ?",
  choix: [
    "Une distance, celle parcourue par la lumière en un an",
    "La durée d'une orbite solaire",
    "Une unité de luminosité stellaire",
    "Le temps mis par la lumière pour traverser la galaxie"
  ],
  reponse: 0,
  explication: "Environ 9 461 milliards de kilomètres : c'est une unité de longueur malgré son nom trompeur."
},
{
  id: "ast-021", categorie: "astronomie", niveau: 2, type: "chronologie",
  question: "Classez ces jalons de l'exploration spatiale.",
  choix: [
    "Première sortie extravéhiculaire d'Alexeï Leonov",
    "Mission Apollo 11",
    "Lancement du premier module de la station Mir",
    "Atterrissage du rover Curiosity sur Mars"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1965, 1969, 1986, 2012. Leonov a failli ne pas pouvoir rentrer : sa combinaison s'était gonflée dans le vide."
},
{
  id: "ast-022", categorie: "astronomie", niveau: 2, type: "planete",
  question: "Cliquez sur la planète où souffle la Grande Tache rouge.",
  reponse: "Jupiter",
  explication: "Cet anticyclone est observé depuis au moins le XIXe siècle et pourrait contenir la Terre entière, même s'il rétrécit."
},
{
  id: "ast-023", categorie: "astronomie", niveau: 2, type: "qcm",
  question: "Quelle est la plus grande lune du système solaire ?",
  choix: ["Ganymède", "Titan", "Callisto", "La Lune"],
  reponse: 0,
  explication: "Satellite de Jupiter, plus grand que Mercure, et le seul à posséder son propre champ magnétique."
},
{
  id: "ast-024", categorie: "astronomie", niveau: 2, type: "qcm",
  question: "Quelle est la température approximative de la surface du Soleil ?",
  choix: ["Environ 5 500 °C", "Environ 1 000 °C", "Environ 15 millions de °C", "Environ 100 000 °C"],
  reponse: 0,
  explication: "15 millions de degrés, c'est le cœur. Curieusement, la couronne, bien plus loin, dépasse le million de degrés."
},
{
  id: "ast-025", categorie: "astronomie", niveau: 2, type: "planete",
  question: "Cliquez sur la planète dont la densité est inférieure à celle de l'eau.",
  reponse: "Saturne",
  explication: "0,69 g/cm³ : s'il existait une baignoire assez grande, Saturne y flotterait."
},
{
  id: "ast-026", categorie: "astronomie", niveau: 2, type: "qcm",
  question: "Qu'est-ce que la ceinture de Kuiper ?",
  choix: [
    "Une région de petits corps glacés au-delà de Neptune",
    "L'anneau d'astéroïdes entre Mars et Jupiter",
    "Un nuage de gaz autour du Soleil",
    "La zone habitable du système solaire"
  ],
  reponse: 0,
  explication: "Pluton en est le membre le plus célèbre ; c'est de là que viennent la plupart des comètes à courte période."
},
{
  id: "ast-027", categorie: "astronomie", niveau: 2, type: "vrai_faux",
  question: "Les étoiles filantes sont des étoiles.",
  reponse: false,
  explication: "Ce sont des grains de poussière, souvent plus petits qu'un grain de riz, qui se consument à 80 km d'altitude."
},
{
  id: "ast-028", categorie: "astronomie", niveau: 2, type: "chronologie",
  question: "Classez ces étapes de l'astronomie moderne.",
  choix: [
    "Copernic publie son modèle héliocentrique",
    "Galilée observe les lunes de Jupiter",
    "Newton publie les Principia",
    "Herschel découvre Uranus"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1543, 1610, 1687, 1781. Copernic a fait publier son livre l'année de sa mort, par prudence."
},
{
  id: "ast-029", categorie: "astronomie", niveau: 2, type: "qcm",
  question: "Quel télescope spatial, lancé en 2021, a pris la succession de Hubble ?",
  choix: ["James-Webb", "Kepler", "Spitzer", "Gaia"],
  reponse: 0,
  explication: "Il observe dans l'infrarouge à 1,5 million de km de la Terre, protégé par un pare-soleil de la taille d'un court de tennis."
},
{
  id: "ast-030", categorie: "astronomie", niveau: 2, type: "vrai_faux",
  question: "Le Soleil est classé parmi les géantes rouges.",
  reponse: false,
  explication: "C'est une naine jaune, de type spectral G2V : banale à l'échelle galactique, mais tout de même plus massive que 90 % des étoiles de la Voie lactée."
},

/* ------------------------------- NIVEAU 3 --------------------------------- */
{
  id: "ast-031", categorie: "astronomie", niveau: 3, type: "planete",
  question: "Cliquez sur la planète qui met environ 165 années terrestres à boucler son orbite.",
  reponse: "Neptune",
  explication: "Depuis sa découverte en 1846, elle n'a bouclé qu'une seule orbite complète, achevée en 2011."
},
{
  id: "ast-032", categorie: "astronomie", niveau: 3, type: "qcm",
  question: "Qu'est-ce que la limite de Roche ?",
  choix: [
    "La distance en deçà de laquelle les marées disloquent un satellite",
    "La taille maximale d'une planète tellurique",
    "La frontière du système solaire",
    "La vitesse de libération d'un astre"
  ],
  reponse: 0,
  explication: "Les anneaux de Saturne se trouvent à l'intérieur de cette limite : ils sont sans doute les restes d'une lune brisée."
},
{
  id: "ast-033", categorie: "astronomie", niveau: 3, type: "vrai_faux",
  question: "En moyenne sur le long terme, Mercure est la planète la plus proche de la Terre.",
  reponse: true,
  explication: "Contre-intuitif mais exact : Vénus s'approche davantage, mais s'éloigne aussi beaucoup plus souvent de l'autre côté du Soleil."
},
{
  id: "ast-034", categorie: "astronomie", niveau: 3, type: "planete",
  question: "Cliquez sur la planète survolée par Voyager 2 en 1986.",
  reponse: "Uranus",
  explication: "Seule visite jamais effectuée : la sonde n'a eu que quelques heures pour photographier la planète et ses lunes."
},
{
  id: "ast-035", categorie: "astronomie", niveau: 3, type: "qcm",
  question: "Quelle est la vitesse de la lumière dans le vide ?",
  choix: ["299 792 458 m/s", "300 000 000 km/s", "150 000 000 m/s", "3 000 000 m/s"],
  reponse: 0,
  explication: "Cette valeur est exacte par définition depuis 1983 : c'est elle qui sert désormais à définir le mètre."
},
{
  id: "ast-036", categorie: "astronomie", niveau: 3, type: "chronologie",
  question: "Classez ces découvertes en cosmologie et exoplanétologie.",
  choix: [
    "Découverte du fond diffus cosmologique",
    "Première exoplanète autour d'une étoile semblable au Soleil",
    "Première image d'un trou noir",
    "Premières images du télescope James-Webb"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1965, 1995, 2019, 2022. Le fond diffus a été pris pour une panne d'antenne avant d'être identifié comme l'écho du Big Bang."
},
{
  id: "ast-037", categorie: "astronomie", niveau: 3, type: "qcm",
  question: "Quel astronome a donné son nom à la loi reliant la distance des galaxies à leur vitesse de fuite ?",
  choix: ["Hubble", "Herschel", "Eddington", "Shapley"],
  reponse: 0,
  explication: "On parle aujourd'hui de loi de Hubble-Lemaître, le chanoine belge ayant publié le résultat deux ans avant lui, en français."
},
{
  id: "ast-038", categorie: "astronomie", niveau: 3, type: "vrai_faux",
  question: "Le Soleil représente plus de 99 % de la masse du système solaire.",
  reponse: true,
  explication: "99,86 % exactement, et Jupiter accapare les deux tiers de ce qui reste."
},
{
  id: "ast-039", categorie: "astronomie", niveau: 3, type: "planete",
  question: "Cliquez sur la planète dont l'axe de rotation est presque couché sur son orbite.",
  reponse: "Uranus",
  explication: "Inclinaison de 98° : chaque pôle connaît 42 ans de jour continu, puis 42 ans de nuit."
},
{
  id: "ast-040", categorie: "astronomie", niveau: 3, type: "qcm",
  question: "À quoi servent principalement les supernovæ de type Ia en cosmologie ?",
  choix: [
    "De chandelles standard pour mesurer les distances",
    "À dater l'âge des galaxies",
    "À mesurer la masse des trous noirs",
    "À détecter les exoplanètes"
  ],
  reponse: 0,
  explication: "Leur luminosité intrinsèque est toujours la même ; c'est en les observant qu'on a découvert l'accélération de l'expansion en 1998."
},
{
  id: "ast-041", categorie: "astronomie", niveau: 3, type: "planete",
  question: "Cliquez sur la planète la plus dense du système solaire.",
  reponse: "Terre",
  explication: "5,51 g/cm³, grâce à son noyau de fer et de nickel ; Mercure la suit de près malgré sa petite taille."
},
{
  id: "ast-042", categorie: "astronomie", niveau: 3, type: "qcm",
  question: "Combien de temps la lumière de Proxima Centauri met-elle à nous parvenir ?",
  choix: ["Environ 4,2 ans", "Environ 4,2 mois", "Environ 42 ans", "Environ 400 ans"],
  reponse: 0,
  explication: "Avec les sondes les plus rapides jamais lancées, il faudrait encore des dizaines de milliers d'années pour y aller."
},
{
  id: "ast-043", categorie: "astronomie", niveau: 3, type: "vrai_faux",
  question: "Un trou noir aspire tout ce qui passe à proximité, quelle que soit la distance.",
  reponse: false,
  explication: "Au-delà de l'horizon, sa gravité est celle d'un astre de même masse : si le Soleil devenait un trou noir, les orbites ne changeraient pas."
},
{
  id: "ast-044", categorie: "astronomie", niveau: 3, type: "planete",
  question: "Cliquez sur la planète où une journée dure plus longtemps qu'une année.",
  reponse: "Vénus",
  explication: "243 jours de rotation contre 225 jours d'orbite : un cas unique dans le système solaire."
},
{
  id: "ast-045", categorie: "astronomie", niveau: 3, type: "chronologie",
  question: "Classez ces missions et instruments d'observation.",
  choix: [
    "Lancement de Voyager 1",
    "Lancement du télescope Hubble",
    "Arrivée de la sonde Cassini autour de Saturne",
    "Survol de Pluton par New Horizons"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1977, 1990, 2004, 2015. Voyager 1 est aujourd'hui l'objet humain le plus éloigné, à plus de 24 milliards de km."
}

]);

/* ------------------------- EXTENSION : 10 questions ------------------------ */
window.QUESTIONS.push(...[

{
  id: "ast-046", categorie: "astronomie", niveau: 1, type: "planete",
  question: "Cliquez sur la planète voisine de la Terre du côté du Soleil.",
  reponse: "Vénus",
  explication: "C'est l'astre le plus brillant du ciel après le Soleil et la Lune : on peut même la repérer en plein jour si l'on sait où regarder."
},
{
  id: "ast-047", categorie: "astronomie", niveau: 1, type: "qcm",
  question: "Que se passe-t-il lors d'une éclipse solaire totale ?",
  choix: [
    "La Lune passe exactement devant le Soleil vu de la Terre",
    "La Terre passe devant le Soleil vu de la Lune",
    "Le Soleil s'éteint momentanément",
    "La Terre projette son ombre sur le Soleil"
  ],
  reponse: 0,
  explication: "Coïncidence remarquable : le Soleil est environ 400 fois plus large que la Lune, mais aussi 400 fois plus loin."
},
{
  id: "ast-048", categorie: "astronomie", niveau: 1, type: "vrai_faux",
  question: "La Lune tournant sur elle-même, on finit par voir toutes ses faces depuis la Terre.",
  reponse: false,
  explication: "Sa rotation s'est synchronisée avec son orbite sous l'effet des marées : elle montre toujours la même face. De légers balancements en dévoilent tout de même 59 %."
},
{
  id: "ast-049", categorie: "astronomie", niveau: 1, type: "qcm",
  question: "Combien de temps dure un cycle complet des phases de la Lune ?",
  choix: ["Environ 29,5 jours", "Environ 24 jours", "Environ 31 jours", "Environ 35 jours"],
  reponse: 0,
  explication: "C'est de cette durée que vient le mot « mois ». Le mois sidéral, temps d'une orbite réelle, ne dure lui que 27,3 jours."
},
{
  id: "ast-050", categorie: "astronomie", niveau: 2, type: "planete",
  question: "Cliquez sur la planète où soufflent les vents les plus rapides du système solaire.",
  reponse: "Neptune",
  explication: "Plus de 2 000 km/h, alors qu'elle reçoit mille fois moins d'énergie solaire que la Terre : l'origine de ces vents reste mal expliquée."
},
{
  id: "ast-051", categorie: "astronomie", niveau: 2, type: "qcm",
  question: "Quelle lune de Saturne possède des lacs d'hydrocarbures liquides ?",
  choix: ["Titan", "Encelade", "Japet", "Mimas"],
  reponse: 0,
  explication: "C'est la seule lune du système solaire dotée d'une atmosphère dense. La sonde Huygens s'y est posée en 2005, à un milliard de kilomètres de la Terre."
},
{
  id: "ast-052", categorie: "astronomie", niveau: 2, type: "chronologie",
  question: "Classez ces découvertes et décisions concernant les petits corps du système solaire.",
  choix: [
    "Découverte de Cérès, premier astéroïde connu",
    "Découverte de Neptune",
    "Découverte de Pluton",
    "Reclassement de Pluton en planète naine"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1801, 1846, 1930, 2006. Cérès aussi a été comptée parmi les planètes pendant près d'un demi-siècle avant d'être déclassée."
},
{
  id: "ast-053", categorie: "astronomie", niveau: 2, type: "vrai_faux",
  question: "Une comète active présente deux queues de nature différente.",
  reponse: true,
  explication: "Une de poussières, courbée le long de son orbite, et une de gaz ionisés, toujours orientée à l'opposé exact du Soleil."
},
{
  id: "ast-054", categorie: "astronomie", niveau: 3, type: "planete",
  question: "Cliquez sur la planète sans lune ni anneau, sans atmosphère notable, dont la surface criblée de cratères ressemble à celle de la Lune.",
  reponse: "Mercure",
  explication: "Faute d'air pour redistribuer la chaleur, elle passe de 430 °C au soleil à -180 °C dans l'ombre."
},
{
  id: "ast-055", categorie: "astronomie", niveau: 3, type: "chronologie",
  question: "Classez ces premières spatiales.",
  choix: [
    "Valentina Terechkova, première femme dans l'espace",
    "Venera 7, premier atterrissage réussi sur Vénus",
    "Mise en orbite du premier module de la Station spatiale internationale",
    "Premier réemploi d'un étage orbital par SpaceX"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1963, 1970, 1998, 2017. Terechkova avait 26 ans ; il faudra attendre dix-neuf ans pour voir une deuxième femme en orbite."
}

]);

/* ------------------------- EXTENSION : 15 questions ------------------------ */
window.QUESTIONS.push(...[

{
  id: "ast-056", categorie: "astronomie", niveau: 1, type: "planete",
  question: "Cliquez sur la planète qui compte le plus grand nombre de lunes connues.",
  reponse: "Saturne",
  explication: "Plus de 140 satellites recensés : elle a repris la tête à Jupiter en 2023, après une moisson de petites lunes découvertes d'un coup."
},
{
  id: "ast-057", categorie: "astronomie", niveau: 1, type: "qcm",
  question: "Que se passe-t-il lors d'une éclipse de Lune ?",
  choix: [
    "La Terre s'interpose entre le Soleil et la Lune",
    "La Lune s'interpose entre le Soleil et la Terre",
    "Le Soleil est masqué par un nuage de poussières",
    "La Lune entre dans l'ombre de Vénus"
  ],
  reponse: 0,
  explication: "La Lune ne disparaît pas : elle rougit, car seule la lumière filtrée par l'atmosphère terrestre l'atteint encore."
},
{
  id: "ast-058", categorie: "astronomie", niveau: 1, type: "vrai_faux",
  question: "La Station spatiale internationale est visible à l'œil nu depuis le sol.",
  reponse: true,
  explication: "Elle traverse le ciel en quelques minutes comme un point très brillant, éclairé par le Soleil alors qu'il fait nuit au sol."
},
{
  id: "ast-059", categorie: "astronomie", niveau: 1, type: "qcm",
  question: "Combien de temps la Station spatiale internationale met-elle pour faire le tour de la Terre ?",
  choix: ["Environ 90 minutes", "Environ 24 heures", "Environ 6 heures", "Environ 3 jours"],
  reponse: 0,
  explication: "Seize levers et couchers de soleil par jour pour l'équipage, qui vit malgré tout à l'heure de Greenwich."
},
{
  id: "ast-060", categorie: "astronomie", niveau: 1, type: "planete",
  question: "Cliquez sur la plus petite planète du système solaire.",
  reponse: "Mercure",
  explication: "À peine plus grosse que notre Lune, et plus petite que Ganymède et Titan, deux satellites d'autres planètes."
},
{
  id: "ast-061", categorie: "astronomie", niveau: 2, type: "chronologie",
  question: "Classez ces étapes de l'exploration de Mars et de l'espace.",
  choix: [
    "Lancement du premier satellite artificiel",
    "Premier survol de Mars par Mariner 4",
    "Premier atterrissage réussi sur Mars (Viking 1)",
    "Premier vol d'un hélicoptère sur Mars"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1957, 1965, 1976, 2021. Les 21 photos de Mariner 4 ont douché les espoirs d'une planète habitable : un désert criblé de cratères."
},
{
  id: "ast-062", categorie: "astronomie", niveau: 2, type: "qcm",
  question: "Qu'est-ce que le nuage d'Oort ?",
  choix: [
    "Un réservoir de comètes aux confins du système solaire",
    "Un nuage de gaz au centre de la Galaxie",
    "La ceinture d'astéroïdes entre Mars et Jupiter",
    "L'atmosphère résiduelle de Pluton"
  ],
  reponse: 0,
  explication: "Une coquille sphérique située jusqu'à un millier de fois plus loin que Neptune. Elle n'a jamais été observée directement."
},
{
  id: "ast-063", categorie: "astronomie", niveau: 2, type: "planete",
  question: "Cliquez sur la planète qui met un peu moins de douze ans à boucler son orbite.",
  reponse: "Jupiter",
  explication: "11 ans et 10 mois. Cette durée proche de la douzaine a servi de base au cycle zodiacal de plusieurs astronomies anciennes."
},
{
  id: "ast-064", categorie: "astronomie", niveau: 2, type: "vrai_faux",
  question: "Le Soleil finira sa vie en explosant en supernova.",
  reponse: false,
  explication: "Il est trop peu massif : il gonflera en géante rouge, puis se contractera en naine blanche de la taille de la Terre."
},
{
  id: "ast-065", categorie: "astronomie", niveau: 2, type: "qcm",
  question: "Quelle est l'origine des aurores polaires ?",
  choix: [
    "Des particules du vent solaire guidées par le champ magnétique terrestre",
    "La réfraction de la lumière sur les cristaux de glace",
    "Des décharges électriques dans les nuages polaires",
    "Le rayonnement des aurores boréales de Jupiter"
  ],
  reponse: 0,
  explication: "Le vert vient de l'oxygène vers 100 km d'altitude, le rouge du même oxygène beaucoup plus haut, vers 300 km."
},
{
  id: "ast-066", categorie: "astronomie", niveau: 3, type: "qcm",
  question: "Que désigne le paradoxe de Fermi ?",
  choix: [
    "L'écart entre la probabilité de civilisations extraterrestres et l'absence totale d'indices",
    "L'impossibilité de dépasser la vitesse de la lumière",
    "La contradiction entre relativité et mécanique quantique",
    "L'excès de matière par rapport à l'antimatière"
  ],
  reponse: 0,
  explication: "Fermi l'aurait résumé pendant un déjeuner en 1950 par une seule question : « Mais où sont-ils ? »"
},
{
  id: "ast-067", categorie: "astronomie", niveau: 3, type: "planete",
  question: "Cliquez sur la planète où se trouve Valles Marineris, le plus grand canyon du système solaire.",
  reponse: "Mars",
  explication: "4 000 km de long et jusqu'à 7 km de profondeur : le Grand Canyon y tiendrait une dizaine de fois."
},
{
  id: "ast-068", categorie: "astronomie", niveau: 3, type: "chronologie",
  question: "Classez ces missions et résultats d'observation.",
  choix: [
    "Première carte complète du fond diffus par le satellite COBE",
    "Lancement de la sonde Cassini vers Saturne",
    "Atterrissage de Philae sur une comète",
    "Première exoplanète confirmée par le télescope TESS"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1992, 1997, 2014, 2018. Philae a rebondi deux fois avant de se coincer à l'ombre d'une falaise, ce qui a écourté sa mission."
},
{
  id: "ast-069", categorie: "astronomie", niveau: 3, type: "vrai_faux",
  question: "Il existe des planètes qui ne tournent autour d'aucune étoile.",
  reponse: true,
  explication: "Les planètes errantes, éjectées de leur système ou formées seules. On en soupçonne des milliards dans la seule Voie lactée."
},
{
  id: "ast-070", categorie: "astronomie", niveau: 3, type: "qcm",
  question: "Que vaut une unité astronomique ?",
  choix: [
    "La distance moyenne entre la Terre et le Soleil",
    "La distance entre la Terre et la Lune",
    "Le rayon du système solaire",
    "La distance parcourue par la lumière en une heure"
  ],
  reponse: 0,
  explication: "Environ 150 millions de kilomètres. Sa valeur est fixée exactement depuis 2012 : 149 597 870 700 mètres."
}

]);

/* =============================================================================
   ASTRONOMIE — deuxième série (40 questions)
   ============================================================================= */
window.QUESTIONS.push(...[

/* ------------------------------- NIVEAU 1 --------------------------------- */
{
  id: "ast-071", categorie: "astronomie", niveau: 1, type: "qcm",
  question: "Quelle étoile la Terre orbite-t-elle ?",
  choix: ["Le Soleil", "Sirius", "Proxima du Centaure", "Polaris"],
  reponse: 0,
  explication: "Une étoile très ordinaire. Elle représente à elle seule 99,86 % de la masse de tout le système solaire."
},
{
  id: "ast-072", categorie: "astronomie", niveau: 1, type: "planete",
  question: "Cliquez sur la planète qui porte des anneaux bien visibles depuis la Terre.",
  reponse: "Saturne",
  explication: "Ses anneaux ne font qu'une dizaine de mètres d'épaisseur pour 280 000 km de large : vus par la tranche, ils disparaissent presque."
},
{
  id: "ast-073", categorie: "astronomie", niveau: 1, type: "vrai_faux",
  question: "La Lune tourne toujours la même face vers la Terre.",
  reponse: true,
  explication: "Sa rotation dure exactement autant que son orbite. La face cachée n'a été vue pour la première fois qu'en 1959, par une sonde soviétique."
},
{
  id: "ast-074", categorie: "astronomie", niveau: 1, type: "qcm",
  question: "Combien de temps la Terre met-elle à faire un tour sur elle-même ?",
  choix: ["24 heures", "12 heures", "365 jours", "1 mois"],
  reponse: 0,
  explication: "Presque : 23 h 56 min par rapport aux étoiles. Les quatre minutes manquantes viennent du déplacement de la Terre sur son orbite."
},
{
  id: "ast-075", categorie: "astronomie", niveau: 1, type: "qcm",
  question: "Comment s'appelle notre galaxie ?",
  choix: ["La Voie lactée", "Andromède", "Le Grand Nuage de Magellan", "Le Triangle"],
  reponse: 0,
  explication: "Le nom vient du grec « chemin de lait ». Ce que nous voyons dans le ciel d'été est sa tranche, vue de l'intérieur du disque."
},
{
  id: "ast-076", categorie: "astronomie", niveau: 1, type: "planete",
  question: "Cliquez sur la planète la plus éloignée du Soleil.",
  reponse: "Neptune",
  explication: "Elle met 165 ans à faire le tour du Soleil : depuis sa découverte en 1846, elle n'a bouclé qu'une seule orbite."
},
{
  id: "ast-077", categorie: "astronomie", niveau: 1, type: "vrai_faux",
  question: "Une année-lumière mesure une durée.",
  reponse: false,
  explication: "C'est une distance : celle que la lumière parcourt en un an, soit environ 9 460 milliards de kilomètres."
},
{
  id: "ast-079", categorie: "astronomie", niveau: 1, type: "chronologie",
  question: "Classez ces astres du plus petit au plus grand.",
  choix: ["La Lune", "La Terre", "Jupiter", "Le Soleil"],
  reponse: [0, 1, 2, 3],
  explication: "On pourrait loger 1 300 Terres dans Jupiter, et environ un million dans le Soleil."
},
{
  id: "ast-080", categorie: "astronomie", niveau: 1, type: "qcm",
  question: "Qu'est-ce qu'une étoile filante ?",
  choix: ["Un grain de poussière qui brûle dans l'atmosphère", "Une étoile qui se déplace",
          "Une comète lointaine", "Un satellite artificiel"],
  reponse: 0,
  explication: "La plupart ne sont pas plus grosses qu'un grain de sable. C'est la vitesse, plusieurs dizaines de km/s, qui produit la traînée lumineuse."
},
{
  id: "ast-081", categorie: "astronomie", niveau: 1, type: "vrai_faux",
  question: "Le Soleil est une étoile.",
  reponse: true,
  explication: "Une naine jaune, de taille très commune. Vue depuis une planète lointaine, elle ne serait qu'un point parmi d'autres."
},
{
  id: "ast-084", categorie: "astronomie", niveau: 1, type: "qcm",
  question: "Quel phénomène se produit quand la Lune passe devant le Soleil ?",
  choix: ["Une éclipse solaire", "Une éclipse lunaire", "Une aurore boréale", "Un solstice"],
  reponse: 0,
  explication: "Le hasard veut que le Soleil soit 400 fois plus gros que la Lune et 400 fois plus loin : les deux disques se recouvrent presque exactement."
},

/* ------------------------------- NIVEAU 2 --------------------------------- */
{
  id: "ast-085", categorie: "astronomie", niveau: 2, type: "qcm",
  question: "Qu'est-ce qu'un trou noir ?",
  choix: ["Un objet dont la gravité retient même la lumière", "Un trou dans l'espace",
          "Une étoile éteinte et froide", "Un nuage de poussière opaque"],
  reponse: 0,
  explication: "La première image d'un trou noir date de 2019 : on n'y voit pas l'objet lui-même, invisible par nature, mais l'ombre qu'il découpe dans la matière environnante."
},
{
  id: "ast-086", categorie: "astronomie", niveau: 2, type: "vrai_faux",
  question: "Mars possède deux satellites naturels.",
  reponse: true,
  explication: "Phobos et Deimos, deux blocs irréguliers de quelques kilomètres, probablement des astéroïdes capturés. Phobos se rapproche et finira par se disloquer."
},
{
  id: "ast-087", categorie: "astronomie", niveau: 2, type: "planete",
  question: "Cliquez sur la planète qui tourne couchée sur le côté.",
  reponse: "Uranus",
  explication: "Son axe est incliné de 98°, sans doute à la suite d'une collision majeure. Chacun de ses pôles connaît quarante-deux ans de jour, puis autant de nuit."
},
{
  id: "ast-088", categorie: "astronomie", niveau: 2, type: "qcm",
  question: "Quelle distance sépare en moyenne la Terre du Soleil ?",
  choix: ["150 millions de km", "15 millions de km", "1,5 milliard de km", "380 000 km"],
  reponse: 0,
  explication: "Cette distance sert d'unité de mesure, l'unité astronomique. La lumière du Soleil met un peu plus de huit minutes à nous parvenir."
},
{
  id: "ast-090", categorie: "astronomie", niveau: 2, type: "qcm",
  question: "Qu'est-ce qu'une supernova ?",
  choix: ["L'explosion d'une étoile massive en fin de vie", "La naissance d'une étoile",
          "La collision de deux planètes", "Une éruption solaire géante"],
  reponse: 0,
  explication: "Tous les éléments plus lourds que le fer que contient votre corps ont été forgés dans de telles explosions."
},
{
  id: "ast-091", categorie: "astronomie", niveau: 2, type: "vrai_faux",
  question: "Il n'y a pas de gravité à bord de la Station spatiale internationale.",
  reponse: false,
  explication: "La gravité y vaut encore 90 % de celle du sol. Les astronautes flottent parce qu'ils tombent en permanence autour de la Terre, en même temps que la station."
},
{
  id: "ast-092", categorie: "astronomie", niveau: 2, type: "qcm",
  question: "Où se situe la ceinture d'astéroïdes principale ?",
  choix: ["Entre Mars et Jupiter", "Entre la Terre et Mars",
          "Au-delà de Neptune", "Entre Jupiter et Saturne"],
  reponse: 0,
  explication: "Malgré les images de cinéma, ses corps sont si dispersés que les sondes la traversent sans la moindre manœuvre d'évitement."
},
{
  id: "ast-093", categorie: "astronomie", niveau: 2, type: "qcm",
  question: "Quelle galaxie entrera en collision avec la Voie lactée dans quelques milliards d'années ?",
  choix: ["Andromède", "Le Sombrero", "Le Tourbillon", "Le Triangle"],
  reponse: 0,
  explication: "Elle fonce vers nous à 110 km/s. Les étoiles sont si espacées qu'aucune collision stellaire n'est attendue : les deux galaxies se traverseront."
},
{
  id: "ast-094", categorie: "astronomie", niveau: 2, type: "vrai_faux",
  question: "Les saisons sont dues à l'inclinaison de l'axe terrestre, pas à la distance au Soleil.",
  reponse: true,
  explication: "La Terre est même la plus proche du Soleil début janvier, en plein hiver de l'hémisphère nord."
},
{
  id: "ast-095", categorie: "astronomie", niveau: 2, type: "qcm",
  question: "Quel télescope spatial, lancé en 1990, a produit certaines des images les plus célèbres du cosmos ?",
  choix: ["Hubble", "James-Webb", "Kepler", "Spitzer"],
  reponse: 0,
  explication: "Son miroir était mal taillé de quelques microns. Il a fallu une mission de navette en 1993 pour lui poser l'équivalent de lunettes correctrices."
},
{
  id: "ast-096", categorie: "astronomie", niveau: 2, type: "planete",
  question: "Cliquez sur la planète dont une tempête dure depuis des siècles.",
  reponse: "Jupiter",
  explication: "La Grande Tache rouge, observée depuis le XVIIe siècle. Elle pourrait contenir la Terre entière, mais rétrécit depuis quelques décennies."
},
{
  id: "ast-098", categorie: "astronomie", niveau: 2, type: "qcm",
  question: "Qui fut le premier être humain à voyager dans l'espace ?",
  choix: ["Youri Gagarine", "Alan Shepard", "Neil Armstrong", "Valentina Terechkova"],
  reponse: 0,
  explication: "En avril 1961, pour un vol de 108 minutes. Il a atterri séparément de sa capsule, en parachute, ce que l'URSS a longtemps dissimulé."
},

/* ------------------------------- NIVEAU 3 --------------------------------- */
{
  id: "ast-099", categorie: "astronomie", niveau: 3, type: "qcm",
  question: "Quel est l'âge estimé de l'univers ?",
  choix: ["13,8 milliards d'années", "4,5 milliards d'années",
          "100 milliards d'années", "1 milliard d'années"],
  reponse: 0,
  explication: "Le chiffre vient de la mesure du fond diffus cosmologique, la plus ancienne lumière observable, émise 380 000 ans après le Big Bang."
},
{
  id: "ast-100", categorie: "astronomie", niveau: 3, type: "vrai_faux",
  question: "Une étoile à neutrons peut contenir la masse du Soleil dans une sphère d'une vingtaine de kilomètres.",
  reponse: true,
  explication: "Une cuillère à café de sa matière pèserait des centaines de millions de tonnes."
},
{
  id: "ast-101", categorie: "astronomie", niveau: 3, type: "qcm",
  question: "Que désigne l'effet Doppler appliqué à la lumière des galaxies lointaines ?",
  choix: ["Un décalage vers le rouge qui révèle leur éloignement", "Leur température de surface",
          "Leur composition chimique", "Leur âge exact"],
  reponse: 0,
  explication: "C'est la découverte de Hubble en 1929 : plus une galaxie est loin, plus elle s'éloigne vite. L'univers est en expansion."
},
{
  id: "ast-102", categorie: "astronomie", niveau: 3, type: "chronologie",
  question: "Classez ces étapes de la vie d'une étoile comme le Soleil.",
  choix: ["Nuage de gaz qui s'effondre", "Étoile de la séquence principale",
          "Géante rouge", "Naine blanche"],
  reponse: [0, 1, 2, 3],
  explication: "Le Soleil en est à mi-parcours de sa séquence principale. Devenu géante rouge, il engloutira probablement Mercure et Vénus."
},
{
  id: "ast-105", categorie: "astronomie", niveau: 3, type: "vrai_faux",
  question: "La matière ordinaire représente moins de 5 % du contenu de l'univers.",
  reponse: true,
  explication: "Le reste se répartit entre matière noire et énergie sombre, dont on ne connaît la présence que par leurs effets gravitationnels et l'expansion."
},
{
  id: "ast-106", categorie: "astronomie", niveau: 3, type: "qcm",
  question: "Quelle est l'étoile la plus proche du Soleil ?",
  choix: ["Proxima du Centaure", "Sirius", "Alpha du Centaure A", "Barnard"],
  reponse: 0,
  explication: "À 4,24 années-lumière. Avec les sondes les plus rapides jamais lancées, le voyage prendrait encore des dizaines de milliers d'années."
},
{
  id: "ast-107", categorie: "astronomie", niveau: 3, type: "qcm",
  question: "Que mesure la magnitude apparente d'une étoile ?",
  choix: ["Son éclat vu depuis la Terre", "Sa taille réelle", "Sa distance", "Sa température"],
  reponse: 0,
  explication: "L'échelle est inversée et héritée de l'Antiquité : plus le nombre est petit, plus l'astre est brillant, et les plus éclatants sont négatifs."
},
{
  id: "ast-108", categorie: "astronomie", niveau: 3, type: "vrai_faux",
  question: "Pluton est aujourd'hui classée parmi les planètes naines.",
  reponse: true,
  explication: "Reclassée en 2006 pour un critère précis : elle n'a pas fait le vide sur son orbite, qu'elle partage avec les objets de la ceinture de Kuiper."
},

{
  id: "ast-109", categorie: "astronomie", niveau: 3, type: "qcm",
  question: "Quelle sonde est devenue en 2012 le premier objet humain à quitter l'héliosphère ?",
  choix: ["Voyager 1", "Pioneer 10", "New Horizons", "Cassini"],
  reponse: 0,
  explication: "Lancée en 1977, elle emporte un disque d'or contenant sons et images de la Terre, au cas improbable où quelqu'un le trouverait."
},
{
  id: "ast-110", categorie: "astronomie", niveau: 3, type: "qcm",
  question: "Qu'est-ce qu'une exoplanète ?",
  choix: ["Une planète en orbite autour d'une autre étoile que le Soleil", "Une planète sans étoile",
          "Une planète du système solaire externe", "Une lune assez grosse pour être une planète"],
  reponse: 0,
  explication: "La première autour d'une étoile semblable au Soleil a été détectée en 1995 par deux astronomes suisses, ce qui leur a valu le prix Nobel."
}

]);
