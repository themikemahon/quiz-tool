'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Question {
  id?: number
  question_text: string
  image_url: string
  correct_answer: 'scam' | 'not-scam'
  explanation: string
}

interface ResultTier {
  id?: number
  tier_name: string
  min_percentage: number
  max_percentage: number
  message: string
}

interface QuizFormProps {
  mode: 'create' | 'edit'
  initialData?: {
    id: number
    title: string
    description: string
    status: string
    questions: any[]
    result_tiers: any[]
  }
}

type Language = 'en' | 'fr' | 'de'

interface LanguageData {
  title: string
  description: string
  questions: Question[]
  resultTiers: ResultTier[]
}

export default function QuizForm({ mode, initialData }: QuizFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState<number | null>(null)
  const [activeLanguage, setActiveLanguage] = useState<Language>('en')
  const [translating, setTranslating] = useState(false)
  
  // Initialize language data
  const defaultQuestions: Question[] = [
    { question_text: '', image_url: '', correct_answer: 'scam', explanation: '' },
    { question_text: '', image_url: '', correct_answer: 'scam', explanation: '' },
    { question_text: '', image_url: '', correct_answer: 'scam', explanation: '' },
  ]
  
  const defaultTiers: ResultTier[] = [
    { tier_name: 'Novice', min_percentage: 0, max_percentage: 33, message: '' },
    { tier_name: 'Competent', min_percentage: 34, max_percentage: 66, message: '' },
    { tier_name: 'Expert', min_percentage: 67, max_percentage: 100, message: '' },
  ]
  
  const [languageData, setLanguageData] = useState<Record<Language, LanguageData>>({
    en: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      questions: initialData?.questions.map(q => ({
        id: q.id,
        question_text: q.question_text,
        image_url: q.image_url || '',
        correct_answer: q.correct_answer,
        explanation: q.explanation || '',
      })) || defaultQuestions,
      resultTiers: initialData?.result_tiers.map(t => ({
        id: t.id,
        tier_name: t.tier_name,
        min_percentage: t.min_percentage,
        max_percentage: t.max_percentage,
        message: t.message,
      })) || defaultTiers,
    },
    fr: {
      title: (initialData as any)?.title_fr || '',
      description: (initialData as any)?.description_fr || '',
      questions: initialData?.questions.map(q => ({
        id: q.id,
        question_text: (q as any).question_text_fr || '',
        image_url: q.image_url || '',
        correct_answer: q.correct_answer,
        explanation: (q as any).explanation_fr || '',
      })) || [],
      resultTiers: initialData?.result_tiers.map(t => ({
        id: t.id,
        tier_name: (t as any).tier_name_fr || '',
        min_percentage: t.min_percentage,
        max_percentage: t.max_percentage,
        message: (t as any).message_fr || '',
      })) || [],
    },
    de: {
      title: (initialData as any)?.title_de || '',
      description: (initialData as any)?.description_de || '',
      questions: initialData?.questions.map(q => ({
        id: q.id,
        question_text: (q as any).question_text_de || '',
        image_url: q.image_url || '',
        correct_answer: q.correct_answer,
        explanation: (q as any).explanation_de || '',
      })) || [],
      resultTiers: initialData?.result_tiers.map(t => ({
        id: t.id,
        tier_name: (t as any).tier_name_de || '',
        min_percentage: t.min_percentage,
        max_percentage: t.max_percentage,
        message: (t as any).message_de || '',
      })) || [],
    },
  })
  
  // Get current language data
  const currentData = languageData[activeLanguage]
  const title = currentData.title
  const description = currentData.description
  const questions = currentData.questions
  const resultTiers = currentData.resultTiers
  
  // Update functions that work with current language
  const setTitle = (value: string) => {
    setLanguageData(prev => ({
      ...prev,
      [activeLanguage]: { ...prev[activeLanguage], title: value }
    }))
  }
  
  const setDescription = (value: string) => {
    setLanguageData(prev => ({
      ...prev,
      [activeLanguage]: { ...prev[activeLanguage], description: value }
    }))
  }
  
  const setQuestions = (value: Question[]) => {
    setLanguageData(prev => ({
      ...prev,
      [activeLanguage]: { ...prev[activeLanguage], questions: value }
    }))
  }
  
  const setResultTiers = (value: ResultTier[]) => {
    setLanguageData(prev => ({
      ...prev,
      [activeLanguage]: { ...prev[activeLanguage], resultTiers: value }
    }))
  }

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
  
  const translateText = async (text: string, targetLang: Language): Promise<string> => {
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLanguage: targetLang }),
      })
      
      if (!res.ok) throw new Error('Translation failed')
      
      const data = await res.json()
      return data.translatedText
    } catch (error) {
      console.error('Translation error:', error)
      return text // Return original if translation fails
    }
  }
  
  const handleAutofillTranslation = async () => {
    if (activeLanguage === 'en') return
    
    setTranslating(true)
    
    try {
      const englishData = languageData.en
      
      // Translate basic fields (only if they have content)
      const translatedTitle = englishData.title ? await translateText(englishData.title, activeLanguage) : ''
      const translatedDescription = englishData.description ? await translateText(englishData.description, activeLanguage) : ''
      
      // Translate questions
      const translatedQuestions: Question[] = []
      for (const q of englishData.questions) {
        const translatedQuestion = q.question_text ? await translateText(q.question_text, activeLanguage) : ''
        const translatedExplanation = q.explanation ? await translateText(q.explanation, activeLanguage) : ''
        translatedQuestions.push({
          ...q,
          question_text: translatedQuestion,
          explanation: translatedExplanation,
          // Keep image_url and correct_answer the same
        })
      }
      
      // Translate result tiers
      const translatedTiers: ResultTier[] = []
      for (const tier of englishData.resultTiers) {
        const translatedName = tier.tier_name ? await translateText(tier.tier_name, activeLanguage) : ''
        const translatedMessage = tier.message ? await translateText(tier.message, activeLanguage) : ''
        translatedTiers.push({
          ...tier,
          tier_name: translatedName,
          message: translatedMessage,
        })
      }
      
      // Update the language data
      setLanguageData(prev => ({
        ...prev,
        [activeLanguage]: {
          title: translatedTitle,
          description: translatedDescription,
          questions: translatedQuestions,
          resultTiers: translatedTiers,
        }
      }))
    } catch (error) {
      console.error('Autofill translation error:', error)
      alert('Translation failed. Please try again.')
    } finally {
      setTranslating(false)
    }
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
      const enData = languageData.en
      const frData = languageData.fr
      const deData = languageData.de

      if (mode === 'create') {
        // Create new quiz with all translations
        const quizRes = await fetch('/api/quizzes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: enData.title,
            description: enData.description,
            title_fr: frData.title || null,
            title_de: deData.title || null,
            description_fr: frData.description || null,
            description_de: deData.description || null,
            template_type: 'scam-detector',
            status,
          }),
        })

        if (!quizRes.ok) {
          const error = await quizRes.json()
          throw new Error(`Failed to create quiz: ${error.error || 'Unknown error'}`)
        }
        const quiz = await quizRes.json()

        // Create questions with translations
        for (let i = 0; i < enData.questions.length; i++) {
          const questionRes = await fetch('/api/questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              quiz_id: quiz.id,
              order_index: i,
              question_text: enData.questions[i].question_text,
              image_url: enData.questions[i].image_url,
              correct_answer: enData.questions[i].correct_answer,
              explanation: enData.questions[i].explanation,
              question_text_fr: frData.questions[i]?.question_text || null,
              question_text_de: deData.questions[i]?.question_text || null,
              explanation_fr: frData.questions[i]?.explanation || null,
              explanation_de: deData.questions[i]?.explanation || null,
            }),
          })
          if (!questionRes.ok) throw new Error(`Failed to create question ${i + 1}`)
        }

        // Create result tiers with translations
        for (let i = 0; i < enData.resultTiers.length; i++) {
          const tierRes = await fetch('/api/result-tiers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              quiz_id: quiz.id,
              order_index: i,
              tier_name: enData.resultTiers[i].tier_name,
              min_percentage: enData.resultTiers[i].min_percentage,
              max_percentage: enData.resultTiers[i].max_percentage,
              message: enData.resultTiers[i].message,
              tier_name_fr: frData.resultTiers[i]?.tier_name || null,
              tier_name_de: deData.resultTiers[i]?.tier_name || null,
              message_fr: frData.resultTiers[i]?.message || null,
              message_de: deData.resultTiers[i]?.message || null,
            }),
          })
          if (!tierRes.ok) throw new Error(`Failed to create result tier ${i + 1}`)
        }
      } else {
        // Update existing quiz
        const updateRes = await fetch(`/api/quizzes/${initialData!.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: enData.title,
            description: enData.description,
            title_fr: frData.title || null,
            title_de: deData.title || null,
            description_fr: frData.description || null,
            description_de: deData.description || null,
            status,
          }),
        })

        if (!updateRes.ok) {
          const error = await updateRes.json()
          throw new Error(`Failed to update quiz: ${error.error || 'Unknown error'}`)
        }

        // Delete and recreate questions and tiers with translations
        await fetch(`/api/quizzes/${initialData!.id}/questions`, { method: 'DELETE' })
        await fetch(`/api/quizzes/${initialData!.id}/result-tiers`, { method: 'DELETE' })

        for (let i = 0; i < enData.questions.length; i++) {
          await fetch('/api/questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              quiz_id: initialData!.id,
              order_index: i,
              question_text: enData.questions[i].question_text,
              image_url: enData.questions[i].image_url,
              correct_answer: enData.questions[i].correct_answer,
              explanation: enData.questions[i].explanation,
              question_text_fr: frData.questions[i]?.question_text || null,
              question_text_de: deData.questions[i]?.question_text || null,
              explanation_fr: frData.questions[i]?.explanation || null,
              explanation_de: deData.questions[i]?.explanation || null,
            }),
          })
        }

        for (let i = 0; i < enData.resultTiers.length; i++) {
          await fetch('/api/result-tiers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              quiz_id: initialData!.id,
              order_index: i,
              tier_name: enData.resultTiers[i].tier_name,
              min_percentage: enData.resultTiers[i].min_percentage,
              max_percentage: enData.resultTiers[i].max_percentage,
              message: enData.resultTiers[i].message,
              tier_name_fr: frData.resultTiers[i]?.tier_name || null,
              tier_name_de: deData.resultTiers[i]?.tier_name || null,
              message_fr: frData.resultTiers[i]?.message || null,
              message_de: deData.resultTiers[i]?.message || null,
            }),
          })
        }
      }

      router.push('/quizzes')
      router.refresh()
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} quiz:`, error)
      alert(`Failed to ${mode === 'create' ? 'create' : 'update'} quiz`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Language Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              type="button"
              onClick={() => setActiveLanguage('en')}
              className={`px-6 py-3 border-b-2 font-medium text-sm ${
                activeLanguage === 'en'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setActiveLanguage('fr')}
              className={`px-6 py-3 border-b-2 font-medium text-sm ${
                activeLanguage === 'fr'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              French
            </button>
            <button
              type="button"
              onClick={() => setActiveLanguage('de')}
              className={`px-6 py-3 border-b-2 font-medium text-sm ${
                activeLanguage === 'de'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              German
            </button>
          </nav>
        </div>
        <div className="p-4 bg-blue-50 border-l-4 border-blue-500 flex justify-between items-center">
          <p className="text-sm text-blue-700">
            {activeLanguage === 'en' ? (
              <><strong>English</strong> is the primary language. Create translations in French and German tabs.</>
            ) : (
              <><strong>{activeLanguage === 'fr' ? 'French' : 'German'}</strong> translation. Edit the auto-translated text as needed.</>
            )}
          </p>
          {activeLanguage !== 'en' && (
            <button
              type="button"
              onClick={handleAutofillTranslation}
              disabled={translating || !languageData.en.title}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {translating ? 'Translating...' : '🌐 Autofill Translation'}
            </button>
          )}
        </div>
      </div>

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
          {loading ? (mode === 'create' ? 'Publishing...' : 'Updating...') : (mode === 'create' ? 'Publish Quiz' : 'Update & Publish')}
        </button>
      </div>
      </form>
    </div>
  )
}
