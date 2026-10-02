import { ProfileInfo, AcademicDegree, WorkExperience, SkillCategory, ProjectItem } from '../types';

export const profileData: ProfileInfo = {
  fullName: "Beneditte Flore BISSIEK WANG",
  firstName: "Beneditte Flore",
  lastName: "BISSIEK WANG",
  title: "Développeuse Full-Stack",
  subtitle: "Licence Génie Logiciel & BTS GSI (IUGET)",
  birthDate: "14/04/2006",
  email: "florewang03@gmail.com",
  phones: ["651 88 77 22", "697 20 44 31"],
  githubUrl: "https://github.com/florewang03-sys",
  portfolioUrl: "https://folio-alpha-gilt.vercel.app",
  location: "Douala, Bonamoussadi",
  availability: "Disponible pour opportunités professionnelles & projets",
  bio: "Jeune développeuse full-stack, titulaire d’une Licence en Génie Logiciel, avec une expérience en développement web et en systèmes d’information. Autonome sur React.js, Node.js et MySQL, j’ai également participé à la conception et au développement d’applications web de gestion de prospects et d’interactions commerciales. Rigoureuse et orientée résultats, je souhaite mettre mes compétences en pratique et contribuer à des projets concrets au sein d’une équipe professionnelle.",
  softSkills: [
    "Travail en équipe",
    "Rigueur",
    "Capacité d'adaptation"
  ]
};

export const academicDegrees: AcademicDegree[] = [
  {
    id: "licence-gl-2026",
    degree: "Licence Génie Logiciel",
    institution: "IUGET",
    year: "2026",
    field: "Génie Logiciel & Systèmes d'Information",
    description: "Cycle supérieur approfondi centré sur le génie logiciel, le développement applicatif full-stack, les bases de données et la modélisation logicielle.",
    skillsAcquired: [
      "React.js & JavaScript moderne",
      "Node.js & Express",
      "Bases de données relationnelles (MySQL)",
      "APIs REST & Authentification JWT",
      "Bases en Java"
    ]
  },
  {
    id: "bts-gsi-2025",
    degree: "BTS Gestion des Systèmes d'Information",
    institution: "IUGET",
    year: "2025",
    field: "Systèmes d'Information & Réseaux",
    description: "Maîtrise des systèmes d'information, des architectures client-serveur, des réseaux et des mécanismes de sauvegarde des données d'entreprise.",
    skillsAcquired: [
      "Gestion des Systèmes d'Information",
      "Réseaux LAN, MAN, WAN (bases)",
      "Administration et sauvegardes de données",
      "Environnements client/serveur",
      "Intégration de progiciels métiers"
    ]
  },
  {
    id: "bac-a4-2023",
    degree: "Baccalauréat A4",
    institution: "Enseignement Secondaire Général",
    year: "2023",
    field: "Lettres & Langues",
    description: "Formation développant la rigueur d'esprit, la méthode de réflexion et les capacités d'analyse et de communication écrite et orale.",
    skillsAcquired: [
      "Rigueur analytique",
      "Communication écrite & orale",
      "Méthode et organisation"
    ]
  }
];

export const workExperiences: WorkExperience[] = [
  {
    id: "exp-freelance-2026",
    role: "Développeuse Freelance — Application front-end pour une église",
    company: "Freelance",
    period: "Avril 2026 — Aujourd'hui",
    duration: "En cours",
    location: "À distance",
    type: "freelance",
    missions: [
      "Développement de l'interface front-end d'une plateforme web pour une église, de la conception à l'intégration.",
      "Utilisation de React.js, CSS et JavaScript pour construire des composants réutilisables et une expérience utilisateur soignée."
    ],
    technologies: ["React.js", "JavaScript", "CSS", "Git / GitHub"],
    highlights: [
      "Plateforme déployée et accessible en ligne sur Vercel",
      "Composants réutilisables et responsive design"
    ]
  },
  {
    id: "exp-kaiidou-2026",
    role: "Stagiaire en Génie Logiciel",
    company: "Kaiidou Lab SARL",
    period: "27 janvier — 7 avril 2026",
    duration: "Stage professionnel",
    location: "Douala, Cameroun",
    type: "stage",
    missions: [
      "Mise à jour de logiciels de gestion comptable et commerciale pour les clients de l'entreprise.",
      "Installation et configuration des logiciels EasyProcess, EasyGC et EasyCompta sur les machines clientes et serveurs.",
      "Réalisation des sauvegardes régulières des données de l'entreprise.",
      "Conception et développement d'une application web de gestion des prospects et des interactions commerciales."
    ],
    technologies: ["Application Web", "MySQL", "Node.js", "EasyProcess", "EasyGC", "EasyCompta", "Sauvegardes BD"],
    highlights: [
      "Conception intégrale de l'application CRM de gestion des prospects",
      "Maintenance de la suite de progiciels EasyProcess / EasyGC / EasyCompta"
    ]
  },
  {
    id: "exp-bnr-2025",
    role: "Stagiaire en Gestion des Systèmes d'Information",
    company: "BNR Company",
    period: "Juillet 2025",
    duration: "1 mois",
    location: "Douala, Cameroun",
    type: "stage",
    missions: [
      "Apprentissage approfondi du HTML et du CSS à travers des cas pratiques.",
      "Reproduction de modèles de factures destinés à être intégrés dans le système de gestion de l'entreprise."
    ],
    technologies: ["HTML", "CSS", "Systèmes d'Information (SI)", "Modèles de Factures"],
    highlights: [
      "Reproduction fidèle des modèles de factures pour le SI d'entreprise",
      "Pratique approfondie des standards web"
    ]
  }
];

