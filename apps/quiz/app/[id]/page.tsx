import { sql } from '@vercel/postgres'
import QuizPlayer from './QuizPlayer'
import { notFound } from 'next/navigation'

async function getQuiz(id: string) {
  try {
    const quizId = parseInt(id)

    // Get quiz
    const { rows: quizRows } = await sql`
      SELECT * FROM quizzes WHERE id = ${quizId} AND status = 'published'
    `

    if (quizRows.length === 0) {
      return null
    }

    // Get questions
    const { rows: questionRows } = await sql`
      SELECT * FROM questions 
      WHERE quiz_id = ${quizId}
      ORDER BY order_index ASC
    `

    // Get result tiers
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

export default async function QuizPage({ params }: { params: { id: string } }) {
  const quiz = await getQuiz(params.id)

  if (!quiz) {
    notFound()
  }

  return <QuizPlayer quiz={quiz} />
}
