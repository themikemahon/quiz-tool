import { sql } from '@quiz-tool/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import QuizForm from '@/components/QuizForm'

interface Quiz {
  id: number
  title: string
  title_fr?: string
  title_de?: string
  description: string
  description_fr?: string
  description_de?: string
  status: string
  template_type: string
  brand_theme_id?: number
  cta_enabled?: boolean
  cta_text?: string
  cta_text_fr?: string
  cta_text_de?: string
  cta_url?: string
  cta_mobile_url?: string
  created_at: string
  updated_at: string
}

interface Question {
  id: number
  quiz_id: number
  order_index: number
  question_type: string
  image_url: string
  image_url_2?: string
  question_text: string
  question_text_fr?: string
  question_text_de?: string
  correct_answer: string
  explanation: string
  explanation_fr?: string
  explanation_de?: string
  created_at: string
  options?: Array<{
    id: number
    question_id: number
    option_text: string
    option_text_fr?: string
    option_text_de?: string
    is_correct: boolean
    order_index: number
  }>
}

interface ResultTier {
  id: number
  quiz_id: number
  tier_name: string
  tier_name_fr?: string
  tier_name_de?: string
  min_percentage: number
  max_percentage: number
  message: string
  message_fr?: string
  message_de?: string
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

    // Fetch answer options for each question
    const questionsWithOptions = await Promise.all(
      questionRows.map(async (question) => {
        const { rows: optionRows } = await sql`
          SELECT * FROM answer_options
          WHERE question_id = ${question.id}
          ORDER BY order_index ASC
        `
        return {
          ...question,
          options: optionRows
        }
      })
    )

    const { rows: tierRows } = await sql<ResultTier>`
      SELECT * FROM result_tiers
      WHERE quiz_id = ${quizId}
      ORDER BY order_index ASC
    `

    return {
      ...quizRows[0],
      questions: questionsWithOptions,
      result_tiers: tierRows,
    }
  } catch (error) {
    console.error('Error fetching quiz:', error)
    return null
  }
}

// Disable caching for this page
export const dynamic = 'force-dynamic'
export const revalidate = 0

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
