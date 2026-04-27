export interface Question {
  id: number
  question: string
  answers: string[]
  correctAnswer: number
}

export const questions: Question[] = [
  {
    id: 1,
    question:
      "Wenn Adam und Eva nur drei Söhne hatten (Kain, Abel und Seth), wie entstand dann die Menschheit?",
    answers: [
      "Durch Mutationssprung",
      "Durch Vermehrung mit Außerirdischen",
      "Einer der Drei lies sich zur Frau um operieren",
      "Durch Vermehrung mit der Tochter des Bibel-Protokollschreibers",
    ],
    correctAnswer: 3,
  },
  {
    id: 2,
    question: "Die Glaubens- und Gewissensfreiheit ist festgeschrieben im",
    answers: [
      "Alten Testament",
      "Neuen Testament",
      "Hochgesetz",
      "Grundgesetz",
    ],
    correctAnswer: 3,
  },
  {
    id: 3,
    question: "Wer bezahlt das Gehalt des Bischoffs?",
    answers: [
      "Die Katholiken",
      "Die Evangelischen",
      "Das Arbeitsamt",
      "Der Landkreis",
    ],
    correctAnswer: 3,
  },
  {
    id: 4,
    question: "Jesus war ein",
    answers: ["Jude", "Christ", "Uneheliches Kind", "Halbgott"],
    correctAnswer: 0,
  },
  {
    id: 5,
    question: "Der Bund für Geistesfreiheit befasst sich mit",
    answers: [
      "Alkoholischen Getränken",
      "Geistergeschichten",
      "Freizügiger Körperkultur",
      "Glaubensfreiheit",
    ],
    correctAnswer: 3,
  },
  {
    id: 6,
    question:
      "Die wichtigste finanzielle Unterstützung der katholischen Kirche in Deutschland basiert auf",
    answers: [
      "Den Einnahmen des Bettelordens",
      "Freiwilligen Spenden und aufgrund Gerichtsurteile",
      "Einnahmen mit dem Klingelbeutel",
      "Dem bis heute gültigen Vertrag (Konkordat), der mit der Regierung Adolf Hitler geschlossen wurde",
    ],
    correctAnswer: 3,
  },
]

export interface ResultCategory {
  title: string
  description: string
  certificate: boolean
}

export function getResultCategory(score: number): ResultCategory {
  if (score > 4) {
    return {
      title: "Digitale Urkunde freigeschaltet",
      description:
        "Sie haben mehr als vier Antworten richtig geglaubt. Damit erhalten Sie automatisch Ihre digitale Urkunde und können damit am Stand des BfG Ihren Gewinn entgegennehmen.",
      certificate: true,
    }
  }

  if (score >= 3) {
    return {
      title: "Knapp vorbei",
      description:
        "Sie waren nah dran. Für die digitale Urkunde brauchen Sie mehr als vier richtige Antworten. Glauben Sie an sich und versuchen Sie es noch einmal.",
      certificate: false,
    }
  }

  return {
    title: "Noch ein Versuch",
    description:
      "Dieses Mal hat es noch nicht für die Urkunde gereicht. Starten Sie das Quiz erneut und prüfen Sie Ihre Antworten noch einmal.",
    certificate: false,
  }
}
