import Link from "next/link"
import type { Metadata } from "next"
import { fetchQuery } from "convex/nextjs"

import { api } from "@/convex/_generated/api"
import { questions } from "@/lib/quiz-data"

export const metadata: Metadata = {
  title: "Quiz Ergebnisse - Bund für Geistesfreiheit Erlangen",
  description: "Live-Auswertung des Glaubensquiz pro Frage und Antwort.",
}

export const dynamic = "force-dynamic"

const answerLabels = ["A", "B", "C", "D"]

type AnswerCount = {
  answerIndex: number
  count: number
}

async function getResults() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
  if (!convexUrl) {
    return null
  }

  try {
    return await fetchQuery(api.quizSubmissions.answerCounts, {}, { url: convexUrl })
  } catch {
    return null
  }
}

function getTopAnswer(answers: AnswerCount[]) {
  return [...answers].sort((a, b) => b.count - a.count)[0] ?? null
}

export default async function ResultsPage() {
  const results = await getResults()

  return (
    <main className="min-h-screen bg-background px-4 py-10 md:px-6">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Live-Auswertung
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Ergebnisse des Glaubensquiz
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Verteilung der Antworten pro Frage. Die Balken zeigen, wie oft
              jede Antwort bisher gewählt wurde.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="rounded-2xl border border-border bg-card px-5 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Einreichungen
              </p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {results?.totalSubmissions ?? 0}
              </p>
            </div>
            <Link
              href="/"
              className="rounded-2xl border border-border bg-card px-5 py-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Zurück zum Quiz
            </Link>
          </div>
        </div>

        {!results ? (
          <div className="rounded-3xl border border-border bg-card p-8 text-center">
            <p className="text-lg text-muted-foreground">
              Die Auswertung konnte gerade nicht geladen werden.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {questions.map((question) => {
              const countsForQuestion =
                results.questions.find((item) => item.questionId === question.id)
                  ?.answers ?? []
              const totalVotes = countsForQuestion.reduce(
                (sum, answer) => sum + answer.count,
                0,
              )
              const topAnswer = getTopAnswer(countsForQuestion)

              return (
                <section
                  key={question.id}
                  className="rounded-3xl border border-border bg-card p-6 md:p-8"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-3">
                      <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
                        Frage {question.id}
                      </p>
                      <h2 className="max-w-3xl text-2xl font-semibold leading-tight text-foreground">
                        {question.question}
                      </h2>
                    </div>

                    <div className="flex gap-3">
                      <div className="rounded-2xl bg-muted px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          Stimmen
                        </p>
                        <p className="mt-1 text-2xl font-bold text-foreground">
                          {totalVotes}
                        </p>
                      </div>
                      {topAnswer && (
                        <div className="rounded-2xl bg-primary px-4 py-3 text-primary-foreground">
                          <p className="text-xs uppercase tracking-[0.18em] opacity-80">
                            Führend
                          </p>
                          <p className="mt-1 text-lg font-semibold">
                            {answerLabels[topAnswer.answerIndex]}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4">
                    {question.answers.map((answer, index) => {
                      const count =
                        countsForQuestion.find(
                          (item) => item.answerIndex === index,
                        )?.count ?? 0
                      const percentage =
                        totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0
                      const isCorrect = index === question.correctAnswer

                      return (
                        <div
                          key={answer}
                          className="rounded-2xl border border-border bg-background p-4"
                        >
                          <div className="mb-3 flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                  isCorrect
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-foreground"
                                }`}
                              >
                                {answerLabels[index]}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{answer}</p>
                                {isCorrect && (
                                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                                    Als richtig gewertet
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-2xl font-bold text-foreground">
                                {count}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {percentage}%
                              </p>
                            </div>
                          </div>

                          <div className="h-3 overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full rounded-full ${
                                isCorrect ? "bg-primary" : "bg-foreground/75"
                              }`}
                              style={{ width: `${Math.max(percentage, count > 0 ? 3 : 0)}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
