'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { BrandTheme, QuestionType } from '@quiz-tool/shared/types'

interface AnswerOption {
  option_text: string
  is_correct: boolean
}

interface Question {
  id?: number
  question_type: QuestionType
  question_text: string
  image_url: string
  image_url_2?: string
  correct_answer: string
  explanation: string
  options?: AnswerOption[]
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
    brand_theme_id?: number
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
  const [brandThemes, setBrandThemes] = useState<BrandTheme[]>([])
  const [selectedThemeId, setSelectedThemeId] = useState<number | null>(initialData?.brand_theme_id || null)
  const [ctaEnabled, setCtaEnabled] = useState<boolean>((initialData as any)?.cta_enabled || false)
  
  // Fetch brand themes on component mount
  useEffect(() => {
    const fetchBrandThemes = async () => {
      try {
        const res = await fetch('/api/brand-themes')
        if (!res.ok) throw new Error('Failed to fetch brand themes')
        const themes = await res.json()
        setBrandThemes(themes)
      } catch (error) {
        console.error('Error fetching brand themes:', error)
      }
    }
    
    fetchBrandThemes()
  }, [])
  
  // Initialize language data
  const defaultQuestions: Question[] = [
    { 
      question_type: 'scam-detector',
      question_text: '', 
      image_url: '', 
      correct_answer: 'scam', 
      explanation: '' 
    },
    { 
      question_type: 'scam-detector',
      question_text: '', 
      image_url: '', 
      correct_answer: 'scam', 
      explanation: '' 
    },
    { 
      question_type: 'scam-detector',
      question_text: '', 
      image_url: '', 
      correct_answer: 'scam', 
      explanation: '' 
    },
  ]
  
  const defaultTiers: ResultTier[] = [
    { tier_name: 'Novice', min_percentage: 0, max_percentage: 33, message: '' },
    { tier_name: 'Competent', min_percentage: 34, max_percentage: 66, message: '' },
    { tier_name: 'Expert', min_percentage: 67, max_percentage: 100, message: '' },
  ]
  
  const [languageData, setLanguageData] = useState<Record<Language, LanguageData>>(() => {
    const enQuestions = initialData?.questions.map(q => ({
      id: q.id,
      question_type: q.question_type || 'scam-detector',
      question_text: q.question_text,
      image_url: q.image_url || '',
      image_url_2: q.image_url_2 || '',
      correct_answer: q.correct_answer,
      explanation: q.explanation || '',
      options: (q as any).options || [],
    })) || defaultQuestions

    const enTiers = initialData?.result_tiers.map(t => ({
      id: t.id,
      tier_name: t.tier_name,
      min_percentage: t.min_percentage,
      max_percentage: t.max_percentage,
      message: t.message,
    })) || defaultTiers

    // Ensure FR and DE arrays match EN array length
    const frQuestions = enQuestions.map((q, idx) => {
      const origQ = initialData?.questions[idx]
      return {
        id: q.id,
        question_type: q.question_type,
        question_text: (origQ as any)?.question_text_fr || '',
        image_url: q.image_url,
        image_url_2: q.image_url_2,
        correct_answer: q.correct_answer,
        explanation: (origQ as any)?.explanation_fr || '',
        options: (origQ as any)?.options?.map((opt: any) => ({
          option_text: opt.option_text_fr || '',
          is_correct: opt.is_correct,
        })) || [],
      }
    })

    const deQuestions = enQuestions.map((q, idx) => {
      const origQ = initialData?.questions[idx]
      return {
        id: q.id,
        question_type: q.question_type,
        question_text: (origQ as any)?.question_text_de || '',
        image_url: q.image_url,
        image_url_2: q.image_url_2,
        correct_answer: q.correct_answer,
        explanation: (origQ as any)?.explanation_de || '',
        options: (origQ as any)?.options?.map((opt: any) => ({
          option_text: opt.option_text_de || '',
          is_correct: opt.is_correct,
        })) || [],
      }
    })

    const frTiers = enTiers.map((t, idx) => {
      const origT = initialData?.result_tiers[idx]
      return {
        id: t.id,
        tier_name: (origT as any)?.tier_name_fr || '',
        min_percentage: t.min_percentage,
        max_percentage: t.max_percentage,
        message: (origT as any)?.message_fr || '',
      }
    })

    const deTiers = enTiers.map((t, idx) => {
      const origT = initialData?.result_tiers[idx]
      return {
        id: t.id,
        tier_name: (origT as any)?.tier_name_de || '',
        min_percentage: t.min_percentage,
        max_percentage: t.max_percentage,
        message: (origT as any)?.message_de || '',
      }
    })

    return {
      en: {
        title: initialData?.title || '',
        description: initialData?.description || '',
        questions: enQuestions,
        resultTiers: enTiers,
      },
      fr: {
        title: (initialData as any)?.title_fr || '',
        description: (initialData as any)?.description_fr || '',
        questions: frQuestions,
        resultTiers: frTiers,
      },
      de: {
        title: (initialData as any)?.title_de || '',
        description: (initialData as any)?.description_de || '',
        questions: deQuestions,
        resultTiers: deTiers,
      },
    }
  })
  
