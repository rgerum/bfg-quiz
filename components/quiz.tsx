"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Award,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  Trophy,
} from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { getResultCategory, questions, type Question } from "@/lib/quiz-data"

const answerLabels = ["A", "B", "C", "D"]

function Header() {
  return (
    <header className="w-full border-b border-border bg-card">
      <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3">
        <Image
          src="/bfg-logo.jpg"
          alt="bfg Erlangen Logo"
          width={48}
          height={48}
          className="rounded"
        />
        <span className="font-semibold text-foreground">
          Bund für Geistesfreiheit Erlangen
        </span>
      </div>
    </header>
  )
}

function Certificate({ score }: { score: number }) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-left">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
        <Award className="h-6 w-6 text-emerald-700" />
      </div>
      <h3 className="text-2xl font-bold text-emerald-950">
        Digitale Urkunde
      </h3>
      <p className="mt-3 text-sm leading-6 text-emerald-900">
        Sie haben mehr als vier Antworten richtig geglaubt. Diese digitale
        Urkunde berechtigt zur Gewinnabholung am Stand des BfG.
      </p>
      <div className="mt-5 rounded-xl border border-emerald-200 bg-white p-4">
        <p className="text-xs uppercase tracking-wide text-emerald-700">
          Ergebnis
        </p>
        <p className="mt-2 text-3xl font-bold text-emerald-950">
          {score} / {questions.length}
        </p>
        <p className="mt-2 text-sm text-emerald-900">
          Status: Gewinn freigegeben
        </p>
      </div>
    </div>
  )
}

export function Quiz() {
  const [hasStarted, setHasStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [isFinished, setIsFinished] = useState(false)

  const currentQuestion: Question | undefined = questions[currentQuestionIndex]
  const progress = (currentQuestionIndex / questions.length) * 100
  const resultCategory = getResultCategory(score)

  function handleAnswerSelect(answerIndex: number) {
    if (!currentQuestion) return

    const isCorrect = answerIndex === currentQuestion.correctAnswer

    setAnswers((prev) => [...prev, answerIndex])
    if (isCorrect) {
      setScore((prev) => prev + 1)
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setIsFinished(true)
    }
  }

  function handleRestart() {
    setHasStarted(false)
    setCurrentQuestionIndex(0)
    setScore(0)
    setAnswers([])
    setIsFinished(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {!hasStarted ? (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl rounded-2xl bg-card p-6 md:p-8"
            >
              <div className="space-y-6 text-center">
                <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl">
                  <Image
                    src="/glaubensquiz-title.webp"
                    alt="Titelbild des Glaubensquiz"
                    width={1084}
                    height={1404}
                    className="h-auto w-full"
                    priority
                  />
                </div>

                <div className="space-y-4">
                  <h1 className="text-3xl font-bold text-foreground text-balance md:text-4xl">
                    Glaubensquiz
                  </h1>
                  <p className="text-sm leading-7 text-muted-foreground">
                    Dieses QR-Quiz ist ein Glaubensquiz, kreuzen Sie die Antwort
                    an, die Sie für richtig glauben.
                  </p>
                  <p className="text-sm leading-7 text-muted-foreground">
                    Es gibt 6 Fragen bei denen jeweils eine Antwort als richtig
                    gewertet wird.
                  </p>
                  <p className="text-sm leading-7 text-muted-foreground">
                    Bei mehr als 4 richtig geglaubten Antworten erhalten Sie
                    automatisch eine digitale Urkunde, mit der Sie am Stand des
                    BfG ihren Gewinn entgegen nehmen dürfen.
                  </p>
                  <p className="font-medium text-foreground">
                    Glauben Sie an sich (!) wir tun es auch !
                  </p>
                </div>

                <Button size="lg" onClick={() => setHasStarted(true)}>
                  Quiz starten
                </Button>
              </div>
            </motion.div>
          ) : !isFinished && currentQuestion ? (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl rounded-2xl bg-card p-6 md:p-8"
            >
              <div className="mb-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                    <span>
                      Frage {currentQuestionIndex + 1} von {questions.length}
                    </span>
                    <span>{score} Punkte</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>

              <div className="space-y-5">
                <h2 className="text-2xl font-semibold leading-tight text-foreground text-balance">
                  {currentQuestion.question}
                </h2>

                <div className="grid gap-3">
                  {currentQuestion.answers.map((answer, index) => {
                    return (
                      <button
                        key={answer}
                        type="button"
                        onClick={() => handleAnswerSelect(index)}
                        className={cn(
                          "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors",
                          "hover:border-primary/50 hover:bg-primary/5",
                          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                          "border-border bg-background"
                        )}
                      >
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground"
                        >
                          {answerLabels[index]}
                        </span>
                        <span className="font-medium text-foreground">
                          {answer}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl rounded-2xl bg-card p-6 md:p-8"
            >
              <div className="space-y-6">
                <div className="text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    {resultCategory.certificate ? (
                      <ShieldCheck className="h-10 w-10 text-primary" />
                    ) : (
                      <Trophy className="h-10 w-10 text-primary" />
                    )}
                  </div>
                  <h2 className="mt-4 text-3xl font-bold text-foreground">
                    {resultCategory.title}
                  </h2>
                  <div className="mt-3 text-4xl font-bold text-primary">
                    {score} / {questions.length}
                  </div>
                  <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
                    {resultCategory.description}
                  </p>
                </div>

                {resultCategory.certificate && <Certificate score={score} />}

                {!resultCategory.certificate && (
                  <div className="rounded-xl border border-border bg-muted/40 p-5 text-left">
                    <p className="font-semibold text-foreground">
                      Digitale Urkunde nicht freigeschaltet
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Für die Urkunde werden mindestens fünf richtige Antworten
                      benötigt.
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="font-semibold text-left text-foreground">
                    Ihre Antworten:
                  </h3>
                  <div className="grid gap-2">
                    {questions.map((question, index) => {
                      const userAnswer = answers[index]
                      const isCorrect = userAnswer === question.correctAnswer

                      return (
                        <div
                          key={question.id}
                          className={cn(
                            "flex items-start gap-3 rounded-lg p-3 text-sm",
                            isCorrect
                              ? "bg-green-50 text-green-900"
                              : "bg-red-50 text-red-900"
                          )}
                        >
                          {isCorrect ? (
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                          ) : (
                            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                              ×
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{question.question}</p>
                            <p className="mt-1 text-xs opacity-80">
                              Ihre Antwort:{" "}
                              {userAnswer !== null
                                ? question.answers[userAnswer]
                                : "Keine Auswahl"}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button size="lg" onClick={handleRestart}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Nochmal spielen
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
