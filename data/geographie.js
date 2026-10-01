/* =============================================================================
   GÉOGRAPHIE — 69 questions
   -----------------------------------------------------------------------------
   Conventions :
   - clic_pays   : reponse = code ISO 3166-1 numérique (chaîne, ex. "250")
   - multi_pays  : reponse = tableau de codes ISO numériques
   - distance    : reponse = [latitude, longitude] en degrés décimaux
   - chronologie : "choix" est déjà dans l'ordre chronologique et
                   "reponse" donne cet ordre ([0,1,2,3]) ; le moteur mélange
                   l'affichage au joueur.
   ============================================================================= */
window.QUESTIONS = window.QUESTIONS || [];
window.QUESTIONS.push(...[

/* ------------------------------- NIVEAU 1 --------------------------------- */
{
  id: "geo-001", categorie: "geographie", niveau: 1, type: "clic_pays",
  question: "Cliquez sur l'Italie.",
  reponse: "380",
  explication: "Sa forme de botte est si nette que les Italiens appellent couramment leur pays « lo Stivale », la botte."
},
{
  id: "geo-002", categorie: "geographie", niveau: 1, type: "qcm",
  question: "Quel est le plus long fleuve d'Afrique ?",
  choix: ["Le Nil", "Le Congo", "Le Niger", "Le Zambèze"],
  reponse: 0,
  explication: "Le Nil court sur environ 6 650 km et traverse onze pays, mais son débit est très inférieur à celui du Congo."
},
{
  id: "geo-003", categorie: "geographie", niveau: 1, type: "vrai_faux",
  question: "Le Groenland est plus grand que l'Australie.",
  reponse: false,
  explication: "Le Groenland fait 2,2 millions de km² contre 7,7 pour l'Australie : c'est la projection de Mercator qui le gonfle près du pôle."
},
{
  id: "geo-004", categorie: "geographie", niveau: 1, type: "qcm",
  question: "Quel drapeau national est un simple disque rouge centré sur fond blanc ?",
  choix: ["Japon", "Corée du Sud", "Bangladesh", "Laos"],
  reponse: 0,
  explication: "Le Hinomaru, « disque solaire », est officiel depuis 1999 seulement, alors qu'il flotte sur les navires japonais depuis 1870."
},
{
  id: "geo-005", categorie: "geographie", niveau: 1, type: "distance",
  question: "Cliquez sur l'emplacement de Paris.",
  reponse: [48.8566, 2.3522],
  explication: "Le point zéro des routes de France est scellé dans le parvis de Notre-Dame : toutes les distances routières partent de là."
},
{
  id: "geo-006", categorie: "geographie", niveau: 1, type: "qcm",
  question: "Quelle est la capitale de l'Australie ?",
  choix: ["Canberra", "Sydney", "Melbourne", "Brisbane"],
  reponse: 0,
  explication: "Canberra a été bâtie de toutes pièces en 1913 pour départager Sydney et Melbourne, qui se disputaient le titre."
},
{
  id: "geo-007", categorie: "geographie", niveau: 1, type: "multi_pays",
  question: "Sélectionnez les cinq pays d'Afrique qui bordent la mer Méditerranée.",
  reponse: ["504", "012", "788", "434", "818"],
  explication: "Maroc, Algérie, Tunisie, Libye et Égypte : les Romains appelaient cette mer « Mare Nostrum », notre mer, car ils en tenaient tout le pourtour."
},
{
  id: "geo-008", categorie: "geographie", niveau: 1, type: "clic_pays",
  question: "Cliquez sur le Brésil.",
  reponse: "076",
  explication: "Le Brésil occupe à lui seul 47 % de la superficie de l'Amérique du Sud et doit son nom à un bois de teinture, le pau-brasil."
},
{
  id: "geo-009", categorie: "geographie", niveau: 1, type: "qcm",
  question: "Quel est le plus haut sommet du monde ?",
  choix: ["L'Everest", "Le K2", "Le Kilimandjaro", "L'Aconcagua"],
  reponse: 0,
  explication: "Népal et Chine ont fixé ensemble son altitude à 8 848,86 m en 2020 : la neige sommitale avait longtemps brouillé les mesures."
},
{
  id: "geo-010", categorie: "geographie", niveau: 1, type: "vrai_faux",
  question: "L'Australie est la plus grande île du monde.",
  reponse: false,
  explication: "Par convention elle est classée comme continent, pas comme île : le titre revient au Groenland, trois fois plus petit."
},
{
  id: "geo-011", categorie: "geographie", niveau: 1, type: "qcm",
  question: "Quel pays arbore une feuille d'érable rouge entre deux bandes rouges verticales ?",
  choix: ["Canada", "Suisse", "Danemark", "Autriche"],
  reponse: 0,
  explication: "La feuille d'érable n'a été adoptée qu'en 1965, après un débat parlementaire de six mois surnommé « la grande querelle du drapeau »."
},
{
  id: "geo-012", categorie: "geographie", niveau: 1, type: "qcm",
  question: "Quel est le plus vaste océan du globe ?",
  choix: ["Le Pacifique", "L'Atlantique", "L'océan Indien", "L'océan Austral"],
  reponse: 0,
  explication: "Il couvre un tiers de la surface terrestre : toutes les terres émergées y tiendraient largement."
},
{
  id: "geo-013", categorie: "geographie", niveau: 1, type: "clic_pays",
  question: "Cliquez sur le Japon.",
  reponse: "392",
  explication: "L'archipel compte près de 14 000 îles recensées, mais quatre d'entre elles portent presque toute la population."
},
{
  id: "geo-014", categorie: "geographie", niveau: 1, type: "distance",
  question: "Cliquez sur l'emplacement du Caire.",
  reponse: [30.0444, 31.2357],
  explication: "Avec son agglomération, Le Caire dépasse 22 millions d'habitants : c'est la plus grande ville d'Afrique et du monde arabe."
},
{
  id: "geo-015", categorie: "geographie", niveau: 1, type: "qcm",
  question: "Dans quel pays se trouve le site du Machu Picchu ?",
  choix: ["Le Pérou", "Le Mexique", "La Bolivie", "Le Guatemala"],
  reponse: 0,
  explication: "Perché à 2 430 m, il est resté inconnu des conquistadors et n'a été révélé au monde qu'en 1911 par Hiram Bingham."
},
{
  id: "geo-016", categorie: "geographie", niveau: 1, type: "vrai_faux",
  question: "Le Danube traverse plus de pays que n'importe quel autre fleuve du monde.",
  reponse: true,
  explication: "Dix pays, de l'Allemagne à l'Ukraine : aucun autre fleuve n'en arrose autant."
},

/* ------------------------------- NIVEAU 2 --------------------------------- */
{
  id: "geo-017", categorie: "geographie", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le Kazakhstan.",
  reponse: "398",
  explication: "C'est le plus grand pays enclavé du monde : plus vaste que toute l'Europe occidentale, sans le moindre accès à l'océan."
},
{
  id: "geo-018", categorie: "geographie", niveau: 2, type: "qcm",
  question: "Quel pays compte le plus grand nombre de fuseaux horaires ?",
  choix: ["La France", "La Russie", "Les États-Unis", "La Chine"],
  reponse: 0,
  explication: "Grâce à ses territoires d'outre-mer, la France couvre douze fuseaux ; la Russie et les États-Unis en comptent onze."
},
{
  id: "geo-019", categorie: "geographie", niveau: 2, type: "multi_pays",
  question: "Sélectionnez les trois pays d'Amérique du Sud traversés par l'équateur.",
  reponse: ["218", "170", "076"],
  explication: "Équateur, Colombie et Brésil. Le pays qui porte le nom de la ligne n'en occupe pourtant qu'une petite portion."
},
{
  id: "geo-020", categorie: "geographie", niveau: 2, type: "distance",
  question: "Cliquez sur l'emplacement de Sydney.",
  reponse: [-33.8688, 151.2093],
  explication: "Sydney n'est pas la capitale du pays, mais son port naturel est le plus vaste du monde par la longueur de ses rives."
},
{
  id: "geo-021", categorie: "geographie", niveau: 2, type: "vrai_faux",
  question: "L'Islande compte plus d'habitants que de moutons.",
  reponse: false,
  explication: "C'est l'inverse : environ 400 000 moutons pour 390 000 habitants, et le troupeau a dépassé 800 000 têtes dans les années 1970."
},
{
  id: "geo-022", categorie: "geographie", niveau: 2, type: "qcm",
  question: "Quel est le pays le plus peuplé du monde ?",
  choix: ["L'Inde", "La Chine", "Les États-Unis", "L'Indonésie"],
  reponse: 0,
  explication: "L'Inde a dépassé la Chine en 2023, mettant fin à une domination chinoise vieille de plusieurs siècles."
},
{
  id: "geo-023", categorie: "geographie", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le pays qui possède le plus long littoral du monde.",
  reponse: "124",
  explication: "Le Canada aligne plus de 200 000 km de côtes, essentiellement grâce à son archipel arctique."
},
{
  id: "geo-024", categorie: "geographie", niveau: 2, type: "qcm",
  question: "Quel drapeau montre un globe bleu étoilé posé dans un losange jaune sur fond vert ?",
  choix: ["Brésil", "Portugal", "Nigeria", "Colombie"],
  reponse: 0,
  explication: "Le ciel étoilé représenté est celui de Rio le 15 novembre 1889, jour de la proclamation de la République."
},
{
  id: "geo-025", categorie: "geographie", niveau: 2, type: "qcm",
  question: "Quelle « mer » est en réalité le plus grand lac du monde ?",
  choix: ["La mer Caspienne", "La mer Morte", "La mer d'Aral", "La mer Noire"],
  reponse: 0,
  explication: "Fermée et sans lien avec l'océan, la Caspienne est un lac ; son statut juridique a occupé cinq États pendant vingt ans."
},
{
  id: "geo-026", categorie: "geographie", niveau: 2, type: "multi_pays",
  question: "Sélectionnez les six pays qui bordent la mer Noire.",
  reponse: ["792", "100", "642", "804", "643", "268"],
  explication: "Turquie, Bulgarie, Roumanie, Ukraine, Russie et Géorgie. Son nom viendrait des couleurs que les Turcs associaient aux points cardinaux."
},
{
  id: "geo-027", categorie: "geographie", niveau: 2, type: "distance",
  question: "Cliquez sur l'île de Pâques.",
  reponse: [-27.1127, -109.3497],
  explication: "Territoire chilien, elle est à 3 500 km du continent : c'est l'une des îles habitées les plus isolées du monde."
},
{
  id: "geo-028", categorie: "geographie", niveau: 2, type: "qcm",
  question: "Quel détroit sépare l'Europe de l'Afrique ?",
  choix: ["Le détroit de Gibraltar", "Le Bosphore", "Le détroit de Messine", "Le canal de Sicile"],
  reponse: 0,
  explication: "Seulement 14 km d'eau : par temps clair, on distingue le Maroc depuis les plages espagnoles."
},
{
  id: "geo-029", categorie: "geographie", niveau: 2, type: "vrai_faux",
  question: "Le sommet le plus éloigné du centre de la Terre n'est pas l'Everest.",
  reponse: true,
  explication: "C'est le Chimborazo, en Équateur : le renflement équatorial de la Terre lui donne 2 km d'avance sur l'Everest."
},
{
  id: "geo-030", categorie: "geographie", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le Chili.",
  reponse: "152",
  explication: "Long de 4 300 km pour 177 km de large en moyenne, il s'étend du désert le plus sec du monde aux glaciers de Patagonie."
},
{
  id: "geo-031", categorie: "geographie", niveau: 2, type: "qcm",
  question: "Quel est le plus grand lac d'Afrique par la superficie ?",
  choix: ["Le lac Victoria", "Le lac Tanganyika", "Le lac Tchad", "Le lac Malawi"],
  reponse: 0,
  explication: "Grand comme l'Irlande, il est partagé par la Tanzanie, l'Ouganda et le Kenya, et alimente le Nil Blanc."
},
{
  id: "geo-032", categorie: "geographie", niveau: 2, type: "vrai_faux",
  question: "Le Sahara est le plus grand désert du monde.",
  reponse: false,
  explication: "Un désert se définit par ses précipitations : l'Antarctique, désert polaire, est près d'une fois et demie plus vaste."
},

/* ------------------------------- NIVEAU 3 --------------------------------- */
{
  id: "geo-033", categorie: "geographie", niveau: 3, type: "clic_pays",
  question: "Cliquez sur l'un des deux seuls pays doublement enclavés du monde (celui d'Asie centrale).",
  reponse: "860",
  explication: "L'Ouzbékistan n'a pour voisins que des pays eux-mêmes sans accès à la mer ; l'autre cas est le Liechtenstein."
},
{
  id: "geo-034", categorie: "geographie", niveau: 3, type: "multi_pays",
  question: "Sélectionnez les cinq républiques d'Asie centrale issues de l'URSS.",
  reponse: ["398", "860", "795", "417", "762"],
  explication: "Kazakhstan, Ouzbékistan, Turkménistan, Kirghizistan et Tadjikistan : leurs frontières ont été tracées par Moscou dans les années 1920."
},
{
  id: "geo-035", categorie: "geographie", niveau: 3, type: "distance",
  question: "Cliquez sur l'emplacement d'Oulan-Bator.",
  reponse: [47.8864, 106.9057],
  explication: "Avec une moyenne annuelle proche de -1 °C, c'est la capitale nationale la plus froide du monde."
},
{
  id: "geo-036", categorie: "geographie", niveau: 3, type: "qcm",
  question: "Quel est le point le plus bas des terres émergées ?",
  choix: ["Les rives de la mer Morte", "La vallée de la Mort", "La dépression de Qattara", "Le lac Assal"],
  reponse: 0,
  explication: "Environ 430 m sous le niveau de la mer, et le niveau baisse encore d'un mètre par an à cause des prélèvements du Jourdain."
},
{
  id: "geo-037", categorie: "geographie", niveau: 3, type: "vrai_faux",
  question: "Aucun pont ne franchit le cours principal de l'Amazone.",
  reponse: true,
  explication: "Le fleuve traverse surtout la forêt, sans route à relier ; le pont de Manaus enjambe un affluent, le rio Negro."
},
{
  id: "geo-038", categorie: "geographie", niveau: 3, type: "clic_pays",
  question: "Cliquez sur le pays d'Afrique qui n'a jamais été durablement colonisé.",
  reponse: "231",
  explication: "L'Éthiopie a écrasé l'armée italienne à Adoua en 1896 ; l'occupation de 1936-1941 n'a duré que cinq ans."
},
{
  id: "geo-039", categorie: "geographie", niveau: 3, type: "qcm",
  question: "Quel désert est considéré comme le plus aride du monde ?",
  choix: ["L'Atacama", "Le Namib", "Le Gobi", "Le Rub al-Khali"],
  reponse: 0,
  explication: "Certaines de ses stations n'ont jamais enregistré la moindre pluie ; la NASA y teste ses rovers martiens."
},
{
  id: "geo-040", categorie: "geographie", niveau: 3, type: "qcm",
  question: "Quel est le seul drapeau national au monde à ne pas être rectangulaire ?",
  choix: ["Népal", "Bhoutan", "Sri Lanka", "Mongolie"],
  reponse: 0,
  explication: "Ses deux fanions superposés représentent l'Himalaya ; sa construction géométrique est décrite dans la Constitution."
},
{
  id: "geo-041", categorie: "geographie", niveau: 3, type: "distance",
  question: "Cliquez sur le point Nemo, le lieu océanique le plus éloigné de toute terre.",
  reponse: [-48.8767, -123.3933],
  explication: "La terre la plus proche est à 2 688 km : les humains les plus proches sont souvent ceux de la Station spatiale internationale."
},
{
  id: "geo-042", categorie: "geographie", niveau: 3, type: "qcm",
  question: "Combien de pays le Brésil a-t-il pour voisins ?",
  choix: ["10", "7", "8", "12"],
  reponse: 0,
  explication: "Il touche tous les pays d'Amérique du Sud sauf deux : le Chili et l'Équateur."
},
{
  id: "geo-043", categorie: "geographie", niveau: 3, type: "multi_pays",
  question: "Sélectionnez les deux pays d'Amérique du Sud qui ne partagent pas de frontière avec le Brésil.",
  reponse: ["152", "218"],
  explication: "Le Chili et l'Équateur sont coupés du Brésil par la cordillère des Andes et par le bloc Pérou-Colombie."
},
{
  id: "geo-044", categorie: "geographie", niveau: 3, type: "qcm",
  question: "Quel est le plus petit État du monde par la superficie ?",
  choix: ["Le Vatican", "Monaco", "Nauru", "Saint-Marin"],
  reponse: 0,
  explication: "0,44 km² : on en fait le tour à pied en une demi-heure, et il tiendrait huit fois dans Central Park."
}

]);

