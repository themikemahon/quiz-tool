import { sql } from '@vercel/postgres'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import QuizForm from '@/components/QuizForm'

interface Quiz {
  id: number
  title: string
  description: string
  intro_text: string
  status: string
  template_type: string
  created_at: string
  updated_at: string
}

interface Question {
  id: number
  quiz_id: number
  order_index: number
  image_url: string
  question_text: string
  correct_answer: string
  explanation: string
  created_at: string
}

interface ResultTier {
  id: number
  quiz_id: number
  tier_name: string
  min_percentage: number
  max_percentage: number
  message: string
  order_index: number
}

async function getQuiz(id: string) {
  try {
    const quizId = parseInt(id)

    const { rows: quizRows } = await sql<Quiz>`
      SELECT * FROM quizzes WHERE id = ${quizId}
    `

    if (quizRows.length === 0) {
      return null
    }

    const { rows: questionRows } = await sql<Question>`
      SELECT * FROM questions 
      WHERE quiz_id = ${quizId}
      ORDER BY order_index ASC
    `

    const { rows: tierRows } = await sql<ResultTier>`
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

        <QuizForm mode="edit" initialData={quiz} />
      </div>
    </div>
  )
}
