'use client'

import { useState, useEffect } from 'react'
import { getTranslations } from '../../../../packages/shared/translations'
import { applyTheme } from '../../../../packages/shared/themeUtils'
import { BRAND_THEMES } from '../../../../packages/shared/themes'
import type { BrandTheme, Question, AnswerOption } from '../../../../packages/shared/types'
import QuestionRenderer from './QuestionRenderer'
import CTAButton from './CTAButton'

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
  questions: (Question & { options?: AnswerOption[] })[]
  result_tiers: ResultTier[]
  brandTheme?: BrandTheme | null
  cta_enabled?: boolean
  cta_text?: string
  cta_text_fr?: string
  cta_text_de?: string
  cta_url?: string
  cta_mobile_url?: string
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

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const totalQuestions = quiz.questions.length
  const t = getTranslations(language)

  // Apply brand theme on component mount
  useEffect(() => {
    // If quiz has a brand theme, apply it
    if (quiz.brandTheme) {
      applyTheme(quiz.brandTheme)
    } else {
      // Fall back to default theme
      applyTheme(BRAND_THEMES.default)
    }
  }, [quiz.brandTheme])

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: answer })
  }

  const handleNext = () => {
    // Wait for fade out animation before changing question
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        setState('result')
      }
    }, 400)
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
    setState('intro')
  }

  // Intro Screen
  if (state === 'intro') {
    return (
      <div className={embedMode 
        ? "w-full" 
        : "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
      }>
        <div className={embedMode ? "w-full card-sm animate-fadeIn" : "max-w-xl w-full card animate-fadeIn"} style={{ zoom: 0.85 }}>
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
    return (
      <div className={embedMode 
        ? "w-full" 
        : "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
      }>
        <div className={embedMode ? "w-full card-sm transition-all duration-500 ease-in-out" : "max-w-2xl w-full card transition-all duration-500 ease-in-out"} style={{ zoom: 0.85 }}>
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
                className="progress-bar"
                style={{
                  width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question Renderer */}
          <QuestionRenderer
            key={currentQuestion.id}
            question={currentQuestion}
            onAnswer={handleAnswer}
            embedMode={embedMode}
            translations={t}
            onNext={handleNext}
            isLastQuestion={currentQuestionIndex >= totalQuestions - 1}
          />
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
      <div className={embedMode ? "w-full card-sm animate-fadeIn" : "max-w-xl w-full card animate-fadeIn"} style={{ zoom: 0.85 }}>
        <div className={embedMode ? "text-center mb-6" : "text-center mb-8"}>
          <h1 className={embedMode ? "text-2xl font-bold text-gray-900 mb-4" : "mb-5"}>
            {t.quizComplete}
          </h1>
          <div className={embedMode ? "inline-block score-badge-sm mb-3" : "inline-block score-badge mb-4"}>
            <span className={embedMode ? "text-3xl score-text" : "text-4xl score-text"}>
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

        {/* CTA Button */}
        {quiz.cta_enabled && quiz.cta_url && (
          <div className={embedMode ? "mb-4" : "mb-6"}>
            <CTAButton
              ctaText={quiz.cta_text}
              ctaTextFr={quiz.cta_text_fr}
              ctaTextDe={quiz.cta_text_de}
              ctaUrl={quiz.cta_url}
              ctaMobileUrl={quiz.cta_mobile_url}
              language={language}
              embedMode={embedMode}
            />
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
