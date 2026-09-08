// Portfolio copy sourced from the supplied April 2026 CV and existing repository.
// Project dates are intentionally empty when the source does not provide them.
export const projects = [
  {
    id: "agents",
    kind: "enterprise",
    title: { en: "Enterprise AI agents", fr: "Agents IA pour l’entreprise" },
    summary: {
      en: "Knowledge retrieval, autonomous tools and workflow orchestration for everyday business operations.",
      fr: "Recherche documentaire, outils autonomes et orchestration de workflows au service des métiers.",
    },
    context: {
      en: "Exakis Nelite · Microsoft 365 environment",
      fr: "Exakis Nelite · Environnement Microsoft 365",
    },
    details: [
      {
        en: "Built citation-backed agents for HR, procurement, maritime safety and executive support.",
        fr: "Création d’agents avec réponses sourcées pour les RH, les achats, la sécurité maritime et la direction.",
      },
      {
        en: "Connected agents to APIs and Power Automate; standardized evaluation, deployment and governance.",
        fr: "Connexion aux API et à Power Automate ; standardisation de l’évaluation, du déploiement et de la gouvernance.",
      },
    ],
    tech: [
      "Copilot Studio",
      "Power Automate",
      "SharePoint",
      "Dataverse",
      "RAG",
      "Adaptive Cards",
    ],
    stations: [0, 1, 2, 3],
    diagram: "agents",
    year: "2025–",
  },
  {
    id: "insurance-rag",
    kind: "enterprise",
    title: {
      en: "Insurance knowledge systems",
      fr: "Systèmes de connaissance pour l’assurance",
    },
    summary: {
      en: "Enterprise RAG and multimodal AI, refined through retrieval evaluation and performance optimization.",
      fr: "RAG et IA multimodale en entreprise, améliorés par l’évaluation de la recherche et l’optimisation des performances.",
    },
    context: {
      en: "DXC Technology · Insurance sector",
      fr: "DXC Technology · Secteur de l’assurance",
    },
    details: [
      {
        en: "Designed AWS/Bedrock pipelines with text and image processing.",
        fr: "Conception de pipelines AWS/Bedrock avec traitement du texte et des images.",
      },
      {
        en: "Refined reranking and caching; evaluated answer quality and prompt reliability.",
        fr: "Optimisation du reranking et du cache ; évaluation de la qualité des réponses et des prompts.",
      },
    ],
    tech: [
      "Amazon Bedrock",
      "AWS",
      "RAG",
      "Reranking",
      "Multimodal AI",
      "Evaluation",
    ],
    stations: [0, 1, 2, 3],
    diagram: "documents",
    year: "2024–2025",
  },
  {
    id: "archive",
    kind: "enterprise",
    title: {
      en: "Searchable archives & ML delivery",
      fr: "Archives intelligentes et déploiement ML",
    },
    summary: {
      en: "Multimodal archive search and production machine learning across Azure and AWS.",
      fr: "Recherche multimodale dans les archives et mise en production de modèles sur Azure et AWS.",
    },
    context: {
      en: "BlackStone Eit · Enterprise AI systems",
      fr: "BlackStone Eit · Systèmes IA d’entreprise",
    },
    details: [
      {
        en: "Built Azure Video Indexer archive search and a GPT knowledge assistant.",
        fr: "Création d’une recherche d’archives Azure Video Indexer et d’un assistant de connaissance GPT.",
      },
      {
        en: "Delivered versioned ML models with CI/CD and quality-checked Azure Data Factory pipelines.",
        fr: "Déploiement de modèles ML versionnés avec CI/CD et de pipelines Azure Data Factory avec contrôles de qualité.",
      },
    ],
    tech: [
      "Azure Video Indexer",
      "Azure Data Factory",
      "AWS",
      "LangChain",
      "Pinecone",
      "MLOps",
    ],
    stations: [0, 1, 3],
    diagram: "documents",
    year: "2020–2023",
  },
  {
    id: "chart",
    kind: "project",
    title: {
      en: "Multimodal chart intelligence",
      fr: "Analyse multimodale de graphiques",
    },
    summary: {
      en: "Combines computer vision and language models to turn visual charts into clear descriptions and insights.",
      fr: "Associe vision par ordinateur et modèles de langage pour transformer les graphiques en descriptions et analyses claires.",
    },
    context: {
      en: "Multimodal LLM for Chart Analysis and Interpretation",
      fr: "LLM multimodal pour l’analyse et l’interprétation de graphiques",
    },
    details: [
      {
        en: "Interprets chart content through visual and language understanding.",
        fr: "Interprétation des graphiques par compréhension visuelle et linguistique.",
      },
      {
        en: "Combines Claude and LangChain with image/PDF input, validation and a REST API.",
        fr: "Association de Claude et LangChain avec entrées image/PDF, validation et API REST.",
      },
    ],
    tech: ["Python", "Claude", "LangChain", "ChromaDB", "FastAPI", "Docker"],
    stations: [0, 1, 2, 3],
    diagram: "chart",
    year: "",
  },
  {
    id: "churn",
    kind: "project",
    title: {
      en: "Customer churn prediction",
      fr: "Prédiction de l’attrition client",
    },
    summary: {
      en: "An end-to-end telecom churn pipeline combining ensemble methods, deep learning and real-time inference.",
      fr: "Un pipeline de prédiction de l’attrition télécom associant méthodes ensemblistes, deep learning et inférence en temps réel.",
    },
    context: {
      en: "Customer Churn Prediction AI System",
      fr: "Système IA de prédiction du départ des clients",
    },
    details: [
      {
        en: "Built a telecom churn workflow with more than 7,000 customer records.",
        fr: "Création d’un workflow d’attrition télécom à partir de plus de 7 000 dossiers clients.",
      },
      {
        en: "Combined neural networks, ensemble methods and MLOps workflows.",
        fr: "Association de réseaux de neurones, de méthodes ensemblistes et de workflows MLOps.",
      },
    ],
    tech: ["Python", "PyTorch", "Keras", "Pandas", "Neural Networks", "MLOps"],
    stations: [0, 1, 3],
    diagram: "forecast",
    year: "",
  },
  {
    id: "social-data",
    kind: "project",
    title: {
      en: "Social data extraction",
      fr: "Extraction de données sociales",
    },
    summary: {
      en: "A data collection pipeline for Facebook posts, engagement metrics and multimedia content.",
      fr: "Un pipeline de collecte de publications Facebook, de mesures d’engagement et de contenus multimédias.",
    },
    context: {
      en: "Intelligent Social Media Extraction",
      fr: "Extraction intelligente de données des réseaux sociaux",
    },
    details: [
      {
        en: "Built extraction with Python browser automation and HTML parsing.",
        fr: "Extraction par automatisation du navigateur et analyse HTML en Python.",
      },
      {
        en: "Structured posts and engagement data for analysis and multimedia processing.",
        fr: "Structuration des publications et de l’engagement pour l’analyse et le traitement multimédia.",
      },
    ],
    tech: ["Python", "Selenium", "BeautifulSoup", "Data Pipelines"],
    stations: [0],
    diagram: "documents",
    year: "",
  },
  {
    id: "bertopic",
    kind: "project",
    title: {
      en: "Topic discovery with BERTopic",
      fr: "Découverte de sujets avec BERTopic",
    },
    summary: {
      en: "Finds themes in large text collections using transformer embeddings and clustering.",
      fr: "Identifie les thèmes de grands corpus textuels grâce aux embeddings de transformers et au clustering.",
    },
    context: {
      en: "Advanced Topic Modeling using BERTopic",
      fr: "Modélisation de sujets avec BERTopic",
    },
    details: [
      {
        en: "Used BERT embeddings to reveal related content and recurring themes.",
        fr: "Utilisation d’embeddings BERT pour révéler les contenus liés et les thèmes récurrents.",
      },
      {
        en: "Combined UMAP and HDBSCAN for topic discovery in Python.",
        fr: "Association d’UMAP et de HDBSCAN pour découvrir des sujets en Python.",
      },
    ],
    tech: ["Python", "BERTopic", "BERT", "UMAP", "HDBSCAN"],
    stations: [0, 1],
    diagram: "topics",
    year: "",
  },
  {
    id: "electricity",
    kind: "project",
    title: {
      en: "Electricity demand forecasting",
      fr: "Prévision de la consommation électrique",
    },
    summary: {
      en: "Recurrent models for short- and long-term electricity consumption forecasts.",
      fr: "Des modèles récurrents pour prévoir la consommation électrique à court et à long terme.",
    },
    context: {
      en: "Time Series Forecasting for Electricity Data",
      fr: "Prévision de séries temporelles de données électriques",
    },
    details: [
      {
        en: "Trained LSTM and GRU models on historical consumption sequences.",
        fr: "Entraînement de modèles LSTM et GRU sur des séquences historiques de consommation.",
      },
      {
        en: "Adapted sliding windows to different forecast horizons in TensorFlow/Keras.",
        fr: "Adaptation de fenêtres glissantes à différents horizons de prévision dans TensorFlow/Keras.",
      },
    ],
    tech: [
      "Python",
      "TensorFlow/Keras",
      "LSTM",
      "GRU",
      "Pandas",
      "Scikit-learn",
    ],
    stations: [0, 1],
    diagram: "forecast",
    year: "2019",
  },
];

