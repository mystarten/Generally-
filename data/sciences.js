/* =============================================================================
   SCIENCES — 70 questions
   Conventions identiques à data/geographie.js.
   ============================================================================= */
window.QUESTIONS = window.QUESTIONS || [];
window.QUESTIONS.push(...[

/* ------------------------------- NIVEAU 1 --------------------------------- */
{
  id: "sci-001", categorie: "sciences", niveau: 1, type: "qcm",
  question: "Quelle est la formule chimique de l'eau ?",
  choix: ["H₂O", "CO₂", "O₂", "H₂O₂"],
  reponse: 0,
  explication: "Deux atomes d'hydrogène pour un d'oxygène, disposés en V à 104,5° : c'est cet angle qui rend l'eau polaire, donc excellente pour dissoudre."
},
{
  id: "sci-002", categorie: "sciences", niveau: 1, type: "vrai_faux",
  question: "Le son se propage plus lentement dans l'eau que dans l'air.",
  reponse: false,
  explication: "C'est le contraire : environ 1 480 m/s contre 343, ce qui permet aux baleines de communiquer sur des centaines de kilomètres."
},
{
  id: "sci-003", categorie: "sciences", niveau: 1, type: "qcm",
  question: "Combien d'os compte le squelette d'un adulte ?",
  choix: ["206", "150", "280", "320"],
  reponse: 0,
  explication: "Un nouveau-né en a près de 300 : beaucoup fusionnent pendant la croissance, notamment ceux du crâne et du sacrum."
},
{
  id: "sci-004", categorie: "sciences", niveau: 1, type: "chronologie",
  question: "Classez ces inventions par ordre chronologique.",
  choix: [
    "Imprimerie à caractères mobiles de Gutenberg",
    "Machine à vapeur perfectionnée par Watt",
    "Ampoule électrique d'Edison",
    "Premier vol motorisé des frères Wright"
  ],
  reponse: [0, 1, 2, 3],
  explication: "Vers 1450, 1769, 1879, 1903. Le premier vol des Wright a duré douze secondes et couvert 37 mètres."
},
{
  id: "sci-005", categorie: "sciences", niveau: 1, type: "qcm",
  question: "Quel gaz les plantes absorbent-elles pour la photosynthèse ?",
  choix: ["Le dioxyde de carbone", "L'oxygène", "L'azote", "Le méthane"],
  reponse: 0,
  explication: "Elles en tirent le carbone qui constitue leur bois : la masse d'un arbre vient surtout de l'air, pas du sol."
},
{
  id: "sci-006", categorie: "sciences", niveau: 1, type: "vrai_faux",
  question: "Le diamant et le graphite sont constitués du même élément chimique.",
  reponse: true,
  explication: "Du carbone pur dans les deux cas : seule l'organisation des atomes change, d'où l'un des matériaux les plus durs et l'un des plus tendres."
},
{
  id: "sci-007", categorie: "sciences", niveau: 1, type: "qcm",
  question: "Quel est le plus grand organe du corps humain ?",
  choix: ["La peau", "Le foie", "Les poumons", "L'intestin grêle"],
  reponse: 0,
  explication: "Environ 2 m² et 4 kg chez un adulte, entièrement renouvelée en un mois environ."
},
{
  id: "sci-008", categorie: "sciences", niveau: 1, type: "qcm",
  question: "Quelle est l'unité de mesure de la force dans le système international ?",
  choix: ["Le newton", "Le joule", "Le watt", "Le pascal"],
  reponse: 0,
  explication: "Un newton, c'est à peu près le poids d'une pomme de 100 g : l'hommage est parfaitement assumé."
},
{
  id: "sci-009", categorie: "sciences", niveau: 1, type: "vrai_faux",
  question: "L'eau bout toujours à 100 °C, quelle que soit l'altitude.",
  reponse: false,
  explication: "La pression baisse avec l'altitude : au sommet du mont Blanc, l'eau bout vers 85 °C, et les pâtes n'y cuisent jamais vraiment."
},
{
  id: "sci-010", categorie: "sciences", niveau: 1, type: "qcm",
  question: "Combien de chromosomes possède une cellule humaine ?",
  choix: ["46", "23", "48", "64"],
  reponse: 0,
  explication: "23 paires. Les grands singes en ont 48 : deux de leurs chromosomes ont fusionné chez l'homme pour donner notre chromosome 2."
},
{
  id: "sci-011", categorie: "sciences", niveau: 1, type: "chronologie",
  question: "Classez ces avancées de la biologie.",
  choix: [
    "Publication de L'Origine des espèces par Darwin",
    "Découverte de la pénicilline par Fleming",
    "Description de la double hélice de l'ADN",
    "Achèvement du séquençage du génome humain"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1859, 1928, 1953, 2003. Fleming a découvert la pénicilline en revenant de vacances, sur une boîte de culture oubliée."
},
{
  id: "sci-012", categorie: "sciences", niveau: 1, type: "vrai_faux",
  question: "Le cœur humain comporte quatre cavités.",
  reponse: true,
  explication: "Deux oreillettes et deux ventricules, qui séparent strictement le sang oxygéné du sang appauvri."
},
{
  id: "sci-013", categorie: "sciences", niveau: 1, type: "qcm",
  question: "Quel métal est liquide à température ambiante ?",
  choix: ["Le mercure", "Le plomb", "L'étain", "Le zinc"],
  reponse: 0,
  explication: "Il fond à -39 °C. Le gallium, lui, fond à 30 °C : il suffit de le tenir dans la main."
},
{
  id: "sci-014", categorie: "sciences", niveau: 1, type: "qcm",
  question: "Qui a formulé l'équation E = mc² ?",
  choix: ["Albert Einstein", "Isaac Newton", "Niels Bohr", "Max Planck"],
  reponse: 0,
  explication: "En 1905, dans un article de trois pages ajouté après coup à sa théorie de la relativité restreinte."
},
{
  id: "sci-015", categorie: "sciences", niveau: 1, type: "vrai_faux",
  question: "La foudre ne frappe jamais deux fois au même endroit.",
  reponse: false,
  explication: "L'Empire State Building est touché une vingtaine de fois par an : les points hauts attirent la foudre encore et encore."
},
{
  id: "sci-016", categorie: "sciences", niveau: 1, type: "qcm",
  question: "Quel est l'élément le plus abondant de l'univers ?",
  choix: ["L'hydrogène", "L'oxygène", "Le carbone", "Le fer"],
  reponse: 0,
  explication: "Environ 75 % de la masse ordinaire de l'univers : tous les autres éléments ont été fabriqués à partir de lui."
},

/* ------------------------------- NIVEAU 2 --------------------------------- */
{
  id: "sci-017", categorie: "sciences", niveau: 2, type: "qcm",
  question: "Quel est le symbole chimique du potassium ?",
  choix: ["K", "P", "Po", "Pt"],
  reponse: 0,
  explication: "K pour kalium, son nom latin issu de l'arabe al-qalya, « les cendres », d'où vient aussi le mot alcali."
},
{
  id: "sci-018", categorie: "sciences", niveau: 2, type: "chronologie",
  question: "Classez ces découvertes de physique et de chimie.",
  choix: [
    "Table périodique de Mendeleïev",
    "Découverte de la radioactivité par Becquerel",
    "Modèle atomique de Bohr",
    "Découverte du neutron par Chadwick"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1869, 1896, 1913, 1932. Mendeleïev a laissé des cases vides en prédisant les propriétés d'éléments encore inconnus."
},
{
  id: "sci-019", categorie: "sciences", niveau: 2, type: "vrai_faux",
  question: "Un atome est une bille de matière pleine, sans espace vide.",
  reponse: false,
  explication: "Il est très majoritairement vide : si le noyau avait la taille d'une bille au centre d'un stade, les électrons seraient dans les gradins."
},
{
  id: "sci-020", categorie: "sciences", niveau: 2, type: "qcm",
  question: "Quelle particule porte une charge électrique négative ?",
  choix: ["L'électron", "Le proton", "Le neutron", "Le photon"],
  reponse: 0,
  explication: "Sa charge sert d'unité de référence, alors même qu'elle a été définie négative par une convention historique de Benjamin Franklin."
},
{
  id: "sci-021", categorie: "sciences", niveau: 2, type: "qcm",
  question: "Quelle est la vitesse approximative du son dans l'air à 20 °C ?",
  choix: ["343 m/s", "1 480 m/s", "150 m/s", "3 000 m/s"],
  reponse: 0,
  explication: "Environ 1 235 km/h : d'où la règle des trois secondes par kilomètre entre l'éclair et le tonnerre."
},
{
  id: "sci-022", categorie: "sciences", niveau: 2, type: "vrai_faux",
  question: "Les antibiotiques sont efficaces contre les virus.",
  reponse: false,
  explication: "Ils visent des structures bactériennes que les virus ne possèdent pas ; les prescrire pour une grippe ne sert qu'à nourrir les résistances."
},
{
  id: "sci-023", categorie: "sciences", niveau: 2, type: "qcm",
  question: "Quel organite fournit l'essentiel de l'énergie de la cellule ?",
  choix: ["La mitochondrie", "Le ribosome", "Le noyau", "L'appareil de Golgi"],
  reponse: 0,
  explication: "Elle possède son propre ADN : c'était à l'origine une bactérie libre, avalée puis domestiquée il y a près de deux milliards d'années."
},
{
  id: "sci-024", categorie: "sciences", niveau: 2, type: "chronologie",
  question: "Classez ces premières médicales et biotechnologiques.",
  choix: [
    "Première greffe de cœur humaine",
    "Naissance du premier bébé conçu par fécondation in vitro",
    "Clonage de la brebis Dolly",
    "Première autorisation d'un vaccin à ARN messager"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1967, 1978, 1996, 2020. Dolly doit son nom à Dolly Parton, la cellule d'origine venant d'une glande mammaire."
},
{
  id: "sci-025", categorie: "sciences", niveau: 2, type: "qcm",
  question: "Que mesure le pH ?",
  choix: ["L'acidité d'une solution", "La température", "La densité", "La conductivité"],
  reponse: 0,
  explication: "L'échelle est logarithmique : un pH de 3 est dix fois plus acide qu'un pH de 4, et cent fois plus qu'un pH de 5."
},
{
  id: "sci-026", categorie: "sciences", niveau: 2, type: "vrai_faux",
  question: "Le zéro absolu correspond à -273,15 °C.",
  reponse: true,
  explication: "On s'en approche à quelques milliardièmes de degré en laboratoire, mais on ne peut jamais l'atteindre."
},
{
  id: "sci-027", categorie: "sciences", niveau: 2, type: "qcm",
  question: "Quel gaz est le plus abondant dans l'atmosphère terrestre ?",
  choix: ["L'azote", "L'oxygène", "Le dioxyde de carbone", "L'argon"],
  reponse: 0,
  explication: "78 % d'azote contre 21 % d'oxygène : nous respirons surtout un gaz que notre corps ne sait pas utiliser."
},
{
  id: "sci-028", categorie: "sciences", niveau: 2, type: "qcm",
  question: "Quelle loi énonce que F = m × a ?",
  choix: [
    "La deuxième loi de Newton",
    "La loi de la gravitation universelle",
    "Le principe d'Archimède",
    "La loi de Hooke"
  ],
  reponse: 0,
  explication: "Le principe fondamental de la dynamique ; Newton l'avait en réalité écrit en termes de quantité de mouvement."
},
{
  id: "sci-029", categorie: "sciences", niveau: 2, type: "vrai_faux",
  question: "La lumière visible est une onde électromagnétique.",
  reponse: true,
  explication: "Elle n'occupe qu'une fine bande du spectre, entre l'ultraviolet et l'infrarouge : nos yeux sont très mal informés."
},
{
  id: "sci-030", categorie: "sciences", niveau: 2, type: "chronologie",
  question: "Classez ces étapes de l'informatique.",
  choix: [
    "Invention du transistor",
    "Premier circuit intégré",
    "Premier message transmis sur ARPANET",
    "Premier microprocesseur, l'Intel 4004"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1947, 1958, 1969, 1971. Le premier message d'ARPANET devait être « LOGIN » : le système a planté après « LO »."
},
{
  id: "sci-031", categorie: "sciences", niveau: 2, type: "qcm",
  question: "Quel élément porte le numéro atomique 1 ?",
  choix: ["L'hydrogène", "L'hélium", "Le lithium", "Le carbone"],
  reponse: 0,
  explication: "Un seul proton. C'est aussi le seul élément dont les isotopes portent des noms propres : deutérium et tritium."
},

/* ------------------------------- NIVEAU 3 --------------------------------- */
{
  id: "sci-032", categorie: "sciences", niveau: 3, type: "qcm",
  question: "Quel principe de la physique quantique interdit de connaître simultanément et exactement position et quantité de mouvement ?",
  choix: [
    "Le principe d'incertitude de Heisenberg",
    "Le principe d'exclusion de Pauli",
    "Le principe de correspondance",
    "Le paradoxe EPR"
  ],
  reponse: 0,
  explication: "Ce n'est pas une limite de nos instruments mais une propriété de la nature elle-même, énoncée en 1927."
},
{
  id: "sci-033", categorie: "sciences", niveau: 3, type: "vrai_faux",
  question: "Dans un système isolé, l'entropie ne peut que croître ou rester constante.",
  reponse: true,
  explication: "C'est le deuxième principe de la thermodynamique : celui qui donne au temps sa direction."
},
{
  id: "sci-034", categorie: "sciences", niveau: 3, type: "qcm",
  question: "Quelle enzyme assure la réplication de l'ADN ?",
  choix: ["L'ADN polymérase", "L'ARN polymérase", "La ligase", "La télomérase"],
  reponse: 0,
  explication: "Elle copie environ 50 nucléotides par seconde chez l'homme avec moins d'une erreur par milliard de bases."
},
{
  id: "sci-035", categorie: "sciences", niveau: 3, type: "chronologie",
  question: "Classez ces jalons de la physique du XXe siècle.",
  choix: [
    "Relativité restreinte d'Einstein",
    "Relativité générale d'Einstein",
    "Mise en évidence de l'expansion de l'univers",
    "Première détection d'ondes gravitationnelles"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1905, 1915, 1929, 2015. Einstein doutait qu'on puisse un jour détecter les ondes gravitationnelles : il aura fallu un siècle."
},
{
  id: "sci-036", categorie: "sciences", niveau: 3, type: "qcm",
  question: "Qu'est-ce que CRISPR-Cas9 ?",
  choix: [
    "Un outil d'édition ciblée du génome",
    "Un microscope à effet tunnel",
    "Un type de vaccin",
    "Un algorithme de séquençage"
  ],
  reponse: 0,
  explication: "Détourné d'un système immunitaire bactérien, il a valu le Nobel de chimie 2020 à Emmanuelle Charpentier et Jennifer Doudna."
},
{
  id: "sci-037", categorie: "sciences", niveau: 3, type: "vrai_faux",
  question: "Le boson de Higgs a été détecté au CERN en 2012.",
  reponse: true,
  explication: "Près de cinquante ans après sa prédiction théorique ; Peter Higgs a reçu le Nobel l'année suivante."
},
{
  id: "sci-038", categorie: "sciences", niveau: 3, type: "qcm",
  question: "Quelle est l'unité du système international pour la quantité de matière ?",
  choix: ["La mole", "Le gramme", "Le kelvin", "Le candela"],
  reponse: 0,
  explication: "Une mole contient 6,022 × 10²³ entités, un nombre redéfini comme une constante exacte en 2019."
},
{
  id: "sci-039", categorie: "sciences", niveau: 3, type: "qcm",
  question: "Quel phénomène explique la couleur bleue du ciel ?",
  choix: [
    "La diffusion de Rayleigh",
    "La réfraction de la lumière",
    "Le reflet des océans",
    "L'absorption par l'ozone"
  ],
  reponse: 0,
  explication: "Les courtes longueurs d'onde sont diffusées bien plus fortement ; c'est la même physique qui rend les couchers de soleil rouges."
},
{
  id: "sci-040", categorie: "sciences", niveau: 3, type: "vrai_faux",
  question: "L'ADN mitochondrial se transmet uniquement par le père.",
  reponse: false,
  explication: "Uniquement par la mère, ce qui permet de remonter les lignées maternelles sur des dizaines de milliers d'années, jusqu'à l'« Ève mitochondriale »."
},
{
  id: "sci-041", categorie: "sciences", niveau: 3, type: "chronologie",
  question: "Classez ces étapes de la physique nucléaire.",
  choix: [
    "Découverte des rayons X par Röntgen",
    "Prix Nobel de physique de Marie Curie",
    "Découverte de la fission nucléaire",
    "Première pile atomique de Fermi"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1895, 1903, 1938, 1942. Marie Curie reste la seule personne primée dans deux sciences différentes, physique puis chimie."
},
{
  id: "sci-042", categorie: "sciences", niveau: 3, type: "qcm",
  question: "Quel est l'élément le plus électronégatif ?",
  choix: ["Le fluor", "L'oxygène", "Le chlore", "L'azote"],
  reponse: 0,
  explication: "Si avide d'électrons qu'il attaque le verre et fait brûler l'eau : c'est ce qui l'a rendu si difficile à isoler."
},
{
  id: "sci-043", categorie: "sciences", niveau: 3, type: "vrai_faux",
  question: "Un supraconducteur présente une résistance électrique rigoureusement nulle.",
  reponse: true,
  explication: "Un courant lancé dans une boucle supraconductrice peut circuler des années sans s'atténuer."
},
{
  id: "sci-044", categorie: "sciences", niveau: 3, type: "qcm",
  question: "Combien de saveurs de quarks connaît-on ?",
  choix: ["6", "3", "4", "12"],
  reponse: 0,
  explication: "Haut, bas, étrange, charme, beauté et vérité. Seuls les deux premiers composent la matière ordinaire."
},
{
  id: "sci-045", categorie: "sciences", niveau: 3, type: "vrai_faux",
  question: "Le verre est un liquide qui s'écoule très lentement, ce qui explique les vitraux plus épais en bas.",
  reponse: false,
  explication: "C'est un solide amorphe. L'épaisseur inégale des vitraux vient des méthodes de fabrication médiévales, pas d'un écoulement."
}

]);

/* ------------------------- EXTENSION : 10 questions ------------------------ */
window.QUESTIONS.push(...[

{
  id: "sci-046", categorie: "sciences", niveau: 1, type: "qcm",
  question: "Quel groupe sanguin est qualifié de donneur universel pour les globules rouges ?",
  choix: ["O négatif", "AB positif", "A positif", "O positif"],
  reponse: 0,
  explication: "Ses hématies ne portent ni antigène A ou B, ni facteur Rhésus. À l'inverse, AB positif est le receveur universel."
},
{
  id: "sci-047", categorie: "sciences", niveau: 1, type: "vrai_faux",
  question: "Le cerveau humain compte environ 86 milliards de neurones.",
  reponse: true,
  explication: "Le chiffre de 100 milliards, longtemps répété sans source, a été corrigé en 2009 par un comptage cellulaire direct."
},
{
  id: "sci-048", categorie: "sciences", niveau: 1, type: "qcm",
  question: "Quelle vitamine l'organisme fabrique-t-il grâce à l'exposition au soleil ?",
  choix: ["La vitamine D", "La vitamine C", "La vitamine A", "La vitamine B12"],
  reponse: 0,
  explication: "Elle est synthétisée dans la peau à partir d'un dérivé du cholestérol : c'est la seule vitamine que le corps produit lui-même en quantité utile."
},
{
  id: "sci-049", categorie: "sciences", niveau: 2, type: "qcm",
  question: "Quel est l'état de la matière le plus répandu dans l'univers visible ?",
  choix: ["Le plasma", "Le gaz", "Le solide", "Le liquide"],
  reponse: 0,
  explication: "Les étoiles en sont faites. Sur Terre, on n'en croise guère que dans les éclairs, les aurores polaires et les tubes fluorescents."
},
{
  id: "sci-050", categorie: "sciences", niveau: 2, type: "chronologie",
  question: "Classez ces découvertes par ordre chronologique.",
  choix: [
    "Robert Hooke observe et nomme les « cellules »",
    "Lavoisier énonce la conservation de la masse",
    "Pasteur met au point le vaccin contre la rage",
    "Landsteiner découvre les groupes sanguins ABO"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1665, 1789, 1885, 1901. Hooke observait une tranche de liège : les cavités vides lui ont évoqué les cellules d'un monastère."
},
{
  id: "sci-051", categorie: "sciences", niveau: 2, type: "qcm",
  question: "Quel organe produit l'insuline ?",
  choix: ["Le pancréas", "Le foie", "La rate", "La thyroïde"],
  reponse: 0,
  explication: "Elle est sécrétée par les îlots de Langerhans, qui ne représentent que 1 à 2 % de la masse de l'organe."
},
{
  id: "sci-052", categorie: "sciences", niveau: 2, type: "vrai_faux",
  question: "Le sang pauvre en oxygène est bleu à l'intérieur des veines.",
  reponse: false,
  explication: "Il est rouge sombre. Les veines paraissent bleues à cause de la façon dont la peau absorbe et diffuse les différentes couleurs de la lumière."
},
{
  id: "sci-053", categorie: "sciences", niveau: 3, type: "qcm",
  question: "Quelle est la demi-vie du carbone 14, utilisé pour la datation ?",
  choix: ["Environ 5 730 ans", "Environ 1 600 ans", "Environ 24 000 ans", "Environ 700 millions d'années"],
  reponse: 0,
  explication: "Au-delà d'une cinquantaine de milliers d'années, il en reste trop peu pour mesurer quoi que ce soit : la méthode atteint alors sa limite."
},
{
  id: "sci-054", categorie: "sciences", niveau: 3, type: "vrai_faux",
  question: "Certains animaux peuvent survivre à une exposition directe au vide spatial.",
  reponse: true,
  explication: "En 2007, des tardigrades déshydratés ont passé dix jours en orbite exposés au vide et aux ultraviolets ; plusieurs ont ensuite pondu normalement."
},
{
  id: "sci-055", categorie: "sciences", niveau: 3, type: "chronologie",
  question: "Classez ces étapes de la découverte de l'électricité.",
  choix: [
    "Volta invente la pile électrique",
    "Faraday découvre l'induction électromagnétique",
    "Maxwell publie ses équations de l'électromagnétisme",
    "Thomson identifie l'électron"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1800, 1831, 1865, 1897. Volta a construit sa pile pour réfuter Galvani, convaincu d'avoir trouvé une « électricité animale » dans les cuisses de grenouille."
}

]);

/* ------------------------- EXTENSION : 15 questions ------------------------ */
window.QUESTIONS.push(...[

{
  id: "sci-056", categorie: "sciences", niveau: 1, type: "qcm",
  question: "Combien de dents compte un adulte, dents de sagesse comprises ?",
  choix: ["32", "28", "30", "36"],
  reponse: 0,
  explication: "Une part croissante de la population naît sans certaines dents de sagesse : notre mâchoire a rétréci plus vite que notre dentition."
},
{
  id: "sci-057", categorie: "sciences", niveau: 1, type: "vrai_faux",
  question: "L'aluminium est attiré par un aimant, tout comme le fer.",
  reponse: false,
  explication: "Il ne l'est pas, et c'est ce qui permet de trier les canettes : un aimant retient l'acier, tandis qu'un courant induit éjecte l'aluminium."
},
{
  id: "sci-058", categorie: "sciences", niveau: 1, type: "qcm",
  question: "Quel organe filtre le sang et fabrique l'urine ?",
  choix: ["Les reins", "Le foie", "La rate", "Le pancréas"],
  reponse: 0,
  explication: "Ils filtrent environ 180 litres de plasma par jour, dont ils réabsorbent plus de 99 % : il n'en sort qu'un litre et demi d'urine."
},
{
  id: "sci-059", categorie: "sciences", niveau: 1, type: "chronologie",
  question: "Classez ces avancées scientifiques.",
  choix: [
    "Ératosthène mesure la circonférence de la Terre",
    "Fahrenheit met au point le thermomètre à mercure",
    "Jenner réalise la première vaccination",
    "Kekulé décrit la structure du benzène"
  ],
  reponse: [0, 1, 2, 3],
  explication: "Vers -240, 1714, 1796, 1865. Ératosthène s'est trompé de moins de 2 % en comparant l'ombre de deux villes égyptiennes."
},
{
  id: "sci-060", categorie: "sciences", niveau: 1, type: "qcm",
  question: "Quel gaz respirons-nous en plus grande quantité ?",
  choix: ["L'azote", "L'oxygène", "Le dioxyde de carbone", "La vapeur d'eau"],
  reponse: 0,
  explication: "Il entre et ressort presque inchangé : nos poumons ne savent pas l'utiliser, alors que certaines bactéries du sol le fixent sans peine."
},
{
  id: "sci-061", categorie: "sciences", niveau: 2, type: "qcm",
  question: "Quelle est la formule chimique du sel de table ?",
  choix: ["NaCl", "KCl", "NaHCO₃", "CaCO₃"],
  reponse: 0,
  explication: "Deux éléments dangereux séparément — le sodium s'enflamme dans l'eau, le chlore est un gaz toxique — mais inoffensifs une fois liés."
},
{
  id: "sci-062", categorie: "sciences", niveau: 2, type: "vrai_faux",
  question: "Un objet flotte s'il est moins dense que le liquide qui l'entoure.",
  reponse: true,
  explication: "C'est la poussée d'Archimède. Un porte-conteneurs en acier flotte parce que sa coque enferme surtout du vide."
},
{
  id: "sci-063", categorie: "sciences", niveau: 2, type: "chronologie",
  question: "Classez ces jalons de la médecine.",
  choix: [
    "Harvey décrit la circulation du sang",
    "Première opération sous anesthésie à l'éther",
    "Première radiographie utilisée en médecine",
    "Première IRM réalisée sur un être humain"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1628, 1846, 1896, 1977. Avant l'éther, la rapidité du chirurgien était son principal talent : certaines amputations duraient moins d'une minute."
},
{
  id: "sci-064", categorie: "sciences", niveau: 2, type: "qcm",
  question: "Quel gaz à effet de serre les activités humaines émettent-elles en plus grande quantité ?",
  choix: ["Le dioxyde de carbone", "Le méthane", "Le protoxyde d'azote", "L'ozone"],
  reponse: 0,
  explication: "Le méthane réchauffe bien plus à masse égale, mais il se dégrade en une douzaine d'années, alors que le CO₂ reste des siècles."
},
{
  id: "sci-065", categorie: "sciences", niveau: 2, type: "qcm",
  question: "Combien de temps met un globule rouge pour faire un tour complet de l'organisme ?",
  choix: ["Environ une minute", "Environ une heure", "Environ une seconde", "Environ une journée"],
  reponse: 0,
  explication: "Il répétera ce circuit pendant environ 120 jours, soit près de 170 000 tours, avant d'être recyclé par la rate."
},
{
  id: "sci-066", categorie: "sciences", niveau: 3, type: "qcm",
  question: "Quel est le métal le plus abondant dans la croûte terrestre ?",
  choix: ["L'aluminium", "Le fer", "Le cuivre", "Le magnésium"],
  reponse: 0,
  explication: "Si répandu et si difficile à isoler qu'au XIXe siècle il valait plus cher que l'or : Napoléon III réservait ses couverts en aluminium à ses hôtes de marque."
},
{
  id: "sci-067", categorie: "sciences", niveau: 3, type: "vrai_faux",
  question: "L'eau liquide est plus dense à 4 °C qu'à 0 °C.",
  reponse: true,
  explication: "Cette anomalie fait flotter la glace et stratifie les lacs : l'eau à 4 °C reste au fond, ce qui permet à la vie d'y passer l'hiver."
},
{
  id: "sci-068", categorie: "sciences", niveau: 3, type: "chronologie",
  question: "Classez ces inventions techniques.",
  choix: [
    "Première pile à combustible de William Grove",
    "Premier laser en fonctionnement",
    "Première fibre optique assez transparente pour les télécommunications",
    "Premier ordinateur quantique vendu commercialement"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1839, 1960, 1970, 2011. Le laser a longtemps été décrit comme « une solution en quête de problème »."
},
{
  id: "sci-069", categorie: "sciences", niveau: 3, type: "qcm",
  question: "Que permet de mesurer la parallaxe en astronomie ?",
  choix: [
    "La distance des étoiles proches",
    "La température d'une étoile",
    "La masse d'une galaxie",
    "L'âge de l'univers"
  ],
  reponse: 0,
  explication: "On observe le minuscule déplacement apparent d'une étoile à six mois d'intervalle ; le satellite Gaia l'a fait pour près de deux milliards d'astres."
},
{
  id: "sci-070", categorie: "sciences", niveau: 3, type: "vrai_faux",
  question: "Le proton et le neutron sont des particules élémentaires, c'est-à-dire insécables.",
  reponse: false,
  explication: "Chacun est fait de trois quarks liés par des gluons. L'électron, lui, reste élémentaire en l'état des connaissances."
}

]);

/* =============================================================================
   SCIENCES — deuxième série (40 questions)
   ============================================================================= */
window.QUESTIONS.push(...[

/* ------------------------------- NIVEAU 1 --------------------------------- */
{
  id: "sci-071", categorie: "sciences", niveau: 1, type: "qcm",
  question: "Quel est le symbole chimique de l'or ?",
  choix: ["Au", "Or", "Ag", "Go"],
  reponse: 0,
  explication: "Du latin aurum. Tout l'or jamais extrait tiendrait dans un cube d'une vingtaine de mètres de côté."
},
{
  id: "sci-072", categorie: "sciences", niveau: 1, type: "vrai_faux",
  question: "Le son se propage dans le vide.",
  reponse: false,
  explication: "Il lui faut de la matière à faire vibrer. Dans l'espace, une explosion serait parfaitement silencieuse."
},
{
  id: "sci-075", categorie: "sciences", niveau: 1, type: "chronologie",
  question: "Classez ces unités de longueur de la plus petite à la plus grande.",
  choix: ["Le millimètre", "Le centimètre", "Le mètre", "Le kilomètre"],
  reponse: [0, 1, 2, 3],
  explication: "Le mètre a d'abord été défini comme le dix-millionième du quart du méridien terrestre ; il l'est aujourd'hui par la vitesse de la lumière."
},
{
  id: "sci-076", categorie: "sciences", niveau: 1, type: "vrai_faux",
  question: "Tous les mammifères mettent au monde des petits déjà formés.",
  reponse: false,
  explication: "L'ornithorynque et les échidnés pondent des œufs. Ils allaitent pourtant leurs petits, ce qui en fait bien des mammifères."
},
{
  id: "sci-078", categorie: "sciences", niveau: 1, type: "qcm",
  question: "Quelle est la vitesse de la lumière dans le vide, en chiffres ronds ?",
  choix: ["300 000 km/s", "30 000 km/s", "3 000 000 km/s", "150 000 km/s"],
  reponse: 0,
  explication: "Exactement 299 792 458 m/s. Cette valeur n'est plus mesurée mais fixée par convention : c'est elle qui définit le mètre."
},
{
  id: "sci-079", categorie: "sciences", niveau: 1, type: "vrai_faux",
  question: "L'ADN a la forme d'une double hélice.",
  reponse: true,
  explication: "Déroulé bout à bout, l'ADN d'une seule cellule humaine mesurerait environ deux mètres."
},
{
  id: "sci-082", categorie: "sciences", niveau: 1, type: "chronologie",
  question: "Classez ces animaux du plus léger au plus lourd.",
  choix: ["L'abeille", "Le chat", "Le cheval", "La baleine bleue"],
  reponse: [0, 1, 2, 3],
  explication: "Environ 0,1 g, 4 kg, 500 kg et 150 tonnes. La baleine bleue est le plus gros animal ayant jamais vécu, dinosaures compris."
},
{
  id: "sci-083", categorie: "sciences", niveau: 1, type: "vrai_faux",
  question: "Le diamant est constitué de carbone pur.",
  reponse: true,
  explication: "Exactement le même élément que la mine d'un crayon. Seul l'arrangement des atomes change, et avec lui la dureté."
},
{
  id: "sci-084", categorie: "sciences", niveau: 1, type: "qcm",
  question: "Quel instrument mesure la pression atmosphérique ?",
  choix: ["Le baromètre", "Le thermomètre", "L'hygromètre", "L'anémomètre"],
  reponse: 0,
  explication: "Le premier, celui de Torricelli en 1643, était un simple tube de mercure retourné : la hauteur de la colonne donnait la pression."
},

/* ------------------------------- NIVEAU 2 --------------------------------- */
{
  id: "sci-085", categorie: "sciences", niveau: 2, type: "qcm",
  question: "Qui a formulé la théorie de l'évolution par sélection naturelle ?",
  choix: ["Charles Darwin", "Jean-Baptiste de Lamarck", "Gregor Mendel", "Louis Pasteur"],
  reponse: 0,
  explication: "Il a gardé sa théorie dans un tiroir pendant vingt ans. Il ne l'a publiée qu'en apprenant qu'un autre naturaliste, Alfred Wallace, était arrivé à la même conclusion."
},
{
  id: "sci-091", categorie: "sciences", niveau: 2, type: "qcm",
  question: "Quelle est l'unité de mesure de la puissance ?",
  choix: ["Le watt", "Le joule", "L'ampère", "Le volt"],
  reponse: 0,
  explication: "Un watt vaut un joule par seconde. L'unité porte le nom de James Watt, qui avait d'ailleurs introduit le cheval-vapeur pour vendre ses machines."
},
{
  id: "sci-092", categorie: "sciences", niveau: 2, type: "qcm",
  question: "Qui a énoncé la loi de la gravitation universelle ?",
  choix: ["Isaac Newton", "Galilée", "Johannes Kepler", "Albert Einstein"],
  reponse: 0,
  explication: "Son coup de génie n'est pas d'avoir vu tomber une pomme, mais d'avoir compris que la même force retient la Lune."
},
{
  id: "sci-093", categorie: "sciences", niveau: 2, type: "vrai_faux",
  question: "Un virus peut se reproduire seul, sans cellule hôte.",
  reponse: false,
  explication: "Il doit détourner la machinerie d'une cellule. C'est précisément ce qui fait douter de son appartenance au vivant."
},
{
  id: "sci-094", categorie: "sciences", niveau: 2, type: "qcm",
  question: "Combien de groupes le système sanguin ABO distingue-t-il ?",
  choix: ["4", "2", "6", "8"],
  reponse: 0,
  explication: "A, B, AB et O. Leur découverte en 1901 a rendu la transfusion possible : avant, une sur deux tuait le patient."
},
{
  id: "sci-095", categorie: "sciences", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le pays de naissance de Marie Curie.",
  reponse: "616",
  explication: "Née Maria Skłodowska à Varsovie. Seule personne à avoir reçu un prix Nobel dans deux sciences différentes, la physique et la chimie."
},
{
  id: "sci-096", categorie: "sciences", niveau: 2, type: "qcm",
  question: "Quel est l'élément le plus léger du tableau périodique ?",
  choix: ["L'hydrogène", "L'hélium", "Le lithium", "Le carbone"],
  reponse: 0,
  explication: "Un seul proton. Il représente à lui seul environ trois quarts de la masse ordinaire de l'univers."
},
{
  id: "sci-098", categorie: "sciences", niveau: 2, type: "vrai_faux",
  question: "Le sang est bleu dans les veines avant d'être oxygéné.",
  reponse: false,
  explication: "Il est rouge sombre. Les veines paraissent bleues parce que la peau diffuse davantage les grandes longueurs d'onde qu'elle ne laisse ressortir le rouge."
},

/* ------------------------------- NIVEAU 3 --------------------------------- */
{
  id: "sci-100", categorie: "sciences", niveau: 3, type: "qcm",
  question: "Que mesure l'échelle de Richter ?",
  choix: ["L'énergie libérée par un séisme", "Les dégâts d'un séisme",
          "La profondeur d'un séisme", "La durée d'un séisme"],
  reponse: 0,
  explication: "Elle est logarithmique : un degré de plus, c'est trente fois plus d'énergie. Les dégâts ressentis relèvent d'une autre échelle, celle de Mercalli."
},
{
  id: "sci-101", categorie: "sciences", niveau: 3, type: "vrai_faux",
  question: "Un catalyseur est consommé au cours de la réaction qu'il accélère.",
  reponse: false,
  explication: "Il se retrouve intact à la fin. C'est ce qui permet à quelques grammes de platine de traiter les gaz d'échappement d'une voiture pendant des années."
},
{
  id: "sci-102", categorie: "sciences", niveau: 3, type: "qcm",
  question: "Que mesure le pH d'une solution ?",
  choix: ["Son acidité", "Sa température", "Sa densité", "Sa conductivité"],
  reponse: 0,
  explication: "Échelle logarithmique de 0 à 14 : un pH de 3 est dix fois plus acide qu'un pH de 4. Le sang humain se maintient très étroitement autour de 7,4."
},
{
  id: "sci-103", categorie: "sciences", niveau: 3, type: "chronologie",
  question: "Classez ces objets par masse croissante.",
  choix: ["Un électron", "Un proton", "Un atome d'hélium", "Une molécule d'eau"],
  reponse: [0, 1, 2, 3],
  explication: "L'électron est près de deux mille fois plus léger que le proton : presque toute la masse d'un atome tient dans son noyau."
},
{
  id: "sci-104", categorie: "sciences", niveau: 3, type: "qcm",
  question: "Qui a établi la première classification périodique des éléments ?",
  choix: ["Dmitri Mendeleïev", "Antoine Lavoisier", "John Dalton", "Marie Curie"],
  reponse: 0,
  explication: "En 1869, il a laissé des cases vides pour des éléments encore inconnus, en prédisant leurs propriétés. Ils ont été découverts dans les vingt ans."
},
{
  id: "sci-105", categorie: "sciences", niveau: 3, type: "vrai_faux",
  question: "L'ARN messager sert d'intermédiaire entre l'ADN et les protéines.",
  reponse: true,
  explication: "Il copie une portion du gène et l'emporte hors du noyau, là où la protéine sera assemblée. L'ADN, lui, ne quitte jamais le noyau."
},
{
  id: "sci-106", categorie: "sciences", niveau: 3, type: "qcm",
  question: "Comment appelle-t-on le passage direct de l'état solide à l'état gazeux ?",
  choix: ["La sublimation", "La fusion", "La condensation", "La vaporisation"],
  reponse: 0,
  explication: "C'est le cas de la neige carbonique, qui ne mouille jamais, et de la neige ordinaire par grand froid et grand soleil."
},
{
  id: "sci-107", categorie: "sciences", niveau: 3, type: "qcm",
  question: "Quelle réaction alimente l'énergie des étoiles ?",
  choix: ["La fusion nucléaire", "La fission nucléaire", "La combustion chimique", "La radioactivité naturelle"],
  reponse: 0,
  explication: "Quatre noyaux d'hydrogène en donnent un d'hélium, un peu plus léger. La masse manquante part en énergie, selon E = mc²."
},
{
  id: "sci-108", categorie: "sciences", niveau: 3, type: "vrai_faux",
  question: "Deux isotopes d'un même élément diffèrent par leur nombre de protons.",
  reponse: false,
  explication: "Ils diffèrent par leurs neutrons. Le nombre de protons, lui, définit l'élément : le changer, c'est changer de case dans le tableau périodique."
},
{
  id: "sci-109", categorie: "sciences", niveau: 3, type: "qcm",
  question: "Quel est le plus gros organe interne du corps humain ?",
  choix: ["Le foie", "Le cerveau", "Les poumons", "L'estomac"],
  reponse: 0,
  explication: "Environ 1,5 kg, et le seul organe humain capable de se régénérer : on peut en prélever une part importante, il repousse."
},
{
  id: "sci-110", categorie: "sciences", niveau: 3, type: "distance",
  question: "Cliquez sur la ville près de laquelle se trouve le CERN et son grand collisionneur.",
  reponse: [46.2044, 6.1432],
  explication: "Genève. L'anneau de 27 km passe sous la frontière franco-suisse : les protons y changent de pays plus de dix mille fois par seconde."
}

]);
