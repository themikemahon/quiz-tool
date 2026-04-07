'use client'

import { useState, useEffect } from 'react'
import { getTranslations } from '../../../../packages/shared/translations'
import { applyTheme, applyThemeConfig } from '../../../../packages/shared/themeUtils'
import { THEME_CONFIGS } from '../../../../packages/shared/themes'
import type { Question, AnswerOption, BrandTheme } from '../../../../packages/shared/types'
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
  const [isExiting, setIsExiting] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const totalQuestions = quiz.questions.length
  const t = getTranslations(language)

  // Apply brand theme on component mount — default to Norton
  useEffect(() => {
    applyThemeConfig(THEME_CONFIGS.norton)
  }, [])

  // Preload all question images so they display instantly
  useEffect(() => {
    const urls = quiz.questions.flatMap((q) =>
      [q.image_url, (q as any).image_url_2].filter(Boolean)
    )
    urls.forEach((url) => {
      const img = new Image()
      img.src = url as string
    })
  }, [quiz.questions])

  // Fade out → change state → fade in
  const transitionTo = (newState: QuizState) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setState(newState)
      // Small delay before fading back in so new content renders first
      requestAnimationFrame(() => setIsTransitioning(false))
    }, 200)
  }

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: answer })
  }

  const handleNext = () => {
    // Exit: fast ease-in fade out → swap content while invisible → enter: ease-out fade in
    setIsExiting(true)
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        // Let browser render + layout + decode images before fading in
        setTimeout(() => setIsExiting(false), 60)
      } else {
        setIsExiting(false)
        transitionTo('result')
      }
    }, 150)
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
    setIsTransitioning(true)
    setTimeout(() => {
      setAnswers({})
      setCurrentQuestionIndex(0)
      setState('intro')
      requestAnimationFrame(() => setIsTransitioning(false))
    }, 200)
  }

  const results = state === 'result' ? calculateResults() : null

  let content: React.ReactNode

  if (state === 'intro') {
    content = (
      <div className={embedMode ? "w-full card-sm animate-fadeIn" : "w-full max-w-2xl card animate-fadeIn"} style={{ maxHeight: embedMode ? undefined : 'calc(100vh - 2.5rem)' }}>
        <h1 className={embedMode ? "text-2xl font-bold mb-3" : "text-2xl md:text-3xl mb-3"} style={{ textWrap: 'balance' }}>
          {quiz.title}
        </h1>
        {quiz.description && (
          <p className={embedMode ? "text-sm mb-5" : "text-base mb-5"} style={{ color: 'var(--color-text, #111827)', opacity: 0.7, textWrap: 'pretty' }}>
            {quiz.description}
          </p>
        )}
        <button
          onClick={() => transitionTo('question')}
          className={embedMode ? "w-full btn-primary-sm" : "w-full btn-primary"}
        >
          {t.startQuiz}
        </button>
      </div>
    )
  } else if (state === 'question') {
    content = (
      <div className={embedMode ? "w-full card-sm flex flex-col" : "w-full max-w-2xl card flex flex-col"} style={{ maxHeight: embedMode ? undefined : 'calc(100vh - 2.5rem)' }}>
        {/* Progress */}
        <div className={`shrink-0 ${embedMode ? "mb-5" : "mb-6"}`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium tabular-nums" style={{ color: 'var(--color-text, #111827)', opacity: 0.6 }}>
              {t.question} {currentQuestionIndex + 1} {t.of} {totalQuestions}
            </span>
            <span className="text-sm font-medium tabular-nums" style={{ color: 'var(--color-text, #111827)', opacity: 0.6 }}>
              {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="progress-bar h-2.5"
              style={{
                width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question Renderer */}
        <div
          className={`min-h-0 flex-1 transition-opacity duration-150 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
          style={{ transitionTimingFunction: isExiting ? 'cubic-bezier(0.4, 0, 1, 1)' : 'cubic-bezier(0, 0, 0.2, 1)', willChange: 'opacity' }}
        >
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
  } else {
    content = (
      <div className={embedMode ? "w-full card-sm flex flex-col animate-fadeIn" : "w-full max-w-2xl card flex flex-col animate-fadeIn"} style={{ maxHeight: embedMode ? undefined : 'calc(100vh - 2.5rem)' }}>
        <div className={`shrink-0 ${embedMode ? "text-center mb-6" : "text-center mb-6"}`}>
          <h1 className={embedMode ? "text-2xl font-bold mb-4" : "text-2xl md:text-3xl mb-3"} style={{ textWrap: 'balance' }}>
            {t.quizComplete}
          </h1>
          <div className={embedMode ? "inline-block score-badge-sm mb-3" : "inline-block score-badge mb-3"}>
            <span className={embedMode ? "text-3xl score-text tabular-nums" : "text-4xl score-text tabular-nums"}>
              {results!.correct}/{results!.total}
            </span>
          </div>
          <p className={embedMode ? "text-base tabular-nums" : "text-xl tabular-nums"} style={{ color: 'var(--color-text, #111827)', opacity: 0.7 }}>
            {t.youScored} {results!.percentage}%
          </p>
        </div>

        {/* Tier Result — flexible element that shrinks on small viewports */}
        {results!.tier && (
          <div className={embedMode
            ? "tier-result rounded-lg p-5 mb-4 text-center flex flex-col items-center justify-center shrink min-h-0 overflow-hidden"
            : "tier-result rounded-xl p-6 mb-6 text-center flex flex-col items-center justify-center shrink min-h-0 overflow-hidden"
          }>
            <h2 className={embedMode ? "text-xl font-bold mb-3 shrink-0" : "text-xl md:text-2xl mb-3 shrink-0"}>
              {results!.tier.tier_name}
            </h2>
            <p className={embedMode ? "text-sm whitespace-pre-line leading-relaxed" : "text-base md:text-lg whitespace-pre-line leading-relaxed"} style={{ color: 'var(--color-text, #111827)', opacity: 0.8, textWrap: 'pretty' }}>
              {results!.tier.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className={`shrink-0 ${embedMode ? "space-y-2" : "space-y-3"}`}>
          {quiz.cta_enabled && quiz.cta_url && (
            <CTAButton
              ctaText={quiz.cta_text}
              ctaTextFr={quiz.cta_text_fr}
              ctaTextDe={quiz.cta_text_de}
              ctaUrl={quiz.cta_url}
              ctaMobileUrl={quiz.cta_mobile_url}
              language={language}
              embedMode={embedMode}
            />
          )}
          <button
            onClick={handleRestart}
            className={embedMode ? "w-full btn-secondary-sm" : "w-full btn-secondary"}
          >
            {t.takeQuizAgain}
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full text-center py-2 font-medium text-sm transition-opacity duration-150 hover:opacity-70"
            style={{ color: 'var(--color-text, #111827)', opacity: 0.6 }}
          >
            {t.backToHome}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={embedMode
        ? "w-full"
        : "h-screen flex flex-col items-center justify-center py-4 px-4 md:py-5 md:px-6 transition-[background-color] duration-300"
      }
      style={!embedMode ? { backgroundColor: 'var(--color-background, #F3F4F6)' } : undefined}
    >
      <div
        className={`transition-[opacity,transform] duration-200 ${isTransitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)', width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        {content}
      </div>
    </div>
  )
}