/* ------------------------- EXTENSION : 10 questions ------------------------ */
window.QUESTIONS.push(...[

{
  id: "geo-045", categorie: "geographie", niveau: 1, type: "qcm",
  question: "Quelle est la capitale du Canada ?",
  choix: ["Ottawa", "Toronto", "Montréal", "Vancouver"],
  reponse: 0,
  explication: "La reine Victoria l'a désignée en 1857 pour départager Toronto et Montréal, et parce qu'elle était plus à l'écart de la frontière américaine."
},
{
  id: "geo-046", categorie: "geographie", niveau: 1, type: "clic_pays",
  question: "Cliquez sur l'Inde.",
  reponse: "356",
  explication: "Son nom vient de l'Indus, fleuve qui coule aujourd'hui presque entièrement au Pakistan."
},
{
  id: "geo-047", categorie: "geographie", niveau: 1, type: "vrai_faux",
  question: "Le Canada est le plus grand pays du monde par la superficie.",
  reponse: false,
  explication: "Il n'est que deuxième : la Russie couvre 17,1 millions de km², soit près du double, et 11 % de toutes les terres émergées."
},
{
  id: "geo-048", categorie: "geographie", niveau: 1, type: "distance",
  question: "Cliquez sur l'emplacement de New York.",
  reponse: [40.7128, -74.0060],
  explication: "La ville a été la première capitale des États-Unis : George Washington y a prêté serment en 1789, à Federal Hall, sur Wall Street."
},
{
  id: "geo-049", categorie: "geographie", niveau: 2, type: "multi_pays",
  question: "Sélectionnez les cinq voisins de la Chine dont le nom se termine par « -stan ».",
  reponse: ["398", "417", "762", "004", "586"],
  explication: "Kazakhstan, Kirghizistan, Tadjikistan, Afghanistan et Pakistan. La frontière afghane ne mesure que 76 km, au bout du corridor de Wakhan."
},
{
  id: "geo-050", categorie: "geographie", niveau: 2, type: "clic_pays",
  question: "Cliquez sur l'Indonésie.",
  reponse: "360",
  explication: "Plus de 17 000 îles et trois fuseaux horaires : c'est aussi le pays comptant le plus de musulmans au monde."
},
{
  id: "geo-051", categorie: "geographie", niveau: 2, type: "distance",
  question: "Cliquez sur l'emplacement du Cap.",
  reponse: [-33.9249, 18.4241],
  explication: "L'Afrique du Sud a trois capitales : Le Cap pour le Parlement, Pretoria pour le gouvernement, Bloemfontein pour la justice."
},
{
  id: "geo-052", categorie: "geographie", niveau: 2, type: "qcm",
  question: "Quel drapeau national compte six couleurs, un record, réparties autour d'un Y couché ?",
  choix: ["Afrique du Sud", "Kenya", "Ghana", "Zambie"],
  reponse: 0,
  explication: "Six couleurs, un record parmi les drapeaux nationaux. Dessiné en une semaine, il a été adopté pour les élections de 1994."
},
{
  id: "geo-053", categorie: "geographie", niveau: 3, type: "qcm",
  question: "Quelle mer intérieure a perdu l'essentiel de sa surface depuis les années 1960 ?",
  choix: ["La mer d'Aral", "La mer Caspienne", "Le lac Baïkal", "La mer de Marmara"],
  reponse: 0,
  explication: "L'Amou-Daria et le Syr-Daria ont été détournés pour irriguer le coton ; des chalutiers rouillent aujourd'hui en plein désert."
},
{
  id: "geo-054", categorie: "geographie", niveau: 3, type: "vrai_faux",
  question: "Mesurée de sa base à son sommet, la plus haute montagne du monde n'est pas l'Everest.",
  reponse: true,
  explication: "Le Mauna Kea, à Hawaï, culmine à 4 207 m au-dessus de l'eau mais à plus de 10 000 m au-dessus du plancher océanique."
}

]);

