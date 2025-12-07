export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full card text-center">
        <div className="text-7xl mb-6">📝</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-5">Quiz Player</h1>
        <p className="text-lg text-gray-600 mb-6">
          To view a quiz, add the quiz ID to the URL.
        </p>
        <p className="text-base text-gray-500">
          Example: /1 for quiz ID 1
        </p>
      </div>
    </div>
  )
}
