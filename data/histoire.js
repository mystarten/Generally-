/* =============================================================================
   HISTOIRE — 70 questions
   Conventions identiques à data/geographie.js.
   Rappel chronologie : "choix" est déjà dans l'ordre chronologique et
   "reponse" vaut [0,1,2,3] ; le moteur mélange l'affichage.
   ============================================================================= */
window.QUESTIONS = window.QUESTIONS || [];
window.QUESTIONS.push(...[

/* ------------------------------- NIVEAU 1 --------------------------------- */
{
  id: "his-001", categorie: "histoire", niveau: 1, type: "qcm",
  question: "En quelle année la Bastille a-t-elle été prise ?",
  choix: ["1789", "1776", "1792", "1804"],
  reponse: 0,
  explication: "La forteresse ne comptait plus que sept prisonniers ce jour-là, dont quatre faussaires et un aristocrate interné par sa famille."
},
{
  id: "his-002", categorie: "histoire", niveau: 1, type: "chronologie",
  question: "Remettez ces événements dans l'ordre chronologique.",
  choix: [
    "Chute de l'Empire romain d'Occident",
    "Colomb atteint l'Amérique",
    "Révolution française",
    "Premiers pas sur la Lune"
  ],
  reponse: [0, 1, 2, 3],
  explication: "476, 1492, 1789, 1969 : mille ans séparent les deux premiers, moins de deux siècles les deux derniers."
},
{
  id: "his-003", categorie: "histoire", niveau: 1, type: "vrai_faux",
  question: "Napoléon Bonaparte est né en Corse un an avant que l'île ne devienne française.",
  reponse: false,
  explication: "L'inverse : la Corse est cédée à la France en 1768 et il naît à Ajaccio en 1769. Il est donc né français, à un an près."
},
{
  id: "his-004", categorie: "histoire", niveau: 1, type: "clic_pays",
  question: "Cliquez sur le pays où se trouvait Cuzco, capitale de l'Empire inca.",
  reponse: "604",
  explication: "L'empire s'étirait sur 4 000 km sans roue ni écriture, mais avec 40 000 km de routes et un système de nœuds, les quipus."
},
{
  id: "his-005", categorie: "histoire", niveau: 1, type: "qcm",
  question: "Qui fut le premier empereur romain ?",
  choix: ["Auguste", "Jules César", "Néron", "Tibère"],
  reponse: 0,
  explication: "Octave prend le nom d'Auguste en 27 av. J.-C. ; César, lui, n'a jamais porté le titre d'empereur."
},
{
  id: "his-006", categorie: "histoire", niveau: 1, type: "chronologie",
  question: "Classez ces événements du plus ancien au plus récent.",
  choix: [
    "Construction de la pyramide de Khéops",
    "Assassinat de Jules César",
    "Couronnement de Charlemagne",
    "Prise de Constantinople par les Ottomans"
  ],
  reponse: [0, 1, 2, 3],
  explication: "-2560, -44, 800, 1453. La pyramide était déjà vieille de 2 500 ans quand César est mort."
},
{
  id: "his-007", categorie: "histoire", niveau: 1, type: "vrai_faux",
  question: "La guerre de Cent Ans a duré exactement cent ans.",
  reponse: false,
  explication: "1337-1453, soit 116 ans, et entrecoupés de longues trêves : le nom a été inventé par des historiens du XIXe siècle."
},
{
  id: "his-008", categorie: "histoire", niveau: 1, type: "qcm",
  question: "Quel événement marque le début de la Seconde Guerre mondiale en Europe ?",
  choix: [
    "L'invasion de la Pologne",
    "L'annexion de l'Autriche",
    "L'attaque de Pearl Harbor",
    "La bataille de France"
  ],
  reponse: 0,
  explication: "Le 1er septembre 1939 ; la France et le Royaume-Uni déclarent la guerre deux jours plus tard."
},
{
  id: "his-009", categorie: "histoire", niveau: 1, type: "distance",
  question: "Cliquez sur l'emplacement de Rome.",
  reponse: [41.9028, 12.4964],
  explication: "Fondée selon la tradition en 753 av. J.-C., elle est restée pendant des siècles la seule ville d'Europe à dépasser le million d'habitants."
},
{
  id: "his-010", categorie: "histoire", niveau: 1, type: "clic_pays",
  question: "Cliquez sur le pays où a été signé l'armistice du 11 novembre 1918.",
  reponse: "250",
  explication: "Dans un wagon, en forêt de Compiègne. Hitler exigera que la capitulation française de 1940 soit signée dans le même wagon."
},
{
  id: "his-011", categorie: "histoire", niveau: 1, type: "qcm",
  question: "En quelle année le mur de Berlin est-il tombé ?",
  choix: ["1989", "1985", "1991", "1993"],
  reponse: 0,
  explication: "Le 9 novembre, à la suite d'une conférence de presse confuse : le porte-parole du régime a annoncé l'ouverture « immédiatement »."
},
{
  id: "his-012", categorie: "histoire", niveau: 1, type: "vrai_faux",
  question: "Cléopâtre a vécu plus près de notre époque que de la construction de la pyramide de Khéops.",
  reponse: true,
  explication: "Elle meurt en 30 av. J.-C. : 2 500 ans après la pyramide, mais seulement 2 000 ans avant nous."
},
{
  id: "his-013", categorie: "histoire", niveau: 1, type: "chronologie",
  question: "Classez ces événements du XXe et du XXIe siècle.",
  choix: [
    "Chute du mur de Berlin",
    "Dissolution de l'URSS",
    "Attentats du 11 septembre",
    "Début de la pandémie de Covid-19"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1989, 1991, 2001, 2020 : l'URSS n'a survécu que deux ans à la chute du mur."
},
{
  id: "his-014", categorie: "histoire", niveau: 1, type: "qcm",
  question: "Quelle civilisation a inventé l'écriture cunéiforme ?",
  choix: ["Les Sumériens", "Les Égyptiens", "Les Phéniciens", "Les Hittites"],
  reponse: 0,
  explication: "Vers 3300 av. J.-C., d'abord pour de la comptabilité : les premiers textes écrits sont des inventaires de grain et de bétail."
},
{
  id: "his-015", categorie: "histoire", niveau: 1, type: "clic_pays",
  question: "Cliquez sur le pays qui occupe aujourd'hui l'essentiel de l'ancienne Mésopotamie.",
  reponse: "368",
  explication: "Le nom grec signifie « entre les fleuves » : le Tigre et l'Euphrate traversent tous deux l'Irak actuel."
},
{
  id: "his-016", categorie: "histoire", niveau: 1, type: "qcm",
  question: "Qui a mené la marche du sel en 1930 ?",
  choix: ["Gandhi", "Nehru", "Bose", "Ambedkar"],
  reponse: 0,
  explication: "390 km à pied pour ramasser une poignée de sel et défier le monopole britannique : l'image a fait le tour du monde."
},

/* ------------------------------- NIVEAU 2 --------------------------------- */
{
  id: "his-017", categorie: "histoire", niveau: 2, type: "chronologie",
  question: "Classez ces événements du Moyen Âge.",
  choix: [
    "Bataille de Hastings",
    "Signature de la Magna Carta",
    "Peste noire en Europe",
    "Chute de Constantinople"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1066, 1215, 1347, 1453. La peste a emporté en quatre ans près d'un tiers de la population européenne."
},
{
  id: "his-018", categorie: "histoire", niveau: 2, type: "vrai_faux",
  question: "Le Saint-Empire romain germanique a été dissous sous la pression de Napoléon.",
  reponse: true,
  explication: "François II abdique la couronne impériale en 1806, mettant fin à mille ans d'une entité que Voltaire disait « ni saint, ni romain, ni empire »."
},
{
  id: "his-019", categorie: "histoire", niveau: 2, type: "distance",
  question: "Cliquez sur l'emplacement d'Hiroshima.",
  reponse: [34.3853, 132.4553],
  explication: "Un platane et quelques ginkgos ont survécu à 1 km de l'hypocentre : on les appelle les hibakujumoku, les arbres survivants."
},
{
  id: "his-020", categorie: "histoire", niveau: 2, type: "multi_pays",
  question: "Sélectionnez les trois principales puissances de l'Axe pendant la Seconde Guerre mondiale.",
  reponse: ["276", "380", "392"],
  explication: "Le pacte tripartite est signé à Berlin en septembre 1940 ; l'Italie changera de camp dès 1943."
},
{
  id: "his-021", categorie: "histoire", niveau: 2, type: "qcm",
  question: "Quel traité met fin à la Première Guerre mondiale entre les Alliés et l'Allemagne ?",
  choix: ["Le traité de Versailles", "Le traité de Trianon", "Le traité de Sèvres", "Le traité de Brest-Litovsk"],
  reponse: 0,
  explication: "Signé le 28 juin 1919 dans la galerie des Glaces, jour pour jour cinq ans après l'attentat de Sarajevo."
},
{
  id: "his-022", categorie: "histoire", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le pays où s'est déroulée la révolution des Œillets en 1974.",
  reponse: "620",
  explication: "Un coup d'État militaire quasi sans effusion de sang : les soldats glissaient des œillets dans le canon de leurs fusils."
},
{
  id: "his-023", categorie: "histoire", niveau: 2, type: "chronologie",
  question: "Classez ces jalons de l'ère des révolutions.",
  choix: [
    "Déclaration d'indépendance des États-Unis",
    "Révolution française",
    "Congrès de Vienne",
    "Printemps des peuples"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1776, 1789, 1815, 1848. Le congrès de Vienne voulait effacer la Révolution ; trente ans plus tard, l'Europe s'embrasait à nouveau."
},
{
  id: "his-024", categorie: "histoire", niveau: 2, type: "vrai_faux",
  question: "Le Titanic avait déjà effectué plusieurs traversées de l'Atlantique avant son naufrage.",
  reponse: false,
  explication: "Il a coulé lors de son voyage inaugural, quatre jours après son départ de Southampton, en avril 1912."
},
{
  id: "his-025", categorie: "histoire", niveau: 2, type: "qcm",
  question: "Quel empire Soliman le Magnifique dirigeait-il ?",
  choix: ["L'Empire ottoman", "L'Empire perse", "L'Empire moghol", "L'Empire byzantin"],
  reponse: 0,
  explication: "Sous son règne (1520-1566), l'empire atteint Budapest et assiège Vienne ; les Ottomans l'appellent « le Législateur »."
},
{
  id: "his-026", categorie: "histoire", niveau: 2, type: "multi_pays",
  question: "Sélectionnez les trois pays baltes, indépendants de l'URSS depuis 1991.",
  reponse: ["233", "428", "440"],
  explication: "Estonie, Lettonie, Lituanie. En 1989, deux millions de personnes y ont formé une chaîne humaine de 600 km, la « voie balte »."
},
{
  id: "his-027", categorie: "histoire", niveau: 2, type: "distance",
  question: "Cliquez sur le champ de bataille de Waterloo.",
  reponse: [50.6803, 4.4120],
  explication: "Le 18 juin 1815, à une vingtaine de kilomètres au sud de Bruxelles : la bataille a duré une seule journée."
},
{
  id: "his-028", categorie: "histoire", niveau: 2, type: "qcm",
  question: "Quel roi régnait en France au début de la Révolution ?",
  choix: ["Louis XVI", "Louis XV", "Louis XIV", "Charles X"],
  reponse: 0,
  explication: "Serrurier passionné, il avait noté « Rien » dans son journal de chasse à la date du 14 juillet 1789."
},
{
  id: "his-029", categorie: "histoire", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le pays où Alexandre le Grand est mort, à Babylone.",
  reponse: "368",
  explication: "En 323 av. J.-C., à 32 ans, alors qu'il préparait une expédition en Arabie ; son empire s'est disloqué en une génération."
},
{
  id: "his-030", categorie: "histoire", niveau: 2, type: "vrai_faux",
  question: "La Grande Muraille de Chine est visible à l'œil nu depuis la Lune.",
  reponse: false,
  explication: "Elle est étroite et de la couleur du terrain ; les astronautes confirment qu'on ne la distingue déjà pas depuis l'orbite basse."
},
{
  id: "his-031", categorie: "histoire", niveau: 2, type: "qcm",
  question: "Quelle bataille marque le tournant du front de l'Est en 1942-1943 ?",
  choix: ["Stalingrad", "Koursk", "Moscou", "Leningrad"],
  reponse: 0,
  explication: "La 6e armée allemande y capitule en février 1943 ; c'est la première grande reddition d'une armée allemande de la guerre."
},

/* ------------------------------- NIVEAU 3 --------------------------------- */
{
  id: "his-032", categorie: "histoire", niveau: 3, type: "chronologie",
  question: "Classez ces traités et édits de l'époque moderne.",
  choix: [
    "Édit de Nantes",
    "Traités de Westphalie",
    "Révocation de l'édit de Nantes",
    "Traité d'Utrecht"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1598, 1648, 1685, 1713. La révocation a poussé à l'exil environ 200 000 protestants, au grand profit de la Prusse et des Provinces-Unies."
},
{
  id: "his-033", categorie: "histoire", niveau: 3, type: "qcm",
  question: "Quelle dynastie chinoise a fait construire la Cité interdite ?",
  choix: ["Les Ming", "Les Qing", "Les Tang", "Les Han"],
  reponse: 0,
  explication: "Achevée en 1420 sous l'empereur Yongle ; il aura fallu un million d'ouvriers et quatorze ans de chantier."
},
{
  id: "his-034", categorie: "histoire", niveau: 3, type: "clic_pays",
  question: "Cliquez sur le pays où s'est épanouie la civilisation minoenne.",
  reponse: "300",
  explication: "En Crète, autour du palais de Cnossos ; son écriture, le linéaire A, n'a toujours pas été déchiffrée."
},
{
  id: "his-035", categorie: "histoire", niveau: 3, type: "vrai_faux",
  question: "La plus courte guerre de l'histoire a duré moins d'une heure.",
  reponse: true,
  explication: "La guerre anglo-zanzibarienne du 27 août 1896 : 38 minutes de bombardement naval, et le palais du sultan s'est rendu."
},
{
  id: "his-036", categorie: "histoire", niveau: 3, type: "distance",
  question: "Cliquez sur le site de l'antique Carthage.",
  reponse: [36.8528, 10.3233],
  explication: "Dans la banlieue nord de Tunis. Rome a rasé la ville en 146 av. J.-C., puis l'a rebâtie un siècle plus tard comme capitale de province."
},
{
  id: "his-037", categorie: "histoire", niveau: 3, type: "qcm",
  question: "En quelle année le Japon a-t-il été contraint d'ouvrir ses ports par le commodore Perry ?",
  choix: ["1854", "1868", "1840", "1889"],
  reponse: 0,
  explication: "La convention de Kanagawa met fin à deux siècles de fermeture ; quatorze ans plus tard, l'ère Meiji lance la modernisation accélérée."
},
{
  id: "his-038", categorie: "histoire", niveau: 3, type: "chronologie",
  question: "Classez ces indépendances par ordre chronologique.",
  choix: [
    "Indépendance des États-Unis",
    "Indépendance d'Haïti",
    "Indépendance du Brésil",
    "Indépendance de l'Inde"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1776, 1804, 1822, 1947. Haïti est la première république noire du monde, née d'une révolte d'esclaves victorieuse."
},
{
  id: "his-039", categorie: "histoire", niveau: 3, type: "multi_pays",
  question: "Sélectionnez les deux pays nés de la dissolution de la Tchécoslovaquie.",
  reponse: ["203", "703"],
  explication: "Le « divorce de velours » du 1er janvier 1993 s'est fait sans référendum et sans une goutte de sang."
},
{
  id: "his-040", categorie: "histoire", niveau: 3, type: "qcm",
  question: "Qui fut le premier chancelier de l'Empire allemand en 1871 ?",
  choix: ["Otto von Bismarck", "Guillaume Ier", "Helmuth von Moltke", "Frédéric III"],
  reponse: 0,
  explication: "Le « chancelier de fer » a fait proclamer l'Empire dans la galerie des Glaces de Versailles, sur le sol du vaincu."
},
{
  id: "his-041", categorie: "histoire", niveau: 3, type: "vrai_faux",
  question: "Tous les pays européens ont adopté le calendrier grégorien la même année, en 1582.",
  reponse: false,
  explication: "L'Angleterre a attendu 1752 et la Russie 1918 : la révolution « d'Octobre » a donc eu lieu en novembre pour le reste du monde."
},
{
  id: "his-042", categorie: "histoire", niveau: 3, type: "clic_pays",
  question: "Cliquez sur le pays où fut signé, en 1494, le traité partageant le Nouveau Monde entre deux couronnes.",
  reponse: "724",
  explication: "Le traité de Tordesillas, en Castille, traçait un méridien : c'est ainsi que le Brésil est devenu portugais."
},
{
  id: "his-043", categorie: "histoire", niveau: 3, type: "qcm",
  question: "Quel peuple a fondé Carthage ?",
  choix: ["Les Phéniciens", "Les Grecs", "Les Étrusques", "Les Berbères"],
  reponse: 0,
  explication: "Des colons venus de Tyr, au IXe siècle av. J.-C. ; la légende attribue la fondation à la reine Élissa, la Didon de Virgile."
},
{
  id: "his-044", categorie: "histoire", niveau: 3, type: "chronologie",
  question: "Classez ces épisodes des croisades et de la fin de Byzance.",
  choix: [
    "Première croisade",
    "Sac de Constantinople par les croisés",
    "Chute de Saint-Jean-d'Acre",
    "Prise de Constantinople par Mehmed II"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1096, 1204, 1291, 1453. La quatrième croisade, détournée vers Constantinople, a pillé la capitale chrétienne qu'elle devait secourir."
},
{
  id: "his-045", categorie: "histoire", niveau: 3, type: "distance",
  question: "Cliquez sur Yalta, où se tint la conférence de février 1945.",
  reponse: [44.4952, 34.1663],
  explication: "En Crimée, dans un ancien palais tsariste : Roosevelt, Churchill et Staline y ont dessiné l'Europe de l'après-guerre."
}

]);

/* ------------------------- EXTENSION : 10 questions ------------------------ */
window.QUESTIONS.push(...[

{
  id: "his-046", categorie: "histoire", niveau: 1, type: "qcm",
  question: "Quelle civilisation a bâti les cités de Tikal et de Chichén Itzá ?",
  choix: ["Les Mayas", "Les Aztèques", "Les Incas", "Les Olmèques"],
  reponse: 0,
  explication: "Ils ont mis au point la seule écriture pleinement développée de l'Amérique précolombienne, déchiffrée seulement à partir des années 1950."
},
{
  id: "his-047", categorie: "histoire", niveau: 1, type: "vrai_faux",
  question: "Des Européens avaient atteint l'Amérique du Nord bien avant Christophe Colomb.",
  reponse: true,
  explication: "Le site viking de L'Anse aux Meadows, à Terre-Neuve, est daté d'environ l'an 1000, soit cinq siècles avant 1492."
},
{
  id: "his-048", categorie: "histoire", niveau: 1, type: "chronologie",
  question: "Classez ces constructions et événements du plus ancien au plus récent.",
  choix: [
    "Érection des grandes pierres de Stonehenge",
    "Fondation traditionnelle de Rome",
    "Achèvement du Colisée",
    "Couronnement de Guillaume le Conquérant"
  ],
  reponse: [0, 1, 2, 3],
  explication: "Vers -2500, -753, 80, 1066. Stonehenge était déjà un monument millénaire quand Rome n'était qu'un village de collines."
},
{
  id: "his-049", categorie: "histoire", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le pays où les révolutions de 1917 ont renversé le régime tsariste.",
  reponse: "643",
  explication: "Nicolas II abdique en mars ; sa famille et lui sont exécutés à Ekaterinbourg l'année suivante."
},
{
  id: "his-050", categorie: "histoire", niveau: 2, type: "qcm",
  question: "Quel ouvrage défensif les Romains ont-ils bâti dans le nord de l'actuelle Angleterre ?",
  choix: ["Le mur d'Hadrien", "Le limes de Germanie", "Le mur de Servius", "La ligne de Trajan"],
  reponse: 0,
  explication: "118 km d'une côte à l'autre, entamés vers 122. Il ne suit pas la frontière écossaise actuelle, qui passe plus au nord."
},
{
  id: "his-051", categorie: "histoire", niveau: 2, type: "chronologie",
  question: "Classez ces abolitions par ordre chronologique.",
  choix: [
    "Abolition de la traite négrière par le Royaume-Uni",
    "Abolition de l'esclavage dans les colonies françaises",
    "Abolition de l'esclavage aux États-Unis",
    "Abolition de l'esclavage au Brésil"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1807, 1848, 1865, 1888. Le Brésil, dernier pays des Amériques à abolir, avait reçu près de 40 % des Africains déportés."
},
{
  id: "his-052", categorie: "histoire", niveau: 2, type: "distance",
  question: "Cliquez sur le site de Pompéi.",
  reponse: [40.7497, 14.4869],
  explication: "Les corps ont laissé des cavités dans la cendre durcie ; au XIXe siècle, on les a remplies de plâtre pour retrouver les silhouettes."
},
{
  id: "his-053", categorie: "histoire", niveau: 3, type: "multi_pays",
  question: "Sélectionnez les quatre pays actuels qui correspondent au territoire de la Grande Colombie de Bolívar.",
  reponse: ["170", "862", "218", "591"],
  explication: "Colombie, Venezuela, Équateur et Panama. Ce dernier ne s'est séparé de la Colombie qu'en 1903, avec le soutien des États-Unis."
},
{
  id: "his-054", categorie: "histoire", niveau: 3, type: "chronologie",
  question: "Classez ces événements de l'Antiquité.",
  choix: [
    "Bataille de Marathon",
    "Mort d'Alexandre le Grand",
    "Bataille d'Actium",
    "Édit de Milan"
  ],
  reponse: [0, 1, 2, 3],
  explication: "-490, -323, -31, 313. Actium fait basculer l'Égypte dans l'orbite romaine ; l'édit de Milan, trois siècles plus tard, met fin aux persécutions des chrétiens."
},
{
  id: "his-055", categorie: "histoire", niveau: 3, type: "qcm",
  question: "Quel empire africain médiéval était dirigé par Mansa Moussa lors de son pèlerinage à La Mecque ?",
  choix: ["L'empire du Mali", "L'empire du Ghana", "L'empire Songhaï", "Le royaume d'Aksoum"],
  reponse: 0,
  explication: "En 1324, il aurait distribué tant d'or au Caire que le cours du métal y serait resté déprimé pendant une dizaine d'années."
}

]);

/* ------------------------- EXTENSION : 15 questions ------------------------ */
window.QUESTIONS.push(...[

{
  id: "his-056", categorie: "histoire", niveau: 1, type: "qcm",
  question: "Quel pharaon a fait édifier les temples d'Abou Simbel ?",
  choix: ["Ramsès II", "Toutânkhamon", "Khéops", "Akhenaton"],
  reponse: 0,
  explication: "Menacés par le lac de retenue du barrage d'Assouan, les temples ont été découpés en 1 000 blocs et remontés 65 m plus haut dans les années 1960."
},
{
  id: "his-057", categorie: "histoire", niveau: 1, type: "vrai_faux",
  question: "La révolution industrielle a débuté en France avant de gagner le Royaume-Uni.",
  reponse: false,
  explication: "Elle est née au Royaume-Uni dès les années 1760 : charbon abondant, capitaux disponibles et brevets protégés, avec le textile du Lancashire pour laboratoire."
},
{
  id: "his-058", categorie: "histoire", niveau: 1, type: "chronologie",
  question: "Classez ces périodes et règnes de l'Antiquité.",
  choix: [
    "Code de Hammurabi à Babylone",
    "Apogée de la Grèce classique",
    "Règne d'Auguste à Rome",
    "Règne de Justinien à Constantinople"
  ],
  reponse: [0, 1, 2, 3],
  explication: "Vers -1750, -450, -27, puis 527. Le code de Hammurabi, gravé sur une stèle de basalte, est l'un des plus anciens textes de loi conservés."
},
{
  id: "his-059", categorie: "histoire", niveau: 1, type: "clic_pays",
  question: "Cliquez sur le pays où fut scellée la Magna Carta en 1215.",
  reponse: "826",
  explication: "Arrachée au roi Jean sans Terre par ses barons à Runnymede, elle a été annulée par le pape dix semaines plus tard."
},
{
  id: "his-060", categorie: "histoire", niveau: 1, type: "qcm",
  question: "Comment appelle-t-on en français la guerre civile américaine de 1861-1865 ?",
  choix: ["La guerre de Sécession", "La guerre d'Indépendance", "La guerre du Mexique", "La conquête de l'Ouest"],
  reponse: 0,
  explication: "Environ 620 000 morts : plus que dans tous les autres conflits américains réunis jusqu'au Viêt Nam."
},
{
  id: "his-061", categorie: "histoire", niveau: 2, type: "chronologie",
  question: "Classez ces épisodes de la Révolution et de l'Empire.",
  choix: [
    "Prise de la Bastille",
    "Exécution de Louis XVI",
    "Coup d'État du 18 Brumaire",
    "Sacre de Napoléon empereur"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1789, 1793, 1799, 1804. Quinze ans seulement séparent la chute de la monarchie du retour d'un empereur."
},
{
  id: "his-062", categorie: "histoire", niveau: 2, type: "distance",
  question: "Cliquez sur Sarajevo, où fut assassiné l'archiduc François-Ferdinand.",
  reponse: [43.8563, 18.4131],
  explication: "Le 28 juin 1914. Le chauffeur s'était trompé de route et faisait marche arrière quand le tireur s'est retrouvé devant la voiture."
},
{
  id: "his-063", categorie: "histoire", niveau: 2, type: "qcm",
  question: "Quelle reine a régné sur l'Angleterre de 1558 à 1603 ?",
  choix: ["Élisabeth Ire", "Marie Tudor", "Anne Boleyn", "Victoria"],
  reponse: 0,
  explication: "Son règne voit la défaite de l'Invincible Armada et les débuts de Shakespeare ; elle ne s'est jamais mariée, d'où son surnom de reine vierge."
},
{
  id: "his-064", categorie: "histoire", niveau: 2, type: "vrai_faux",
  question: "Le mot « boycott » vient du nom d'une personne.",
  reponse: true,
  explication: "Charles Boycott, régisseur d'un domaine irlandais, fut mis au ban par les fermiers en 1880 ; son nom est passé en quelques mois dans plusieurs langues."
},
{
  id: "his-065", categorie: "histoire", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le pays où s'est déroulée la Longue Marche de 1934-1935.",
  reponse: "156",
  explication: "Environ 9 000 km parcourus par l'Armée rouge chinoise pour échapper à l'encerclement nationaliste ; c'est là que Mao s'impose à la tête du parti."
},
{
  id: "his-066", categorie: "histoire", niveau: 3, type: "chronologie",
  question: "Classez ces événements du monde chrétien.",
  choix: [
    "Constantinople devient capitale impériale",
    "Schisme entre Rome et Constantinople",
    "Chute de Grenade, fin de la Reconquista",
    "Paix d'Augsbourg"
  ],
  reponse: [0, 1, 2, 3],
  explication: "330, 1054, 1492, 1555. La paix d'Augsbourg pose le principe « tel prince, telle religion », qui laisse le choix au souverain, pas aux sujets."
},
{
  id: "his-067", categorie: "histoire", niveau: 3, type: "qcm",
  question: "Quelle découverte de la campagne d'Égypte a permis de déchiffrer les hiéroglyphes ?",
  choix: ["La pierre de Rosette", "Le papyrus d'Ebers", "L'obélisque de Louxor", "Le sarcophage de Séthi Ier"],
  reponse: 0,
  explication: "Trouvée en 1799 par des soldats français, saisie par les Britanniques en 1801 : elle est au British Museum, et c'est Champollion qui la déchiffre en 1822."
},
{
  id: "his-068", categorie: "histoire", niveau: 3, type: "multi_pays",
  question: "Sélectionnez les trois puissances de la Triple-Entente en 1914.",
  reponse: ["250", "826", "643"],
  explication: "France, Royaume-Uni et Russie. L'Entente n'était pas une véritable alliance militaire : Londres n'était juridiquement tenue à rien."
},
{
  id: "his-069", categorie: "histoire", niveau: 3, type: "vrai_faux",
  question: "L'Empire romain d'Orient s'est effondré quelques décennies après celui d'Occident.",
  reponse: false,
  explication: "Il lui a survécu près de mille ans : 476 à Rome, 1453 à Constantinople. Ses habitants ne se disaient d'ailleurs pas Byzantins, mais Romains."
},
{
  id: "his-070", categorie: "histoire", niveau: 3, type: "distance",
  question: "Cliquez sur le site de l'antique Troie.",
  reponse: [39.9575, 26.2389],
  explication: "Sur la côte turque. Schliemann y a creusé si brutalement en 1870 qu'il a traversé la couche correspondant à la Troie d'Homère."
}

]);

/* =============================================================================
   HISTOIRE — deuxième série (40 questions)
   ============================================================================= */
window.QUESTIONS.push(...[

/* ------------------------------- NIVEAU 1 --------------------------------- */
{
  id: "his-072", categorie: "histoire", niveau: 1, type: "vrai_faux",
  question: "Jules César a été assassiné aux ides de mars.",
  reponse: true,
  explication: "Le 15 mars 44 av. J.-C., au pied de la statue de son rival Pompée. Sa mort a précipité la fin de la République, qu'elle prétendait sauver."
},
{
  id: "his-074", categorie: "histoire", niveau: 1, type: "chronologie",
  question: "Classez ces grandes périodes historiques.",
  choix: ["La Préhistoire", "L'Antiquité", "Le Moyen Âge", "La Renaissance"],
  reponse: [0, 1, 2, 3],
  explication: "La frontière entre Préhistoire et Antiquité n'est pas une date mais une technique : l'apparition de l'écriture, vers 3300 av. J.-C."
},
{
  id: "his-075", categorie: "histoire", niveau: 1, type: "qcm",
  question: "Quelle civilisation a construit les pyramides de Gizeh ?",
  choix: ["Les Égyptiens", "Les Mésopotamiens", "Les Mayas", "Les Phéniciens"],
  reponse: 0,
  explication: "Elles ont été bâties vers 2560 av. J.-C. Cléopâtre vivait plus près de nous que de leur construction."
},
{
  id: "his-077", categorie: "histoire", niveau: 1, type: "vrai_faux",
  question: "La Seconde Guerre mondiale s'est achevée en 1945.",
  reponse: true,
  explication: "En mai en Europe, en septembre en Asie. Le dernier soldat japonais à se rendre officiellement l'a fait en 1974, aux Philippines."
},
{
  id: "his-078", categorie: "histoire", niveau: 1, type: "qcm",
  question: "Qui a atteint l'Amérique pour les Européens en 1492 ?",
  choix: ["Christophe Colomb", "Vasco de Gama", "Amerigo Vespucci", "Jacques Cartier"],
  reponse: 0,
  explication: "Il est mort convaincu d'avoir touché les Indes. Le continent porte le prénom d'un autre navigateur, Amerigo Vespucci, qui comprit qu'il s'agissait de terres inconnues."
},
{
  id: "his-079", categorie: "histoire", niveau: 1, type: "clic_pays",
  question: "Cliquez sur la Grèce, berceau de la démocratie.",
  reponse: "300",
  explication: "À Athènes, la démocratie ne concernait qu'une petite minorité : ni les femmes, ni les esclaves, ni les étrangers ne votaient."
},
{
  id: "his-080", categorie: "histoire", niveau: 1, type: "qcm",
  question: "Quel roi de France a fait édifier le château de Versailles tel qu'on le connaît ?",
  choix: ["Louis XIV", "François Ier", "Henri IV", "Louis XVI"],
  reponse: 0,
  explication: "Il y a installé la cour en 1682 pour tenir la noblesse sous son regard : y obtenir une chambre valait mieux qu'un domaine en province."
},
{
  id: "his-081", categorie: "histoire", niveau: 1, type: "vrai_faux",
  question: "Napoléon est mort sur l'île de Sainte-Hélène.",
  reponse: true,
  explication: "En 1821, après six ans d'exil sur un caillou de l'Atlantique sud, à 1 900 km de la première côte : les Britanniques avaient retenu la leçon de l'île d'Elbe."
},
{
  id: "his-082", categorie: "histoire", niveau: 1, type: "qcm",
  question: "Quelle guerre a opposé le Nord et le Sud des États-Unis ?",
  choix: ["La guerre de Sécession", "La guerre d'Indépendance", "La guerre de 1812", "La guerre hispano-américaine"],
  reponse: 0,
  explication: "1861-1865. Elle a fait plus de morts américains que tous les autres conflits du pays réunis, y compris les deux guerres mondiales."
},
{
  id: "his-084", categorie: "histoire", niveau: 1, type: "qcm",
  question: "Quel peuple a bâti la cité de Machu Picchu ?",
  choix: ["Les Incas", "Les Mayas", "Les Aztèques", "Les Olmèques"],
  reponse: 0,
  explication: "Les Incas n'utilisaient ni la roue, ni le fer, ni l'écriture, et ont pourtant ajusté des blocs de plusieurs tonnes sans le moindre mortier."
},

/* ------------------------------- NIVEAU 2 --------------------------------- */
{
  id: "his-085", categorie: "histoire", niveau: 2, type: "qcm",
  question: "En quelle année Constantinople est-elle tombée aux mains des Ottomans ?",
  choix: ["1453", "1204", "1492", "1517"],
  reponse: 0,
  explication: "La date sert souvent de borne finale au Moyen Âge. Les canons employés étaient si lourds qu'il fallait soixante bœufs pour déplacer le plus gros."
},
{
  id: "his-086", categorie: "histoire", niveau: 2, type: "vrai_faux",
  question: "La Déclaration des droits de l'homme et du citoyen date de 1789.",
  reponse: true,
  explication: "Adoptée le 26 août. Elle figure toujours en tête de la Constitution française actuelle et a donc valeur de droit positif, pas seulement de symbole."
},
{
  id: "his-087", categorie: "histoire", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le Pérou, cœur de l'ancien Empire inca.",
  reponse: "604",
  explication: "L'empire s'étendait sur 4 000 km le long des Andes, relié par un réseau routier de 40 000 km parcouru par des coureurs à relais."
},
{
  id: "his-091", categorie: "histoire", niveau: 2, type: "vrai_faux",
  question: "Jeanne d'Arc a été brûlée à Rouen.",
  reponse: true,
  explication: "En 1431, à dix-neuf ans. Un second procès l'a réhabilitée vingt-cinq ans plus tard, et elle n'a été canonisée qu'en 1920."
},
{
  id: "his-092", categorie: "histoire", niveau: 2, type: "qcm",
  question: "Quel empire Gengis Khan a-t-il fondé ?",
  choix: ["L'Empire mongol", "L'Empire ottoman", "L'Empire perse", "L'Empire moghol"],
  reponse: 0,
  explication: "Le plus vaste empire continu de l'histoire. On y circulait si sûrement qu'un dicton voulait qu'une jeune fille chargée d'or puisse le traverser seule."
},
{
  id: "his-094", categorie: "histoire", niveau: 2, type: "qcm",
  question: "Quelle bataille de 1815 met fin à l'épopée napoléonienne ?",
  choix: ["Waterloo", "Austerlitz", "Leipzig", "Iéna"],
  reponse: 0,
  explication: "Napoléon y perd en une journée. Il abdique quatre jours plus tard, après un retour au pouvoir qui n'aura duré que cent jours."
},
{
  id: "his-095", categorie: "histoire", niveau: 2, type: "vrai_faux",
  question: "Gutenberg a inventé l'imprimerie à caractères mobiles en Europe au XVe siècle.",
  reponse: true,
  explication: "La Chine et la Corée l'avaient devancé de plusieurs siècles, mais l'alphabet latin, avec sa trentaine de signes, rendait le procédé bien plus rentable."
},
{
  id: "his-096", categorie: "histoire", niveau: 2, type: "qcm",
  question: "Quel pharaon a vu sa tombe découverte quasiment intacte en 1922 ?",
  choix: ["Toutânkhamon", "Ramsès II", "Khéops", "Akhenaton"],
  reponse: 0,
  explication: "Un souverain mineur, mort vers dix-huit ans. Sa tombe modeste avait été recouverte de gravats, ce qui l'a dérobée aux pilleurs pendant trente siècles."
},
{
  id: "his-097", categorie: "histoire", niveau: 2, type: "clic_pays",
  question: "Cliquez sur la Chine, où fut inventé le papier.",
  reponse: "156",
  explication: "Vers l'an 105. Le procédé a mis plus de mille ans à atteindre l'Europe, en passant par le monde arabe après la bataille de Talas."
},
{
  id: "his-098", categorie: "histoire", niveau: 2, type: "qcm",
  question: "Quelle dynastie a bâti l'essentiel de la Grande Muraille visible aujourd'hui ?",
  choix: ["Les Ming", "Les Han", "Les Qin", "Les Tang"],
  reponse: 0,
  explication: "Les premières murailles sont bien plus anciennes, mais elles étaient en terre battue. Les Ming les ont rebâties en pierre entre le XIVe et le XVIIe siècle."
},

/* ------------------------------- NIVEAU 3 --------------------------------- */
{
  id: "his-099", categorie: "histoire", niveau: 3, type: "qcm",
  question: "En quelle année l'Empire romain d'Occident a-t-il disparu ?",
  choix: ["476", "410", "395", "527"],
  reponse: 0,
  explication: "La déposition du dernier empereur est passée presque inaperçue sur le moment : l'Empire d'Orient, lui, a survécu encore mille ans."
},
{
  id: "his-100", categorie: "histoire", niveau: 3, type: "qcm",
  question: "Quel édit de 1598 accorde la liberté de culte aux protestants français ?",
  choix: ["L'édit de Nantes", "L'édit de Fontainebleau", "L'édit de Villers-Cotterêts", "L'édit de Saint-Germain"],
  reponse: 0,
  explication: "Signé par Henri IV, ancien protestant converti. Louis XIV l'a révoqué en 1685, poussant des centaines de milliers de huguenots à l'exil."
},
{
  id: "his-102", categorie: "histoire", niveau: 3, type: "chronologie",
  question: "Classez ces empereurs romains par ordre de règne.",
  choix: ["Auguste", "Néron", "Trajan", "Constantin"],
  reponse: [0, 1, 2, 3],
  explication: "-27, 54, 98 et 306. Sous Trajan, l'Empire atteint son extension maximale ; sous Constantin, il devient chrétien."
},
{
  id: "his-103", categorie: "histoire", niveau: 3, type: "qcm",
  question: "Quelle expédition a réalisé le premier tour du monde, entre 1519 et 1522 ?",
  choix: ["Celle de Magellan", "Celle de Vasco de Gama", "Celle de Francis Drake", "Celle de James Cook"],
  reponse: 0,
  explication: "Magellan est mort en route, aux Philippines. C'est Elcano qui a ramené l'unique navire rescapé, avec dix-huit hommes sur les deux cent quarante partis."
},
{
  id: "his-104", categorie: "histoire", niveau: 3, type: "distance",
  question: "Cliquez sur l'emplacement d'Istanbul, l'ancienne Constantinople.",
  reponse: [41.0082, 28.9784],
  explication: "Capitale de trois empires successifs : romain d'Orient, latin puis ottoman. Elle a cessé d'être capitale en 1923, au profit d'Ankara."
},
{
  id: "his-105", categorie: "histoire", niveau: 3, type: "vrai_faux",
  question: "La révolution russe dite « d'Octobre » a eu lieu en novembre dans notre calendrier.",
  reponse: true,
  explication: "La Russie utilisait encore le calendrier julien, en retard de treize jours. Le régime né de cette révolution a adopté le calendrier grégorien quelques mois plus tard."
},
{
  id: "his-106", categorie: "histoire", niveau: 3, type: "qcm",
  question: "Quel roi d'Angleterre a rompu avec Rome pour fonder l'Église anglicane ?",
  choix: ["Henri VIII", "Édouard VI", "Jacques Ier", "Richard III"],
  reponse: 0,
  explication: "La rupture est née d'un refus d'annulation de mariage. Le pape avait pourtant décerné au même souverain le titre de « défenseur de la foi », que la couronne porte toujours."
},
{
  id: "his-107", categorie: "histoire", niveau: 3, type: "multi_pays",
  question: "Sélectionnez les trois pays dont les dirigeants se sont réunis à Yalta en 1945.",
  reponse: ["840", "826", "643"],
  explication: "Roosevelt, Churchill et Staline, pour l'URSS dont la Russie est l'État continuateur. Ils y ont dessiné le partage de l'Europe d'après-guerre."
},
{
  id: "his-108", categorie: "histoire", niveau: 3, type: "qcm",
  question: "Quel serment du 20 juin 1789 engage les députés à ne pas se séparer avant d'avoir doté la France d'une Constitution ?",
  choix: ["Le serment du Jeu de paume", "Le serment de Strasbourg", "Le serment du Grütli", "Le serment des Horaces"],
  reponse: 0,
  explication: "Prêté dans une salle de jeu de paume parce que la salle habituelle avait été fermée sur ordre du roi, officiellement pour travaux."
},
{
  id: "his-109", categorie: "histoire", niveau: 3, type: "vrai_faux",
  question: "Le Titanic a coulé lors de son voyage inaugural.",
  reponse: true,
  explication: "En avril 1912, cinq jours après son départ. Il emportait vingt canots pour plus de deux mille deux cents personnes, un chiffre alors parfaitement légal."
},
{
  id: "his-110", categorie: "histoire", niveau: 3, type: "qcm",
  question: "Quelle bataille de 732 est traditionnellement présentée comme un coup d'arrêt à l'expansion musulmane en Gaule ?",
  choix: ["Poitiers", "Roncevaux", "Alésia", "Bouvines"],
  reponse: 0,
  explication: "Charles Martel y affronte une expédition omeyyade. Les historiens actuels y voient plutôt un raid repoussé qu'une invasion arrêtée."
}

]);

/* =============================================================================
   HISTOIRE — frises et ordres de grandeur
   - frise    : reponse = annee (negative avant J.-C.), min/max bornent le curseur
   - grandeur : reponse = nombre, unite = libelle affiche, min/max bornent
                l'echelle logarithmique
   ============================================================================= */
window.QUESTIONS.push(...[
{
  id: "his-150", categorie: "histoire", niveau: 1, type: "frise",
  question: "En quelle année Guillaume le Conquérant a-t-il remporté la bataille d'Hastings ?",
  reponse: 1066, min: 900, max: 1300,
  explication: "La tapisserie de Bayeux raconte cette journée sur près de 70 mètres de broderie, réalisée quelques années seulement après les faits."
},
{
  id: "his-151", categorie: "histoire", niveau: 1, type: "frise",
  question: "En quelle année Charlemagne a-t-il été couronné empereur à Rome ?",
  reponse: 800, min: 600, max: 1100,
  explication: "Le jour de Noël, par surprise selon son biographe : il aurait déclaré qu'il ne serait pas entré dans l'église s'il avait connu les intentions du pape."
},
{
  id: "his-152", categorie: "histoire", niveau: 2, type: "frise",
  question: "En quelle année la Grande Charte, la Magna Carta, a-t-elle été scellée en Angleterre ?",
  reponse: 1215, min: 1000, max: 1500,
  explication: "Arrachée au roi Jean par ses barons révoltés. Trois de ses clauses sont encore en vigueur dans le droit britannique."
},
{
  id: "his-153", categorie: "histoire", niveau: 2, type: "frise",
  question: "En quelle année Louis XIV est-il mort ?",
  reponse: 1715, min: 1600, max: 1800,
  explication: "Soixante-douze ans de règne, le plus long de l'histoire de France. Son arrière-petit-fils, qui lui succède, a cinq ans."
},
{
  id: "his-154", categorie: "histoire", niveau: 2, type: "frise",
  question: "En quelle année l'esclavage a-t-il été définitivement aboli en France ?",
  reponse: 1848, min: 1750, max: 1900,
  explication: "Une première abolition, en 1794, avait été annulée par Bonaparte huit ans plus tard. Celle de 1848 est l'œuvre de Victor Schœlcher."
},
{
  id: "his-155", categorie: "histoire", niveau: 2, type: "frise",
  question: "En quelle année les frères Wright ont-ils réalisé le premier vol motorisé ?",
  reponse: 1903, min: 1850, max: 1950,
  explication: "Douze secondes et trente-sept mètres pour le premier essai. Le quatrième de la journée a duré presque une minute."
},
{
  id: "his-156", categorie: "histoire", niveau: 1, type: "frise",
  question: "En quelle année a eu lieu le débarquement de Normandie ?",
  reponse: 1944, min: 1900, max: 1980,
  explication: "Près de 7 000 navires engagés en une seule journée, la plus grande opération amphibie jamais montée."
},
{
  id: "his-157", categorie: "histoire", niveau: 3, type: "frise",
  question: "Vers quelle année Gutenberg a-t-il mis au point son imprimerie à caractères mobiles ?",
  reponse: 1450, min: 1300, max: 1600,
  explication: "Sa Bible, imprimée vers 1455, a demandé environ trois ans de travail pour cent quatre-vingts exemplaires."
},
{
  id: "his-158", categorie: "histoire", niveau: 2, type: "grandeur",
  question: "Quelle est la hauteur actuelle de la pyramide de Khéops ?",
  reponse: 139, unite: "m", min: 20, max: 600,
  explication: "146 m à l'origine : elle a perdu son revêtement de calcaire poli, réemployé au Caire. Elle est restée la plus haute construction humaine pendant près de quatre mille ans."
},
{
  id: "his-159", categorie: "histoire", niveau: 3, type: "grandeur",
  question: "Quelle longueur totale atteint la Grande Muraille de Chine, branches comprises ?",
  reponse: 21196, unite: "km", min: 500, max: 200000,
  explication: "Chiffre d'un relevé officiel de 2012, bien supérieur aux estimations antérieures : il additionne tous les tronçons de toutes les époques."
},
{
  id: "his-160", categorie: "histoire", niveau: 3, type: "grandeur",
  question: "Quel âge ont approximativement les peintures de la grotte de Lascaux ?",
  reponse: 17000, unite: "ans", min: 1000, max: 500000,
  explication: "La grotte a été refermée au public dès 1963 : le gaz carbonique des visiteurs attaquait les pigments plus vite que les millénaires."
}
]);
