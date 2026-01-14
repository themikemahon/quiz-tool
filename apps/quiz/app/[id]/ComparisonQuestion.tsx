'use client'

import { useState } from 'react'
import type { Question } from '../../../../packages/shared/types'

interface ComparisonQuestionProps {
  question: Question
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

export default function ComparisonQuestion({
  question,
  onAnswer,
  embedMode = false,
  translations,
  onNext,
  isLastQuestion
}: ComparisonQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const handleImageClick = (imageNumber: 'image-1' | 'image-2') => {
    setSelectedAnswer(imageNumber)
    onAnswer(imageNumber)
    setShowExplanation(true)
  }

  const isCorrect = selectedAnswer === question.correct_answer

  return (
    <div className="transition-opacity duration-500">
      <h2 className={`animate-fadeIn ${embedMode ? "text-xl font-bold text-gray-900 mb-4" : "mb-5"}`}>
        {question.question_text}
      </h2>

      {/* Images Side-by-Side */}
      <div className="grid transition-all duration-500 ease-in-out" style={{ gridTemplateRows: showExplanation ? '0fr' : '1fr' }}>
        <div className="overflow-hidden">
          <div 
            className={`transition-opacity duration-300 ${showExplanation ? 'opacity-0' : 'opacity-100'} ${embedMode ? "grid grid-cols-2 gap-3 mb-5" : "grid grid-cols-2 gap-4 mb-6"}`}
          >
            {/* Image 1 */}
            <button
              onClick={() => handleImageClick('image-1')}
              className="group relative rounded-lg overflow-hidden border-2 border-gray-300 hover:border-blue-500 transition-all duration-200 bg-white"
            >
              {question.image_url && (
                <img
                  src={question.image_url}
                  alt="Option 1"
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-200"
                />
              )}
              <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
            </button>

            {/* Image 2 */}
            <button
              onClick={() => handleImageClick('image-2')}
              className="group relative rounded-lg overflow-hidden border-2 border-gray-300 hover:border-blue-500 transition-all duration-200 bg-white"
            >
              {question.image_url_2 && (
                <img
                  src={question.image_url_2}
                  alt="Option 2"
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-200"
                />
              )}
              <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
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
