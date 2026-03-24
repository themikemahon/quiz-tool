import { NextResponse } from 'next/server'
import { sql } from '@quiz-tool/db'
import type { Question } from '@quiz-tool/shared/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      quiz_id, 
      order_index, 
      question_type,
      image_url, 
      image_url_2,
      question_text, 
      correct_answer, 
      explanation,
      question_text_fr, 
      question_text_de, 
      explanation_fr, 
      explanation_de,
      options
    } = body

    // Validate question type
    const validTypes = ['scam-detector', 'multiple-choice', 'comparison', 'true-false']
    if (!validTypes.includes(question_type)) {
      return NextResponse.json(
        { error: 'Invalid question type' },
        { status: 400 }
      )
    }

    // Validate question data based on type
    if (question_type === 'multiple-choice') {
      if (!options || options.length !== 4) {
        return NextResponse.json(
          { error: 'Multiple choice questions must have exactly 4 options' },
          { status: 400 }
        )
      }
      const correctCount = options.filter((opt: any) => opt.is_correct).length
      if (correctCount !== 1) {
        return NextResponse.json(
          { error: 'Multiple choice questions must have exactly 1 correct answer' },
          { status: 400 }
        )
      }
    }

    if (question_type === 'comparison') {
      if (!image_url || !image_url_2) {
        return NextResponse.json(
          { error: 'Comparison questions must have 2 images' },
          { status: 400 }
        )
      }
      if (!['image-1', 'image-2'].includes(correct_answer)) {
        return NextResponse.json(
          { error: 'Comparison questions must have correct_answer as image-1 or image-2' },
          { status: 400 }
        )
      }
    }

    if (question_type === 'true-false') {
      if (!['true', 'false'].includes(correct_answer)) {
        return NextResponse.json(
          { error: 'True/false questions must have correct_answer as true or false' },
          { status: 400 }
        )
      }
    }

    if (question_type === 'scam-detector') {
      if (!['scam', 'not-scam'].includes(correct_answer)) {
        return NextResponse.json(
          { error: 'Scam detector questions must have correct_answer as scam or not-scam' },
          { status: 400 }
        )
      }
    }

    // Insert question
    const { rows } = await sql<Question>`
      INSERT INTO questions (
        quiz_id, order_index, question_type, image_url, image_url_2, question_text, correct_answer, explanation,
        question_text_fr, question_text_de, explanation_fr, explanation_de
      )
      VALUES (
        ${quiz_id}, ${order_index}, ${question_type}, ${image_url || null}, ${image_url_2 || null}, 
        ${question_text}, ${correct_answer}, ${explanation},
        ${question_text_fr || null}, ${question_text_de || null}, ${explanation_fr || null}, ${explanation_de || null}
      )
      RETURNING *
    `

    const question = rows[0]

    // Insert answer options for multiple-choice questions
    if (question_type === 'multiple-choice' && options && options.length > 0) {
      for (let i = 0; i < options.length; i++) {
        const option = options[i]
        await sql`
          INSERT INTO answer_options (
            question_id, option_text, option_text_fr, option_text_de, is_correct, order_index
          )
          VALUES (
            ${question.id}, ${option.option_text}, ${option.option_text_fr || null}, ${option.option_text_de || null}, ${option.is_correct}, ${i}
          )
        `
      }
    }

    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    )
  }
}
