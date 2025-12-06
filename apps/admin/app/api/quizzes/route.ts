import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import type { Quiz } from '@quiz-tool/shared/types'

export async function GET() {
  try {
    const { rows } = await sql<Quiz>`
      SELECT * FROM quizzes 
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
    const { title, description, intro_text, template_type, status } = body

    const { rows } = await sql<Quiz>`
      INSERT INTO quizzes (title, description, intro_text, template_type, status)
      VALUES (${title}, ${description}, ${intro_text}, ${template_type || 'scam-detector'}, ${status || 'draft'})
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
