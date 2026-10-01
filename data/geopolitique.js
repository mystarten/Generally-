/* =============================================================================
   GÉOPOLITIQUE — 69 questions
   Conventions identiques à data/geographie.js.
   ============================================================================= */
window.QUESTIONS = window.QUESTIONS || [];
window.QUESTIONS.push(...[

/* ------------------------------- NIVEAU 1 --------------------------------- */
{
  id: "gpo-001", categorie: "geopolitique", niveau: 1, type: "qcm",
  question: "Combien de membres permanents siègent au Conseil de sécurité de l'ONU ?",
  choix: ["5", "7", "10", "15"],
  reponse: 0,
  explication: "Ces cinq-là disposent du droit de veto ; les dix autres sièges tournent tous les deux ans."
},
{
  id: "gpo-002", categorie: "geopolitique", niveau: 1, type: "multi_pays",
  question: "Sélectionnez les cinq membres permanents du Conseil de sécurité de l'ONU.",
  reponse: ["840", "643", "156", "826", "250"],
  explication: "États-Unis, Russie, Chine, Royaume-Uni et France : les vainqueurs de 1945, figés dans la Charte depuis."
},
{
  id: "gpo-003", categorie: "geopolitique", niveau: 1, type: "vrai_faux",
  question: "La Suisse est membre de l'Union européenne.",
  reponse: false,
  explication: "Elle a même retiré sa candidature en 2016 ; ses relations avec l'UE reposent sur une centaine d'accords bilatéraux."
},
{
  id: "gpo-004", categorie: "geopolitique", niveau: 1, type: "qcm",
  question: "Dans quelle ville se trouve le siège de l'ONU ?",
  choix: ["New York", "Genève", "Bruxelles", "Vienne"],
  reponse: 0,
  explication: "Le terrain a été offert par John D. Rockefeller Jr. en 1946 ; l'enceinte est un territoire international."
},
{
  id: "gpo-005", categorie: "geopolitique", niveau: 1, type: "clic_pays",
  question: "Cliquez sur le pays qui accueille le siège de l'OTAN.",
  reponse: "056",
  explication: "L'Alliance s'est installée à Bruxelles en 1967 après avoir été priée de quitter Paris par le général de Gaulle."
},
{
  id: "gpo-006", categorie: "geopolitique", niveau: 1, type: "qcm",
  question: "Que symbolisent les douze étoiles du drapeau européen ?",
  choix: [
    "La perfection et l'unité, sans lien avec le nombre d'États",
    "Les douze pays fondateurs",
    "Les douze langues officielles d'origine",
    "Les douze mois de l'année"
  ],
  reponse: 0,
  explication: "Le nombre est resté inchangé malgré tous les élargissements : douze est un chiffre de plénitude, pas un compteur."
},
{
  id: "gpo-007", categorie: "geopolitique", niveau: 1, type: "distance",
  question: "Cliquez sur l'emplacement de Bruxelles.",
  reponse: [50.8503, 4.3517],
  explication: "La ville abrite la Commission, le Conseil et l'OTAN : c'est la deuxième concentration de diplomates au monde après New York."
},
{
  id: "gpo-008", categorie: "geopolitique", niveau: 1, type: "vrai_faux",
  question: "Le Royaume-Uni a officiellement quitté l'Union européenne en 2020.",
  reponse: true,
  explication: "Sortie effective le 31 janvier 2020, trois ans et demi après le référendum de juin 2016."
},
{
  id: "gpo-009", categorie: "geopolitique", niveau: 1, type: "qcm",
  question: "Quelle est la monnaie de la Suède ?",
  choix: ["La couronne suédoise", "L'euro", "Le franc suédois", "Le mark"],
  reponse: 0,
  explication: "Les Suédois ont dit non à l'euro par référendum en 2003 et gardent leur couronne, la krona."
},
{
  id: "gpo-010", categorie: "geopolitique", niveau: 1, type: "qcm",
  question: "Quelle organisation regroupe les principaux pays exportateurs de pétrole ?",
  choix: ["L'OPEP", "L'OMC", "L'AIEA", "Le FMI"],
  reponse: 0,
  explication: "Fondée à Bagdad en 1960 par cinq pays, elle pèse encore environ un tiers de la production mondiale de brut."
},
{
  id: "gpo-011", categorie: "geopolitique", niveau: 1, type: "vrai_faux",
  question: "La Turquie a demandé son adhésion à l'OTAN mais ne l'a jamais obtenue.",
  reponse: false,
  explication: "Elle est membre depuis 1952 et aligne la deuxième armée de l'Alliance en effectifs, après les États-Unis."
},
{
  id: "gpo-012", categorie: "geopolitique", niveau: 1, type: "multi_pays",
  question: "Sélectionnez les trois pays nordiques membres de l'Union européenne.",
  reponse: ["208", "752", "246"],
  explication: "Danemark, Suède et Finlande ; la Norvège a refusé l'adhésion par deux fois et l'Islande n'a jamais franchi le pas."
},
{
  id: "gpo-013", categorie: "geopolitique", niveau: 1, type: "clic_pays",
  question: "Cliquez sur le pays le plus peuplé d'Afrique.",
  reponse: "566",
  explication: "Le Nigeria approche les 230 millions d'habitants et pourrait devenir le troisième pays le plus peuplé du monde d'ici 2050."
},
{
  id: "gpo-014", categorie: "geopolitique", niveau: 1, type: "qcm",
  question: "Combien d'États membres compte l'Union européenne ?",
  choix: ["27", "25", "28", "30"],
  reponse: 0,
  explication: "Vingt-huit avant le Brexit, vingt-sept depuis 2020 ; la Croatie, entrée en 2013, est la dernière arrivée."
},

/* ------------------------------- NIVEAU 2 --------------------------------- */
{
  id: "gpo-015", categorie: "geopolitique", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le pays où siège la Cour pénale internationale.",
  reponse: "528",
  explication: "La CPI est installée à La Haye, ville qui concentre aussi la Cour internationale de justice et Europol."
},
{
  id: "gpo-016", categorie: "geopolitique", niveau: 2, type: "qcm",
  question: "Quel organe de l'ONU réunit l'ensemble des États membres, chacun avec une voix ?",
  choix: ["L'Assemblée générale", "Le Conseil de sécurité", "Le Secrétariat", "Le Conseil économique et social"],
  reponse: 0,
  explication: "Une voix pour Nauru comme pour la Chine : c'est le seul lieu où la taille d'un pays ne change rien au vote."
},
{
  id: "gpo-017", categorie: "geopolitique", niveau: 2, type: "vrai_faux",
  question: "Taïwan est un État membre de l'ONU.",
  reponse: false,
  explication: "Le siège chinois est passé à Pékin en 1971 par la résolution 2758 ; Taipei n'y a plus de représentation."
},
{
  id: "gpo-018", categorie: "geopolitique", niveau: 2, type: "multi_pays",
  question: "Sélectionnez les neuf pays qui bordent la mer Baltique.",
  reponse: ["752", "246", "233", "428", "440", "616", "276", "208", "643"],
  explication: "Depuis l'entrée de la Finlande et de la Suède dans l'OTAN, la Russie est le seul riverain non membre de l'Alliance."
},
{
  id: "gpo-019", categorie: "geopolitique", niveau: 2, type: "distance",
  question: "Cliquez sur l'emplacement de Washington D.C.",
  reponse: [38.9072, -77.0369],
  explication: "Le district fédéral n'appartient à aucun État et ses habitants n'ont pas de sénateur : « taxation without representation »."
},
{
  id: "gpo-020", categorie: "geopolitique", niveau: 2, type: "qcm",
  question: "Quel pays a aboli son armée permanente en 1948 ?",
  choix: ["Le Costa Rica", "L'Islande", "Le Panama", "L'Uruguay"],
  reponse: 0,
  explication: "Le président Figueres a fait démolir symboliquement un mur de la caserne Bellavista et réaffecté le budget à l'éducation."
},
{
  id: "gpo-021", categorie: "geopolitique", niveau: 2, type: "vrai_faux",
  question: "L'euro est la monnaie officielle de tous les pays de l'Union européenne.",
  reponse: false,
  explication: "Plusieurs États gardent leur monnaie, dont la Suède, la Pologne, la Hongrie, la Tchéquie, la Roumanie et le Danemark."
},
{
  id: "gpo-022", categorie: "geopolitique", niveau: 2, type: "qcm",
  question: "Dans quelle ville le Parlement européen tient-il ses sessions plénières ?",
  choix: ["Strasbourg", "Bruxelles", "Luxembourg", "Francfort"],
  reponse: 0,
  explication: "Le siège strasbourgeois est inscrit dans les traités : chaque mois, le Parlement déménage depuis Bruxelles pour quatre jours."
},
{
  id: "gpo-023", categorie: "geopolitique", niveau: 2, type: "qcm",
  question: "Quel drapeau porte un cercle rouge et bleu entouré de quatre trigrammes noirs ?",
  choix: ["Corée du Sud", "Japon", "Mongolie", "Taïwan"],
  reponse: 0,
  explication: "Le cercle central est le taegeuk, symbole d'équilibre ; les quatre trigrammes noirs viennent du Yi King."
},
{
  id: "gpo-024", categorie: "geopolitique", niveau: 2, type: "multi_pays",
  question: "Sélectionnez les deux pays issus de l'ex-Yougoslavie qui sont membres de l'Union européenne.",
  reponse: ["705", "191"],
  explication: "La Slovénie est entrée en 2004 et la Croatie en 2013 ; les autres républiques sont encore candidates."
},
{
  id: "gpo-025", categorie: "geopolitique", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le pays dont Kaliningrad est une enclave sur la Baltique.",
  reponse: "643",
  explication: "Ancienne Königsberg prussienne, la ville est devenue soviétique en 1945 et se retrouve aujourd'hui séparée de la Russie par l'UE."
},
{
  id: "gpo-026", categorie: "geopolitique", niveau: 2, type: "vrai_faux",
  question: "Le Groenland fait partie de l'Union européenne.",
  reponse: false,
  explication: "Territoire danois autonome, il en est sorti en 1985 après un référendum portant surtout sur les quotas de pêche."
},
{
  id: "gpo-027", categorie: "geopolitique", niveau: 2, type: "qcm",
  question: "Quel traité, signé en 1992, a créé l'Union européenne ?",
  choix: ["Le traité de Maastricht", "Le traité de Rome", "Le traité de Lisbonne", "L'Acte unique européen"],
  reponse: 0,
  explication: "Il a institué la citoyenneté européenne et posé les bases de l'euro, dix ans avant l'arrivée des premières pièces."
},
{
  id: "gpo-028", categorie: "geopolitique", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le pays devenu indépendant en 2011, le plus jeune État membre de l'ONU.",
  reponse: "728",
  explication: "Le Soudan du Sud s'est séparé de Khartoum après un référendum approuvé à près de 99 %."
},
{
  id: "gpo-029", categorie: "geopolitique", niveau: 2, type: "vrai_faux",
  question: "Le gouvernement bolivien siège à Sucre, la capitale constitutionnelle du pays.",
  reponse: false,
  explication: "Sucre est bien la capitale constitutionnelle et le siège de la Cour suprême, mais gouvernement et Parlement siègent à La Paz."
},
{
  id: "gpo-030", categorie: "geopolitique", niveau: 2, type: "qcm",
  question: "Quelle organisation a succédé à l'Organisation de l'unité africaine en 2002 ?",
  choix: ["L'Union africaine", "La CEDEAO", "Le NEPAD", "La SADC"],
  reponse: 0,
  explication: "Inspirée de l'UE, elle s'est dotée d'un Parlement panafricain et d'un principe d'intervention en cas de crime de masse."
},

/* ------------------------------- NIVEAU 3 --------------------------------- */
{
  id: "gpo-031", categorie: "geopolitique", niveau: 3, type: "multi_pays",
  question: "Sélectionnez les sept pays membres du G7.",
  reponse: ["840", "124", "826", "250", "276", "380", "392"],
  explication: "Né d'une réunion informelle à Rambouillet en 1975, le groupe a compté la Russie de 1997 à 2014 sous le nom de G8."
},
{
  id: "gpo-032", categorie: "geopolitique", niveau: 3, type: "distance",
  question: "Cliquez sur Panmunjeom, le village de la zone démilitarisée entre les deux Corées.",
  reponse: [37.9556, 126.6769],
  explication: "L'armistice de 1953 y a été signé, mais aucun traité de paix n'a jamais suivi : les deux Corées restent techniquement en guerre."
},
{
  id: "gpo-033", categorie: "geopolitique", niveau: 3, type: "clic_pays",
  question: "Cliquez sur le seul pays d'Amérique du Sud encore membre de l'OPEP.",
  reponse: "862",
  explication: "Le Venezuela est l'un des cinq fondateurs de l'organisation et détient les plus grandes réserves prouvées du monde."
},
{
  id: "gpo-034", categorie: "geopolitique", niveau: 3, type: "qcm",
  question: "Quel pays reconnaît seize langues officielles dans sa constitution ?",
  choix: ["Le Zimbabwe", "L'Inde", "L'Afrique du Sud", "La Bolivie"],
  reponse: 0,
  explication: "La constitution zimbabwéenne de 2013 place sur un pied d'égalité l'anglais, le shona, le ndébélé et treize autres langues, dont la langue des signes."
},
{
  id: "gpo-035", categorie: "geopolitique", niveau: 3, type: "qcm",
  question: "Quelle est la plus ancienne république encore existante ?",
  choix: ["Saint-Marin", "La Suisse", "L'Islande", "Les Pays-Bas"],
  reponse: 0,
  explication: "Saint-Marin revendique une fondation en l'an 301 et fonctionne toujours avec deux capitaines-régents élus pour six mois."
},
{
  id: "gpo-036", categorie: "geopolitique", niveau: 3, type: "multi_pays",
  question: "Sélectionnez les cinq pays riverains de la mer Caspienne.",
  reponse: ["643", "398", "795", "364", "031"],
  explication: "Russie, Kazakhstan, Turkménistan, Iran et Azerbaïdjan ont mis vingt ans à s'entendre sur son statut, signé à Aktaou en 2018."
},
{
  id: "gpo-037", categorie: "geopolitique", niveau: 3, type: "vrai_faux",
  question: "Le Conseil de l'Europe et le Conseil européen sont deux noms de la même institution.",
  reponse: false,
  explication: "Le Conseil de l'Europe, basé à Strasbourg, réunit 46 États et gère la Cour européenne des droits de l'homme ; le Conseil européen réunit les chefs d'État de l'UE."
},
{
  id: "gpo-038", categorie: "geopolitique", niveau: 3, type: "distance",
  question: "Cliquez sur l'emplacement de Genève.",
  reponse: [46.2044, 6.1432],
  explication: "La ville héberge l'ONU européenne, l'OMS, l'OMC et le CICR : près de 40 organisations internationales pour 200 000 habitants."
},
{
  id: "gpo-039", categorie: "geopolitique", niveau: 3, type: "qcm",
  question: "Quel pays possède, avec le Vatican, l'un des deux seuls drapeaux nationaux carrés ?",
  choix: ["Suisse", "Autriche", "Danemark", "Géorgie"],
  reponse: 0,
  explication: "La croix rouge de la Croix-Rouge est le drapeau suisse aux couleurs inversées, en hommage à son fondateur genevois Henry Dunant."
},
{
  id: "gpo-040", categorie: "geopolitique", niveau: 3, type: "clic_pays",
  question: "Cliquez sur le plus vaste pays hispanophone d'Amérique du Sud.",
  reponse: "032",
  explication: "L'Argentine couvre 2,78 millions de km², soit près de cinq fois la France métropolitaine."
},
{
  id: "gpo-041", categorie: "geopolitique", niveau: 3, type: "qcm",
  question: "Combien d'États membres compte l'ONU ?",
  choix: ["193", "185", "199", "206"],
  reponse: 0,
  explication: "Cinquante et un à la création en 1945 ; le dernier entré est le Soudan du Sud en 2011."
},
{
  id: "gpo-042", categorie: "geopolitique", niveau: 3, type: "vrai_faux",
  question: "La Palestine dispose du statut d'État observateur non membre à l'ONU.",
  reponse: true,
  explication: "Accordé en novembre 2012 par l'Assemblée générale, ce statut est le même que celui du Saint-Siège."
},
{
  id: "gpo-043", categorie: "geopolitique", niveau: 3, type: "qcm",
  question: "Quel pays a quitté l'OPEP en janvier 2020 ?",
  choix: ["L'Équateur", "Le Qatar", "L'Angola", "Le Gabon"],
  reponse: 0,
  explication: "Quito invoquait des difficultés budgétaires et voulait produire au-delà de son quota ; le Qatar était parti un an plus tôt."
},
{
  id: "gpo-044", categorie: "geopolitique", niveau: 3, type: "clic_pays",
  question: "Cliquez sur le pays qui a rejoint l'OTAN en mars 2024, portant l'Alliance à 32 membres.",
  reponse: "752",
  explication: "La Suède a mis fin à deux siècles de neutralité, un an après la Finlande, après un an et demi de blocage turc et hongrois."
}

]);