  // CTA text state for translations
  const [ctaText, setCtaText] = useState({
    en: (initialData as any)?.cta_text || '',
    fr: (initialData as any)?.cta_text_fr || '',
    de: (initialData as any)?.cta_text_de || '',
  })
  const [ctaUrl, setCtaUrl] = useState<string>((initialData as any)?.cta_url || '')
  const [ctaMobileUrl, setCtaMobileUrl] = useState<string>((initialData as any)?.cta_mobile_url || '')
  
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

  const updateQuestionType = (index: number, newType: QuestionType) => {
    const updated = [...questions]
    const currentQuestion = updated[index]
    
    // Update question type
    updated[index] = { ...currentQuestion, question_type: newType }
    
    // Initialize type-specific fields
    if (newType === 'multiple-choice') {
      // Initialize 4 empty options if not already present
      if (!currentQuestion.options || currentQuestion.options.length === 0) {
        updated[index].options = [
          { option_text: '', is_correct: true },
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false },
        ]
      }
      // Set correct_answer to the index of the correct option
      updated[index].correct_answer = '0'
    } else if (newType === 'comparison') {
      // Initialize second image field
      updated[index].image_url_2 = currentQuestion.image_url_2 || ''
      updated[index].correct_answer = 'image-1'
    } else if (newType === 'true-false') {
      updated[index].correct_answer = 'true'
    } else if (newType === 'scam-detector') {
      updated[index].correct_answer = 'scam'
    }
    
