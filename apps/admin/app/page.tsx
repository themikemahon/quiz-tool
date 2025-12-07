import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-5">
            Quiz Tool Admin
          </h1>
          <p className="text-xl text-gray-600">
            Create and manage your quizzes
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Link
            href="/quizzes"
            className="btn-primary"
          >
            View All Quizzes
          </Link>
          <Link
            href="/quizzes/new"
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm"
          >
            Create New Quiz
          </Link>
        </div>
      </div>
    </div>
  )
}
