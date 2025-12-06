'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Question {
  question_text: string
  image_url: string
  correct_answer: 'scam' | 'not-scam'
  explanation: string
}

interface ResultTier {
  tier_name: string
  min_percentage: number
  max_percentage: number
  message: string
}

export default function QuizForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [introText, setIntroText] = useState('')
  
  const [questions, setQuestions] = useState<Question[]>([
    { question_text: '', image_url: '', correct_answer: 'scam', explanation: '' },
    { question_text: '', image_url: '', correct_answer: 'scam', explanation: '' },
    { question_text: '', image_url: '', correct_answer: 'scam', explanation: '' },
  ])

  const [resultTiers, setResultTiers] = useState<ResultTier[]>([
    { tier_name: 'Novice', min_percentage: 0, max_percentage: 33, message: '' },
    { tier_name: 'Competent', min_percentage: 34, max_percentage: 66, message: '' },
    { tier_name: 'Expert', min_percentage: 67, max_percentage: 100, message: '' },
  ])

  const updateQuestion = (index: number, field: keyof Question, value: string) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const addQuestion = () => {
    setQuestions([...questions, { question_text: '', image_url: '', correct_answer: 'scam', explanation: '' }])
  }

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) {
      alert('You must have at least one question')
      return
    }
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const updateResultTier = (index: number, field: keyof ResultTier, value: string | number) => {
    const updated = [...resultTiers]
    updated[index] = { ...updated[index], [field]: value }
    setResultTiers(updated)
  }

  const handleImageUpload = async (index: number, file: File) => {
    setUploading(index)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (!res.ok) throw new Error('Upload failed')
      
      const { url } = await res.json()
      updateQuestion(index, 'image_url', url)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(null)
    }
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

      // Create result tiers
      for (let i = 0; i < resultTiers.length; i++) {
        await fetch('/api/result-tiers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quiz_id: quiz.id,
            order_index: i,
            ...resultTiers[i],
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

      </div>

      {/* Result Tiers */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Result Tiers</h2>
        <p className="text-sm text-gray-600">
          Define messages for different performance levels. Percentages are calculated automatically based on correct answers.
        </p>

        {resultTiers.map((tier, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tier Name *
                </label>
                <input
                  type="text"
                  value={tier.tier_name}
                  onChange={(e) => updateResultTier(index, 'tier_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Novice"
                  required
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min %
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={tier.min_percentage}
                  onChange={(e) => updateResultTier(index, 'min_percentage', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max %
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={tier.max_percentage}
                  onChange={(e) => updateResultTier(index, 'max_percentage', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                value={tier.message}
                onChange={(e) => updateResultTier(index, 'message', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="You're just getting started! Here are some tips..."
                required
              />
            </div>
          </div>
        ))}
      </div>

      {/* Questions */}
      {questions.map((q, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Question {index + 1}
            </h2>
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Remove Question
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image *
            </label>
            <div className="space-y-2">
              <input
                type="url"
                value={q.image_url}
                onChange={(e) => updateQuestion(index, 'image_url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg or upload below"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">or</span>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(index, file)
                    }}
                    className="hidden"
                    disabled={uploading === index}
                  />
                  <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                    {uploading === index ? 'Uploading...' : 'Upload Image'}
                  </span>
                </label>
              </div>
              {q.image_url && (
                <img src={q.image_url} alt="Preview" className="mt-2 max-w-xs rounded-lg border" />
              )}
            </div>
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

      {/* Add Question Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={addQuestion}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          + Add Another Question
        </button>
      </div>

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