export const skillCategories: SkillCategory[] = [
  {
    id: "web-dev",
    title: "Développement Web & Front-End",
    description: "Technologies modernes pour la création d'interfaces fluides et dynamiques.",
    skills: [
      { name: "React.js", level: "Avancé", percentage: 90, description: "Composants réutilisables, hooks, interfaces réactives" },
      { name: "JavaScript", level: "Avancé", percentage: 88, description: "DOM, logique asynchrone, syntaxe moderne" },
      { name: "CSS / CSS3", level: "Avancé", percentage: 90, description: "Mise en page responsive, stylisation et composants" }
    ]
  },
  {
    id: "backend-api",
    title: "Back-End, APIs & Sécurité",
    description: "Architecture serveur, gestion des flux de données et authentification.",
    skills: [
      { name: "Node.js / Express", level: "Opérationnel", percentage: 80, description: "Création de serveurs web et gestion des routes" },
      { name: "API REST", level: "Opérationnel", percentage: 82, description: "Conception et consommation d'endpoints RESTful" },
      { name: "JWT (Authentification)", level: "Opérationnel", percentage: 78, description: "Sécurisation des accès et gestion des tokens de session" },
      { name: "Bases en Java", level: "Notions solides", percentage: 70, description: "Principes de la programmation orientée objet" }
    ]
  },
  {
    id: "database-systems",
    title: "Bases de Données & Réseaux",
    description: "Stockage relationnel, intégrité des données et connectivité.",
    skills: [
      { name: "MySQL", level: "Avancé", percentage: 85, description: "Requêtage, modélisation relationnelle, sauvegardes régulières" },
      { name: "Réseaux LAN, MAN, WAN (bases)", level: "Bases solides", percentage: 75, description: "Architectures réseaux, adressage et protocoles" }
    ]
  },
  {
    id: "tools-design",
    title: "Outils de Travail & Design",
    description: "Environnements de développement, versioning et création graphique.",
    skills: [
      { name: "Git / GitHub", level: "Avancé", percentage: 86, description: "Contrôle de version, collaboration et dépôts distants" },
      { name: "VS Code, NetBeans", level: "Maîtrise", percentage: 90, description: "Environnements de développement et debugging" },
      { name: "Canva (maîtrise)", level: "Maîtrise", percentage: 90, description: "Conception graphique et maquettage de supports" }
    ]
  }
];

export const projectItems: ProjectItem[] = [
  {
    id: "proj-crm-kaiidou",
    title: "Application Web de Gestion des Prospects & CRM",
    category: "Full-Stack / CRM Web",
    period: "27 janvier — 7 avril 2026",
    clientOrContext: "Kaiidou Lab SARL",
    description: "Conception et développement complet d'une application web de gestion des prospects et des interactions commerciales, avec base de données sécurisée.",
    features: [
      "Gestion et enregistrement des fiches prospects",
      "Suivi des interactions commerciales et relances",
      "Interface dynamique pour les équipes commerciales",
      "Base de données MySQL sécurisée"
    ],
    technologies: ["React.js", "Node.js", "MySQL", "JavaScript", "CSS"],
    liveUrl: "https://front-production-257d.up.railway.app/",
    status: "Terminé"
  },
  {
    id: "proj-church-app",
    title: "Application Front-End pour une Église",
    category: "Front-End Réactif",
    period: "Avril 2026 — Aujourd'hui",
    clientOrContext: "Projet Freelance",
    description: "Développement de l'interface front-end d'une plateforme web pour une église, de la conception à l'intégration, avec composants réutilisables et expérience soignée.",
    features: [
      "Interface front-end responsive et ergonomique",
      "Composants React.js réutilisables et modulaires",
      "Présentation claire des cultes, annonces et activités",
      "Déploiement continu sur Vercel"
    ],
    technologies: ["React.js", "CSS", "JavaScript", "Git / GitHub", "Vercel"],
    liveUrl: "https://cpc-sepia.vercel.app/",
    status: "En cours"
  },
  {
    id: "proj-invoicing-bnr",
    title: "Reproduction de Modèles de Factures pour SI",
    category: "Intégration SI & Web",
    period: "Juillet 2025",
    clientOrContext: "BNR Company",
    description: "Apprentissage approfondi du HTML/CSS et reproduction de modèles de factures destinés à être intégrés directement dans le système de gestion de l'entreprise.",
    features: [
      "Conception de gabarits conformes aux normes de l'entreprise",
      "Intégration dans le système de gestion de l'entreprise",
      "Structure HTML et styles CSS soignés pour impression et affichage"
    ],
    technologies: ["HTML", "CSS", "Systèmes de Gestion"],
    status: "Déployé"
  },
  {
    id: "proj-easy-suite",
    title: "Déploiement & Sauvegarde Progiciels Métiers",
    category: "Génie Logiciel & SI",
    period: "27 janvier — 7 avril 2026",
    clientOrContext: "Kaiidou Lab SARL",
    description: "Mise à jour de logiciels de gestion comptable et commerciale (EasyProcess, EasyGC, EasyCompta) sur machines clientes et serveurs, avec sauvegardes régulières.",
    features: [
      "Mise à jour de logiciels comptables et commerciaux",
      "Installation et configuration d'EasyProcess, EasyGC et EasyCompta",
      "Paramétrage sur machines clientes et serveurs",
      "Réalisation des sauvegardes régulières des données d'entreprise"
    ],
    technologies: ["EasyProcess", "EasyGC", "EasyCompta", "MySQL", "Sauvegardes Données"],
    status: "Terminé"
  }
];
