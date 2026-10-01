/* =============================================================================
   ARTS & CULTURE — 70 questions
   Conventions identiques à data/geographie.js.
   ============================================================================= */
window.QUESTIONS = window.QUESTIONS || [];
window.QUESTIONS.push(...[

/* ------------------------------- NIVEAU 1 --------------------------------- */
{
  id: "art-001", categorie: "arts", niveau: 1, type: "qcm",
  question: "Qui a peint La Joconde ?",
  choix: ["Léonard de Vinci", "Raphaël", "Michel-Ange", "Botticelli"],
  reponse: 0,
  explication: "Il l'a gardée avec lui jusqu'à sa mort en France, sans jamais la livrer à son commanditaire."
},
{
  id: "art-002", categorie: "arts", niveau: 1, type: "clic_pays",
  question: "Cliquez sur le pays où se trouve le musée du Prado.",
  reponse: "724",
  explication: "À Madrid. Le bâtiment avait été conçu pour abriter un cabinet d'histoire naturelle, pas des tableaux."
},
{
  id: "art-003", categorie: "arts", niveau: 1, type: "vrai_faux",
  question: "La Joconde est exposée au musée du Louvre.",
  reponse: true,
  explication: "Volée en 1911 par un ouvrier italien, elle n'est revenue que deux ans plus tard : c'est ce vol qui l'a rendue mondialement célèbre."
},
{
  id: "art-004", categorie: "arts", niveau: 1, type: "qcm",
  question: "Qui a composé la Cinquième Symphonie et ses quatre notes célèbres ?",
  choix: ["Beethoven", "Mozart", "Bach", "Brahms"],
  reponse: 0,
  explication: "Ce motif court-court-court-long a servi d'indicatif à la BBC pendant la guerre : en morse, trois brèves et une longue forment un V, comme victoire."
},
{
  id: "art-005", categorie: "arts", niveau: 1, type: "chronologie",
  question: "Classez ces mouvements artistiques par ordre d'apparition.",
  choix: ["La Renaissance italienne", "Le baroque", "L'impressionnisme", "Le cubisme"],
  reponse: [0, 1, 2, 3],
  explication: "XVe, XVIIe, 1870, 1907. Le cubisme naît avec Les Demoiselles d'Avignon, tableau que Picasso n'a pas osé montrer pendant des années."
},
{
  id: "art-006", categorie: "arts", niveau: 1, type: "qcm",
  question: "Quel peintre s'est tranché une partie de l'oreille ?",
  choix: ["Vincent van Gogh", "Paul Gauguin", "Edvard Munch", "Egon Schiele"],
  reponse: 0,
  explication: "À Arles, en décembre 1888, après une violente dispute avec Gauguin qui vivait sous son toit."
},
{
  id: "art-007", categorie: "arts", niveau: 1, type: "clic_pays",
  question: "Cliquez sur le pays de naissance de Pablo Picasso.",
  reponse: "724",
  explication: "Né à Málaga en 1881, il a vécu l'essentiel de sa vie en France mais n'a jamais demandé la nationalité française."
},
{
  id: "art-008", categorie: "arts", niveau: 1, type: "vrai_faux",
  question: "Le David est une sculpture de Michel-Ange.",
  reponse: true,
  explication: "Taillé entre 1501 et 1504 dans un bloc de marbre abandonné depuis quarante ans, jugé trop fissuré par les autres sculpteurs."
},
{
  id: "art-009", categorie: "arts", niveau: 1, type: "qcm",
  question: "Quel instrument tient le rôle principal dans les concertos de Chopin ?",
  choix: ["Le piano", "Le violon", "Le violoncelle", "La flûte"],
  reponse: 0,
  explication: "Chopin n'a quasiment rien écrit qui ne comporte de piano : c'était son seul véritable langage."
},
{
  id: "art-010", categorie: "arts", niveau: 1, type: "qcm",
  question: "Qui a écrit Les Misérables ?",
  choix: ["Victor Hugo", "Émile Zola", "Honoré de Balzac", "Alexandre Dumas"],
  reponse: 0,
  explication: "Écrit en partie en exil à Guernesey. Pour savoir si le livre se vendait, Hugo aurait télégraphié « ? » et reçu « ! » en retour."
},
{
  id: "art-011", categorie: "arts", niveau: 1, type: "clic_pays",
  question: "Cliquez sur le pays où se trouve le Rijksmuseum.",
  reponse: "528",
  explication: "À Amsterdam, avec La Ronde de nuit de Rembrandt dans une salle conçue spécialement pour elle."
},
{
  id: "art-012", categorie: "arts", niveau: 1, type: "vrai_faux",
  question: "Mozart n'a commencé à composer qu'à l'adolescence.",
  reponse: false,
  explication: "Ses premières pièces datent de ses cinq ans, et son père l'exhibait dans les cours d'Europe dès ses six ans."
},
{
  id: "art-013", categorie: "arts", niveau: 1, type: "qcm",
  question: "À quel mouvement Salvador Dalí est-il associé ?",
  choix: ["Le surréalisme", "Le cubisme", "Le fauvisme", "L'expressionnisme"],
  reponse: 0,
  explication: "Il disait puiser ses images dans une « méthode paranoïaque-critique » : provoquer volontairement des hallucinations pour peindre ce qu'il y voyait."
},
{
  id: "art-014", categorie: "arts", niveau: 1, type: "chronologie",
  question: "Classez ces tableaux par date de réalisation.",
  choix: [
    "La Joconde, de Léonard de Vinci",
    "Les Ménines, de Vélasquez",
    "La Nuit étoilée, de Van Gogh",
    "Guernica, de Picasso"
  ],
  reponse: [0, 1, 2, 3],
  explication: "Vers 1503, 1656, 1889, 1937. Van Gogh a peint La Nuit étoilée depuis la fenêtre d'un asile à Saint-Rémy-de-Provence."
},
{
  id: "art-015", categorie: "arts", niveau: 1, type: "qcm",
  question: "Dans quel pays l'opéra est-il né, vers 1600 ?",
  choix: ["L'Italie", "La France", "L'Allemagne", "L'Autriche"],
  reponse: 0,
  explication: "À Florence, dans un cercle d'érudits qui croyaient ressusciter la tragédie grecque chantée."
},
{
  id: "art-016", categorie: "arts", niveau: 1, type: "vrai_faux",
  question: "Le Cri est une œuvre d'Edvard Munch.",
  reponse: true,
  explication: "Il en a réalisé quatre versions. Le ciel rouge s'inspirerait des crépuscules causés par l'éruption du Krakatoa en 1883."
},

/* ------------------------------- NIVEAU 2 --------------------------------- */
{
  id: "art-017", categorie: "arts", niveau: 2, type: "qcm",
  question: "Qui a peint La Jeune Fille à la perle ?",
  choix: ["Johannes Vermeer", "Rembrandt", "Frans Hals", "Pieter de Hooch"],
  reponse: 0,
  explication: "Ce n'est pas un portrait mais un « tronie », une étude de type : le modèle n'a jamais été identifié."
},
{
  id: "art-018", categorie: "arts", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le pays d'origine d'Edvard Munch.",
  reponse: "578",
  explication: "Norvégien, il a légué à la ville d'Oslo plus de 1 000 tableaux et 15 000 estampes."
},
{
  id: "art-019", categorie: "arts", niveau: 2, type: "chronologie",
  question: "Classez ces étapes de l'histoire du cinéma.",
  choix: [
    "Première projection publique des frères Lumière",
    "Sortie du premier film parlant, Le Chanteur de jazz",
    "Sortie de Blanche-Neige et les Sept Nains",
    "Sortie de Citizen Kane"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1895, 1927, 1937, 1941. Les Lumière étaient convaincus que le cinéma était « une invention sans avenir »."
},
{
  id: "art-020", categorie: "arts", niveau: 2, type: "qcm",
  question: "Quel architecte a conçu la Sagrada Família ?",
  choix: ["Antoni Gaudí", "Le Corbusier", "Santiago Calatrava", "Frank Lloyd Wright"],
  reponse: 0,
  explication: "Commencée en 1882, elle n'est toujours pas achevée ; Gaudí disait que son client, Dieu, n'était pas pressé."
},
{
  id: "art-021", categorie: "arts", niveau: 2, type: "vrai_faux",
  question: "Van Gogh a vendu de nombreux tableaux de son vivant.",
  reponse: false,
  explication: "On ne lui connaît qu'une vente attestée, La Vigne rouge ; il vivait de l'argent que lui envoyait son frère Theo."
},
{
  id: "art-022", categorie: "arts", niveau: 2, type: "qcm",
  question: "Qui a sculpté Le Penseur ?",
  choix: ["Auguste Rodin", "Camille Claudel", "Aristide Maillol", "Antoine Bourdelle"],
  reponse: 0,
  explication: "Conçu comme la figure de Dante au sommet de La Porte de l'Enfer, avant d'être agrandi et exposé seul."
},
{
  id: "art-023", categorie: "arts", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le pays où se trouve le musée de l'Ermitage.",
  reponse: "643",
  explication: "À Saint-Pétersbourg. Le musée emploie officiellement des chats depuis le XVIIIe siècle pour protéger les réserves des rongeurs."
},
{
  id: "art-024", categorie: "arts", niveau: 2, type: "qcm",
  question: "Quel grand compositeur est devenu sourd au fil de sa carrière ?",
  choix: ["Beethoven", "Schubert", "Haydn", "Liszt"],
  reponse: 0,
  explication: "Il a dirigé la création de sa Neuvième Symphonie sans entendre les applaudissements : il a fallu le retourner vers le public."
},
{
  id: "art-025", categorie: "arts", niveau: 2, type: "vrai_faux",
  question: "Guernica de Picasso emploie des rouges vifs pour figurer le sang.",
  reponse: false,
  explication: "La toile est en gris, noir et blanc : ce parti pris évoque les photographies de presse par lesquelles le monde a découvert le bombardement de 1937."
},
{
  id: "art-026", categorie: "arts", niveau: 2, type: "chronologie",
  question: "Classez ces romans par date de publication.",
  choix: [
    "Don Quichotte, de Cervantès",
    "Les Misérables, de Victor Hugo",
    "Ulysse, de James Joyce",
    "Cent ans de solitude, de García Márquez"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1605, 1862, 1922, 1967. Ulysse raconte une seule journée, le 16 juin 1904, fêtée chaque année à Dublin sous le nom de Bloomsday."
},
{
  id: "art-027", categorie: "arts", niveau: 2, type: "qcm",
  question: "Quel tableau de Claude Monet a donné son nom à l'impressionnisme ?",
  choix: [
    "Impression, soleil levant",
    "Les Nymphéas",
    "La Cathédrale de Rouen",
    "Le Déjeuner sur l'herbe"
  ],
  reponse: 0,
  explication: "Le mot vient d'un critique moqueur en 1874 ; les peintres s'en sont emparés comme d'un étendard."
},
{
  id: "art-028", categorie: "arts", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le pays d'origine du cinéaste Akira Kurosawa.",
  reponse: "392",
  explication: "Ses Sept Samouraïs ont été transposés en western sous le titre Les Sept Mercenaires, et son Yojimbo en Pour une poignée de dollars."
},
{
  id: "art-029", categorie: "arts", niveau: 2, type: "qcm",
  question: "Qui a réalisé le film Le Parrain ?",
  choix: ["Francis Ford Coppola", "Martin Scorsese", "Sidney Lumet", "Brian De Palma"],
  reponse: 0,
  explication: "Le studio ne voulait ni de Brando ni de Pacino ; Coppola a menacé de partir pour les imposer."
},
{
  id: "art-030", categorie: "arts", niveau: 2, type: "vrai_faux",
  question: "La tour Eiffel devait être démontée une vingtaine d'années après sa construction.",
  reponse: true,
  explication: "Son permis courait jusqu'en 1909 ; elle a été sauvée par son utilité comme antenne de télégraphie sans fil."
},
{
  id: "art-031", categorie: "arts", niveau: 2, type: "qcm",
  question: "Quel écrivain a créé le personnage de Sherlock Holmes ?",
  choix: ["Arthur Conan Doyle", "Agatha Christie", "Wilkie Collins", "G. K. Chesterton"],
  reponse: 0,
  explication: "Il l'a tué en 1893 pour s'en débarrasser, avant de devoir le ressusciter huit ans plus tard sous la pression des lecteurs."
},

/* ------------------------------- NIVEAU 3 --------------------------------- */
{
  id: "art-032", categorie: "arts", niveau: 3, type: "qcm",
  question: "Qui a peint Le Radeau de la Méduse ?",
  choix: ["Théodore Géricault", "Eugène Delacroix", "Jacques-Louis David", "Gustave Courbet"],
  reponse: 0,
  explication: "Inspiré d'un naufrage réel de 1816 ; le peintre a étudié des cadavres à la morgue pour rendre les chairs avec exactitude."
},
{
  id: "art-033", categorie: "arts", niveau: 3, type: "chronologie",
  question: "Classez ces créations musicales par date.",
  choix: [
    "L'Orfeo de Monteverdi",
    "Les Quatre Saisons de Vivaldi",
    "La Neuvième Symphonie de Beethoven",
    "Le Sacre du printemps de Stravinsky"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1607, vers 1725, 1824, 1913. La création du Sacre a provoqué une bagarre dans la salle du Théâtre des Champs-Élysées."
},
{
  id: "art-034", categorie: "arts", niveau: 3, type: "qcm",
  question: "Quel mouvement d'avant-garde russe Kazimir Malevitch a-t-il fondé ?",
  choix: ["Le suprématisme", "Le constructivisme", "Le rayonnisme", "Le futurisme"],
  reponse: 0,
  explication: "Son Carré noir sur fond blanc de 1915 fut accroché en haut d'un angle de la salle, à la place traditionnelle des icônes."
},
{
  id: "art-035", categorie: "arts", niveau: 3, type: "vrai_faux",
  question: "Le Bauhaus était une école d'art et d'architecture fondée en Allemagne.",
  reponse: true,
  explication: "Ouverte à Weimar en 1919 et fermée par les nazis en 1933 ; ses professeurs exilés ont diffusé son esthétique dans le monde entier."
},
{
  id: "art-036", categorie: "arts", niveau: 3, type: "clic_pays",
  question: "Cliquez sur le pays d'origine du mouvement De Stijl, celui de Mondrian.",
  reponse: "528",
  explication: "Aux Pays-Bas, à partir de 1917 : lignes noires, angles droits et trois couleurs primaires, rien d'autre."
},
{
  id: "art-037", categorie: "arts", niveau: 3, type: "qcm",
  question: "Qui a composé le Boléro ?",
  choix: ["Maurice Ravel", "Claude Debussy", "Erik Satie", "Camille Saint-Saëns"],
  reponse: 0,
  explication: "Un seul thème répété dix-huit fois sur un rythme invariable. Ravel le décrivait lui-même comme « une pièce sans musique »."
},
{
  id: "art-038", categorie: "arts", niveau: 3, type: "chronologie",
  question: "Classez ces jalons de l'image et du spectacle.",
  choix: [
    "Présentation du daguerréotype",
    "Première projection publique des frères Lumière",
    "Premier long-métrage d'animation des studios Disney",
    "Sortie de La Guerre des étoiles"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1839, 1895, 1937, 1977. La presse surnommait Blanche-Neige « la folie de Disney » avant qu'il ne devienne le plus gros succès de son temps."
},
{
  id: "art-039", categorie: "arts", niveau: 3, type: "vrai_faux",
  question: "Le Panthéon de Rome possède la plus grande coupole en béton non armé du monde.",
  reponse: true,
  explication: "43,3 m de diamètre, intacte depuis près de dix-neuf siècles ; les Romains allégeaient le béton vers le sommet avec de la pierre ponce."
},
{
  id: "art-040", categorie: "arts", niveau: 3, type: "qcm",
  question: "Qui a reçu le tout premier prix Nobel de littérature, en 1901 ?",
  choix: ["Sully Prudhomme", "Rudyard Kipling", "Léon Tolstoï", "Anatole France"],
  reponse: 0,
  explication: "Le choix a fait scandale : quarante-deux écrivains suédois ont publié une lettre de protestation en faveur de Tolstoï."
},
{
  id: "art-041", categorie: "arts", niveau: 3, type: "clic_pays",
  question: "Cliquez sur le pays où se trouve le théâtre de la Scala.",
  reponse: "380",
  explication: "À Milan, bâti en 1778 sur l'emplacement d'une église, Santa Maria alla Scala, dont il a gardé le nom."
},
{
  id: "art-042", categorie: "arts", niveau: 3, type: "qcm",
  question: "Quel peintre a développé la technique du pointillisme ?",
  choix: ["Georges Seurat", "Paul Signac", "Camille Pissarro", "Henri-Edmond Cross"],
  reponse: 0,
  explication: "Un Dimanche après-midi à l'île de la Grande Jatte lui a demandé deux ans de travail et des millions de points juxtaposés."
},
{
  id: "art-043", categorie: "arts", niveau: 3, type: "vrai_faux",
  question: "Frida Kahlo a réalisé l'essentiel de son œuvre en Europe.",
  reponse: false,
  explication: "Elle a peint au Mexique, en grande partie alitée après un accident de bus, un miroir fixé au-dessus de son lit."
},
{
  id: "art-044", categorie: "arts", niveau: 3, type: "qcm",
  question: "Quelle œuvre de Marcel Duchamp est un urinoir renversé et signé ?",
  choix: ["Fontaine", "Roue de bicyclette", "L.H.O.O.Q.", "Le Grand Verre"],
  reponse: 0,
  explication: "Refusée par le Salon des indépendants de New York en 1917, elle a été perdue ; il n'en reste que des répliques et une photographie."
},
{
  id: "art-045", categorie: "arts", niveau: 3, type: "clic_pays",
  question: "Cliquez sur le pays d'origine du cinéaste Ingmar Bergman.",
  reponse: "752",
  explication: "Suédois, il a tourné une grande partie de ses films sur l'île de Fårö, où il a fini par s'installer."
}

]);

/* ------------------------- EXTENSION : 10 questions ------------------------ */
window.QUESTIONS.push(...[

{
  id: "art-046", categorie: "arts", niveau: 1, type: "qcm",
  question: "Qui a peint le plafond de la chapelle Sixtine ?",
  choix: ["Michel-Ange", "Raphaël", "Le Titien", "Le Caravage"],
  reponse: 0,
  explication: "Il a travaillé debout sur un échafaudage, la tête renversée, et non allongé comme on le raconte souvent. Quatre ans de chantier."
},
{
  id: "art-047", categorie: "arts", niveau: 1, type: "vrai_faux",
  question: "Roméo et Juliette est une pièce de William Shakespeare.",
  reponse: true,
  explication: "On lui attribue l'invention ou la première trace écrite de centaines de mots anglais encore courants, comme « lonely » ou « eyeball »."
},
{
  id: "art-048", categorie: "arts", niveau: 1, type: "clic_pays",
  question: "Cliquez sur le pays de naissance de Ludwig van Beethoven.",
  reponse: "276",
  explication: "Né à Bonn en 1770, il s'installe à Vienne à 22 ans pour y étudier avec Haydn et n'en repartira jamais."
},
{
  id: "art-049", categorie: "arts", niveau: 2, type: "qcm",
  question: "Quel volume ouvre À la recherche du temps perdu de Marcel Proust ?",
  choix: [
    "Du côté de chez Swann",
    "Le Temps retrouvé",
    "À l'ombre des jeunes filles en fleurs",
    "La Prisonnière"
  ],
  reponse: 0,
  explication: "Refusé par plusieurs éditeurs, dont Gallimard sur l'avis d'André Gide, qui y verra plus tard la plus grave erreur de sa carrière."
},
{
  id: "art-050", categorie: "arts", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le pays d'origine du compositeur Antonín Dvořák.",
  reponse: "203",
  explication: "Sa Symphonie du Nouveau Monde a pourtant été écrite à New York, où il dirigeait un conservatoire au début des années 1890."
},
{
  id: "art-051", categorie: "arts", niveau: 2, type: "chronologie",
  question: "Classez ces monuments par date d'achèvement.",
  choix: [
    "Le Parthénon d'Athènes",
    "Notre-Dame de Paris",
    "Le Taj Mahal",
    "L'Opéra de Sydney"
  ],
  reponse: [0, 1, 2, 3],
  explication: "-438, vers 1345, vers 1653, 1973. Le Taj Mahal est un mausolée, élevé par Shah Jahan pour son épouse Mumtaz Mahal."
},
{
  id: "art-052", categorie: "arts", niveau: 2, type: "vrai_faux",
  question: "Agatha Christie est l'autrice de fiction la plus vendue de tous les temps.",
  reponse: true,
  explication: "Environ deux milliards d'exemplaires. Sa pièce La Souricière est à l'affiche à Londres depuis 1952, un record mondial de longévité."
},
{
  id: "art-053", categorie: "arts", niveau: 3, type: "qcm",
  question: "Qui a peint le triptyque du Jardin des délices ?",
  choix: ["Jérôme Bosch", "Pieter Brueghel l'Ancien", "Matthias Grünewald", "Jan van Eyck"],
  reponse: 0,
  explication: "Conservé au Prado, il a fasciné les surréalistes quatre siècles plus tard, qui y voyaient un précurseur de leur propre imaginaire."
},
{
  id: "art-054", categorie: "arts", niveau: 3, type: "chronologie",
  question: "Classez ces jalons de l'art moderne.",
  choix: [
    "Première exposition impressionniste à Paris",
    "Publication du manifeste du futurisme",
    "Publication du manifeste du surréalisme",
    "Ouverture du Centre Pompidou"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1874, 1909, 1924, 1977. Le manifeste futuriste a paru en une du Figaro : c'est le premier mouvement artistique lancé par voie de presse."
},
{
  id: "art-055", categorie: "arts", niveau: 3, type: "clic_pays",
  question: "Cliquez sur le pays d'origine du peintre Gustav Klimt.",
  reponse: "040",
  explication: "Son Baiser est recouvert de véritables feuilles d'or : son père était graveur sur or, et il avait appris le métier tout enfant."
}

]);

/* ------------------------- EXTENSION : 15 questions ------------------------ */
window.QUESTIONS.push(...[

{
  id: "art-056", categorie: "arts", niveau: 1, type: "qcm",
  question: "Qui a écrit Le Petit Prince ?",
  choix: ["Antoine de Saint-Exupéry", "Jules Verne", "Marcel Pagnol", "Romain Gary"],
  reponse: 0,
  explication: "Publié à New York en 1943, il a disparu en vol l'année suivante au large de Marseille ; son bracelet n'a été repêché qu'en 1998."
},
{
  id: "art-057", categorie: "arts", niveau: 1, type: "vrai_faux",
  question: "La tour de Pise penche à cause de la nature du sol sur lequel elle est bâtie.",
  reponse: true,
  explication: "Un sous-sol d'argile molle : l'inclinaison est apparue dès le troisième étage, et le chantier a été interrompu près d'un siècle."
},
{
  id: "art-058", categorie: "arts", niveau: 1, type: "clic_pays",
  question: "Cliquez sur le pays où est né le tango.",
  reponse: "032",
  explication: "Dans les faubourgs de Buenos Aires à la fin du XIXe siècle — et sur l'autre rive du Río de la Plata, à Montevideo, qui le revendique aussi."
},
{
  id: "art-059", categorie: "arts", niveau: 1, type: "qcm",
  question: "Qui a composé Les Quatre Saisons ?",
  choix: ["Antonio Vivaldi", "Jean-Sébastien Bach", "Georg Friedrich Haendel", "Arcangelo Corelli"],
  reponse: 0,
  explication: "Chaque concerto est accompagné d'un sonnet qui décrit ce que la musique imite : l'orage, les moustiques, les patineurs sur la glace."
},
{
  id: "art-060", categorie: "arts", niveau: 1, type: "vrai_faux",
  question: "Les films muets étaient projetés en silence.",
  reponse: false,
  explication: "Un pianiste, un orgue ou tout un orchestre accompagnaient la séance ; certaines salles employaient aussi un bruiteur."
},
{
  id: "art-061", categorie: "arts", niveau: 2, type: "qcm",
  question: "Quel mouvement littéraire Victor Hugo a-t-il porté en France ?",
  choix: ["Le romantisme", "Le naturalisme", "Le classicisme", "Le symbolisme"],
  reponse: 0,
  explication: "La première d'Hernani en 1830 a tourné à la bagarre entre partisans du drame romantique et défenseurs des règles classiques."
},
{
  id: "art-062", categorie: "arts", niveau: 2, type: "chronologie",
  question: "Classez ces créations par date.",
  choix: [
    "Construction du théâtre du Globe à Londres",
    "Création de Don Giovanni de Mozart",
    "Création de Carmen de Bizet",
    "Création de Pelléas et Mélisande de Debussy"
  ],
  reponse: [0, 1, 2, 3],
  explication: "1599, 1787, 1875, 1902. Carmen fut un échec à sa création ; Bizet est mort trois mois plus tard sans connaître son triomphe."
},
{
  id: "art-063", categorie: "arts", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le pays d'origine de l'architecte Oscar Niemeyer.",
  reponse: "076",
  explication: "Il a dessiné l'essentiel des bâtiments officiels de Brasília, ville sortie de terre en quatre ans, et a travaillé jusqu'à ses 104 ans."
},
{
  id: "art-064", categorie: "arts", niveau: 2, type: "qcm",
  question: "Comment appelle-t-on la peinture murale réalisée sur un enduit encore frais ?",
  choix: ["La fresque", "La détrempe", "Le sgraffite", "La gouache"],
  reponse: 0,
  explication: "Le pigment pénètre l'enduit en séchant, d'où une tenue de plusieurs siècles — mais aucune retouche n'est possible une fois sec."
},
{
  id: "art-065", categorie: "arts", niveau: 2, type: "vrai_faux",
  question: "Le Louvre était à l'origine une forteresse.",
  reponse: true,
  explication: "Élevée vers 1190 par Philippe Auguste pour défendre Paris ; les fondations du donjon médiéval se visitent encore sous la cour Carrée."
},
{
  id: "art-066", categorie: "arts", niveau: 3, type: "qcm",
  question: "Qui a composé la tétralogie de L'Anneau du Nibelung ?",
  choix: ["Richard Wagner", "Richard Strauss", "Gustav Mahler", "Carl Maria von Weber"],
  reponse: 0,
  explication: "Vingt-six ans de travail et une quinzaine d'heures de musique ; il a fait bâtir à Bayreuth un théâtre entier pour pouvoir la jouer."
},
{
  id: "art-067", categorie: "arts", niveau: 3, type: "clic_pays",
  question: "Cliquez sur le pays d'origine de l'écrivain James Joyce.",
  reponse: "372",
  explication: "Irlandais, il a pourtant écrit toute son œuvre à l'étranger : Trieste, Zurich et Paris, où Ulysse fut publié en 1922."
},
{
  id: "art-068", categorie: "arts", niveau: 3, type: "chronologie",
  question: "Classez ces sculptures de la plus ancienne à la plus récente.",
  choix: [
    "La Vénus de Willendorf",
    "Le buste de Néfertiti",
    "La Victoire de Samothrace",
    "La Pietà de Michel-Ange"
  ],
  reponse: [0, 1, 2, 3],
  explication: "Environ -25 000, -1345, -190, puis 1499. La Vénus de Willendorf tient dans une main : elle mesure onze centimètres."
},
{
  id: "art-069", categorie: "arts", niveau: 3, type: "vrai_faux",
  question: "Le terme « avant-garde » appliqué à l'art vient du vocabulaire militaire.",
  reponse: true,
  explication: "Il désignait les troupes envoyées en éclaireurs ; des penseurs du XIXe siècle l'ont transposé aux artistes censés précéder la société."
},
{
  id: "art-070", categorie: "arts", niveau: 3, type: "qcm",
  question: "Quel peintre américain a rendu célèbre la technique du dripping, en projetant la peinture sur la toile ?",
  choix: ["Jackson Pollock", "Mark Rothko", "Andy Warhol", "Edward Hopper"],
  reponse: 0,
  explication: "Il travaillait à même le sol, en tournant autour de la toile : « je peux littéralement être dans le tableau », disait-il."
}

]);

/* =============================================================================
   ARTS & CULTURE — deuxième série (40 questions)
   ============================================================================= */
window.QUESTIONS.push(...[

/* ------------------------------- NIVEAU 1 --------------------------------- */
{
  id: "art-071", categorie: "arts", niveau: 1, type: "qcm",
  question: "Qui a peint La Nuit étoilée ?",
  choix: ["Vincent van Gogh", "Claude Monet", "Paul Cézanne", "Edvard Munch"],
  reponse: 0,
  explication: "Peinte en 1889 depuis la fenêtre de sa chambre d'asile à Saint-Rémy-de-Provence, de mémoire et de jour."
},
{
  id: "art-072", categorie: "arts", niveau: 1, type: "vrai_faux",
  question: "Mozart composait déjà pendant son enfance.",
  reponse: true,
  explication: "Sa première œuvre conservée date de ses cinq ans. À douze ans, il avait déjà écrit un opéra."
},
{
  id: "art-074", categorie: "arts", niveau: 1, type: "qcm",
  question: "Quel instrument compte 88 touches ?",
  choix: ["Le piano", "L'orgue", "L'accordéon", "Le clavecin"],
  reponse: 0,
  explication: "Cinquante-deux blanches et trente-six noires. Au-delà, les notes deviennent si graves ou si aiguës que l'oreille distingue mal les hauteurs."
},
{
  id: "art-075", categorie: "arts", niveau: 1, type: "chronologie",
  question: "Classez ces écrivains français par ordre de naissance.",
  choix: ["Molière", "Victor Hugo", "Marcel Proust", "Albert Camus"],
  reponse: [0, 1, 2, 3],
  explication: "1622, 1802, 1871 et 1913. Molière est mort sur scène, en jouant justement un malade imaginaire."
},
{
  id: "art-076", categorie: "arts", niveau: 1, type: "clic_pays",
  question: "Cliquez sur le pays de Cervantès, auteur de Don Quichotte.",
  reponse: "724",
  explication: "Souvent tenu pour le premier roman moderne. Cervantès et Shakespeare sont morts à quelques jours d'intervalle, en 1616."
},
{
  id: "art-077", categorie: "arts", niveau: 1, type: "vrai_faux",
  question: "Le Louvre est le musée le plus visité au monde.",
  reponse: true,
  explication: "Il faudrait plusieurs mois pour s'arrêter quelques secondes devant chacune de ses œuvres exposées."
},
{
  id: "art-079", categorie: "arts", niveau: 1, type: "qcm",
  question: "Quel peintre espagnol a réalisé Guernica ?",
  choix: ["Pablo Picasso", "Salvador Dalí", "Joan Miró", "Francisco de Goya"],
  reponse: 0,
  explication: "Peint en un mois après le bombardement de la ville basque en 1937. L'œuvre n'est rentrée en Espagne qu'en 1981, après la mort de Franco."
},
{
  id: "art-080", categorie: "arts", niveau: 1, type: "distance",
  question: "Cliquez sur l'emplacement de Florence, berceau de la Renaissance.",
  reponse: [43.7696, 11.2558],
  explication: "La coupole de sa cathédrale, bâtie sans échafaudage central par Brunelleschi, reste la plus grande coupole de maçonnerie jamais construite."
},
{
  id: "art-081", categorie: "arts", niveau: 1, type: "qcm",
  question: "Combien de cordes compte un violon ?",
  choix: ["4", "6", "5", "3"],
  reponse: 0,
  explication: "Sol, ré, la, mi. Un violon contient environ soixante-dix pièces de bois assemblées, sans un seul clou."
},
{
  id: "art-082", categorie: "arts", niveau: 1, type: "vrai_faux",
  question: "William Shakespeare était anglais.",
  reponse: true,
  explication: "On lui attribue l'invention ou la première trace écrite de plus de mille cinq cents mots anglais encore employés aujourd'hui."
},
{
  id: "art-083", categorie: "arts", niveau: 1, type: "qcm",
  question: "Quel ballet de Tchaïkovski met en scène une princesse changée en oiseau ?",
  choix: ["Le Lac des cygnes", "Casse-Noisette", "La Belle au bois dormant", "Roméo et Juliette"],
  reponse: 0,
  explication: "Sa création en 1877 fut un échec complet. Il n'est devenu un classique qu'après la mort du compositeur, dans une version remaniée."
},
/* ------------------------------- NIVEAU 2 --------------------------------- */
{
  id: "art-085", categorie: "arts", niveau: 2, type: "qcm",
  question: "Qui a sculpté le David exposé à Florence ?",
  choix: ["Michel-Ange", "Donatello", "Le Bernin", "Léonard de Vinci"],
  reponse: 0,
  explication: "Il avait vingt-six ans et travaillait un bloc de marbre abandonné depuis quarante ans, que deux sculpteurs avaient renoncé à tailler."
},
{
  id: "art-086", categorie: "arts", niveau: 2, type: "vrai_faux",
  question: "L'opéra Carmen a été composé par Georges Bizet.",
  reponse: true,
  explication: "Accueilli froidement à sa création en 1875. Bizet est mort trois mois plus tard sans connaître le triomphe mondial de son œuvre."
},
{
  id: "art-087", categorie: "arts", niveau: 2, type: "qcm",
  question: "Quel mouvement Claude Monet a-t-il contribué à fonder ?",
  choix: ["L'impressionnisme", "Le fauvisme", "Le cubisme", "Le romantisme"],
  reponse: 0,
  explication: "Le nom vient d'une critique moqueuse visant son tableau Impression, soleil levant. Les peintres l'ont adopté par défi."
},
{
  id: "art-088", categorie: "arts", niveau: 2, type: "clic_pays",
  question: "Cliquez sur le pays où l'opéra est né, vers 1600.",
  reponse: "380",
  explication: "À Florence, dans le cercle savant de la Camerata, qui croyait ressusciter la tragédie grecque chantée. Le vocabulaire du genre est resté italien partout."
},
{
  id: "art-089", categorie: "arts", niveau: 2, type: "qcm",
  question: "Qui a écrit Cent ans de solitude ?",
  choix: ["Gabriel García Márquez", "Jorge Luis Borges", "Pablo Neruda", "Mario Vargas Llosa"],
  reponse: 0,
  explication: "Œuvre phare du réalisme magique. L'auteur a vendu sa voiture pour tenir pendant les dix-huit mois d'écriture."
},
{
  id: "art-090", categorie: "arts", niveau: 2, type: "distance",
  question: "Cliquez sur l'emplacement de Vienne, capitale de la musique classique.",
  reponse: [48.2082, 16.3738],
  explication: "Haydn, Mozart, Beethoven, Schubert, Brahms et Mahler y ont tous vécu et travaillé, à quelques rues les uns des autres."
},
{
  id: "art-091", categorie: "arts", niveau: 2, type: "chronologie",
  question: "Classez ces styles architecturaux par ordre d'apparition.",
  choix: ["Le roman", "Le gothique", "Le baroque", "L'Art nouveau"],
  reponse: [0, 1, 2, 3],
  explication: "Le gothique doit son nom à une insulte : les théoriciens de la Renaissance le jugeaient barbare, digne des Goths."
},
{
  id: "art-092", categorie: "arts", niveau: 2, type: "vrai_faux",
  question: "La création du Sacre du printemps de Stravinsky a provoqué un scandale.",
  reponse: true,
  explication: "En 1913 à Paris, le vacarme de la salle couvrait l'orchestre. Le chorégraphe criait les temps en coulisse pour que les danseurs tiennent la mesure."
},
{
  id: "art-094", categorie: "arts", niveau: 2, type: "qcm",
  question: "Quel plafond Michel-Ange a-t-il peint au Vatican ?",
  choix: ["Celui de la chapelle Sixtine", "Celui de la basilique Saint-Pierre",
          "Celui de la villa Farnésine", "Celui des chambres de Raphaël"],
  reponse: 0,
  explication: "Quatre ans de travail debout, la tête renversée. Il se considérait sculpteur et avait accepté la commande à contrecœur."
},
{
  id: "art-095", categorie: "arts", niveau: 2, type: "multi_pays",
  question: "Sélectionnez les trois pays qui accueillent les festivals de Cannes, Venise et Berlin.",
  reponse: ["250", "380", "276"],
  explication: "Les trois grands festivals européens de cinéma. Cannes devait ouvrir en septembre 1939 ; l'invasion de la Pologne a annulé l'édition."
},
{
  id: "art-096", categorie: "arts", niveau: 2, type: "vrai_faux",
  question: "Le jazz est né à La Nouvelle-Orléans.",
  reponse: true,
  explication: "Au croisement du blues, des fanfares militaires et des chants religieux. La ville était le seul endroit du Sud où les esclaves avaient pu conserver leurs tambours."
},
{
  id: "art-098", categorie: "arts", niveau: 2, type: "qcm",
  question: "Quel roman s'ouvre sur « Longtemps, je me suis couché de bonne heure » ?",
  choix: ["Du côté de chez Swann", "L'Étranger", "Madame Bovary", "Le Rouge et le Noir"],
  reponse: 0,
  explication: "Premier volume d'À la recherche du temps perdu. Le manuscrit a été refusé par plusieurs éditeurs, dont Gallimard, qui l'a amèrement regretté."
},

/* ------------------------------- NIVEAU 3 --------------------------------- */
{
  id: "art-099", categorie: "arts", niveau: 3, type: "qcm",
  question: "Quel peintre a fondé le cubisme aux côtés de Picasso ?",
  choix: ["Georges Braque", "Juan Gris", "Fernand Léger", "Robert Delaunay"],
  reponse: 0,
  explication: "Ils travaillaient si étroitement qu'ils ne signaient plus leurs toiles : Braque parlait de deux alpinistes encordés."
},
{
  id: "art-100", categorie: "arts", niveau: 3, type: "qcm",
  question: "Quel prix littéraire français, créé en 1903, est le plus prestigieux ?",
  choix: ["Le prix Goncourt", "Le prix Renaudot", "Le prix Femina", "Le prix Médicis"],
  reponse: 0,
  explication: "Sa dotation est symbolique : un chèque de dix euros, que les lauréats encadrent en général plutôt que de l'encaisser."
},
{
  id: "art-101", categorie: "arts", niveau: 3, type: "vrai_faux",
  question: "Le Bauhaus était une école allemande d'art et d'architecture.",
  reponse: true,
  explication: "Fermée par les nazis en 1933. Ses professeurs exilés ont diffusé son style dans le monde entier, de Chicago à Tel-Aviv."
},
{
  id: "art-102", categorie: "arts", niveau: 3, type: "chronologie",
  question: "Classez ces périodes de la musique occidentale.",
  choix: ["La musique baroque", "La période classique", "Le romantisme", "La musique sérielle"],
  reponse: [0, 1, 2, 3],
  explication: "Vers 1600, 1750, 1820 et 1920. La musique sérielle abandonne la tonalité et traite les douze notes à égalité."
},
{
  id: "art-104", categorie: "arts", niveau: 3, type: "distance",
  question: "Cliquez sur l'emplacement de Saint-Pétersbourg et de son musée de l'Ermitage.",
  reponse: [59.9311, 30.3609],
  explication: "Le musée emploie officiellement des chats depuis le XVIIIe siècle, pour protéger les réserves des rongeurs."
},
{
  id: "art-106", categorie: "arts", niveau: 3, type: "vrai_faux",
  question: "Le cinéma parlant s'est imposé dans les années 1920.",
  reponse: true,
  explication: "Le Chanteur de jazz, en 1927, ne comportait pourtant que quelques minutes de dialogue. En trois ans, le muet avait presque disparu."
},
{
  id: "art-107", categorie: "arts", niveau: 3, type: "qcm",
  question: "Quel mouvement André Breton a-t-il fondé en 1924 ?",
  choix: ["Le surréalisme", "Le dadaïsme", "Le futurisme", "L'expressionnisme"],
  reponse: 0,
  explication: "Il en a rédigé le manifeste et en a exclu tant de membres qu'on le surnommait le pape du mouvement."
},
{
  id: "art-108", categorie: "arts", niveau: 3, type: "clic_pays",
  question: "Cliquez sur le pays de naissance de Frida Kahlo.",
  reponse: "484",
  explication: "Un accident de tramway à dix-huit ans l'a laissée alitée des mois. C'est sur un chevalet fixé à son lit qu'elle s'est mise à peindre."
},
{
  id: "art-109", categorie: "arts", niveau: 3, type: "qcm",
  question: "Quelle œuvre de Marcel Duchamp est un urinoir présenté comme sculpture ?",
  choix: ["Fontaine", "La Roue de bicyclette", "Le Grand Verre", "Nu descendant un escalier"],
  reponse: 0,
  explication: "Refusée en 1917 par un salon qui se disait pourtant sans jury. L'original a disparu : toutes les versions exposées sont des répliques."
},
{
  id: "art-110", categorie: "arts", niveau: 3, type: "qcm",
  question: "Quel grand compositeur a perdu l'audition au cours de sa carrière ?",
  choix: ["Ludwig van Beethoven", "Franz Schubert", "Frédéric Chopin", "Robert Schumann"],
  reponse: 0,
  explication: "Il dirigeait encore la création de sa Neuvième Symphonie sans rien entendre : il a fallu le retourner vers la salle pour qu'il voie les applaudissements."
}

]);
