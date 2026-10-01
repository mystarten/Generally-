/* =============================================================================
   SPORT — 70 questions
   -----------------------------------------------------------------------------
   Parti pris identique à data/politique.js : des règles, des dates et des
   records figés plutôt que de l'actualité. Aucune question ne porte sur « qui
   est champion en ce moment » ni sur un record susceptible de tomber la saison
   prochaine : ces réponses se périment et rendraient la banque fausse.

   Conventions identiques à data/geographie.js :
   - qcm / drapeau : la bonne réponse est toujours en première position
                     (reponse: 0), le moteur mélange l'affichage au joueur
   - clic_pays     : reponse = code ISO 3166-1 numérique (chaîne)
   - multi_pays    : reponse = tableau de codes ISO numériques
   - distance      : reponse = [latitude, longitude] en degrés décimaux
   - chronologie   : « choix » est déjà dans le bon ordre et « reponse » donne
                     cet ordre ([0,1,2,3]) ; le moteur mélange l'affichage.
   ============================================================================= */
window.QUESTIONS = window.QUESTIONS || [];
window.QUESTIONS.push(...[

/* ------------------------------- NIVEAU 1 --------------------------------- */
{
  id: "spo-001", categorie: "sport", niveau: 1, type: "qcm",
  question: "Combien de joueurs une équipe de football aligne-t-elle sur le terrain ?",
  choix: ["11", "10", "12", "9"],
  reponse: 0,
  explication: "Gardien compris. Le chiffre est fixé depuis 1897 et n'a jamais bougé, alors que presque toutes les autres règles ont été réécrites depuis."
},
{
  id: "spo-002", categorie: "sport", niveau: 1, type: "vrai_faux",
  question: "Les Jeux olympiques d'été ont lieu tous les quatre ans.",
  reponse: true,
  explication: "Cet intervalle, l'olympiade, est repris de la Grèce antique. Seules les deux guerres mondiales l'ont rompu : les Jeux de 1916, 1940 et 1944 n'ont jamais eu lieu."
},
{
  id: "spo-003", categorie: "sport", niveau: 1, type: "qcm",
  question: "Quelle est la durée réglementaire d'un match de football ?",
  choix: ["90 minutes", "80 minutes", "100 minutes", "120 minutes"],
  reponse: 0,
  explication: "Deux mi-temps de 45 minutes. Le chronomètre ne s'arrête jamais : c'est l'arbitre qui décide seul du temps additionnel, sans avoir à le justifier."
},
{
  id: "spo-004", categorie: "sport", niveau: 1, type: "qcm",
  question: "Dans quel sport frappe-t-on un volant ?",
  choix: ["Le badminton", "Le tennis de table", "Le squash", "Le tennis"],
  reponse: 0,
  explication: "Le volant quitte la raquette à plus de 400 km/h mais freine si brutalement qu'il retombe presque à la verticale : aucun autre projectile de raquette ne décélère autant."
},
{
  id: "spo-005", categorie: "sport", niveau: 1, type: "qcm",
  question: "Combien de joueurs compte une équipe de rugby à XV sur le terrain ?",
  choix: ["15", "13", "11", "18"],
  reponse: 0,
  explication: "Huit avants et sept arrières. Le rugby à XIII s'en est séparé en 1895 pour une question d'argent, pas de règles : les clubs du nord de l'Angleterre voulaient indemniser leurs joueurs ouvriers."
},
{
  id: "spo-006", categorie: "sport", niveau: 1, type: "vrai_faux",
  question: "Le Tour de France se déroule uniquement sur le territoire français.",
  reponse: false,
  explication: "Il franchit une frontière presque chaque année, et le Grand Départ a été donné de l'étranger plus de vingt fois : Amsterdam, Londres, Copenhague, Bilbao..."
},
{
  id: "spo-007", categorie: "sport", niveau: 1, type: "qcm",
  question: "De quelle couleur est le maillot du leader du Tour de France ?",
  choix: ["Jaune", "Vert", "Blanc", "Rouge"],
  reponse: 0,
  explication: "Apparu en 1919 sur les épaules d'Eugène Christophe. Le jaune n'a rien de symbolique : c'était la couleur du papier de L'Auto, le journal qui organisait la course."
},
{
  id: "spo-008", categorie: "sport", niveau: 1, type: "qcm",
  question: "Combien de trous compte un parcours de golf complet ?",
  choix: ["18", "16", "20", "24"],
  reponse: 0,
  explication: "Saint Andrews en comptait 22 et les a ramenés à 18 en 1764 en fusionnant les trous trop courts. Le monde entier a copié ce chiffre né d'un simple remaniement local."
},
{
  id: "spo-009", categorie: "sport", niveau: 1, type: "vrai_faux",
  question: "Un marathon mesure 42,195 km.",
  reponse: true,
  explication: "Distance figée en 1921 d'après le tracé de Londres 1908, rallongé de quelques centaines de mètres pour que l'arrivée tombe pile devant la loge royale."
},
{
  id: "spo-010", categorie: "sport", niveau: 1, type: "qcm",
  question: "Dans quel sport décerne-t-on le Ballon d'or ?",
  choix: ["Le football", "Le basket-ball", "Le handball", "Le volley-ball"],
  reponse: 0,
  explication: "Créé en 1956 par le magazine France Football. Le premier lauréat, l'Anglais Stanley Matthews, avait 41 ans."
},
{
  id: "spo-011", categorie: "sport", niveau: 1, type: "clic_pays",
  question: "Cliquez sur le pays où se dispute le tournoi de tennis de Wimbledon.",
  reponse: "826",
  explication: "Créé en 1877, c'est le plus ancien tournoi de tennis du monde et le seul des quatre grands encore joué sur gazon."
},
{
  id: "spo-012", categorie: "sport", niveau: 1, type: "qcm",
  question: "Combien de joueurs une équipe de volley-ball aligne-t-elle sur le terrain ?",
  choix: ["6", "5", "7", "8"],
  reponse: 0,
  explication: "Ils tournent d'une position à chaque service gagné : c'est cette rotation qui oblige chacun à passer au filet comme en fond de court."
},
{
  id: "spo-013", categorie: "sport", niveau: 1, type: "vrai_faux",
  question: "Un match de NBA se joue en quatre quart-temps.",
  reponse: true,
  explication: "Quatre fois douze minutes, soit 48 minutes de jeu, contre 40 pour les règles internationales de la FIBA."
},
{
  id: "spo-014", categorie: "sport", niveau: 1, type: "qcm",
  question: "Dans quel pays le judo a-t-il été créé ?",
  choix: ["Le Japon", "La Chine", "La Corée du Sud", "La Thaïlande"],
  reponse: 0,
  explication: "Jigoro Kano le fonde en 1882 en retirant du jujitsu les prises les plus dangereuses : il voulait un art martial praticable à pleine intensité sans se blesser."
},
{
  id: "spo-015", categorie: "sport", niveau: 1, type: "distance",
  question: "Cliquez sur la ville qui a accueilli les premiers Jeux olympiques modernes, en 1896.",
  reponse: [37.9838, 23.7275],
  explication: "Athènes. Quatorze nations et environ 240 athlètes, tous des hommes : les femmes ne seront admises qu'à Paris, quatre ans plus tard."
},
{
  id: "spo-016", categorie: "sport", niveau: 1, type: "chronologie",
  question: "Classez ces compétitions par ordre de création.",
  choix: ["Le tournoi de Wimbledon", "Le Tour de France", "La Coupe du monde de football", "Le championnat du monde de Formule 1"],
  reponse: [0, 1, 2, 3],
  explication: "1877, 1903, 1930, 1950. Wimbledon est plus ancien que l'automobile elle-même."
},
{
  id: "spo-017", categorie: "sport", niveau: 1, type: "qcm",
  question: "Combien de points vaut un essai au rugby à XV ?",
  choix: ["5 points", "3 points", "4 points", "7 points"],
  reponse: 0,
  explication: "Il n'en valait que 3 jusqu'en 1971, puis 4, et 5 depuis 1992 : à chaque hausse, les instances cherchaient à décourager le jeu au pied."
},
{
  id: "spo-018", categorie: "sport", niveau: 1, type: "vrai_faux",
  question: "Le tournoi de Roland-Garros se joue sur terre battue.",
  reponse: true,
  explication: "La « terre » est en réalité de la brique pilée : quelques millimètres de poudre rouge étalés sur plusieurs couches de calcaire et de mâchefer."
},
{
  id: "spo-019", categorie: "sport", niveau: 1, type: "qcm",
  question: "Combien de joueurs une équipe de handball aligne-t-elle sur le terrain ?",
  choix: ["7", "6", "5", "9"],
  reponse: 0,
  explication: "Six joueurs de champ et un gardien. Le handball s'est d'abord joué à onze en plein air ; la version en salle à sept l'a supplanté après 1936."
},
{
  id: "spo-020", categorie: "sport", niveau: 1, type: "multi_pays",
  question: "Sélectionnez les deux pays qui ont disputé la finale de la première Coupe du monde de football, en 1930.",
  reponse: ["858", "032"],
  explication: "L'Uruguay bat l'Argentine 4-2 à Montevideo. Les deux équipes ne s'accordant pas sur le ballon, on a joué la première mi-temps avec celui des Argentins et la seconde avec celui des Uruguayens."
},
{
  id: "spo-021", categorie: "sport", niveau: 1, type: "qcm",
  question: "Qui est à l'origine des Jeux olympiques modernes ?",
  choix: ["Pierre de Coubertin", "Jules Rimet", "Henri Desgrange", "Paavo Nurmi"],
  reponse: 0,
  explication: "Il pensait d'abord à l'école plutôt qu'au sport : il voyait dans l'exercice physique à l'anglaise un remède à la défaite française de 1870."
},
{
  id: "spo-022", categorie: "sport", niveau: 1, type: "vrai_faux",
  question: "Le drapeau olympique porte cinq anneaux entrelacés.",
  reponse: true,
  explication: "Dessinés par Coubertin en 1913. Les six couleurs employées, fond blanc compris, suffisaient à reconstituer le drapeau de n'importe quel pays de l'époque."
},
{
  id: "spo-023", categorie: "sport", niveau: 1, type: "qcm",
  question: "Quel sport a rendu Michael Jordan célèbre ?",
  choix: ["Le basket-ball", "Le baseball", "Le football américain", "Le golf"],
  reponse: 0,
  explication: "Six titres NBA avec Chicago. Il a interrompu sa carrière en 1993 pour tenter le baseball professionnel, où il n'a jamais dépassé les ligues mineures."
},
{
  id: "spo-024", categorie: "sport", niveau: 1, type: "qcm",
  question: "Quelle est la longueur d'un bassin olympique ?",
  choix: ["50 mètres", "25 mètres", "100 mètres", "33 mètres"],
  reponse: 0,
  explication: "Les records en bassin de 25 m sont homologués à part : le nageur y gagne du temps à chaque virage, où la poussée va plus vite que la nage."
},

/* ------------------------------- NIVEAU 2 --------------------------------- */
{
  id: "spo-025", categorie: "sport", niveau: 2, type: "qcm",
  question: "Quel pays a rejoint le Tournoi des Cinq Nations en 2000, le transformant en Tournoi des Six Nations ?",
  choix: ["L'Italie", "L'Argentine", "La Roumanie", "La Géorgie"],
  reponse: 0,
  explication: "Elle a attendu dix-sept ans avant de finir autrement que dernière ou avant-dernière, et détient le record de « cuillers de bois »."
},
{
  id: "spo-026", categorie: "sport", niveau: 2, type: "qcm",
  question: "En quelle année s'est tenue la première Coupe du monde de football ?",
  choix: ["1930", "1924", "1938", "1950"],
  reponse: 0,
  explication: "Treize équipes seulement : la traversée en bateau jusqu'en Uruguay durait trois semaines et la plupart des fédérations européennes ont décliné l'invitation."
},
{
  id: "spo-027", categorie: "sport", niveau: 2, type: "vrai_faux",
  question: "Les cartons jaune et rouge sont apparus au football lors de la Coupe du monde 1970.",
  reponse: true,
  explication: "L'arbitre anglais Ken Aston en a eu l'idée devant un feu de circulation : il cherchait un signal compris de tous, quelle que soit la langue du joueur."
},
{
  id: "spo-028", categorie: "sport", niveau: 2, type: "qcm",
  question: "Que récompense le maillot vert du Tour de France ?",
  choix: ["Le classement par points", "Le meilleur grimpeur", "Le meilleur jeune", "Le meilleur équipier"],
  reponse: 0,
  explication: "Créé en 1953, il échoit presque toujours aux sprinteurs, car les arrivées plates rapportent bien plus de points que les étapes de montagne."
},
{
  id: "spo-029", categorie: "sport", niveau: 2, type: "chronologie",
  question: "Classez les quatre nages d'un 400 m quatre nages individuel dans l'ordre imposé.",
  choix: ["Le papillon", "Le dos", "La brasse", "La nage libre"],
  reponse: [0, 1, 2, 3],
  explication: "L'ordre change en relais : dos, brasse, papillon, nage libre, car le départ du dos se fait dans l'eau."
},
{
  id: "spo-030", categorie: "sport", niveau: 2, type: "qcm",
  question: "Combien de joueurs une équipe de hockey sur glace compte-t-elle sur la glace ?",
  choix: ["6", "5", "7", "8"],
  reponse: 0,
  explication: "Cinq patineurs et un gardien, mais les changements se font en pleine action : une équipe fait passer une vingtaine de joueurs sans jamais arrêter le jeu."
},
{
  id: "spo-031", categorie: "sport", niveau: 2, type: "vrai_faux",
  question: "Le jeu décisif, ou tie-break, existe au tennis depuis les origines du sport.",
  reponse: false,
  explication: "Il n'est introduit qu'en 1970, à l'US Open : avant cela, un set pouvait durer indéfiniment, faute d'un moyen de départager deux joueurs à égalité."
},
{
  id: "spo-032", categorie: "sport", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le pays de l'équipe de rugby des All Blacks.",
  reponse: "554",
  explication: "Le haka exécuté avant chaque match n'est pas un folklore de stade : le Ka Mate date des années 1820 et l'équipe le danse depuis sa première tournée, en 1888."
},
{
  id: "spo-033", categorie: "sport", niveau: 2, type: "qcm",
  question: "Combien d'épreuves compte le décathlon ?",
  choix: ["10", "7", "12", "5"],
  reponse: 0,
  explication: "Réparties sur deux jours. Le pendant féminin, l'heptathlon, n'en compte que sept : le décathlon reste fermé aux femmes aux Jeux olympiques."
},
{
  id: "spo-034", categorie: "sport", niveau: 2, type: "qcm",
  question: "Comment s'appelle le trophée remis au vainqueur de la Coupe du monde de rugby ?",
  choix: ["La Coupe Webb Ellis", "Le Bouclier de Brennus", "La Coupe Jules-Rimet", "Le Trophée Calcutta"],
  reponse: 0,
  explication: "Du nom de l'élève à qui la légende attribue l'invention du rugby en 1823. Aucun document de l'époque ne confirme l'histoire, inventée trente ans plus tard."
},
{
  id: "spo-035", categorie: "sport", niveau: 2, type: "distance",
  question: "Cliquez sur la ville où se courent les 24 Heures automobiles depuis 1923.",
  reponse: [47.9560, 0.2074],
  explication: "Le Mans. Le circuit emprunte encore des routes départementales ouvertes à la circulation le reste de l'année."
},
{
  id: "spo-036", categorie: "sport", niveau: 2, type: "vrai_faux",
  question: "Les Jeux olympiques d'hiver et d'été se déroulent la même année.",
  reponse: false,
  explication: "C'était le cas jusqu'en 1992. Le CIO a ensuite décalé les Jeux d'hiver de deux ans, d'où une édition rapprochée : Albertville 1992, puis Lillehammer 1994."
},
{
  id: "spo-037", categorie: "sport", niveau: 2, type: "qcm",
  question: "Dans quel pays le basket-ball a-t-il été inventé ?",
  choix: ["Les États-Unis", "Le Canada", "Le Royaume-Uni", "La Suède"],
  reponse: 0,
  explication: "James Naismith l'imagine en 1891 pour occuper ses élèves l'hiver. Les premiers paniers étaient des corbeilles à pêches dont il fallait ressortir le ballon à la main."
},
{
  id: "spo-038", categorie: "sport", niveau: 2, type: "multi_pays",
  question: "Sélectionnez les quatre pays qui accueillent les tournois du Grand Chelem de tennis.",
  reponse: ["036", "250", "826", "840"],
  explication: "Australie, France, Royaume-Uni et États-Unis. Cette liste n'a pas changé depuis 1925, année où Roland-Garros a été ouvert aux joueurs étrangers."
},
{
  id: "spo-039", categorie: "sport", niveau: 2, type: "qcm",
  question: "Combien de titres de champion du monde de Formule 1 Michael Schumacher a-t-il remportés ?",
  choix: ["7", "5", "6", "9"],
  reponse: 0,
  explication: "Dont cinq d'affilée avec Ferrari entre 2000 et 2004, après que l'écurie n'avait plus rien gagné depuis 1979."
},
{
  id: "spo-040", categorie: "sport", niveau: 2, type: "vrai_faux",
  question: "Le leader du Tour d'Italie porte un maillot rose.",
  reponse: true,
  explication: "Même logique que le jaune du Tour de France : la Gazzetta dello Sport, qui organise le Giro, s'imprime sur papier rose."
},
{
  id: "spo-041", categorie: "sport", niveau: 2, type: "qcm",
  question: "Combien d'armes différentes compte l'escrime olympique ?",
  choix: ["3", "2", "4", "5"],
  reponse: 0,
  explication: "Fleuret, épée et sabre, chacune avec ses surfaces valables : tout le corps à l'épée, le tronc au fleuret, tout ce qui est au-dessus de la taille au sabre."
},
{
  id: "spo-042", categorie: "sport", niveau: 2, type: "qcm",
  question: "Dans quelle discipline Nadia Comăneci a-t-elle obtenu le premier 10 parfait des Jeux olympiques, en 1976 ?",
  choix: ["La gymnastique artistique", "Le plongeon", "Le patinage artistique", "La natation synchronisée"],
  reponse: 0,
  explication: "Elle avait 14 ans. Le tableau d'affichage, prévu pour trois chiffres, ne pouvait pas écrire 10,00 : il a affiché 1,00."
},
{
  id: "spo-043", categorie: "sport", niveau: 2, type: "chronologie",
  question: "Classez ces Jeux olympiques d'été par ordre chronologique.",
  choix: ["Berlin", "Mexico", "Munich", "Barcelone"],
  reponse: [0, 1, 2, 3],
  explication: "1936, 1968, 1972, 1992. Mexico se tient à 2 240 m d'altitude : l'air raréfié y a fait tomber tous les records de sprint et de saut."
},
{
  id: "spo-044", categorie: "sport", niveau: 2, type: "qcm",
  question: "Combien de rounds compte un championnat du monde de boxe professionnelle ?",
  choix: ["12", "15", "10", "8"],
  reponse: 0,
  explication: "Ramené de 15 à 12 au début des années 1980 après plusieurs décès sur le ring : les trois derniers rounds concentraient l'essentiel des accidents."
},
{
  id: "spo-045", categorie: "sport", niveau: 2, type: "vrai_faux",
  question: "La course cycliste Paris-Roubaix est surnommée « l'Enfer du Nord ».",
  reponse: true,
  explication: "Le surnom ne vient pas des pavés mais de 1919 : les journalistes traversaient une région ravagée par la guerre pour rouvrir la course."
},
{
  id: "spo-046", categorie: "sport", niveau: 2, type: "qcm",
  question: "Combien de points vaut un touchdown au football américain ?",
  choix: ["6 points", "7 points", "5 points", "3 points"],
  reponse: 0,
  explication: "La transformation qui suit en ajoute un ou deux, d'où l'impression qu'il vaut 7 : c'est la seule action du sport dont le score final varie selon le choix de l'attaque."
},
{
  id: "spo-047", categorie: "sport", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le pays d'origine du taekwondo.",
  reponse: "410",
  explication: "Codifié dans les années 1950 en réunissant plusieurs écoles coréennes. Il est devenu sport olympique à Sydney, en 2000."
},
{
  id: "spo-048", categorie: "sport", niveau: 2, type: "qcm",
  question: "Sur quelle distance se court le steeple en athlétisme ?",
  choix: ["3 000 m", "1 500 m", "5 000 m", "2 000 m"],
  reponse: 0,
  explication: "Trente-cinq obstacles et sept passages de rivière. Les barrières, contrairement aux haies du 110 m, sont fixes : les heurter ne coûte rien d'autre qu'une chute."
},

/* ------------------------------- NIVEAU 3 --------------------------------- */
{
  id: "spo-049", categorie: "sport", niveau: 3, type: "qcm",
  question: "Quelle ville a accueilli les premiers Jeux olympiques d'hiver, en 1924 ?",
  choix: ["Chamonix", "Saint-Moritz", "Lake Placid", "Oslo"],
  reponse: 0,
  explication: "Ils s'appelaient alors « Semaine internationale des sports d'hiver » : le CIO ne leur a donné le titre de Jeux olympiques que rétroactivement, deux ans plus tard."
},
{
  id: "spo-050", categorie: "sport", niveau: 3, type: "qcm",
  question: "En quelle année la FIFA a-t-elle été fondée ?",
  choix: ["1904", "1886", "1920", "1930"],
  reponse: 0,
  explication: "À Paris, par sept fédérations continentales. L'Angleterre, qui avait inventé le jeu, a refusé d'en faire partie la première année."
},
{
  id: "spo-051", categorie: "sport", niveau: 3, type: "vrai_faux",
  question: "Le Comité international olympique a été fondé à Paris.",
  reponse: true,
  explication: "En juin 1894, lors d'un congrès à la Sorbonne. Le siège a déménagé à Lausanne en 1915, pour mettre l'institution à l'abri de la guerre."
},
{
  id: "spo-052", categorie: "sport", niveau: 3, type: "qcm",
  question: "Qui fut le premier coureur à remporter cinq Tours de France ?",
  choix: ["Jacques Anquetil", "Eddy Merckx", "Bernard Hinault", "Louison Bobet"],
  reponse: 0,
  explication: "Son cinquième, en 1964, s'est joué à 55 secondes de Raymond Poulidor après leur coude-à-coude au sommet du Puy de Dôme."
},
{
  id: "spo-053", categorie: "sport", niveau: 3, type: "qcm",
  question: "À quels Jeux olympiques le relais de la flamme a-t-il été organisé pour la première fois ?",
  choix: ["Berlin 1936", "Athènes 1896", "Londres 1948", "Rome 1960"],
  reponse: 0,
  explication: "Une invention allemande, imaginée par Carl Diem pour relier le régime nazi à la Grèce antique. Le rituel a survécu à son origine."
},
{
  id: "spo-054", categorie: "sport", niveau: 3, type: "chronologie",
  question: "Classez ces courses cyclistes par ordre de création.",
  choix: ["Liège-Bastogne-Liège", "Paris-Roubaix", "Le Tour de France", "Le Tour d'Italie"],
  reponse: [0, 1, 2, 3],
  explication: "1892, 1896, 1903, 1909. Toutes ont été créées par des journaux pour vendre du papier : la presse a inventé le cyclisme professionnel avant les fédérations."
},
{
  id: "spo-055", categorie: "sport", niveau: 3, type: "qcm",
  question: "Combien de médailles d'or olympiques le nageur Michael Phelps a-t-il remportées au total ?",
  choix: ["23", "18", "14", "28"],
  reponse: 0,
  explication: "Sur 28 médailles au total, réparties sur quatre éditions. Aucun autre athlète n'en compte plus de neuf en or."
},
{
  id: "spo-056", categorie: "sport", niveau: 3, type: "vrai_faux",
  question: "Jesse Owens a remporté quatre médailles d'or aux Jeux olympiques de Berlin, en 1936.",
  reponse: true,
  explication: "100 m, 200 m, longueur et relais. Rentré aux États-Unis, il restait soumis à la ségrégation et n'a reçu aucune invitation officielle à la Maison-Blanche."
},
{
  id: "spo-057", categorie: "sport", niveau: 3, type: "qcm",
  question: "En quelle année l'essai est-il passé de quatre à cinq points au rugby ?",
  choix: ["1992", "1971", "1987", "1995"],
  reponse: 0,
  explication: "La hausse visait à récompenser le jeu de mouvement. Deux ans plus tard, le rugby passait officiellement professionnel."
},
{
  id: "spo-058", categorie: "sport", niveau: 3, type: "multi_pays",
  question: "Sélectionnez les trois pays qui ont accueilli au moins trois éditions des Jeux olympiques d'été.",
  reponse: ["840", "250", "826"],
  explication: "États-Unis (1904, 1932, 1984, 1996), France (1900, 1924, 2024) et Royaume-Uni (1908, 1948, 2012). Londres est la seule ville à les avoir organisés trois fois."
},
{
  id: "spo-059", categorie: "sport", niveau: 3, type: "qcm",
  question: "Quel est le seul club français à avoir remporté la Coupe d'Europe des clubs champions ou la Ligue des champions ?",
  choix: ["L'Olympique de Marseille", "L'AS Saint-Étienne", "Le Stade de Reims", "Les Girondins de Bordeaux"],
  reponse: 0,
  explication: "En 1993, 1-0 contre l'AC Milan sur une tête de Basile Boli. Reims avait perdu les finales de 1956 et 1959, Saint-Étienne celle de 1976."
},
{
  id: "spo-060", categorie: "sport", niveau: 3, type: "distance",
  question: "Cliquez sur la ville des États-Unis où le basket-ball a été inventé en 1891.",
  reponse: [42.1015, -72.5898],
  explication: "Springfield, dans le Massachusetts, où le Temple de la renommée du basket-ball porte aujourd'hui le nom de James Naismith."
},
{
  id: "spo-061", categorie: "sport", niveau: 3, type: "vrai_faux",
  question: "Les premiers Jeux paralympiques se sont tenus à Rome en 1960.",
  reponse: true,
  explication: "Ils descendent des jeux organisés dès 1948 à l'hôpital de Stoke Mandeville pour les blessés de guerre : le sport y servait d'abord de rééducation."
},
{
  id: "spo-062", categorie: "sport", niveau: 3, type: "qcm",
  question: "Quel temps Usain Bolt a-t-il établi sur 100 m à Berlin en 2009, record du monde depuis ?",
  choix: ["9 s 58", "9 s 69", "9 s 72", "9 s 84"],
  reponse: 0,
  explication: "Il avait couru en 9 s 69 un an plus tôt à Pékin en se redressant avant la ligne, lacet défait : le record de Berlin est celui d'une course menée jusqu'au bout."
},
{
  id: "spo-063", categorie: "sport", niveau: 3, type: "qcm",
  question: "Combien de disciplines compte le pentathlon moderne ?",
  choix: ["5", "4", "6", "7"],
  reponse: 0,
  explication: "Escrime, natation, équitation, tir et course. Coubertin l'avait conçu autour du parcours imaginaire d'un officier de cavalerie porteur d'un message."
},
{
  id: "spo-064", categorie: "sport", niveau: 3, type: "vrai_faux",
  question: "La note maximale de 10 a été supprimée de la gymnastique artistique.",
  reponse: true,
  explication: "Abandonnée en 2006 pour un barème ouvert : la difficulté n'a plus de plafond et s'ajoute à la note d'exécution, seule à rester limitée."
},
{
  id: "spo-065", categorie: "sport", niveau: 3, type: "qcm",
  question: "Sous quel empereur romain les Jeux olympiques antiques ont-ils été interdits, en 393 ?",
  choix: ["Théodose Ier", "Constantin Ier", "Néron", "Hadrien"],
  reponse: 0,
  explication: "Ils avaient duré près de douze siècles. L'interdiction ne visait pas le sport mais les cultes païens auxquels les Jeux étaient adossés."
},
{
  id: "spo-066", categorie: "sport", niveau: 3, type: "clic_pays",
  question: "Cliquez sur le pays où se trouve le circuit automobile de Monza.",
  reponse: "380",
  explication: "Construit en 1922, c'est le troisième circuit permanent de l'histoire après Brooklands et Indianapolis. Son ancien anneau incliné, abandonné, existe toujours."
},
{
  id: "spo-067", categorie: "sport", niveau: 3, type: "qcm",
  question: "De combien de secondes une équipe dispose-t-elle pour tenter un tir en NBA ?",
  choix: ["24 secondes", "30 secondes", "20 secondes", "35 secondes"],
  reponse: 0,
  explication: "Introduite en 1954 pour empêcher les équipes en tête de garder le ballon : un match s'était terminé sur le score de 19-18."
},
{
  id: "spo-068", categorie: "sport", niveau: 3, type: "vrai_faux",
  question: "Rod Laver est le seul joueur de tennis à avoir réalisé deux fois le Grand Chelem sur une année civile.",
  reponse: true,
  explication: "En 1962 chez les amateurs puis en 1969 dans l'ère open. Entre les deux, professionnalisé, il était exclu des quatre tournois."
},
{
  id: "spo-069", categorie: "sport", niveau: 3, type: "qcm",
  question: "Quel est le plus ancien trophée sportif international encore disputé ?",
  choix: ["La Coupe de l'America", "La Coupe Davis", "La Coupe Stanley", "Le Bouclier de Brennus"],
  reponse: 0,
  explication: "Mise en jeu en 1851 autour de l'île de Wight. Le New York Yacht Club l'a conservée 132 ans d'affilée, la plus longue série de victoires du sport."
},
{
  id: "spo-070", categorie: "sport", niveau: 3, type: "chronologie",
  question: "Classez ces trophées par ordre de création.",
  choix: ["La Coupe de l'America", "La Coupe Stanley", "La Coupe Davis", "Le Ballon d'or"],
  reponse: [0, 1, 2, 3],
  explication: "1851, 1893, 1900, 1956. Lord Stanley, qui a offert la coupe de hockey, n'a jamais vu un seul match de la finale qui porte son nom."
}

]);