export const experience = [
  {
    company: "Exakis Nelite",
    role: {
      en: "Generative AI Consultant — Expert Agents IA & Copilot Studio",
      fr: "Consultant en IA générative — Expert Agents IA et Copilot Studio",
    },
    dates: { en: "Feb 2025 – Present", fr: "Févr. 2025 – Aujourd’hui" },
    location: { en: "Casablanca, Morocco", fr: "Casablanca, Maroc" },
    bullets: [
      {
        en: "Designed retrieval and autonomous agents for enterprise Microsoft 365.",
        fr: "Conception d’agents de recherche et d’agents autonomes pour Microsoft 365 en entreprise.",
      },
      {
        en: "Built SharePoint/Dataverse RAG, tool calling and Power Automate orchestration.",
        fr: "Développement de RAG SharePoint/Dataverse, d’appels d’outils et d’orchestrations Power Automate.",
      },
      {
        en: "Established evaluation and governance; delivered OCR/LLM document processing.",
        fr: "Mise en place de l’évaluation, de la gouvernance et du traitement documentaire OCR/LLM.",
      },
    ],
  },
  {
    company: "DXC Technology",
    role: {
      en: "Senior Machine Learning Engineer - Hybrid",
      fr: "Ingénieur Machine Learning senior - Hybride",
    },
    dates: { en: "Jan 2024 – Jan 2025", fr: "Janv. 2024 – Janv. 2025" },
    location: { en: "Casablanca, Morocco", fr: "Casablanca, Maroc" },
    bullets: [
      {
        en: "Designed enterprise LLM and generative AI pipelines for insurance on AWS and Amazon Bedrock.",
        fr: "Conception de pipelines LLM et d’IA générative pour l’assurance sur AWS et Amazon Bedrock.",
      },
      {
        en: "Optimized RAG retrieval, caching and prompts; developed multimodal text/image capabilities.",
        fr: "Optimisation de la recherche RAG, du cache et des prompts ; développement de capacités multimodales texte/image.",
      },
      {
        en: "Built QA evaluation and production performance monitoring.",
        fr: "Création d’évaluations des réponses et d’un suivi des performances en production.",
      },
    ],
  },
  {
    company: "BlackStone Eit",
    role: {
      en: "Data Scientist || ML Engineer — AI Systems Developer - Remote",
      fr: "Data Scientist || Ingénieur ML — Développeur de systèmes IA - À distance",
    },
    dates: { en: "Dec 2020 – Dec 2023", fr: "Déc. 2020 – Déc. 2023" },
    location: { en: "Seattle, WA, USA", fr: "Seattle, WA, États-Unis" },
    bullets: [
      {
        en: "Deployed ML on AWS/Azure with CI/CD and model versioning.",
        fr: "Déploiement ML sur AWS/Azure avec CI/CD et gestion des versions.",
      },
      {
        en: "Built archive search, GPT assistants and CNN quality assessment.",
        fr: "Création de recherches d’archives, d’assistants GPT et de contrôles de qualité par CNN.",
      },
      {
        en: "Delivered sentiment analytics and Azure Data Factory ETL.",
        fr: "Réalisation d’analyses de sentiments et d’ETL Azure Data Factory.",
      },
    ],
  },
  {
    company: "3W Media",
    role: {
      en: "Data Scientist || Machine Learning Engineer - Hybrid",
      fr: "Data Scientist || Ingénieur Machine Learning - Hybride",
    },
    dates: { en: "June 2020 – Dec 2020", fr: "Juin 2020 – Déc. 2020" },
    location: { en: "Casablanca, Morocco", fr: "Casablanca, Maroc" },
    bullets: [
      {
        en: "Collected social data with Python, Selenium, GraphQL and BeautifulSoup.",
        fr: "Collecte de données sociales avec Python, Selenium, GraphQL et BeautifulSoup.",
      },
      {
        en: "Processed data in SQL, built Tableau/Qlik/Power BI dashboards and developed sentiment analysis.",
        fr: "Traitement de données en SQL, création de tableaux de bord Tableau/Qlik/Power BI et développement d’analyses de sentiments.",
      },
    ],
  },
];

