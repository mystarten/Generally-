/* =============================================================================
   POLITIQUE — institutions, régimes et géopolitique structurelle
   -----------------------------------------------------------------------------
   Parti pris : des faits datés et des mécanismes durables plutôt que l'actualité.
   Aucune question ne porte sur « qui dirige aujourd'hui » ni sur l'état d'un
   conflit en cours : ces réponses se périment en quelques mois et rendraient la
   banque fausse. On y trouve en revanche les rouages qui, eux, ne bougent pas :
   comment se prend une décision, qui nomme qui, quel traité fonde quoi.

   Conventions identiques à data/geographie.js.
   ============================================================================= */
window.QUESTIONS = window.QUESTIONS || [];
window.QUESTIONS.push(...[

/* ============================== NIVEAU 1 ================================== */

{
  id: "pol-001", categorie: "politique", niveau: 1, type: "qcm",
  question: "Combien de temps dure le mandat du président de la République française ?",
  choix: ["5 ans", "7 ans", "4 ans", "6 ans"],
  reponse: 0,
  explication: "Le septennat est devenu quinquennat par le référendum de septembre 2000, appliqué pour la première fois en 2002."
},
{
  id: "pol-002", categorie: "politique", niveau: 1, type: "qcm",
  question: "Combien de députés siègent à l'Assemblée nationale ?",
  choix: ["577", "348", "500", "650"],
  reponse: 0,
  explication: "Un député pour environ 115 000 habitants. Le chiffre est plafonné par la Constitution depuis 2008."
},
{
  id: "pol-003", categorie: "politique", niveau: 1, type: "vrai_faux",
  question: "Le président de la République nomme le Premier ministre.",
  reponse: true,
  explication: "Il le nomme seul, mais ne peut pas le révoquer : le Premier ministre remet lui-même la démission de son gouvernement."
},
{
  id: "pol-004", categorie: "politique", niveau: 1, type: "qcm",
  question: "En quelle année la Ve République a-t-elle été instaurée ?",
  choix: ["1958", "1945", "1962", "1968"],
  reponse: 0,
  explication: "Constitution du 4 octobre 1958, rédigée en quelques mois pendant la crise algérienne. De Gaulle en sera le premier président."
},
{
  id: "pol-005", categorie: "politique", niveau: 1, type: "vrai_faux",
  question: "En France, les femmes ont obtenu le droit de vote en même temps que les hommes.",
  reponse: false,
  explication: "Le suffrage universel masculin date de 1848 ; les femmes ont dû attendre l'ordonnance d'avril 1944 et ont voté pour la première fois en 1945."
},
{
  id: "pol-006", categorie: "politique", niveau: 1, type: "qcm",
  question: "Que sépare la loi française de 1905 ?",
  choix: ["Les Églises et l'État", "L'école et la famille", "La justice et la police", "L'armée et la nation"],
  reponse: 0,
  explication: "Elle garantit la liberté de culte tout en supprimant le financement public des religions. L'Alsace-Moselle, alors allemande, n'y est toujours pas soumise."
},
{
  id: "pol-007", categorie: "politique", niveau: 1, type: "qcm",
  question: "Qui vote les lois en France ?",
  choix: ["Le Parlement", "Le gouvernement", "Le Conseil constitutionnel", "Le président seul"],
  reponse: 0,
  explication: "Le Parlement réunit l'Assemblée nationale et le Sénat. En cas de désaccord persistant, c'est l'Assemblée qui tranche en dernier mot."
},
{
  id: "pol-008", categorie: "politique", niveau: 1, type: "vrai_faux",
  question: "Le maire est élu directement par les habitants de sa commune.",
  reponse: false,
  explication: "Les habitants élisent le conseil municipal, qui élit ensuite le maire parmi ses membres."
},
{
  id: "pol-009", categorie: "politique", niveau: 1, type: "qcm",
  question: "À quel âge devient-on majeur en France ?",
  choix: ["18 ans", "21 ans", "16 ans", "20 ans"],
  reponse: 0,
  explication: "La majorité est passée de 21 à 18 ans en 1974, l'une des premières mesures du septennat de Valéry Giscard d'Estaing."
},
{
  id: "pol-010", categorie: "politique", niveau: 1, type: "clic_pays",
  question: "Cliquez sur le pays où siège le Parlement européen en session plénière.",
  reponse: "250",
  explication: "À Strasbourg, douze sessions par an. Les commissions, elles, se réunissent à Bruxelles : un double siège inscrit dans les traités."
},
{
  id: "pol-011", categorie: "politique", niveau: 1, type: "qcm",
  question: "Que désigne la démocratie, littéralement ?",
  choix: ["Le pouvoir du peuple", "Le pouvoir des sages", "Le pouvoir de la loi", "Le pouvoir du meilleur"],
  reponse: 0,
  explication: "Du grec dêmos, le peuple, et kratos, le pouvoir. À Athènes, elle excluait femmes, esclaves et étrangers, soit l'immense majorité des habitants."
},
{
  id: "pol-012", categorie: "politique", niveau: 1, type: "vrai_faux",
  question: "Le Sénat français peut être dissous par le président de la République.",
  reponse: false,
  explication: "Seule l'Assemblée nationale peut l'être. Le Sénat, renouvelé par moitié tous les trois ans, assure une continuité institutionnelle."
},
{
  id: "pol-013", categorie: "politique", niveau: 1, type: "qcm",
  question: "Dans quel texte de 1789 trouve-t-on « Les hommes naissent et demeurent libres et égaux en droits » ?",
  choix: [
    "La Déclaration des droits de l'homme et du citoyen",
    "Le serment du Jeu de paume",
    "La Constitution civile du clergé",
    "Le Contrat social"
  ],
  reponse: 0,
  explication: "Adoptée le 26 août 1789, elle figure toujours dans le préambule de la Constitution française et a donc valeur de droit positif."
},
{
  id: "pol-015", categorie: "politique", niveau: 1, type: "vrai_faux",
  question: "La peine de mort a été abolie en France dans les années 1980.",
  reponse: true,
  explication: "Loi du 9 octobre 1981, portée par Robert Badinter. L'abolition a été inscrite dans la Constitution en 2007 pour la rendre irréversible."
},
{
  id: "pol-016", categorie: "politique", niveau: 1, type: "qcm",
  question: "Que signifie l'expression « voter blanc » ?",
  choix: [
    "Déposer une enveloppe vide ou un bulletin sans nom",
    "Voter pour le candidat arrivé en tête",
    "S'abstenir de se déplacer",
    "Annuler son vote précédent"
  ],
  reponse: 0,
  explication: "Depuis 2014 les votes blancs sont décomptés séparément des nuls, mais ils n'entrent toujours pas dans les suffrages exprimés."
},
{
  id: "pol-017", categorie: "politique", niveau: 1, type: "clic_pays",
  question: "Cliquez sur le pays qui accueille le siège de l'ONU.",
  reponse: "840",
  explication: "À New York, sur un terrain offert par John D. Rockefeller Jr. en 1946. L'enceinte est un territoire international."
},
{
  id: "pol-018", categorie: "politique", niveau: 1, type: "qcm",
  question: "Comment appelle-t-on un régime où le pouvoir se transmet par hérédité au sein d'une famille ?",
  choix: ["Une monarchie", "Une oligarchie", "Une république", "Une théocratie"],
  reponse: 0,
  explication: "Une monarchie peut être constitutionnelle : le souverain règne sans gouverner, comme au Royaume-Uni, en Espagne ou au Japon."
},
{
  id: "pol-020", categorie: "politique", niveau: 1, type: "qcm",
  question: "Combien de sénateurs compte le Sénat français ?",
  choix: ["348", "577", "300", "400"],
  reponse: 0,
  explication: "Élus pour six ans au suffrage indirect par environ 162 000 grands électeurs, essentiellement des élus locaux."
},
{
  id: "pol-021", categorie: "politique", niveau: 1, type: "qcm",
  question: "Qui vote le budget de l'État en France ?",
  choix: ["Le Parlement", "Le Conseil constitutionnel", "La Cour des comptes", "Le président de la République"],
  reponse: 0,
  explication: "C'est la loi de finances, examinée chaque automne. Le consentement à l'impôt par les représentants du peuple est un principe de 1789."
},
{
  id: "pol-022", categorie: "politique", niveau: 1, type: "vrai_faux",
  question: "La France est un État fédéral.",
  reponse: false,
  explication: "C'est un État unitaire décentralisé : les régions et communes ont des compétences, mais pas de pouvoir législatif propre, contrairement aux Länder allemands."
},
{
  id: "pol-023", categorie: "politique", niveau: 1, type: "clic_pays",
  question: "Cliquez sur le pays dont le Parlement siège à Westminster.",
  reponse: "826",
  explication: "Le Royaume-Uni n'a pas de constitution écrite en un seul texte : son droit constitutionnel est fait de lois, d'usages et de jurisprudence."
},
{
  id: "pol-024", categorie: "politique", niveau: 1, type: "qcm",
  question: "Que célèbre le 14 juillet en France ?",
  choix: [
    "La prise de la Bastille et la fête de la Fédération",
    "La proclamation de la République",
    "La fin de la Seconde Guerre mondiale",
    "L'adoption de la Constitution"
  ],
  reponse: 0,
  explication: "La loi de 1880 est restée volontairement ambiguë : elle permet de fêter aussi bien 1789 que la Fédération de 1790, plus consensuelle."
},
{
  id: "pol-025", categorie: "politique", niveau: 1, type: "qcm",
  question: "Combien d'étoiles compte le drapeau européen ?",
  choix: ["12", "27", "15", "9"],
  reponse: 0,
  explication: "Douze, sans lien avec le nombre d'États : le chiffre symbolise la plénitude et n'a jamais changé au fil des élargissements."
},
{
  id: "pol-026", categorie: "politique", niveau: 1, type: "vrai_faux",
  question: "Le vote est obligatoire dans certains pays.",
  reponse: true,
  explication: "En Belgique, en Australie ou au Brésil notamment. L'Australie sanctionne l'abstention d'une amende modeste, et la participation y dépasse 90 %."
},
{
  id: "pol-027", categorie: "politique", niveau: 1, type: "qcm",
  question: "Que fait le Conseil constitutionnel français ?",
  choix: [
    "Il vérifie qu'une loi respecte la Constitution",
    "Il juge les crimes politiques",
    "Il rédige les projets de loi",
    "Il contrôle les dépenses de l'État"
  ],
  reponse: 0,
  explication: "Neuf membres nommés pour neuf ans, renouvelés par tiers. Les anciens présidents de la République en sont membres de droit à vie."
},
{
  id: "pol-028", categorie: "politique", niveau: 1, type: "qcm",
  question: "Dans quelle ville siège la Banque centrale européenne ?",
  choix: ["Francfort", "Bruxelles", "Luxembourg", "Strasbourg"],
  reponse: 0,
  explication: "Son mandat principal est la stabilité des prix, avec une cible d'inflation de 2 % à moyen terme."
},
{
  id: "pol-029", categorie: "politique", niveau: 1, type: "vrai_faux",
  question: "Les députés européens sont élus au suffrage universel direct.",
  reponse: true,
  explication: "Depuis 1979. C'est la seule institution de l'Union élue directement par les citoyens, dans le cadre d'élections nationales simultanées."
},
{
  id: "pol-030", categorie: "politique", niveau: 1, type: "chronologie",
  question: "Classez ces conquêtes de droits en France.",
  choix: [
    "Suffrage universel masculin",
    "Droit de vote des femmes",
    "Majorité abaissée à 18 ans",
    "Abolition de la peine de mort"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1848, 1944, 1974, 1981. Près d'un siècle sépare le vote des hommes de celui des femmes."
},
{
  id: "pol-031", categorie: "politique", niveau: 1, type: "qcm",
  question: "Que désigne le terme « abstention » lors d'une élection ?",
  choix: [
    "Le fait de ne pas aller voter",
    "Le fait de voter blanc",
    "Le fait de voter deux fois",
    "Le fait d'annuler son bulletin"
  ],
  reponse: 0,
  explication: "Elle se distingue du vote blanc, qui suppose un déplacement au bureau de vote, et du vote nul, où le bulletin est invalide."
},
{
  id: "pol-032", categorie: "politique", niveau: 1, type: "clic_pays",
  question: "Cliquez sur le pays où siège l'OTAN.",
  reponse: "056",
  explication: "À Bruxelles depuis 1967 : l'Alliance avait dû quitter Paris après le retrait français du commandement intégré décidé par de Gaulle."
},
{
  id: "pol-033", categorie: "politique", niveau: 1, type: "qcm",
  question: "Combien de tours compte l'élection présidentielle française ?",
  choix: ["Deux", "Un", "Trois", "Autant que nécessaire"],
  reponse: 0,
  explication: "Le second tour n'oppose que les deux candidats arrivés en tête. Aucun président n'a jamais été élu dès le premier tour sous la Ve République."
},
{
  id: "pol-034", categorie: "politique", niveau: 1, type: "vrai_faux",
  question: "Un référendum permet aux citoyens de répondre directement par oui ou par non à une question.",
  reponse: true,
  explication: "En France, l'article 11 de la Constitution le permet. Le dernier référendum national date de 2005, sur le traité constitutionnel européen, rejeté à 55 %."
},
{
  id: "pol-035", categorie: "politique", niveau: 1, type: "qcm",
  question: "Que produit principalement l'Organisation des pays exportateurs de pétrole ?",
  choix: [
    "Des quotas de production de brut",
    "Des normes environnementales",
    "Des prix fixes à la pompe",
    "Des accords de libre-échange"
  ],
  reponse: 0,
  explication: "En ajustant les volumes produits, l'OPEP pèse sur les cours mondiaux. Élargie à la Russie et à d'autres producteurs, elle est appelée OPEP+."
},
{
  id: "pol-036", categorie: "politique", niveau: 1, type: "qcm",
  question: "D'où vient l'opposition entre « la gauche » et « la droite » en politique ?",
  choix: [
    "De la place des députés dans l'Assemblée de 1789",
    "Du sens de lecture des bulletins de vote",
    "De la main utilisée pour prêter serment",
    "Des couleurs des premiers partis"
  ],
  reponse: 0,
  explication: "En 1789, les partisans du veto royal s'étaient assis à la droite du président de séance, leurs adversaires à sa gauche. L'usage a traversé deux siècles."
},
{
  id: "pol-037", categorie: "politique", niveau: 1, type: "vrai_faux",
  question: "La Suisse organise plusieurs votations populaires par an.",
  reponse: true,
  explication: "Trois ou quatre dimanches de votation annuels. Cent mille signatures suffisent à soumettre une initiative à l'ensemble du corps électoral."
},
{
  id: "pol-038", categorie: "politique", niveau: 1, type: "qcm",
  question: "Quel document de 1948 proclame des droits valables pour tous les êtres humains ?",
  choix: [
    "La Déclaration universelle des droits de l'homme",
    "La Charte des Nations unies",
    "La convention de Genève",
    "Le traité de Rome"
  ],
  reponse: 0,
  explication: "Adoptée à Paris le 10 décembre 1948, sous l'impulsion notamment d'Eleanor Roosevelt et du Français René Cassin. Elle n'a pas force obligatoire."
}

]);

/* ============================== NIVEAU 2 ================================== */
window.QUESTIONS.push(...[

{
  id: "pol-039", categorie: "politique", niveau: 2, type: "qcm",
  question: "Que permet l'article 49.3 de la Constitution française ?",
  choix: [
    "Adopter un texte sans vote, sauf motion de censure",
    "Dissoudre l'Assemblée nationale",
    "Gouverner par ordonnances",
    "Suspendre les libertés publiques"
  ],
  reponse: 0,
  explication: "Le gouvernement engage sa responsabilité : le texte passe automatiquement, sauf si une motion de censure est votée dans les 24 heures et adoptée."
},
{
  id: "pol-040", categorie: "politique", niveau: 2, type: "qcm",
  question: "Que faut-il pour qu'une motion de censure renverse le gouvernement français ?",
  choix: [
    "La majorité absolue des députés",
    "La majorité des votants",
    "Un vote du Sénat",
    "L'accord du Conseil constitutionnel"
  ],
  reponse: 0,
  explication: "Seuls les votes favorables sont comptés : une abstention équivaut à un soutien au gouvernement. Une seule motion a abouti sous la Ve République, en 1962."
},
{
  id: "pol-041", categorie: "politique", niveau: 2, type: "vrai_faux",
  question: "Le président français peut dissoudre l'Assemblée nationale autant de fois qu'il le souhaite.",
  reponse: false,
  explication: "L'article 12 interdit une nouvelle dissolution dans l'année qui suit les élections qu'elle a provoquées."
},
{
  id: "pol-043", categorie: "politique", niveau: 2, type: "qcm",
  question: "Qu'est-ce qu'une cohabitation sous la Ve République ?",
  choix: [
    "Un président et un Premier ministre de camps opposés",
    "Deux présidents en exercice",
    "Un gouvernement sans majorité",
    "Une coalition entre deux partis"
  ],
  reponse: 0,
  explication: "Il y en a eu trois : 1986-1988, 1993-1995 et 1997-2002. Le quinquennat et l'inversion du calendrier électoral les ont rendues improbables."
},
{
  id: "pol-044", categorie: "politique", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le pays où siège la Cour européenne des droits de l'homme.",
  reponse: "250",
  explication: "À Strasbourg. Elle relève du Conseil de l'Europe, 46 États, et non de l'Union européenne : deux organisations souvent confondues."
},
{
  id: "pol-045", categorie: "politique", niveau: 2, type: "qcm",
  question: "Combien de sénateurs compte le Sénat des États-Unis ?",
  choix: ["100", "435", "538", "50"],
  reponse: 0,
  explication: "Deux par État, quelle que soit sa population : le Wyoming et la Californie y pèsent autant, alors que l'un compte 68 fois moins d'habitants."
},
{
  id: "pol-046", categorie: "politique", niveau: 2, type: "qcm",
  question: "Combien de grands électeurs faut-il pour être élu président des États-Unis ?",
  choix: ["270", "435", "218", "300"],
  reponse: 0,
  explication: "La majorité absolue des 538 grands électeurs. Un candidat peut donc l'emporter en ayant réuni moins de voix que son adversaire, ce qui s'est produit cinq fois."
},
{
  id: "pol-047", categorie: "politique", niveau: 2, type: "vrai_faux",
  question: "En Allemagne, le chancelier ne peut être renversé que si le Bundestag lui désigne aussitôt un successeur.",
  reponse: true,
  explication: "C'est la motion de censure constructive, inventée en 1949 pour éviter l'instabilité qui avait miné la république de Weimar. Elle n'a abouti qu'une fois, en 1982."
},
{
  id: "pol-048", categorie: "politique", niveau: 2, type: "qcm",
  question: "Que garantit l'article 5 du traité de l'Atlantique Nord ?",
  choix: [
    "Une attaque contre un membre est une attaque contre tous",
    "Le libre-échange entre les membres",
    "Le partage du renseignement",
    "Un budget militaire commun"
  ],
  reponse: 0,
  explication: "Invoqué une seule fois dans l'histoire de l'Alliance, au lendemain du 11 septembre 2001, et au bénéfice des États-Unis."
},
{
  id: "pol-050", categorie: "politique", niveau: 2, type: "qcm",
  question: "Qu'est-ce que la question prioritaire de constitutionnalité, en France ?",
  choix: [
    "La possibilité pour un justiciable de contester une loi déjà en vigueur",
    "Un recours contre une décision de justice",
    "Une saisine réservée au président",
    "Un référendum d'initiative citoyenne"
  ],
  reponse: 0,
  explication: "Introduite en 2008 et applicable depuis 2010, elle a rompu avec un système où seule une poignée d'autorités pouvait saisir le Conseil constitutionnel, et seulement avant promulgation."
},
{
  id: "pol-051", categorie: "politique", niveau: 2, type: "chronologie",
  question: "Classez ces traités européens.",
  choix: [
    "Traité de Rome",
    "Acte unique européen",
    "Traité de Maastricht",
    "Traité de Lisbonne"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1957, 1986, 1992, 2007. Maastricht crée l'Union et prépare l'euro ; Lisbonne reprend l'essentiel du traité constitutionnel rejeté en 2005."
},
{
  id: "pol-053", categorie: "politique", niveau: 2, type: "qcm",
  question: "Qu'est-ce qu'un régime parlementaire ?",
  choix: [
    "Un régime où le gouvernement est responsable devant le Parlement",
    "Un régime sans chef de l'État",
    "Un régime où les ministres sont élus",
    "Un régime à parti unique"
  ],
  reponse: 0,
  explication: "Le Parlement peut renverser le gouvernement, qui peut souvent dissoudre le Parlement. La France mêle ce mécanisme à un président élu au suffrage direct."
},
{
  id: "pol-054", categorie: "politique", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le pays dont le gouvernement est un collège de sept membres à présidence tournante.",
  reponse: "756",
  explication: "Le Conseil fédéral suisse. La présidence change chaque année et son titulaire reste un ministre parmi les autres : la Suisse n'a pas de véritable chef de l'État."
},
{
  id: "pol-055", categorie: "politique", niveau: 2, type: "qcm",
  question: "Que signifie le principe de subsidiarité dans l'Union européenne ?",
  choix: [
    "L'Union n'agit que si les États ne peuvent mieux faire",
    "Les petits États ont un droit de veto",
    "Les aides vont aux régions pauvres",
    "Chaque État finance ses propres politiques"
  ],
  reponse: 0,
  explication: "Inscrit à Maastricht. Les parlements nationaux peuvent adresser un « carton jaune » à la Commission s'ils estiment le principe méconnu."
},
{
  id: "pol-056", categorie: "politique", niveau: 2, type: "vrai_faux",
  question: "Le Royaume-Uni ne possède pas de constitution écrite rassemblée en un seul texte.",
  reponse: true,
  explication: "Son droit constitutionnel se compose de lois éparses, d'usages et de jurisprudence, de la Magna Carta de 1215 aux réformes récentes."
},
{
  id: "pol-057", categorie: "politique", niveau: 2, type: "qcm",
  question: "Combien de régions compte la France métropolitaine depuis la réforme de 2016 ?",
  choix: ["13", "22", "18", "26"],
  reponse: 0,
  explication: "Contre 22 auparavant. Avec les cinq régions d'outre-mer, la France en compte 18 au total."
},
{
  id: "pol-058", categorie: "politique", niveau: 2, type: "qcm",
  question: "Quelle juridiction française est au sommet de l'ordre administratif ?",
  choix: ["Le Conseil d'État", "La Cour de cassation", "La Cour des comptes", "Le Conseil constitutionnel"],
  reponse: 0,
  explication: "Il juge les litiges avec l'administration et conseille aussi le gouvernement sur les projets de loi : une double casquette héritée de Napoléon."
},
{
  id: "pol-059", categorie: "politique", niveau: 2, type: "multi_pays",
  question: "Sélectionnez les six États fondateurs de la construction européenne en 1957.",
  reponse: ["250", "276", "380", "056", "528", "442"],
  explication: "France, Allemagne, Italie et les trois du Benelux. Le traité de Rome instaure un marché commun entre à peine 170 millions d'habitants."
},
{
  id: "pol-060", categorie: "politique", niveau: 2, type: "qcm",
  question: "Que désigne l'espace Schengen ?",
  choix: [
    "Une zone de libre circulation sans contrôle aux frontières intérieures",
    "La zone où l'euro a cours",
    "L'union douanière européenne",
    "Le marché unique de l'énergie"
  ],
  reponse: 0,
  explication: "Il déborde l'Union : la Suisse, la Norvège et l'Islande en font partie sans en être membres, tandis que l'Irlande a choisi de rester à l'écart."
},
{
  id: "pol-061", categorie: "politique", niveau: 2, type: "vrai_faux",
  question: "Un traité international signé par la France entre en vigueur sans intervention du Parlement.",
  reponse: false,
  explication: "Les traités les plus importants doivent être ratifiés par une loi. Une fois ratifiés, ils ont une autorité supérieure à celle des lois françaises."
},
{
  id: "pol-062", categorie: "politique", niveau: 2, type: "qcm",
  question: "Qu'est-ce qu'une zone économique exclusive ?",
  choix: [
    "Une bande maritime de 200 milles où l'État exploite les ressources",
    "Une zone franche sans impôts",
    "Un territoire sans douane",
    "Une réserve naturelle internationale"
  ],
  reponse: 0,
  explication: "Environ 370 km depuis les côtes. Grâce à ses territoires d'outre-mer, la France dispose de l'une des deux plus vastes du monde."
},
{
  id: "pol-063", categorie: "politique", niveau: 2, type: "chronologie",
  question: "Classez ces jalons de la construction sociale française.",
  choix: [
    "Création de la Sécurité sociale",
    "Création du SMIC",
    "Loi Veil sur l'interruption volontaire de grossesse",
    "Instauration du PACS"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1945, 1970, 1975, 1999. Le SMIC remplace le SMIG de 1950 en indexant le salaire minimum sur la croissance, et plus seulement sur les prix."
},
{
  id: "pol-064", categorie: "politique", niveau: 2, type: "qcm",
  question: "Quel organe de l'ONU compte 193 membres disposant chacun d'une voix ?",
  choix: [
    "L'Assemblée générale",
    "Le Conseil de sécurité",
    "Le Conseil économique et social",
    "Le Secrétariat"
  ],
  reponse: 0,
  explication: "Une voix pour Nauru comme pour la Chine. Ses résolutions n'ont toutefois pas de force contraignante, contrairement à celles du Conseil de sécurité."
},
{
  id: "pol-065", categorie: "politique", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le pays où siège la Cour pénale internationale.",
  reponse: "528",
  explication: "À La Haye, créée par le statut de Rome de 1998. Ni les États-Unis, ni la Russie, ni la Chine, ni l'Inde n'en sont parties."
},
{
  id: "pol-066", categorie: "politique", niveau: 2, type: "vrai_faux",
  question: "Le cumul d'un mandat de député et d'une fonction de maire est interdit en France.",
  reponse: true,
  explication: "Depuis 2017, en application d'une loi de 2014. Avant cela, près de la moitié des députés dirigeaient aussi une collectivité."
},
{
  id: "pol-067", categorie: "politique", niveau: 2, type: "qcm",
  question: "Que sont les BRICS à l'origine ?",
  choix: [
    "Un acronyme désignant cinq grandes économies émergentes",
    "Une alliance militaire",
    "Une zone de libre-échange",
    "Un fonds monétaire régional"
  ],
  reponse: 0,
  explication: "Brésil, Russie, Inde, Chine, Afrique du Sud. Le terme a été forgé en 2001 par un économiste de banque d'affaires, bien avant que le groupe n'existe politiquement."
},
{
  id: "pol-068", categorie: "politique", niveau: 2, type: "qcm",
  question: "Qu'est-ce que le droit du sol ?",
  choix: [
    "L'attribution de la nationalité selon le lieu de naissance",
    "Le droit de propriété sur un terrain",
    "Le droit de cultiver une terre",
    "La souveraineté d'un État sur son territoire"
  ],
  reponse: 0,
  explication: "Il s'oppose au droit du sang, fondé sur la filiation. La France combine les deux, avec des conditions de résidence."
},
{
  id: "pol-069", categorie: "politique", niveau: 2, type: "vrai_faux",
  question: "Le Conseil de sécurité de l'ONU peut autoriser le recours à la force.",
  reponse: true,
  explication: "C'est le chapitre VII de la Charte. Hors légitime défense, c'est la seule base légale d'un emploi de la force entre États."
},
{
  id: "pol-070", categorie: "politique", niveau: 2, type: "qcm",
  question: "Quel scrutin est utilisé pour élire les députés français ?",
  choix: [
    "Le scrutin majoritaire uninominal à deux tours",
    "La représentation proportionnelle intégrale",
    "Le scrutin de liste à un tour",
    "Le vote préférentiel"
  ],
  reponse: 0,
  explication: "Une circonscription, un siège. Ce mode amplifie la majorité et pénalise les partis dont l'électorat est dispersé sur tout le territoire."
},
{
  id: "pol-071", categorie: "politique", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le pays dont le Parlement compte 120 sièges et s'appelle la Knesset.",
  reponse: "376",
  explication: "Élue à la proportionnelle intégrale sur une circonscription unique, ce qui multiplie les partis et rend les coalitions inévitables."
},
{
  id: "pol-072", categorie: "politique", niveau: 2, type: "qcm",
  question: "Qu'est-ce qu'un État de droit ?",
  choix: [
    "Un État où les pouvoirs publics sont eux-mêmes soumis au droit",
    "Un État qui possède une constitution",
    "Un État où la justice est gratuite",
    "Un État sans peine de mort"
  ],
  reponse: 0,
  explication: "La notion suppose une hiérarchie des normes et un juge capable de censurer l'administration, voire le législateur."
},
{
  id: "pol-073", categorie: "politique", niveau: 2, type: "chronologie",
  question: "Classez ces élargissements et retraits européens.",
  choix: [
    "Entrée du Royaume-Uni dans la Communauté",
    "Réunification allemande",
    "Élargissement à dix pays d'Europe centrale et orientale",
    "Sortie du Royaume-Uni de l'Union"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1973, 1990, 2004, 2020. En 1990, l'ex-RDA est entrée dans la Communauté sans négociation, par le simple fait de la réunification."
},
{
  id: "pol-074", categorie: "politique", niveau: 2, type: "vrai_faux",
  question: "En France, le Premier ministre est nécessairement choisi parmi les députés.",
  reponse: false,
  explication: "La Constitution n'impose rien. Plusieurs Premiers ministres n'avaient jamais été élus, et un membre du gouvernement doit de toute façon renoncer à son siège de parlementaire."
},
{
  id: "pol-075", categorie: "politique", niveau: 2, type: "qcm",
  question: "Que mesure l'indice de développement humain, publié par l'ONU ?",
  choix: [
    "Santé, éducation et niveau de vie combinés",
    "La seule richesse par habitant",
    "Les inégalités de revenus",
    "La qualité des institutions"
  ],
  reponse: 0,
  explication: "Créé en 1990 à l'initiative de l'économiste Amartya Sen et du Pakistanais Mahbub ul Haq, précisément pour détrôner le PIB comme mesure du progrès."
},
{
  id: "pol-076", categorie: "politique", niveau: 2, type: "distance",
  question: "Cliquez sur Bruxelles, capitale de fait de l'Union européenne.",
  reponse: [50.8503, 4.3517],
  explication: "La ville concentre la Commission, le Conseil et l'OTAN : c'est la deuxième concentration de diplomates au monde après New York."
},
{
  id: "pol-077", categorie: "politique", niveau: 2, type: "qcm",
  question: "Combien d'États reconnaît officiellement le traité de non-prolifération comme puissances nucléaires ?",
  choix: ["Cinq", "Neuf", "Trois", "Sept"],
  reponse: 0,
  explication: "Ceux qui avaient procédé à un essai avant 1967, soit les cinq membres permanents du Conseil de sécurité. D'autres États détiennent l'arme sans être reconnus par le traité."
},
{
  id: "pol-078", categorie: "politique", niveau: 2, type: "vrai_faux",
  question: "L'interruption volontaire de grossesse a été inscrite dans la Constitution française en 2024.",
  reponse: true,
  explication: "Le Congrès réuni à Versailles en mars 2024 a inscrit la « liberté garantie » d'y recourir : une première mondiale au niveau constitutionnel."
}

]);

/* ============================== NIVEAU 3 ================================== */
window.QUESTIONS.push(...[

{
  id: "pol-079", categorie: "politique", niveau: 3, type: "qcm",
  question: "Que permet l'article 16 de la Constitution française ?",
  choix: [
    "Au président de concentrer les pouvoirs en cas de crise majeure",
    "De réviser la Constitution par référendum",
    "De suspendre le Parlement pendant six mois",
    "De déclarer l'état de siège"
  ],
  reponse: 0,
  explication: "Utilisé une seule fois, par de Gaulle après le putsch d'Alger en 1961 — mais maintenu cinq mois, bien après la fin de la crise, ce qui a nourri la méfiance."
},
{
  id: "pol-080", categorie: "politique", niveau: 3, type: "qcm",
  question: "Que prévoit l'article 7 du traité sur l'Union européenne ?",
  choix: [
    "Une procédure de sanction en cas d'atteinte grave à l'État de droit",
    "La sortie volontaire d'un État membre",
    "L'adhésion de nouveaux membres",
    "La révision des traités"
  ],
  reponse: 0,
  explication: "Il peut aller jusqu'à la suspension du droit de vote au Conseil, mais exige l'unanimité des autres États : deux pays visés ensemble peuvent se protéger mutuellement."
},
{
  id: "pol-081", categorie: "politique", niveau: 3, type: "qcm",
  question: "Quel article du traité sur l'Union européenne organise le retrait d'un État membre ?",
  choix: ["L'article 50", "L'article 7", "L'article 2", "L'article 122"],
  reponse: 0,
  explication: "Introduit par le traité de Lisbonne et jamais utilisé avant le Royaume-Uni en 2017 : personne n'avait vraiment envisagé qu'il servirait."
},
{
  id: "pol-082", categorie: "politique", niveau: 3, type: "chronologie",
  question: "Classez ces moments de la décolonisation et de la guerre froide.",
  choix: [
    "Indépendance de l'Inde",
    "Conférence de Bandung",
    "Année des indépendances africaines",
    "Chute du mur de Berlin"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1947, 1955, 1960, 1989. Bandung réunit 29 pays d'Asie et d'Afrique et pose les bases du non-alignement entre les deux blocs."
},
{
  id: "pol-083", categorie: "politique", niveau: 3, type: "multi_pays",
  question: "Sélectionnez les quatre pays membres du Quad, dialogue de sécurité dans l'Indo-Pacifique.",
  reponse: ["840", "392", "356", "036"],
  explication: "États-Unis, Japon, Inde et Australie. Né d'une coordination humanitaire après le tsunami de 2004, il s'est mué en forum stratégique face à la Chine."
},
{
  id: "pol-084", categorie: "politique", niveau: 3, type: "qcm",
  question: "Que désigne l'AUKUS, conclu en 2021 ?",
  choix: [
    "Un pacte de sécurité entre l'Australie, le Royaume-Uni et les États-Unis",
    "Une union douanière du Pacifique",
    "Un traité sur le climat",
    "Une alliance de renseignement à cinq"
  ],
  reponse: 0,
  explication: "Il a fait capoter un contrat de sous-marins français de plusieurs dizaines de milliards, provoquant le rappel pour consultations de l'ambassadeur de France à Washington."
},
{
  id: "pol-085", categorie: "politique", niveau: 3, type: "qcm",
  question: "Quelle initiative chinoise, lancée en 2013, finance des infrastructures sur trois continents ?",
  choix: [
    "Les nouvelles routes de la soie",
    "Le partenariat transpacifique",
    "L'Organisation de coopération de Shanghai",
    "La Banque asiatique de développement"
  ],
  reponse: 0,
  explication: "Ports, voies ferrées et corridors énergétiques dans plus de 140 pays. Les critiques y voient un levier d'influence par l'endettement."
},
{
  id: "pol-086", categorie: "politique", niveau: 3, type: "clic_pays",
  question: "Cliquez sur l'île qui concentre l'essentiel de la production mondiale de semi-conducteurs les plus avancés.",
  reponse: "158",
  explication: "Taïwan, avec le fondeur TSMC. Cette concentration est devenue un enjeu stratégique majeur, parfois appelée le « bouclier de silicium »."
},
{
  id: "pol-087", categorie: "politique", niveau: 3, type: "vrai_faux",
  question: "La Chine domine le raffinage mondial des terres rares.",
  reponse: true,
  explication: "Elle en assure la très large majorité, davantage encore que l'extraction. Ces métaux sont indispensables aux aimants des éoliennes et des moteurs électriques."
},
{
  id: "pol-088", categorie: "politique", niveau: 3, type: "multi_pays",
  question: "Sélectionnez les trois pays riverains du détroit d'Ormuz.",
  reponse: ["364", "512", "784"],
  explication: "Iran au nord, Oman et Émirats arabes unis au sud. Environ un cinquième du pétrole mondial passe par ce goulet large de 33 km au plus étroit."
},
{
  id: "pol-089", categorie: "politique", niveau: 3, type: "qcm",
  question: "Qu'est-ce que le « veto » au Conseil de sécurité de l'ONU ?",
  choix: [
    "Le vote négatif d'un membre permanent, qui bloque une résolution",
    "Le refus d'un État de siéger",
    "Une abstention collective",
    "Le report d'un vote par le secrétaire général"
  ],
  reponse: 0,
  explication: "L'abstention, elle, ne bloque rien : l'usage est fixé depuis 1946, alors même que la Charte reste ambiguë sur ce point."
},
{
  id: "pol-090", categorie: "politique", niveau: 3, type: "chronologie",
  question: "Classez ces étapes du conflit israélo-palestinien.",
  choix: [
    "Plan de partage de la Palestine par l'ONU",
    "Guerre des Six Jours",
    "Accords de Camp David entre Israël et l'Égypte",
    "Accords d'Oslo"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1947, 1967, 1978, 1993. La guerre de 1967 place sous contrôle israélien la Cisjordanie, Gaza, Jérusalem-Est et le Golan."
},
{
  id: "pol-091", categorie: "politique", niveau: 3, type: "qcm",
  question: "En quelle année la Russie a-t-elle annexé la Crimée ?",
  choix: ["2014", "2008", "2018", "2022"],
  reponse: 0,
  explication: "Après un référendum non reconnu par l'Assemblée générale de l'ONU, qui a réaffirmé l'intégrité territoriale ukrainienne par 100 voix contre 11."
},
{
  id: "pol-092", categorie: "politique", niveau: 3, type: "qcm",
  question: "Que sont les accords de Minsk, signés en 2014 et 2015 ?",
  choix: [
    "Des tentatives de règlement du conflit dans l'est de l'Ukraine",
    "Un traité de désarmement nucléaire",
    "Un accord commercial eurasiatique",
    "Un pacte énergétique russo-allemand"
  ],
  reponse: 0,
  explication: "Négociés sous format Normandie avec la France et l'Allemagne, ils prévoyaient un cessez-le-feu et un statut particulier pour le Donbass, jamais appliqués."
},
{
  id: "pol-093", categorie: "politique", niveau: 3, type: "clic_pays",
  question: "Cliquez sur le pays divisé depuis 1974 par une ligne verte surveillée par l'ONU.",
  reponse: "196",
  explication: "Chypre. Seule la Turquie reconnaît la république turque du nord, et la capitale Nicosie reste la dernière capitale divisée d'Europe."
},
{
  id: "pol-094", categorie: "politique", niveau: 3, type: "qcm",
  question: "Que désigne le « soft power » ?",
  choix: [
    "La capacité d'influencer par l'attrait plutôt que la contrainte",
    "Une armée de réserve",
    "Le pouvoir économique d'un État",
    "La diplomatie secrète"
  ],
  reponse: 0,
  explication: "Le concept est forgé en 1990 par le politiste américain Joseph Nye : culture, valeurs et diplomatie plutôt que canons et sanctions."
},
{
  id: "pol-095", categorie: "politique", niveau: 3, type: "vrai_faux",
  question: "Le Conseil constitutionnel français compte des membres qui y siègent à vie.",
  reponse: true,
  explication: "Les anciens présidents de la République en sont membres de droit à vie, en plus des neuf membres nommés pour neuf ans. Peu y siègent réellement."
},
{
  id: "pol-096", categorie: "politique", niveau: 3, type: "qcm",
  question: "Qu'est-ce que le fédéralisme ?",
  choix: [
    "Un partage de la souveraineté entre l'État central et des entités fédérées",
    "Une alliance militaire entre États voisins",
    "Un régime sans partis politiques",
    "Une union monétaire"
  ],
  reponse: 0,
  explication: "Les Länder allemands, les États américains ou les cantons suisses disposent de leur propre parlement et de compétences que le centre ne peut leur retirer."
},
{
  id: "pol-097", categorie: "politique", niveau: 3, type: "chronologie",
  question: "Classez ces institutions internationales par date de création.",
  choix: [
    "Organisation des Nations unies",
    "OTAN",
    "Organisation mondiale du commerce",
    "Cour pénale internationale"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1945, 1949, 1995, 2002. L'OMC succède au GATT de 1947, simple accord devenu enfin une organisation dotée d'un organe de règlement des différends."
},
{
  id: "pol-098", categorie: "politique", niveau: 3, type: "distance",
  question: "Cliquez sur La Haye, capitale judiciaire internationale.",
  reponse: [52.0705, 4.3007],
  explication: "Elle abrite la Cour internationale de justice, la Cour pénale internationale et plusieurs tribunaux spéciaux, ce qui lui vaut ce surnom."
},
{
  id: "pol-099", categorie: "politique", niveau: 3, type: "qcm",
  question: "Qu'est-ce que le Conseil de l'Union européenne, souvent appelé Conseil des ministres ?",
  choix: [
    "La réunion des ministres des États membres par domaine",
    "Le collège des commissaires",
    "L'assemblée des chefs d'État",
    "La chambre haute du Parlement européen"
  ],
  reponse: 0,
  explication: "Sa composition change selon le sujet : agriculture, finances, environnement. Il colégifère avec le Parlement européen."
},
{
  id: "pol-100", categorie: "politique", niveau: 3, type: "vrai_faux",
  question: "En droit international, la reconnaissance d'un État par d'autres États est nécessaire à son existence.",
  reponse: false,
  explication: "La doctrine dominante considère qu'un État existe dès lors qu'il réunit territoire, population et gouvernement effectif. La reconnaissance est déclarative, pas constitutive — même si en pratique elle change tout."
},
{
  id: "pol-101", categorie: "politique", niveau: 3, type: "qcm",
  question: "Que désigne le format « Normandie » en diplomatie ?",
  choix: [
    "Un cadre de négociation réunissant Allemagne, France, Russie et Ukraine",
    "Un sommet annuel de l'OTAN",
    "Une conférence sur le climat",
    "Un groupe de travail de l'ONU"
  ],
  reponse: 0,
  explication: "Né en juin 2014 lors des commémorations du Débarquement, où les quatre dirigeants se trouvaient réunis en Normandie."
},
{
  id: "pol-102", categorie: "politique", niveau: 3, type: "multi_pays",
  question: "Sélectionnez les trois pays baltes, entrés ensemble dans l'Union européenne et l'OTAN en 2004.",
  reponse: ["233", "428", "440"],
  explication: "Estonie, Lettonie, Lituanie. Quinze ans plus tôt, deux millions de leurs habitants formaient une chaîne humaine de 600 km, la « voie balte »."
},
{
  id: "pol-103", categorie: "politique", niveau: 3, type: "qcm",
  question: "Qu'est-ce que le droit de veto du président français sur une loi ?",
  choix: [
    "Il n'en a pas : il peut seulement demander une nouvelle délibération",
    "Il peut refuser définitivement toute loi",
    "Il peut bloquer une loi pendant un an",
    "Il peut la soumettre au Conseil d'État"
  ],
  reponse: 0,
  explication: "L'article 10 lui permet de demander au Parlement de réexaminer un texte, ce qui ne peut lui être refusé. La demande n'a été utilisée que très rarement."
},
{
  id: "pol-104", categorie: "politique", niveau: 3, type: "clic_pays",
  question: "Cliquez sur le pays qui a rejoint l'OTAN en 2024, portant l'Alliance à 32 membres.",
  reponse: "752",
  explication: "La Suède a mis fin à deux siècles de neutralité, un an après la Finlande, après un an et demi de blocage turc puis hongrois."
},
{
  id: "pol-105", categorie: "politique", niveau: 3, type: "qcm",
  question: "Que sont les « casques bleus » ?",
  choix: [
    "Les forces de maintien de la paix de l'ONU",
    "Les observateurs électoraux européens",
    "La police de l'Union africaine",
    "Les inspecteurs du désarmement"
  ],
  reponse: 0,
  explication: "Fournis par les États membres, ils restent sous commandement national. La première force armée de ce type est déployée lors de la crise de Suez, en 1956."
},
{
  id: "pol-107", categorie: "politique", niveau: 3, type: "chronologie",
  question: "Classez ces textes fondateurs des droits.",
  choix: [
    "Magna Carta",
    "Déclaration des droits de l'homme et du citoyen",
    "Déclaration universelle des droits de l'homme",
    "Convention européenne des droits de l'homme"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1215, 1789, 1948, 1950. La Convention européenne est la première à instituer un juge devant lequel un individu peut attaquer son propre État."
},
{
  id: "pol-108", categorie: "politique", niveau: 3, type: "qcm",
  question: "Qu'appelle-t-on le « domaine réservé » du président français ?",
  choix: [
    "Une pratique, non écrite, de primauté présidentielle en défense et diplomatie",
    "Un article de la Constitution",
    "Le pouvoir de nommer les préfets",
    "Le droit de grâce"
  ],
  reponse: 0,
  explication: "L'expression date de 1959 et n'a aucune base juridique : la Constitution confie au gouvernement la conduite de la politique de la nation."
},
{
  id: "pol-109", categorie: "politique", niveau: 3, type: "qcm",
  question: "Quel mécanisme européen permet de sanctionner financièrement un État qui viole l'État de droit ?",
  choix: [
    "La conditionnalité budgétaire",
    "La procédure de déficit excessif",
    "Le semestre européen",
    "Le pacte de stabilité"
  ],
  reponse: 0,
  explication: "En vigueur depuis 2021, il permet de suspendre des fonds européens lorsque les atteintes à l'État de droit menacent la bonne gestion du budget de l'Union."
},
{
  id: "pol-110", categorie: "politique", niveau: 3, type: "vrai_faux",
  question: "Une loi française contraire à un traité ratifié doit être écartée par le juge.",
  reponse: true,
  explication: "L'article 55 place les traités au-dessus des lois. La Cour de cassation l'a admis en 1975, le Conseil d'État seulement en 1989, avec l'arrêt Nicolo."
},
{
  id: "pol-111", categorie: "politique", niveau: 3, type: "qcm",
  question: "Que désigne la « realpolitik » ?",
  choix: [
    "Une diplomatie guidée par les rapports de force plutôt que par les principes",
    "La politique intérieure d'un État fédéral",
    "Le recours systématique au référendum",
    "La gestion technocratique des crises"
  ],
  reponse: 0,
  explication: "Le terme naît dans l'Allemagne du XIXe siècle et reste attaché à Bismarck, qui unifia l'Empire par une succession de guerres calculées."
},
{
  id: "pol-112", categorie: "politique", niveau: 3, type: "distance",
  question: "Cliquez sur Yalta, où fut esquissé le partage de l'Europe d'après-guerre.",
  reponse: [44.4952, 34.1663],
  explication: "En février 1945, en Crimée. Roosevelt, Churchill et Staline y fixent les zones d'influence qui structureront quarante ans de guerre froide."
}

]);

/* =============================================================================
   POLITIQUE — deuxième série (20 questions)
   Thèmes volontairement absents de la première série : rouages du droit
   français, collectivités, contre-pouvoirs et philosophie politique.
   ============================================================================= */
window.QUESTIONS.push(...[

/* ------------------------------- NIVEAU 1 --------------------------------- */
{
  id: "pol-113", categorie: "politique", niveau: 1, type: "qcm",
  question: "Combien de temps dure le mandat d'un conseil municipal en France ?",
  choix: ["6 ans", "5 ans", "4 ans", "7 ans"],
  reponse: 0,
  explication: "C'est le mandat le plus long des élections locales françaises. Il n'est soumis à aucune limite de renouvellement."
},
{
  id: "pol-114", categorie: "politique", niveau: 1, type: "vrai_faux",
  question: "En France, les lois sont publiées au Journal officiel pour entrer en vigueur.",
  reponse: true,
  explication: "Sans publication, une loi promulguée reste inopposable. Le Journal officiel paraît sans interruption depuis 1869."
},
{
  id: "pol-115", categorie: "politique", niveau: 1, type: "qcm",
  question: "Qui représente l'État dans un département français ?",
  choix: ["Le préfet", "Le maire", "Le président du conseil départemental", "Le procureur"],
  reponse: 0,
  explication: "Fonction créée par Napoléon en 1800. Le préfet est nommé en conseil des ministres et peut être déplacé du jour au lendemain."
},
{
  id: "pol-116", categorie: "politique", niveau: 1, type: "qcm",
  question: "Tous les combien d'années les députés européens sont-ils élus ?",
  choix: ["5 ans", "4 ans", "6 ans", "7 ans"],
  reponse: 0,
  explication: "Depuis 1979, date de la première élection au suffrage universel direct. C'est le seul scrutin organisé simultanément dans tous les États membres."
},
{
  id: "pol-117", categorie: "politique", niveau: 1, type: "vrai_faux",
  question: "Le droit de grève est reconnu par la Constitution française.",
  reponse: true,
  explication: "Par le préambule de 1946, auquel la Constitution actuelle renvoie. Il s'exerce « dans le cadre des lois qui le réglementent », d'où les régimes particuliers de certains services publics."
},
{
  id: "pol-118", categorie: "politique", niveau: 1, type: "qcm",
  question: "Quelle juridiction est au sommet de l'ordre judiciaire français ?",
  choix: ["La Cour de cassation", "Le Conseil d'État", "La cour d'appel", "Le Conseil constitutionnel"],
  reponse: 0,
  explication: "Elle ne rejuge pas les faits mais vérifie que le droit a été correctement appliqué : elle casse et renvoie devant une autre juridiction."
},
{
  id: "pol-119", categorie: "politique", niveau: 1, type: "qcm",
  question: "Que signifie le terme « scrutin uninominal » ?",
  choix: ["On vote pour un seul candidat", "On vote pour une liste",
          "On vote deux fois", "On vote à main levée"],
  reponse: 0,
  explication: "Par opposition au scrutin de liste. En France, les députés sont élus ainsi, tandis que les conseillers municipaux des grandes villes le sont par liste."
},

/* ------------------------------- NIVEAU 2 --------------------------------- */
{
  id: "pol-120", categorie: "politique", niveau: 2, type: "qcm",
  question: "Combien de temps dure le mandat d'un sénateur français ?",
  choix: ["6 ans", "5 ans", "9 ans", "4 ans"],
  reponse: 0,
  explication: "Le Sénat se renouvelle par moitié tous les trois ans, ce qui le rend impossible à faire basculer d'un seul coup."
},
{
  id: "pol-121", categorie: "politique", niveau: 2, type: "vrai_faux",
  question: "En cas de vacance de la présidence de la République, c'est le Premier ministre qui assure l'intérim.",
  reponse: false,
  explication: "C'est le président du Sénat. Le cas s'est produit deux fois, en 1969 après la démission de De Gaulle et en 1974 à la mort de Pompidou."
},
{
  id: "pol-122", categorie: "politique", niveau: 2, type: "qcm",
  question: "En quelle année les départements français ont-ils été créés ?",
  choix: ["1790", "1804", "1848", "1871"],
  reponse: 0,
  explication: "Découpés par la Révolution pour qu'on puisse rejoindre le chef-lieu en une journée de cheval depuis n'importe quel point."
},
{
  id: "pol-123", categorie: "politique", niveau: 2, type: "qcm",
  question: "Quelle institution contrôle l'emploi des fonds publics en France ?",
  choix: ["La Cour des comptes", "Le Conseil d'État", "L'Assemblée nationale", "L'Inspection du travail"],
  reponse: 0,
  explication: "Créée en 1807. Son rapport annuel public est l'un des rares documents d'État à épingler nommément des administrations."
},
{
  id: "pol-124", categorie: "politique", niveau: 2, type: "vrai_faux",
  question: "Le président de la République dispose d'un délai pour promulguer une loi votée.",
  reponse: true,
  explication: "Quinze jours. Il peut, dans ce délai, demander une nouvelle délibération au Parlement, mais il ne peut pas refuser purement et simplement."
},
{
  id: "pol-125", categorie: "politique", niveau: 2, type: "qcm",
  question: "Quelle autorité indépendante française défend les citoyens face aux administrations ?",
  choix: ["Le Défenseur des droits", "Le Conseil économique et social",
          "La Commission des lois", "Le Médiateur européen"],
  reponse: 0,
  explication: "Inscrit dans la Constitution en 2008. Il a absorbé le Médiateur de la République, le Défenseur des enfants et la HALDE."
},
{
  id: "pol-126", categorie: "politique", niveau: 2, type: "qcm",
  question: "Que permet l'article 38 de la Constitution française ?",
  choix: ["Au gouvernement de légiférer par ordonnances", "De dissoudre l'Assemblée",
          "De réviser la Constitution", "De déclarer l'état de siège"],
  reponse: 0,
  explication: "Le Parlement l'y autorise pour un délai et un objet précis. Les ordonnances doivent ensuite être ratifiées, faute de quoi elles deviennent caduques."
},

/* ------------------------------- NIVEAU 3 --------------------------------- */
{
  id: "pol-127", categorie: "politique", niveau: 3, type: "qcm",
  question: "Quel philosophe a théorisé la séparation des pouvoirs dans De l'esprit des lois ?",
  choix: ["Montesquieu", "Jean-Jacques Rousseau", "Voltaire", "John Locke"],
  reponse: 0,
  explication: "Publié en 1748. Il s'inspirait du régime anglais, qu'il décrivait d'ailleurs de façon assez inexacte."
},
{
  id: "pol-128", categorie: "politique", niveau: 3, type: "qcm",
  question: "Quel ouvrage de Rousseau, paru en 1762, fonde la souveraineté sur la volonté générale ?",
  choix: ["Du contrat social", "L'Émile", "Les Confessions", "Le Léviathan"],
  reponse: 0,
  explication: "Le livre fut brûlé à Paris comme à Genève. Ses formules ont pourtant irrigué la Révolution française trente ans plus tard."
},
{
  id: "pol-129", categorie: "politique", niveau: 3, type: "vrai_faux",
  question: "Sous le suffrage censitaire, seuls les citoyens payant un certain niveau d'impôt pouvaient voter.",
  reponse: true,
  explication: "En France sous la Restauration, cela réduisait le corps électoral à environ cent mille personnes sur trente millions d'habitants."
},
{
  id: "pol-130", categorie: "politique", niveau: 3, type: "qcm",
  question: "Quelle loi française de 1881 fonde la liberté de la presse ?",
  choix: ["La loi du 29 juillet 1881", "La loi Falloux", "La loi Le Chapelier", "La loi de séparation"],
  reponse: 0,
  explication: "Elle supprime l'autorisation préalable et pose que l'abus se juge après publication, jamais avant. Elle reste en vigueur aujourd'hui."
},
{
  id: "pol-131", categorie: "politique", niveau: 3, type: "qcm",
  question: "Qu'a changé l'inversion du calendrier électoral français en 2002 ?",
  choix: ["Les législatives se tiennent après la présidentielle", "Le président est élu par le Parlement",
          "Les deux scrutins ont lieu le même jour", "Le Sénat est élu au suffrage direct"],
  reponse: 0,
  explication: "Combinée au quinquennat, la manœuvre visait à donner au président une majorité assortie, et à rendre la cohabitation improbable."
},
{
  id: "pol-132", categorie: "politique", niveau: 3, type: "qcm",
  question: "Quel organe veille à l'indépendance de l'autorité judiciaire en France ?",
  choix: ["Le Conseil supérieur de la magistrature", "Le Conseil constitutionnel",
          "La Cour de justice de la République", "Le Conseil d'État"],
  reponse: 0,
  explication: "Il rend un avis sur la nomination des magistrats et statue en matière disciplinaire. Le président de la République n'y siège plus depuis 2008."
}

]);

/* =================== POLITIQUE, SPORT, GÉO, ASTRO — frises et grandeurs ==== */
window.QUESTIONS.push(...[
{
  id: "pol-150", categorie: "politique", niveau: 2, type: "frise",
  question: "En quelle année la peine de mort a-t-elle été abolie en France ?",
  reponse: 1981, min: 1900, max: 2020,
  explication: "Portée par Robert Badinter, garde des Sceaux. L'abolition n'est inscrite dans la Constitution qu'en 2007."
},
{
  id: "pol-151", categorie: "politique", niveau: 2, type: "frise",
  question: "En quelle année les Françaises ont-elles obtenu le droit de vote ?",
  reponse: 1944, min: 1850, max: 2000,
  explication: "Par ordonnance du gouvernement provisoire, à Alger. Elles ont voté pour la première fois aux municipales d'avril 1945."
},
{
  id: "pol-152", categorie: "politique", niveau: 3, type: "grandeur",
  question: "Combien de communes compte la France ?",
  reponse: 34900, unite: "communes", min: 500, max: 1000000,
  explication: "Plus que l'Allemagne, l'Italie et l'Espagne réunies. Le chiffre baisse lentement sous l'effet des fusions."
}
]);
