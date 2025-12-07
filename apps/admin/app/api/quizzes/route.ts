import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import type { Quiz } from '@quiz-tool/shared/types'

export async function GET() {
  try {
    // Only return parent quizzes (English, no parent_quiz_id)
    const { rows } = await sql<Quiz>`
      SELECT * FROM quizzes 
      WHERE parent_quiz_id IS NULL
      ORDER BY updated_at DESC
    `
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, intro_text, template_type, status, language, parent_quiz_id } = body

    const { rows } = await sql<Quiz>`
      INSERT INTO quizzes (title, description, intro_text, template_type, status, language, parent_quiz_id)
      VALUES (
        ${title}, 
        ${description}, 
        ${intro_text}, 
        ${template_type || 'scam-detector'}, 
        ${status || 'draft'},
        ${language || 'en'},
        ${parent_quiz_id || null}
      )
      RETURNING *
    `

    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating quiz:', error)
    return NextResponse.json(
      { error: 'Failed to create quiz' },
      { status: 500 }
    )
  }
}