export const skills = [
  {
    title: { en: "Agents & orchestration", fr: "Agents et orchestration" },
    items: [
      "Copilot Studio",
      "Power Automate",
      "Power Platform",
      "LangGraph",
      "LangChain",
      "LlamaIndex",
      "Azure AI Foundry",
      "Semantic Kernel",
    ],
  },
  {
    title: {
      en: "Generative AI & retrieval",
      fr: "IA générative et recherche",
    },
    items: [
      "OpenAI",
      "Claude",
      "Mistral",
      "RAG",
      "Tool Calling",
      "Multi-Agent Systems",
      "PEFT",
      "Semantic Chunking",
      "Reranking",
    ],
  },
  {
    title: { en: "Machine learning", fr: "Machine learning" },
    items: [
      "PyTorch",
      "TensorFlow/Keras",
      "Hugging Face",
      "Scikit-learn",
      "Computer Vision",
      "NLP",
      "Deep Reinforcement Learning",
    ],
  },
  {
    title: { en: "Data & development", fr: "Données et développement" },
    items: [
      "Python",
      "SQL",
      "JavaScript",
      "Bash",
      "Pandas",
      "NumPy",
      "Pinecone",
      "ChromaDB",
      "MongoDB",
      "Redis",
      "Power Fx",
    ],
  },
  {
    title: { en: "Cloud & delivery", fr: "Cloud et déploiement" },
    items: [
      "Azure ML",
      "AWS SageMaker",
      "Amazon Bedrock",
      "Docker",
      "Kubernetes",
      "FastAPI",
      "Gradio",
      "Jenkins",
      "GitLab CI/CD",
      "Git",
      "Linux",
    ],
  },
  {
    title: { en: "Evaluation & governance", fr: "Évaluation et gouvernance" },
    items: [
      "Model Benchmarking",
      "RAG Evaluation",
      "W&B",
      "Model Versioning",
      "DLP Policies",
      "Managed Environments",
      "Sensitivity Labels",
      "Microsoft Purview",
    ],
  },
];

