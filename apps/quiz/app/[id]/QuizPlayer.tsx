'use client'

import { useState } from 'react'
import { getTranslations } from '../../../../packages/shared/translations'

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
  questions: Question[]
  result_tiers: ResultTier[]
}

interface QuizPlayerProps {
  quiz: Quiz
  embedMode?: boolean
  language?: string
}

type QuizState = 'intro' | 'question' | 'result'

export default function QuizPlayer({ quiz, embedMode = false, language }: QuizPlayerProps) {
  const [state, setState] = useState<QuizState>('intro')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showExplanation, setShowExplanation] = useState(false)

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const totalQuestions = quiz.questions.length
  const t = getTranslations(language)

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
        <div className={embedMode ? "w-full card-sm animate-fadeIn" : "max-w-xl w-full card animate-fadeIn"}>
          <h1 className={embedMode ? "text-2xl font-bold text-gray-900 mb-3" : "mb-4"}>
            {quiz.title}
          </h1>
          {quiz.description && (
            <p className={embedMode ? "text-sm text-gray-600 mb-5" : "text-base text-gray-600 mb-6"}>
              {quiz.description}
            </p>
          )}
          <button
            onClick={() => setState('question')}
            className={embedMode ? "w-full btn-primary-sm" : "w-full btn-primary"}
          >
            {t.startQuiz}
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
        <div 
          key={currentQuestionIndex}
          className={embedMode ? "w-full card-sm animate-fadeIn" : "max-w-2xl w-full card animate-fadeIn"}
        >
          {/* Progress */}
          <div className={embedMode ? "mb-5" : "mb-6"}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                {t.question} {currentQuestionIndex + 1} {t.of} {totalQuestions}
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
          <h2 className={embedMode ? "text-xl font-bold text-gray-900 mb-4" : "mb-5"}>
            {currentQuestion.question_text}
          </h2>

          {/* Image */}
          {currentQuestion.image_url && (
            <div className={embedMode ? "mb-5 rounded-lg overflow-hidden border border-gray-200" : "mb-6 rounded-lg overflow-hidden border border-gray-200"}>
              <img
                src={currentQuestion.image_url}
                alt="Question"
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Answer Buttons */}
          {!showExplanation ? (
            <div className={embedMode ? "grid grid-cols-2 gap-3 animate-fadeIn" : "grid grid-cols-2 gap-4 animate-fadeIn"}>
              <button
                onClick={() => handleAnswer('scam')}
                className={embedMode ? "btn-answer-scam-sm" : "btn-answer-scam"}
              >
                🚨 {t.scam}
              </button>
              <button
                onClick={() => handleAnswer('not-scam')}
                className={embedMode ? "btn-answer-safe-sm" : "btn-answer-safe"}
              >
                ✅ {t.notScam}
              </button>
            </div>
          ) : (
            <div className={embedMode ? "space-y-3 animate-fadeIn" : "space-y-4 animate-fadeIn"}>
              {/* Result */}
              <div className={embedMode ? (isCorrect ? 'result-card-success-sm' : 'result-card-error-sm') : (isCorrect ? 'result-card-success' : 'result-card-error')}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={embedMode ? "text-xl" : "text-2xl"}>
                    {isCorrect ? '✅' : '❌'}
                  </span>
                  <span className={`font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'} ${embedMode ? 'text-lg' : 'text-xl'}`}>
                    {isCorrect ? t.correct : t.incorrect}
                  </span>
                </div>
                <p className={embedMode ? "text-sm text-gray-700 leading-relaxed" : "text-base text-gray-700 leading-relaxed"}>
                  {currentQuestion.explanation}
                </p>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className={embedMode ? "w-full btn-primary-sm" : "w-full btn-primary"}
              >
                {currentQuestionIndex < totalQuestions - 1 ? t.nextQuestion : t.seeResults}
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
      <div className={embedMode ? "w-full card-sm animate-fadeIn" : "max-w-xl w-full card animate-fadeIn"}>
        <div className={embedMode ? "text-center mb-6" : "text-center mb-8"}>
          <h1 className={embedMode ? "text-2xl font-bold text-gray-900 mb-4" : "mb-5"}>
            {t.quizComplete}
          </h1>
          <div className={embedMode ? "inline-block bg-blue-100 rounded-full px-6 py-3 mb-3" : "inline-block bg-blue-100 rounded-full px-8 py-4 mb-4"}>
            <span className={embedMode ? "text-3xl font-bold text-blue-600" : "text-4xl font-bold text-blue-600"}>
              {results.correct}/{results.total}
            </span>
          </div>
          <p className={embedMode ? "text-base text-gray-600" : "text-lg text-gray-600"}>
            {t.youScored} {results.percentage}%
          </p>
        </div>

        {/* Tier Result */}
        {results.tier && (
          <div className={embedMode ? "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 mb-6 border-2 border-blue-200" : "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8 border-2 border-blue-200"}>
            <h2 className={embedMode ? "text-xl font-bold text-gray-900 mb-3" : "mb-3"}>
              {results.tier.tier_name}
            </h2>
            <p className={embedMode ? "text-sm text-gray-700 whitespace-pre-line leading-relaxed" : "text-base text-gray-700 whitespace-pre-line leading-relaxed"}>
              {results.tier.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className={embedMode ? "space-y-2" : "space-y-3"}>
          <button
            onClick={handleRestart}
            className={embedMode ? "w-full btn-primary-sm" : "w-full btn-primary"}
          >
            {t.takeQuizAgain}
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className={embedMode ? "w-full btn-secondary-sm" : "w-full btn-secondary"}
          >
            {t.backToHome}
          </button>
        </div>
      </div>
    </div>
  )
}
