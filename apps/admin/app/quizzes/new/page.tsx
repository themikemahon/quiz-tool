import Link from 'next/link'
import QuizForm from '@/components/QuizForm'

export default function NewQuizPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/quizzes" className="text-blue-600 hover:text-blue-700">
            ← Back to Quizzes
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Create New Quiz
        </h1>

        <QuizForm mode="create" />
      </div>
    </div>
  )
}