    setQuestions(updated)
  }

  const updateAnswerOption = (questionIndex: number, optionIndex: number, field: 'option_text' | 'is_correct', value: string | boolean) => {
    const updated = [...questions]
    if (!updated[questionIndex].options) {
      updated[questionIndex].options = []
    }
    
    const options = [...(updated[questionIndex].options || [])]
    
    if (field === 'is_correct' && value === true) {
      // Only one option can be correct
      options.forEach((opt, idx) => {
        opt.is_correct = idx === optionIndex
      })
      // Update correct_answer to the index
      updated[questionIndex].correct_answer = optionIndex.toString()
    } else {
      options[optionIndex] = { ...options[optionIndex], [field]: value }
    }
    
    updated[questionIndex].options = options
    setQuestions(updated)
  }

  const addQuestion = () => {
    const newQuestion: Question = { 
      question_type: 'scam-detector',
      question_text: '', 
      image_url: '', 
      correct_answer: 'scam', 
      explanation: '' 
    }
    
    // Add to all languages to keep arrays in sync
    setLanguageData(prev => ({
      en: { ...prev.en, questions: [...prev.en.questions, newQuestion] },
      fr: { ...prev.fr, questions: [...prev.fr.questions, { ...newQuestion, question_text: '', explanation: '' }] },
      de: { ...prev.de, questions: [...prev.de.questions, { ...newQuestion, question_text: '', explanation: '' }] },
    }))
  }

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) {
      alert('You must have at least one question')
      return
    }
    
    // Remove from all languages to keep arrays in sync
    setLanguageData(prev => ({
      en: { ...prev.en, questions: prev.en.questions.filter((_, i) => i !== index) },
      fr: { ...prev.fr, questions: prev.fr.questions.filter((_, i) => i !== index) },
      de: { ...prev.de, questions: prev.de.questions.filter((_, i) => i !== index) },
    }))
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
      
      // Translate CTA text if enabled and has content
      const translatedCtaText = ctaEnabled && ctaText.en ? await translateText(ctaText.en, activeLanguage) : ''
      
      // Translate questions
      const translatedQuestions: Question[] = []
      for (const q of englishData.questions) {
        const translatedQuestion = q.question_text ? await translateText(q.question_text, activeLanguage) : ''
        const translatedExplanation = q.explanation ? await translateText(q.explanation, activeLanguage) : ''
        
        // Translate answer options for multiple-choice questions
        let translatedOptions: AnswerOption[] | undefined = undefined
        if (q.question_type === 'multiple-choice' && q.options) {
          translatedOptions = []
          for (const opt of q.options) {
            const translatedOptionText = opt.option_text ? await translateText(opt.option_text, activeLanguage) : ''
            translatedOptions.push({
              option_text: translatedOptionText,
              is_correct: opt.is_correct,
            })
          }
        }
        
        translatedQuestions.push({
          ...q,
          question_text: translatedQuestion,
          explanation: translatedExplanation,
          options: translatedOptions,
          // Keep image_url, image_url_2, correct_answer, and question_type the same
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
      
      // Update CTA text
      if (translatedCtaText) {
        setCtaText(prev => ({
          ...prev,
          [activeLanguage]: translatedCtaText
        }))
      }
    } catch (error) {
      console.error('Autofill translation error:', error)
      alert('Translation failed. Please try again.')
    } finally {
      setTranslating(false)
    }
  }

  const handleImageUpload = async (index: number, file: File, isSecondImage: boolean = false) => {
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
      
      if (isSecondImage) {
        updateQuestion(index, 'image_url_2', url)
      } else {
        updateQuestion(index, 'image_url', url)
      }
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
            brand_theme_id: selectedThemeId,
            cta_enabled: ctaEnabled,
            cta_text: ctaEnabled ? ctaText.en : null,
            cta_text_fr: ctaEnabled ? ctaText.fr : null,
            cta_text_de: ctaEnabled ? ctaText.de : null,
            cta_url: ctaEnabled ? ctaUrl : null,
            cta_mobile_url: ctaEnabled && ctaMobileUrl ? ctaMobileUrl : null,
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
              question_type: enData.questions[i].question_type,
              question_text: enData.questions[i].question_text,
              image_url: enData.questions[i].image_url,
              image_url_2: enData.questions[i].image_url_2 || null,
              correct_answer: enData.questions[i].correct_answer,
              explanation: enData.questions[i].explanation,
              question_text_fr: frData.questions[i]?.question_text || null,
              question_text_de: deData.questions[i]?.question_text || null,
              explanation_fr: frData.questions[i]?.explanation || null,
              explanation_de: deData.questions[i]?.explanation || null,
              options: enData.questions[i].options?.map((opt, optIdx) => ({
                option_text: opt.option_text,
                option_text_fr: frData.questions[i]?.options?.[optIdx]?.option_text || null,
                option_text_de: deData.questions[i]?.options?.[optIdx]?.option_text || null,
                is_correct: opt.is_correct,
              })) || null,
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
            brand_theme_id: selectedThemeId,
            cta_enabled: ctaEnabled,
            cta_text: ctaEnabled ? ctaText.en : null,
            cta_text_fr: ctaEnabled ? ctaText.fr : null,
            cta_text_de: ctaEnabled ? ctaText.de : null,
            cta_url: ctaEnabled ? ctaUrl : null,
            cta_mobile_url: ctaEnabled && ctaMobileUrl ? ctaMobileUrl : null,
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
              question_type: enData.questions[i].question_type,
              question_text: enData.questions[i].question_text,
              image_url: enData.questions[i].image_url,
              image_url_2: enData.questions[i].image_url_2 || null,
              correct_answer: enData.questions[i].correct_answer,
              explanation: enData.questions[i].explanation,
              question_text_fr: frData.questions[i]?.question_text || null,
              question_text_de: deData.questions[i]?.question_text || null,
              explanation_fr: frData.questions[i]?.explanation || null,
              explanation_de: deData.questions[i]?.explanation || null,
              options: enData.questions[i].options?.map((opt, optIdx) => ({
                option_text: opt.option_text,
                option_text_fr: frData.questions[i]?.options?.[optIdx]?.option_text || null,
                option_text_de: deData.questions[i]?.options?.[optIdx]?.option_text || null,
                is_correct: opt.is_correct,
              })) || null,
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
    <div className="pb-32">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Language Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                type="button"
                onClick={() => setActiveLanguage('en')}
                className={`px-6 py-4 border-b-2 font-medium text-base ${
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
                className={`px-6 py-4 border-b-2 font-medium text-base ${
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
                className={`px-6 py-4 border-b-2 font-medium text-base ${
                  activeLanguage === 'de'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                German
              </button>
            </nav>
          </div>
          <div className="p-5 bg-blue-50 border-l-4 border-blue-500 flex justify-between items-center gap-4">
            <p className="text-base text-blue-700">
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
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {translating ? 'Translating...' : '🌐 Autofill Translation'}
              </button>
            )}
          </div>
        </div>

        <form className="space-y-6">
          {/* Quiz Details */}
          <div className="card space-y-5">
            <h2>Quiz Details</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quiz Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            placeholder="Can You Spot the Scam?"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea-field"
            rows={3}
            placeholder="A quick quiz to test your scam detection skills"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand Theme
          </label>
          <select
            value={selectedThemeId || ''}
            onChange={(e) => setSelectedThemeId(e.target.value ? parseInt(e.target.value) : null)}
            className="input-field"
          >
            <option value="">Default Theme</option>
            {brandThemes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name.charAt(0).toUpperCase() + theme.name.slice(1)}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Select a brand theme to customize the quiz appearance
          </p>
          </div>
        </div>

        {/* Questions */}
        {questions.map((q, index) => (
          <div key={index} className="card space-y-5">
          <div className="flex justify-between items-center">
            <h2>Question {index + 1}</h2>
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="btn-danger"
              >
                Remove Question
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Type *
            </label>
            <select
              value={q.question_type}
              onChange={(e) => updateQuestionType(index, e.target.value as QuestionType)}
              className="input-field"
              required
            >
              <option value="scam-detector">Scam Detector</option>
              <option value="multiple-choice">Multiple Choice</option>
              <option value="comparison">Comparison</option>
              <option value="true-false">True/False</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Select the type of question you want to create
            </p>
          </div>

          {/* Image upload - shown for all types except comparison has 2 images */}
          {q.question_type !== 'comparison' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image {q.question_type === 'scam-detector' || q.question_type === 'multiple-choice' || q.question_type === 'true-false' ? '(Optional)' : '*'}
              </label>
              <div className="space-y-3">
                <input
                  type="url"
                  value={q.image_url}
                  onChange={(e) => updateQuestion(index, 'image_url', e.target.value)}
                  className="input-field"
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
                    <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
                      {uploading === index ? 'Uploading...' : 'Upload Image'}
                    </span>
                  </label>
                </div>
                {q.image_url && (
                  <img src={q.image_url} alt="Preview" className="mt-2 max-w-xs rounded-lg border border-gray-200" />
                )}
              </div>
            </div>
          )}

          {/* Comparison question - 2 images */}
          {q.question_type === 'comparison' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image 1 *
                </label>
                <div className="space-y-3">
                  <input
                    type="url"
                    value={q.image_url}
                    onChange={(e) => updateQuestion(index, 'image_url', e.target.value)}
                    className="input-field"
                    placeholder="https://example.com/image1.jpg or upload below"
                    required
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
                      <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
                        {uploading === index ? 'Uploading...' : 'Upload Image 1'}
                      </span>
                    </label>
                  </div>
                  {q.image_url && (
                    <img src={q.image_url} alt="Preview 1" className="mt-2 max-w-xs rounded-lg border border-gray-200" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image 2 *
                </label>
                <div className="space-y-3">
                  <input
                    type="url"
                    value={q.image_url_2 || ''}
                    onChange={(e) => updateQuestion(index, 'image_url_2', e.target.value)}
                    className="input-field"
                    placeholder="https://example.com/image2.jpg or upload below"
                    required
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">or</span>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(index, file, true)
                        }}
                        className="hidden"
                        disabled={uploading === index}
                      />
                      <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
                        {uploading === index ? 'Uploading...' : 'Upload Image 2'}
                      </span>
                    </label>
                  </div>
                  {q.image_url_2 && (
                    <img src={q.image_url_2} alt="Preview 2" className="mt-2 max-w-xs rounded-lg border border-gray-200" />
                  )}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Text *
            </label>
            <input
              type="text"
              value={q.question_text}
              onChange={(e) => updateQuestion(index, 'question_text', e.target.value)}
              className="input-field"
              placeholder={
                q.question_type === 'scam-detector' ? 'Is this a scam?' :
                q.question_type === 'multiple-choice' ? 'What is the correct answer?' :
                q.question_type === 'comparison' ? 'Which image is the scam?' :
                'Is this statement true or false?'
              }
              required
            />
          </div>

          {/* Multiple Choice - 4 answer options */}
          {q.question_type === 'multiple-choice' && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Answer Options * (Select one as correct)
              </label>
              {q.options?.map((option, optIndex) => (
                <div key={optIndex} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                  <input
                    type="radio"
                    name={`correct-answer-${index}`}
                    checked={option.is_correct}
                    onChange={() => updateAnswerOption(index, optIndex, 'is_correct', true)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Option {optIndex + 1}
                    </label>
                    <input
                      type="text"
                      value={option.option_text}
                      onChange={(e) => updateAnswerOption(index, optIndex, 'option_text', e.target.value)}
                      className="input-field"
                      placeholder={`Answer option ${optIndex + 1}`}
                      required
                    />
                  </div>
                </div>
              ))}
              <p className="text-sm text-gray-500">
                Select the radio button next to the correct answer
              </p>
            </div>
          )}

          {/* Scam Detector - Scam/Not Scam dropdown */}
          {q.question_type === 'scam-detector' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correct Answer *
              </label>
              <select
                value={q.correct_answer}
                onChange={(e) => updateQuestion(index, 'correct_answer', e.target.value)}
                className="input-field"
                required
              >
                <option value="scam">Scam</option>
                <option value="not-scam">Not a Scam</option>
              </select>
            </div>
          )}

          {/* Comparison - Image 1 or Image 2 */}
          {q.question_type === 'comparison' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correct Answer *
              </label>
              <select
                value={q.correct_answer}
                onChange={(e) => updateQuestion(index, 'correct_answer', e.target.value)}
                className="input-field"
                required
              >
                <option value="image-1">Image 1</option>
                <option value="image-2">Image 2</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Select which image is the correct answer
              </p>
            </div>
          )}

          {/* True/False - True or False radio buttons */}
          {q.question_type === 'true-false' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correct Answer *
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`true-false-${index}`}
                    value="true"
                    checked={q.correct_answer === 'true'}
                    onChange={(e) => updateQuestion(index, 'correct_answer', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">True</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`true-false-${index}`}
                    value="false"
                    checked={q.correct_answer === 'false'}
                    onChange={(e) => updateQuestion(index, 'correct_answer', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">False</span>
                </label>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Explanation *
            </label>
            <textarea
              value={q.explanation}
              onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
              className="textarea-field"
              rows={3}
              placeholder="Explain why this is the correct answer..."
              required
            />
            </div>
          </div>
        ))}

        {/* Add Question Button */}
        <div className="flex justify-center py-6">
          <button
            type="button"
            onClick={addQuestion}
            className="px-8 py-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors font-medium text-base"
          >
            + Add Another Question
          </button>
        </div>

        {/* Result Tiers */}
        <div className="card space-y-5">
          <div>
            <h2>Result Tiers</h2>
            <p className="text-sm text-gray-600 mt-2">
              Define messages for different performance levels. Percentages are calculated automatically based on correct answers.
            </p>
          </div>

          {resultTiers.map((tier, index) => (
            <div key={index} className="card-section space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tier Name *
                </label>
                <input
                  type="text"
                  value={tier.tier_name}
                  onChange={(e) => updateResultTier(index, 'tier_name', e.target.value)}
                  className="input-field"
                  placeholder="Novice"
                  required
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min %
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={tier.min_percentage}
                  onChange={(e) => updateResultTier(index, 'min_percentage', parseInt(e.target.value))}
                  className="input-field"
                  required
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max %
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={tier.max_percentage}
                  onChange={(e) => updateResultTier(index, 'max_percentage', parseInt(e.target.value))}
                  className="input-field"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                value={tier.message}
                onChange={(e) => updateResultTier(index, 'message', e.target.value)}
                className="textarea-field"
                rows={3}
                placeholder="You're just getting started! Here are some tips..."
                required
              />
              </div>
            </div>
          ))}
        </div>

        {/* CTA Configuration */}
        <div className="card space-y-5">
          <div>
            <h2>Call-to-Action Button</h2>
            <p className="text-sm text-gray-600 mt-2">
              Add an optional CTA button at the end of the quiz to promote products or services.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="cta-enabled"
              checked={ctaEnabled}
              onChange={(e) => setCtaEnabled(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="cta-enabled" className="text-sm font-medium text-gray-700">
              Enable CTA Button
            </label>
          </div>

          {ctaEnabled && (
            <div className="space-y-5 pl-7 border-l-2 border-blue-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Text *
                </label>
                <input
                  type="text"
                  value={ctaText[activeLanguage]}
                  onChange={(e) => setCtaText({ ...ctaText, [activeLanguage]: e.target.value })}
                  className="input-field"
                  placeholder="Learn More About Protection"
                  required={ctaEnabled}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {activeLanguage === 'en'
                    ? 'Enter the button text in English. Use the language tabs to add translations.'
                    : `Translation for ${activeLanguage === 'fr' ? 'French' : 'German'}. Use autofill or edit manually.`
                  }
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desktop URL *
                </label>
                <input
                  type="url"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  className="input-field"
                  placeholder="https://example.com/product"
                  required={ctaEnabled}
                />
                <p className="text-sm text-gray-500 mt-1">
                  URL to open when the button is clicked on desktop devices
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile URL (Optional)
                </label>
                <input
                  type="url"
                  value={ctaMobileUrl}
                  onChange={(e) => setCtaMobileUrl(e.target.value)}
                  className="input-field"
                  placeholder="https://example.com/mobile-product"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Optional mobile-specific URL. If not provided, desktop URL will be used.
                </p>
              </div>
            </div>
          )}
        </div>
        </form>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/quizzes')}
            className="btn-ghost"
          >
            Cancel
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'draft')}
              disabled={loading}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'published')}
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (mode === 'create' ? 'Publishing...' : 'Updating...') : (mode === 'create' ? 'Publish Quiz' : 'Update & Publish')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
