"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { RotateCcw, Trophy } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { questions, type Question } from "@/lib/quiz-data"

const answerLabels = ["A", "B", "C", "D"]

function Header() {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-border bg-card">
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

function CertificateImage() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <Image
        src="/glaubensquiz-zertifikat.png"
        alt="Zertifikat zum Abschluss des Glaubensquiz"
        width={1448}
        height={1086}
        className="h-auto w-full"
      />
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
      {hasStarted && !isFinished && (
        <div className="sticky top-[73px] z-10 bg-background/95 backdrop-blur">
          <div className="mx-auto w-full max-w-4xl px-4 py-5">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Frage {currentQuestionIndex + 1} von {questions.length}
              </p>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
      )}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
      
        <AnimatePresence mode="wait">
          {!hasStarted ? (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl rounded-2xl bg-card px-6 md:px-8"
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
                    Am Ende des Quizzes erhalten Sie
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
              className="w-full max-w-4xl rounded-2xl bg-card px-3 py-6 md:px-4 md:py-8"
            >
              <div className="space-y-6">
                <CertificateImage />
                <p className="text-center text-base text-muted-foreground md:text-lg">
                  Hole dir bei uns am Stand deine Belohnung ab und diskutiere
                  mit uns deine Antworten.
                </p>

                <div className="space-y-3">
                  <h3 className="font-semibold text-left text-foreground">
                    Ihre Antworten:
                  </h3>
                  <div className="grid gap-2">
                    {questions.map((question, index) => {
                      const userAnswer = answers[index]

                      return (
                        <div
                          key={question.id}
                          className="rounded-lg border border-border bg-background p-4 text-sm"
                        >
                          <div>
                            <p className="font-medium">{question.question}</p>
                            <p className="mt-2 text-xs text-muted-foreground">
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

                <p className="text-center text-sm leading-6 text-muted-foreground md:text-base">
                  Erfahre mehr über den Bund für Geistesfreiheit auf unserer
                  Homepage:{" "}
                  <a
                    href="https://bfg-erlangen.de/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground underline underline-offset-4"
                  >
                    https://bfg-erlangen.de/
                  </a>
                </p>

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
        <div className="flex-2" />
      </main>
    </div>
  )
}
