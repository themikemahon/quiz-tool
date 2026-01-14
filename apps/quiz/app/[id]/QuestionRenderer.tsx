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
    <div className="transition-opacity duration-500">
      <h2 className={`animate-fadeIn ${embedMode ? "text-xl font-bold text-gray-900 mb-4" : "mb-5"}`}>
        {question.question_text}
      </h2>

      {/* Image */}
      {question.image_url && (
        <div className={embedMode ? "mb-5 rounded-lg overflow-hidden border border-gray-200 relative" : "mb-6 rounded-lg overflow-hidden border border-gray-200 relative"}>
          <img
            src={question.image_url}
            alt="Question"
            className="w-full h-auto animate-fadeIn"
          />
        </div>
      )}

      {/* Answer Buttons */}
      <div className="grid transition-all duration-500 ease-in-out" style={{ gridTemplateRows: showExplanation ? '0fr' : '1fr' }}>
        <div className="overflow-hidden">
          <div 
            className={`transition-opacity duration-300 ${showExplanation ? 'opacity-0' : 'opacity-100'} ${embedMode ? "grid grid-cols-2 gap-3" : "grid grid-cols-2 gap-4"}`}
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

// Import useState for ScamDetectorQuestion
import { useState } from 'react'
