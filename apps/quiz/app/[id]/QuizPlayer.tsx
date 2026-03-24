'use client'

import { useState, useEffect } from 'react'
import { getTranslations } from '../../../../packages/shared/translations'
import { applyTheme, applyThemeConfig } from '../../../../packages/shared/themeUtils'
import { BRAND_THEMES, THEME_CONFIGS } from '../../../../packages/shared/themes'
import type { BrandTheme, Question, AnswerOption } from '../../../../packages/shared/types'
import QuestionRenderer from './QuestionRenderer'
import CTAButton from './CTAButton'
import ThemeSwitcher from './ThemeSwitcher'

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
  const [activeTheme, setActiveTheme] = useState('gen')
  const [isExiting, setIsExiting] = useState(false)

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const totalQuestions = quiz.questions.length
  const t = getTranslations(language)

  // Apply brand theme on component mount — default to Gen
  useEffect(() => {
    applyThemeConfig(THEME_CONFIGS.gen)
  }, [])

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: answer })
  }

  const handleNext = () => {
    // Trigger exit animation (collapse + fade), then swap question
    setIsExiting(true)
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        setState('result')
      }
      setIsExiting(false)
    }, 200)
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

  const results = state === 'result' ? calculateResults() : null

  let content: React.ReactNode

  if (state === 'intro') {
    content = (
      <div className={embedMode ? "w-full card-sm animate-fadeIn" : "w-full max-w-2xl card animate-fadeIn"}>
        <h1 className={embedMode ? "text-2xl font-bold mb-3" : "text-3xl md:text-4xl mb-4"} style={{ textWrap: 'balance' }}>
          {quiz.title}
        </h1>
        {quiz.description && (
          <p className={embedMode ? "text-sm mb-5" : "text-lg mb-8"} style={{ color: 'var(--color-text, #111827)', opacity: 0.7, textWrap: 'pretty' }}>
            {quiz.description}
          </p>
        )}
        <button
          onClick={() => setState('question')}
          className={embedMode ? "w-full btn-primary-sm" : "w-full btn-primary text-lg py-4"}
        >
          {t.startQuiz}
        </button>
      </div>
    )
  } else if (state === 'question') {
    content = (
      <div className={embedMode ? "w-full card-sm transition-[grid-template-rows] duration-200" : "w-full max-w-3xl card transition-[grid-template-rows] duration-200"} style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}>
        {/* Progress */}
        <div className={embedMode ? "mb-5" : "mb-8"}>
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

        {/* Question Renderer — grid collapse/expand mirrors the answer reveal animation */}
        <div
          className="grid transition-[grid-template-rows] duration-200"
          style={{ gridTemplateRows: isExiting ? '0fr' : '1fr', transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
        >
          <div className="overflow-hidden">
            <div className={`transition-opacity duration-200 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
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
        </div>
      </div>
    )
  } else {
    content = (
      <div className={embedMode ? "w-full card-sm animate-fadeIn" : "w-full max-w-2xl card animate-fadeIn"}>
        <div className={embedMode ? "text-center mb-6 animate-fadeIn" : "text-center mb-10 animate-fadeIn"} style={{ animationDelay: '0ms' }}>
          <h1 className={embedMode ? "text-2xl font-bold mb-4" : "text-3xl md:text-4xl mb-6"} style={{ textWrap: 'balance' }}>
            {t.quizComplete}
          </h1>
          <div className={embedMode ? "inline-block score-badge-sm mb-3" : "inline-block score-badge mb-5"}>
            <span className={embedMode ? "text-3xl score-text tabular-nums" : "text-5xl score-text tabular-nums"}>
              {results!.correct}/{results!.total}
            </span>
          </div>
          <p className={embedMode ? "text-base tabular-nums" : "text-xl tabular-nums"} style={{ color: 'var(--color-text, #111827)', opacity: 0.7 }}>
            {t.youScored} {results!.percentage}%
          </p>
        </div>

        {/* Tier Result */}
        {results!.tier && (
          <div className={embedMode
            ? "tier-result rounded-lg p-5 mb-6 text-center flex flex-col items-center justify-center animate-fadeIn"
            : "tier-result rounded-xl p-8 mb-10 text-center flex flex-col items-center justify-center animate-fadeIn"
          } style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary, #3B82F6) 8%, white)', border: '2px solid color-mix(in srgb, var(--color-primary, #3B82F6) 20%, transparent)', animationDelay: '100ms', animationFillMode: 'backwards' }}>
            <h2 className={embedMode ? "text-xl font-bold mb-3" : "text-2xl md:text-3xl mb-4"}>
              {results!.tier.tier_name}
            </h2>
            <p className={embedMode ? "text-sm whitespace-pre-line leading-relaxed" : "text-base md:text-lg whitespace-pre-line leading-relaxed"} style={{ color: 'var(--color-text, #111827)', opacity: 0.8, textWrap: 'pretty' }}>
              {results!.tier.message}
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
        <div className={embedMode ? "space-y-2 animate-fadeIn" : "space-y-3 animate-fadeIn"} style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
          <button
            onClick={handleRestart}
            className={embedMode ? "w-full btn-primary-sm" : "w-full btn-primary text-lg py-4"}
          >
            {t.takeQuizAgain}
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className={embedMode ? "w-full btn-secondary-sm" : "w-full btn-secondary text-lg py-4"}
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
        : "min-h-screen flex flex-col items-center justify-center p-4 md:p-8 transition-[background-color] duration-300"
      }
      style={!embedMode ? { backgroundColor: 'color-mix(in srgb, var(--color-primary, #3D3BF6) 12%, white)' } : undefined}
    >
      {/* Theme Switcher */}
      {!embedMode && (
        <div className="fixed top-4 right-4 z-50 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
          <ThemeSwitcher activeTheme={activeTheme} onThemeChange={setActiveTheme} />
        </div>
      )}
      {content}
    </div>
  )
}