/* ------------------------- EXTENSION : 15 questions ------------------------ */
window.QUESTIONS.push(...[

{
  id: "geo-055", categorie: "geographie", niveau: 1, type: "qcm",
  question: "Dans quel pays se trouve la ville de Tombouctou ?",
  choix: ["Le Mali", "Le Niger", "Le Tchad", "La Mauritanie"],
  reponse: 0,
  explication: "Grand foyer de savoir au XVe siècle, elle abritait des dizaines de milliers de manuscrits, dont beaucoup ont été évacués clandestinement en 2012."
},
{
  id: "geo-056", categorie: "geographie", niveau: 1, type: "clic_pays",
  question: "Cliquez sur l'Égypte.",
  reponse: "818",
  explication: "Près de 95 % des Égyptiens vivent sur 5 % du territoire, le long du Nil et de son delta ; le reste est désert."
},
{
  id: "geo-057", categorie: "geographie", niveau: 1, type: "vrai_faux",
  question: "Le lac Baïkal contient à lui seul environ un cinquième de l'eau douce de surface non gelée de la planète.",
  reponse: true,
  explication: "Il est aussi le plus profond du monde, 1 642 m, et abrite un phoque d'eau douce qu'on ne trouve nulle part ailleurs."
},
{
  id: "geo-058", categorie: "geographie", niveau: 1, type: "qcm",
  question: "Quelle chaîne de montagnes marque traditionnellement la limite entre l'Europe et l'Asie ?",
  choix: ["L'Oural", "Le Caucase", "Les Carpates", "L'Altaï"],
  reponse: 0,
  explication: "Une frontière de convention : elle a été proposée au XVIIIe siècle par un géographe suédois au service du tsar."
},
{
  id: "geo-059", categorie: "geographie", niveau: 1, type: "distance",
  question: "Cliquez sur l'emplacement d'Istanbul.",
  reponse: [41.0082, 28.9784],
  explication: "Trois ponts et deux tunnels relient ses rives européenne et asiatique, séparées par le détroit du Bosphore."
},
{
  id: "geo-060", categorie: "geographie", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le pays le moins densément peuplé du monde.",
  reponse: "496",
  explication: "La Mongolie compte environ deux habitants au kilomètre carré, et près de la moitié de sa population vit dans sa seule capitale."
},
{
  id: "geo-061", categorie: "geographie", niveau: 2, type: "qcm",
  question: "Quel pays possède le plus grand nombre de lacs au monde ?",
  choix: ["Le Canada", "La Finlande", "La Russie", "La Suède"],
  reponse: 0,
  explication: "Plus de deux millions de lacs, soit une large majorité des lacs de la planète, hérités du recul des glaciers."
},
{
  id: "geo-062", categorie: "geographie", niveau: 2, type: "multi_pays",
  question: "Sélectionnez les trois pays riverains du lac Victoria.",
  reponse: ["834", "800", "404"],
  explication: "Tanzanie, Ouganda et Kenya. Le lac a été baptisé en 1858 par l'explorateur Speke, en l'honneur de la reine d'Angleterre."
},
{
  id: "geo-063", categorie: "geographie", niveau: 2, type: "vrai_faux",
  question: "Le Kilimandjaro est un massif rocheux sans origine volcanique.",
  reponse: false,
  explication: "C'est un stratovolcan endormi à trois cônes, dont la calotte glaciaire a perdu plus de 80 % de sa surface en un siècle."
},
{
  id: "geo-064", categorie: "geographie", niveau: 2, type: "distance",
  question: "Cliquez sur l'emplacement de Reykjavik.",
  reponse: [64.1466, -21.9426],
  explication: "Capitale d'État souverain la plus septentrionale du monde, chauffée presque entièrement par la géothermie."
},
{
  id: "geo-065", categorie: "geographie", niveau: 3, type: "qcm",
  question: "Quel fleuve possède le plus fort débit du monde ?",
  choix: ["L'Amazone", "Le Congo", "Le Yangzi Jiang", "L'Orénoque"],
  reponse: 0,
  explication: "Environ 209 000 m³ par seconde, soit davantage que les sept fleuves suivants réunis ; son panache d'eau douce se détecte à 300 km au large."
},
{
  id: "geo-066", categorie: "geographie", niveau: 3, type: "clic_pays",
  question: "Cliquez sur le pays où le Gange se jette dans la mer.",
  reponse: "050",
  explication: "Le delta du Gange et du Brahmapoutre, au Bangladesh, est le plus vaste du monde : environ 100 000 km²."
},
{
  id: "geo-067", categorie: "geographie", niveau: 3, type: "multi_pays",
  question: "Sélectionnez les six pays traversés par le Mékong.",
  reponse: ["156", "104", "418", "764", "116", "704"],
  explication: "De la Chine au Viêt Nam, il traverse aussi la Birmanie, le Laos, la Thaïlande et le Cambodge : son delta nourrit des dizaines de millions de personnes."
},
{
  id: "geo-068", categorie: "geographie", niveau: 3, type: "vrai_faux",
  question: "Le Vatican et Saint-Marin sont les deux seuls États entièrement enclavés dans un autre pays.",
  reponse: false,
  explication: "Ils sont trois : il faut y ajouter le Lesotho, entièrement entouré par l'Afrique du Sud."
},
{
  id: "geo-069", categorie: "geographie", niveau: 3, type: "distance",
  question: "Cliquez sur le cap Horn.",
  reponse: [-55.9833, -67.2667],
  explication: "Le passage le plus redouté des marins : les vents y contournent la planète sans rencontrer de terre, d'où des creux énormes."
}

]);

