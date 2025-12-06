'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Question {
  question_text: string
  image_url: string
  correct_answer: 'scam' | 'not-scam'
  explanation: string
}

export default function QuizForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [introText, setIntroText] = useState('')
  const [summaryText, setSummaryText] = useState('')
  const [tipsText, setTipsText] = useState('')
  
  const [questions, setQuestions] = useState<Question[]>([
    { question_text: '', image_url: '', correct_answer: 'scam', explanation: '' },
    { question_text: '', image_url: '', correct_answer: 'scam', explanation: '' },
    { question_text: '', image_url: '', correct_answer: 'scam', explanation: '' },
  ])

  const updateQuestion = (index: number, field: keyof Question, value: string) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published') => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create quiz
      const quizRes = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          intro_text: introText,
          summary_text: summaryText,
          tips_text: tipsText,
          template_type: 'scam-detector',
          status,
        }),
      })

      if (!quizRes.ok) throw new Error('Failed to create quiz')
      
      const quiz = await quizRes.json()

      // Create questions
      for (let i = 0; i < questions.length; i++) {
        await fetch('/api/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quiz_id: quiz.id,
            order_index: i,
            ...questions[i],
          }),
        })
      }

      router.push('/quizzes')
    } catch (error) {
      console.error('Error creating quiz:', error)
      alert('Failed to create quiz')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-8">
      {/* Quiz Details */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Quiz Details</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quiz Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Can You Spot the Scam?"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            placeholder="A quick quiz to test your scam detection skills"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Intro Text *
          </label>
          <textarea
            value={introText}
            onChange={(e) => setIntroText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Welcome! You'll see 3 images. Decide if each one is a scam or not."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Summary Text *
          </label>
          <textarea
            value={summaryText}
            onChange={(e) => setSummaryText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Great job! Here's how you did..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tips Text *
          </label>
          <textarea
            value={tipsText}
            onChange={(e) => setTipsText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Tips to improve: Always check the sender's email, look for spelling errors..."
            required
          />
        </div>
      </div>

      {/* Questions */}
      {questions.map((q, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Question {index + 1}
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL *
            </label>
            <input
              type="url"
              value={q.image_url}
              onChange={(e) => updateQuestion(index, 'image_url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question Text *
            </label>
            <input
              type="text"
              value={q.question_text}
              onChange={(e) => updateQuestion(index, 'question_text', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Is this a scam?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correct Answer *
            </label>
            <select
              value={q.correct_answer}
              onChange={(e) => updateQuestion(index, 'correct_answer', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="scam">Scam</option>
              <option value="not-scam">Not a Scam</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Explanation *
            </label>
            <textarea
              value={q.explanation}
              onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="This is a scam because..."
              required
            />
          </div>
        </div>
      ))}

      {/* Actions */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={(e) => handleSubmit(e, 'draft')}
          disabled={loading}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save as Draft'}
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e, 'published')}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Publishing...' : 'Publish Quiz'}
        </button>
      </div>
    </form>
  )
}
