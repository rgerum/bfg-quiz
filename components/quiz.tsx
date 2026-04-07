"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { questions, getResultCategory, type Question } from "@/lib/quiz-data"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, RotateCcw, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

type QuizState = "start" | "playing" | "result"

const answerLabels = ["A", "B", "C", "D"]

function Header() {
  return (
    <header className="w-full border-b border-border bg-card">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
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

export function Quiz() {
  const [mounted, setMounted] = useState(false)
  const [quizState, setQuizState] = useState<QuizState>("start")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentQuestion: Question | undefined = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex) / questions.length) * 100

  const handleStartQuiz = () => {
    setQuizState("playing")
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setScore(0)
    setAnswers([])
  }

  const handleSelectAnswer = (answerIndex: number) => {
    if (showFeedback) return
    setSelectedAnswer(answerIndex)
  }

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null || !currentQuestion) return
    
    setShowFeedback(true)
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    if (isCorrect) {
      setScore((prev) => prev + 1)
    }
    setAnswers((prev) => [...prev, selectedAnswer])
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      setQuizState("result")
    }
  }

  const resultCategory = getResultCategory(score)

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="animate-pulse text-muted-foreground">Lade Quiz...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <AnimatePresence mode="wait">
          {quizState === "start" && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl text-center space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
                  Rädli 2026 Quiz
                </h1>
                <p className="text-muted-foreground text-lg">
                  Teste dein Wissen mit 10 spannenden Fragen.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>10 Fragen</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>4 Antworten pro Frage</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Sofortiges Feedback</span>
                </div>
              </div>
              <Button 
                size="lg" 
                onClick={handleStartQuiz}
                className="px-8"
              >
                Quiz starten
              </Button>
            </motion.div>
          )}

          {quizState === "playing" && currentQuestion && (
            <div className="w-full max-w-2xl flex flex-col self-start pt-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Frage {currentQuestionIndex + 1} von {questions.length}
                </span>
                <span className="text-sm font-medium text-primary">
                  {score} {score === 1 ? "Punkt" : "Punkte"}
                </span>
              </div>
              <Progress value={progress} className="h-2 mb-8" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={`question-${currentQuestionIndex}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-foreground text-balance leading-relaxed">
                    {currentQuestion.question}
                  </h2>
                  <div className="space-y-3">
                    {currentQuestion.answers.map((answer, index) => {
                      const isSelected = selectedAnswer === index
                      const isCorrect = index === currentQuestion.correctAnswer
                      const showCorrect = showFeedback && isCorrect
                      const showWrong = showFeedback && isSelected && !isCorrect

                      return (
                        <button
                          key={index}
                          onClick={() => handleSelectAnswer(index)}
                          disabled={showFeedback}
                          className={cn(
                            "w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-4",
                            "hover:border-primary/50 hover:bg-primary/5",
                            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                            "disabled:cursor-not-allowed",
                            isSelected && !showFeedback && "border-primary bg-primary/10",
                            showCorrect && "border-green-500 bg-green-50 text-green-900",
                            showWrong && "border-red-500 bg-red-50 text-red-900",
                            !isSelected && !showCorrect && !showWrong && "border-border"
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                              isSelected && !showFeedback && "bg-primary text-primary-foreground",
                              showCorrect && "bg-green-500 text-white",
                              showWrong && "bg-red-500 text-white",
                              !isSelected && !showCorrect && !showWrong && "bg-muted text-muted-foreground"
                            )}
                          >
                            {showCorrect ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : showWrong ? (
                              <XCircle className="h-5 w-5" />
                            ) : (
                              answerLabels[index]
                            )}
                          </span>
                          <span className="font-medium">{answer}</span>
                        </button>
                      )
                    })}
                  </div>
                  <div className="flex justify-end">
                    {!showFeedback ? (
                      <Button
                        onClick={handleConfirmAnswer}
                        disabled={selectedAnswer === null}
                        size="lg"
                      >
                        Antwort bestätigen
                      </Button>
                    ) : (
                      <Button onClick={handleNextQuestion} size="lg">
                        {currentQuestionIndex < questions.length - 1
                          ? "Nächste Frage"
                          : "Ergebnis anzeigen"}
                      </Button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {quizState === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl text-center space-y-6"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Trophy className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                {resultCategory.title}
              </h2>
              <div className="text-4xl font-bold text-primary">
                {score} / {questions.length}
              </div>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                {resultCategory.description}
              </p>

              <div className="pt-4 space-y-3">
                <h3 className="font-semibold text-left">Deine Antworten:</h3>
                <div className="grid gap-2">
                  {questions.map((q, index) => {
                    const userAnswer = answers[index]
                    const isCorrect = userAnswer === q.correctAnswer
                    return (
                      <div
                        key={q.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg text-sm",
                          isCorrect ? "bg-green-50 text-green-900" : "bg-red-50 text-red-900"
                        )}
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 shrink-0" />
                        )}
                        <span className="text-left line-clamp-1">{q.question}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleStartQuiz}
                className="mt-6"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Nochmal spielen
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