export const publications = [
  {
    title:
      "Integrated Manufacturing-Microgrid Control Using Multi-Agent Deep Reinforcement Learning",
    year: 2025,
    venue: "IFAC-PapersOnLine, 59(10), pp. 1372–1377",
    url: "https://doi.org/10.1016/j.ifacol.2025.09.231",
  },
  {
    title:
      "Enhancing Control in Manufacturing and Microgrid Systems: Deep Reinforcement Learning with Double Q-Learning",
    year: 2023,
    venue:
      "14th International Conference on Intelligent Systems: Theories and Applications (SITA), pp. 1–7",
    url: "https://doi.org/10.1109/SITA60746.2023.10373737",
  },
  {
    title: "Forecasting Call Center Arrivals Using Machine Learning",
    year: 2021,
    venue:
      "Osmaniye Korkut Ata University Journal of Natural and Applied Sciences, 4(1), pp. 96–101",
    url: "https://doi.org/10.47495/okufbed.824870",
  },
];

export const education = [
  {
    title: {
      en: "PhD Candidate in Data Science and Machine Learning",
      fr: "Doctorant en Data Science et Machine Learning",
    },
    school: "INPT, Rabat",
    dates: "2024 – 2026",
  },
  {
    title: {
      en: "Engineering Degree in Computer Science",
      fr: "Diplôme d’ingénieur en informatique",
    },
    school: "INPT, Rabat",
    dates: "09/2016 – 12/2019",
  },
  {
    title: {
      en: "Exchange Semester in Computer Engineering",
      fr: "Semestre d’échange en génie informatique",
    },
    school: "Çukurova University, Adana",
    dates: "09/2018 – 02/2019",
  },
];

export const certifications = [
  "Microsoft Certified: Azure AI Engineer Associate — Microsoft (09/2025)",
  "Microsoft Certified: Power Platform Functional Consultant Associate — Microsoft (09/2025)",
  "Rasa Developer Certification — Rasa",
  "Intro to Amazon Web Services (AWS) Machine Learning — Coursera",
  "IBM Data Science Professional — IBM / Coursera",
  "Big Data-Level I — IBM / Cognitive Class",
  "Data Analysis Using Python — IBM / Cognitive Class",
  "Spark Machine Learning Library (MLlib) — IBM / Cognitive Class",
  "Neural Networks and Deep Learning — Coursera",
];
