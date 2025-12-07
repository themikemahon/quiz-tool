import { sql } from '@vercel/postgres'
import QuizPlayer from './QuizPlayer'
import { notFound } from 'next/navigation'

// Disable caching for quiz player
export const dynamic = 'force-dynamic'
export const revalidate = 0

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

async function getQuiz(id: string, language?: string) {
  try {
    const quizId = parseInt(id)
    const lang = language || 'en'

    // First, try to get the quiz in the requested language
    // If id is provided and language is not 'en', look for translation
    let targetQuizId = quizId
    
    if (lang !== 'en') {
      // Look for a translation of this quiz
      const { rows: translationRows } = await sql<Quiz>`
        SELECT * FROM quizzes 
        WHERE parent_quiz_id = ${quizId} 
        AND language = ${lang}
        AND status = 'published'
      `
      
      if (translationRows.length > 0) {
        targetQuizId = translationRows[0].id
      } else {
        // No translation found, fall back to English
        targetQuizId = quizId
      }
    }

    // Get quiz
    const { rows: quizRows } = await sql<Quiz>`
      SELECT * FROM quizzes WHERE id = ${targetQuizId} AND status = 'published'
    `

    if (quizRows.length === 0) {
      return null
    }

    // Get questions
    const { rows: questionRows } = await sql<Question>`
      SELECT * FROM questions 
      WHERE quiz_id = ${targetQuizId}
      ORDER BY order_index ASC
    `

    // Get result tiers
    const { rows: tierRows } = await sql<ResultTier>`
      SELECT * FROM result_tiers
      WHERE quiz_id = ${targetQuizId}
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

export default async function QuizPage({ 
  params,
  searchParams 
}: { 
  params: { id: string }
  searchParams: { embed?: string; lang?: string }
}) {
  const quiz = await getQuiz(params.id, searchParams.lang)

  if (!quiz) {
    notFound()
  }

  const isEmbedMode = searchParams.embed === 'true'

  return <QuizPlayer quiz={quiz} embedMode={isEmbedMode} />
}