/* ------------------------- EXTENSION : 10 questions ------------------------ */
window.QUESTIONS.push(...[

{
  id: "gpo-045", categorie: "geopolitique", niveau: 1, type: "qcm",
  question: "Quelle institution européenne détient le monopole de la proposition des lois de l'Union ?",
  choix: [
    "La Commission européenne",
    "Le Parlement européen",
    "Le Conseil de l'Union européenne",
    "La Cour de justice de l'Union"
  ],
  reponse: 0,
  explication: "Un commissaire par État membre, mais ils prêtent serment d'indépendance et ne représentent pas leur pays d'origine."
},
{
  id: "gpo-046", categorie: "geopolitique", niveau: 1, type: "vrai_faux",
  question: "Le Saint-Siège dispose d'un statut d'observateur à l'ONU sans en être membre.",
  reponse: true,
  explication: "Il n'a jamais demandé l'adhésion pleine et entière, ce qui lui permet de ne pas avoir à voter sur les questions de guerre et de paix."
},
{
  id: "gpo-047", categorie: "geopolitique", niveau: 1, type: "clic_pays",
  question: "Cliquez sur le pays qui accueille le siège de l'Union africaine.",
  reponse: "231",
  explication: "À Addis-Abeba. Le bâtiment actuel, inauguré en 2012, a été financé et construit par la Chine."
},
{
  id: "gpo-048", categorie: "geopolitique", niveau: 2, type: "multi_pays",
  question: "Sélectionnez les quatre pays africains riverains de la mer Rouge.",
  reponse: ["818", "729", "232", "262"],
  explication: "Égypte, Soudan, Érythrée et Djibouti. Le détroit de Bab-el-Mandeb, large de 30 km, est l'un des grands verrous du commerce maritime."
},
{
  id: "gpo-049", categorie: "geopolitique", niveau: 2, type: "qcm",
  question: "Quelle alliance militaire regroupait les pays du bloc de l'Est face à l'OTAN ?",
  choix: ["Le pacte de Varsovie", "Le Comecon", "L'Organisation de Shanghai", "Le Kominform"],
  reponse: 0,
  explication: "Créé en 1955, six ans après l'OTAN, en réaction directe à l'entrée de l'Allemagne de l'Ouest dans l'Alliance. Dissous en juillet 1991."
},
{
  id: "gpo-050", categorie: "geopolitique", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le pays traversé par le canal qui relie l'Atlantique au Pacifique.",
  reponse: "591",
  explication: "Ouvert en 1914, le canal de Panama est resté sous contrôle américain jusqu'au 31 décembre 1999."
},
{
  id: "gpo-051", categorie: "geopolitique", niveau: 2, type: "vrai_faux",
  question: "L'OTAN n'a invoqué qu'une seule fois son article 5 de défense collective.",
  reponse: true,
  explication: "Au lendemain du 11 septembre 2001, au bénéfice des États-Unis, alors que la clause avait été pensée contre une attaque soviétique en Europe."
},
{
  id: "gpo-052", categorie: "geopolitique", niveau: 2, type: "qcm",
  question: "Quel drapeau porte une roue bleue à vingt-quatre rayons au centre d'une bande blanche ?",
  choix: ["Inde", "Niger", "Irlande", "Côte d'Ivoire"],
  reponse: 0,
  explication: "La roue bleue est le chakra d'Ashoka, repris d'un chapiteau du IIIe siècle av. J.-C. ; ses 24 rayons symbolisent le mouvement."
},
{
  id: "gpo-053", categorie: "geopolitique", niveau: 3, type: "qcm",
  question: "Combien de voisins terrestres la Chine compte-t-elle, à égalité avec la Russie ?",
  choix: ["14", "10", "12", "16"],
  reponse: 0,
  explication: "Ces deux pays détiennent le record ex æquo ; le Brésil, troisième, n'en a que dix."
},
{
  id: "gpo-054", categorie: "geopolitique", niveau: 3, type: "distance",
  question: "Cliquez sur le détroit d'Ormuz.",
  reponse: [26.5667, 56.2500],
  explication: "Environ un cinquième du pétrole consommé dans le monde passe par ce goulet large de 33 km à son point le plus étroit."
}

]);

