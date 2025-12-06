import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Quiz Tool Admin
          </h1>
          <p className="text-lg text-gray-600">
            Create and manage your quizzes
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Link
            href="/quizzes"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            View All Quizzes
          </Link>
          <Link
            href="/quizzes/new"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Create New Quiz
          </Link>
        </div>
      </div>
    </div>
  )
}
