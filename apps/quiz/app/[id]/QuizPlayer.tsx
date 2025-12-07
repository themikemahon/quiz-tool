'use client'

import { useState } from 'react'

interface Question {
  id: number
  question_text: string
  image_url: string
  correct_answer: string
  explanation: string
  order_index: number
}

interface ResultTier {
  tier_name: string
  message: string
  min_percentage: number
  max_percentage: number
}

interface Quiz {
  id: number
  title: string
  description: string
  intro_text: string
  questions: Question[]
  result_tiers: ResultTier[]
}

interface QuizPlayerProps {
  quiz: Quiz
  embedMode?: boolean
}

type QuizState = 'intro' | 'question' | 'result'

export default function QuizPlayer({ quiz, embedMode = false }: QuizPlayerProps) {
  const [state, setState] = useState<QuizState>('intro')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showExplanation, setShowExplanation] = useState(false)

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const totalQuestions = quiz.questions.length

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: answer })
    setShowExplanation(true)
  }

  const handleNext = () => {
    setShowExplanation(false)
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setState('result')
    }
  }

  const calculateResults = () => {
    let correct = 0
    quiz.questions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) {
        correct++
      }
    })
    const percentage = Math.round((correct / totalQuestions) * 100)
    const tier = quiz.result_tiers.find(
      (t) => percentage >= t.min_percentage && percentage <= t.max_percentage
    )
    return { correct, total: totalQuestions, percentage, tier }
  }

  const handleRestart = () => {
    setAnswers({})
    setCurrentQuestionIndex(0)
    setShowExplanation(false)
    setState('intro')
  }

  // Intro Screen
  if (state === 'intro') {
    return (
      <div className={embedMode 
        ? "w-full" 
        : "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
      }>
        <div className={embedMode
          ? "w-full bg-white rounded-lg shadow-md p-4"
          : "max-w-xl w-full bg-white rounded-lg shadow-lg p-6"
        }>
          <h1 className={embedMode 
            ? "text-xl font-bold text-gray-900 mb-2" 
            : "text-2xl font-bold text-gray-900 mb-3"
          }>
            {quiz.title}
          </h1>
          {quiz.description && (
            <p className={embedMode 
              ? "text-sm text-gray-600 mb-4" 
              : "text-base text-gray-600 mb-5"
            }>
              {quiz.description}
            </p>
          )}
          <button
            onClick={() => setState('question')}
            className={embedMode
              ? "w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
              : "w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
            }
          >
            Start Quiz
          </button>
        </div>
      </div>
    )
  }

  // Question Screen
  if (state === 'question') {
    const isCorrect = answers[currentQuestion.id] === currentQuestion.correct_answer

    return (
      <div className={embedMode 
        ? "w-full" 
        : "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
      }>
        <div className={embedMode
          ? "w-full bg-white rounded-lg shadow-md p-4"
          : "max-w-2xl w-full bg-white rounded-lg shadow-lg p-6"
        }>
          {/* Progress */}
          <div className={embedMode ? "mb-3" : "mb-4"}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-600">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span className="text-xs font-medium text-gray-600">
                {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question */}
          <h2 className={embedMode 
            ? "text-base font-bold text-gray-900 mb-3" 
            : "text-lg font-bold text-gray-900 mb-4"
          }>
            {currentQuestion.question_text}
          </h2>

          {/* Image */}
          {currentQuestion.image_url && (
            <div className={embedMode
              ? "mb-3 rounded-md overflow-hidden border border-gray-200"
              : "mb-4 rounded-md overflow-hidden border border-gray-200"
            }>
              <img
                src={currentQuestion.image_url}
                alt="Question"
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Answer Buttons */}
          {!showExplanation ? (
            <div className={embedMode ? "grid grid-cols-2 gap-2" : "grid grid-cols-2 gap-2"}>
              <button
                onClick={() => handleAnswer('scam')}
                className={embedMode
                  ? "bg-red-100 text-red-700 px-3 py-2 rounded-md text-sm font-semibold hover:bg-red-200 transition border border-red-300"
                  : "bg-red-100 text-red-700 px-3 py-2 rounded-md text-sm font-semibold hover:bg-red-200 transition border border-red-300"
                }
              >
                🚨 Scam
              </button>
              <button
                onClick={() => handleAnswer('not-scam')}
                className={embedMode
                  ? "bg-green-100 text-green-700 px-3 py-2 rounded-md text-sm font-semibold hover:bg-green-200 transition border border-green-300"
                  : "bg-green-100 text-green-700 px-3 py-2 rounded-md text-sm font-semibold hover:bg-green-200 transition border border-green-300"
                }
              >
                ✅ Not a Scam
              </button>
            </div>
          ) : (
            <div className={embedMode ? "space-y-2" : "space-y-3"}>
              {/* Result */}
              <div
                className={embedMode
                  ? `p-3 rounded-md ${isCorrect ? 'bg-green-50 border border-green-300' : 'bg-red-50 border border-red-300'}`
                  : `p-4 rounded-md ${isCorrect ? 'bg-green-50 border border-green-300' : 'bg-red-50 border border-red-300'}`
                }
              >
                <div className={embedMode 
                  ? "flex items-center gap-2 mb-2" 
                  : "flex items-center gap-2 mb-2"
                }>
                  <span className="text-lg">
                    {isCorrect ? '✅' : '❌'}
                  </span>
                  <span className={`text-base font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  {currentQuestion.explanation}
                </p>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className={embedMode
                  ? "w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
                  : "w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
                }
              >
                {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'See Results'}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Results Screen
  const results = calculateResults()

  return (
    <div className={embedMode 
      ? "w-full" 
      : "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
    }>
      <div className={embedMode
        ? "w-full bg-white rounded-lg shadow-md p-4"
        : "max-w-xl w-full bg-white rounded-lg shadow-lg p-6"
      }>
        <div className={embedMode ? "text-center mb-4" : "text-center mb-5"}>
          <h1 className={embedMode 
            ? "text-xl font-bold text-gray-900 mb-2" 
            : "text-2xl font-bold text-gray-900 mb-3"
          }>
            Quiz Complete!
          </h1>
          <div className={embedMode
            ? "inline-block bg-blue-100 rounded-full px-4 py-2 mb-2"
            : "inline-block bg-blue-100 rounded-full px-6 py-3 mb-3"
          }>
            <span className={embedMode 
              ? "text-2xl font-bold text-blue-600" 
              : "text-3xl font-bold text-blue-600"
            }>
              {results.correct}/{results.total}
            </span>
          </div>
          <p className={embedMode 
            ? "text-sm text-gray-600" 
            : "text-base text-gray-600"
          }>
            You scored {results.percentage}%
          </p>
        </div>

        {/* Tier Result */}
        {results.tier && (
          <div className={embedMode
            ? "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md p-3 mb-4 border border-blue-200"
            : "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md p-4 mb-5 border border-blue-200"
          }>
            <h2 className={embedMode 
              ? "text-base font-bold text-gray-900 mb-2" 
              : "text-lg font-bold text-gray-900 mb-2"
            }>
              {results.tier.tier_name}
            </h2>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {results.tier.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={handleRestart}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
          >
            Take Quiz Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