/* ------------------------- EXTENSION : 15 questions ------------------------ */
window.QUESTIONS.push(...[

{
  id: "gpo-055", categorie: "geopolitique", niveau: 1, type: "qcm",
  question: "Quelle langue est officielle dans le plus grand nombre de pays ?",
  choix: ["L'anglais", "Le français", "L'espagnol", "L'arabe"],
  reponse: 0,
  explication: "Une soixantaine d'États, héritage de l'Empire britannique. Le français arrive deuxième avec une trentaine de pays."
},
{
  id: "gpo-056", categorie: "geopolitique", niveau: 1, type: "vrai_faux",
  question: "Le drapeau de l'ONU représente le monde vu depuis l'équateur.",
  reponse: false,
  explication: "C'est une projection azimutale centrée sur le pôle Nord, entourée de deux rameaux d'olivier. L'Antarctique n'y figure pas."
},
{
  id: "gpo-057", categorie: "geopolitique", niveau: 1, type: "clic_pays",
  question: "Cliquez sur le pays qui accueille le siège de l'Organisation mondiale du commerce.",
  reponse: "756",
  explication: "À Genève, dans un bâtiment de 1926 construit pour l'Organisation internationale du travail."
},
{
  id: "gpo-058", categorie: "geopolitique", niveau: 1, type: "qcm",
  question: "Combien d'États l'OTAN compte-t-elle depuis 2024 ?",
  choix: ["32", "28", "30", "35"],
  reponse: 0,
  explication: "Douze à la fondation en 1949 ; l'Alliance a plus que doublé, surtout après la disparition du bloc de l'Est."
},
{
  id: "gpo-059", categorie: "geopolitique", niveau: 1, type: "distance",
  question: "Cliquez sur l'emplacement de Strasbourg.",
  reponse: [48.5734, 7.7521],
  explication: "Le choix de la ville est symbolique : elle a changé de nationalité quatre fois entre 1870 et 1945."
},
{
  id: "gpo-060", categorie: "geopolitique", niveau: 2, type: "multi_pays",
  question: "Sélectionnez les cinq pays qui composaient les BRICS avant l'élargissement de 2024.",
  reponse: ["076", "643", "356", "156", "710"],
  explication: "L'acronyme a été inventé en 2001 par un économiste de banque d'affaires, bien avant que le groupe n'existe politiquement."
},
{
  id: "gpo-061", categorie: "geopolitique", niveau: 2, type: "qcm",
  question: "Qui décerne le prix Nobel de la paix ?",
  choix: [
    "Un comité désigné par le Parlement norvégien",
    "L'Académie suédoise",
    "L'Assemblée générale de l'ONU",
    "La fondation Nobel à Stockholm"
  ],
  reponse: 0,
  explication: "C'est le seul Nobel remis à Oslo et non à Stockholm : Alfred Nobel l'a voulu ainsi, sans jamais s'en expliquer."
},
{
  id: "gpo-062", categorie: "geopolitique", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le pays où l'on parle le plus grand nombre de langues vivantes.",
  reponse: "598",
  explication: "Environ 840 langues en Papouasie-Nouvelle-Guinée, soit plus d'un dixième de toutes les langues du monde pour 0,1 % de sa population."
},
{
  id: "gpo-063", categorie: "geopolitique", niveau: 2, type: "vrai_faux",
  question: "Au Conseil de sécurité, l'abstention d'un membre permanent bloque la résolution.",
  reponse: false,
  explication: "Seul un vote négatif vaut veto. L'usage est établi depuis 1946, alors que la Charte reste ambiguë sur ce point."
},
{
  id: "gpo-064", categorie: "geopolitique", niveau: 2, type: "qcm",
  question: "Quel pays a accordé le premier le droit de vote aux femmes à l'échelle nationale ?",
  choix: ["La Nouvelle-Zélande", "La Finlande", "La Norvège", "L'Australie"],
  reponse: 0,
  explication: "En 1893, après une pétition portée par près d'un quart des femmes adultes du pays. Elles n'ont pu être élues qu'à partir de 1919."
},
{
  id: "gpo-065", categorie: "geopolitique", niveau: 3, type: "multi_pays",
  question: "Sélectionnez les trois pays qui se partagent l'île de Bornéo.",
  reponse: ["360", "458", "096"],
  explication: "Indonésie, Malaisie et Brunei : c'est la seule grande île du monde partagée entre trois États souverains."
},
{
  id: "gpo-066", categorie: "geopolitique", niveau: 3, type: "qcm",
  question: "Quel traité gèle les revendications territoriales et interdit toute activité militaire en Antarctique ?",
  choix: [
    "Le traité sur l'Antarctique",
    "Le protocole de Kyoto",
    "La convention de Montego Bay",
    "Le traité de l'espace"
  ],
  reponse: 0,
  explication: "Signé en 1959 en pleine guerre froide par douze pays, dont les États-Unis et l'URSS : le continent est réservé à la science."
},
{
  id: "gpo-067", categorie: "geopolitique", niveau: 3, type: "clic_pays",
  question: "Cliquez sur le pays qui a érigé la plus longue clôture frontalière du monde.",
  reponse: "356",
  explication: "L'Inde a clôturé près de 3 300 km de sa frontière avec le Bangladesh, un chantier entamé dans les années 1980."
},
{
  id: "gpo-068", categorie: "geopolitique", niveau: 3, type: "vrai_faux",
  question: "La Suisse est membre de l'ONU depuis sa fondation en 1945.",
  reponse: false,
  explication: "Elle n'y est entrée qu'en 2002, après un référendum serré : sa neutralité lui semblait jusque-là incompatible avec l'adhésion."
},
{
  id: "gpo-069", categorie: "geopolitique", niveau: 3, type: "distance",
  question: "Cliquez sur Vienne, siège de l'Agence internationale de l'énergie atomique.",
  reponse: [48.2082, 16.3738],
  explication: "La ville accueille aussi l'OPEP et l'un des quatre sièges de l'ONU, avec New York, Genève et Nairobi."
}

]);

