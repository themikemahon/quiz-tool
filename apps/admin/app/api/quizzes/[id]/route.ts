import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import type { Quiz, Question } from '@quiz-tool/shared/types'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = parseInt(params.id)

    const { rows: quizRows } = await sql<Quiz>`
      SELECT * FROM quizzes WHERE id = ${quizId}
    `

    if (quizRows.length === 0) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    const { rows: questionRows } = await sql<Question>`
      SELECT * FROM questions 
      WHERE quiz_id = ${quizId}
      ORDER BY order_index ASC
    `

    return NextResponse.json({
      ...quizRows[0],
      questions: questionRows,
    })
  } catch (error) {
    console.error('Error fetching quiz:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = parseInt(params.id)
    const body = await request.json()
    const { title, description, intro_text, summary_text, tips_text, status } = body

    const { rows } = await sql<Quiz>`
      UPDATE quizzes 
      SET 
        title = ${title},
        description = ${description},
        intro_text = ${intro_text},
        summary_text = ${summary_text},
        tips_text = ${tips_text},
        status = ${status},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${quizId}
      RETURNING *
    `

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('Error updating quiz:', error)
    return NextResponse.json(
      { error: 'Failed to update quiz' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = parseInt(params.id)

    await sql`DELETE FROM quizzes WHERE id = ${quizId}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting quiz:', error)
    return NextResponse.json(
      { error: 'Failed to delete quiz' },
      { status: 500 }
    )
  }
}
