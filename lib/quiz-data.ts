export interface Question {
  id: number
  question: string
  answers: string[]
  correctAnswer: number
}

export const questions: Question[] = [
  {
    id: 1,
    question: "Welche Stadt ist die Hauptstadt von Australien?",
    answers: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    correctAnswer: 2,
  },
  {
    id: 2,
    question: "Wie viele Planeten hat unser Sonnensystem?",
    answers: ["7", "8", "9", "10"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "Wer malte die Mona Lisa?",
    answers: ["Michelangelo", "Raphael", "Leonardo da Vinci", "Donatello"],
    correctAnswer: 2,
  },
  {
    id: 4,
    question: "In welchem Jahr fiel die Berliner Mauer?",
    answers: ["1987", "1989", "1991", "1990"],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: "Welches chemische Element hat das Symbol 'Au'?",
    answers: ["Silber", "Kupfer", "Gold", "Aluminium"],
    correctAnswer: 2,
  },
  {
    id: 6,
    question: "Wie viele Kontinente gibt es auf der Erde?",
    answers: ["5", "6", "7", "8"],
    correctAnswer: 2,
  },
  {
    id: 7,
    question: "Welches ist das groesste Saugetier der Welt?",
    answers: ["Afrikanischer Elefant", "Blauwal", "Giraffe", "Weisser Hai"],
    correctAnswer: 1,
  },
  {
    id: 8,
    question: "Wer schrieb 'Romeo und Julia'?",
    answers: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswer: 1,
  },
  {
    id: 9,
    question: "Wie viele Knochen hat ein erwachsener Mensch?",
    answers: ["186", "206", "226", "246"],
    correctAnswer: 1,
  },
  {
    id: 10,
    question: "Welcher Planet ist der Sonne am naechsten?",
    answers: ["Venus", "Mars", "Merkur", "Erde"],
    correctAnswer: 2,
  },
]

export interface ResultCategory {
  minScore: number
  maxScore: number
  title: string
  description: string
  emoji: string
}

export const resultCategories: ResultCategory[] = [
  {
    minScore: 0,
    maxScore: 3,
    title: "Anfaenger",
    description: "Du hast noch Luft nach oben! Aber keine Sorge, Uebung macht den Meister. Versuche es doch gleich noch einmal!",
    emoji: "📚",
  },
  {
    minScore: 4,
    maxScore: 6,
    title: "Fortgeschritten",
    description: "Nicht schlecht! Du hast ein solides Grundwissen. Mit etwas mehr Uebung wirst du noch besser!",
    emoji: "🎯",
  },
  {
    minScore: 7,
    maxScore: 9,
    title: "Experte",
    description: "Beeindruckend! Du kennst dich wirklich gut aus. Nur noch ein kleiner Schritt zum perfekten Ergebnis!",
    emoji: "🌟",
  },
  {
    minScore: 10,
    maxScore: 10,
    title: "Genie",
    description: "Perfekt! Du hast alle Fragen richtig beantwortet. Du bist ein wahres Wissensgenie!",
    emoji: "🏆",
  },
]

export function getResultCategory(score: number): ResultCategory {
  return resultCategories.find(
    (category) => score >= category.minScore && score <= category.maxScore
  ) || resultCategories[0]
}