/* =============================================================================
   GÉOGRAPHIE — deuxième série (40 questions)
   ============================================================================= */
window.QUESTIONS.push(...[

/* ------------------------------- NIVEAU 1 --------------------------------- */
{
  id: "geo-072", categorie: "geographie", niveau: 1, type: "vrai_faux",
  question: "Le Sahara est le plus grand désert chaud du monde.",
  reponse: true,
  explication: "9 millions de km², presque la taille des États-Unis. Mais le plus grand désert tous types confondus est l'Antarctique, où il ne pleut quasiment jamais."
},
{
  id: "geo-073", categorie: "geographie", niveau: 1, type: "qcm",
  question: "Quelle est la capitale du Japon ?",
  choix: ["Tokyo", "Kyoto", "Osaka", "Yokohama"],
  reponse: 0,
  explication: "Kyoto l'a été pendant plus de mille ans. Le nom Tokyo signifie « capitale de l'est » : la ville a pris le titre en 1868, quand l'empereur s'y est installé."
},
{
  id: "geo-074", categorie: "geographie", niveau: 1, type: "distance",
  question: "Cliquez sur l'emplacement de Londres.",
  reponse: [51.5074, -0.1278],
  explication: "Le méridien de Greenwich, origine des longitudes depuis 1884, traverse sa banlieue est. La France a continué d'utiliser celui de Paris jusqu'en 1911."
},
{
  id: "geo-075", categorie: "geographie", niveau: 1, type: "qcm",
  question: "Quel pays a la plus grande superficie du monde ?",
  choix: ["La Russie", "Le Canada", "La Chine", "Les États-Unis"],
  reponse: 0,
  explication: "17 millions de km², soit 11 % des terres émergées. Elle reste plus vaste que Pluton."
},
{
  id: "geo-076", categorie: "geographie", niveau: 1, type: "vrai_faux",
  question: "L'Everest se dresse à la frontière entre le Népal et la Chine.",
  reponse: true,
  explication: "Son sommet est exactement sur la ligne : on peut l'atteindre par la face sud népalaise ou par la face nord tibétaine."
},
{
  id: "geo-079", categorie: "geographie", niveau: 1, type: "chronologie",
  question: "Classez ces cours d'eau du plus court au plus long.",
  choix: ["La Seine", "La Loire", "Le Danube", "Le Nil"],
  reponse: [0, 1, 2, 3],
  explication: "777 km, 1 006 km, 2 850 km et environ 6 650 km. La Loire est le plus long fleuve de France, loin devant la Seine."
},
{
  id: "geo-080", categorie: "geographie", niveau: 1, type: "qcm",
  question: "Quelle est la plus haute chute d'eau du monde ?",
  choix: ["Le Salto Ángel", "Les chutes Victoria", "Les chutes du Niagara", "Les chutes d'Iguazú"],
  reponse: 0,
  explication: "979 m au Venezuela, soit près de trois tours Eiffel. L'eau se pulvérise en brouillard avant même d'atteindre le sol."
},
{
  id: "geo-081", categorie: "geographie", niveau: 1, type: "vrai_faux",
  question: "Le lac Baïkal est le lac le plus profond du monde.",
  reponse: true,
  explication: "1 642 m de fond. Il contient à lui seul un cinquième de l'eau douce liquide non gelée de la planète."
},
{
  id: "geo-082", categorie: "geographie", niveau: 1, type: "qcm",
  question: "Dans quel plan d'eau flotte-t-on sans le moindre effort, tant il est salé ?",
  choix: ["La mer Morte", "La mer Rouge", "La mer Caspienne", "La mer Noire"],
  reponse: 0,
  explication: "Dix fois plus salée que l'océan. Rien n'y vit, d'où son nom, et son niveau baisse d'environ un mètre par an."
},
{
  id: "geo-083", categorie: "geographie", niveau: 1, type: "multi_pays",
  question: "Sélectionnez les trois pays baltes.",
  reponse: ["233", "428", "440"],
  explication: "Estonie, Lettonie et Lituanie. En 1989, deux millions d'habitants se sont donné la main sur 600 km pour réclamer leur indépendance de l'URSS."
},

/* ------------------------------- NIVEAU 2 --------------------------------- */
{
  id: "geo-086", categorie: "geographie", niveau: 2, type: "vrai_faux",
  question: "Le Groenland est un territoire autonome rattaché au Danemark.",
  reponse: true,
  explication: "Il a quitté la Communauté européenne en 1985, après un référendum portant surtout sur les quotas de pêche : un départ unique en son genre."
},
{
  id: "geo-087", categorie: "geographie", niveau: 2, type: "qcm",
  question: "Quel est le plus grand désert du monde, toutes catégories confondues ?",
  choix: ["L'Antarctique", "Le Sahara", "Le désert de Gobi", "Le désert d'Arabie"],
  reponse: 0,
  explication: "Un désert se définit par l'absence de précipitations, pas par la chaleur : il tombe moins d'eau au pôle Sud qu'au Sahara."
},
{
  id: "geo-088", categorie: "geographie", niveau: 2, type: "distance",
  question: "Cliquez sur l'emplacement du Cap, en Afrique du Sud.",
  reponse: [-33.9249, 18.4241],
  explication: "Contrairement à une idée répandue, ce n'est pas la pointe sud de l'Afrique : le cap des Aiguilles, 150 km plus à l'est, descend plus bas."
},
{
  id: "geo-091", categorie: "geographie", niveau: 2, type: "chronologie",
  question: "Classez ces villes de la plus occidentale à la plus orientale.",
  choix: ["New York", "Londres", "Moscou", "Tokyo"],
  reponse: [0, 1, 2, 3],
  explication: "74° ouest, 0°, 37° est et 139° est. Tokyo a quatorze heures d'avance sur New York."
},
{
  id: "geo-092", categorie: "geographie", niveau: 2, type: "qcm",
  question: "Quel pays possède la plus longue façade maritime du monde ?",
  choix: ["Le Canada", "La Russie", "L'Indonésie", "L'Australie"],
  reponse: 0,
  explication: "Plus de 200 000 km, soit cinq fois le tour de la Terre : ses dizaines de milliers d'îles arctiques déchiquetées font exploser le compte."
},
{
  id: "geo-093", categorie: "geographie", niveau: 2, type: "vrai_faux",
  question: "Le canal de Panama relie l'Atlantique au Pacifique.",
  reponse: true,
  explication: "Les navires y sont hissés 26 m au-dessus du niveau de la mer par des écluses, puis redescendus : on ne traverse pas à plat."
},
{
  id: "geo-094", categorie: "geographie", niveau: 2, type: "clic_pays",
  question: "Cliquez sur la Turquie.",
  reponse: "792",
  explication: "Le Bosphore, large de 700 m à son point le plus étroit, sépare la partie européenne de la partie asiatique du pays."
},
{
  id: "geo-095", categorie: "geographie", niveau: 2, type: "qcm",
  question: "Quelle est la capitale de la Nouvelle-Zélande ?",
  choix: ["Wellington", "Auckland", "Christchurch", "Dunedin"],
  reponse: 0,
  explication: "Auckland est trois fois plus peuplée, mais la capitale a été déplacée vers le sud en 1865 pour rapprocher le gouvernement de l'île du Sud."
},
{
  id: "geo-096", categorie: "geographie", niveau: 2, type: "qcm",
  question: "Quel fleuve traverse Bagdad ?",
  choix: ["Le Tigre", "L'Euphrate", "Le Jourdain", "L'Indus"],
  reponse: 0,
  explication: "Le Tigre et l'Euphrate encadrent la Mésopotamie, « le pays entre les fleuves », où sont nées les premières villes."
},
{
  id: "geo-097", categorie: "geographie", niveau: 2, type: "vrai_faux",
  question: "L'Australie est à la fois un pays et un continent.",
  reponse: true,
  explication: "C'est aussi la plus grande île du monde si on la compte comme telle, et le seul continent gouverné par un État unique."
},

/* ------------------------------- NIVEAU 3 --------------------------------- */
{
  id: "geo-099", categorie: "geographie", niveau: 3, type: "qcm",
  question: "Quelle est la capitale constitutionnelle de la Bolivie ?",
  choix: ["Sucre", "La Paz", "Santa Cruz", "Cochabamba"],
  reponse: 0,
  explication: "Sucre abrite la Cour suprême, mais le gouvernement et le Parlement siègent à La Paz : le pays a deux capitales de fait."
},
{
  id: "geo-101", categorie: "geographie", niveau: 3, type: "vrai_faux",
  question: "Le Vatican est le plus petit État souverain du monde.",
  reponse: true,
  explication: "44 hectares, soit moins qu'un grand parc urbain. On peut en faire le tour à pied en une demi-heure."
},
{
  id: "geo-102", categorie: "geographie", niveau: 3, type: "qcm",
  question: "Quel pays contient deux États indépendants entièrement enclavés sur son territoire ?",
  choix: ["L'Italie", "L'Espagne", "La France", "L'Afrique du Sud"],
  reponse: 0,
  explication: "Le Vatican et Saint-Marin. L'Afrique du Sud n'en enclave qu'un seul, le Lesotho."
},
{
  id: "geo-103", categorie: "geographie", niveau: 3, type: "multi_pays",
  question: "Sélectionnez les quatre pays riverains du lac Tchad.",
  reponse: ["148", "562", "566", "120"],
  explication: "Tchad, Niger, Nigéria et Cameroun. Le lac a perdu environ 90 % de sa surface depuis les années 1960."
},
{
  id: "geo-106", categorie: "geographie", niveau: 3, type: "chronologie",
  question: "Classez ces sommets du plus bas au plus haut.",
  choix: ["Le mont Blanc", "Le Kilimandjaro", "L'Aconcagua", "L'Everest"],
  reponse: [0, 1, 2, 3],
  explication: "4 808 m, 5 895 m, 6 961 m et 8 849 m. L'Aconcagua est le plus haut sommet hors d'Asie."
},
{
  id: "geo-107", categorie: "geographie", niveau: 3, type: "vrai_faux",
  question: "La ligne de changement de date suit exactement le 180e méridien.",
  reponse: false,
  explication: "Elle zigzague pour éviter de couper un pays en deux dates différentes. Les Kiribati l'ont fait dévier de 2 000 km en 1995 pour unifier leurs îles."
},
{
  id: "geo-108", categorie: "geographie", niveau: 3, type: "qcm",
  question: "Combien de pays l'Afrique compte-t-elle ?",
  choix: ["54", "48", "60", "45"],
  reponse: 0,
  explication: "Le dernier né est le Soudan du Sud, indépendant en 2011. C'est le continent qui compte le plus d'États."
},
{
  id: "geo-109", categorie: "geographie", niveau: 3, type: "qcm",
  question: "Quel est le pays le plus peuplé d'Afrique ?",
  choix: ["Le Nigéria", "L'Égypte", "L'Éthiopie", "L'Afrique du Sud"],
  reponse: 0,
  explication: "Plus de 200 millions d'habitants, dont la moitié a moins de 19 ans. Le pays compte plus de 500 langues vivantes."
}

]);