/* =============================================================================
   GÉOPOLITIQUE — deuxième série (40 questions)
   Même parti pris que politique.js : des mécanismes et des dates, pas de
   l'actualité qui se périme.
   ============================================================================= */
window.QUESTIONS.push(...[

/* ------------------------------- NIVEAU 1 --------------------------------- */
{
  id: "gpo-070", categorie: "geopolitique", niveau: 1, type: "qcm",
  question: "Combien de pays composent le G7 ?",
  choix: ["7", "8", "5", "10"],
  reponse: 0,
  explication: "Allemagne, Canada, États-Unis, France, Italie, Japon et Royaume-Uni. L'Union européenne y siège aussi, mais sans en être membre à part entière."
},
{
  id: "gpo-071", categorie: "geopolitique", niveau: 1, type: "vrai_faux",
  question: "Le siège de l'ONU se trouve à New York.",
  reponse: true,
  explication: "Le terrain a été offert par John D. Rockefeller Jr. en 1946. Il constitue un district international qui n'appartient à aucun État."
},
{
  id: "gpo-072", categorie: "geopolitique", niveau: 1, type: "qcm",
  question: "Quelle alliance militaire réunit les États-Unis et la plupart des pays d'Europe occidentale ?",
  choix: ["L'OTAN", "L'OCDE", "L'OSCE", "Le pacte de Varsovie"],
  reponse: 0,
  explication: "Créée en 1949. Son article 5, qui engage tous les membres si l'un est attaqué, n'a été invoqué qu'une seule fois : après le 11 septembre 2001."
},
{
  id: "gpo-073", categorie: "geopolitique", niveau: 1, type: "clic_pays",
  question: "Cliquez sur la Suisse.",
  reponse: "756",
  explication: "Neutre depuis 1815, elle n'a rejoint l'ONU qu'en 2002, après un référendum, alors que Genève abritait déjà son siège européen."
},
{
  id: "gpo-074", categorie: "geopolitique", niveau: 1, type: "qcm",
  question: "Quelle est la monnaie du Royaume-Uni ?",
  choix: ["La livre sterling", "L'euro", "Le franc", "La couronne"],
  reponse: 0,
  explication: "La plus ancienne monnaie encore en circulation, née au VIIIe siècle. Le pays avait obtenu une dérogation permanente pour ne jamais adopter l'euro."
},
{
  id: "gpo-076", categorie: "geopolitique", niveau: 1, type: "qcm",
  question: "Où se trouve le siège officiel du Parlement européen ?",
  choix: ["Strasbourg", "Bruxelles", "Luxembourg", "Francfort"],
  reponse: 0,
  explication: "Les députés siègent aussi à Bruxelles et le secrétariat est à Luxembourg : douze fois par an, le Parlement déménage entièrement pour une semaine."
},
{
  id: "gpo-077", categorie: "geopolitique", niveau: 1, type: "multi_pays",
  question: "Sélectionnez les six pays fondateurs de la Communauté économique européenne, en 1957.",
  reponse: ["250", "276", "380", "056", "528", "442"],
  explication: "France, Allemagne, Italie, Belgique, Pays-Bas et Luxembourg. Les trois derniers formaient déjà une union douanière, le Benelux, depuis 1944."
},
{
  id: "gpo-078", categorie: "geopolitique", niveau: 1, type: "qcm",
  question: "Que signifie le sigle OTAN ?",
  choix: ["Organisation du traité de l'Atlantique Nord", "Office des traités des alliances du Nord",
          "Organisation des territoires de l'Atlantique Nord", "Organisation des travaux de l'Alliance navale"],
  reponse: 0,
  explication: "En anglais NATO. Son premier secrétaire général résumait crûment sa fonction : garder les Américains dedans et les Russes dehors."
},
{
  id: "gpo-080", categorie: "geopolitique", niveau: 1, type: "vrai_faux",
  question: "Le drapeau européen compte douze étoiles.",
  reponse: true,
  explication: "Le nombre n'a aucun rapport avec celui des États membres : douze symbolise la plénitude, et le dessin n'a jamais changé depuis 1955."
},
{
  id: "gpo-081", categorie: "geopolitique", niveau: 1, type: "qcm",
  question: "Quelle organisation déploie les soldats surnommés « Casques bleus » ?",
  choix: ["L'ONU", "L'OTAN", "La Croix-Rouge", "L'Union africaine"],
  reponse: 0,
  explication: "La couleur a été choisie en 1948 parce qu'aucune armée ne l'utilisait : il fallait un casque impossible à confondre avec celui d'un belligérant."
},
{
  id: "gpo-082", categorie: "geopolitique", niveau: 1, type: "chronologie",
  question: "Classez ces traités européens par ordre de signature.",
  choix: ["Le traité de Rome", "Le traité de Maastricht", "Le traité d'Amsterdam", "Le traité de Lisbonne"],
  reponse: [0, 1, 2, 3],
  explication: "1957, 1992, 1997 et 2007. C'est Maastricht qui crée l'Union européenne proprement dite, et avec elle la citoyenneté européenne."
},
{
  id: "gpo-083", categorie: "geopolitique", niveau: 1, type: "clic_pays",
  question: "Cliquez sur la Norvège.",
  reponse: "578",
  explication: "Elle a refusé deux fois d'entrer dans l'Union européenne, par référendum, en 1972 puis en 1994."
},

/* ------------------------------- NIVEAU 2 --------------------------------- */
{
  id: "gpo-085", categorie: "geopolitique", niveau: 2, type: "vrai_faux",
  question: "La Norvège est membre de l'OTAN sans être membre de l'Union européenne.",
  reponse: true,
  explication: "Elle en est même membre fondateur en 1949. Le pétrole de la mer du Nord lui a ensuite ôté toute urgence à rejoindre l'Union."
},
{
  id: "gpo-086", categorie: "geopolitique", niveau: 2, type: "qcm",
  question: "Quel organe de l'ONU peut adopter des décisions juridiquement contraignantes ?",
  choix: ["Le Conseil de sécurité", "L'Assemblée générale", "Le Secrétariat", "Le Conseil économique et social"],
  reponse: 0,
  explication: "Les résolutions de l'Assemblée générale, elles, n'ont qu'une valeur de recommandation, quel que soit le nombre de voix réunies."
},
{
  id: "gpo-087", categorie: "geopolitique", niveau: 2, type: "clic_pays",
  question: "Cliquez sur l'Ukraine.",
  reponse: "804",
  explication: "Le plus grand pays entièrement situé en Europe. Ses terres noires comptent parmi les sols les plus fertiles de la planète."
},
{
  id: "gpo-089", categorie: "geopolitique", niveau: 2, type: "multi_pays",
  question: "Sélectionnez les quatre pays du groupe de Visegrád.",
  reponse: ["616", "203", "703", "348"],
  explication: "Pologne, Tchéquie, Slovaquie et Hongrie. Le groupe est né en 1991 pour coordonner leur sortie du bloc soviétique et leur entrée à l'Ouest."
},
{
  id: "gpo-090", categorie: "geopolitique", niveau: 2, type: "vrai_faux",
  question: "Le Conseil de l'Europe est une institution de l'Union européenne.",
  reponse: false,
  explication: "C'est une organisation distincte, plus ancienne et bien plus large : elle réunit une quarantaine d'États et veille à la Convention européenne des droits de l'homme."
},
{
  id: "gpo-091", categorie: "geopolitique", niveau: 2, type: "qcm",
  question: "Que prévoit l'article 5 du traité de l'Atlantique Nord ?",
  choix: ["La défense collective en cas d'attaque", "Le libre-échange entre alliés",
          "La création d'une armée commune", "Le partage du renseignement"],
  reponse: 0,
  explication: "Une attaque contre un membre est réputée dirigée contre tous. Le texte laisse toutefois chaque État libre du moyen de répondre : rien n'impose la guerre."
},
{
  id: "gpo-092", categorie: "geopolitique", niveau: 2, type: "distance",
  question: "Cliquez sur l'emplacement de La Haye.",
  reponse: [52.0705, 4.3007],
  explication: "Siège de la Cour internationale de justice et de la Cour pénale internationale, ce qui lui vaut le surnom de capitale mondiale du droit."
},
{
  id: "gpo-093", categorie: "geopolitique", niveau: 2, type: "qcm",
  question: "Quelle juridiction poursuit les individus pour crimes contre l'humanité ?",
  choix: ["La Cour pénale internationale", "La Cour internationale de justice",
          "La Cour européenne des droits de l'homme", "Le Conseil de sécurité"],
  reponse: 0,
  explication: "Elle juge des personnes, là où la Cour internationale de justice tranche des litiges entre États. Les deux siègent pourtant dans la même ville."
},
{
  id: "gpo-094", categorie: "geopolitique", niveau: 2, type: "chronologie",
  question: "Classez ces organisations internationales par ordre de création.",
  choix: ["La Société des Nations", "L'ONU", "L'OTAN", "La Communauté économique européenne"],
  reponse: [0, 1, 2, 3],
  explication: "1920, 1945, 1949 et 1957. Les États-Unis, dont le président avait inspiré la Société des Nations, n'y ont finalement jamais adhéré."
},
{
  id: "gpo-095", categorie: "geopolitique", niveau: 2, type: "vrai_faux",
  question: "Des États extérieurs à l'Union européenne utilisent officiellement l'euro.",
  reponse: true,
  explication: "Monaco, Saint-Marin, Andorre et le Vatican l'emploient par accord monétaire, et frappent même leurs propres pièces."
},
{
  id: "gpo-096", categorie: "geopolitique", niveau: 2, type: "qcm",
  question: "Quel pays a quitté l'Union européenne en 2020 ?",
  choix: ["Le Royaume-Uni", "La Suisse", "La Norvège", "Le Danemark"],
  reponse: 0,
  explication: "Premier départ de l'histoire de l'Union. Le Groenland l'avait précédé en 1985, mais en tant que territoire danois, pas comme État membre."
},
{
  id: "gpo-097", categorie: "geopolitique", niveau: 2, type: "clic_pays",
  question: "Cliquez sur l'Arabie saoudite.",
  reponse: "682",
  explication: "Seul pays au monde à porter le nom de la famille qui le dirige. Elle abrite La Mecque et Médine, les deux villes saintes de l'islam."
},

/* ------------------------------- NIVEAU 3 --------------------------------- */
{
  id: "gpo-099", categorie: "geopolitique", niveau: 3, type: "qcm",
  question: "Quels traités de 1648 sont considérés comme l'acte de naissance de l'État souverain moderne ?",
  choix: ["Les traités de Westphalie", "Le traité de Versailles", "Le congrès de Vienne", "Le traité d'Utrecht"],
  reponse: 0,
  explication: "Ils mettent fin à la guerre de Trente Ans en posant un principe neuf : chaque prince est maître chez lui, sans autorité supérieure."
},
{
  id: "gpo-100", categorie: "geopolitique", niveau: 3, type: "vrai_faux",
  question: "Un seul membre permanent du Conseil de sécurité peut bloquer une résolution.",
  reponse: true,
  explication: "C'est le droit de veto. L'URSS puis la Russie l'ont utilisé plus que tout autre membre, et de loin, sur l'ensemble de la période."
},
{
  id: "gpo-101", categorie: "geopolitique", niveau: 3, type: "multi_pays",
  question: "Sélectionnez les quatre États détenteurs de l'arme nucléaire qui ne siègent pas en permanence au Conseil de sécurité.",
  reponse: ["356", "586", "376", "408"],
  explication: "Inde, Pakistan, Israël et Corée du Nord. Israël n'a jamais confirmé officiellement posséder l'arme, une position dite d'ambiguïté délibérée."
},
{
  id: "gpo-102", categorie: "geopolitique", niveau: 3, type: "qcm",
  question: "Quelle institution européenne représente les gouvernements des États membres ?",
  choix: ["Le Conseil de l'Union européenne", "La Commission européenne",
          "Le Parlement européen", "La Cour des comptes"],
  reponse: 0,
  explication: "Les ministres y siègent selon le sujet traité. À ne pas confondre avec le Conseil européen, qui réunit les chefs d'État et de gouvernement."
},
{
  id: "gpo-104", categorie: "geopolitique", niveau: 3, type: "qcm",
  question: "Quel accord de 1985 a supprimé les contrôles aux frontières intérieures européennes ?",
  choix: ["Les accords de Schengen", "Le traité de Rome", "L'Acte unique", "Les accords de Bretton Woods"],
  reponse: 0,
  explication: "Signés à bord d'un bateau sur la Moselle, au point de rencontre de trois frontières, par cinq pays seulement à l'origine."
},
{
  id: "gpo-105", categorie: "geopolitique", niveau: 3, type: "vrai_faux",
  question: "Tous les pays de l'espace Schengen sont membres de l'Union européenne.",
  reponse: false,
  explication: "La Suisse, la Norvège, l'Islande et le Liechtenstein en font partie sans être dans l'Union ; à l'inverse, l'Irlande est dans l'Union mais hors Schengen."
},
{
  id: "gpo-106", categorie: "geopolitique", niveau: 3, type: "clic_pays",
  question: "Cliquez sur l'Iran.",
  reponse: "364",
  explication: "Le pays s'appelait officiellement Perse jusqu'en 1935. Le détroit d'Ormuz, qu'il borde, voit passer près d'un cinquième du pétrole mondial."
},
{
  id: "gpo-107", categorie: "geopolitique", niveau: 3, type: "qcm",
  question: "Quelle institution européenne veille au respect des traités et peut saisir la Cour de justice ?",
  choix: ["La Commission européenne", "Le Conseil européen",
          "Le Parlement européen", "La Banque centrale européenne"],
  reponse: 0,
  explication: "On la surnomme la gardienne des traités. Elle peut engager un recours en manquement contre un État membre, y compris le plus puissant."
},
{
  id: "gpo-108", categorie: "geopolitique", niveau: 3, type: "chronologie",
  question: "Classez ces étapes de la construction européenne.",
  choix: ["La Communauté européenne du charbon et de l'acier", "La Communauté économique européenne",
          "Les accords de Schengen", "L'euro en pièces et en billets"],
  reponse: [0, 1, 2, 3],
  explication: "1951, 1957, 1985 et 2002. Mettre en commun le charbon et l'acier visait d'abord à rendre une guerre franco-allemande matériellement impossible."
},
{
  id: "gpo-109", categorie: "geopolitique", niveau: 3, type: "qcm",
  question: "Quel pays est le premier contributeur au budget ordinaire de l'ONU ?",
  choix: ["Les États-Unis", "La Chine", "L'Allemagne", "Le Japon"],
  reponse: 0,
  explication: "Leur quote-part est plafonnée à 22 %, un maximum inscrit dans les règles pour qu'aucun État ne puisse financer seul l'organisation."
}

]);
