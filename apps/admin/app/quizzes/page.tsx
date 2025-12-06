import Link from 'next/link'

export default function QuizzesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Quizzes</h1>
          <Link
            href="/quizzes/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Create New Quiz
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <p className="text-gray-600">
              Quiz list will be loaded here via client component
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
