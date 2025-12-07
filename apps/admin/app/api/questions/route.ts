import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import type { Question } from '@quiz-tool/shared/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      quiz_id, order_index, image_url, question_text, correct_answer, explanation,
      question_text_fr, question_text_de, explanation_fr, explanation_de
    } = body

    const { rows } = await sql<Question>`
      INSERT INTO questions (
        quiz_id, order_index, image_url, question_text, correct_answer, explanation,
        question_text_fr, question_text_de, explanation_fr, explanation_de
      )
      VALUES (
        ${quiz_id}, ${order_index}, ${image_url}, ${question_text}, ${correct_answer}, ${explanation},
        ${question_text_fr || null}, ${question_text_de || null}, ${explanation_fr || null}, ${explanation_de || null}
      )
      RETURNING *
    `

    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    )
  }
}
