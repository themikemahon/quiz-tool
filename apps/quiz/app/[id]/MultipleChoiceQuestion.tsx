'use client'

import { useState } from 'react'
import type { Question, AnswerOption } from '../../../../packages/shared/types'

interface MultipleChoiceQuestionProps {
  question: Question & { options?: AnswerOption[] }
  onAnswer: (answer: string) => void
  embedMode?: boolean
  translations: {
    correct: string
    incorrect: string
    nextQuestion: string
    seeResults: string
  }
  onNext: () => void
  isLastQuestion: boolean
}

export default function MultipleChoiceQuestion({
  question,
  onAnswer,
  embedMode = false,
  translations,
  onNext,
  isLastQuestion
}: MultipleChoiceQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  // Sort options by order_index
  const sortedOptions = question.options?.sort((a, b) => a.order_index - b.order_index) || []

  const handleAnswerClick = (optionId: string) => {
    setSelectedAnswer(optionId)
    // Use is_correct on the option directly, since correct_answer stores
    // an index but option IDs are database-generated
    const clickedOption = sortedOptions.find(o => o.id.toString() === optionId)
    const answerValue = clickedOption?.is_correct ? question.correct_answer : '__wrong__'
    onAnswer(answerValue)
    setShowExplanation(true)
  }

  const selectedOption = selectedAnswer ? sortedOptions.find(o => o.id.toString() === selectedAnswer) : null
  const isCorrect = selectedOption?.is_correct ?? false

  return (
    <div className="transition-opacity duration-200">
      <h2 className={`animate-fadeIn ${embedMode ? "text-xl font-bold mb-4" : "mb-5"}`} style={{ color: 'var(--color-text, #111827)', textWrap: 'balance' }}>
        {question.question_text}
      </h2>

      {/* Optional Image */}
      {question.image_url && (
        <div className={embedMode ? "mb-5 rounded-lg overflow-hidden relative" : "mb-6 rounded-lg overflow-hidden relative"} style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)' }}>
          <img
            src={question.image_url}
            alt="Question"
            className="w-full h-auto animate-fadeIn"
          />
        </div>
      )}

      {/* Answer Options */}
      <div className="grid transition-[grid-template-rows] duration-200" style={{ gridTemplateRows: showExplanation ? '0fr' : '1fr', transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}>
        <div className="overflow-hidden">
          <div
            className={`transition-opacity duration-200 ${showExplanation ? 'opacity-0' : 'opacity-100'} ${embedMode ? "space-y-2" : "space-y-3"}`}
          >
            {sortedOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswerClick(option.id.toString())}
                className={embedMode ? "btn-answer-option-sm" : "btn-answer-option"}
              >
                {option.option_text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="grid transition-[grid-template-rows] duration-200 delay-75" style={{ gridTemplateRows: showExplanation ? '1fr' : '0fr', transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}>
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
                  className={`font-bold ${embedMode ? 'text-lg' : 'text-xl'}`}
                  style={{ color: isCorrect ? 'var(--color-primary, #3B82F6)' : 'var(--color-text, #111827)' }}
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
