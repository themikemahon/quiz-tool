'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Quiz {
  id: number
  title: string
  description: string
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [embedModal, setEmbedModal] = useState<{ show: boolean; quizId: number | null }>({
    show: false,
    quizId: null,
  })
  const [embedWidth, setEmbedWidth] = useState('600')
  const [embedHeight, setEmbedHeight] = useState('800')
  const [embedLanguage, setEmbedLanguage] = useState<'en' | 'fr' | 'de'>('en')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      const res = await fetch('/api/quizzes')
      const data = await res.json()
      setQuizzes(data)
    } catch (error) {
      console.error('Error fetching quizzes:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteQuiz = async (id: number) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return

    try {
      await fetch(`/api/quizzes/${id}`, { method: 'DELETE' })
      setQuizzes(quizzes.filter(q => q.id !== id))
    } catch (error) {
      console.error('Error deleting quiz:', error)
      alert('Failed to delete quiz')
    }
  }

  const getEmbedCode = (quizId: number) => {
    const quizUrl = process.env.NEXT_PUBLIC_QUIZ_URL || 'https://quiz-tool-quiz.vercel.app'
    const langParam = embedLanguage !== 'en' ? `&lang=${embedLanguage}` : ''
    return `<iframe src="${quizUrl}/${quizId}?embed=true${langParam}" width="${embedWidth}" height="${embedHeight}" frameborder="0" style="border: 1px solid #e5e7eb; border-radius: 8px;"></iframe>`
  }

  const copyEmbedCode = () => {
    if (embedModal.quizId) {
      const code = getEmbedCode(embedModal.quizId)
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const openEmbedModal = (quizId: number) => {
    setEmbedModal({ show: true, quizId })
    setCopied(false)
  }

  const closeEmbedModal = () => {
    setEmbedModal({ show: false, quizId: null })
    setEmbedWidth('600')
    setEmbedHeight('800')
    setEmbedLanguage('en')
  }

  if (loading) {
    return <div className="text-center py-12">Loading quizzes...</div>
  }

  if (quizzes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-600 mb-4">No quizzes yet</p>
        <Link
          href="/quizzes/new"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Your First Quiz
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Updated
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {quizzes.map((quiz) => (
            <tr key={quiz.id}>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{quiz.title}</div>
                <div className="text-sm text-gray-500">{quiz.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    quiz.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {quiz.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(quiz.updated_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-3">
                  <Link
                    href={`/quizzes/${quiz.id}/edit`}
                    className="text-gray-600 hover:text-gray-900 transition"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => {
                      window.open(`https://quiz-tool-quiz.vercel.app/${quiz.id}`, '_blank')
                    }}
                    className="text-blue-600 hover:text-blue-900 transition"
                    title="View Live"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => openEmbedModal(quiz.id)}
                    className="text-purple-600 hover:text-purple-900 transition"
                    title="Copy Embed Code"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteQuiz(quiz.id)}
                    className="text-red-600 hover:text-red-900 transition"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Embed Code Modal */}
    {embedModal.show && embedModal.quizId && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Embed Quiz</h2>
            <button
              onClick={closeEmbedModal}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-gray-600 mb-4">
            Copy this code to embed the quiz on your website
          </p>

          {/* Size and Language Controls */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width (px)
              </label>
              <input
                type="number"
                value={embedWidth}
                onChange={(e) => setEmbedWidth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height (px)
              </label>
              <input
                type="number"
                value={embedHeight}
                onChange={(e) => setEmbedHeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                value={embedLanguage}
                onChange={(e) => setEmbedLanguage(e.target.value as 'en' | 'fr' | 'de')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>

          {/* Embed Code */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Embed Code
            </label>
            <div className="relative">
              <pre className="bg-gray-50 border border-gray-300 rounded-md p-4 text-sm overflow-x-auto">
                <code className="text-gray-800">{getEmbedCode(embedModal.quizId)}</code>
              </pre>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={copyEmbedCode}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              {copied ? '✓ Copied!' : 'Copy to Clipboard'}
            </button>
            <button
              onClick={closeEmbedModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
