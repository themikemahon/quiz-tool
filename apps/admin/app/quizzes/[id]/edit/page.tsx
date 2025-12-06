import { sql } from '@vercel/postgres'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import EditQuizForm from './EditQuizForm'

async function getQuiz(id: string) {
  try {
    const quizId = parseInt(id)

    const { rows: quizRows } = await sql`
      SELECT * FROM quizzes WHERE id = ${quizId}
    `

    if (quizRows.length === 0) {
      return null
    }

    const { rows: questionRows } = await sql`
      SELECT * FROM questions 
      WHERE quiz_id = ${quizId}
      ORDER BY order_index ASC
    `

    const { rows: tierRows } = await sql`
      SELECT * FROM result_tiers
      WHERE quiz_id = ${quizId}
      ORDER BY order_index ASC
    `

    return {
      ...quizRows[0],
      questions: questionRows,
      result_tiers: tierRows,
    }
  } catch (error) {
    console.error('Error fetching quiz:', error)
    return null
  }
}

export default async function EditQuizPage({ params }: { params: { id: string } }) {
  const quiz = await getQuiz(params.id)

  if (!quiz) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/quizzes" className="text-blue-600 hover:text-blue-700">
            ← Back to Quizzes
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Edit Quiz
        </h1>

        <EditQuizForm quiz={quiz} />
      </div>
    </div>
  )
}
