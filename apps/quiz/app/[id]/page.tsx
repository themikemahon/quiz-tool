import { sql } from '@vercel/postgres'
import QuizPlayer from './QuizPlayer'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

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
  status: string
  template_type: string
  created_at: string
  updated_at: string
}

async function getQuiz(id: string, language?: string) {
  try {
    const quizId = parseInt(id)
    const lang = language || 'en'

    // Get quiz
    const { rows: quizRows } = await sql<Quiz>`
      SELECT * FROM quizzes WHERE id = ${quizId} AND status = 'published'
    `

    if (quizRows.length === 0) {
      return null
    }

    const quiz = quizRows[0]

    // Get questions
    const { rows: questionRows } = await sql<Question>`
      SELECT * FROM questions 
      WHERE quiz_id = ${quizId}
      ORDER BY order_index ASC
    `

    // Get result tiers
    const { rows: tierRows } = await sql<ResultTier>`
      SELECT * FROM result_tiers
      WHERE quiz_id = ${quizId}
      ORDER BY order_index ASC
    `

    // Map to the correct language
    const getTranslatedField = (row: any, field: string) => {
      if (lang === 'fr' && row[`${field}_fr`]) return row[`${field}_fr`]
      if (lang === 'de' && row[`${field}_de`]) return row[`${field}_de`]
      return row[field]
    }

    return {
      ...quiz,
      title: getTranslatedField(quiz, 'title'),
      description: getTranslatedField(quiz, 'description'),
      questions: questionRows.map(q => ({
        ...q,
        question_text: getTranslatedField(q, 'question_text'),
        explanation: getTranslatedField(q, 'explanation'),
      })),
      result_tiers: tierRows.map(t => ({
        ...t,
        tier_name: getTranslatedField(t, 'tier_name'),
        message: getTranslatedField(t, 'message'),
      })),
    }
  } catch (error) {
    console.error('Error fetching quiz:', error)
    return null
  }
}

export async function generateMetadata({ 
  params,
  searchParams 
}: { 
  params: { id: string }
  searchParams: { lang?: string }
}): Promise<Metadata> {
  const quiz = await getQuiz(params.id, searchParams.lang)

  if (!quiz) {
    return {
      title: 'Quiz Not Found',
    }
  }

  return {
    title: quiz.title,
    description: quiz.description || undefined,
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

  return <QuizPlayer quiz={quiz} embedMode={isEmbedMode} language={searchParams.lang} />
}