/* ================== GÉOGRAPHIE et ASTRONOMIE — ordres de grandeur ========== */
window.QUESTIONS.push(...[
{
  id: "geo-150", categorie: "geographie", niveau: 1, type: "grandeur",
  question: "Quelle est l'altitude de l'Everest ?",
  reponse: 8849, unite: "m", min: 500, max: 100000,
  explication: "8 848,86 m depuis le relevé conjoint sino-népalais de 2020. La montagne gagne quelques millimètres par an."
},
{
  id: "geo-151", categorie: "geographie", niveau: 2, type: "grandeur",
  question: "Quelle est la longueur du Nil ?",
  reponse: 6650, unite: "km", min: 200, max: 100000,
  explication: "Sa source exacte reste discutée, ce qui explique que le titre de plus long fleuve du monde lui soit parfois contesté par l'Amazone."
},
{
  id: "geo-152", categorie: "geographie", niveau: 2, type: "grandeur",
  question: "Quelle est la superficie de la France métropolitaine ?",
  reponse: 551500, unite: "km²", min: 10000, max: 20000000,
  explication: "Avec l'outre-mer, le pays dépasse 643 000 km². Sa zone maritime, elle, est la deuxième du monde."
},
{
  id: "geo-153", categorie: "geographie", niveau: 3, type: "grandeur",
  question: "Quelle profondeur atteint la fosse des Mariannes ?",
  reponse: 10984, unite: "m", min: 500, max: 200000,
  explication: "L'Everest y tiendrait tout entier avec plus de deux kilomètres d'eau au-dessus de son sommet."
}
]);