/* =============================================================================
   SPORT — deuxième série (40 questions)
   ============================================================================= */
window.QUESTIONS.push(...[

/* ------------------------------- NIVEAU 1 --------------------------------- */
{
  id: "spo-071", categorie: "sport", niveau: 1, type: "qcm",
  question: "Combien de joueurs une équipe de basket-ball aligne-t-elle sur le terrain ?",
  choix: ["5", "6", "7", "4"],
  reponse: 0,
  explication: "C'est le sport collectif olympique qui en compte le moins. À l'origine, Naismith faisait jouer neuf joueurs par équipe, soit ses dix-huit élèves."
},
{
  id: "spo-072", categorie: "sport", niveau: 1, type: "vrai_faux",
  question: "Un match de rugby à XV dure quatre-vingts minutes.",
  reponse: true,
  explication: "Deux mi-temps de quarante minutes. Contrairement au football, le chronomètre s'arrête à chaque interruption signalée par l'arbitre."
},
{
  id: "spo-073", categorie: "sport", niveau: 1, type: "qcm",
  question: "Quel sport se joue avec une crosse et un palet sur la glace ?",
  choix: ["Le hockey sur glace", "Le curling", "Le patinage de vitesse", "Le bandy"],
  reponse: 0,
  explication: "Le palet est congelé avant chaque match : glacé, il glisse droit au lieu de rebondir de façon imprévisible."
},
{
  id: "spo-074", categorie: "sport", niveau: 1, type: "qcm",
  question: "Combien de quilles doit-on abattre au bowling ?",
  choix: ["10", "12", "8", "9"],
  reponse: 0,
  explication: "Le jeu se pratiquait à neuf quilles jusqu'à ce que plusieurs États américains l'interdisent pour cause de paris : on en a ajouté une pour contourner la loi."
},
{
  id: "spo-075", categorie: "sport", niveau: 1, type: "chronologie",
  question: "Classez ces courses de la plus courte à la plus longue.",
  choix: ["Le 100 m", "Le 400 m", "Le 1 500 m", "Le marathon"],
  reponse: [0, 1, 2, 3],
  explication: "Le 1 500 m est l'héritier du mile britannique, dont il n'est qu'une conversion approximative en système métrique."
},
{
  id: "spo-076", categorie: "sport", niveau: 1, type: "clic_pays",
  question: "Cliquez sur le Brésil, seul pays présent à toutes les Coupes du monde de football.",
  reponse: "076",
  explication: "Il n'a jamais manqué une édition depuis 1930, ce qu'aucune autre sélection ne peut revendiquer."
},
{
  id: "spo-077", categorie: "sport", niveau: 1, type: "vrai_faux",
  question: "Le judo se pratique pieds nus.",
  reponse: true,
  explication: "Comme la plupart des arts martiaux japonais, par respect du tatami. Les ongles de pieds doivent d'ailleurs être coupés court avant chaque combat."
},
{
  id: "spo-078", categorie: "sport", niveau: 1, type: "qcm",
  question: "Sur quelle surface se pratique le judo ?",
  choix: ["Un tatami", "Un ring", "Une piste", "Un tapis de sol lesté"],
  reponse: 0,
  explication: "Le mot signifie littéralement « ce sur quoi l'on s'agenouille ». Les tatamis de compétition sont conçus pour absorber une chute sans rebondir."
},
{
  id: "spo-079", categorie: "sport", niveau: 1, type: "distance",
  question: "Cliquez sur l'emplacement de Wimbledon, dans la banlieue de Londres.",
  reponse: [51.4340, -0.2140],
  explication: "Le club consomme plus de vingt-huit tonnes de fraises pendant la quinzaine, servies exclusivement avec de la crème."
},
{
  id: "spo-080", categorie: "sport", niveau: 1, type: "qcm",
  question: "Combien de minutes dure un quart-temps de basket selon les règles internationales ?",
  choix: ["10 minutes", "12 minutes", "15 minutes", "8 minutes"],
  reponse: 0,
  explication: "La NBA joue en douze minutes, soit huit de plus par match : c'est pourquoi les statistiques américaines ne se comparent pas directement aux européennes."
},
{
  id: "spo-081", categorie: "sport", niveau: 1, type: "vrai_faux",
  question: "Le Tour de France dure environ trois semaines.",
  reponse: true,
  explication: "Vingt et une étapes et deux journées de repos. Les premières éditions ne comptaient que six étapes, mais certaines dépassaient 400 km d'un seul tenant."
},
{
  id: "spo-082", categorie: "sport", niveau: 1, type: "qcm",
  question: "Combien de joueurs une équipe de water-polo compte-t-elle dans l'eau ?",
  choix: ["7", "6", "5", "9"],
  reponse: 0,
  explication: "Six joueurs de champ et un gardien. Le bassin fait trois mètres de profondeur : personne ne touche le fond pendant tout le match."
},
{
  id: "spo-083", categorie: "sport", niveau: 1, type: "chronologie",
  question: "Classez ces sports selon le nombre de joueurs par équipe sur le terrain, du plus petit au plus grand.",
  choix: ["Le tennis en simple", "Le basket-ball", "Le volley-ball", "Le football"],
  reponse: [0, 1, 2, 3],
  explication: "1, 5, 6 et 11. Le rugby à XV en aligne quinze, le record parmi les sports olympiques collectifs."
},
{
  id: "spo-084", categorie: "sport", niveau: 1, type: "qcm",
  question: "Quelle épreuve enchaîne natation, cyclisme et course à pied ?",
  choix: ["Le triathlon", "Le pentathlon", "Le décathlon", "Le biathlon"],
  reponse: 0,
  explication: "Née en Californie dans les années 1970. L'ordre n'est pas arbitraire : on nage d'abord, quand un malaise est le plus dangereux et la surveillance la plus facile."
},

/* ------------------------------- NIVEAU 2 --------------------------------- */
{
  id: "spo-085", categorie: "sport", niveau: 2, type: "qcm",
  question: "Combien d'épreuves compte l'heptathlon ?",
  choix: ["7", "5", "10", "8"],
  reponse: 0,
  explication: "Sur deux jours, comme le décathlon masculin. Le préfixe grec donne directement le compte : hepta, sept."
},
{
  id: "spo-086", categorie: "sport", niveau: 2, type: "vrai_faux",
  question: "La France a déjà organisé les Jeux olympiques d'hiver.",
  reponse: true,
  explication: "Trois fois : Chamonix en 1924, Grenoble en 1968 et Albertville en 1992. Seuls les États-Unis ont fait mieux."
},
{
  id: "spo-087", categorie: "sport", niveau: 2, type: "qcm",
  question: "À quelle hauteur se trouve un panier de basket ?",
  choix: ["3,05 m", "2,75 m", "3,50 m", "2,50 m"],
  reponse: 0,
  explication: "Soit dix pieds, la hauteur de la rambarde du gymnase où Naismith avait cloué ses corbeilles en 1891. Elle n'a jamais bougé depuis."
},
{
  id: "spo-088", categorie: "sport", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le pays où se court le Tour cycliste appelé la Vuelta.",
  reponse: "724",
  explication: "Créée en 1935, c'est le plus jeune des trois grands tours. Elle se courait au printemps avant de basculer en août pour fuir la chaleur."
},
{
  id: "spo-089", categorie: "sport", niveau: 2, type: "qcm",
  question: "Quel tournoi du Grand Chelem se joue sur gazon ?",
  choix: ["Wimbledon", "Roland-Garros", "L'US Open", "L'Open d'Australie"],
  reponse: 0,
  explication: "Le gazon était la surface d'origine du tennis, d'où son ancien nom de « lawn tennis », tennis sur pelouse."
},
{
  id: "spo-090", categorie: "sport", niveau: 2, type: "distance",
  question: "Cliquez sur l'emplacement de Monaco et de son Grand Prix.",
  reponse: [43.7384, 7.4246],
  explication: "Le seul circuit du calendrier à ne pas respecter la distance minimale réglementaire : il est trop lent pour tenir dans le temps imparti."
},
{
  id: "spo-092", categorie: "sport", niveau: 2, type: "vrai_faux",
  question: "Au volley-ball, une équipe dispose de trois touches au maximum avant de renvoyer le ballon.",
  reponse: true,
  explication: "Le contre ne compte pas dans ce total, ce qui autorise en pratique quatre contacts quand le ballon a été touché au filet."
},
{
  id: "spo-093", categorie: "sport", niveau: 2, type: "qcm",
  question: "À quelle distance du but se tire un penalty au football ?",
  choix: ["11 mètres", "9 mètres", "13 mètres", "16 mètres"],
  reponse: 0,
  explication: "Soit douze yards. Le tir a été introduit en 1891 et jugé si contraire à l'esprit du jeu que certains clubs refusaient de l'utiliser."
},
{
  id: "spo-094", categorie: "sport", niveau: 2, type: "multi_pays",
  question: "Sélectionnez les trois pays nordiques historiquement dominants en ski de fond.",
  reponse: ["578", "752", "246"],
  explication: "Norvège, Suède et Finlande. Le mot « ski » est norvégien, et des skis vieux de plusieurs millénaires ont été retrouvés dans les tourbières scandinaves."
},
{
  id: "spo-096", categorie: "sport", niveau: 2, type: "vrai_faux",
  question: "Le curling est une discipline olympique.",
  reponse: true,
  explication: "Présent dès 1924 à Chamonix, puis disparu pendant soixante-dix ans avant son retour définitif en 1998."
},
{
  id: "spo-097", categorie: "sport", niveau: 2, type: "qcm",
  question: "Quel trophée récompense le champion de la ligue nord-américaine de hockey sur glace ?",
  choix: ["La coupe Stanley", "Le trophée Vézina", "La coupe Memorial", "Le trophée Hart"],
  reponse: 0,
  explication: "Le nom de chaque joueur vainqueur y est gravé. Quand l'anneau est plein, on retire le plus ancien pour le placer au musée."
},
{
  id: "spo-098", categorie: "sport", niveau: 2, type: "qcm",
  question: "Quelle distance un Grand Prix de Formule 1 doit-il atteindre au minimum ?",
  choix: ["Environ 305 km", "Environ 200 km", "Environ 450 km", "Environ 150 km"],
  reponse: 0,
  explication: "Le nombre de tours se déduit de cette distance divisée par la longueur du circuit, ce qui explique des totaux très variables d'une course à l'autre."
},

/* ------------------------------- NIVEAU 3 --------------------------------- */
{
  id: "spo-099", categorie: "sport", niveau: 3, type: "qcm",
  question: "À quelle édition des Jeux olympiques modernes les femmes ont-elles concouru pour la première fois ?",
  choix: ["Paris 1900", "Athènes 1896", "Saint-Louis 1904", "Londres 1908"],
  reponse: 0,
  explication: "Vingt-deux femmes sur près de mille participants, en tennis, golf, croquet, équitation et voile. Coubertin y était personnellement opposé."
},
{
  id: "spo-100", categorie: "sport", niveau: 3, type: "vrai_faux",
  question: "Le marathon figurait au programme des Jeux olympiques de l'Antiquité.",
  reponse: false,
  explication: "L'épreuve a été inventée de toutes pièces pour les Jeux de 1896, à partir d'une légende grecque que les Anciens ne célébraient par aucune course."
},
{
  id: "spo-101", categorie: "sport", niveau: 3, type: "qcm",
  question: "Quel sport olympique fait concourir hommes et femmes dans les mêmes épreuves ?",
  choix: ["L'équitation", "Le tir à l'arc", "L'escrime", "Le tir sportif"],
  reponse: 0,
  explication: "Depuis 1952. Le cheval comptant pour moitié dans la performance, la distinction par sexe du cavalier n'a jamais été jugée pertinente."
},
{
  id: "spo-102", categorie: "sport", niveau: 3, type: "chronologie",
  question: "Classez ces sports selon leur entrée au programme olympique.",
  choix: ["L'athlétisme", "Le football", "Le basket-ball", "Le taekwondo"],
  reponse: [0, 1, 2, 3],
  explication: "1896, 1900, 1936 et 2000. Le tournoi olympique de basket de 1936 s'est joué en extérieur, sur terre battue, sous une pluie battante en finale."
},
{
  id: "spo-103", categorie: "sport", niveau: 3, type: "qcm",
  question: "Combien de joueurs compte une équipe de cricket ?",
  choix: ["11", "9", "13", "15"],
  reponse: 0,
  explication: "Un test-match peut durer cinq jours et s'achever sur un match nul, ce qui n'empêche pas le cricket d'être le deuxième sport le plus suivi au monde."
},
{
  id: "spo-104", categorie: "sport", niveau: 3, type: "distance",
  question: "Cliquez sur la ville qui accueille l'Open d'Australie de tennis.",
  reponse: [-37.8136, 144.9631],
  explication: "Melbourne. C'est le premier tournoi du Grand Chelem à s'être doté d'un toit rétractable, en 1988, à cause de la chaleur autant que de la pluie."
},
{
  id: "spo-105", categorie: "sport", niveau: 3, type: "qcm",
  question: "Quel coureur a remporté cinq Tours de France consécutifs, de 1991 à 1995 ?",
  choix: ["Miguel Indurain", "Bernard Hinault", "Eddy Merckx", "Jacques Anquetil"],
  reponse: 0,
  explication: "Le premier à réussir cinq victoires d'affilée. Son rythme cardiaque au repos descendait à moins de trente battements par minute."
},
{
  id: "spo-106", categorie: "sport", niveau: 3, type: "vrai_faux",
  question: "Le plus long match de tennis de l'histoire a duré plus de onze heures.",
  reponse: true,
  explication: "Isner contre Mahut à Wimbledon en 2010, étalé sur trois jours. Le dernier set s'est achevé sur le score de 70 jeux à 68."
},
{
  id: "spo-107", categorie: "sport", niveau: 3, type: "qcm",
  question: "Quel engin masculin pèse 7,26 kg en athlétisme ?",
  choix: ["Le poids", "Le disque", "Le javelot", "Le marteau"],
  reponse: 0,
  explication: "Soit seize livres anglaises. Le marteau pèse exactement la même masse, mais au bout d'un câble d'environ 1,20 m."
},
{
  id: "spo-108", categorie: "sport", niveau: 3, type: "clic_pays",
  question: "Cliquez sur le Kenya, terre des coureurs de fond.",
  reponse: "404",
  explication: "Une part considérable de ses champions vient d'une seule région, la vallée du Rift, à plus de 2 000 m d'altitude."
},
{
  id: "spo-109", categorie: "sport", niveau: 3, type: "qcm",
  question: "En quelle année la ligne à trois points a-t-elle été adoptée en NBA ?",
  choix: ["1979", "1965", "1988", "1996"],
  reponse: 0,
  explication: "Longtemps jugée comme un gadget de ligue rivale. Elle a fini par transformer entièrement la façon de jouer, quarante ans plus tard."
},
{
  id: "spo-110", categorie: "sport", niveau: 3, type: "qcm",
  question: "Quelle fédération internationale régit le sport automobile ?",
  choix: ["La FIA", "La FIM", "L'UCI", "La FIS"],
  reponse: 0,
  explication: "Fondée en 1904, avant même que la course automobile ne se dispute sur circuit fermé : on courait alors de ville en ville, sur routes ouvertes."
}

]);

