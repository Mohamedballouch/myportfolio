import { DURATION, stageAt } from "./factory-state.js";

const pair = (en, fr) => ({ en, fr });
const sharedSteps = [
  pair("Read & split documents", "Lire et découper"),
  pair("Index the passages", "Indexer les passages"),
  pair("Find evidence & draft", "Rechercher et rédiger"),
  pair("Check & deliver", "Vérifier et livrer"),
];
export const missions = {
  rag: {
    prompt: pair(
      "I need two monitors. Prepare a purchase request.",
      "J’ai besoin de deux écrans. Prépare une demande d’achat.",
    ),
    document: pair(
      "Example purchasing policy · §1",
      "Procédure d’achat fictive · §1",
    ),
    excerpt: pair(
      "Equipment requests need the item, quantity, business purpose, estimated cost, and manager review.",
      "Une demande de matériel doit préciser l’article, la quantité, le motif professionnel et le coût estimé, puis être revue par un responsable.",
    ),
    result: pair(
      "Draft: 2 monitors. Add the business purpose and estimated cost before manager review. [1]",
      "Brouillon : 2 écrans. Ajoutez le motif professionnel et le coût estimé avant la revue du responsable. [1]",
    ),
    source: pair(
      "[1] Example purchasing policy · §1",
      "[1] Procédure d’achat fictive · §1",
    ),
    review: pair(
      "Needs details · purpose and cost missing",
      "À compléter · motif et coût manquants",
    ),
    steps: sharedSteps,
    tools: [
      {
        name: pair("Find policy", "Trouver la procédure"),
        action: pair(
          "Searching the library → returning passage §1",
          "Recherche dans la bibliothèque → retour du passage §1",
        ),
        detail: pair(
          "The assistant sends a search request to the indexed library. The matching policy passage returns with its source reference. This reflects my enterprise document retrieval work.",
          "L’assistant interroge la bibliothèque indexée. Le passage pertinent revient avec sa référence, à l’image de mon travail de recherche documentaire en entreprise.",
        ),
      },
      {
        name: pair("Fill request", "Préparer la demande"),
        action: pair(
          "Filling the draft: item = monitors · quantity = 2",
          "Brouillon : article = écrans · quantité = 2",
        ),
        detail: pair(
          "A simulated form tool copies the item and quantity from the question. Purpose and estimated cost stay empty because the user did not provide them. Nothing is submitted.",
          "Un outil de formulaire simulé reprend l’article et la quantité de la question. Le motif et le coût restent vides, car ils n’ont pas été fournis. Rien n’est envoyé.",
        ),
      },
      {
        name: pair("Write reply", "Rédiger la réponse"),
        action: pair(
          "Writing a reply from the policy and draft fields",
          "Rédaction à partir de la procédure et du brouillon",
        ),
        detail: pair(
          "A language model would compose the response using the retrieved passage and the form result. It does not invent the missing fields. The demo response is scripted.",
          "Un modèle de langage rédigerait la réponse à partir du passage retrouvé et du formulaire, sans inventer les champs manquants. La réponse de cette démonstration est prédéfinie.",
        ),
      },
    ],
  },
  insurance: {
    prompt: pair(
      "What documents should I attach to a claim?",
      "Quels documents dois-je joindre à une déclaration ?",
    ),
    document: pair(
      "Example claims guide · §2",
      "Guide de déclaration fictif · §2",
    ),
    excerpt: pair(
      "Attach the completed claim form and proof of the incident. An adviser reviews the file before a decision.",
      "Joignez le formulaire de déclaration rempli et un justificatif de l’incident. Un conseiller examine le dossier avant toute décision.",
    ),
    result: pair(
      "Prepare a completed claim form and proof of the incident. An adviser must review the file before any decision. [1]",
      "Préparez le formulaire de déclaration rempli et un justificatif de l’incident. Un conseiller doit examiner le dossier avant toute décision. [1]",
    ),
    source: pair(
      "[1] Example claims guide · §2",
      "[1] Guide de déclaration fictif · §2",
    ),
    review: pair(
      "Source attached · adviser review required",
      "Source jointe · revue par un conseiller requise",
    ),
    steps: sharedSteps,
    tools: [
      {
        name: pair("Find guidance", "Trouver le guide"),
        action: pair(
          "Searching the library → returning passage §2",
          "Recherche dans la bibliothèque → retour du passage §2",
        ),
        detail: pair(
          "The assistant searches indexed passages and returns the claims guide with its reference. This document-grounded example is inspired by my insurance assistant work at DXC.",
          "L’assistant recherche les passages indexés et retrouve le guide avec sa référence. Cet exemple documentaire s’inspire de mon travail sur un assistant d’assurance chez DXC.",
        ),
      },
      {
        name: pair("Build checklist", "Créer la liste"),
        action: pair(
          "Preparing two checklist items from the passage",
          "Préparation des deux pièces mentionnées dans le passage",
        ),
        detail: pair(
          "A simulated checklist tool extracts the two required documents from the example passage. It does not assess eligibility or make a claim decision.",
          "Un outil de liste simulé extrait les deux pièces du passage fictif. Il n’évalue pas l’éligibilité et ne prend aucune décision sur le dossier.",
        ),
      },
      {
        name: pair("Write reply", "Rédiger la réponse"),
        action: pair(
          "Writing a cited answer with the review requirement",
          "Rédaction d’une réponse sourcée avec l’étape de revue",
        ),
        detail: pair(
          "The language model would turn the retrieved guidance and checklist into an answer, retaining the adviser-review requirement. The demonstration uses a scripted answer.",
          "Le modèle de langage transformerait le guide et la liste en réponse, en conservant l’obligation de revue. La démonstration utilise une réponse prédéfinie.",
        ),
      },
    ],
  },
};
export const missionUI = {
  en: {
    mission: "QUESTION TO THE ASSISTANT",
    sourceInput: "SOURCE DOCUMENT",
    example: "SCRIPTED EXAMPLE",
    prepareLane: "01–02 / PREPARE THE KNOWLEDGE",
    answerLane: "03–04 / ANSWER A QUESTION",
    trace: "DOCUMENT ASSISTANT WORKFLOW",
    output: "ANSWER & REVIEW",
    checking: "Checking required fields and source support…",
    waiting: "Run the walkthrough to follow the document and the question.",
    preparing:
      "Read documents → index passages. Then the question starts a search.",
    tools: "ASSISTANT ACTIONS",
    inspect: "Inspect action",
    evidence: "RETRIEVED EVIDENCE",
    captions: [
      "Read & split",
      "Index passages",
      "Find & draft",
      "Check & deliver",
    ],
    legend: ["Document passages", "Search request", "Cited response"],
  },
  fr: {
    mission: "QUESTION À L’ASSISTANT",
    sourceInput: "DOCUMENT SOURCE",
    example: "EXEMPLE SIMULÉ",
    prepareLane: "01–02 / PRÉPARER LES CONNAISSANCES",
    answerLane: "03–04 / RÉPONDRE À UNE QUESTION",
    trace: "PARCOURS DE L’ASSISTANT DOCUMENTAIRE",
    output: "RÉPONSE ET REVUE",
    checking: "Contrôle des champs requis et des sources…",
    waiting: "Lancez le parcours pour suivre le document et la question.",
    preparing:
      "Lire les documents → indexer les passages. Puis la question lance une recherche.",
    tools: "ACTIONS DE L’ASSISTANT",
    inspect: "Explorer l’action",
    evidence: "PASSAGE RETROUVÉ",
    captions: [
      "Lire et découper",
      "Indexer les passages",
      "Rechercher et rédiger",
      "Vérifier et livrer",
    ],
    legend: [
      "Passages documentaires",
      "Requête de recherche",
      "Réponse sourcée",
    ],
  },
};
const unit = (value) => Math.max(0, Math.min(1, value));
// Preparation ends at 6 s. Only then does the question start an answering run.
export function missionFrame(sample, time) {
  const mission = missions[sample] || missions.rag;
  const t = Math.max(0, Math.min(DURATION, Number.isFinite(time) ? time : 0));
  return {
    mission,
    sample: missions[sample] ? sample : "rag",
    time: t,
    stage: stageAt(t),
    ingestion: unit(t / 3),
    indexing: unit((t - 3) / 3),
    questionProgress: unit((t - 5.65) / 0.35),
    query: unit((t - 6) / 0.45),
    retrieval: unit((t - 6.45) / 0.55),
    generation: unit(t - 8),
    draftTransfer: unit((t - 9) / 0.2),
    reviewProgress: unit((t - 9.2) / 0.5),
    evidenceReady: t >= 7,
    reviewDone: t >= 9.7,
    toolIndex: t >= 6 && t < 9 ? Math.min(2, Math.floor(t - 6)) : -1,
    toolProgress: t >= 6 && t < 9 ? (t - 6) % 1 : 0,
    outputProgress: unit((t - 9.7) / 2.3),
    complete: t === DURATION,
  };
}
export function outputAt(sample, time, language = "en") {
  const frame = missionFrame(sample, time);
  const tokens = (
    frame.mission.result[language] || frame.mission.result.en
  ).split(" ");
  return tokens
    .slice(0, Math.floor(tokens.length * frame.outputProgress + 1e-9))
    .join(" ");
}
