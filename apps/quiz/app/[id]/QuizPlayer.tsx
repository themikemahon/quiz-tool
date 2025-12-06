'use client'

import { useState } from 'react'
import Image from 'next/image'

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
}

type QuizState = 'intro' | 'question' | 'result'

export default function QuizPlayer({ quiz }: QuizPlayerProps) {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{quiz.title}</h1>
          {quiz.description && (
            <p className="text-lg text-gray-600 mb-6">{quiz.description}</p>
          )}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <p className="text-gray-700 whitespace-pre-line">{quiz.intro_text}</p>
          </div>
          <button
            onClick={() => setState('question')}
            className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {currentQuestion.question_text}
          </h2>

          {/* Image */}
          {currentQuestion.image_url && (
            <div className="mb-6 rounded-lg overflow-hidden border-2 border-gray-200">
              <img
                src={currentQuestion.image_url}
                alt="Question"
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Answer Buttons */}
          {!showExplanation ? (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswer('scam')}
                className="bg-red-100 text-red-700 px-6 py-4 rounded-lg text-lg font-semibold hover:bg-red-200 transition border-2 border-red-300"
              >
                🚨 Scam
              </button>
              <button
                onClick={() => handleAnswer('not-scam')}
                className="bg-green-100 text-green-700 px-6 py-4 rounded-lg text-lg font-semibold hover:bg-green-200 transition border-2 border-green-300"
              >
                ✅ Not a Scam
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Result */}
              <div
                className={`p-6 rounded-lg ${
                  isCorrect ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{isCorrect ? '✅' : '❌'}</span>
                  <span className={`text-xl font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-gray-700">{currentQuestion.explanation}</p>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Quiz Complete!</h1>
          <div className="inline-block bg-blue-100 rounded-full px-8 py-4 mb-4">
            <span className="text-5xl font-bold text-blue-600">
              {results.correct}/{results.total}
            </span>
          </div>
          <p className="text-xl text-gray-600">
            You scored {results.percentage}%
          </p>
        </div>

        {/* Tier Result */}
        {results.tier && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8 border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {results.tier.tier_name}
            </h2>
            <p className="text-gray-700 whitespace-pre-line">{results.tier.message}</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleRestart}
            className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Take Quiz Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-100 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-200 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
