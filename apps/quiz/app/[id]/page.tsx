export default function QuizPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Quiz Player
        </h1>
        <p className="text-gray-600">
          Quiz ID: {params.id}
        </p>
        <p className="text-gray-600 mt-4">
          Interactive quiz player will be implemented here
        </p>
      </div>
    </div>
  )
}