/* ============================ SPORT — frises et ordres de grandeur ========= */
window.QUESTIONS.push(...[
{
  id: "spo-150", categorie: "sport", niveau: 1, type: "frise",
  question: "En quelle année se sont tenus les premiers Jeux olympiques modernes ?",
  reponse: 1896, min: 1800, max: 1960,
  explication: "À Athènes, dans un stade de marbre reconstruit pour l'occasion sur les fondations d'une enceinte antique."
},
{
  id: "spo-151", categorie: "sport", niveau: 2, type: "frise",
  question: "En quelle année s'est tenue la première Coupe du monde de rugby ?",
  reponse: 1987, min: 1920, max: 2020,
  explication: "Les équipes ont été invitées, sans qualifications. La Nouvelle-Zélande a remporté cette édition inaugurale."
},
{
  id: "spo-152", categorie: "sport", niveau: 2, type: "frise",
  question: "En quelle année l'Olympique de Marseille a-t-il remporté la Ligue des champions ?",
  reponse: 1993, min: 1950, max: 2025,
  explication: "Seul sacre européen d'un club français dans cette compétition à ce jour."
},
{
  id: "spo-153", categorie: "sport", niveau: 3, type: "frise",
  question: "En quelle année Usain Bolt a-t-il établi son record du monde du 100 m ?",
  reponse: 2009, min: 1950, max: 2025,
  explication: "9 s 58 à Berlin. Sa vitesse de pointe a dépassé 44 km/h sur une portion de la course."
},
{
  id: "spo-154", categorie: "sport", niveau: 2, type: "grandeur",
  question: "Quelle est la longueur réglementaire d'un terrain de football international ?",
  reponse: 105, unite: "m", min: 20, max: 1000,
  explication: "105 sur 68 mètres. Les Laws of the Game tolèrent une fourchette, mais les compétitions internationales imposent ces dimensions exactes."
},
{
  id: "spo-155", categorie: "sport", niveau: 3, type: "grandeur",
  question: "À quelle vitesse a été mesuré le service de tennis le plus rapide homologué ?",
  reponse: 263, unite: "km/h", min: 50, max: 1000,
  explication: "Frappé par l'Australien Samuel Groth en 2012, lors d'un tournoi secondaire : le record n'a jamais été battu en Grand Chelem."
},
{
  id: "spo-156", categorie: "sport", niveau: 2, type: "grandeur",
  question: "Quelle distance totale parcourt-on sur un Tour de France ?",
  reponse: 3500, unite: "km", min: 200, max: 50000,
  explication: "Le règlement plafonne aujourd'hui l'épreuve à 3 500 km. Les premières éditions dépassaient les 5 000."
}
]);
