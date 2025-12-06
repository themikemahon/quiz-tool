export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Quiz Not Found</h1>
        <p className="text-gray-600 mb-6">
          This quiz doesn't exist or hasn't been published yet.
        </p>
      </div>
    </div>
  )
}
