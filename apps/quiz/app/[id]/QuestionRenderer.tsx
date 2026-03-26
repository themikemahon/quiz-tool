'use client'

import type { Question, AnswerOption } from '../../../../packages/shared/types'
import MultipleChoiceQuestion from './MultipleChoiceQuestion'
import ComparisonQuestion from './ComparisonQuestion'
import TrueFalseQuestion from './TrueFalseQuestion'

interface QuestionRendererProps {
  question: Question & { options?: AnswerOption[] }
  onAnswer: (answer: string) => void
  embedMode?: boolean
  translations: {
    scam: string
    notScam: string
    true: string
    false: string
    correct: string
    incorrect: string
    nextQuestion: string
    seeResults: string
  }
  onNext: () => void
  isLastQuestion: boolean
}

export default function QuestionRenderer({
  question,
  onAnswer,
  embedMode = false,
  translations,
  onNext,
  isLastQuestion
}: QuestionRendererProps) {
  switch (question.question_type) {
    case 'multiple-choice':
      return (
        <MultipleChoiceQuestion
          question={question}
          onAnswer={onAnswer}
          embedMode={embedMode}
          translations={translations}
          onNext={onNext}
          isLastQuestion={isLastQuestion}
        />
      )

    case 'comparison':
      return (
        <ComparisonQuestion
          question={question}
          onAnswer={onAnswer}
          embedMode={embedMode}
          translations={translations}
          onNext={onNext}
          isLastQuestion={isLastQuestion}
        />
      )

    case 'true-false':
      return (
        <TrueFalseQuestion
          question={question}
          onAnswer={onAnswer}
          embedMode={embedMode}
          translations={translations}
          onNext={onNext}
          isLastQuestion={isLastQuestion}
        />
      )

    case 'scam-detector':
      // Render the original scam-detector question inline
      return (
        <ScamDetectorQuestion
          question={question}
          onAnswer={onAnswer}
          embedMode={embedMode}
          translations={translations}
          onNext={onNext}
          isLastQuestion={isLastQuestion}
        />
      )

    default:
      // Handle unknown question types gracefully
      console.error(`Unknown question type: ${question.question_type}`)
      return (
        <div className="text-center py-8">
          <p className="text-red-600 font-semibold">
            Unable to display this question type
          </p>
          <button
            onClick={onNext}
            className={embedMode ? "mt-4 btn-primary-sm" : "mt-4 btn-primary"}
          >
            {isLastQuestion ? translations.seeResults : translations.nextQuestion}
          </button>
        </div>
      )
  }
}

// Scam Detector Question Component (extracted from original QuizPlayer)
function ScamDetectorQuestion({
  question,
  onAnswer,
  embedMode = false,
  translations,
  onNext,
  isLastQuestion
}: QuestionRendererProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer)
    onAnswer(answer)
    setShowExplanation(true)
  }

  const isCorrect = selectedAnswer === question.correct_answer

  return (
    <div className="flex flex-col min-h-0 h-full">
      <h2 className={`shrink-0 ${embedMode ? "text-xl font-bold mb-4" : "mb-5"}`} style={{ color: 'var(--color-text, #111827)', textWrap: 'balance' }}>
        {question.question_text}
      </h2>

      {/* Image — shrinks when answer is revealed */}
      {question.image_url && (
        <div
          className={`rounded-lg overflow-hidden relative shrink min-h-0 transition-all duration-300 ${showExplanation ? 'mb-3' : 'mb-4'}`}
          style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)', transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
        >
          <img
            src={question.image_url}
            alt="Question"
            className="w-full h-full object-cover"
            decoding="sync"
          />
        </div>
      )}

      {/* Answer Buttons */}
      <div className="grid shrink-0 transition-[grid-template-rows] duration-200" style={{ gridTemplateRows: showExplanation ? '0fr' : '1fr', transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}>
        <div className="overflow-hidden">
          <div
            className={`transition-opacity duration-200 ${showExplanation ? 'opacity-0' : 'opacity-100'} ${embedMode ? "grid grid-cols-2 gap-3" : "grid grid-cols-2 gap-4"}`}
          >
            <button
              onClick={() => handleAnswerClick('scam')}
              className={embedMode ? "btn-answer-scam-sm" : "btn-answer-scam"}
            >
              🚨 {translations.scam}
            </button>
            <button
              onClick={() => handleAnswerClick('not-scam')}
              className={embedMode ? "btn-answer-safe-sm" : "btn-answer-safe"}
            >
              ✅ {translations.notScam}
            </button>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="grid shrink-0 transition-[grid-template-rows] duration-200 delay-75" style={{ gridTemplateRows: showExplanation ? '1fr' : '0fr', transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}>
        <div className="overflow-hidden">
          <div
            className={`transition-opacity duration-200 ${showExplanation ? 'opacity-100 delay-100' : 'opacity-0'} ${embedMode ? "space-y-3" : "space-y-4"}`}
          >
            {/* Result */}
            <div className={embedMode ? (isCorrect ? 'result-card-success-sm' : 'result-card-error-sm') : (isCorrect ? 'result-card-success' : 'result-card-error')}>
              <div className="flex items-center gap-2 mb-3">
                <span className={embedMode ? "text-xl" : "text-2xl"}>
                  {isCorrect ? '✅' : '❌'}
                </span>
                <span
                  className={`font-bold result-label ${embedMode ? 'text-lg' : 'text-xl'}`}
                >
                  {isCorrect ? translations.correct : translations.incorrect}
                </span>
              </div>
              {question.explanation && (
                <p className={embedMode ? "text-sm leading-relaxed" : "text-base leading-relaxed"} style={{ color: 'var(--color-text, #111827)', opacity: 0.8, textWrap: 'pretty' }}>
                  {question.explanation}
                </p>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={onNext}
              className={embedMode ? "w-full btn-primary-sm" : "w-full btn-primary"}
            >
              {isLastQuestion ? translations.seeResults : translations.nextQuestion}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Import useState for ScamDetectorQuestion
import { useState } from 'react'
