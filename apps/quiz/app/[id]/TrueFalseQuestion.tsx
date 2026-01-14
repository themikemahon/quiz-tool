'use client'

import { useState } from 'react'
import type { Question } from '../../../../packages/shared/types'

interface TrueFalseQuestionProps {
  question: Question
  onAnswer: (answer: string) => void
  embedMode?: boolean
  translations: {
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

export default function TrueFalseQuestion({
  question,
  onAnswer,
  embedMode = false,
  translations,
  onNext,
  isLastQuestion
}: TrueFalseQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const handleAnswerClick = (answer: 'true' | 'false') => {
    setSelectedAnswer(answer)
    onAnswer(answer)
    setShowExplanation(true)
  }

  const isCorrect = selectedAnswer === question.correct_answer

  return (
    <div className="transition-opacity duration-500">
      <h2 className={`animate-fadeIn ${embedMode ? "text-xl font-bold text-gray-900 mb-4" : "mb-5"}`}>
        {question.question_text}
      </h2>

      {/* Optional Image */}
      {question.image_url && (
        <div className={embedMode ? "mb-5 rounded-lg overflow-hidden border border-gray-200 relative" : "mb-6 rounded-lg overflow-hidden border border-gray-200 relative"}>
          <img
            src={question.image_url}
            alt="Question"
            className="w-full h-auto animate-fadeIn"
          />
        </div>
      )}

      {/* True/False Buttons */}
      <div className="grid transition-all duration-500 ease-in-out" style={{ gridTemplateRows: showExplanation ? '0fr' : '1fr' }}>
        <div className="overflow-hidden">
          <div 
            className={`transition-opacity duration-300 ${showExplanation ? 'opacity-0' : 'opacity-100'} ${embedMode ? "grid grid-cols-2 gap-3" : "grid grid-cols-2 gap-4"}`}
          >
            <button
              onClick={() => handleAnswerClick('true')}
              className={embedMode 
                ? "px-4 py-3 rounded-lg border-2 border-gray-300 bg-white hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-sm font-bold text-gray-900"
                : "px-6 py-4 rounded-lg border-2 border-gray-300 bg-white hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-lg font-bold text-gray-900"
              }
            >
              ✓ {translations.true}
            </button>
            <button
              onClick={() => handleAnswerClick('false')}
              className={embedMode 
                ? "px-4 py-3 rounded-lg border-2 border-gray-300 bg-white hover:border-red-500 hover:bg-red-50 transition-all duration-200 text-sm font-bold text-gray-900"
                : "px-6 py-4 rounded-lg border-2 border-gray-300 bg-white hover:border-red-500 hover:bg-red-50 transition-all duration-200 text-lg font-bold text-gray-900"
              }
            >
              ✗ {translations.false}
            </button>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="grid transition-all duration-500 ease-in-out delay-100" style={{ gridTemplateRows: showExplanation ? '1fr' : '0fr' }}>
        <div className="overflow-hidden">
          <div 
            className={`transition-opacity duration-300 ${showExplanation ? 'opacity-100 delay-200' : 'opacity-0'} ${embedMode ? "space-y-3" : "space-y-4"}`}
          >
            {/* Result */}
            <div className={embedMode ? (isCorrect ? 'result-card-success-sm' : 'result-card-error-sm') : (isCorrect ? 'result-card-success' : 'result-card-error')}>
              <div className="flex items-center gap-2 mb-3">
                <span className={embedMode ? "text-xl" : "text-2xl"}>
                  {isCorrect ? '✅' : '❌'}
                </span>
                <span className={`font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'} ${embedMode ? 'text-lg' : 'text-xl'}`}>
                  {isCorrect ? translations.correct : translations.incorrect}
                </span>
              </div>
              {question.explanation && (
                <p className={embedMode ? "text-sm text-gray-700 leading-relaxed" : "text-base text-gray-700 leading-relaxed"}>
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
